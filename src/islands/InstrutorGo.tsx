// Painel do instrutor: estatísticas da turma, progresso dos alunos e exportação de dados.
// Substitui o markup estático com dados reativos e ações de gestão.
import { useState, useEffect, useMemo } from 'react';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  progresso: number;
  ultimoAcesso: string;
  certificados: string[];
}

const ALUNOS_MOCK: Aluno[] = [
  { id: 'aluno-001', nome: 'Ana Silva', email: 'ana@exemplo.com', progresso: 85, ultimoAcesso: '2026-11-02', certificados: ['mod-basico'] },
  { id: 'aluno-002', nome: 'Carlos Santos', email: 'carlos@exemplo.com', progresso: 42, ultimoAcesso: '2026-11-01', certificados: [] },
  { id: 'aluno-003', nome: 'Mariana Oliveira', email: 'mariana@exemplo.com', progresso: 100, ultimoAcesso: '2026-11-03', certificados: ['mod-basico', 'mod-web'] },
  { id: 'aluno-004', nome: 'Pedro Costa', email: 'pedro@exemplo.com', progresso: 67, ultimoAcesso: '2026-10-30', certificados: ['mod-basico'] },
  { id: 'aluno-005', nome: 'Julia Ferreira', email: 'julia@exemplo.com', progresso: 23, ultimoAcesso: '2026-11-02', certificados: [] },
];

export default function InstrutorGo() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'progresso' | 'acesso'>('progresso');

  useEffect(() => {
    // Simula carregamento de dados; em produção viria de API ou localStorage criptografado
    setTimeout(() => {
      setAlunos(ALUNOS_MOCK);
      setCarregando(false);
    }, 300);
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    let lista = q ? alunos.filter(a => a.nome.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)) : [...alunos];

    lista.sort((a, b) => {
      if (ordenacao === 'nome') return a.nome.localeCompare(b.nome);
      if (ordenacao === 'acesso') return new Date(b.ultimoAcesso).getTime() - new Date(a.ultimoAcesso).getTime();
      return b.progresso - a.progresso;
    });
    return lista;
  }, [alunos, busca, ordenacao]);

  const stats = useMemo(() => {
    if (!alunos.length) return null;
    const total = alunos.length;
    const concluintes = alunos.filter(a => a.progresso === 100).length;
    const mediaProgresso = Math.round(alunos.reduce((acc, a) => acc + a.progresso, 0) / total);
    const ativos7dias = alunos.filter(a => {
      const diff = Date.now() - new Date(a.ultimoAcesso).getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;
    return { total, concluintes, mediaProgresso, ativos7dias };
  }, [alunos]);

  const exportarCsv = () => {
    const header = 'Nome,Email,Progresso (%),Ultimo Acesso,Certificados\n';
    const linhas = filtrados.map(a =>
      `"${a.nome}","${a.email}",${a.progresso},"${a.ultimoAcesso}","${a.certificados.join(';')}"`
    ).join('\n');
    const blob = new Blob([header + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `turma-divergego-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (carregando) {
    return (
      <section className="instrutor">
        <p>Carregando painel do instrutor…</p>
      </section>
    );
  }

  return (
    <section className="instrutor">
      <header className="instrutor-header">
        <h1>👨‍🏫 Painel do Instrutor</h1>
        <p className="subtitulo">
          Acompanhe o progresso da turma, identifique alunos que precisam de apoio e exporte relatórios.
        </p>
      </header>

      {stats && (
        <div className="instrutor-stats">
          <div className="stat-card">
            <span className="stat-valor">{stats.total}</span>
            <span className="stat-label">Alunos matriculados</span>
          </div>
          <div className="stat-card">
            <span className="stat-valor">{stats.mediaProgresso}%</span>
            <span className="stat-label">Progresso médio</span>
          </div>
          <div className="stat-card">
            <span className="stat-valor">{stats.concluintes}</span>
            <span className="stat-label">Concluíram a trilha</span>
          </div>
          <div className="stat-card">
            <span className="stat-valor">{stats.ativos7dias}</span>
            <span className="stat-label">Ativos nos últimos 7 dias</span>
          </div>
        </div>
      )}

      <div className="instrutor-controles">
        <input
          type="search"
          placeholder="Buscar por nome ou email…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar alunos"
        />
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as typeof ordenacao)}
          aria-label="Ordenar por"
        >
          <option value="progresso">Maior progresso</option>
          <option value="nome">Nome (A-Z)</option>
          <option value="acesso">Último acesso</option>
        </select>
        <button type="button" className="btn btn-fantasma" onClick={exportarCsv}>
          📥 Exportar CSV
        </button>
      </div>

      <table className="instrutor-tabela">
        <thead>
          <tr>
            <th scope="col">Aluno</th>
            <th scope="col">Progresso</th>
            <th scope="col">Último acesso</th>
            <th scope="col">Certificados</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((aluno) => (
            <tr key={aluno.id}>
              <td>
                <strong>{aluno.nome}</strong>
                <br />
                <small>{aluno.email}</small>
              </td>
              <td>
                <div className="barra-progresso" role="progressbar" aria-valuenow={aluno.progresso} aria-valuemin={0} aria-valuemax={100}>
                  <div className="barra-preenchimento" style={{ width: `${aluno.progresso}%` }} />
                </div>
                <span className="progresso-texto">{aluno.progresso}%</span>
              </td>
              <td>{new Date(aluno.ultimoAcesso).toLocaleDateString('pt-BR')}</td>
              <td>
                {aluno.certificados.length > 0 ? (
                  <ul className="lista-certificados">
                    {aluno.certificados.map(c => <li key={c}>{c}</li>)}
                  </ul>
                ) : (
                  <span className="sem-certificado">—</span>
                )}
              </td>
            </tr>
          ))}
          {filtrados.length === 0 && (
            <tr>
              <td colSpan={4} className="tabela-vazia">Nenhum aluno encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      <article className="topico">
        <h2>Sobre este painel</h2>
        <p>
          Os dados exibidos são locais e simulados para demonstração. Em uma implementação real,
          este painel consumiria uma API autenticada com dados reais da turma. A exportação CSV
          funciona inteiramente no navegador sem enviar dados para servidores externos.
        </p>
      </article>
    </section>
  );
}