/** @vitest-environment happy-dom */
import { describe, it, expect, beforeEach } from 'vitest';

describe('main.js', () => {
  beforeEach(() => {
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
        <main id="tela-item" hidden>
          <button id="item-anterior"></button>
          <button id="item-proximo"></button>
          <span id="item-modulo"></span>
          <h1 id="item-titulo"></h1>
          <span id="item-dificuldade"></span>
          <span id="item-status"></span>
          <div id="editor"></div>
          <div id="abas-arquivos"></div>
          <div id="saida-terminal"></div>
          <div id="terminal"></div>
          <div id="campo-terminal"></div>
          <button id="btn-executar"></button>
          <button id="btn-enviar"></button>
          <button id="btn-restaurar"></button>
          <button id="btn-compartilhar"></button>
          <button id="btn-ouvir"></button>
          <button id="aba-solucao"></button>
          <button id="aba-testes"></button>
          <div id="resumo-testes"></div>
          <div id="desc-enunciado"></div>
          <div id="desc-solucao"></div>
          <div id="desc-testes"></div>
          <div id="resultado"></div>
          <pre id="saida-fonte"></pre>
          <div id="saida-testes"></div>
          <div id="erros"></div>
          <div id="leitura-status"></div>
          <div id="aviso-solucao"></div>
        </main>
        <main id="tela-certificado" hidden></main>
        <main id="tela-privacidade" hidden></main>
        <main id="tela-validador" hidden></main>
        <main id="tela-licenca" hidden></main>
        <main id="tela-termos" hidden></main>
        <main id="tela-novidades" hidden></main>
        <main id="tela-instrutor" hidden></main>
        <main id="tela-acessibilidade" hidden></main>
        <main id="tela-nao-encontrada" hidden></main>
      </div>
      <div id="flutuantes">
        <button id="btn-flutuantes"><span>⚙️</span></button>
        <div id="flutuantes-itens" hidden></div>
      </div>
      <dialog id="dialogo-nome"><input id="campo-nome"><button id="btn-cancelar-nome"></button></dialog>
      <dialog id="dialogo-a11y"></dialog>
      <dialog id="dialogo-apoio">
        <div id="mural-apoio-conteudo"></div>
        <button id="btn-fechar-mural-apoio"></button>
      </dialog>
      <dialog id="tutorial">
        <span id="tutorial-passo"></span>
        <h2 id="tutorial-titulo"></h2>
        <p id="tutorial-texto"></p>
        <div id="tutorial-pontos"></div>
        <button id="tutorial-voltar"></button>
        <button id="tutorial-avancar"></button>
        <button id="tutorial-pular"></button>
      </dialog>
      <button id="btn-tutorial"></button>
      <button id="btn-acessibilidade"></button>
      <div id="a11y-temas"></div>
      <div id="a11y-opcoes"></div>
      <div id="a11y-perfis"></div>
      <span id="a11y-tamanho"></span>
      <button id="a11y-menor"></button>
      <button id="a11y-maior"></button>
      <button id="a11y-padrao"></button>
      <div id="lembrete-pausa" hidden></div>
      <div id="aviso-privacidade" hidden></div>
      <a class="pular" href="#conteudo">Pular para o conteúdo</a>
    `;
  });

  it('imports without errors', async () => {
    const mod = await import('../../src/main.js');
    expect(mod).toBeDefined();
  });
});