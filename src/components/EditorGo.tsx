import { useEffect, useRef } from 'react';
import { EditorArquivos } from '../ui/editor.js';

interface EditorGoProps {
  inicial?: string;
  onChange?: (arquivos: Record<string, string>) => void;
}

/**
 * Ilha React que monta o EditorArquivos (vanilla JS + CodeMirror) dentro de um container.
 * O editor original é reutilizado sem reescrita; o React só gerencia o ciclo de vida via ref.
 */
export default function EditorGo({ inicial = '', onChange }: EditorGoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<InstanceType<typeof EditorArquivos> | null>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    // Cria o elemento onde o CodeMirror será montado (o construtor espera { editor })
    const editorEl = document.createElement('div');
    editorEl.style.minHeight = '20rem';
    containerRef.current.appendChild(editorEl);

    // aoMudar é () => void na API vanilla; lemos os arquivos do editor após a mudança
    const handleChange = () => {
      if (onChange && editorRef.current) {
        onChange(editorRef.current.arquivos as Record<string, string>);
      }
    };

    // Monta o editor vanilla com a API correta: único argumento objeto
    editorRef.current = new EditorArquivos({
      editor: editorEl,
      abas: null, // sem abas no playground livre
      aoMudar: onChange ? handleChange : undefined,
    });

    // Define o conteúdo inicial se fornecido
    if (inicial && editorRef.current) {
      const principal = editorRef.current.principal;
      if (principal) {
        (editorRef.current.arquivos as Record<string, string>)[principal] = inicial;
      }
    }

    return () => {
      // Destrói a view do CodeMirror ao desmontar a ilha
      editorRef.current?.view?.destroy();
      editorRef.current = null;
      if (containerRef.current && editorEl.parentNode === containerRef.current) {
        containerRef.current.removeChild(editorEl);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="editor-go-container"
      style={{ minHeight: '20rem', border: '1px solid var(--cor-borda, #444)', borderRadius: '0.5rem' }}
      aria-label="Editor de código Go"
    />
  );
}