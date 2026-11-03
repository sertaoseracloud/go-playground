// Store de progresso para as ilhas React: lê o mesmo localStorage que o módulo
// src/progresso.js já usa, mas expõe como atom do nanostores para reatividade.
import { atom } from 'nanostores';
import { PREFIXO_ARMAZENAMENTO } from '../ambiente.js';

export type StatusItem = 'resolvido' | 'tentado';
export type ProgressoMap = Record<string, StatusItem>;

function lerProgresso(): ProgressoMap {
  try {
    const valor = localStorage.getItem(PREFIXO_ARMAZENAMENTO + 'progresso');
    return valor ? JSON.parse(valor) : {};
  } catch {
    return {};
  }
}

export const $progresso = atom<ProgressoMap>({});

/** Carrega o progresso do localStorage e atualiza o store. */
export function carregarProgresso(_exercicios?: string[]) {
  $progresso.set(lerProgresso());
}

/** Conta quantos exercícios da lista estão resolvidos. */
export function contarResolvidos(progresso: ProgressoMap, exercicios: string[]): number {
  return exercicios.filter((id) => progresso[id] === 'resolvido').length;
}