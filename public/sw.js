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

  // Verifica se a URL corresponde a um handler registrado.
  for (const [path, porta] of handlersPorPorta.entries()) {
    if (url.pathname.startsWith(`/${path}`) || url.href.includes(path)) {
      event.respondWith(simularRespostaHttp(porta, event.request));
      return;
    }
  }
});

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