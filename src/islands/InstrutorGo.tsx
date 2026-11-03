// Página do instrutor: biografia, credenciais e links de contato.
// Substitui o markup estático de instrutor/index.astro com dados reativos.
import { INSTRUTOR } from '../instrutor.js';

export default function InstrutorGo() {
  return (
    <section className="instrutor">
      <header className="instrutor-header">
        {INSTRUTOR.avatar && (
          <img
            src={INSTRUTOR.avatar}
            alt={`Foto de ${INSTRUTOR.nome}`}
            className="instrutor-avatar"
            loading="lazy"
          />
        )}
        <div>
          <h1>{INSTRUTOR.nome}</h1>
          <p className="instrutor-titulo">{INSTRUTOR.titulo}</p>
        </div>
      </header>

      <article className="instrutor-bio">
        <h2>Sobre</h2>
        <p>{INSTRUTOR.bio}</p>
      </article>

      {INSTRUTOR.credenciais && INSTRUTOR.credenciais.length > 0 && (
        <section className="instrutor-credenciais">
          <h2>Credenciais</h2>
          <ul>
            {INSTRUTOR.credenciais.map((credencial, idx) => (
              <li key={idx}>{credencial}</li>
            ))}
          </ul>
        </section>
      )}

      {INSTRUTOR.links && INSTRUTOR.links.length > 0 && (
        <section className="instrutor-links">
          <h2>Links</h2>
          <ul>
            {INSTRUTOR.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {INSTRUTOR.contato && (
        <section className="instrutor-contato">
          <h2>Contato</h2>
          <p>{INSTRUTOR.contato}</p>
        </section>
      )}
    </section>
  );
}