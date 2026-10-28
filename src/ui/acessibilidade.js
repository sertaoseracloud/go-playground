// Painel "♿ Acessibilidade": perfis rápidos, tema, tamanho do texto e opções de
// leitura, foco e conforto. As mudanças valem na hora e ficam salvas.
import { $ } from './util.js';
import { anunciar } from './anuncios.js';

export function iniciarAcessibilidade() {
  const dialogo = $('dialogo-a11y');
  const btn = $('btn-acessibilidade');

  if (btn) {
    btn.onclick = () => {
      dialogo?.showModal();
    };
  }

  // Clicar fora da janela, ou num link para outra página do site, fecha.
  dialogo?.addEventListener('click', (e) => {
    if (e.target === dialogo || e.target.closest('a[href^="#/"]')) dialogo.close();
  });

  return { atuais: () => ({}) };
}

/** Botão "🔊 Ouvir": lê o texto do painel de descrição com a voz do navegador. */
export function iniciarLeitura(botao, obterTexto) {
  if (!botao) return { parar() {} };
  if (!('speechSynthesis' in window)) {
    botao.hidden = true;
    return { parar() {} };
  }
  const parar = () => {
    speechSynthesis.cancel();
    botao.setAttribute('aria-pressed', 'false');
    botao.textContent = '🔊';
  };
  botao.onclick = () => {
    if (speechSynthesis.speaking) {
      parar();
      return;
    }
    const fala = new SpeechSynthesisUtterance(obterTexto());
    fala.lang = 'pt-BR';
    fala.onend = parar;
    fala.onerror = parar;
    speechSynthesis.speak(fala);
    botao.setAttribute('aria-pressed', 'true');
    botao.textContent = '⏹';
  };
  return { parar };
}