// Tela inicial em formato de caminho (gamificação): painel do jogador com nível, XP.
import { modulos } from '../conteudo/trilha.js';
import { calcularJornada } from '../gamificacao.js';
import { statusDe, dataDe } from '../progresso.js';
import { esc } from './util.js';

export function jornadaAtual() {
  return calcularJornada({ modulos, statusDe, dataDe });
}

export function resumoProgresso() {
  const j = jornadaAtual();
  let resolvidos = 0;
  let total = 0;
  let licoesLidas = 0;
  let totalLicoes = 0;
  for (const m of j.modulos) {
    resolvidos += m.resolvidos;
    total += m.total;
    const licoes = m.itens.filter((i) => i.tipo === 'licao');
    licoesLidas += licoes.filter((i) => i.estado === 'concluido').length;
    totalLicoes += licoes.length;
  }
  return { resolvidos, total, licoesLidas, totalLicoes };
}

export function renderInicio(el) {
  const j = jornadaAtual();
  el.innerHTML = `
    <div class="caminho-pagina">
      <aside class="painel-jogador" aria-label="Seu progresso">
        <p>Nível ${j.nivel.numero} · ${esc(j.nivel.nome)}</p>
        <p>XP: ${j.xp}</p>
      </aside>
      <div class="caminho">
        <h1 class="caminho-titulo">Trilha: Go do básico ao avançado</h1>
        ${j.modulos.map((m) => `
          <section class="bloco-unidade" id="unidade-${m.id}">
            <h2>${m.icone} ${esc(m.titulo)}</h2>
            <p>${esc(m.descricao)}</p>
            <p>Progresso: ${m.pct}%</p>
          </section>`).join('')}
      </div>
    </div>`;
}