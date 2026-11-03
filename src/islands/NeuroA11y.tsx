// Recursos neurodivergentes: régua de leitura, checklist de tarefas e lembrete de pausa.
// Ativados pelo painel ♿ Acessibilidade; aqui só a lógica de runtime.
import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $preferencias } from '../stores/preferencias';
import { lerTarefas, gravarTarefas } from '../progresso.js';

const PAUSA = { focoMin: 25, inatividadeMin: 5, adiarMin: 10 };
const MIN = 60_000;

export default function NeuroA11y() {
  const prefs = useStore($preferencias);
  const reguaRef = useRef<HTMLDivElement>(null);
  const inicioRef = useRef(Date.now());
  const ultimaAtividadeRef = useRef(Date.now());

  // Régua de leitura
  useEffect(() => {
    if (!prefs?.regua) return;
    const mover = (y: number) => {
      if (reguaRef.current) {
        reguaRef.current.style.top = `${y}px`;
        reguaRef.current.classList.add('visivel');
      }
    };
    const onMouse = (e: MouseEvent) => mover(e.clientY);
    const onFocus = (e: FocusEvent) => {
      const r = (e.target as HTMLElement)?.getBoundingClientRect?.();
      if (r && r.height < window.innerHeight / 2) mover(r.top + r.height / 2);
    };
    const onLeave = () => reguaRef.current?.classList.remove('visivel');
    document.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('focusin', onFocus);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMouse);
      document.removeEventListener('focusin', onFocus);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [prefs?.regua]);

  // Lembrete de pausa
  useEffect(() => {
    if (!prefs?.pausa) return;
    const registrar = () => {
      const agora = Date.now();
      if (agora - ultimaAtividadeRef.current > PAUSA.inatividadeMin * MIN) {
        inicioRef.current = agora;
      }
      ultimaAtividadeRef.current = agora;
    };
    ['keydown', 'pointerdown', 'wheel'].forEach((t) =>
      document.addEventListener(t, registrar, { passive: true }),
    );
    const id = setInterval(() => {
      const agora = Date.now();
      const ativo = agora - ultimaAtividadeRef.current <= PAUSA.inatividadeMin * MIN;
      if (!ativo || agora - inicioRef.current < PAUSA.focoMin * MIN) return;
      // Aviso simples via anúncio; o dialog completo seria pesado para uma ilha global.
      import('../ui/anuncios.js').then(({ anunciar }) =>
        anunciar(`☕ Hora de uma pausa? Você está estudando há ${PAUSA.focoMin} minutos.`),
      );
      inicioRef.current = agora;
    }, 30_000);
    return () => {
      clearInterval(id);
      ['keydown', 'pointerdown', 'wheel'].forEach((t) =>
        document.removeEventListener(t, registrar),
      );
    };
  }, [prefs?.pausa]);

  return <div ref={reguaRef} className="regua-leitura" aria-hidden="true" />;
}