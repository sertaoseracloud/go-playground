/** @vitest-environment happy-dom */
import { describe, it, expect, beforeEach } from 'vitest';

describe('Mais ações dropdown menu', () => {
  let btnMaisAcoes;
  let menuMaisAcoes;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="acoes">
        <button id="btn-executar">▶ Run</button>
        <button id="btn-enviar">⬆ Enviar</button>
        <div class="mais-acoes">
          <button type="button" id="btn-mais-acoes" class="btn btn-fantasma"
            aria-expanded="false" aria-controls="menu-mais-acoes">⋯ Mais ações</button>
          <div id="menu-mais-acoes" class="menu-mais-acoes" hidden>
            <button id="btn-restaurar" class="btn btn-fantasma">
              <span aria-hidden="true">↺</span> Restaurar</button>
            <button id="btn-compartilhar" class="btn btn-fantasma">
              <span aria-hidden="true">🔗</span> Compartilhar</button>
          </div>
        </div>
      </div>
    `;
    btnMaisAcoes = document.getElementById('btn-mais-acoes');
    menuMaisAcoes = document.getElementById('menu-mais-acoes');

    btnMaisAcoes.onclick = () => {
      const aberto = menuMaisAcoes.hidden;
      menuMaisAcoes.hidden = !aberto;
      btnMaisAcoes.setAttribute('aria-expanded', String(aberto));
    };

    menuMaisAcoes.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menuMaisAcoes.hidden = true;
        btnMaisAcoes.setAttribute('aria-expanded', 'false');
        btnMaisAcoes.focus();
      }
    });
  });

  it('toggles menu visibility and aria-expanded on click', () => {
    expect(menuMaisAcoes.hidden).toBe(true);
    expect(btnMaisAcoes.getAttribute('aria-expanded')).toBe('false');

    btnMaisAcoes.click();
    expect(menuMaisAcoes.hidden).toBe(false);
    expect(btnMaisAcoes.getAttribute('aria-expanded')).toBe('true');

    btnMaisAcoes.click();
    expect(menuMaisAcoes.hidden).toBe(true);
    expect(btnMaisAcoes.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes menu and returns focus on Escape', () => {
    btnMaisAcoes.click();
    expect(menuMaisAcoes.hidden).toBe(false);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    menuMaisAcoes.dispatchEvent(event);

    expect(menuMaisAcoes.hidden).toBe(true);
    expect(btnMaisAcoes.getAttribute('aria-expanded')).toBe('false');
  });
});