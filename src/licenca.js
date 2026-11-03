// Política de licenciamento (copyleft). A página #/licenca e o README usam estes dados;
// tests/licenca.test.js confere que toda dependência do site está na lista de terceiros.
//
// Por que AGPL: o compilador Go no navegador (gopherjs) é BSD-3-Clause, mas o projeto
// como um todo usa AGPL-3.0 para garantir que versões modificadas oferecidas pela
// internet também publiquem o código-fonte.

export const ATUALIZADA_EM = '2026-11-03';
export const TITULAR = 'Sertão será cloud';
export const REPOSITORIO = 'https://github.com/sertaoseracloud/go-playground';

export const CODIGO = {
  nome: 'GNU Affero General Public License v3.0 ou posterior',
  spdx: 'AGPL-3.0-or-later',
  url: 'https://www.gnu.org/licenses/agpl-3.0.html',
  arquivo: `${REPOSITORIO}/blob/main/LICENSE`,
};

export const CONTEUDO = {
  nome: 'Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional',
  spdx: 'CC-BY-SA-4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br',
  arquivo: `${REPOSITORIO}/blob/main/LICENSE-CONTEUDO.md`,
  atribuicao: 'DivergeGo, Sertão será cloud (CC BY-SA 4.0)',
};

/** Componentes de terceiros que vão junto com o site, com a licença de cada um. */
export const TERCEIROS = [
  { nome: 'Compilador Go no navegador (GopherJS)', pacotes: ['gopherjs'], licenca: 'BSD-3-Clause' },
  { nome: 'Editor de código (CodeMirror)', pacotes: ['codemirror', '@codemirror/lang-javascript', '@codemirror/language', '@codemirror/state', '@codemirror/view', '@lezer/highlight'], licenca: 'MIT' },
  { nome: 'Assinatura digital (@noble/ed25519, @noble/hashes)', pacotes: ['@noble/ed25519', '@noble/hashes'], licenca: 'MIT' },
  { nome: 'Fontes Fira Code e Atkinson Hyperlegible', pacotes: ['@fontsource/fira-code', '@fontsource/atkinson-hyperlegible'], licenca: 'OFL-1.1' },
  { nome: 'QR Code do PIX (qrcode-generator)', pacotes: ['qrcode-generator'], licenca: 'MIT' },
  { nome: 'Desenho dos cenários da trilha (PixiJS)', pacotes: ['pixi.js'], licenca: 'MIT' },
];