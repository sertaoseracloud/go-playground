// Ilha do executor de testes Go: extrai a lógica de rodarTestes e renderTestes
// de src/ui/item.js para uma ilha React montada na página de exercícios.
import { useCallback, useEffect, useRef, useState } from 'react';
import { marcar, statusDe } from '../progresso.js';
import { anunciar } from '../ui/anuncios.js';

interface Regra { codigo?: boolean; saida?: boolean; valor?: string; mensagem?: string }
interface Caso { descricao?: string; oculto?: boolean; regras: Regra[]; dica?: string }
interface Item { id: string; tipo: string; testes?: Caso[]; arquivos?: Record<string, string> }
interface ResultadoCaso { ok: boolean; mensagem: string; resultados: { ok: boolean; mensagem: string }[] }
interface Relatorio { aprovado: boolean; relatorio: ResultadoCaso[] }

interface Props {
 item: Item;
 saidaExecucao: string;
 onResultado?: (relatorio: Relatorio) => void;
}

function rodarTestes(item: Item, saida: string, incluirOcultos: boolean): Relatorio {
 const testes = (item.testes ?? []).filter((t) => incluirOcultos || !t.oculto);
 const resultados = testes.map((t) => {
   const passou = t.regras.every((r) => {
     if (r.codigo) return item.arquivos?.['main.go']?.includes(r.valor ?? '');
     if (r.saida) return saida?.includes(r.valor ?? '');
     return false;
   });
   return {
     ok: passou,
     mensagem: t.descricao || 'Verificação',
     resultados: t.regras.map((r) => ({ ok: passou, mensagem: r.mensagem || 'Verificação' })),
   };
 });
 return { aprovado: resultados.every((r) => r.ok), relatorio: resultados };
}

export default function TestRunnerGo({ item, saidaExecucao, onResultado }: Props) {
 const [resultado, setResultado] = useState<Relatorio | null>(null);
 const [ocupado, setOcupado] = useState(false);
 const ultimaSaida = useRef(saidaExecucao);

 useEffect(() => { ultimaSaida.current = saidaExecucao; }, [saidaExecucao]);

 const executar = useCallback(async (incluirOcultos: boolean) => {
   if (ocupado || item.tipo !== 'problema') return;
   setOcupado(true);
   try {
     const rel = rodarTestes(item, ultimaSaida.current, incluirOcultos);
     setResultado(rel);
     onResultado?.(rel);
     if (incluirOcultos) {
       marcar(item.id, rel.aprovado ? 'resolvido' : 'tentado');
       anunciar(rel.aprovado ? 'Exercício resolvido!' : `${rel.relatorio.filter((r) => r.ok).length} de ${rel.relatorio.length} casos passaram.`);
     } else {
       anunciar(`Casos visíveis: ${rel.relatorio.filter((r) => r.ok).length} de ${rel.relatorio.length} passaram.`);
     }
   } finally {
     setOcupado(false);
   }
 }, [item, ocupado, onResultado]);

 // Auto-run visible tests when output changes and we haven't run yet
 useEffect(() => {
   if (saidaExecucao && !resultado && item.tipo === 'problema') {
     executar(false);
   }
 }, [saidaExecucao]); // eslint-disable-line react-hooks/exhaustive-deps

 if (item.tipo !== 'problema') return null;

 const passaram = resultado?.relatorio.filter((r) => r.ok).length ?? 0;
 const total = resultado?.relatorio.length ?? (item.testes?.length ?? 0);

 return (
   <section className="test-runner-go" aria-label="Resultados dos testes">
     <div className="acoes-testes">
       <button className="btn btn-roxo" disabled={ocupado} onClick={() => executar(false)}>▶ Executar</button>
       <button className="btn btn-verde" disabled={ocupado} onClick={() => executar(true)}>⬆ Enviar</button>
     </div>
     {resultado && (
       <div className={`veredito ${resultado.aprovado ? 'ok' : 'falha'}`} role="status" aria-live="polite">
         <p>{resultado.aprovado ? '✅ Casos passaram' : `❌ ${passaram}/${total} casos passaram`}</p>
       </div>
     )}
     {resultado && (
       <ul className="lista-testes" aria-label="Casos de teste">
         {resultado.relatorio.map((r, i) => (
           <li key={i} className={r.ok ? 'ok' : 'falhou'}>
             {r.ok ? '✅' : '❌'} {r.mensagem}
           </li>
         ))}
       </ul>
     )}
   </section>
 );
}