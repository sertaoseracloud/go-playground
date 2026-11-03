// Página Sobre: informações do projeto, equipe e missão.
// Substitui o markup estático com seções expansíveis e timeline reativa.
import { useState } from 'react';

interface Marco {
  ano: string;
  titulo: string;
  descricao: string;
}

const MARCOS: Marco[] = [
  { ano: '2024', titulo: '🚀 Lançamento inicial', descricao: 'Primeira versão do playground Go em HTML/CSS/JS puro.' },
  { ano: '2025', titulo: '📚 Trilha de aprendizado', descricao: 'Módulos sequenciais com exercícios progressivos e certificados.' },
  { ano: '2026', titulo: '⚡ Migração para Astro', descricao: 'Reescrita completa com React Islands, acessibilidade WCAG 2.1 AA e VLibras.' },
];

interface Equipe {
  nome: string;
  papel: string;
  bio: string;
}

const EQUIPE: Equipe[] = [
  { nome: 'Ana Rodrigues', papel: 'Líder técnica', bio: 'Engenheira de software sênior especializada em Go e educação tecnológica.' },
  { nome: 'Carlos Mendes', papel: 'Designer UX', bio: 'Designer focado em acessibilidade e experiências de aprendizado inclusivas.' },
  { nome: 'Julia Santos', papel: 'Educadora', bio: 'Professora de computação com 10 anos de experiência em ensino de programação.' },
];

export default function SobreGo() {
  const [secaoAberta, setSecaoAberta] = useState<string | null>('missao');

  const toggle = (id: string) => setSecaoAberta((prev) => (prev === id ? null : id));

  return (
    <section className="sobre">
      <header className="sobre-header">
        <h1>🌟 Sobre o DivergeGo</h1>
        <p className="subtitulo">
          Uma plataforma gratuita e acessível para aprender Go, construída pela comunidade para a comunidade.
        </p>
      </header>

      <div className="sobre-secoes">
        <article className={`sobre-card ${secaoAberta === 'missao' ? 'aberta' : ''}`}>
          <button type="button" className="sobre-toggle" onClick={() => toggle('missao')} aria-expanded={secaoAberta === 'missao'}>
            <span>🎯 Nossa missão</span>
            <span className="toggle-icone" aria-hidden="true">{secaoAberta === 'missao' ? '−' : '+'}</span>
          </button>
          {secaoAberta === 'missao' && (
            <p className="sobre-conteudo">
              Democratizar o acesso ao aprendizado de Go no Brasil, oferecendo uma plataforma gratuita,
              acessível e em português que respeita a privacidade dos usuários e funciona inteiramente no navegador.
            </p>
          )}
        </article>

        <article className={`sobre-card ${secaoAberta === 'equipe' ? 'aberta' : ''}`}>
          <button type="button" className="sobre-toggle" onClick={() => toggle('equipe')} aria-expanded={secaoAberta === 'equipe'}>
            <span>👥 Equipe</span>
            <span className="toggle-icone" aria-hidden="true">{secaoAberta === 'equipe' ? '−' : '+'}</span>
          </button>
          {secaoAberta === 'equipe' && (
            <ul className="sobre-equipe-lista">
              {EQUIPE.map((membro) => (
                <li key={membro.nome} className="sobre-membro">
                  <strong>{membro.nome}</strong> — {membro.papel}
                  <p>{membro.bio}</p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={`sobre-card ${secaoAberta === 'timeline' ? 'aberta' : ''}`}>
          <button type="button" className="sobre-toggle" onClick={() => toggle('timeline')} aria-expanded={secaoAberta === 'timeline'}>
            <span>📅 Linha do tempo</span>
            <span className="toggle-icone" aria-hidden="true">{secaoAberta === 'timeline' ? '−' : '+'}</span>
          </button>
          {secaoAberta === 'timeline' && (
            <ol className="sobre-timeline">
              {MARCOS.map((marco) => (
                <li key={marco.ano} className="timeline-item">
                  <span className="timeline-ano">{marco.ano}</span>
                  <strong>{marco.titulo}</strong>
                  <p>{marco.descricao}</p>
                </li>
              ))}
            </ol>
          )}
        </article>
      </div>

      <article className="topico">
        <h2>Código aberto</h2>
        <p>
          O DivergeGo é um projeto open source. Contribua no{' '}
          <a href="https://github.com/divergego/go-playground" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
      </article>
    </section>
  );
}