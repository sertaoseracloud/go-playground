// Página da trilha: lista módulos e itens com progresso, desbloqueio e acessibilidade.
// Substitui o markup estático de trilha/index.astro com dados reativos do store.
import { useStore } from '@nanostores/react';
import { $progresso } from '../stores/progresso';
import { modulosPublicados, proximosModulos, todosOsItens } from '../lib/conteudo';
import { url } from '../lib/rotas';

function statusItem(itemId: string, progresso: Record<string, any> | undefined) {
  if (!progresso?.[itemId]) return 'pendente';
  if (progresso[itemId].resolvido) return 'concluido';
  return 'em-andamento';
}

function iconeStatus(status: string) {
  switch (status) {
    case 'concluido': return '✅';
    case 'em-andamento': return '🔄';
    default: return '';
  }
}

export default function TrilhaGo() {
  const progresso = useStore($progresso);

  return (
    <section className="trilha">
      <h1>🗺️ Trilha de Go</h1>
      <p className="subtitulo">
        {todosOsItens.length} atividades distribuídas em {modulosPublicados.length} módulos publicados.
      </p>

      {modulosPublicados.map((modulo) => (
        <article key={modulo.id} className="modulo" id={modulo.id}>
          <header>
            <h2>{modulo.icone ?? ''} {modulo.titulo}</h2>
          </header>
          <ul className="itens">
            {modulo.itens.map((item) => {
              const status = statusItem(item.id, progresso);
              return (
                <li key={item.id} className={`item ${item.tipo} ${status}`}>
                  <a href={url.exercicio(item.id)}>
                    <span className="tipo">{item.tipo === 'licao' ? '📖' : '🧩'}</span>
                    <span className="titulo">{item.titulo}</span>
                    <span className="status-icon" aria-label={`Status: ${status}`}>
                      {iconeStatus(status)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </article>
      ))}

      {proximosModulos.length > 0 && (
        <section className="em-breve">
          <h2>Em breve</h2>
          <ul>
            {proximosModulos.map((m) => (
              <li key={m.id} className="modulo-futuro">
                <span aria-hidden="true">{m.icone}</span> {m.titulo}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}