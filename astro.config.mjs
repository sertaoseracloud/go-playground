// Migração DivergeGo → Astro + React (ilhas).
// O conteúdo, o simulador e as regras de progresso continuam em src/ (JS puro, sem DOM):
// o Astro só troca a "casca" (páginas, rotas e UI).
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { chavePublicaDe } from './src/ed25519.js';
import { versaoDoPacote } from './scripts/plugin-historico.mjs';

const HOMOLOGACAO = process.env.HOMOLOGACAO === '1';
const DEV = process.argv.includes('dev');

/**
 * Mesma regra do vite.config.js atual: a palavra secreta só existe aqui, no processo de build.
 * O bundle recebe valores derivados (SHA-256 com rótulos), nunca a palavra. Nada de
 * import.meta.env nem astro:env para ela: o que for lido no frontmatter e interpolado vira HTML.
 */
function segredo() {
  const valor = HOMOLOGACAO ? process.env.CERTIFICADO_SEGREDO_HOMOLOGACAO : process.env.CERTIFICADO_SEGREDO;
  if (valor) return valor;
  if (DEV) return HOMOLOGACAO ? 'segredo-de-homologacao' : 'segredo-de-desenvolvimento';
  throw new Error(`Defina ${HOMOLOGACAO ? 'CERTIFICADO_SEGREDO_HOMOLOGACAO' : 'CERTIFICADO_SEGREDO'} para gerar o build.`);
}
const derivar = (rotulo, valor) => createHash('sha256').update(`go-playground:${rotulo}:${valor}`, 'utf8').digest('hex');
const valor = segredo();
const semente = derivar('ed25519', valor);

export default defineConfig({
  site: 'https://sertaoseracloud.github.io',
  // Produção em /go-playground/ e homologação em /go-playground/homologacao/.
  base: HOMOLOGACAO ? '/go-playground/homologacao/' : '/go-playground/',
  trailingSlash: 'always',
  publicDir: 'public',
  build: { format: 'directory' },
  integrations: [react(), ...(HOMOLOGACAO ? [] : [sitemap()])],
  fonts: [
    { provider: fontProviders.fontsource(), name: 'Atkinson Hyperlegible', cssVariable: '--fonte-texto', weights: [400, 700], styles: ['normal'], subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
    { provider: fontProviders.fontsource(), name: 'Fira Code', cssVariable: '--fonte-codigo', weights: [400, 600], styles: ['normal'], subsets: ['latin'], fallbacks: ['monospace'] },
  ],
  vite: {
    define: {
      __CHAVE_CERTIFICADO__: JSON.stringify(derivar('certificado', valor)),
      __SEMENTE_ED25519__: JSON.stringify(semente),
      __CHAVE_PUBLICA_ED25519__: JSON.stringify(chavePublicaDe(semente)),
      __VERSAO__: JSON.stringify(versaoDoPacote()),
      __HOMOLOGACAO__: JSON.stringify(HOMOLOGACAO),
    },
    build: { target: 'es2022' },
  },
});