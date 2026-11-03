import { describe, expect, it } from 'vitest';
import { configurarAmbiente, HOMOLOGACAO, PREFIXO_ARMAZENAMENTO, SITE_ATUAL } from '../src/ambiente.js';

describe('ambientes', () => {
  it('mantém produção e homologação com armazenamento e URL separados', () => {
    expect(configurarAmbiente(false)).toEqual({
      homologacao: false,
      prefixo: 'go-playground:',
      site: 'https://sertaoseracloud.github.io/go-playground/',
    });
    expect(configurarAmbiente(true)).toEqual({
      homologacao: true,
      prefixo: 'go-playground-homologacao:',
      site: 'https://sertaoseracloud.github.io/go-playground/homologacao/',
    });
  });

  it('os testes usam o ambiente principal', () => {
    expect(HOMOLOGACAO).toBe(false);
    expect(PREFIXO_ARMAZENAMENTO).toBe('go-playground:');
    expect(SITE_ATUAL).toBe('https://sertaoseracloud.github.io/go-playground/');
  });
});
