// Stub de restauração de progresso: implementações reais serão adicionadas quando
// a lógica de recuperação de certificados e itens concluídos for migrada do Vite SPA.
// Por ora, retorna valores vazios/neutros para não quebrar o validador.

/**
 * Retorna o plano de restauração para um certificado e código dados.
 * @param {object} _cert - Certificado decodificado (não usado no stub)
 * @param {string} _codigo - Código do certificado (não usado no stub)
 * @returns {{ itens: string[], nome: string }} Plano vazio
 */
export function planoDeRestauracao(_cert, _codigo) {
  return { itens: [], nome: '' };
}

/**
 * Verifica a situação do nome salvo em relação ao certificado.
 * @param {string} _nomeSalvo - Nome lido do localStorage (não usado no stub)
 * @param {object} _cert - Certificado decodificado (não usado no stub)
 * @returns {'igual' | 'diferente' | 'vazio'} Situação neutra
 */
export function situacaoDoNome(_nomeSalvo, _cert) {
  return 'vazio';
}

/**
 * Lista os itens que podem ser restaurados a partir de um plano.
 * @param {object} _plano - Plano de restauração (não usado no stub)
 * @returns {string[]} Lista vazia
 */
export function itensDoPlano(_plano) {
  return [];
}