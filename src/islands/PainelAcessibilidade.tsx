// Painel ♿: perfis, tema e tamanho do texto. As regras são as de
// ../src/ui/preferencias.js; aqui só a interface, num <dialog> nativo (foco e Esc de graça).
import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { TEMAS, TAMANHOS, PERFIS, perfilAtivo, alternarPerfil } from '../ui/preferencias.js';
import { $preferencias, carregarPreferencias, mudarPreferencias, type Preferencias } from '../stores/preferencias';

export default function PainelAcessibilidade() {
 const prefs = useStore($preferencias);
 const dialogo = useRef<HTMLDialogElement>(null);
 useEffect(carregarPreferencias, []);

 const mudar = (novas: Partial<Preferencias>, _mensagem: string) => {
 mudarPreferencias(novas);
 };

 return (
 <>
 <button
 type="button"
 className="flutuante"
 aria-haspopup="dialog"
 aria-label="Acessibilidade"
 data-rotulo="Acessibilidade"
 onClick={() => dialogo.current?.showModal()}
 >
 <span aria-hidden="true">♿</span>
 </button>
 <dialog ref={dialogo} className="dialogo" aria-labelledby="a11y-titulo">
 <h2 id="a11y-titulo">Acessibilidade</h2>
 {prefs && (
 <form method="dialog">
 <fieldset>
 <legend>Perfis prontos</legend>
 {Object.entries(PERFIS).map(([id, perfil]: [string, any]) => (
 <button
 key={id}
 type="button"
 className="btn btn-fantasma"
 aria-pressed={perfilAtivo(prefs, id)}
 title={perfil.ajuda}
 onClick={() =>
 mudar(
 alternarPerfil(prefs, id),
 `Perfil ${perfil.rotulo.replace(/^\S+\s/, '')} atualizado.`,
 )
 }
 >
 {perfil.rotulo}
 </button>
 ))}
 </fieldset>
 <fieldset>
 <legend>Tema</legend>
 {Object.entries(TEMAS).map(([valor, rotulo]) => (
 <label key={valor}>
 <input
 type="radio"
 name="tema"
 value={valor}
 checked={prefs.tema === valor}
 onChange={() => mudar({ tema: valor }, `Tema ${rotulo} aplicado.`)}
 />{' '}
 {rotulo as string}
 </label>
 ))}
 </fieldset>
 <label>
 Tamanho do texto{' '}
 <select
 value={prefs.tamanho}
 onChange={(e) => mudar({ tamanho: Number(e.target.value) }, `Texto em ${e.target.value}%.`)}
 >
 {(TAMANHOS as number[]).map((t) => (
 <option key={t} value={t}>
 {t}%
 </option>
 ))}
 </select>
 </label>
 <p>
 <button className="btn btn-roxo">Fechar</button>
 </p>
 </form>
 )}
 </dialog>
 </>
 );
}