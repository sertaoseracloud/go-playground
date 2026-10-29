import './estilo.css';
import './caminho.css';
import './cenarios.css';
import './landing.css';
import { lerRota } from './compartilhar.js';
import { iniciarAcessibilidade } from './ui/acessibilidade.js';
import { renderLanding } from './ui/landing.js';
import { iniciarMenu, iniciarFlutuantes } from './ui/menu.js';
import { iniciarRegua, iniciarPausa } from './ui/neuro.js';
import { resumoProgresso } from './ui/inicio.js';
import { criarTelaItem } from './ui/item.js';
import { criarLayout } from './ui/layout.js';
import { $ } from './ui/util.js';
import { HOMOLOGACAO } from './ambiente.js';
import { definirPagina, PRINCIPAL, NOME } from './seo.js';

function init() {
  const acessibilidade = iniciarAcessibilidade();
  if (HOMOLOGACAO) {
    const faixa = $('faixa-homologacao');
    if (faixa) faixa.hidden = false;
  }
  iniciarMenu();
  iniciarFlutuantes();
  iniciarRegua();
  iniciarPausa({ ativo: () => acessibilidade.atuais().lembretePausa });
  const telaInicio = $('tela-inicio');
  const telaItem = $('tela-item');
  const telaLanding = $('tela-landing');
  function mostrarTela(tela) {
    if (!tela) return;
    if (telaInicio && tela !== telaInicio) telaInicio.hidden = true;
    if (telaItem && tela !== telaItem) telaItem.hidden = true;
    if (telaLanding && tela !== telaLanding) telaLanding.hidden = true;
    tela.hidden = false;
  }
  const layout = criarLayout();
  function navegar() {
    document.documentElement.classList.remove('rota-interna');
    const rota = lerRota(location.hash);
    if (rota.tela === 'landing') {
      if (telaLanding) renderLanding(telaLanding);
      mostrarTela(telaLanding || telaInicio);
      definirPagina(PRINCIPAL);
      return;
    }
    mostrarTela(telaInicio);
    definirPagina(PRINCIPAL);
  }
  window.addEventListener('hashchange', () => {
    navegar();
  });
  navegar();
  layout.aplicar();
}

if (typeof document !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else if (typeof document !== 'undefined') {
  init();
}