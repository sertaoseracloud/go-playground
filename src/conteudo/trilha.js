/**
 * Stub da trilha de exercícios do DivergeGo.
 *
 * Cada módulo futuro deve seguir esta interface:
 * @typedef {Object} Modulo
 * @property {string} id - Identificador único do módulo (ex: 'basico', 'web', 'concorrencia').
 * @property {string} titulo - Título exibido na trilha.
 * @property {string} descricao - Breve descrição do que o módulo aborda.
 * @property {Array<Exercicio>} itens - Lista de exercícios e lições do módulo.
 *
 * @typedef {Object} Exercicio
 * @property {string} id - Identificador único do exercício.
 * @property {string} tipo - 'licao' | 'facil' | 'medio' | 'dificil'.
 * @property {string} enunciado - Texto do desafio.
 * @property {string} [dica] - Dica opcional.
 * @property {string} inicial - Código Go inicial no editor.
 * @property {string} solucao - Solução esperada.
 * @property {Array<Object>} testes - Casos de teste para validação.
 */

/** @type {Modulo[]} */
export const modulos = [];

/** @deprecated Use `modulos` instead. Kept for compatibility with seo.js. */
export const problemas = [];

/** @deprecated Use `modulos.flatMap(m => m.itens)` instead. Kept for compatibility with seo.js. */
export const itens = [];