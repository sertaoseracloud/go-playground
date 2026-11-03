// Página de termos de uso: condições de uso do DivergeGo.
// Substitui o markup estático com conteúdo reativo e links para licenças.
export default function TermosGo() {
 return (
 <section className="termos">
 <h1>📜 Termos de uso</h1>
 <p className="subtitulo">
 Ao usar o DivergeGo, você concorda com estas condições simples e transparentes.
 </p>

 <article className="topico">
 <h2>O que é o DivergeGo</h2>
 <p>
 O DivergeGo é um playground educacional de Go que roda inteiramente no seu navegador.
 Não há servidor, cadastro ou coleta de dados. Todo o processamento acontece localmente.
 </p>
 </article>

 <article className="topico">
 <h2>Uso permitido</h2>
 <ul>
 <li>Aprender Go, praticar exercícios e explorar o playground livremente.</li>
 <li>Usar em sala de aula, cursos, mentorias ou estudo individual.</li>
 <li>Modificar, redistribuir e criar obras derivadas sob os termos da AGPL-3.0 (código) e CC BY-SA 4.0 (conteúdo).</li>
 </ul>
 </article>

 <article className="topico">
 <h2>Uso não permitido</h2>
 <ul>
 <li>Tentar burlar testes, certificados ou mecanismos de validação para obter credenciais falsas.</li>
 <li>Usar o nome "DivergeGo" ou marcas associadas de forma enganosa ou comercial sem autorização.</li>
 <li>Injetar código malicioso nos campos de entrada com intenção de prejudicar outros usuários.</li>
 </ul>
 </article>

 <article className="topico">
 <h2>Certificados</h2>
 <p>
 Os certificados emitidos pelo DivergeGo atestam conclusão de exercícios dentro da plataforma.
 Eles são verificáveis criptograficamente, mas não possuem valor oficial de diploma ou certificação profissional reconhecida por órgãos reguladores.
 </p>
 </article>

 <article className="topico">
 <h2>Isenção de responsabilidade</h2>
 <p>
 O DivergeGo é fornecido "como está", sem garantias de qualquer tipo.
 Não nos responsabilizamos por danos diretos ou indiretos decorrentes do uso da plataforma.
 O conteúdo educacional é revisado, mas pode conter imprecisões; sempre consulte fontes oficiais.
 </p>
 </article>

 <article className="topico">
 <h2>Licenças</h2>
 <p>
 Código-fonte: <a href="licenca/">AGPL-3.0</a>. Conteúdo didático: <a href="licenca/">CC BY-SA 4.0</a>.
 Ao contribuir com o projeto, você concorda em licenciar suas contribuições sob os mesmos termos.
 </p>
 </article>

 <article className="topico">
 <h2>Alterações</h2>
 <p>
 Estes termos podem ser atualizados a qualquer momento. Alterações significativas serão comunicadas na página de <a href="novidades/">Novidades</a>.
 O uso continuado após alterações constitui aceitação dos novos termos.
 </p>
 </article>
 </section>
 );
}