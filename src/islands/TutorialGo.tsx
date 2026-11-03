// Tutorial passo a passo em <dialog>, com destaque no elemento explicado.
// Abre sozinho na primeira visita à trilha e pelo botão "❓ Tutorial".
import { useCallback, useEffect, useRef, useState } from 'react';
import { PASSOS, PROBLEMA_DO_TUTORIAL } from '../ui/tutorial-passos.js';
import { lerPreferencia, gravarPreferencia } from '../progresso.js';

interface Props {
 base: string;
 telaAtual?: () => string;
}

export default function TutorialGo({ base, telaAtual }: Props) {
 const [aberto, setAberto] = useState(false);
 const [indice, setIndice] = useState(0);
 const dialogoRef = useRef<HTMLDialogElement>(null);

 const passos = PASSOS;

 const abrir = useCallback(() => {
 setIndice(0);
 setAberto(true);
 setTimeout(() => dialogoRef.current?.showModal(), 0);
 }, []);

 const fechar = useCallback(() => {
 setAberto(false);
 dialogoRef.current?.close();
 gravarPreferencia('tutorial-visto', true);
 }, []);

 const avancar = useCallback(() => {
 if (indice >= passos.length - 1) {
 fechar();
 return;
 }
 setIndice((i) => i + 1);
 }, [indice, passos.length, fechar]);

 const voltar = useCallback(() => {
 setIndice((i) => Math.max(0, i - 1));
 }, []);

 // Auto-abrir na primeira visita à trilha
 useEffect(() => {
 if (lerPreferencia('tutorial-visto')) return;
 const hash = typeof location !== 'undefined' ? location.hash : '';
 if (/^#\/trilha/.test(hash) || window.location.pathname.endsWith('/trilha/')) {
 abrir();
 }
 }, [abrir]);

 const passo = passos[indice];
 if (!passo) return null;

 return (
 <>
 <button
 type="button"
 className="flutuante"
 aria-label="Tutorial"
 data-rotulo="Tutorial"
 onClick={abrir}
 >
 <span aria-hidden="true">❓</span>
 </button>
 <dialog ref={dialogoRef} className="dialogo tutorial-dialogo" aria-labelledby="tutorial-titulo">
 <h2 id="tutorial-titulo">{passo.titulo}</h2>
 <p className="tutorial-passo">Passo {indice + 1} de {passos.length}</p>
 <div className="tutorial-texto" dangerouslySetInnerHTML={{ __html: passo.texto }} />
 <div className="tutorial-botoes">
 <button type="button" className="btn btn-fantasma" disabled={indice === 0} onClick={voltar}>← Voltar</button>
 <button type="button" className="btn btn-roxo" onClick={avancar}>
 {indice === passos.length - 1 ? 'Começar ✓' : 'Próximo ›'}
 </button>
 <button type="button" className="btn btn-fantasma" onClick={fechar}>Pular</button>
 </div>
 </dialog>
 </>
 );
}