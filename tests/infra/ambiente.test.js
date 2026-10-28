import { describe, it, expect } from 'vitest';
import { configurarAmbiente } from '../../src/ambiente.js';

describe('configurarAmbiente', () => {
  it('returns principal config when homologacao is false', () => {
    const env = configurarAmbiente(false);
    expect(env.prefixo).toBe('go-playground:');
    expect(env.homologacao).toBe(false);
    expect(env.site).toContain('go-playground');
  });
  it('returns homologacao config when true', () => {
    const env = configurarAmbiente(true);
    expect(env.prefixo).toBe('go-playground-homologacao:');
    expect(env.homologacao).toBe(true);
  });
});