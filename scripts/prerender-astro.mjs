// Pré-renderiza o HTML estático para cada rota do site durante o build do Astro.
// Uso: node scripts/prerender-astro.mjs (chamado pelo astro.config.mjs via integration)
//
// Gera um mapa { caminho -> html } que o [...caminho].astro usa em getStaticPaths().
// O HTML inclui <head> com meta tags, JSON-LD e, na landing, o conteúdo pré-renderizado.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { paginasDoSite } from '../src/paginas.js';
import { metaTags, dadosEstruturados, SITE, NOME, IMAGEM } from '../src/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Monta o HTML completo de uma página estática.
 * Na landing (caminho === ''), inclui o conteúdo da seção "O que tem" pré-renderizado.
 */
export function montarHtmlPagina(pagina) {
  const { titulo, descricao, caminho } = pagina;
  const url = caminho ? `${SITE}${caminho}/` : SITE;
  const imagem = IMAGEM;
  const jsonLd = JSON.stringify(dadosEstruturados()).replace(/</g, '\\u003c');

  // Meta tags específicas desta página
  const metas = [
    `<title>${esc(titulo)}</title>`,
    `<meta name="description" content="${esc(descricao)}">`,
    `<link rel="canonical" href="${url}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    `<meta property="og:site_name" content="${NOME}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="pt_BR">',
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(titulo)}">`,
    `<meta property="og:description" content="${esc(descricao)}">`,
    `<meta property="og:image" content="${imagem}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(`${NOME}: Go acessível, com leitor de tela, Libras e perfis para neurodivergentes`)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(titulo)}">`,
    `<meta name="twitter:description" content="${esc(descricao)}">`,
    `<meta name="twitter:image" content="${imagem}">`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');

  // Conteúdo pré-renderizado apenas na landing
  let conteudoPreRenderizado = '';
  if (caminho === '') {
    conteudoPreRenderizado = `
    <main id="conteudo-prerenderizado" aria-hidden="false">
      <h1>${esc(titulo)}</h1>
      <p>${esc(descricao)}</p>
      <noscript>
        <p>Este site requer JavaScript para funcionar. Ative o JavaScript no seu navegador.</p>
      </noscript>
    </main>`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${metas}
  </head>
  <body>
    ${conteudoPreRenderizado}
    <div id="app"></div>
  </body>
</html>`;
}

/**
 * Gera todas as páginas estáticas e salva em dist/.
 * Retorna o mapa { caminho -> html } para uso pelo Astro.
 */
export async function gerarPaginasEstaticas() {
  const paginas = paginasDoSite();
  const mapa = new Map();

  for (const pagina of paginas) {
    const html = montarHtmlPagina(pagina);
    mapa.set(pagina.caminho, html);

    // Salva o arquivo HTML em dist/<caminho>/index.html
    const dir = pagina.caminho ? join(DIST, pagina.caminho) : DIST;
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html, 'utf-8');
  }

  console.log(`✅ ${paginas.length} páginas estáticas geradas em dist/`);
  return mapa;
}

// Executa se chamado diretamente
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  gerarPaginasEstaticas().catch((err) => {
    console.error('❌ Erro ao gerar páginas estáticas:', err);
    process.exit(1);
  });
}