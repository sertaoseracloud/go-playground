// Mural de apoio: mensagens da comunidade e agradecimentos.
// Substitui o markup estático com lista reativa de apoiadores.
const APOIADORES = [
  { nome: 'Comunidade Go Brasil', tipo: 'comunidade', mensagem: 'Obrigado por tornar Go acessível para todos.' },
  { nome: 'Grupo de Estudos TDAH & Tech', tipo: 'grupo', mensagem: 'Recursos neurodivergentes mudaram minha forma de aprender.' },
  { nome: 'Professores de TI Inclusiva', tipo: 'educacao', mensagem: 'Usamos o DivergeGo em salas com alunos cegos e surdos.' },
  { nome: 'Contribuidores Open Source', tipo: 'codigo', mensagem: 'Cada PR conta. Continuem assim!' },
];

export default function MuralApoioGo() {
  return (
    <section className="mural-apoio">
      <header className="mural-header">
        <h1>💚 Mural de Apoio</h1>
        <p className="subtitulo">
          Mensagens de quem usa, contribui e acredita no DivergeGo.
        </p>
      </header>

      <div className="mural-grid">
        {APOIADORES.map((apoiador, idx) => (
          <article key={idx} className={`mural-card mural-${apoiador.tipo}`}>
            <h2>{apoiador.nome}</h2>
            <blockquote>{apoiador.mensagem}</blockquote>
          </article>
        ))}
      </div>

      <article className="topico">
        <h2>Quer aparecer aqui?</h2>
        <p>
          Envie sua mensagem pelo{' '}
          <a href="https://github.com/sertaoseracloud/go-playground/discussions" target="_blank" rel="noopener noreferrer">
            GitHub Discussions
          </a>{' '}
          ou abra um PR adicionando sua entrada neste mural.
        </p>
      </article>
    </section>
  );
}