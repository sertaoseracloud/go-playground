import { useEffect, useState } from 'react';
import { statusDe, diasAtivos, lerNome } from '../progresso.js';
import { todosOsItens } from '../lib/conteudo';

/**
 * Ilha React que exibe o progresso do aluno no topo da trilha.
 * Lê dados do localStorage via progresso.js e atualiza em tempo real.
 */
export default function BarraProgresso() {
 const [resolvidos, setResolvidos] = useState(0);
 const [total, setTotal] = useState(0);
 const [sequencia, setSequencia] = useState(0);
 const [nome, setNome] = useState('');

 useEffect(() => {
 const itens = todosOsItens;
 setTotal(itens.length);

 const contagem = itens.filter((i) => statusDe(i.id) === 'resolvido').length;
 setResolvidos(contagem);

 // Calcula sequência de dias ativos consecutivos até hoje
 const dias = diasAtivos();
 let seq = 0;
 if (dias.length > 0) {
 const hoje = new Date().toLocaleDateString('sv-SE');
 const ontem = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');
 if (dias.includes(hoje) || dias.includes(ontem)) {
 const ordenados = [...dias].sort().reverse();
 let dataAtual = dias.includes(hoje) ? hoje : ontem;
 for (const dia of ordenados) {
 if (dia === dataAtual) {
 seq++;
 const prev = new Date(new Date(dia).getTime() - 86400000).toLocaleDateString('sv-SE');
 dataAtual = prev;
 } else if (dia < dataAtual) {
 break;
 }
 }
 }
 }
 setSequencia(seq);
 setNome(lerNome());
 }, []);

 const percentual = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

 return (
 <div className="barra-progresso" style={{
 padding: '1rem 1.5rem',
 marginBottom: '2rem',
 backgroundColor: 'var(--cor-fundo-card, #2d2f3d)',
 borderRadius: '0.5rem',
 border: '1px solid var(--cor-borda, #444)',
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
 <span style={{ fontWeight: 600, fontSize: '1rem' }}>
 {nome ? `Olá, ${nome}!` : 'Seu progresso'}
 </span>
 <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
 🔥 {sequencia} {sequencia === 1 ? 'dia' : 'dias'} seguidos
 </span>
 </div>

 <div style={{ position: 'relative', height: '1.25rem', backgroundColor: '#44475a', borderRadius: '0.625rem', overflow: 'hidden' }}>
 <div
 style={{
 width: `${percentual}%`,
 height: '100%',
 backgroundColor: '#50fa7b',
 borderRadius: '0.625rem',
 transition: 'width 0.5s ease',
 }}
 role="progressbar"
 aria-valuenow={percentual}
 aria-valuemin={0}
 aria-valuemax={100}
 aria-label={`${resolvidos} de ${total} itens concluídos`}
 />
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
 <span>{resolvidos}/{total} itens concluídos</span>
 <span>{percentual}%</span>
 </div>
 </div>
 );
}