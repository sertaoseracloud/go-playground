// Landing page: apresenta o projeto e leva para a trilha.
// Os números e os módulos vêm do conteúdo da trilha, então nunca ficam desatualizados.
import { modulos, itens, problemas } from '../conteudo/trilha.js';
import { CERTIFICADOS, EMISSOR } from '../certificados.js';
import { svgBadge } from '../badges.js';
import { linkItem } from '../compartilhar.js';
import { jornadaAtual } from '../ui/inicio.js';

const REPOSITORIO = 'https://github.com/sertaoseracloud/go-playground';
const VERSAO = typeof __VERSAO__ !== 'undefined' ? __VERSAO__ : '';

const CODIGO_EXEMPLO = `package main

import "fmt"

func main() {
    nome := "Sertão"
    notas := []float64{8, 9.5, 7}
    media := soma(notas) / float64(len(notas))
    fmt.Printf("Olá, %s!\\n", nome)
    fmt.Printf("Média: %.1f\\n", media)
}`;

function numerosDaTrilha() {
  const projetos = modulos.find((m: any) => m.grupos)?.grupos.length ?? 0;
  return {
    exercicios: problemas.length,
    licoes: itens.filter((i: any) => i.tipo === 'licao').length,
    modulos: modulos.length,
    projetos,
    certificados: Object.keys(CERTIFICADOS).length,
  };
}

export default function LandingGo() {
  const n = numerosDaTrilha();
  const j = jornadaAtual();
  const temProgresso = j.xp > 0;

  return (
    <div className="landing">
      <section className="hero" aria-labelledby="landing-titulo">
        <div className="hero-texto">
          <p className="hero-selo">☁️ {EMISSOR.organizacao} apresenta</p>
          <h1 id="landing-titulo">Aprenda <span className="destaque">Go</span> do zero, com acessibilidade para todas as pessoas</h1>
          <p className="hero-selo-a11y"> Leitor de tela · Libras · ⌨️ Só teclado · TDAH e dislexia</p>
          <p className="hero-sub">Uma trilha gamificada: sintaxe, concorrência, APIs e projetos.
            Você escreve o código, clica em <b>▶ Executar</b> e os testes dizem na hora se acertou.
            Sem instalar nada, sem cadastro.</p>
          <div className="hero-acoes">
            {temProgresso ? (
              <a className="btn btn-verde btn-grande" href={linkItem(j.proximo!.id)}>▶ Continuar: {j.proximo!.titulo}</a>
            ) : (
              <a className="btn btn-verde btn-grande" href="trilha/"> Começar a trilha</a>
            )}
            <a className="btn btn-fantasma btn-grande" href="trilha/">️ Ver a trilha</a>
            <a className="btn btn-fantasma btn-grande" href="livre/"> Playground livre</a>
          </div>
          <ul className="hero-numeros" aria-label="A trilha em números">
            <li><b>{n.exercicios}</b> exercícios</li>
            <li><b>{n.licoes}</b> lições</li>
            <li><b>{n.projetos}</b> projetos completos</li>
            <li><b>{n.certificados}</b> certificados</li>
          </ul>
        </div>
        <div className="hero-demo" aria-hidden="true">
          <div className="janela">
            <div className="janela-barra"><span></span><span></span><span></span><b>main.go</b></div>
            <pre className="janela-codigo">{CODIGO_EXEMPLO}</pre>
          </div>
          <div className="janela janela-resultado">
            <div className="janela-barra"><span></span><span></span><span></span><b>terminal</b></div>
            <div className="resultado-demo"><p className="r-h1">Olá, Sertão!</p><p>Média: 8.2</p></div>
            <p className="teste-demo">✅ 3/3 casos passaram</p>
          </div>
        </div>
      </section>

      <section className="faixa" aria-labelledby="como-titulo">
        <h2 id="como-titulo">Como funciona</h2>
        <ol className="passos-landing">
          <li><span aria-hidden="true"></span><b>Leia o desafio</b><p>Instruções curtas, sempre na mesma ordem, com as palavras técnicas explicadas por analogias.</p></li>
          <li><span aria-hidden="true">⌨️</span><b>Escreva o código</b><p>Editor de verdade, com cores e atalhos. Seu código fica salvo no navegador.</p></li>
          <li><span aria-hidden="true">▶️</span><b>Execute</b><p>O compilador Go roda no próprio navegador, com testes automáticos.</p></li>
          <li><span aria-hidden="true">✅</span><b>Veja os testes</b><p>Testes funcionais conferem a saída na hora e mostram o que falta, como no LeetCode.</p></li>
        </ol>
      </section>

      <section className="faixa" aria-labelledby="trilha-titulo">
        <h2 id="trilha-titulo">A trilha</h2>
        <p className="faixa-sub">{n.modulos} módulos em sequência. Cada um abre quando você faz 70% do anterior.</p>
        <ol className="modulos-landing">
          {modulos.map((m: any, i: number) => {
            const qtd = m.itens.filter((x: any) => x.tipo === 'problema').length;
            return (
              <li key={m.id} className="modulo-card" data-modulo={m.id}>
                <span className="modulo-numero">{m.extra ? 'Extra' : i + 1}</span>
                <span className="modulo-icone" aria-hidden="true">{m.icone}</span>
                <h3>{m.titulo}</h3>
                <p>{m.descricao}</p>
                <small>{m.grupos ? `${m.grupos.length} projetos · ${qtd} etapas` : `${qtd} exercícios`}</small>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="faixa faixa-certificados" aria-labelledby="cert-titulo">
        <div>
          <h2 id="cert-titulo">Certificados e badges</h2>
          <p>Cada módulo concluído vale um <b>badge digital</b>, e a trilha completa vale o certificado final,
            emitidos pela <b>{EMISSOR.organizacao}</b>.</p>
          <ul className="lista-check">
            <li>Publique no <b>LinkedIn</b> com a imagem do badge, como na Credly.</li>
            <li>Adicione em <b>Licenças e certificados</b> do seu perfil.</li>
            <li>Imprima ou salve em <b>PDF</b> (A4 paisagem).</li>
            <li>Cada certificado tem um <b>selo de autenticidade</b> e pode ser conferido na página <a href="validar/">Validar certificado</a>.</li>
          </ul>
        </div>
        <div className="vitrine-badges" aria-label="Badges da trilha">
          {Object.keys(CERTIFICADOS).map((id) => (
            <span key={id} title={CERTIFICADOS[id].titulo} dangerouslySetInnerHTML={{ __html: svgBadge(id, { tamanho: 96 }) }} />
          ))}
        </div>
      </section>

      <section className="faixa" aria-labelledby="todos-titulo">
        <h2 id="todos-titulo">Feito para todo mundo aprender</h2>
        <div className="cartoes">
          <article><h3> Pessoas cegas</h3><p>O leitor de tela fala o resultado de cada teste, com o motivo e a dica. Navegação completa pelo teclado, alto contraste e texto até 175%.</p></article>
          <article><h3> Pessoas surdas e mudas</h3><p>Nada depende de som nem de voz. Tradução para Libras com o VLibras, do Governo Federal. <a href="acessibilidade/">Veja tudo sobre acessibilidade</a>.</p></article>
          <article><h3> Neurodiversidade</h3><p>Perfis prontos para TDAH, dislexia, autismo e ansiedade: modo foco, lista de tarefas, régua de leitura, lembrete de pausa e mensagens gentis.</p></article>
          <article><h3> Privado</h3><p>Sem cookies, sem rastreamento, sem cadastro. Seu progresso fica só no seu navegador. <a href="privacidade/">Saiba mais</a>.</p></article>
          <article><h3> a sala de aula</h3><p>Funciona em qualquer computador com um navegador atualizado, inclusive no projetor. Mande o link direto de um exercício para a turma.</p></article>
        </div>
      </section>

      <section className="cta-final" aria-labelledby="cta-titulo">
        <h2 id="cta-titulo">Pronto para escrever seu primeiro código Go?</h2>
        <p>Comece pela sintaxe básica. Em poucos minutos seu primeiro programa está no ar, aqui mesmo.</p>
        {temProgresso ? (
          <a className="btn btn-verde btn-grande" href={linkItem(j.proximo!.id)}>▶ Continuar</a>
        ) : (
          <a className="btn btn-verde btn-grande" href="trilha/"> Começar agora</a>
        )}
      </section>

      <footer className="rodape-landing">
        <p><b>{EMISSOR.organizacao}</b> · {EMISSOR.curso} · <a href="novidades/">Versão {VERSAO} · Novidades</a></p>
        <p><a href="instrutor/">Quem é o instrutor?</a> · <a href="apoie/">☕ Apoie o projeto</a> · <a href="validar/">Validar certificado</a> · <a href="acessibilidade/">Acessibilidade</a> · <a href="termos/">Termos de uso</a> · <a href="privacidade/">Privacidade e cookies</a> · <a href="licenca/">Licença (AGPL-3.0 e CC BY-SA 4.0)</a> · <a href={REPOSITORIO} target="_blank" rel="noopener noreferrer">Código no GitHub</a></p>
      </footer>
    </div>
  );
}