// Página de validação de certificado: verificação pública sem cadastro.
// Substitui o markup estático com formulário reativo e resultado instantâneo.
import { useState, useEffect } from 'react';
import { CERTIFICADOS, EMISSOR } from '../certificados.js';

export default function ValidarCertificadoGo() {
 const [codigo, setCodigo] = useState('');
 const [resultado, setResultado] = useState<'neutro' | 'valido' | 'invalido'>('neutro');
 const [certificado, setCertificado] = useState<typeof CERTIFICADOS[string] | null>(null);

 useEffect(() => {
 try {
 const params = new URLSearchParams(window.location.search);
 const codigoUrl = params.get('codigo');
 if (codigoUrl) {
 setCodigo(codigoUrl);
 validar(codigoUrl);
 }
 } catch {}
 }, []);

 const validar = (codigoInput?: string) => {
 const c = (codigoInput || codigo).trim();
 if (!c) {
 setResultado('neutro');
 setCertificado(null);
 return;
 }
 const cert = CERTIFICADOS[c];
 if (cert) {
 setCertificado(cert);
 setResultado('valido');
 } else {
 setCertificado(null);
 setResultado('invalido');
 }
 };

 return (
 <section className="validar-certificado">
 <header className="validar-header">
 <h1>🔎 Validar certificado</h1>
 <p className="subtitulo">
 Verifique a autenticidade de um certificado DivergeGo. Nenhuma conexão com servidores é necessária.
 </p>
 </header>

 <form
 className="validar-formulario"
 onSubmit={(e) => {
 e.preventDefault();
 validar();
 }}
 >
 <label htmlFor="codigo-certificado">Código de verificação</label>
 <div className="validar-input-grupo">
 <input
 id="codigo-certificado"
 type="text"
 value={codigo}
 onChange={(e) => setCodigo(e.target.value)}
 placeholder="Ex: mod-basico-2026-abc123"
 autoComplete="off"
 spellCheck={false}
 />
 <button type="submit" className="btn btn-verde">
 Validar
 </button>
 </div>
 </form>

 {resultado === 'valido' && certificado && (
 <div className="validar-resultado validar-valido" role="status">
 <h2>✅ Certificado válido</h2>
 <dl>
 <dt>Título</dt>
 <dd>{certificado.titulo}</dd>
 {certificado.nome && (
 <>
 <dt>Concluinte</dt>
 <dd>{certificado.nome}</dd>
 </>
 )}
 <dt>Data de emissão</dt>
 <dd>{certificado.data || '—'}</dd>
 <dt>Emissor</dt>
 <dd>{EMISSOR.organizacao}</dd>
 <dt>Código</dt>
 <dd className="codigo-mono">{codigo.trim()}</dd>
 </dl>
 <a
 href={`${import.meta.env.BASE_URL}certificado/?id=${encodeURIComponent(codigo.trim())}`}
 className="btn btn-fantasma"
 >
 🎓 Ver certificado completo
 </a>
 </div>
 )}

 {resultado === 'invalido' && (
 <div className="validar-resultado validar-invalido" role="alert">
 <h2>❌ Certificado não encontrado</h2>
 <p>
 O código <code className="codigo-mono">{codigo.trim()}</code> não corresponde a nenhum certificado emitido pelo DivergeGo.
 Verifique se o código foi copiado corretamente ou entre em contato com quem lhe enviou o link.
 </p>
 </div>
 )}

 <article className="topico">
 <h2>Como funciona</h2>
 <p>
 A validação é feita inteiramente no seu navegador usando uma lista pública de certificados
 assinados. Nenhum dado é enviado para nossos servidores. Qualquer pessoa pode verificar
 a autenticidade de um certificado usando apenas o código de verificação.
 </p>
 </article>
 </section>
 );
}