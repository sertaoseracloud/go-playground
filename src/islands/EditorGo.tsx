// Ilha do editor Go: envolve a classe EditorArquivos (src/ui/editor.js) numa
// ilha React para ser montada nas páginas de exercício e no playground livre.
import { useEffect, useRef, useCallback } from 'react';
import { lerRascunho, gravarRascunho } from '../progresso.js';

type Arquivos = Record<string, string>;

interface Props {
  itemId: string;
  arquivos: Arquivos;
  aoExecutar?: () => void;
  aoEnviar?: () => void;
}

export default function EditorGo({ itemId, arquivos, aoExecutar, aoEnviar }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const abasRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const instancia = useRef<any>(null);

  // Carrega o rascunho salvo ou usa os arquivos iniciais do item.
  const inicial = useCallback((): Arquivos => {
    const salvo = lerRascunho(itemId);
    if (salvo && typeof salvo === 'object') return salvo as Arquivos;
    return arquivos;
  }, [itemId, arquivos]);

  useEffect(() => {
    let cancelado = false;

    async function montar() {
      const { EditorArquivos } = await import('../ui/editor.js');
      if (cancelado || !abasRef.current || !editorRef.current) return;

      const inst = new EditorArquivos({
        abas: abasRef.current,
        editor: editorRef.current,
        aoMudar: (arqs: Arquivos) => gravarRascunho(itemId, arqs),
        aoExecutar: aoExecutar ?? (() => {}),
        aoEnviar: aoEnviar ?? (() => {}),
      });

      inst.carregar(inicial());
      instancia.current = inst;
    }

    montar();
    return () => { cancelado = true; };
  }, [itemId, inicial, aoExecutar, aoEnviar]);

  return (
    <div ref={containerRef} className="editor-go" data-item-id={itemId}>
      <div ref={abasRef} className="abas-arquivos" role="tablist" aria-label="Arquivos do projeto" />
      <div ref={editorRef} className="editor-container" />
    </div>
  );
}