// Restauração de progresso a partir de certificado.
// Adaptado do php-playground para o contexto Go: reconstrói o plano de módulos
// concluídos a partir da cadeia do certificado e dos módulos disponíveis na trilha.

import { CERTIFICADOS } from './certificados.js';

/**
 * Retorna o plano de restauração para um certificado dado.
 * Cada elo da cadeia do certificado vira um bloco com título, data,
 * contagem de lições/exercícios e IDs dos itens do módulo.
 * @param {object} cert - Certificado decodificado (com cadeia, modulo e data)
 * @param {Array} modulos - Lista de módulos da trilha
 * @returns {Array} Array de blocos de restauração
 */
export function planoDeRestauracao(cert, modulos) {
  if (!cert || !cert.cadeia || !modulos) return [];
  const elos = [...cert.cadeia, { modulo: cert.modulo, data: cert.data }];
  return elos.flatMap(({ modulo, data }) => {
    const m = modulos.find((x) => x.id === modulo);
    if (!m) return [];
    return [{
      modulo,
      titulo: CERTIFICADOS[modulo]?.titulo || modulo,
      data,
      licoes: m.itens.filter((i) => i.tipo === 'licao').length,
      exercicios: m.itens.filter((i) => i.tipo === 'problema').length,
      ids: m.itens.map((i) => i.id),
    }];
  });
}

/**
 * Verifica a situação do nome salvo em relação ao certificado.
 * O validador chama situacaoDoNome(cert, nomeSalvo) — nesta ordem.
 * @param {object} cert - Certificado decodificado
 * @param {string} nomeSalvo - Nome lido do localStorage
 * @returns {'sem-nome' | 'nome-diferente' | 'igual'} Situação do nome
 */
export function situacaoDoNome(cert, nomeSalvo) {
  const nome = typeof nomeSalvo === 'string' ? nomeSalvo.trim() : '';
  if (!nome) return 'sem-nome';
  if (!cert || !cert.nome) return 'nome-diferente';
  return nome === String(cert.nome).trim() ? 'igual' : 'nome-diferente';
}

/**
 * Lista os IDs dos itens que podem ser restaurados a partir de um plano.
 * @param {Array} plano - Plano de restauração (array de blocos)
 * @returns {string[]} Lista plana de IDs de itens
 */
export function itensDoPlano(plano) {
  if (!Array.isArray(plano)) return [];
  return plano.flatMap((bloco) => bloco.ids || []);
}