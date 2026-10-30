import { useCallback, useEffect, useRef, useState } from 'react';
import EditorGo from './EditorGo';
import TerminalGo from './TerminalGo';
import FeedbackExercicio from './FeedbackExercicio';
import { compilarGo, executarGo } from '../go/compiler-browser.js';
import { iniciarRedeSimulada, limparServidores } from '../go/network-browser.js';
import { lerRascunho, gravarRascunho, marcar } from '../progresso.js';
import type { ItemDaIlha } from '../lib/conteudo';

interface ExercicioGoProps {
  item: ItemDaIlha;
  modulo?: string;
}

/**
 * Ilha React para exercícios/licões da trilha: renderiza editor + terminal conectados.
 * Recebe os dados do item via props (serializados como JSON no HTML estático).
 * Para exercícios do módulo Web, inicializa automaticamente a simulação de rede.
 * Salva/carrega rascunhos automaticamente via localStorage (Fase 9).
 * Marca progresso automaticamente ao executar (Fase 10).
 * Exibe feedback contextual com dicas após execução (Fase 13).
 */
export default function ExercicioGo({ item, modulo }: ExercicioGoProps) {
  const [executando, setExecutando] = useState(false);
  const [saida, setSaida] = useState<string[]>([]);
  const [executou, setExecutou] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [errosCompilacao, setErrosCompilacao] = useState<string[]>([]);
  const arquivosRef = useRef<Record<string, string>>({});

  // Inicializa infraestrutura de rede simulada para exercícios do módulo Web
  useEffect(() => {
    if (modulo === 'web') {
      iniciarRedeSimulada(7).catch((err) => {
        console.warn('[ExercicioGo] Falha ao iniciar rede simulada:', err);
      });
    }
    return () => {
      if (modulo === 'web') {
        limparServidores();
      }
    };
  }, [modulo]);

  // Carrega rascunho salvo ou usa código inicial padrão
  const codigoInicial = (() => {
    const rascunho = lerRascunho(item.id);
    if (rascunho && typeof rascunho === 'object') {
      const principal = Object.keys(rascunho)[0];
      if (principal && rascunho[principal]) return rascunho[principal];
    }
    return item.inicial || '// Escreva seu código Go aqui\npackage main\n\nfunc main() {\n\t\n}\n';
  })();

  const handleEditorChange = useCallback((arquivos: Record<string, string>) => {
    arquivosRef.current = arquivos;
    // Salva rascunho automaticamente a cada alteração (debounce implícito pelo React)
    gravarRascunho(item.id, arquivos);
  }, [item.id]);

  const handleExecutar = useCallback(async () => {
    if (executando) return;
    setExecutando(true);
    setExecutou(false);
    setExitCode(null);
    setErrosCompilacao([]);

    // Marca como "tentado" ao iniciar execução (Fase 10)
    marcar(item.id, 'tentado');

    try {
      const principal = Object.keys(arquivosRef.current)[0];
      const codigo = principal ? arquivosRef.current[principal] : '';

      if (!codigo.trim()) {
        setSaida((prev) => [...prev, '$ go run main.go', 'erro: nenhum código para executar']);
        setExecutou(true);
        setErrosCompilacao(['nenhum código para executar']);
        return;
      }

      setSaida((prev) => [...prev, `$ go run ${principal || 'main.go'}`]);

      const { js, erros } = await compilarGo(codigo, arquivosRef.current);

      if (erros.length > 0) {
        setSaida((prev) => [...prev, ...erros.map((e) => `erro: ${e}`)]);
        setErrosCompilacao(erros);
        setExecutou(true);
        return;
      }

      const resultado = await executarGo(js, '');

      if (resultado.stdout) {
        setSaida((prev) => [...prev, resultado.stdout.trimEnd()]);
      }
      if (resultado.stderr) {
        setSaida((prev) => [...prev, resultado.stderr.trimEnd()]);
      }
      setExitCode(resultado.exitCode);

      if (resultado.exitCode !== 0) {
        setSaida((prev) => [...prev, `exit status ${resultado.exitCode}`]);
      } else {
        // Execução bem-sucedida: marca como "resolvido" (Fase 10)
        marcar(item.id, 'resolvido');
      }
    } catch (err) {
      setSaida((prev) => [...prev, `erro interno: ${err instanceof Error ? err.message : String(err)}`]);
      setErrosCompilacao([err instanceof Error ? err.message : String(err)]);
    } finally {
      setExecutando(false);
      setExecutou(true);
    }
  }, [executando, item.id]);

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

      {/* Feedback contextual pós-execução (Fase 13) */}
      <FeedbackExercicio
        item={item}
        exitCode={exitCode}
        errosCompilacao={errosCompilacao}
        executou={executou}
      />
    </div>
  );
}