// Página de novidades: histórico de versões e changelog do DivergeGo.
// Dados inline para evitar dependência de virtual:historico (não disponível no SSR do Astro).
const RELEASES = [
 {
 versao: '1.11.0',
 data: '2026-10-31',
 titulo: 'Concorrência e web no caminho',
 resumo: 'Dois novos módulos na trilha: concorrência com goroutines, channels e mutex, e web com servidor HTTP, API JSON e códigos de status.',
 grupos: [
 {
 titulo: '🔄 Concorrência',
 itens: [
 'Exercícios com goroutines para executar funções em paralelo, channels para comunicação entre elas e mutex para proteger dados compartilhados.',
 'Problemas práticos de sincronização, como produtores e consumidores, pipelines e controle de concorrência.',
 ],
 },
 {
 titulo: '🌐 Web',
 itens: [
 'Servidor HTTP com rotas, handlers e middleware.',
 'API JSON com leitura de corpo, validação e respostas estruturadas.',
 'Códigos de status HTTP e quando usar cada um (200, 201, 400, 404, 500...).',
 ],
 },
 {
 titulo: '🗺️ Trilha',
 itens: [
 'Cenários, falas da vila e glossário compartilhados entre os módulos.',
 'Lugar reservado para os próximos módulos na página inicial.',
 ],
 },
 ],
 },
 {
 versao: '1.10.0',
 data: '2026-10-30',
 titulo: 'O básico da trilha',
 resumo: 'Primeiro módulo da trilha de Go, com variáveis, tipos, funções, estruturas de controle e os primeiros exercícios.',
 grupos: [
 {
 titulo: '📚 Básico',
 itens: [
 'Variáveis, constantes e tipos primitivos (int, float, string, bool).',
 'Funções com múltiplos retornos e funções anônimas.',
 'Estruturas de controle: if, for, switch.',
 'Arrays, slices e maps.',
 ],
 },
 {
 titulo: '🗺️ Infraestrutura da trilha',
 itens: [
 'Estrutura de módulos, itens (lições e problemas) e testes automatizados.',
 'Cenários da vila, falas dos personagens e glossário compartilhados.',
 'Lugar reservado para os próximos módulos na página inicial.',
 ],
 },
 ],
 },
 {
 versao: '1.9.0',
 data: '2026-10-29',
 titulo: 'Certificados e publicação',
 resumo: 'O site agora gera certificados digitais durante a publicação, com chave pública Ed25519 e validação independente.',
 grupos: [
 {
 titulo: '🔒 Certificados',
 itens: [
 'Chave pública Ed25519 publicada junto com o site, para quem verifica fora dele.',
 'Assinatura digital dos certificados com a mesma palavra secreta do selo.',
 'Validação pública e independente do site.',
 ],
 },
 {
 titulo: '🚀 Publicação',
 itens: [
 'Publicação automática no GitHub Pages com testes de fumaça.',
 'Auditoria semanal de acessibilidade e desempenho.',
 ],
 },
 ],
 },
 {
 versao: '1.8.0',
 data: '2026-10-28',
 titulo: 'DivergeGo no ar',
 resumo: 'Primeira versão do playground de Go, com editor, terminal e testes no navegador.',
 grupos: [
 {
 titulo: '🎮 Playground',
 itens: [
 'Editor de código Go com realce de sintaxe e completamento.',
 'Terminal integrado para compilar e executar programas.',
 'Testes automatizados no estilo LeetCode, com casos ocultos ao enviar.',
 ],
 },
 {
 titulo: '♿ Acessibilidade',
 itens: [
 'Temas Dracula, Claro, Alto contraste e Suavo.',
 'Perfis prontos: Foco (TDAH), Leitura facilitada (dislexia), Calmo (autismo) e Sem pressão (ansiedade).',
 'Navegação completa pelo teclado e contraste revisado em todas as telas.',
 ],
 },
 {
 titulo: '🔒 Privacidade',
 itens: [
 'Sem cookies, sem rastreamento e sem cadastro: seus dados ficam só no seu navegador.',
 'Página de privacidade (LGPD), com botões para baixar e apagar seus dados.',
 'Software livre com copyleft: código sob AGPL-3.0 e conteúdo didático sob CC BY-SA 4.0.',
 ],
 },
 ],
 },
];

export default function NovidadesGo() {
 return (
 <section className="novidades">
 <header className="novidades-header">
 <h1>📰 Novidades</h1>
 <p className="subtitulo">
 Histórico de atualizações e melhorias do DivergeGo.
 </p>
 </header>

 <div className="novidades-timeline">
 {RELEASES.map((release) => (
 <article key={release.versao} className="novidade-card">
 <header className="novidade-header">
 <span className="novidade-versao">v{release.versao}</span>
 <time className="novidade-data" dateTime={release.data}>
 {new Date(release.data).toLocaleDateString('pt-BR', {
 day: 'numeric',
 month: 'long',
 year: 'numeric',
 })}
 </time>
 </header>

 {release.titulo && (
 <h2 className="novidade-titulo">{release.titulo}</h2>
 )}

 {release.resumo && (
 <p className="novidade-resumo">{release.resumo}</p>
 )}

 {release.grupos && release.grupos.length > 0 && (
 <div className="novidade-grupos">
 {release.grupos.map((grupo, gIdx) => (
 <div key={gIdx} className="novidade-grupo">
 <h3>{grupo.titulo}</h3>
 <ul>
 {grupo.itens.map((item, iIdx) => (
 <li key={iIdx}>{item}</li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 )}
 </article>
 ))}
 </div>

 {RELEASES.length === 0 && (
 <p className="novidades-vazio">Nenhuma atualização registrada ainda.</p>
 )}
 </section>
 );
}