// Rotas reais do site em Astro e a tradução dos links antigos (#/...).
// Regra: a rota antiga sem o "#/" é a rota nova. Códigos (certificado, link compartilhado)
// continuam no hash: o hash nunca vai ao servidor nem aos logs do GitHub Pages.

const base = import.meta.env.BASE_URL; // termina em "/" (trailingSlash: 'always')

export const url = {
  inicio: () => base,
  trilha: () => `${base}trilha/`,
  item: (id: string) => `${base}p/${encodeURIComponent(id)}/`,
  livre: () => `${base}livre/`,
  validar: (codigo = '') => `${base}validar/${codigo ? `#${codigo}` : ''}`,
  instrutor: () => `${base}instrutor/`,
  acessibilidade: () => `${base}acessibilidade/`,
  privacidade: () => `${base}privacidade/`,
  licenca: () => `${base}licenca/`,
  termos: () => `${base}termos/`,
  novidades: () => `${base}novidades/`,
  certificado: (codigo = '') => `${base}certificado/${codigo ? `#${codigo}` : ''}`,
};

/** Código de link compartilhado (#/s/<código>) → id do item, sem depender do resto do site. */
function itemDoCompartilhado(codigo: string): string | null {
  try {
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(codigo.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
    );
    const { i } = JSON.parse(json);
    return typeof i === 'string' ? i : null;
  } catch {
    return null;
  }
}

/**
 * Para onde vai um link antigo da SPA. Devolve null quando não há rota antiga no hash
 * (fica na landing). Função pura: os testes cobrem cada formato de link já publicado.
 */
export function destinoDeHashAntigo(hash: string, raiz = base): string | null {
  const caminho = hash.replace(/^#\/?/, '');
  if (!hash.startsWith('#/') || !caminho) return null;
  const [rota, ...resto] = caminho.split('/');
  const parametro = resto.join('/');
  switch (rota) {
    case 'p': return `${raiz}p/${parametro}/`;
    case 's': {
      const id = itemDoCompartilhado(parametro);
      return id ? `${raiz}p/${encodeURIComponent(id)}/#s=${parametro}` : `${raiz}404/`;
    }
    case 'validar': return `${raiz}validar/${parametro ? `#${parametro}` : ''}`;
    case 'certificado': return `${raiz}certificado/${parametro ? `#${parametro}` : ''}`;
    case 'apoie': return `${raiz}instrutor/#apoie`;
    case 'trilha': case 'livre': case 'privacidade': case 'licenca': case 'termos':
    case 'novidades': case 'instrutor': case 'acessibilidade':
      return `${raiz}${rota}/`;
    default: return `${raiz}404/`;
  }
}