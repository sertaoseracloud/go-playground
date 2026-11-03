// Página de validação de certificados: verifica hash e exibe badge + dados do certificado.
// Substitui o markup estático de validar/index.astro com lógica reativa.
import { useState, useCallback } from 'react';
import { CERTIFICADOS, EMISSOR } from '../certificados.js';
import { svgBadge } from '../badges.js';
import { verificarCertificado } from '../verificacoes.js';

interface Resultado {
  valido: boolean;
  certificado?: { id: string; titulo: string; data: string; nome?: string };
  erro?: string;
}

export default function ValidarGo() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [carregando, setCarregando] = useState(false);

  const validar = useCallback(async () => {
    if (!codigo.trim()) return;
    setCarregando(true);
    setResultado(null);
    try {
      const verificado = await verificarCertificado(codigo.trim());
      if (verificado.valido && verificado.id) {
        const cert = CERTIFICADOS[verificado.id];
        setResultado({
          valido: true,
          certificado: {
            id: verificado.id,
            titulo: cert?.titulo ?? verificado.id,
            data: verificado.data ?? '',
            nome: verificado.nome,
          },
        });
      } else {
        setResultado({ valido: false, erro: 'Certificado não encontrado ou inválido.' });
      }
    } catch (e: any) {
      setResultado({ valido: false, erro: e?.message ?? 'Erro ao verificar.' });
    } finally {
      setCarregando(false);
    }
  }, [codigo]);

  return (
    <section className="validar">
      <h1>🔍 Validar certificado</h1>
      <p className="subtitulo">
        Insira o código de verificação impresso no certificado para confirmar sua autenticidade.
      </p>

      <form
        className="formulario-validar"
        onSubmit={(e) => {
          e.preventDefault();
          validar();
        }}
      >
        <label htmlFor="codigo-certificado">Código do certificado</label>
        <input
          id="codigo-certificado"
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ex: ABC123-DEF456-GHI789"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn btn-verde" disabled={carregando || !codigo.trim()}>
          {carregando ? 'Verificando…' : 'Validar'}
        </button>
      </form>

      {resultado && (
        <div
          className={`resultado-validacao ${resultado.valido ? 'sucesso' : 'erro'}`}
          role="status"
          aria-live="polite"
        >
          {resultado.valido && resultado.certificado ? (
            <>
              <div
                className="badge-validado"
                dangerouslySetInnerHTML={{ __html: svgBadge(resultado.certificado.id, { tamanho: 128 }) }}
              />
              <h2>Certificado válido ✅</h2>
              <dl>
                <dt>Título</dt>
                <dd>{resultado.certificado.titulo}</dd>
                {resultado.certificado.nome && (
                  <>
                    <dt>Concluinte</dt>
                    <dd>{resultado.certificado.nome}</dd>
                  </>
                )}
                <dt>Data de emissão</dt>
                <dd>{resultado.certificado.data || '—'}</dd>
                <dt>Emissor</dt>
                <dd>{EMISSOR.organizacao}</dd>
              </dl>
            </>
          ) : (
            <>
              <span className="icone-erro" aria-hidden="true">❌</span>
              <h2>Certificado inválido</h2>
              <p>{resultado.erro}</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}