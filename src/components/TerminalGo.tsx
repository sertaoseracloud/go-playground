import { useEffect, useRef } from 'react';
import { criarTerminal } from '../ui/terminal.js';

interface TerminalGoProps {
  historico?: string[];
}

/**
 * Ilha React que monta o terminal simulado (vanilla JS) dentro de um container.
 * O terminal original é reutilizado sem reescrita; o React só gerencia o ciclo de vida via ref.
 */
export default function TerminalGo({ historico = [] }: TerminalGoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<ReturnType<typeof criarTerminal> | null>(null);

  useEffect(() => {
    if (!containerRef.current || terminalRef.current) return;

    // Monta o terminal vanilla no container do React
    terminalRef.current = criarTerminal(containerRef.current, {
      historico,
    });

    return () => {
      // Limpa o conteúdo do terminal ao desmontar a ilha
      terminalRef.current?.limpar();
      terminalRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="terminal-go-container"
      style={{
        minHeight: '12rem',
        maxHeight: '24rem',
        overflow: 'auto',
        border: '1px solid var(--cor-borda, #444)',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        fontFamily: 'var(--fonte-codigo, monospace)',
        fontSize: '0.9rem',
        backgroundColor: 'var(--cor-fundo-terminal, #1e1f29)',
      }}
      role="log"
      aria-label="Terminal simulado Go"
      aria-live="polite"
    />
  );
}