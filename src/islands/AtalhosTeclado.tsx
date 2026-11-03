// Painel de atalhos de teclado: overlay acessível com lista de combinações.
// Abre com ? ou pelo botão no painel de acessibilidade.
import { useCallback, useEffect, useRef, useState } from 'react';

interface Atalho {
  teclas: string;
  descricao: string;
  escopo?: string;
}

const ATALHOS: Atalho[] = [
  { teclas: 'Ctrl + Enter', descricao: 'Executar código', escopo: 'Editor' },
  { teclas: 'Ctrl + Shift + Enter', descricao: 'Enviar para correção', escopo: 'Editor' },
  { teclas: 'Esc', descricao: 'Fechar diálogo / menu aberto', escopo: 'Global' },
  { teclas: '?', descricao: 'Abrir/fechar esta ajuda', escopo: 'Global' },
  { teclas: 'Alt + 1-9', descricao: 'Trocar de aba de arquivo', escopo: 'Editor' },
  { teclas: 'Ctrl + S', descricao: 'Salvar rascunho (auto)', escopo: 'Editor' },
];

export default function AtalhosTeclado() {
  const [aberto, setAberto] = useState(false);
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const abrir = useCallback(() => {
    setAberto(true);
    setTimeout(() => dialogoRef.current?.showModal(), 0);
  }, []);

  const fechar = useCallback(() => {
    setAberto(false);
    dialogoRef.current?.close();
    botaoRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignorar se estiver num input/textarea/editor
      const alvo = e.target as HTMLElement;
      if (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.closest('.cm-editor')) return;
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        if (aberto) fechar(); else abrir();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [aberto, abrir, fechar]);

  return (
    <>
      <button
        ref={botaoRef}
        type="button"
        className="flutuante"
        aria-label="Atalhos de teclado"
        data-rotulo="Atalhos"
        onClick={abrir}
      >
        <span aria-hidden="true">⌨️</span>
      </button>
      <dialog ref={dialogoRef} className="dialogo atalhos-dialogo" aria-labelledby="atalhos-titulo" onClose={() => setAberto(false)}>
        <h2 id="atalhos-titulo">Atalhos de teclado</h2>
        <table className="tabela-atalhos">
          <thead>
            <tr><th>Combinação</th><th>Ação</th><th>Escopo</th></tr>
          </thead>
          <tbody>
            {ATALHOS.map((a, i) => (
              <tr key={i}>
                <td><kbd>{a.teclas}</kbd></td>
                <td>{a.descricao}</td>
                <td>{a.escopo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <button type="button" className="btn btn-roxo" onClick={fechar}>Fechar</button>
        </p>
      </dialog>
    </>
  );
}