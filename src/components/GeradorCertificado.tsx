import { useCallback, useEffect, useState } from 'react';
import { statusDe, dataDe, lerNome, gravarNome } from '../progresso.js';
import { todosOsItens } from '../lib/conteudo';
import { CERTIFICADOS, ORDEM, codificarCertificado, linkPublico, linkLinkedInPerfil, linkLinkedInPublicar } from '../certificados.js';

interface GeradorCertificadoProps {
  moduloId?: string;
}

/**
 * Ilha React que gera certificados baseados no progresso real do aluno.
 * Verifica se todos os itens de um módulo estão resolvidos e permite emitir o certificado.
 */
export default function GeradorCertificado({ moduloId }: GeradorCertificadoProps) {
  const [nome, setNome] = useState('');
  const [moduloSelecionado, setModuloSelecionado] = useState(moduloId || '');
  const [certificadoGerado, setCertificadoGerado] = useState<string | null>(null);
  const [itensResolvidos, setItensResolvidos] = useState<Record<string, number>>({});
  const [totalItens, setTotalItens] = useState<Record<string, number>>({});

  // Carrega nome salvo e conta itens por módulo
  useEffect(() => {
    setNome(lerNome());

    const resolvidos: Record<string, number> = {};
    const totais: Record<string, number> = {};

    for (const item of todosOsItens) {
      totais[item.modulo] = (totais[item.modulo] || 0) + 1;
      if (statusDe(item.id) === 'resolvido') {
        resolvidos[item.modulo] = (resolvidos[item.modulo] || 0) + 1;
      }
    }

    setItensResolvidos(resolvidos);
    setTotalItens(totais);
  }, []);

  const handleGerar = useCallback(() => {
    if (!nome.trim()) {
      alert('Por favor, informe seu nome para gerar o certificado.');
      return;
    }
    if (!moduloSelecionado) {
      alert('Selecione um módulo para gerar o certificado.');
      return;
    }

    // Salva nome para uso futuro
    gravarNome(nome.trim());

    // Usa a data do último item resolvido do módulo, ou hoje se não houver
    const itensDoModulo = todosOsItens.filter((i) => i.modulo === moduloSelecionado);
    const datasResolvidas = itensDoModulo
      .map((i) => dataDe(i.id))
      .filter((d): d is string => d !== null)
      .sort();
    const dataCertificado = datasResolvidas.length > 0 ? datasResolvidas[datasResolvidas.length - 1] : new Date().toLocaleDateString('sv-SE');

    const cert = {
      nome: nome.trim(),
      modulo: moduloSelecionado,
      data: dataCertificado,
    };

    try {
      const codigo = codificarCertificado(cert);
      setCertificadoGerado(codigo);
    } catch (err) {
      console.error('[GeradorCertificado] Erro ao gerar certificado:', err);
      alert('Erro ao gerar certificado. Verifique o console para detalhes.');
    }
  }, [nome, moduloSelecionado]);

  const modulosDisponiveis = ORDEM.filter((id) => id in CERTIFICADOS && id !== 'final');
  const moduloAtual = moduloSelecionado ? CERTIFICADOS[moduloSelecionado as keyof typeof CERTIFICADOS] : null;
  const resolvidosNoModulo = moduloSelecionado ? (itensResolvidos[moduloSelecionado] || 0) : 0;
  const totalNoModulo = moduloSelecionado ? (totalItens[moduloSelecionado] || 0) : 0;
  const completo = moduloSelecionado && resolvidosNoModulo >= totalNoModulo && totalNoModulo > 0;

  return (
    <div className="gerador-certificado" style={{ padding: '1.5rem', border: '1px solid var(--cor-borda, #444)', borderRadius: '0.5rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>🎓 Gerar Certificado</h2>

      {!certificadoGerado ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Seu nome:</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como deve aparecer no certificado"
              maxLength={80}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--cor-borda, #444)',
                backgroundColor: 'var(--cor-fundo-card, #2a2b36)',
                color: 'inherit',
                fontSize: '0.95rem',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Módulo:</span>
            <select
              value={moduloSelecionado}
              onChange={(e) => setModuloSelecionado(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--cor-borda, #444)',
                backgroundColor: 'var(--cor-fundo-card, #2a2b36)',
                color: 'inherit',
                fontSize: '0.95rem',
              }}
            >
              <option value="">Selecione um módulo…</option>
              {modulosDisponiveis.map((id) => {
                const def = CERTIFICADOS[id as keyof typeof CERTIFICADOS];
                const r = itensResolvidos[id] || 0;
                const t = totalItens[id] || 0;
                return (
                  <option key={id} value={id}>
                    {def.titulo} ({r}/{t} itens)
                  </option>
                );
              })}
            </select>
          </label>

          {moduloAtual && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--cor-fundo-card, #2a2b36)', borderRadius: '0.25rem', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 0.5rem' }}>
                <strong>{moduloAtual.titulo}</strong> — {moduloAtual.cargaHoraria}h
              </p>
              <p style={{ margin: 0, opacity: 0.8 }}>
                Progresso: {resolvidosNoModulo}/{totalNoModulo} itens resolvidos
                {completo ? ' ✅' : ''}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGerar}
            disabled={!nome.trim() || !moduloSelecionado || !completo}
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: (!nome.trim() || !moduloSelecionado || !completo) ? 'not-allowed' : 'pointer',
              backgroundColor: (!nome.trim() || !moduloSelecionado || !completo) ? '#6272a4' : '#50fa7b',
              color: '#282a36',
              opacity: (!nome.trim() || !moduloSelecionado || !completo) ? 0.5 : 1,
            }}
          >
            {completo ? '🎓 Gerar Certificado' : `Complete ${totalNoModulo - resolvidosNoModulo} itens para gerar`}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>✅ Certificado gerado com sucesso!</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`#/certificado/${certificadoGerado}`}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#bd93f9',
                color: '#282a36',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              📄 Ver Certificado
            </a>
            <a
              href={linkLinkedInPerfil({ nome, modulo: moduloSelecionado, data: new Date().toLocaleDateString('sv-SE') })}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0077b5',
                color: '#fff',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              💼 LinkedIn Perfil
            </a>
            <a
              href={linkLinkedInPublicar({ nome, modulo: moduloSelecionado, data: new Date().toLocaleDateString('sv-SE') })}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0077b5',
                color: '#fff',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              📢 Publicar no LinkedIn
            </a>
          </div>
          <button
            type="button"
            onClick={() => setCertificadoGerado(null)}
            style={{
              marginTop: '1rem',
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              border: '1px solid var(--cor-borda, #444)',
              borderRadius: '0.25rem',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            ← Gerar outro
          </button>
        </div>
      )}
    </div>
  );
}