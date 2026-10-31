import { useEffect, useRef } from 'react';
import { renderValidador } from '../ui/validador.js';

interface ValidadorCertificadoProps {
  codigoInicial?: string;
  aoRestaurar?: () => void;
}

/**
 * Ilha React que monta o validador de certificados (vanilla JS) dentro de um container.
 * O validador original é reutilizado sem reescrita; o React só gerencia o ciclo de vida via ref.
 */
export default function ValidadorCertificado({ codigoInicial = '', aoRestaurar }: ValidadorCertificadoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const montadoRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || montadoRef.current) return;

    // Marca como montado para evitar dupla inicialização em StrictMode
    montadoRef.current = true;

    // Monta o validador vanilla no container do React
    renderValidador(containerRef.current, codigoInicial, {
      aoRestaurar: aoRestaurar ?? (() => {}),
    });

    return () => {
      // Limpa o conteúdo do validador ao desmontar a ilha
      montadoRef.current = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="validador-certificado-container"
      style={{
        minHeight: '16rem',
        border: '1px solid var(--cor-borda, #444)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
      }}
      aria-label="Validador de certificados DivergeGo"
    />
  );
}