import { useCallback, useRef, useState } from 'react';
import EditorGo from './EditorGo';
import TerminalGo from './TerminalGo';
import { compilarGo, executarGo } from '../go/compiler-browser.js';
import type { ItemDaIlha } from '../lib/conteudo';

interface ExercicioGoProps {
  item: ItemDaIlha;
}

/**
 * Ilha React para exercícios/licões da trilha: renderiza editor + terminal conectados.
 * Recebe os dados do item via props (serializados como JSON no HTML estático).
 */
export default function ExercicioGo({ item }: ExercicioGoProps) {
  const [executando, setExecutando] = useState(false);
  const [saida, setSaida] = useState<string[]>([]);
  const arquivosRef = useRef<Record<string, string>>({});

  const codigoInicial = item.inicial || '// Escreva seu código Go aqui\npackage main\n\nfunc main() {\n\t\n}\n';

  const handleEditorChange = useCallback((arquivos: Record<string, string>) => {
    arquivosRef.current = arquivos;
  }, []);

  const handleExecutar = useCallback(async () => {
    if (executando) return;
    setExecutando(true);

    try {
      const principal = Object.keys(arquivosRef.current)[0];
      const codigo = principal ? arquivosRef.current[principal] : '';

      if (!codigo.trim()) {
        setSaida((prev) => [...prev, '$ go run main.go', 'erro: nenhum código para executar']);
        return;
      }

      setSaida((prev) => [...prev, `$ go run ${principal || 'main.go'}`]);

      const { js, erros } = await compilarGo(codigo, arquivosRef.current);

      if (erros.length > 0) {
        setSaida((prev) => [...prev, ...erros.map((e) => `erro: ${e}`)]);
        return;
      }

      const resultado = await executarGo(js, '');

      if (resultado.stdout) {
        setSaida((prev) => [...prev, resultado.stdout.trimEnd()]);
      }
      if (resultado.stderr) {
        setSaida((prev) => [...prev, resultado.stderr.trimEnd()]);
      }
      if (resultado.exitCode !== 0) {
        setSaida((prev) => [...prev, `exit status ${resultado.exitCode}`]);
      }
    } catch (err) {
      setSaida((prev) => [...prev, `erro interno: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setExecutando(false);
    }
  }, [executando]);

  return (
    <div className="exercicio-go">
      <div className="editor-ilha">
        <EditorGo inicial={codigoInicial} onChange={handleEditorChange} />
      </div>

      <div className="acoes-exercicio" style={{ margin: '1rem 0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleExecutar}
          disabled={executando}
          style={{
            padding: '0.6rem 1.5rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '0.375rem',
            cursor: executando ? 'wait' : 'pointer',
            backgroundColor: executando ? '#6272a4' : '#50fa7b',
            color: '#282a36',
            opacity: executando ? 0.7 : 1,
            transition: 'background-color 0.15s, opacity 0.15s',
          }}
          aria-busy={executando}
        >
          {executando ? '⏳ Compilando…' : '▶ Executar'}
        </button>
        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          Ctrl+Enter no editor também executa
        </span>
      </div>

      <div className="terminal-ilha">
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.1rem' }}>💻 Terminal</h2>
        <TerminalGo historico={saida} />
      </div>
    </div>
  );
}