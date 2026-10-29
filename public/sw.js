/**
 * Service Worker para simulação HTTP no DivergeGo.
 *
 * Intercepta fetch requests destinados a portas simuladas e roteia
 * para os handlers registrados via postMessage com o main thread.
 */

const PREFIXO_PADRAO = 'go-playground:';

/** @type {Map<string, number>} Mapeia URLs de handler para portas registradas. */
const handlersPorPorta = new Map();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * Recebe mensagens do main thread com atualizações do registry.
 */
self.addEventListener('message', (event) => {
  const { data } = event;
  if (data && data.tipo === 'REGISTRY_ATUALIZADO') {
    const { registry, prefixo } = data;
    const prefixoEfetivo = prefixo || PREFIXO_PADRAO;

    // Limpa handlers antigos e reconstrói.
    handlersPorPorta.clear();

    for (const [portaStr] of Object.entries(registry)) {
      const porta = Number(portaStr);
      if (!isNaN(porta)) {
        handlersPorPorta.set(`${prefixoEfetivo}port/${porta}`, porta);
      }
    }
  }
});

/**
 * Intercepta fetch requests e roteia para handlers simulados.
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const contentType = event.request.headers.get('content-type') || '';

  // Detecta gRPC-Web pelo content-type.
  if (contentType.includes('application/grpc-web')) {
    event.respondWith(traduzirGrpcWeb(event.request));
    return;
  }

  // Verifica se a URL corresponde a um handler registrado.
  for (const [path, porta] of handlersPorPorta.entries()) {
    if (url.pathname.startsWith(`/${path}`) || url.href.includes(path)) {
      event.respondWith(simularRespostaHttp(porta, event.request));
      return;
    }
  }
});

/**
 * Traduz uma requisição gRPC-Web e retorna resposta formatada.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function traduzirGrpcWeb(request) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

  if (clients.length === 0) {
    return criarRespostaGrpcWebErro('Nenhum cliente ativo');
  }

  // Extrai o corpo da requisição.
  const body = await request.arrayBuffer();
  const buffer = new Uint8Array(body);

  // Parse do frame gRPC-Web: compression-flag (1 byte) + length (4 bytes big-endian) + payload
  if (buffer.length < 5) {
    return criarRespostaGrpcWebErro('Frame gRPC-Web inválido');
  }

  const compressionFlag = buffer[0];
  const length = (buffer[1] << 24) | (buffer[2] << 16) | (buffer[3] << 8) | buffer[4];

  if (buffer.length < 5 + length) {
    return criarRespostaGrpcWebErro('Frame incompleto');
  }

  const payload = buffer.slice(5, 5 + length);
  const messageText = new TextDecoder().decode(payload);

  // Envia para o main thread processar.
  const client = clients[0];
  const messageId = `sw-grpc-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return new Promise((resolve) => {
    const messageHandler = (event) => {
      if (event.data && event.data.messageId === messageId) {
        self.removeEventListener('message', messageHandler);
        const { statusCode, body: responseBody } = event.data;

        // Cria frame de resposta gRPC-Web.
        const responsePayload = new TextEncoder().encode(responseBody || '');
        const responseFrame = new Uint8Array(5 + responsePayload.length);
        responseFrame[0] = 0; // sem compressão
        responseFrame[1] = (responsePayload.length >> 24) & 0xFF;
        responseFrame[2] = (responsePayload.length >> 16) & 0xFF;
        responseFrame[3] = (responsePayload.length >> 8) & 0xFF;
        responseFrame[4] = responsePayload.length & 0xFF;
        responseFrame.set(responsePayload, 5);

        resolve(
          new Response(responseFrame, {
            status: statusCode || 200,
            headers: { 'Content-Type': 'application/grpc-web' },
          })
        );
      }
    };

    self.addEventListener('message', messageHandler);

    client.postMessage({
      tipo: 'EXECUTAR_HANDLER_GRPC',
      requestData: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        body: messageText,
      },
      messageId,
    });

    setTimeout(() => {
      self.removeEventListener('message', messageHandler);
      resolve(criarRespostaGrpcWebErro('Timeout do handler'));
    }, 5000);
  });
}

/**
 * Cria uma resposta de erro gRPC-Web.
 * @param {string} mensagem
 * @returns {Response}
 */
function criarRespostaGrpcWebErro(mensagem) {
  const errorPayload = new TextEncoder().encode(mensagem);
  const frame = new Uint8Array(5 + errorPayload.length);
  frame[0] = 0;
  frame[1] = (errorPayload.length >> 24) & 0xFF;
  frame[2] = (errorPayload.length >> 16) & 0xFF;
  frame[3] = (errorPayload.length >> 8) & 0xFF;
  frame[4] = errorPayload.length & 0xFF;
  frame.set(errorPayload, 5);

  return new Response(frame, {
    status: 500,
    headers: { 'Content-Type': 'application/grpc-web' },
  });
}

/**
 * Simula uma resposta HTTP chamando o handler registrado.
 * @param {number} porta
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function simularRespostaHttp(porta, request) {
  // Envia mensagem para o main thread executar o handler.
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

  if (clients.length === 0) {
    return new Response(JSON.stringify({ error: 'Nenhum cliente ativo' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Prepara a requisição para enviar ao handler.
  const requestData = {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
  };

  // Envia para o primeiro cliente disponível.
  const client = clients[0];
  const messageId = `sw-http-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return new Promise((resolve) => {
    // Listener temporário para receber a resposta do handler.
    const messageHandler = (event) => {
      if (event.data && event.data.messageId === messageId) {
        self.removeEventListener('message', messageHandler);
        const { statusCode, headers, body } = event.data;
        resolve(
          new Response(body, {
            status: statusCode || 200,
            headers: headers || { 'Content-Type': 'text/plain' },
          })
        );
      }
    };

    self.addEventListener('message', messageHandler);

    // Envia a requisição para o main thread processar.
    client.postMessage({
      tipo: 'EXECUTAR_HANDLER_HTTP',
      porta,
      requestData,
      messageId,
    });

    // Timeout de segurança.
    setTimeout(() => {
      self.removeEventListener('message', messageHandler);
      resolve(
        new Response(JSON.stringify({ error: 'Timeout do handler' }), {
          status: 504,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }, 5000);
  });
}