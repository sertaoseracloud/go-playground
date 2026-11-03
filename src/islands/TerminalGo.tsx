// Ilha do terminal Go: envolve criarTerminal (src/ui/terminal.js) numa ilha React
// para ser montada nas páginas de exercício e no playground livre.
import { useEffect, useRef } from 'react';
import { lerHistorico, gravarHistorico } from '../progresso.js';

interface Props {
  itemId: string;
  aoExecutar?: (comando: string) => void;
}

export default function TerminalGo({ itemId, aoExecutar }: Props) {
  const containerRef = useRef<HTMLPreElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rotuloRef = useRef<HTMLSpanElement>(null);
  const instancia = useRef<any>(null);

  useEffect(() => {
    let cancelado = false;

    async function montar() {
      const { criarTerminal } = await import('../ui/terminal.js');
      if (cancelado || !containerRef.current) return;

      const historico = lerHistorico();
      const term = criarTerminal(containerRef.current, {
        campo: inputRef.current ?? undefined,
        rotulo: rotuloRef.current ?? undefined,
        historico,
        aoMudarHistorico: (lista: string[]) => gravarHistorico(lista),
        completar: (_texto: string) => [],
      });

      instancia.current = term;
      term.foco();
    }

    montar();
    return () => { cancelado = true; };
  }, [itemId]);

  return (
    <div className="terminal-go" data-item-id={itemId}>
      <pre
        ref={containerRef}
        className="terminal"
        role="log"
        aria-label="Terminal simulado"
        tabIndex={0}
      />
      <span ref={rotuloRef} className="sr" aria-live="polite" />
      <input
        ref={inputRef}
        type="text"
        className="campo-terminal sr"
        aria-label="Entrada do terminal"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}