import { useCallback, useEffect, useRef, useState } from 'react';

interface Passo {
  titulo: string;
  descricao: string;
  alvo?: string; // seletor CSS opcional para highlight
}

const PASSOS_PADRAO: Passo[] = [
  {
    titulo: 'Bem-vindo ao DivergeGo! 👋',
    descricao: 'Este é um playground de Go no navegador. Você pode escrever código, compilar e executar sem instalar nada.',
  },
  {
    titulo: 'Editor de código ✏️',
    descricao: 'Escreva seu código Go aqui. O editor suporta syntax highlighting e salvamento automático de rascunhos.',
    alvo: '.editor-ilha',
  },
  {
    titulo: 'Terminal simulado 💻',
    descricao: 'Execute seu código com o botão "Executar" ou Ctrl+Enter. A saída aparece aqui como em um terminal real.',
    alvo: '.terminal-ilha',
  },
  {
    titulo: 'Progresso persistente 📊',
    descricao: 'Seu progresso fica salvo no navegador. Volte quando quiser e continue de onde parou!',
    alvo: '.barra-progresso',
  },
  {
    titulo: 'Acessibilidade ♿',
    descricao: 'Clique no botão ♿ para ajustar tema, tamanho do texto e outras preferências de leitura.',
    alvo: '#btn-acessibilidade',
  },
];

/**
 * Ilha React que exibe um tutorial interativo passo-a-passo.
 * Conecta-se ao botão #btn-tutorial do layout Base.astro via event listener.
 */
export default function TutorialInterativo() {
  const [ativo, setAtivo] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Escuta cliques no botão #btn-tutorial do layout
  useEffect(() => {
    const btn = document.getElementById('btn-tutorial');
    if (!btn) return;

    const abrir = () => {
      setAtivo(true);
      setPassoAtual(0);
      dialogRef.current?.showModal();
    };

    btn.addEventListener('click', abrir);
    return () => btn.removeEventListener('click', abrir);
  }, []);

  const fechar = useCallback(() => {
    dialogRef.current?.close();
    setAtivo(false);
    setPassoAtual(0);
  }, []);

  const proximo = useCallback(() => {
    if (passoAtual < PASSOS_PADRAO.length - 1) {
      setPassoAtual((p) => p + 1);
    } else {
      fechar();
    }
  }, [passoAtual, fechar]);

  const anterior = useCallback(() => {
    if (passoAtual > 0) {
      setPassoAtual((p) => p - 1);
    }
  }, [passoAtual]);

  // Highlight do elemento alvo (se existir)
  useEffect(() => {
    if (!ativo) return;
    const passo = PASSOS_PADRAO[passoAtual];
    if (!passo.alvo) return;

    const el = document.querySelector(passo.alvo);
    if (!el) return;

    el.classList.add('tutorial-highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return () => el.classList.remove('tutorial-highlight');
  }, [ativo, passoAtual]);

  const passo = PASSOS_PADRAO[passoAtual];
  const ehUltimo = passoAtual === PASSOS_PADRAO.length - 1;

  return (
    <dialog
      ref={dialogRef}
      className="dialogo-tutorial"
      aria-labelledby="titulo-tutorial"
      style={{
        maxWidth: '28rem',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--cor-borda, #444)',
        backgroundColor: 'var(--cor-fundo-card, #2d2f3d)',
        color: 'inherit',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 id="titulo-tutorial" style={{ margin: 0, fontSize: '1.1rem' }}>
          {passo.titulo}
        </h2>
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar tutorial"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
          }}
        >
          ×
        </button>
      </header>

      <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem' }}>{passo.descricao}</p>

      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
          {passoAtual + 1} / {PASSOS_PADRAO.length}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {passoAtual > 0 && (
            <button
              type="button"
              onClick={anterior}
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.9rem',
                border: '1px solid var(--cor-borda, #444)',
                borderRadius: '0.25rem',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              ← Voltar
            </button>
          )}
          <button
            type="button"
            onClick={proximo}
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '0.25rem',
              backgroundColor: '#50fa7b',
              color: '#282a36',
              cursor: 'pointer',
            }}
          >
            {ehUltimo ? 'Concluir ✓' : 'Próximo →'}
          </button>
        </div>
      </footer>
    </dialog>
  );
}