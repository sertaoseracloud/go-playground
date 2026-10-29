// Controla a posição do código e do terminal: modo (auto/lado/empilhado),
// divisor arrastável e descrição que pode ser ocultada. A escolha fica salva.
import { escolherModo, montarGrade } from './layout-calculo.js';
import { lerPreferencia, gravarPreferencia } from '../progresso.js';
import { $ } from './util.js';

const PADRAO = { modo: 'auto', divisao: 50, descricao: true };
const MIN = 20;
const MAX = 80;

export function criarLayout() {
  const area = $('area');
  const divisor = $('divisor');
  const descricao = $('painel-descricao');
  const btnDescricao = $('btn-descricao');

  const prefs = { ...PADRAO, ...lerPreferencia('layout', {}) };
  delete prefs.testesRecolhidos;
  let modoAtual = 'lado';

  const salvar = () => gravarPreferencia('layout', prefs);

  function aplicar() {
    if (!area || !divisor || !btnDescricao) return;
    const largura = window.innerWidth;
    modoAtual = window.innerWidth < 900 ? 'celular' : prefs.modo === 'auto' ? escolherModo({ largura, descricao: prefs.descricao }) : prefs.modo;
    const grade = montarGrade({ modo: modoAtual, largura, descricao: prefs.descricao, divisao: prefs.divisao });
    area.style.gridTemplateColumns = grade.colunas;
    area.style.gridTemplateRows = grade.linhas;
    area.style.gridTemplateAreas = grade.areas;
    area.dataset.modo = modoAtual;

    if (descricao) descricao.hidden = !prefs.descricao;
    divisor.setAttribute('aria-orientation', modoAtual === 'lado' ? 'vertical' : 'horizontal');
    divisor.setAttribute('aria-valuenow', String(Math.round(prefs.divisao)));
    divisor.hidden = modoAtual === 'celular';

    document.querySelectorAll('[data-layout]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.layout === prefs.modo)));
    btnDescricao.setAttribute('aria-pressed', String(prefs.descricao));
    btnDescricao.setAttribute('aria-label', prefs.descricao ? 'Ocultar descrição' : 'Mostrar descrição');
  }

  document.querySelectorAll('[data-layout]').forEach((b) => {
    b.onclick = () => {
      prefs.modo = b.dataset.layout;
      salvar();
      aplicar();
    };
  });
  if (btnDescricao) {
    btnDescricao.onclick = () => {
      prefs.descricao = !prefs.descricao;
      salvar();
      aplicar();
    };
  }

  function definirDivisao(valor) {
    prefs.divisao = Math.min(MAX, Math.max(MIN, valor));
    aplicar();
  }

  if (divisor) {
    divisor.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      divisor.setPointerCapture(e.pointerId);
      if (area) area.classList.add('arrastando');
      const codigoEl = area?.querySelector('.painel-codigo');
      const previewEl = area?.querySelector('.painel-preview');
      if (!codigoEl || !previewEl) return;
      const codigo = codigoEl.getBoundingClientRect();
      const preview = previewEl.getBoundingClientRect();
      const mover = (ev) => {
        const pct = modoAtual === 'lado'
          ? ((ev.clientX - codigo.left) / (preview.right - codigo.left)) * 100
          : ((ev.clientY - codigo.top) / (preview.bottom - codigo.top)) * 100;
        definirDivisao(pct);
      };
      const soltar = () => {
        if (area) area.classList.remove('arrastando');
        divisor.removeEventListener('pointermove', mover);
        salvar();
      };
      divisor.addEventListener('pointermove', mover);
      divisor.addEventListener('pointerup', soltar, { once: true });
      divisor.addEventListener('pointercancel', soltar, { once: true });
    });

    divisor.addEventListener('keydown', (e) => {
      const passo = { ArrowLeft: -5, ArrowUp: -5, ArrowRight: 5, ArrowDown: 5 }[e.key];
      if (passo) definirDivisao(prefs.divisao + passo);
      else if (e.key === 'Home') definirDivisao(MIN);
      else if (e.key === 'End') definirDivisao(MAX);
      else return;
      e.preventDefault();
      salvar();
    });
    divisor.addEventListener('dblclick', () => {
      definirDivisao(50);
      salvar();
    });
  }

  window.addEventListener('resize', aplicar);

  return {
    mostrarDescricao() {
      if (prefs.descricao) return;
      prefs.descricao = true;
      salvar();
      aplicar();
    },
    aplicar,
  };
}