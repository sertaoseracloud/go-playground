// Página 404: conteúdo não encontrado com navegação de retorno.
// Substitui o markup estático com links reativos para páginas principais.
export default function NaoEncontradaGo() {
 return (
 <section className="nao-encontrada">
 <h1>😕 Página não encontrada</h1>
 <p className="subtitulo">
 O conteúdo que você procura não existe ou foi movido.
 </p>

 <div className="acoes-404">
 <a href={`${import.meta.env.BASE_URL}`} className="btn btn-verde btn-grande">
 🏠 Voltar ao início
 </a>
 <a href={`${import.meta.env.BASE_URL}trilha/`} className="btn btn-fantasma">
 🗺️ Ir para a trilha
 </a>
 </div>

 <article className="topico">
 <h2>O que pode ter acontecido</h2>
 <ul>
 <li>O link está errado ou desatualizado.</li>
 <li>A página foi removida ou renomeada em uma atualização recente.</li>
 <li>Você digitou o endereço manualmente e há um erro de digitação.</li>
 </ul>
 </article>

 <article className="topico">
 <h2>Precisa de ajuda?</h2>
 <p>
 Se você chegou aqui por um link dentro do próprio DivergeGo,{' '}
 <a href="https://github.com/sertaoseracloud/go-playground/issues/new" target="_blank" rel="noopener noreferrer">
 abra uma issue no GitHub
 </a>{' '}
 informando o link quebrado. Corrigimos links internos rapidamente.
 </p>
 </article>
 </section>
 );
}