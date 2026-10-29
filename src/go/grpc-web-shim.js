/**
 * gRPC-Web Shim para Service Worker — traduz frames gRPC-Web.
 *
 * gRPC-Web usa HTTP/1.1 com content-type `application/grpc-web`.
 * O formato do frame é: compression-flag (1 byte) + length (4 bytes big-endian) + message payload.
 */

/** @type {Map<string, Function>} Mapeia "servico/metodo" para handlers registrados. */
const _servicosGrpc = new Map();

/**
 * Registra um serviço gRPC com seus métodos.
 * @param {string} nome - Nome do serviço (ex: "helloworld.Greeter")
 * @param {Object} metodos - Objeto com nomes de métodos como chaves e handlers como valores
 */
export function registrarServicoGrpc(nome, metodos) {
  if (typeof nome !== 'string' || !nome) {
    throw new Error('Nome do serviço deve ser uma string não vazia');
  }
  if (typeof metodos !== 'object' || metodos === null) {
    throw new Error('Métodos deve ser um objeto');
  }

  for (const [metodoNome, handler] of Object.entries(metodos)) {
    const chave = `${nome}/${metodoNome}`;
    if (typeof handler !== 'function') {
      throw new Error(`Handler para ${chave} deve ser uma função`);
    }
    _servicosGrpc.set(chave, handler);
  }
}

/**
 * Traduz um frame gRPC-Web buffer para extrair a mensagem.
 * Formato: compression-flag (1 byte) + length (4 bytes big-endian) + payload
 * @param {Uint8Array|Buffer} buffer - Frame gRPC-Web completo
 * @returns {Uint8Array} Payload da mensagem
 */
export function traduzirFrameGrpcWeb(buffer) {
  if (!buffer || buffer.length < 5) {
    throw new Error('Frame gRPC-Web inválido: mínimo 5 bytes requeridos');
  }

  // Byte 0: compression flag (0 = não comprimido, 1 = comprimido)
  const compressionFlag = buffer[0];

  // Bytes 1-4: length em big-endian (4 bytes)
  const length = (buffer[1] << 24) | (buffer[2] << 16) | (buffer[3] << 8) | buffer[4];

  // Valida que temos dados suficientes
  if (buffer.length < 5 + length) {
    throw new Error(`Frame incompleto: esperado ${5 + length} bytes, recebido ${buffer.length}`);
  }

  // Extrai o payload (após os 5 bytes de header)
  return buffer.slice(5, 5 + length);
}

/**
 * Cria um frame gRPC-Web a partir de uma mensagem.
 * @param {Uint8Array|Buffer} message - Mensagem a ser encapsulada
 * @param {number} compressionFlag - Flag de compressão (0 ou 1)
 * @returns {Uint8Array} Frame gRPC-Web completo
 */
export function criarFrameGrpcWeb(message, compressionFlag = 0) {
  const length = message.length;
  const frame = new Uint8Array(5 + length);

  // Byte 0: compression flag
  frame[0] = compressionFlag;

  // Bytes 1-4: length em big-endian
  frame[1] = (length >> 24) & 0xFF;
  frame[2] = (length >> 16) & 0xFF;
  frame[3] = (length >> 8) & 0xFF;
  frame[4] = length & 0xFF;

  // Copia o payload
  frame.set(message, 5);

  return frame;
}

/**
 * Busca um handler registrado para um serviço/método.
 * @param {string} servico - Nome do serviço
 * @param {string} metodo - Nome do método
 * @returns {Function|undefined} Handler registrado ou undefined
 */
export function buscarHandlerGrpc(servico, metodo) {
  const chave = `${servico}/${metodo}`;
  return _servicosGrpc.get(chave);
}

/** Expõe o mapa interno apenas para testes. */
registrarServicoGrpc._servicos = _servicosGrpc;