// Celebração visual quando o exercício é concluído: confete leve e mensagem de parabéns.
// Ativado pelo store de progresso quando todos os testes passam.
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $progresso } from '../stores/progresso';

interface Props {
 itemId: string;
}

export default function CelebracaoConclusao({ itemId }: Props) {
 const progresso = useStore($progresso);
 const [visivel, setVisivel] = useState(false);
 const anteriorRef = useRef(false);

 useEffect(() => {
 const resolvido = Boolean(progresso?.[itemId]?.resolvido);
 if (resolvido && !anteriorRef.current) {
 setVisivel(true);
 // Auto-fechar após 6 segundos para não atrapalhar
 const timer = setTimeout(() => setVisivel(false), 6000);
 return () => clearTimeout(timer);
 }
 anteriorRef.current = resolvido;
 }, [progresso, itemId]);

 if (!visivel) return null;

 return (
 <div className="celebracao" role="status" aria-live="polite">
 <div className="celebracao-conteudo">
 <span className="celebracao-icone" aria-hidden="true">🎉</span>
 <p><strong>Parabéns!</strong> Você completou este exercício.</p>
 <button
 type="button"
 className="btn btn-fantasma btn-pequeno"
 onClick={() => setVisivel(false)}
 >
 Fechar
 </button>
 </div>
 </div>
 );
}