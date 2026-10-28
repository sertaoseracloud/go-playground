// Avisos para leitores de tela (NVDA, JAWS, VoiceOver, TalkBack): uma região
// aria-live escondida da tela (#anuncio, no index.html) fala o resultado de cada ação
// (rodou, passou, falhou e por quê) sem tirar o foco de onde a pessoa está.

let timer = null;

/** Fala um texto pelo leitor de tela. Repetir o mesmo texto também é falado. */
export function anunciar(texto, regiao = document.getElementById('anuncio')) {
  if (!regiao || !texto) return;
  clearTimeout(timer);
  regiao.textContent = '';
  // Esvaziar e preencher depois de um instante faz o leitor perceber a mudança.
  timer = setTimeout(() => { regiao.textContent = texto; }, 80);
}

/** O modo "leitor de tela" do painel ♿ está ligado (avisos com todos os detalhes). */
export const leitorDeTela = () => document.documentElement.classList.contains('a11y-leitor-tela');

/** Termina a frase com ponto (para o leitor fazer a pausa certa). */
export function frase(texto) {
  const t = String(texto ?? '').replace(/\s+/g, ' ').trim();
  return !t || /[.!?:]$/.test(t) ? t : `${t}.`;
}