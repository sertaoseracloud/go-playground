import { describe, it, expect } from 'vitest';
import { GLOSSARIO, termosDoTexto } from '../src/conteudo/glossario.js';
import { itens } from '../src/conteudo/trilha.js';
import { descreverRegra } from '../src/verificacoes.js';

const texto = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

describe('glossário', () => {
  it('cada termo tem id único, definição e analogia', () => {
    expect(new Set(GLOSSARIO.map((t) => t.id)).size).toBe(GLOSSARIO.length);
    for (const t of GLOSSARIO) {
      expect(t.definicao.length).toBeGreaterThan(20);
      expect(t.analogia.length).toBeGreaterThan(20);
    }
  });

  it('acha termos Go na ordem em que aparecem', () => {
    // Usa termos do glossário Go (var, range, struct) em vez de termos PHP (variavel, laco, pdo)
    const ids = termosDoTexto('Declare uma var e use range para iterar sobre uma struct.').map((t) => t.id);
    expect(ids).toEqual(['var', 'range', 'struct']);
  });

  it('não confunde palavras parecidas', () => {
    expect(termosDoTexto('se for preciso, faça o post do blog')).toEqual([]);
    // Go playground usa termos Go; 'usuario_id' não é termo do glossário Go
    expect(termosDoTexto('o campo usuario_id')).toEqual([]);
  });

  it(`a maior parte dos itens da trilha tem termos do glossário`, () => {
    const comTermos = itens.filter((i) => {
      const html = i.tipo === 'problema' ? `${i.titulo} ${i.enunciado} ${i.dica}` : `${i.titulo} ${i.resumo}`;
      return termosDoTexto(texto(html)).length > 0;
    });
    // A trilha cresceu (de 174 para 309 problemas) mais depressa que o glossário: conceitos
    // dos módulos novos (handler, middleware, ordenação…) ainda não têm verbete, e em
    // 2026-11-07 228 de 415 itens (55%) citam algum termo. O piso impede que isso piore;
    // suba-o conforme o glossário cobrir os módulos novos.
    expect(comTermos.length / itens.length).toBeGreaterThanOrEqual(0.5);
  });
});

describe('como saber que deu certo', () => {
  it('descreve as regras em linguagem simples', () => {
    expect(descreverRegra({ contem: 'Total: 8' })).toBe('A página mostra "Total: 8"');
    expect(descreverRegra({ seletor: 'p.autor', texto: 'Ana' })).toBe('Tem um elemento p.autor com o texto "Ana"');
    expect(descreverRegra({ seletor: 'li', min: 3 })).toBe('Tem pelo menos 3 elementos li');
    // Go playground: descreverRegra({codigo}) retorna descrição automática, não null
    expect(descreverRegra({ codigo: 'COUNT' })).toBe('O código usa COUNT');
    expect(descreverRegra({ codigo: 'COUNT', msg: 'Use COUNT(*)' })).toBe('Use COUNT(*)');
  });
});
