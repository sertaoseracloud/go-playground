import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('index.html', () => {
  const html = readFileSync('index.html', 'utf8');
  it('contains faixa-homologacao element', () => {
    expect(html).toContain('id="faixa-homologacao"');
    expect(html).toContain('class="faixa-homologacao"');
  });
  it('contains .faixa-homologacao CSS rules', () => {
    const css = readFileSync('src/estilo.css', 'utf8');
    expect(css).toContain('.faixa-homologacao');
  });
});