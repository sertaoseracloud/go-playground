// Ilha de integração do exercício: conecta EditorGo, TerminalGo e TestRunnerGo
// através de estado compartilhado e fluxo de execução unificado (Fase 8).
import { useCallback, useRef, useState } from 'react';
import EditorGo from './EditorGo';
import TerminalGo from './TerminalGo';
import TestRunnerGo from './TestRunnerGo';
import { compilarGo } from '../go/compiler.js';
import { executarGo } from '../go/runtime.js';
import { anunciar } from '../ui/anuncios.js';

type Arquivos = Record<string, string>;
interface Regra { codigo?: boolean; saida?: boolean; valor?: string; mensagem?: string }
interface Caso { descricao?: string; oculto?: boolean; regras: Regra[] }
interface Item { id: string; tipo: string; testes?: Caso[]; arquivos?: Arquivos }

interface Props {
  item: Item;
}

export default function ExercicioGo({ item }: Props) {
  const [saidaExecucao, setSaidaExecucao] = useState('');
  const [compilando, setCompilando] = useState(false);
  const arquivosRef = useRef<Arquivos>(item.arquivos ?? {});

  const aoMudarArquivos = useCallback((arqs: Arquivos) => {
    arquivosRef.current = arqs;
  }, []);

  const executar = useCallback(async () => {
    if (compilando) return;
    setCompilando(true);
    try {
      const main = arquivosRef.current['main.go'] || '';
      const { js, erros } = await compilarGo(main, arquivosRef.current);
      if (erros.length > 0) {
        setSaidaExecucao(erros.join('\n'));
        anunciar(`Erro de compilação: ${erros[0]}`);
        return;
      }
      const resultado = await executarGo(js);
      const saida = resultado.stdout || resultado.stderr || '';
      setSaidaExecucao(saida);
      anunciar(resultado.stderr ? 'Erro na execução.' : 'Programa executado.');
    } catch (erro) {
      setSaidaExecucao(String(erro));
      anunciar('Erro ao executar o programa.');
    } finally {
      setCompilando(false);
    }
  }, [compilando]);

  const enviar = useCallback(async () => {
    await executar();
  }, [executar]);

  return (
    <div className="exercicio-go" data-item-id={item.id}>
      <EditorGo
        itemId={item.id}
        arquivos={item.arquivos ?? {}}
        aoExecutar={executar}
        aoEnviar={enviar}
      />
      <TerminalGo itemId={item.id} />
      <TestRunnerGo item={item} saidaExecucao={saidaExecucao} />
    </div>
  );
}