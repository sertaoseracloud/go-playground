// "✅ 3/261 exercícios" no topo: lê o mesmo store que o exercício atualiza.
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $progresso, carregarProgresso, contarResolvidos } from '../stores/progresso';

export default function ProgressoTopo({ exercicios }: { exercicios: string[] }) {
  const progresso = useStore($progresso);
  useEffect(() => carregarProgresso(exercicios), [exercicios]);
  const resolvidos = contarResolvidos(progresso, exercicios);
  const texto = `${resolvidos} de ${exercicios.length} exercícios resolvidos`;
  return (
    <span className="progresso-topo" title={texto} aria-label={texto}>
      ✅ {resolvidos}/{exercicios.length}<span className="rotulo-progresso"> exercícios</span>
    </span>
  );
}