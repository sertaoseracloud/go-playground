/** @vitest-environment happy-dom */
import { describe, it, expect, beforeEach } from 'vitest';

describe('main.js', () => {
  beforeEach(() => {
    // Criar elementos DOM mínimos que main.js e módulos UI esperam
    document.body.innerHTML = `
      <div id="faixa-homologacao" hidden></div>
      <div id="anuncio" role="status" aria-live="polite"></div>
      <header class="topo">
        <button type="button" id="btn-menu" aria-expanded="false" aria-controls="menu-topo"><span>☰</span></button>
        <div id="menu-topo" class="menu-topo"></div>
        <span id="progresso-topo"></span>
        <span id="status"></span>
      </header>
      <div id="conteudo">
        <main id="tela-landing"></main>
        <main id="tela-inicio" hidden></main>
        <main id="tela-item" hidden></main>
      </div>
      <div id="flutuantes">
        <button id="btn-flutuantes"><span>⚙️</span></button>
        <div id="flutuantes-itens" hidden></div>
      </div>
      <dialog id="dialogo-nome"><input id="campo-nome"><button id="btn-cancelar-nome"></button></dialog>
      <dialog id="dialogo-a11y"></dialog>
      <button id="btn-acessibilidade"></button>
      <div id="a11y-temas"></div>
      <div id="a11y-opcoes"></div>
      <div id="a11y-perfis"></div>
      <span id="a11y-tamanho"></span>
      <button id="a11y-menor"></button>
      <button id="a11y-maior"></button>
      <button id="a11y-padrao"></button>
      <div id="lembrete-pausa" hidden></div>
    `;
  });

  it('imports without errors', async () => {
    const mod = await import('../../src/main.js');
    expect(mod).toBeDefined();
  });
});