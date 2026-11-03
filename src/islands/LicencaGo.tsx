// Página de licenças: AGPL-3.0 para código e CC BY-SA 4.0 para conteúdo didático.
// Substitui o markup estático com texto completo das licenças.
export default function LicencaGo() {
 return (
 <section className="licenca">
 <h1>⚖️ Licenças</h1>
 <p className="subtitulo">
 O DivergeGo é software livre e conteúdo aberto. Você pode usar, estudar, modificar e redistribuir.
 </p>

 <article className="topico">
 <h2>Código-fonte: AGPL-3.0</h2>
 <p>
 Todo o código do DivergeGo está licenciado sob a{' '}
 <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer">
 GNU Affero General Public License v3.0
 </a>. Isso significa que você pode:
 </p>
 <ul>
 <li>Usar o software para qualquer finalidade.</li>
 <li>Estudar como ele funciona e modificá-lo.</li>
 <li>Redistribuir cópias originais ou modificadas.</li>
 <li>Oferecer o software como serviço na web — desde que disponibilize o código-fonte aos usuários desse serviço.</li>
 </ul>
 <p>
 A AGPL-3.0 garante que melhorias feitas por terceiros retornem à comunidade.
 Se você modificar o DivergeGo e oferecê-lo como serviço, deve publicar suas alterações sob a mesma licença.
 </p>
 </article>

 <article className="topico">
 <h2>Conteúdo didático: CC BY-SA 4.0</h2>
 <p>
 As lições, exercícios, textos da vila, glossário e demais materiais educacionais estão licenciados sob a{' '}
 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR" target="_blank" rel="noopener noreferrer">
 Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional
 </a>. Você pode:
 </p>
 <ul>
 <li>Compartilhar — copiar e redistribuir o material em qualquer meio ou formato.</li>
 <li>Adaptar — remixar, transformar e criar a partir do material para qualquer finalidade, inclusive comercial.</li>
 </ul>
 <p>Sob as seguintes condições:</p>
 <ul>
 <li><b>Atribuição:</b> você deve dar crédito ao DivergeGo, indicar se fez alterações e manter esta licença.</li>
 <li><b>CompartilhaIgual:</b> se remixar ou transformar, deve distribuir suas contribuições sob a mesma licença CC BY-SA 4.0.</li>
 </ul>
 </article>

 <article className="topico">
 <h2>Marcas e identidade visual</h2>
 <p>
 O nome "DivergeGo", o logotipo e a identidade visual não estão cobertos pelas licenças acima.
 Eles podem ser usados apenas para identificar o projeto original e seus derivados autorizados.
 Para uso comercial ou institucional da marca, entre em contato.
 </p>
 </article>

 <article className="topico">
 <h2>Bibliotecas de terceiros</h2>
 <p>
 O DivergeGo utiliza bibliotecas open source com suas próprias licenças compatíveis:
 CodeMirror 6 (MIT), PixiJS 8 (MIT), Vite (MIT) e o compilador Go via GopherJS (BSD).
 Cada dependência mantém sua licença original no diretório <code>node_modules</code>.
 </p>
 </article>
 </section>
 );
}