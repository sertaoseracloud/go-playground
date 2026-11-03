// "⋯ Mais ações" na barra do exercício: menu disclosure com acessibilidade completa.
import { useCallback, useEffect, useRef, useState } from 'react';

interface Acao {
  rotulo: string;
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  acoes: Acao[];
}

export default function MaisAcoes({ acoes }: Props) {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const abrir = useCallback((valor: boolean) => {
    setAberto(valor);
    if (valor) {
      setTimeout(() => {
        menuRef.current?.querySelector('button:not([disabled]):not([hidden])')?.focus();
      }, 0);
    }
  }, []);

  useEffect(() => {
    const fora = (e: MouseEvent) => {
      if (aberto && !menuRef.current?.contains(e.target as Node) && !botaoRef.current?.contains(e.target as Node)) {
        abrir(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto) {
        e.preventDefault();
        abrir(false);
        botaoRef.current?.focus();
      }
    };
    document.addEventListener('click', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('click', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  // Fecha ao sair do menu com Tab
  useEffect(() => {
    if (!aberto) return;
    const focusout = (e: FocusEvent) => {
      if (!menuRef.current?.parentElement?.contains(e.relatedTarget as Node)) {
        abrir(false);
      }
    };
    menuRef.current?.parentElement?.addEventListener('focusout', focusout);
    return () => menuRef.current?.parentElement?.removeEventListener('focusout', focusout);
  }, [aberto]);

  return (
    <div className="mais-acoes-wrapper">
      <button
        ref={botaoRef}
        type="button"
        className="btn btn-fantasma"
        aria-expanded={aberto}
        aria-label="Mais ações"
        onClick={() => abrir(!aberto)}
      >
        ⋯ Mais ações
      </button>
      <div ref={menuRef} className="menu-mais-acoes" hidden={!aberto} role="menu">
        {acoes.map((acao, i) => (
          <button
            key={i}
            type="button"
            role="menuitem"
            disabled={acao.disabled}
            onClick={() => {
              abrir(false);
              acao.onClick();
            }}
          >
            {acao.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}