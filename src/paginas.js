// Lista de rotas estáticas para o build do Astro (src/pages/[...caminho].astro).
// Cada entrada gera uma página HTML com SEO específico e, na landing, o conteúdo já pré-renderizado.
//
// O formato é o mesmo do terraform-playground: { caminho, titulo, descricao }.
// O `caminho` vira o sufixo da URL (/caminho/) e o parâmetro do `getStaticPaths()`.
import { todosOsItens } from './lib/conteudo.js';
import { PRINCIPAL, NOME } from './seo.js';

const paginasInstitucionais = [
  { caminho: '', titulo: PRINCIPAL.titulo, descricao: PRINCIPAL.descricao },
  { caminho: 'trilha', titulo: `Trilha — ${NOME}`, descricao: 'Caminho gamificado com módulos de Go: fundamentos, web, concorrência e projetos.' },
  { caminho: 'livre', titulo: `Playground livre — ${NOME}`, descricao: 'Escreva e rode Go no navegador sem instalar nada. O código fica salvo no navegador.' },
  { caminho: 'validar', titulo: `Validar certificado — ${NOME}`, descricao: 'Valide certificados digitais emitidos pelo DivergeGo por link, código ou arquivo XML.' },
  { caminho: 'instrutor', titulo: `Instrutor — ${NOME}`, descricao: 'Quem é Cláudio Rapôso, instrutor do DivergeGo: atuação, certificações e formação.' },
  { caminho: 'acessibilidade', titulo: `Acessibilidade — ${NOME}`, descricao: 'Recursos de acessibilidade do DivergeGo: temas, leitor de tela, Libras, perfis cognitivos.' },
  { caminho: 'privacidade', titulo: `Privacidade — ${NOME}`, descricao: 'Privacidade e LGPD: sem cookies, sem rastreamento, dados só no seu navegador.' },
  { caminho: 'licenca', titulo: `Licença — ${NOME}`, descricao: 'Código AGPL-3.0-or-later, conteúdo CC BY-SA 4.0.' },
  { caminho: 'termos', titulo: `Termos de uso — ${NOME}`, descricao: 'Termos de uso da plataforma DivergeGo.' },
  { caminho: 'novidades', titulo: `Novidades — ${NOME}`, descricao: 'Histórico de versões e novidades do DivergeGo.' },
];

/** Uma página por item da trilha (lição ou problema), em /p/<id>/. */
const paginasDeItens = todosOsItens.map((item) => ({
  caminho: `p/${encodeURIComponent(item.id)}`,
  titulo: `${item.titulo} — ${NOME}`,
  descricao: item.resumo?.replace(/<[^>]+>/g, '').trim() || `Exercício ${item.id} da trilha de Go.`,
  item,
}));

/** Todas as rotas que o build estático do Astro deve gerar. */
export function paginasDoSite() {
  return [...paginasInstitucionais, ...paginasDeItens];
}

/** Busca uma página pelo caminho (para o prerender montar o SEO). */
export function paginaDe({ tela, id }) {
  if (tela === 'landing' || !tela) return paginasInstitucionais[0];
  if (tela === 'inicio') return paginasInstitucionais.find((p) => p.caminho === 'trilha') ?? paginasInstitucionais[0];
  if (tela === 'item' && id) {
    const achada = paginasDeItens.find((p) => p.caminho === `p/${encodeURIComponent(id)}`);
    if (achada) return achada;
    if (id === 'livre') return paginasInstitucionais.find((p) => p.caminho === 'livre') ?? paginasInstitucionais[0];
  }
  const porTela = paginasInstitucionais.find((p) => p.caminho === tela);
  if (porTela) return porTela;
  return paginasInstitucionais[0];
}