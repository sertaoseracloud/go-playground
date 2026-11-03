// Página de configurações do aplicativo: desempenho, armazenamento e dados locais.
// Substitui o markup estático com painel de diagnóstico e ações de gestão.
import { useState, useEffect } from 'react';

interface ArmazenamentoInfo {
  usado: string;
  total: string;
  percentual: number;
}

export default function ConfiguracoesGo() {
  const [armazenamento, setArmazenamento] = useState<ArmazenamentoInfo | null>(null);
  const [limpando, setLimpando] = useState(false);

  useEffect(() => {
    calcularArmazenamento();
  }, []);

  const calcularArmazenamento = () => {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) totalSize += value.length * 2; // UTF-16
        }
      }
      const usadoMB = (totalSize / (1024 * 1024)).toFixed(2);
      const totalMB = '5.00'; // Limite típico do localStorage
      const percentual = Math.min(100, (totalSize / (5 * 1024 * 1024)) * 100);
      setArmazenamento({ usado: `${usadoMB} MB`, total: `${totalMB} MB`, percentual });
    } catch {
      setArmazenamento({ usado: '?', total: '?', percentual: 0 });
    }
  };

  const limparCache = async () => {
    setLimpando(true);
    try {
      sessionStorage.clear();
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
      alert('Cache limpo com sucesso.');
    } catch {
      alert('Não foi possível limpar o cache.');
    } finally {
      setLimpando(false);
    }
  };

  const exportarDados = () => {
    const dados: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) dados[key] = value;
      }
    }
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `divergego-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="configuracoes">
      <header className="configuracoes-header">
        <h1>🛠️ Configurações</h1>
        <p className="subtitulo">
          Gerencie desempenho, armazenamento e dados locais do DivergeGo.
        </p>
      </header>

      <fieldset>
        <legend>Armazenamento local</legend>
        {armazenamento && (
          <div className="armazenamento-info">
            <div className="barra-progresso" role="progressbar" aria-valuenow={armazenamento.percentual} aria-valuemin={0} aria-valuemax={100}>
              <div className="barra-preenchimento" style={{ width: `${armazenamento.percentual}%` }} />
            </div>
            <p>
              Usado: <strong>{armazenamento.usado}</strong> de {armazenamento.total} ({armazenamento.percentual.toFixed(1)}%)
            </p>
          </div>
        )}
        <button type="button" className="btn btn-fantasma" onClick={calcularArmazenamento}>
          🔄 Recalcular
        </button>
      </fieldset>

      <fieldset>
        <legend>Dados e backup</legend>
        <p>Exporte seus dados locais para fazer backup ou migrar para outro navegador.</p>
        <button type="button" className="btn btn-verde" onClick={exportarDados}>
          📥 Exportar dados (JSON)
        </button>
      </fieldset>

      <fieldset>
        <legend>Desempenho</legend>
        <p>Limpe o cache do navegador para liberar espaço e resolver problemas de carregamento.</p>
        <button
          type="button"
          className="btn btn-amarelo"
          onClick={limparCache}
          disabled={limpando}
        >
          {limpando ? '⏳ Limpando…' : '🧹 Limpar cache'}
        </button>
      </fieldset>

      <article className="topico">
        <h2>Sobre o DivergeGo</h2>
        <p>Versão: <strong>2.0.0-astro</strong></p>
        <p>Motor: Astro + React Islands</p>
        <p>
          Código-fonte:{' '}
          <a href="https://github.com/divergego/go-playground" target="_blank" rel="noopener noreferrer">
            github.com/divergego/go-playground
          </a>
        </p>
      </article>
    </section>
  );
}