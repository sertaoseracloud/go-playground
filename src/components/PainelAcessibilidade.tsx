import { useEffect, useRef } from 'react';
import { iniciarAcessibilidade } from '../ui/acessibilidade.js';

/**
 * Ilha React que monta o painel de acessibilidade (vanilla JS) e o conecta ao botão ♿ do layout.
 * O componente original é reutilizado sem reescrita; o React só gerencia o ciclo de vida.
 */
export default function PainelAcessibilidade() {
  const iniciadoRef = useRef(false);

  useEffect(() => {
    if (iniciadoRef.current) return;
    iniciadoRef.current = true;

    // Conecta o botão ♿ ao diálogo <dialog id="dialogo-a11y"> já presente no layout Base.astro
    iniciarAcessibilidade();

    return () => {
      iniciadoRef.current = false;
    };
  }, []);

  // Esta ilha não renderiza DOM próprio; apenas ativa os bindings no layout existente.
  return null;
}