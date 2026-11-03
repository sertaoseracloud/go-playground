// Rotas do DivergeGo em Astro: caminhos canônicos e redirecionamento de hash legado.
// Adaptado do spike-astro-k8s para cobrir todas as telas do DivergeGo.

const base = import.meta.env.BASE_URL;

/** Caminhos canônicos das páginas estáticas. */
export const url = {
  inicio: () => base,
  trilha: () => `${base}trilha/`,
  livre: () => `${base}livre/`,
  validar: () => `${base}validar/`,
  instrutor: () => `${base}instrutor/`,
  acessibilidade: () => `${base}acessibilidade/`,
  privacidade: () => `${base}privacidade/`,
  licenca: () => `${base}licenca/`,
  termos: () => `${base}termos/`,
  novidades: () => `${base}novidades/`,
  certificado: () => `${base}certificado/`,
  exercicio: (id: string) => `${base}p/${id}/`,
};

/**
 * Converte hashes legados (#/trilha, #/p/basico-01, etc.) em rotas novas.
 * Retorna null quando o hash não corresponde a nenhum padrão conhecido.
 */
export function destinoDeHashAntigo(hash: string): string | null {
  if (!hash || !hash.startsWith('#')) return null;
  const caminho = hash.slice(1); // remove o '#'
  if (caminho === '/' || caminho === '') return url.inicio();
  if (caminho === '/trilha' || caminho === 'trilha') return url.trilha();
  if (caminho === '/livre' || caminho === 'livre') return url.livre();
  if (caminho === '/validar' || caminho === 'validar') return url.validar();
  if (caminho === '/instrutor' || caminho === 'instrutor') return url.instrutor();
  if (caminho === '/acessibilidade' || caminho === 'acessibilidade') return url.acessibilidade();
  if (caminho === '/privacidade' || caminho === 'privacidade') return url.privacidade();
  if (caminho === '/licenca' || caminho === 'licenca') return url.licenca();
  if (caminho === '/termos' || caminho === 'termos') return url.termos();
  if (caminho === '/novidades' || caminho === 'novidades') return url.novidades();
  if (caminho === '/certificado' || caminho === 'certificado') return url.certificado();
  const matchExercicio = caminho.match(/^\/?p\/(.+)$/);
  if (matchExercicio) return url.exercicio(matchExercicio[1]);
  return null;
}