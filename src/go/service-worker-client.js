/**
 * Cliente de registro do Service Worker.
 *
 * Registra o Service Worker apenas para módulos 7+ (HTTP simulation),
 * evitando overhead desnecessário em módulos anteriores.
 */

let _registrado = false;

/**
 * Verifica se o navegador suporta Service Workers.
 * @returns {boolean}
 */
export function serviceWorkerSuportado() {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

/**
 * Registra o Service Worker public/sw.js de forma lazy.
 * Só registra uma vez por sessão.
 * @returns {Promise<ServiceWorkerRegistration | null>}
 */
export async function registrarServiceWorker() {
  if (_registrado) return null;
  if (!serviceWorkerSuportado()) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    _registrado = true;
    return registration;
  } catch (err) {
    console.warn('[service-worker-client] Falha ao registrar SW:', err);
    return null;
  }
}

/** Reseta o estado interno (apenas para testes). */
export function _resetRegistro() {
  _registrado = false;
}