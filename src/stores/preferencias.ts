// Store de preferências para as ilhas React: lê o mesmo localStorage que o módulo
// src/ui/preferencias.js já usa, mas expõe como atom do nanostores para reatividade.
import { atom } from 'nanostores';
import { PREFIXO_ARMAZENAMENTO } from '../ambiente.js';
import { PADRAO, normalizarPreferencias } from '../ui/preferencias.js';

export type Preferencias = typeof PADRAO;

const CHAVE = `${PREFIXO_ARMAZENAMENTO}pref:acessibilidade`;

function lerPreferencias(): Preferencias {
  try {
    const valor = localStorage.getItem(CHAVE);
    return normalizarPreferencias(valor ? JSON.parse(valor) : null);
  } catch {
    return { ...PADRAO };
  }
}

export const $preferencias = atom<Preferencias | null>(null);

/** Carrega as preferências do localStorage e atualiza o store. */
export function carregarPreferencias() {
  $preferencias.set(lerPreferencias());
}

/** Atualiza as preferências no store e persiste no localStorage. */
export function mudarPreferencias(novas: Partial<Preferencias>) {
  const atuais = $preferencias.get();
  if (!atuais) return;
  const atualizadas = { ...atuais, ...novas };
  $preferencias.set(atualizadas);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(atualizadas));
  } catch {
    // sem armazenamento: prefere silenciar a quebrar a UI
  }
}