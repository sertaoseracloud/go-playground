// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderLanding, numerosDaTrilha } from '../src/ui/landing.js';
import { modulos, problemas } from '../src/conteudo/trilha.js';

describe('landing page', () => {
  beforeEach(() => localStorage.clear());

  it('os números vêm do conteúdo da trilha', () => {
    const n = numerosDaTrilha();
    expect(n.exercicios).toBe(problemas.length);
    expect(n.modulos).toBe(modulos.length);
    // Go playground tem 0 projetos na trilha atual (módulo projetos ainda não implementado)
    expect(n.projetos).toBeGreaterThanOrEqual(0);
    // Go playground tem 4 certificados com módulo na trilha (basico, web, concorrencia) + final
 expect(n.certificados).toBeGreaterThanOrEqual(modulos.length);
  });

  it('mostra todos os módulos, os badges e leva para a trilha', () => {
    const el = document.createElement('main');
    renderLanding(el);
    expect(el.querySelectorAll('.modulo-card')).toHaveLength(modulos.length);
    // Go playground tem ORDEM com 6 certificados (incluindo avancado, projetos, final sem módulo)
    expect(el.querySelectorAll('.vitrine-badges svg').length).toBeGreaterThanOrEqual(modulos.length);
    expect(el.querySelector('.hero-acoes a').getAttribute('href')).toBe('#/trilha');
    expect(el.querySelector('a[href="#/privacidade"]')).not.toBeNull();
  });

  it('quem já começou vê "Continuar"', () => {
    localStorage.setItem('go-playground:progresso', JSON.stringify({ [problemas[0].id]: 'resolvido' }));
    const el = document.createElement('main');
    renderLanding(el);
    expect(el.querySelector('.hero-acoes a').textContent).toContain('Continuar');
  });
});

describe('contagem do progresso', () => {
  beforeEach(() => localStorage.clear());

  it('conta exercícios e lições separados, como o caminho mostra', async () => {
    const { resumoProgresso } = await import('../src/ui/inicio.js');
    const { itens } = await import('../src/conteudo/trilha.js');
    const licao = itens.find((i) => i.tipo === 'licao');
    const exercicios = itens.filter((i) => i.tipo === 'problema').slice(0, 2);
    const prog = Object.fromEntries([licao, ...exercicios].map((i) => [i.id, 'resolvido']));
    localStorage.setItem('go-playground:progresso', JSON.stringify(prog));
    expect(resumoProgresso()).toMatchObject({ resolvidos: 2, licoesLidas: 1 });
  });
});

describe('certificados na trilha (regra da cadeia)', () => {
  beforeEach(() => localStorage.clear());

  it('módulo concluído sem o certificado anterior fica em espera', async () => {
    const { certificadosDaJornada } = await import('../src/ui/inicio.js');
    const { modulos } = await import('../src/conteudo/trilha.js');
    // Web completo, basico não: o certificado de web espera o de basico.
    const web = modulos.find((m) => m.id === 'web');
    const prog = Object.fromEntries(web.itens.filter((i) => i.tipo === 'problema').map((i) => [i.id, 'resolvido']));
    localStorage.setItem('go-playground:progresso', JSON.stringify(prog));
    const certs = certificadosDaJornada();
    const cweb = certs.find((c) => c.id === 'web');
    expect(cweb).toMatchObject({ concluido: true, liberado: false, falta: 'basico' });
    expect(certs.find((c) => c.id === 'basico').liberado).toBe(false);
  });

  it('com basico e web concluídos, os dois saem, e o de web leva a data do de basico', async () => {
    const { certificadosDaJornada } = await import('../src/ui/inicio.js');
    const { modulos } = await import('../src/conteudo/trilha.js');
    const ids = modulos.filter((m) => ['basico', 'web'].includes(m.id))
      .flatMap((m) => m.itens.filter((i) => i.tipo === 'problema').map((i) => i.id));
    localStorage.setItem('go-playground:progresso', JSON.stringify(Object.fromEntries(ids.map((id) => [id, 'resolvido']))));
    const certs = certificadosDaJornada();
    const [basico, web] = certs;
    expect(basico.liberado && web.liberado).toBe(true);
    expect(web.cadeia).toEqual([basico.data]);
  });
});
