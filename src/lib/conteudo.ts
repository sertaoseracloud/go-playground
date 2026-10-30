// Ponte tipada para o conteúdo atual (../conteudo/trilha.js): o mesmo conteúdo serve à SPA e ao Astro.
// Quando a trilha tiver dados reais, esta ponte garante que as páginas .astro recebam objetos tipados.
import { modulos, itens } from '../conteudo/trilha.js';

export interface Teste { descricao: string; oculto?: boolean; dica?: string; regras: unknown[] }
export interface Item {
  id: string; tipo: 'licao' | 'exercicio'; titulo: string; dificuldade: 'facil' | 'medio' | 'dificil';
  xp: number; resumo: string; modulo: string; grupo?: string;
  inicial?: string; existentes?: string; solucao?: string; testes?: Teste[]; dica?: string | string[];
}
export interface Modulo { id: string; titulo: string; descricao: string; icone?: string; itens: Item[] }

export const todosOsModulos = modulos as unknown as Modulo[];
export const todosOsItens = itens as unknown as Item[];

/** Busca um item por ID. Retorna null se não existir (trilha vazia no stub). */
export const item = (id: string): Item | null =>
  todosOsItens.find((i) => i.id === id) ?? null;

/** Vizinhos de navegação (anterior/próximo) dentro do mesmo módulo. */
export const vizinhosDe = (id: string): { anterior?: Item | null; proximo?: Item | null } => {
  const idx = todosOsItens.findIndex((i) => i.id === id);
  if (idx < 0) return {};
  const atual = todosOsItens[idx];
  const mesmoModulo = todosOsItens.filter((i) => i.modulo === atual.modulo);
  const idxNoModulo = mesmoModulo.findIndex((i) => i.id === id);
  return {
    anterior: idxNoModulo > 0 ? mesmoModulo[idxNoModulo - 1] : null,
    proximo: idxNoModulo < mesmoModulo.length - 1 ? mesmoModulo[idxNoModulo + 1] : null,
  };
};

/** Rótulo legível da dificuldade. */
const DIFICULDADES: Record<string, string> = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
export const rotuloDificuldade = (d: Item['dificuldade']) => DIFICULDADES[d] ?? d;

/** O que a ilha do exercício recebe como props (vira JSON no HTML): nunca a solução. */
export type ItemDaIlha = Pick<Item, 'id' | 'tipo' | 'titulo' | 'inicial' | 'existentes' | 'testes'>;
export const paraIlha = ({ id, tipo, titulo, inicial, existentes, testes }: Item): ItemDaIlha =>
  ({ id, tipo, titulo, inicial, existentes, testes });

/** Texto puro para meta description (o resumo pode conter HTML). */
export const semHtml = (html: string, limite = 155) => {
  const texto = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return texto.length > limite ? `${texto.slice(0, limite - 1).replace(/\s+\S*$/, '')}…` : texto;
};