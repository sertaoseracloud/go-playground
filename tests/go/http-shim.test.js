import { describe, it, expect } from 'vitest';
import { registrarServidor, desligarServidor } from '../../src/go/http-shim.js';

describe('http-shim', () => {
  it('registers and unregisters server on port', () => {
    const handler = () => {};
    registrarServidor(8080, handler);
    // Internal state check
    expect(registrarServidor._registrados?.has(8080)).toBe(true);
    desligarServidor(8080);
    expect(registrarServidor._registrados?.has(8080)).toBe(false);
  });
});