// Página de declaração de acessibilidade: WCAG 2.2 AA, perfis neurodivergentes e recursos disponíveis.
// Substitui o markup estático com conteúdo reativo e links para recursos externos.
export default function AcessibilidadeGo() {
 return (
 <section className="acessibilidade-declaracao">
 <h1>♿ Declaração de acessibilidade</h1>
 <p className="subtitulo">
 O DivergeGo foi projetado para ser acessível a todas as pessoas, incluindo aquelas com deficiências visuais, auditivas, motoras e cognitivas.
 </p>

 <article className="topico">
 <h2>Conformidade WCAG 2.2 AA</h2>
 <p>
 Todas as páginas do DivergeGo atendem aos critérios de sucesso da{' '}
 <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noopener noreferrer">
 WCAG 2.2 nível AA
 </a>. Isso inclui contraste mínimo de 4.5:1 para texto normal, navegação completa por teclado,
 rótulos descritivos em todos os controles interativos e suporte a leitores de tela.
 </p>
 </article>

 <article className="topico">
 <h2>Recursos disponíveis</h2>
 <ul>
 <li><b>Temas:</b> Dracula (escuro), Claro, Alto contraste e Suavo (tons pastéis).</li>
 <li><b>Tamanho de texto:</b> ajuste de 100% a 175% sem perda de layout.</li>
 <li><b>Perfis neurodivergentes:</b> Foco (TDAH), Leitura facilitada (dislexia), Calmo (autismo) e Sem pressão (ansiedade).</li>
 <li><b>VLibras:</b> tradução automática para Libras integrada em todas as páginas.</li>
 <li><b>Navegação por teclado:</b> Tab, Shift+Tab, Enter e Escape funcionam em todos os componentes.</li>
 <li><b>Leitor de tela:</b> ARIA labels, roles e live regions em formulários, terminais e resultados de testes.</li>
 </ul>
 </article>

 <article className="topico">
 <h2>Como ativar</h2>
 <p>
 Clique no botão ♿ no canto superior direito de qualquer página para abrir o painel de acessibilidade.
 Nele você escolhe tema, tamanho de texto e perfil. As preferências são salvas no seu navegador e
 aplicadas automaticamente nas próximas visitas.
 </p>
 </article>

 <article className="topico">
 <h2>Reportar problemas</h2>
 <p>
 Se encontrar uma barreira de acessibilidade que não conseguimos resolver,{' '}
 <a href="https://github.com/sertaoseracloud/go-playground/issues/new" target="_blank" rel="noopener noreferrer">
 abra uma issue no GitHub
 </a>{' '}
 descrevendo o problema, o leitor de tela ou dispositivo usado e o comportamento esperado.
 Respondemos em até 5 dias úteis.
 </p>
 </article>

 <article className="topico">
 <h2>Auditorias</h2>
 <p>
 Auditorias automáticas de acessibilidade rodam semanalmente via Lighthouse CI.
 O último relatório está disponível no repositório do projeto.
 </p>
 </article>
 </section>
 );
}