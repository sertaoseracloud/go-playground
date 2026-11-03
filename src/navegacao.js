// Navegação e ponte entre o preview e o playground Go.
// Diferente do php-playground (que usa iframe sandbox + postMessage para executar PHP),
// o go-playground compila e executa Go diretamente via gopherjs no navegador,
// sem necessidade de iframe isolado ou ponte de mensagens.
//
// Este módulo mantém a interface compatível com item.js e outros módulos que
// esperam funções de normalização de URL e montagem de requisição, mas adaptadas
// para o contexto Go onde "requisições" são chamadas ao compilador/runtime.

const ORIGEM = 'http://localhost';

/**
 * Normaliza URLs digitadas pelo usuário ou vindas de links internos.
 * No contexto Go, URLs são principalmente para navegação entre exercícios
 * e páginas estáticas, não para execução de código (que é feita via compilador).
 * @param {string} texto - URL ou caminho digitado
 * @param {string} principal - Arquivo padrão quando a URL é "/"
 * @returns {string} URL normalizada
 */
export function normalizarUrl(texto, principal = 'index.html') {
  const destino = new URL(texto.trim() || `/${principal}`, `${ORIGEM}/${principal}`);
  if (destino.pathname === '/') destino.pathname = `/${principal}`;
  return destino.pathname + destino.search;
}

/**
 * Monta uma "requisição" para o runtime Go.
 * No go-playground, isso significa preparar os arquivos e parâmetros
 * para compilação/execução via gopherjs, não uma requisição HTTP real.
 * @param {string} urlAtual - URL atual (usada para resolver caminhos relativos)
 * @param {Object} dados - Dados da ação: tipo, metodo, acao, campos
 * @returns {Object} Objeto com url, metodo e corpo (adaptado para Go)
 */
export function montarRequisicao(urlAtual, { tipo, metodo, acao, campos }) {
  const base = new URL(urlAtual, ORIGEM);
  const destino = new URL(acao || base.pathname, base);
  if (destino.pathname === '/') destino.pathname = '/index.html';
  const params = new URLSearchParams(campos);

  if (tipo === 'form' && metodo === 'POST') {
    return { url: destino.pathname + destino.search, metodo: 'POST', corpo: params.toString() };
  }
  if (tipo === 'form') destino.search = params.toString();
  return { url: destino.pathname + destino.search, metodo: 'GET' };
}

/**
 * Script ponte para preview (mantido para compatibilidade de interface).
 * No go-playground, o preview é renderizado diretamente no DOM sem iframe sandbox,
 * então este script é vazio. Mantido para evitar quebras em módulos que o importam.
 */
export const SCRIPT_PONTE = '';

/**
 * Prepara HTML para exibição no preview.
 * No go-playground, não há substituição de W3.CSS via proxy como no php-playground,
 * pois o Go roda inteiramente no navegador sem dependências externas de CSS.
 * @param {string} html - HTML gerado pelo aluno
 * @returns {string} HTML pronto para exibição
 */
export function paraOPreview(html) {
  return html;
}