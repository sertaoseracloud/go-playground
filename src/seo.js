// SEO: título, descrição, imagem de compartilhamento e dados estruturados (JSON-LD).
// O build (scripts/prerender.mjs) usa isto para escrever o <head> do index.html,
// e o site usa `definirPagina` para atualizar título e descrição a cada tela.

export const NOME = 'DivergeGo';
export const IMAGEM = ''; // será gerada no build
export const REPOSITORIO = 'https://github.com/sertaoseracloud/go-playground';

/** Título e descrição da página principal (buscadores e redes sociais). */
export const PRINCIPAL = {
  titulo: `${NOME}: Go acessível para todas as pessoas`,
  descricao: `Aprenda Go/Golang grátis com acessibilidade: leitor de tela, Libras, teclado e perfis para TDAH e dislexia. Exercícios com testes automáticos e certificado.`,
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/** Atualiza título e descrição ao trocar de tela (o Google indexa o que o JavaScript desenha). */
export function definirPagina({ titulo, descricao = PRINCIPAL.descricao }) {
  document.title = titulo;
  const meta = (seletor) => document.head.querySelector(seletor);
  meta('meta[name="description"]')?.setAttribute('content', descricao);
  meta('meta[property="og:title"]')?.setAttribute('content', titulo);
  meta('meta[property="og:description"]')?.setAttribute('content', descricao);
}