/**
 * HTTP Shim para Service Worker — simula net/http no navegador.
 *
 * Mantém um registro interno de servidores (porta → handler) e expõe
 * esse registro ao Service Worker via postMessage. O GopherJS-compiled
 * net/http.ListenAndServe deve chamar registrarServidor em vez de fazer
 * bind TCP real.
 */

import { PREFIXO_ARMAZENAMENTO } from '../ambiente.js';

/** @type {Map<number, Function>} */
const _registrados = new Map();

/**
 * Registra um handler para uma porta simulada.
 * @param {number} porta
 * @param {Function} handler
 */
export function registrarServidor(porta, handler) {
  if (typeof porta !== 'number' || porta < 1 || porta > 65535) {
    throw new Error(`Porta inválida: ${porta}`);
  }
  if (typeof handler !== 'function') {
    throw new Error('Handler deve ser uma função');
  }
  _registrados.set(porta, handler);
  _sincronizarComSW();
}

/**
 * Remove o registro de um servidor por porta.
 * @param {number} porta
 */
export function desligarServidor(porta) {
  _registrados.delete(porta);
  _sincronizarComSW();
}

/** Envia o registry atualizado para o Service Worker via postMessage. */
function _sincronizarComSW() {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;

  const registry = {};
  for (const [porta] of _registrados) {
    registry[porta] = true;
  }

  navigator.serviceWorker.ready.then((registration) => {
    registration.active?.postMessage({
      tipo: 'REGISTRY_ATUALIZADO',
      prefixo: PREFIXO_ARMAZENAMENTO,
      registry,
    });
  }).catch(() => {
    // SW pode não estar pronto ainda; ignora silenciosamente.
  });
}

/** Expõe o mapa interno apenas para testes. */
registrarServidor._registrados = _registrados;

/**
 * Patch para GopherJS: substitui net/http.ListenAndServe.
 * Quando o código Go compilado chama ListenAndServe, redireciona
 * para registrarServidor em vez de tentar bind TCP.
 * Idempotente: só patcheia uma vez.
 */
let _patched = false;
export function patchGopherJSHttp() {
  if (_patched) return;
  if (typeof window === 'undefined') return;

  // Intercepta chamadas a $externalize que o GopherJS usa para net/http.
  const originalExternalize = window.$externalize;
  if (originalExternalize) {
    window.$externalize = function(jsVal, goType) {
      if (goType && goType.string === '*http.Server') {
        // Retorna um objeto shim que intercepta ListenAndServe.
        return {
          ListenAndServe: function(addr, handler) {
            const porta = parseInt(addr.split(':').pop(), 10);
            registrarServidor(porta, handler);
            return null; // Simula sucesso sem bloquear.
          },
        };
      }
      return originalExternalize(jsVal, goType);
    };
    _patched = true;
  }
}