// Página de tutorial: guia passo a passo para começar a usar o DivergeGo.
// Substitui o markup estático com navegação reativa entre etapas.
import { useState } from 'react';

const ETAPAS = [
  {
    id: 'inicio',
    titulo: '🚀 Começando',
    conteudo: 'O DivergeGo é um playground de Go que roda inteiramente no seu navegador. Não precisa instalar nada — basta abrir esta página e começar a codar.',
  },
  {
    id: 'editor',
    titulo: '✏️ O editor',
    conteudo: 'O editor aceita código Go com realce de sintaxe, autocompletar e atalhos de teclado (Ctrl+Enter para executar). Você pode redimensionar o painel arrastando a borda.',
  },
  {
    id: 'terminal',
    titulo: '💻 O terminal',
    conteudo: 'A saída do seu programa aparece no terminal abaixo do editor. Erros de compilação são destacados em vermelho com o número da linha.',
  },
  {
    id: 'trilha',
    titulo: '🗺️ A trilha',
    conteudo: 'Na página Trilha você encontra exercícios organizados por módulo. Cada exercício tem um enunciado, testes automatizados e dicas progressivas.',
  },
  {
    id: 'certificado',
    titulo: '🎓 Certificados',
    conteudo: 'Ao completar todos os exercícios de um módulo, você recebe um certificado verificável. Ele pode ser impresso, baixado em SVG ou compartilhado pelo link.',
  },
  {
    id: 'acessibilidade',
    titulo: '♿ Acessibilidade',
    conteudo: 'Use o botão ♿ no canto superior direito para escolher tema, tamanho de texto e perfil neurodivergente. Todas as preferências ficam salvas no seu navegador.',
  },
];

export default function TutorialGo() {
  const [etapaAtual, setEtapaAtual] = useState(0);

  const anterior = () => setEtapaAtual((prev) => Math.max(0, prev - 1));
  const proxima = () => setEtapaAtual((prev) => Math.min(ETAPAS.length - 1, prev + 1));

  return (
    <section className="tutorial">
      <header className="tutorial-header">
        <h1>📘 Tutorial</h1>
        <p className="subtitulo">
          Guia rápido para começar a usar o DivergeGo.
        </p>
      </header>

      <div className="tutorial-navegacao">
        <button
          type="button"
          className="btn btn-fantasma"
          onClick={anterior}
          disabled={etapaAtual === 0}
        >
          ← Anterior
        </button>
        <span className="tutorial-progresso">
          {etapaAtual + 1} / {ETAPAS.length}
        </span>
        <button
          type="button"
          className="btn btn-fantasma"
          onClick={proxima}
          disabled={etapaAtual === ETAPAS.length - 1}
        >
          Próxima →
        </button>
      </div>

      <article className="tutorial-etapa">
        <h2>{ETAPAS[etapaAtual].titulo}</h2>
        <p>{ETAPAS[etapaAtual].conteudo}</p>
      </article>

      <nav className="tutorial-indice">
        <h3>Todas as etapas</h3>
        <ol>
          {ETAPAS.map((etapa, idx) => (
            <li key={etapa.id} className={idx === etapaAtual ? 'ativa' : ''}>
              <button
                type="button"
                className="btn-link"
                onClick={() => setEtapaAtual(idx)}
              >
                {etapa.titulo}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}