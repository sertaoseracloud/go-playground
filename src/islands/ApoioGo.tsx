// Página de apoio: como contribuir, reportar bugs e apoiar o projeto.
// Substitui o markup estático com conteúdo reativo e links externos.
export default function ApoioGo() {
 return (
 <section className="apoio">
 <h1>💚 Apoie o DivergeGo</h1>
 <p className="subtitulo">
 O DivergeGo é um projeto aberto mantido por voluntários. Existem várias formas de contribuir.
 </p>

 <article className="topico">
 <h2>Contribua com código</h2>
 <p>
 O repositório está no{' '}
 <a href="https://github.com/sertaoseracloud/go-playground" target="_blank" rel="noopener noreferrer">
 GitHub
 </a>. Issues rotuladas como <code>good first issue</code> são ideais para começar.
 Leia o <code>CONTRIBUTING.md</code> antes de abrir um pull request.
 </p>
 </article>

 <article className="topico">
 <h2>Reporte problemas</h2>
 <p>
 Encontrou um bug, uma barreira de acessibilidade ou um erro no conteúdo?{' '}
 <a href="https://github.com/sertaoseracloud/go-playground/issues/new" target="_blank" rel="noopener noreferrer">
 Abra uma issue
 </a>{' '}
 descrevendo o comportamento esperado e o observado. Screenshots e vídeos ajudam muito.
 </p>
 </article>

 <article className="topico">
 <h2>Sugira melhorias</h2>
 <p>
 Tem ideia de um exercício novo, um recurso de acessibilidade ou uma melhoria na trilha?{' '}
 <a href="https://github.com/sertaoseracloud/go-playground/discussions" target="_blank" rel="noopener noreferrer">
 Abra uma discussão
 </a>{' '}
 no GitHub. A comunidade vota e prioriza as sugestões.
 </p>
 </article>

 <article className="topico">
 <h2>Divulgue</h2>
 <p>
 Compartilhe o DivergeGo com colegas, alunos, amigos e redes sociais.{' '}
 Quanto mais pessoas aprenderem Go de forma acessível, melhor.
 </p>
 </article>

 <article className="topico">
 <h2>Apoio financeiro</h2>
 <p>
 No momento não aceitamos doações diretas. Se quiser apoiar financeiramente,{' '}
 considere patrocinar os mantenedores via GitHub Sponsors quando disponível.
 </p>
 </article>

 <article className="topico">
 <h2>Tradução e localização</h2>
 <p>
 Quer traduzir o DivergeGo para outro idioma? Entre em contato pelo GitHub.{' '}
 A estrutura já suporta i18n; precisamos de tradutores e revisores.
 </p>
 </article>
 </section>
 );
}