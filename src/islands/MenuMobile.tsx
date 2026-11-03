// Menu ☰ responsivo: painel de navegação no celular com acessibilidade completa.
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  base: string;
  atual?: string;
}

export default function MenuMobile({ base, atual }: Props) {
  const [aberto, setAberto] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const abrir = useCallback((valor: boolean) => {
    setAberto(valor);
    if (valor) {
      setTimeout(() => painelRef.current?.querySelector('a')?.focus(), 0);
    }
  }, []);

  useEffect(() => {
    const fora = (e: MouseEvent) => {
      if (aberto && !painelRef.current?.contains(e.target as Node) && !botaoRef.current?.contains(e.target as Node)) {
        abrir(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto) {
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

  const ativo = (nome: string) => (atual === nome ? { 'aria-current': 'page' as const, className: 'ativo' } : {});

  return (
    <div className="menu-mobile">
      <button
        ref={botaoRef}
        type="button"
        className="btn-menu"
        aria-expanded={aberto}
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => abrir(!aberto)}
      >
        <span aria-hidden="true">{aberto ? '✕' : '☰'}</span>
      </button>
      <div ref={painelRef} className={`menu-painel ${aberto ? 'aberto' : ''}`} hidden={!aberto}>
        <nav aria-label="Principal mobile">
          <a href={`${base}trilha/`} {...ativo('trilha')} onClick={() => abrir(false)}>🗺️ Trilha</a>
          <a href={`${base}livre/`} {...ativo('livre')} onClick={() => abrir(false)}>🧪 Playground livre</a>
          <a href={`${base}validar/`} {...ativo('validar')} onClick={() => abrir(false)}>🔎 Validar certificado</a>
          <a href={`${base}instrutor/`} {...ativo('instrutor')} onClick={() => abrir(false)}>👨‍🏫 Instrutor</a>
        </nav>
      </div>
    </div>
  );
}