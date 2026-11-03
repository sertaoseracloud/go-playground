// Visualização de progresso na trilha: módulos, exercícios concluídos e conquistas.
// Substitui o markup estático com dados reativos do localStorage e gráficos CSS.
import { useState, useEffect, useMemo } from 'react';

interface Modulo {
 id: string;
 titulo: string;
 totalExercicios: number;
 concluidos: number;
 bloqueado: boolean;
}

const MODULOS_PADRAO: Modulo[] = [
 { id: 'mod-basico', titulo: 'Básico', totalExercicios: 12, concluidos: 0, bloqueado: false },
 { id: 'mod-estruturas', titulo: 'Estruturas de dados', totalExercicios: 10, concluidos: 0, bloqueado: true },
 { id: 'mod-concorrencia', titulo: 'Concorrência', totalExercicios: 8, concluidos: 0, bloqueado: true },
 { id: 'mod-web', titulo: 'Web com Go', totalExercicios: 9, concluidos: 0, bloqueado: true },
 { id: 'mod-testes', titulo: 'Testes automatizados', totalExercicios: 7, concluidos: 0, bloqueado: true },
];

export default function ProgressoTrilhaGo() {
 const [modulos, setModulos] = useState<Modulo[]>(MODULOS_PADRAO);
 const [carregando, setCarregando] = useState(true);

 useEffect(() => {
 try {
 const progresso = JSON.parse(localStorage.getItem('divergego:progresso') || '{}');
 setModulos((prev) =>
 prev.map((m) => ({
 ...m,
 concluidos: progresso[m.id]?.concluidos ?? 0,
 bloqueado: m.id !== 'mod-basico' && !(progresso[m.id]?.desbloqueado),
 })),
 );
 } catch {}
 setCarregando(false);
 }, []);

 const stats = useMemo(() => {
 const totalExercicios = modulos.reduce((acc, m) => acc + m.totalExercicios, 0);
 const totalConcluidos = modulos.reduce((acc, m) => acc + m.concluidos, 0);
 const percentual = totalExercicios > 0 ? Math.round((totalConcluidos / totalExercicios) * 100) : 0;
 const modulosConcluidos = modulos.filter((m) => m.concluidos === m.totalExercicios).length;
 return { totalExercicios, totalConcluidos, percentual, modulosConcluidos };
 }, [modulos]);

 if (carregando) {
 return (
 <section className="progresso-trilha">
 <p>Carregando progresso…</p>
 </section>
 );
 }

 return (
 <section className="progresso-trilha">
 <header className="progresso-header">
 <h1>📊 Seu progresso na trilha</h1>
 <p className="subtitulo">
 Acompanhe sua jornada pelo DivergeGo. Cada módulo desbloqueia o próximo.
 </p>
 </header>

 <div className="progresso-resumo">
 <div className="resumo-card resumo-geral">
 <span className="resumo-valor">{stats.percentual}%</span>
 <span className="resumo-label">Progresso geral</span>
 <div className="barra-progresso-grande" role="progressbar" aria-valuenow={stats.percentual} aria-valuemin={0} aria-valuemax={100}>
 <div className="barra-preenchimento" style={{ width: `${stats.percentual}%` }} />
 </div>
 </div>
 <div className="resumo-card">
 <span className="resumo-valor">{stats.totalConcluidos}/{stats.totalExercicios}</span>
 <span className="resumo-label">Exercícios concluídos</span>
 </div>
 <div className="resumo-card">
 <span className="resumo-valor">{stats.modulosConcluidos}/{modulos.length}</span>
 <span className="resumo-label">Módulos completos</span>
 </div>
 </div>

 <div className="progresso-modulos">
 {modulos.map((modulo, idx) => {
 const pct = modulo.totalExercicios > 0 ? Math.round((modulo.concluidos / modulo.totalExercicios) * 100) : 0;
 const completo = modulo.concluidos === modulo.totalExercicios;
 return (
 <article key={modulo.id} className={`modulo-card ${modulo.bloqueado ? 'bloqueado' : ''} ${completo ? 'completo' : ''}`}>
 <header className="modulo-header">
 <span className="modulo-indice">{idx + 1}</span>
 <h2>{modulo.titulo}</h2>
 {completo && <span className="modulo-badge" aria-label="Módulo concluído">✅</span>}
 {modulo.bloqueado && <span className="modulo-badge bloqueado" aria-label="Módulo bloqueado">🔒</span>}
 </header>
 <div className="modulo-progresso">
 <div className="barra-progresso" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
 <div className="barra-preenchimento" style={{ width: `${pct}%` }} />
 </div>
 <span className="progresso-texto">{modulo.concluidos}/{modulo.totalExercicios} exercícios ({pct}%)</span>
 </div>
 {!modulo.bloqueado && !completo && (
 <a href={`${import.meta.env.BASE_URL}trilha/?modulo=${modulo.id}`} className="btn btn-pequeno btn-verde">
 Continuar →
 </a>
 )}
 {completo && (
 <a href={`${import.meta.env.BASE_URL}certificado/?id=${modulo.id}`} className="btn btn-pequeno btn-fantasma">
 🎓 Ver certificado
 </a>
 )}
 </article>
 );
 })}
 </div>

 <article className="topico">
 <h2>Como funciona o desbloqueio</h2>
 <p>
 Cada módulo é desbloqueado automaticamente quando você completa todos os exercícios do módulo anterior.
 Seu progresso fica salvo no navegador — limpe os dados nas preferências se quiser recomeçar.
 </p>
 </article>
 </section>
 );
}