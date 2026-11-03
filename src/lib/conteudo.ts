// Ponte tipada para o conteúdo da trilha: adapta os módulos JS puro para o Astro.
// Os dados continuam em src/conteudo/trilha.js; isto só adiciona tipos e helpers
// que as páginas .astro consomem sem duplicar lógica.
import { modulos, itens, problemas, buscarItem, vizinhos, LIVRE, PROXIMOS_MODULOS } from '../conteudo/trilha.js';

export interface Item {
  id: string;
  tipo: 'licao' | 'problema' | 'livre';
  titulo: string;
  resumo?: string;
  modulo?: string;
  arquivos?: Record<string, string>;
}

export interface Modulo {
  id: string;
  titulo: string;
  icone?: string;
  itens: Item[];
  grupos?: { titulo: string; itens: Item[] }[];
}

/** Todos os itens da trilha (lições + problemas), já com o campo `modulo` preenchido. */
export const todosOsItens = itens as Item[];

/** Só os problemas (exercícios com testes automáticos). */
export const todosOsProblemas = problemas as Item[];

/** Módulos publicados, na ordem da trilha. */
export const modulosPublicados = modulos as Modulo[];

/** Próximos módulos (só título e ícone, para a landing e a trilha). */
export const proximosModulos = PROXIMOS_MODULOS as { id: string; titulo: string; icone: string }[];

/** Playground livre. */
export const playgroundLivre = LIVRE as Item;

/** Busca um item por ID (inclui o playground livre). */
export const item = (id: string): Item | undefined => buscarItem(id) as Item | undefined;

/** Item anterior e próximo na trilha (para os botões ‹ ›). */
export const vizinhosDe = (id: string) => vizinhos(id) as { anterior: Item | undefined; proximo: Item | undefined };

/** Texto puro do resumo (sem HTML), para meta tags e descrições curtas. */
export function semHtml(html: string | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}