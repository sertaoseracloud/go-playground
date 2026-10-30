// Landing page (#/): apresenta o projeto e leva para a trilha (#/trilha).
import { modulos } from '../conteudo/trilha.js';
import { esc } from './util.js';

export function renderLanding(el) {
  el.innerHTML = `
    <div class="landing">
      <section class="hero" aria-labelledby="landing-titulo">
        <h1 id="landing-titulo">Aprenda <span class="destaque">Go</span> do zero, com acessibilidade para todas as pessoas</h1>
        <p class="hero-sub">Uma trilha gamificada: sintaxe, concorrência, APIs e projetos.
          Você escreve o código, roda e vê os testes na hora. Sem instalar nada.</p>
        <div class="hero-acoes">
          <a class="btn btn-verde btn-grande" href="#/trilha">🚀 Começar a trilha</a>
          <a class="btn btn-fantasma btn-grande" href="#/livre">🧪 Playground livre</a>
        </div>
        <ul class="hero-numeros" aria-label="A trilha em números">
          <li><b>${modulos.length}</b> módulos</li>
        </ul>
      </section>
      <section class="faixa" aria-labelledby="modulos-titulo">
        <h2 id="modulos-titulo">Módulos</h2>
        <ol class="modulos-landing">
          ${modulos.map((m) => `
            <li class="modulo-card" data-modulo="${m.id}">
              <span class="modulo-icone" aria-hidden="true">${m.icone}</span>
              <h3>${esc(m.titulo)}</h3>
              <p>${esc(m.descricao)}</p>
            </li>`).join('')}
        </ol>
      </section>
    </div>`;
}