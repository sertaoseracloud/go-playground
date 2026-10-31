/**
 * Wrapper de rede compatível com o navegador para simulação HTTP/gRPC.
 *
 * Integra os shims existentes (http-shim.js, grpc-web-shim.js) com o service worker
 * já registrado em public/sw.js. Expõe uma API unificada para as ilhas de exercícios
 * do módulo Web iniciarem/pararem servidores simulados.
 *
 * Em produção futura, este módulo será substituído por comunicação direta via
 * postMessage com o SW quando o runtime GopherJS WASM estiver disponível.
 */

import { registrarServidor, desligarServidor, patchGopherJSHttp } from './http-shim.js';
import { registrarServicoGrpc } from './grpc-web-shim.js';
import { registrarServiceWorker, serviceWorkerSuportado } from './service-worker-client.js';

let _swRegistrado = false;
const _servidoresAtivos = new Set();

/**
 * Inicializa a infraestrutura de rede simulada.
 * Registra o service worker (se suportado) e aplica o patch HTTP no runtime GopherJS.
 * @param {number} [moduloNumero=7] - Número do módulo atual (SW só registra para 7+).
 * @returns {Promise<boolean>} true se inicializado com sucesso.
 */
export async function iniciarRedeSimulada(moduloNumero = 7) {
  if (!_swRegistrado && serviceWorkerSuportado()) {
    const reg = await registrarServiceWorker(moduloNumero);
    _swRegistrado = !!reg;
  }

  // Aplica patch para interceptar net/http.ListenAndServe no código compilado
  try {
    patchGopherJSHttp();
  } catch (err) {
    console.warn('[network-browser] Falha ao aplicar patch HTTP:', err);
  }

  return _swRegistrado || !serviceWorkerSuportado();
}

/**
 * Registra um servidor HTTP simulado na porta especificada.
 * @param {number} porta - Porta simulada (1-65535).
 * @param {Function} handler - Função handler(req, res) compatível com net/http.
 */
export function iniciarServidor(porta, handler) {
  registrarServidor(porta, handler);
  _servidoresAtivos.add(porta);
}

/**
 * Desliga um servidor HTTP simulado.
 * @param {number} porta - Porta do servidor a ser desligado.
 */
export function pararServidor(porta) {
  desligarServidor(porta);
  _servidoresAtivos.delete(porta);
}

/**
 * Registra um serviço gRPC-Web simulado.
 * @param {string} nome - Nome do serviço (ex: "helloworld.Greeter").
 * @param {Object} metodos - Objeto com métodos como chaves e handlers como valores.
 */
export function iniciarServicoGrpc(nome, metodos) {
  registrarServicoGrpc(nome, metodos);
}

/**
 * Retorna as portas dos servidores atualmente ativos.
 * @returns {number[]}
 */
export function servidoresAtivos() {
  return Array.from(_servidoresAtivos);
}

/**
 * Limpa todos os servidores ativos (para uso em testes ou reset de exercício).
 */
export function limparServidores() {
  for (const porta of _servidoresAtivos) {
    try {
      desligarServidor(porta);
    } catch (_) {
      // ignora erros de cleanup
    }
  }
  _servidoresAtivos.clear();
}