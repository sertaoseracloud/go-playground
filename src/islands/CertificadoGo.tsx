// Página de certificado: exibe o certificado obtido após concluir um módulo.
// Substitui o markup estático com dados reativos e ações de download/impressão.
import { useState, useEffect } from 'react';
import { svgBadge } from '../badges.js';
import { CERTIFICADOS, EMISSOR } from '../certificados.js';

export default function CertificadoGo() {
 const [certificadoId, setCertificadoId] = useState<string | null>(null);
 const [carregando, setCarregando] = useState(true);

 useEffect(() => {
 try {
   const params = new URLSearchParams(window.location.search);
   const id = params.get('id');
   if (id && CERTIFICADOS[id]) {
     setCertificadoId(id);
   } else {
     // Tenta pegar do localStorage se não veio pela URL
     const ultimo = localStorage.getItem('ultimo-certificado');
     if (ultimo && CERTIFICADOS[ultimo]) {
       setCertificadoId(ultimo);
     }
   }
 } catch {}
 setCarregando(false);
 }, []);

 const cert = certificadoId ? CERTIFICADOS[certificadoId] : null;

 const imprimir = () => window.print();

 const baixarSvg = () => {
   if (!certificadoId) return;
   const svg = svgBadge(certificadoId, { tamanho: 512 });
   const blob = new Blob([svg], { type: 'image/svg+xml' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `certificado-divergego-${certificadoId}.svg`;
   a.click();
   URL.revokeObjectURL(url);
 };

 if (carregando) {
   return (
     <section className="certificado">
       <p>Carregando certificado…</p>
     </section>
   );
 }

 if (!cert) {
   return (
     <section className="certificado certificado-vazio">
       <h1>🎓 Certificados</h1>
       <p className="subtitulo">
         Nenhum certificado encontrado. Complete um módulo da trilha para receber o seu.
       </p>
       <a href={`${import.meta.env.BASE_URL}trilha/`} className="btn btn-verde">
         🗺️ Ir para a trilha
       </a>
     </section>
   );
 }

 return (
   <section className="certificado">
     <header className="certificado-header">
       <h1>🎓 Certificado de conclusão</h1>
       <p className="subtitulo">
         Parabéns! Você completou o módulo <strong>{cert.titulo}</strong>.
       </p>
     </header>

     <div className="certificado-visual">
       <div
         className="badge-grande"
         dangerouslySetInnerHTML={{ __html: svgBadge(certificadoId!, { tamanho: 256 }) }}
       />
       <dl className="certificado-dados">
         <dt>Título</dt>
         <dd>{cert.titulo}</dd>
         {cert.nome && (
           <>
             <dt>Concluinte</dt>
             <dd>{cert.nome}</dd>
           </>
         )}
         <dt>Data de emissão</dt>
         <dd>{cert.data || '—'}</dd>
         <dt>Emissor</dt>
         <dd>{EMISSOR.organizacao}</dd>
         <dt>Código de verificação</dt>
         <dd className="codigo-verificacao">{certificadoId}</dd>
       </dl>
     </div>

     <div className="certificado-acoes">
       <button type="button" className="btn btn-verde" onClick={imprimir}>
         🖨️ Imprimir
       </button>
       <button type="button" className="btn btn-fantasma" onClick={baixarSvg}>
         ⬇️ Baixar badge (SVG)
       </button>
       <a href={`${import.meta.env.BASE_URL}validar/?codigo=${certificadoId}`} className="btn btn-fantasma">
         🔍 Validar este certificado
       </a>
     </div>

     <article className="topico">
       <h2>Sobre este certificado</h2>
       <p>
         Este certificado atesta que você completou todos os exercícios do módulo
         <strong> {cert.titulo}</strong> no DivergeGo. Ele é assinado digitalmente
         e pode ser verificado por qualquer pessoa na página{' '}
         <a href={`${import.meta.env.BASE_URL}validar/`}>Validar certificado</a>,
         sem necessidade de cadastro ou conexão com nossos servidores.
       </p>
     </article>
   </section>
 );
}