import { useEffect, useState } from 'react';
import type { ItemDaIlha } from '../lib/conteudo';

interface FeedbackExercicioProps {
  item: ItemDaIlha;
  exitCode: number | null;
  errosCompilacao: string[];
  executou: boolean;
}

/**
 * Ilha React que exibe feedback contextual após a execução do exercício.
 * Mostra mensagens de sucesso, erros de compilação ou dicas quando o código falha.
 */
export default function FeedbackExercicio({ item, exitCode, errosCompilacao, executou }: FeedbackExercicioProps) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (executou) {
      setVisivel(true);
    }
  }, [executou]);

  if (!visivel || !executou) return null;

  // Sucesso: exitCode 0 e sem erros de compilação
  if (exitCode === 0 && errosCompilacao.length === 0) {
    return (
      <div
        className="feedback-sucesso"
        role="status"
        style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(80, 250, 123, 0.15)',
          border: '1px solid #50fa7b',
          borderRadius: '0.375rem',
          color: '#50fa7b',
        }}
      >
        <strong>✅ Execução bem-sucedida!</strong>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
          Seu código compilou e executou sem erros. Continue assim!
        </p>
      </div>
    );
  }

  // Erro de compilação
  if (errosCompilacao.length > 0) {
    return (
      <div
        className="feedback-erro-compilacao"
        role="alert"
        style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(255, 85, 85, 0.15)',
          border: '1px solid #ff5555',
          borderRadius: '0.375rem',
          color: '#ff5555',
        }}
      >
        <strong>❌ Erro de compilação</strong>
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
          {errosCompilacao.map((erro, i) => (
            <li key={i}>{erro}</li>
          ))}
        </ul>
        {item.dica && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(241, 250, 140, 0.1)', borderRadius: '0.25rem', fontSize: '0.85rem', color: '#f1fa8c' }}>
            💡 <strong>Dica:</strong> {typeof item.dica === 'string' ? item.dica : item.dica[0]}
          </div>
        )}
      </div>
    );
  }

  // Erro de execução (exitCode !== 0)
  if (exitCode !== null && exitCode !== 0) {
    return (
      <div
        className="feedback-erro-execucao"
        role="alert"
        style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(255, 184, 108, 0.15)',
          border: '1px solid #ffb86c',
          borderRadius: '0.375rem',
          color: '#ffb86c',
        }}
      >
        <strong>⚠️ Erro na execução</strong>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
          O código compilou, mas falhou durante a execução (exit code {exitCode}).
        </p>
        {item.dica && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(241, 250, 140, 0.1)', borderRadius: '0.25rem', fontSize: '0.85rem', color: '#f1fa8c' }}>
            💡 <strong>Dica:</strong> {typeof item.dica === 'string' ? item.dica : item.dica[0]}
          </div>
        )}
      </div>
    );
  }

  return null;
}