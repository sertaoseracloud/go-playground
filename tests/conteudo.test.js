// Contrato do conteúdo da trilha (mesmo formato do python-playground).
// A execução das soluções com o Go real fica em `npm run validar:exercicios`
// (precisa do Go instalado e leva alguns minutos, por isso não roda no vitest).
import { describe, it, expect } from 'vitest';
import { modulos, itens, problemas, LIVRE, DIFICULDADES } from '../src/conteudo/trilha.js';
import { normalizarTestes } from '../src/conteudo/util.js';

describe('estrutura da trilha', () => {
  it('tem mais de 300 exercícios', () => {
    expect(problemas.length).toBeGreaterThan(300);
  });

  it.each([['basico', 50], ['estruturas', 40], ['bancos', 50], ['nuvem', 40], ['arquitetura', 40], ['web', 45], ['concorrencia', 40]])(
    'o módulo %s tem pelo menos %i exercícios',
    (id, minimo) => {
      const m = modulos.find((x) => x.id === id);
      expect(m.itens.filter((i) => i.tipo === 'problema').length).toBeGreaterThanOrEqual(minimo);
    },
  );

  it('ids únicos na trilha toda', () => {
    const ids = [...itens, LIVRE].map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(problemas.map((p) => [p.id, p]))('%s tem os campos e casos visíveis e ocultos', (_id, p) => {
    expect(p.titulo).toBeTruthy();
    expect(Object.keys(DIFICULDADES)).toContain(p.dificuldade);
    expect(p.enunciado).toContain('<');
    expect(p.dica).toBeTruthy();
    expect(p.arquivos['main.go']).toMatch(/^package main/m);
    expect(p.solucao['main.go']).toMatch(/^package main/m);
    expect(p.arquivos['main.go']).not.toBe(p.solucao['main.go']);
    expect(p.testes.some((t) => !t.oculto)).toBe(true);
    expect(p.testes.some((t) => t.oculto)).toBe(true);
    for (const t of p.testes) expect(t.regras?.length, `caso "${t.descricao}" sem regras`).toBeGreaterThan(0);
  });

  it('nenhum código Go tem quebra de linha dentro de string (escape \\n cozido pela tag go``)', () => {
    const quebrados = problemas.filter((p) =>
      [...Object.values(p.arquivos), ...Object.values(p.solucao)].some((c) => /fmt\.\w*\("[^"\n]*\n/.test(c)));
    expect(quebrados.map((p) => p.id)).toEqual([]);
  });
});

describe('normalizarTestes', () => {
  it('converte { saida } em regras saidaIgual + semErros e cria um caso oculto', () => {
    const casos = normalizarTestes([{ saida: 'ok' }]);
    expect(casos).toEqual([
      { descricao: 'saída', saida: 'ok', regras: [{ saidaIgual: 'ok' }, { semErros: true }] },
      { descricao: 'nada a mais', oculto: true, saida: 'ok', regras: [{ saidaIgual: 'ok' }] },
    ]);
  });

  it('mantém casos que já têm regras e não duplica o oculto', () => {
    const casos = normalizarTestes([{ regras: [{ contem: 'x' }] }, { oculto: true, saida: 'y' }]);
    expect(casos).toHaveLength(2);
    expect(casos[0]).toEqual({ regras: [{ contem: 'x' }] });
    expect(casos[1].regras).toEqual([{ saidaIgual: 'y' }, { semErros: true }]);
  });
});
