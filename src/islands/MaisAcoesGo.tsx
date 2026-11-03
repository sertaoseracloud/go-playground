// Widget de ações contextuais: menu suspenso com opções relevantes à página atual.
// Substitui o markup estático com detecção reativa de rota e ações dinâmicas.
import { useState, useEffect } from 'react';

interface Acao {
  id: string;
  label: string;
  icone: string;
  href?: string;
  onClick?: () => void;
}

export default function MaisAcoesGo() {
  const [aberto, setAberto] = useState(false);
  const [acoes, setAcoes] = useState<Acao[]>([]);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';

    const acoesComuns: Acao[] = [
      { id: 'preferencias', label: 'Preferências', icone: '⚙️', href: `${import.meta.env.BASE_URL}preferencias/` },
      { id: 'acessibilidade', label: 'Acessibilidade', icone: '♿', href: `${import.meta.env.BASE_URL}acessibilidade/` },
      { id: 'privacidade', label: 'Privacidade', icone: '🔒', href: `${import.meta.env.BASE_URL}privacidade/` },
    ];

    const acoesPorPagina: Record<string, Acao[]> = {
      trilha: [
        { id: 'resetar-progresso', label: 'Resetar progresso', icone: '🗑️', onClick: () => {
          if (confirm('Isso apaga todo o seu progresso na trilha. Tem certeza?')) {
            localStorage.removeItem('divergego:progresso');
            window.location.reload();
          }
        }},
      ],
      livre: [
        { id: 'limpar-editor', label: 'Limpar editor', icone: '🧹', onClick: () => {
          localStorage.removeItem('divergego:rascunho-livre');
          window.location.reload();
        }},
      ],
      certificado: [
        { id: 'validar', label: 'Validar certificado', icone: '🔍', href: `${import.meta.env.BASE_URL}validar/` },
      ],
    };

    setAcoes([...(acoesPorPagina[path] || []), ...acoesComuns]);
  }, []);

  const toggle = () => setAberto((prev) => !prev);

  useEffect(() => {
    const fechar = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.mais-acoes-widget')) {
        setAberto(false);
      }
    };
    document.addEventListener('click', fechar);
    return () => document.removeEventListener('click', fechar);
  }, []);

  return (
    <div className="mais-acoes-widget">
      <button
        type="button"
        className={`btn-mais-acoes ${aberto ? 'aberto' : ''}`}
        onClick={toggle}
        aria-expanded={aberto}
        aria-haspopup="true"
        aria-label="Mais ações"
      >
        ⋮
      </button>

      {aberto && (
        <ul className="mais-acoes-menu" role="menu">
          {acoes.map((acao) => (
            <li key={acao.id} role="none">
              {acao.href ? (
                <a href={acao.href} role="menuitem" className="mais-acoes-item">
                  <span aria-hidden="true">{acao.icone}</span>
                  {acao.label}
                </a>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  className="mais-acoes-item"
                  onClick={() => {
                    acao.onClick?.();
                    setAberto(false);
                  }}
                >
                  <span aria-hidden="true">{acao.icone}</span>
                  {acao.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}