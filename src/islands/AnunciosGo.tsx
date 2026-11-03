// Página de anúncios: comunicados importantes e avisos da equipe.
// Substitui o markup estático com lista reativa de comunicados.
const ANUNCIOS = [
  {
    id: 'manutencao-2026-11',
    titulo: 'Manutenção programada',
    data: '2026-11-05',
    tipo: 'aviso',
    conteudo: 'O DivergeGo ficará indisponível no dia 10/11 das 02h às 06h (horário de Brasília) para atualização de infraestrutura.',
  },
  {
    id: 'novo-modulo-web',
    titulo: 'Novo módulo: Web com Go',
    data: '2026-10-31',
    tipo: 'novidade',
    conteudo: 'O módulo de Web está disponível na trilha! Aprenda a criar servidores HTTP, APIs JSON e middleware.',
  },
  {
    id: 'certificados-v2',
    titulo: 'Certificados com verificação pública',
    data: '2026-10-29',
    tipo: 'melhoria',
    conteudo: 'Os certificados agora podem ser verificados por qualquer pessoa sem cadastro. Veja como na página Validar.',
  },
];

export default function AnunciosGo() {
  return (
    <section className="anuncios">
      <header className="anuncios-header">
        <h1>📢 Anúncios</h1>
        <p className="subtitulo">
          Comunicados importantes, novidades e avisos da equipe do DivergeGo.
        </p>
      </header>

      <div className="anuncios-lista">
        {ANUNCIOS.map((anuncio) => (
          <article key={anuncio.id} className={`anuncio-card anuncio-${anuncio.tipo}`}>
            <header className="anuncio-header">
              <span className={`anuncio-tipo tipo-${anuncio.tipo}`}>
                {anuncio.tipo === 'aviso' ? '⚠️ Aviso' : anuncio.tipo === 'novidade' ? '🆕 Novidade' : '✨ Melhoria'}
              </span>
              <time className="anuncio-data" dateTime={anuncio.data}>
                {new Date(anuncio.data).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </header>
            <h2>{anuncio.titulo}</h2>
            <p>{anuncio.conteudo}</p>
          </article>
        ))}
      </div>

      {ANUNCIOS.length === 0 && (
        <p className="anuncios-vazio">Nenhum anúncio no momento.</p>
      )}
    </section>
  );
}