// Tela de uma lição, problema ou do playground livre.
import { minutosDoItem } from '../cargaHoraria.js';
import { buscarItem, modulos, vizinhos, DIFICULDADES } from '../conteudo/trilha.js';
import { linkItem, linkCompartilhado } from '../compartilhar.js';
import { compilarGo } from '../go/compiler-browser.js';
import { executarGo } from '../go/runtime.js';
import {
  statusDe, marcar, lerRascunho, gravarRascunho, apagarRascunho,
  lerHistorico, gravarHistorico,
} from '../progresso.js';
import { criarTerminal } from './terminal.js';
import { EditorArquivos } from './editor.js';
import { criarGravadorRascunho } from '../rascunho.js';
import { iniciarAvisoArmazenamento } from './aviso-armazenamento.js';
import { iniciarLeitura } from './acessibilidade.js';
import { aplicarChecklist } from './neuro.js';
import { termosDoTexto } from '../conteudo/glossario.js';
import { jornadaAtual, certificadosDaJornada } from './inicio.js';
import { CERTIFICADOS } from '../certificados.js';
import { LIMITE_DESBLOQUEIO } from '../gamificacao.js';
import { $, esc } from './util.js';
import { anunciar, falaDosTestes, leitorDeTela, frase } from './anuncios.js';
import { solucaoLiberada, minutosQueFaltam, criarCronometro } from './solucao.js';

const semPressao = () => document.documentElement.classList.contains('a11y-sem-pressao');

export function criarTelaItem({ layout, definirStatus, aoMudarProgresso }) {
  const el = {
    anterior: $('item-anterior'),
    proximo: $('item-proximo'),
    modulo: $('item-modulo'),
    titulo: $('item-titulo'),
    dificuldade: $('item-dificuldade'),
    status: $('item-status'),
    executar: $('btn-executar'),
    enviar: $('btn-enviar'),
    restaurar: $('btn-restaurar'),
    compartilhar: $('btn-compartilhar'),
    abaSolucao: $('aba-solucao'),
    abaTestes: $('aba-testes'),
    resumoTestes: $('resumo-testes'),
    enunciado: $('desc-enunciado'),
    solucao: $('desc-solucao'),
    resultado: $('resultado'),
    fonte: $('saida-fonte'),
    testes: $('saida-testes'),
    erros: $('erros'),
    terminal: $('janela-terminal'),
    saidaTerminal: $('saida-terminal'),
    maisAcoes: $('btn-mais-acoes'),
    menuMaisAcoes: $('menu-mais-acoes'),
  };

  // O menu "⋯ Mais ações" é inicializado por iniciarMaisAcoes() em main.js;
  // este bloco foi removido para evitar duplicação e conflitos de handlers.

  // O compilador mock (compiler-browser.js) funciona imediatamente no navegador,
  // então os botões começam habilitados. Quando o runtime WASM real estiver integrado,
  // aoMudarEstadoGo(false) será chamado antes do carregamento e aoMudarEstadoGo(true) depois.
  const estado = { item: null, ocupado: false, goPronto: true };

  const rascunhos = criarGravadorRascunho(gravarRascunho);
  iniciarAvisoArmazenamento($('editor'));
  window.addEventListener('pagehide', () => rascunhos.descarregar());
  window.addEventListener('hashchange', () => rascunhos.descarregar());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') rascunhos.descarregar();
  });
  const editor = new EditorArquivos({
    abas: $('abas-arquivos'),
    editor: $('editor'),
    aoExecutar: () => executarPeloAluno(),
    aoEnviar: () => enviar(),
    aoMudar: (arquivos) => {
      rascunhos.agendar(estado.item.id, arquivos);
    },
  });

  // 🖥️ O terminal: comandos go run, go build, ls, cat, clear, help com os arquivos do editor.
  const arquivosDoTerminal = () => ({ ...editor.arquivos, ...(estado.item?.dados ?? {}) });
  const terminal = criarTerminal($('terminal'), {
    historico: lerHistorico(),
    aoMudarHistorico: gravarHistorico,
    completar: (texto) => {
      const comandos = ['go run', 'go build', 'go test', 'go fmt', 'go vet', 'go mod init', 'go version', 'ls', 'cat', 'clear', 'help'];
      return comandos.filter((c) => c.startsWith(texto));
    },
  });

  // ---------- prompt interativo do terminal ----------
  const COMANDOS_TERMINAL = ['go run', 'go build', 'go test', 'go fmt', 'go vet', 'go mod init', 'go version', 'ls', 'cat', 'clear', 'help'];

  async function iniciarPromptTerminal() {
    while (estado.item) {
      const linha = await terminal.ler({ prompt: '$ ', rotulo: 'Comando do terminal Go' });
      if (linha === null || !estado.item) break;
      const cmd = linha.trim();
      if (!cmd) continue;
      if (cmd === 'clear') {
        terminal.limpar();
      } else if (cmd === 'help') {
        terminal.escrever('Comandos disponíveis:\n');
        terminal.escrever('  go run       Compila e executa o código Go\n');
        terminal.escrever('  go build     Compila o código Go\n');
        terminal.escrever('  go test      Roda os testes visíveis\n');
        terminal.escrever('  go fmt       Formata o código\n');
        terminal.escrever('  go vet       Analisa o código\n');
        terminal.escrever('  go version   Mostra a versão do Go\n');
        terminal.escrever('  ls           Lista os arquivos do editor\n');
        terminal.escrever('  cat <arq>    Mostra o conteúdo de um arquivo\n');
        terminal.escrever('  clear        Limpa o terminal\n');
        terminal.escrever('  help         Mostra esta ajuda\n');
      } else if (cmd === 'ls') {
        const nomes = Object.keys(arquivosDoTerminal());
        terminal.escrever(nomes.length ? nomes.join('\n') + '\n' : '(nenhum arquivo)\n');
      } else if (cmd.startsWith('cat ')) {
        const nome = cmd.slice(4).trim();
        const conteudo = arquivosDoTerminal()[nome];
        if (conteudo !== undefined) terminal.escrever(conteudo + '\n');
        else terminal.escrever(`Arquivo não encontrado: ${nome}\n`, 't-vermelho');
      } else if (cmd === 'go version') {
        terminal.escrever('go version go1.22.0 js/wasm (simulado no navegador)\n');
      } else if (cmd.startsWith('go run') || cmd.startsWith('go build') || cmd.startsWith('go test')) {
        await executar({ falar: false, limpar: false });
      } else {
        terminal.escrever(`Comando desconhecido: ${cmd}. Digite "help" para ver os comandos.\n`, 't-amarelo');
      }
    }
  }

  
  // 🔊 Ouvir: lê a aba visível do painel de descrição.
  const leitura = iniciarLeitura($('btn-ouvir'), () =>
    [el.titulo.textContent, ...Object.values(paineisDescricao()).filter((p) => !p.hidden).map((p) => p.innerText)].join('. '));
  const paineisDescricao = () => ({ enunciado: el.enunciado, solucao: el.solucao, testes: $('desc-testes') });

  const ehProblema = () => estado.item?.tipo === 'problema';
  const ehLivre = () => estado.item?.tipo === 'livre';

  // ---------- abas ----------
  const paineisDesc = { enunciado: el.enunciado, solucao: el.solucao, testes: $('desc-testes') };
  function mostrarDesc(nome) {
    for (const [chave, painel] of Object.entries(paineisDesc)) painel.hidden = chave !== nome;
    document.querySelectorAll('[data-desc]').forEach((b) => {
      b.classList.toggle('ativa', b.dataset.desc === nome);
      b.setAttribute('aria-selected', String(b.dataset.desc === nome));
    });
  }
  document.querySelectorAll('[data-desc]').forEach((b) => { b.onclick = () => mostrarDesc(b.dataset.desc); });

  // ---------- aba Solução: só depois do tempo estimado e se não resolvido ----------
  function avisoDaSolucao(item) {
    if (item?.tipo !== 'problema' || solucaoLiberada(item) || statusDe(item.id) === 'resolvido') return '';
    const quando = semPressao()
      ? 'depois de um tempo tentando'
      : `depois de ~${minutosDoItem(item)} min tentando (faltam ${minutosQueFaltam(item)} min)`;
    return `<p class="licao-chip aviso-solucao" id="aviso-solucao">🔒 A solução aparece ${quando}. Tentar antes é o que faz aprender.</p>`;
  }

  function atualizarSolucao({ avisar = false } = {}) {
    const item = estado.item;
    if (!item) return;
    const liberada = solucaoLiberada(item);
    const estava = !el.abaSolucao.hidden;
    el.abaSolucao.hidden = !liberada;
    if (!liberada && !paineisDesc.solucao.hidden) mostrarDesc('enunciado');
    const aviso = document.getElementById('aviso-solucao');
    if (aviso) aviso.outerHTML = avisoDaSolucao(item);
    if (liberada && !estava && avisar) anunciar('A solução deste exercício está disponível na aba Solução.');
  }

  // Conta o tempo de tentativa só com a tela do exercício na frente.
  const cronometro = criarCronometro({
    ativo: () => Boolean(estado.item) && !el.titulo.closest('[hidden]'),
    aoMudar: () => atualizarSolucao({ avisar: true }),
  });

  const saidas = { resultado: $('saida-resultado'), fonte: el.fonte, terminal: $('janela-terminal') };
  function mostrarSaida(nome) {
    for (const [chave, painel] of Object.entries(saidas)) painel.hidden = chave !== nome;
    document.querySelectorAll('[data-saida]').forEach((b) => {
      b.classList.toggle('ativa', b.dataset.saida === nome);
      b.setAttribute('aria-selected', String(b.dataset.saida === nome));
    });
  }
  document.querySelectorAll('[data-saida]').forEach((b) => { b.onclick = () => mostrarSaida(b.dataset.saida); });

  // ---------- descrição e solução ----------
  function renderDescricao() {
    const item = estado.item;
    const moduloNoCaminho = jornadaAtual().modulos.find((m) => m.id === item.modulo);
    const avisoBloqueio = moduloNoCaminho && !moduloNoCaminho.desbloqueado ? `
      <div class="etapa-info">🔒 Este módulo ainda está bloqueado no caminho: resolva ${LIMITE_DESBLOQUEIO}% do módulo anterior.
        Você pode praticar aqui, mas siga a trilha na ordem para aproveitar melhor.</div>` : '';
    if (item.tipo !== 'problema') {
      el.enunciado.innerHTML = avisoBloqueio + item.resumo + glossario(item, item.titulo, item.resumo);
      aplicarChecklist(el.enunciado, item.id);
      return;
    }
    const etapa = item.projeto ? `
      <div class="etapa-info">
        <p><b>${esc(item.projeto.icone)} ${esc(item.projeto.titulo)}</b> · etapa ${item.etapa} de ${item.totalEtapas}</p>
        ${estado.origem === 'aluno'
          ? `<p>Você continua do <b>seu código</b> da etapa anterior.
              <button class="btn btn-fantasma btn-pequeno" id="btn-referencia">Usar o código de referência</button></p>`
          : item.etapaAnterior ? '<p>O código inicial é a solução de referência da etapa anterior.</p>' : ''}
      </div>` : '';
    const ocultos = (item.testes || []).filter((t) => t.oculto).length;
    el.enunciado.innerHTML = `
      ${avisoBloqueio}
      ${etapa}
      <ol class="roteiro" aria-label="Como resolver" tabindex="0">
        <li>Leia o que fazer</li><li>Faça uma parte</li><li>▶ Executar</li><li>Confira os ✅</li><li>⬆ Enviar</li>
      </ol>
      <section class="secao secao-fazer"><h2>🎯 O que fazer</h2>${item.enunciado}</section>
      ${glossario(item, item.titulo, item.enunciado, item.dica)}
      ${comoConferir(item.testes)}
      ${ocultos ? `<p class="licao-chip">+ ${ocultos} caso(s) oculto(s) rodam quando você clica em ⬆ Enviar. Eles usam outros dados, para conferir que o seu código não está "decorado".</p>` : ''}
      ${avisoDaSolucao(item)}
      <details><summary>💡 Dica</summary><p><code>${esc(item.dica)}</code></p></details>`;
    aplicarChecklist(el.enunciado, item.id);
    $('btn-referencia')?.addEventListener('click', () => {
      if (!confirm('Trocar o seu código pelo código de referência desta etapa?')) return;
      rascunhos.cancelar(item.id);
      editor.carregar(item.arquivos);
      gravarRascunho(item.id, item.arquivos);
      estado.origem = 'referencia';
      renderDescricao();
      executar();
    });
  }

  /** "Como saber que deu certo": as regras dos casos visíveis, em linguagem simples. */
  function comoConferir(testes) {
    if (!testes?.length) return '';
    const blocos = testes.filter((t) => !t.oculto).map((t) => {
      const regras = (t.regras || []).map((r) => r.mensagem || 'Verificação').filter(Boolean);
      if (!regras.length) return '';
      return `<p class="caso-exemplo"><span class="rotulo">Ao executar:</span></p>
        <ul>${regras.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`;
    }).join('');
    return blocos ? `<section class="secao secao-conferir"><h2>✅ Como saber que deu certo</h2>${blocos}</section>` : '';
  }

  /** Palavras técnicas do desafio, cada uma com explicação, analogia e exemplo. */
  function glossario(item, ...textos) {
    const div = document.createElement('div');
    div.innerHTML = textos.join(' ');
    const termos = termosDoTexto(div.textContent, { modulo: item.modulo });
    if (!termos.length) return '';
    return `
      <section class="secao glossario">
        <h2>📚 Palavras técnicas</h2>
        <p class="glossario-ajuda">Toque numa palavra para ver o que ela significa, com uma comparação do dia a dia.</p>
        ${termos.map((t) => `
          <details class="termo">
            <summary><b>${esc(t.termo)}</b><span>${esc(t.definicao)}</span></summary>
            <p class="analogia"><span aria-hidden="true">🧠</span> <b>Pense assim:</b> ${esc(t.analogia)}</p>
            ${t.exemplo ? `<pre class="trecho exemplo-termo"><code>${esc(t.exemplo)}</code></pre>` : ''}
          </details>`).join('')}
      </section>`;
  }

  function renderSolucao() {
    const item = estado.item;
    el.solucao.innerHTML = `
      <p>Tente resolver sozinho antes! Se travar, veja a dica na aba Descrição.</p>
      <button class="btn btn-fantasma" id="btn-revelar">👀 Mostrar solução</button>`;
    $('btn-revelar').onclick = () => {
      el.solucao.innerHTML = `
        ${Object.entries(item.solucao).map(([nome, codigo]) => `<h2>${esc(nome)}</h2><pre class="codigo-solucao">${esc(codigo)}</pre>`).join('')}
        <button class="btn btn-roxo" id="btn-usar-solucao">Copiar para o editor</button>`;
      $('btn-usar-solucao').onclick = () => {
        if (!confirm('Substituir o seu código pela solução?')) return;
        rascunhos.cancelar(item.id);
        editor.carregar(item.solucao);
        gravarRascunho(item.id, item.solucao);
        executar();
      };
    };
  }

  function renderCabecalho() {
    const item = estado.item;
    const modulo = modulos.find((m) => m.id === item.modulo);
    el.modulo.textContent = item.projeto
      ? `${item.projeto.icone} ${item.projeto.titulo} · ${item.etapa}/${item.totalEtapas}`
      : modulo ? `${modulo.icone} ${modulo.titulo}` : '🧪 Livre';
    el.titulo.textContent = item.titulo;
    el.dificuldade.className = item.tipo === 'problema' ? `dificuldade ${item.dificuldade}` : 'licao-chip';
    el.dificuldade.textContent = item.tipo === 'problema' ? DIFICULDADES[item.dificuldade] : item.tipo === 'licao' ? 'Lição' : '';
    const minutos = minutosDoItem(item);
    if (minutos) el.dificuldade.textContent += ` · ⏱ ~${minutos} min`;
    el.dificuldade.title = minutos ? `Tempo estimado: cerca de ${minutos} minutos (conta na carga horária do certificado)` : '';
    const status = statusDe(item.id);
    el.status.textContent = item.tipo === 'problema' && status === 'resolvido' ? '✅ Resolvido' : status === 'tentado' ? '◐ Tentado' : '';
    el.status.className = 'chip';
    el.status.hidden = !el.status.textContent;

    const { anterior, proximo } = ehLivre() ? {} : vizinhos(item.id);
    for (const [botao, alvo] of [[el.anterior, anterior], [el.proximo, proximo]]) {
      botao.classList.toggle('desativado', !alvo);
      botao.href = alvo ? linkItem(alvo.id) : '#';
      botao.title = alvo ? alvo.titulo : '';
      botao.hidden = ehLivre();
    }
  }

  // ---------- abrir ----------
  function abrir(id, arquivosCompartilhados) {
    const item = buscarItem(id);
    if (!item) return false;
    rascunhos.descarregar();
    estado.item = item;
    estado.origem = null;
    let arquivos = arquivosCompartilhados ?? lerRascunho(id);
    // Etapa de projeto: quem resolveu a etapa anterior continua do próprio código.
    if (!arquivos && item.etapaAnterior && statusDe(item.etapaAnterior) === 'resolvido') {
      const anterior = lerRascunho(item.etapaAnterior);
      if (anterior) {
        arquivos = anterior;
        estado.origem = 'aluno';
        gravarRascunho(id, anterior);
      }
    }
    editor.carregar(arquivos ?? item.arquivos);

    renderCabecalho();
    renderDescricao();
    el.enviar.hidden = !ehProblema();
    el.abaSolucao.hidden = !solucaoLiberada(item);
    cronometro.iniciar(item);
    el.abaTestes.hidden = !ehProblema();
    // No go-playground, não há estado PHP; os botões ficam habilitados assim que a tela abre.
    el.executar.disabled = false;
    el.enviar.disabled = false;
    layout.aplicar();
    leitura.parar();
    if (ehProblema()) {
      renderSolucao();
      renderTestesPendentes();
    }
    el.resultado.srcdoc = '';
    el.fonte.textContent = '';
    mostrarErros('');
    mostrarDesc('enunciado');
    mostrarSaida('terminal');
    terminal.limpar();
    terminal.escrever('Go Playground · digite "help" para ver os comandos.\n');
    // Inicia o prompt interativo para que o terminal aceite comandos imediatamente.
    iniciarPromptTerminal().catch(() => {});
    return true;
  }

  // ---------- execução ----------
  function mostrarErros(texto) {
    el.erros.hidden = !texto;
    el.erros.textContent = texto ?? '';
  }

  function tratarErro(erro) {
    mostrarErros(String(erro?.message ?? erro));
    definirStatus('Erro ao executar', { falar: frase(`Erro ao executar: ${erro?.message ?? erro}`) });
  }

  /** O resultado da execução, falado: saída do programa Go. */
  function falaDoGo(r) {
    const saida = r.stdout?.trim() || 'Sem saída.';
    const erros = r.stderr?.trim() || '';
    const lidos = leitorDeTela() ? erros.split('\n').slice(0, 5) : erros.split('\n').slice(0, 1);
    return [
      `Saída: ${saida.slice(0, 200)}.`,
      erros ? `O compilador mostrou ${erros.split('\n').length} mensagem(ns) de erro.` : 'Sem erros do compilador.',
      ...lidos.filter(Boolean).map(frase),
      'O resultado está na aba Resultado.',
    ].join(' ');
  }

  /** Executar pedido pelo aluno (botão ou Ctrl+Enter): mostra a aba de testes com o resultado. */
  const executarPeloAluno = () => executar(undefined, { abrirTestes: true, falar: true });

  /** Abre a aba 🧪 Testes (e a descrição, se estiver oculta). */
  function abrirAbaTestes() {
    if (!ehProblema()) return;
    layout.mostrarDescricao();
    mostrarDesc('testes');
  }

  async function executar(_req = undefined, { abrirTestes = false, falar = false } = {}) {
    if (!estado.item) return;
    const item = estado.item;
    const arquivos = { ...editor.arquivos };
    definirStatus('Compilando…', { falar: false });
    try {
      const { js, erros } = await compilarGo(arquivos['main.go'] || '', arquivos);
      if (estado.item !== item) return;
      if (erros.length > 0) {
        mostrarErros(erros.join('\n'));
        definirStatus('Erro de compilação', { falar: frase(`Erro: ${erros[0]}`) });
        return;
      }
      // Executa o JS gerado (simulando o runtime Go)
      const resultado = await executarGo(js);
      if (estado.item !== item) return;
      el.resultado.srcdoc = `<pre style="font-family:monospace;padding:1em">${esc(resultado.stdout || '')}</pre>`;
      el.fonte.textContent = resultado.stdout || '';
      mostrarErros(resultado.stderr || '');
      const fala = falaDoGo(resultado);
      const comTestes = item.tipo === 'problema';
      definirStatus(`Go · ${resultado.ms || 0} ms`, { falar: falar && !comTestes && fala });

      if (item.tipo === 'licao' && !statusDe(item.id)) {
        marcar(item.id, 'resolvido');
        aoMudarProgresso();
      }
      if (comTestes) {
        const resultadoTestes = await rodarTestes({ incluirOcultos: false, saida: resultado.stdout });
        if (estado.item !== item) return;
        if (falar) anunciar(`${fala} ${falarTestes(resultadoTestes, false)}`);
        if (abrirTestes) abrirAbaTestes();
      }
    } catch (erro) {
      tratarErro(erro);
    }
  }

  async function rodarTestes({ incluirOcultos, saida }) {
    const item = estado.item;
    const resultados = item.testes
      .filter((t) => incluirOcultos || !t.oculto)
      .map((t) => {
        const passou = t.regras.every((r) => {
          if (r.codigo) {
            // Verificação no código fonte
            return item.arquivos['main.go']?.includes(r.valor);
          }
          if (r.saida) {
            // Verificação na saída
            return saida?.includes(r.valor);
          }
          return false;
        });
        return { ok: passou, mensagem: t.descricao || 'Verificação', resultados: t.regras.map((r) => ({ ok: passou, mensagem: r.mensagem || 'Verificação' })) };
      });
    const aprovado = resultados.every((r) => r.ok);
    return { aprovado, relatorio: resultados };
  }

  // ---------- casos de teste ----------
  function cardCaso({ nome, teste, resultado }) {
    const oculto = Boolean(teste.oculto);
    const situacao = resultado ? (resultado.ok ? 'ok' : 'falha') : 'pendente';
    const icone = { ok: '✅', falha: '❌', pendente: '⏳' }[situacao];
    const descricao = oculto ? (resultado ? 'caso oculto' : 'rode ⬆ Enviar') : teste.descricao ?? 'verificação';
    const verificacoes = resultado
      ? (resultado.resultados || []).map((r) => ({ ...r, situacao: r.ok ? 'ok' : 'falha' }))
      : (teste.regras || []).map((r) => ({ mensagem: r.mensagem || 'Verificação', situacao: 'pendente' }));
    const visiveis = oculto ? verificacoes.filter((r) => r.situacao === 'falha') : verificacoes;
    const passaram = verificacoes.filter((r) => r.situacao === 'ok').length;
    const placar = resultado
      ? `${passaram}/${verificacoes.length} verificações`
      : oculto ? '' : `${verificacoes.length} verificações`;
    return `
      <details class="caso ${situacao}" ${situacao === 'falha' ? 'open' : ''}>
        <summary>${icone} ${nome}<span class="url">${esc(descricao)}</span>${placar ? `<span class="placar">${placar}</span>` : ''}</summary>
        <div class="corpo-caso">
          ${visiveis.length ? `<p class="rotulo-caso">${resultado ? 'Verificações' : 'O que este caso confere'}</p>
          <ul class="verificacoes">${visiveis.map((r) => itemVerificacao(r, r.situacao)).join('')}</ul>` : ''}
          ${oculto && resultado?.ok ? '<p class="nota-caso">Todas as verificações deste caso passaram.</p>' : ''}
        </div>
      </details>`;
  }

  function itemVerificacao(r, situacao) {
    const marca = { ok: '✅', falha: '❌', pendente: '⏳' }[situacao];
    return `
      <li class="verificacao ${situacao}">
        <span class="marca" aria-hidden="true">${marca}</span>
        <div>
          <span class="chip-categoria">Verificação</span>
          <span class="sr">${{ ok: 'passou', falha: 'falhou', pendente: 'ainda não rodou' }[situacao]}: </span>${esc(r.mensagem)}
        </div>
      </li>`;
  }

  function nomesDosCasos(testes) {
    if (!testes?.length) return [];
    let visivel = 0;
    let oculto = 0;
    return testes.map((t) => (t.oculto ? `🔒 Oculto ${++oculto}` : `Caso ${++visivel}`));
  }

  /** Resumo no nome da aba: curto ("✅ 3/3"); o texto completo vai na dica e no leitor de tela. */
  function definirResumo(texto, classe = '') {
    const curto = texto.match(/^[✅❌]\s*\d+\/\d+/)?.[0] ?? (texto.startsWith('rodando') ? '⏳' : '');
    el.resumoTestes.textContent = curto;
    el.resumoTestes.className = `resumo-testes ${classe}`;
    el.abaTestes.title = `Testes funcionais: ${texto}`;
    el.abaTestes.setAttribute('aria-label', `Testes: ${texto}`);
  }

  /** Antes de executar: lista todos os casos como pendentes. */
  function renderTestesPendentes() {
    const testes = estado.item.testes || [];
    const nomes = nomesDosCasos(testes);
    el.testes.innerHTML = `
      <p class="veredito-sub"><b>▶ Executar</b> roda os casos visíveis. <b>⬆ Enviar</b> roda todos, inclusive os ocultos, e marca a questão como resolvida.</p>
      <div class="casos">${testes.map((t, i) => cardCaso({ nome: nomes[i], teste: t })).join('')}</div>`;
    definirResumo(`${testes.length} casos · ainda não executado`);
  }

  function renderTestes({ aprovado, relatorio }, envio) {
    const testes = estado.item.testes || [];
    const nomes = nomesDosCasos(testes);
    const porTeste = new Map(relatorio.map((r, i) => [envio ? testes[i] : testes.filter((t) => !t.oculto)[i], r]));
    const cards = testes.map((t, i) => cardCaso({ nome: nomes[i], teste: t, resultado: porTeste.get(t) })).join('');

    const passaram = relatorio.filter((t) => t.ok).length;
    const gentil = semPressao();
    const titulo = aprovado
      ? (envio ? 'Aceito 🎉 Você acertou a questão!' : 'Casos visíveis passaram')
      : (gentil ? 'Ainda não passou, e tudo bem: errar faz parte' : 'Resposta errada');
    const sub = aprovado && !envio
      ? 'Agora clique em ⬆ Enviar para rodar também os casos ocultos.'
      : gentil && !aprovado
        ? `${passaram} de ${relatorio.length} casos já funcionam. Abra o caso marcado abaixo para ver o próximo ajuste.`
        : `${passaram}/${relatorio.length} casos passaram${envio ? ' (incluindo os ocultos)' : ''}.`;
    const { proximo } = vizinhos(estado.item.id);
    el.testes.innerHTML = `
      <p class="veredito ${aprovado ? 'ok' : 'falha'}">${titulo}</p>
      <p class="veredito-sub">${sub}
      ${aprovado && envio && proximo ? `<a class="btn btn-roxo btn-pequeno proximo-problema" href="${linkItem(proximo.id)}">Próximo: ${esc(proximo.titulo)} ›</a>` : ''}</p>
      <div class="casos">${cards}</div>`;
    definirResumo(
      `${aprovado ? '✅' : '❌'} ${passaram}/${relatorio.length} ${envio ? 'casos (todos)' : 'casos visíveis'}`,
      aprovado ? 'ok' : 'falha',
    );
  }

  /** O que o leitor de tela fala sobre os testes (com os nomes da aba Testes). */
  function falarTestes(resultado, envio, extras = {}) {
    const testes = estado.item.testes || [];
    const nomes = nomesDosCasos(testes);
    const rodados = envio ? testes : testes.filter((t) => !t.oculto);
    return falaDosTestes(resultado, {
      envio,
      gentil: semPressao(),
      detalhado: leitorDeTela(),
      nomes: rodados.map((t) => nomes[testes.indexOf(t)]),
      ...extras,
    });
  }

  async function enviar() {
    if (!ehProblema() || estado.ocupado) return;
    estado.ocupado = true;
    el.enviar.disabled = true;
    el.testes.innerHTML = '<p class="veredito-sub">Rodando todos os casos de teste…</p>';
    abrirAbaTestes();
    definirResumo('rodando…');
    definirStatus('Enviando…');
    try {
      // Executa primeiro para obter a saída
      const arquivos = { ...editor.arquivos };
      const { js, erros } = await compilarGo(arquivos['main.go'] || '', arquivos);
      if (erros.length > 0) {
        mostrarErros(erros.join('\n'));
        throw new Error(erros[0]);
      }
      const resultadoExec = await executarGo(js);
      const resultado = await rodarTestes({ incluirOcultos: true, saida: resultadoExec.stdout });
      const { aprovado } = resultado;
      let conquista = '';
      marcar(estado.item.id, aprovado ? 'resolvido' : 'tentado');
      renderCabecalho();
      atualizarSolucao();
      aoMudarProgresso();
      const jornada = jornadaAtual();
      const modulo = jornada.modulos.find((m) => m.id === estado.item.modulo);
      if (aprovado && modulo?.concluido) {
        const cert = certificadosDaJornada(jornada).find((c) => c.id === modulo.id);
        const aviso = cert?.liberado
          ? 'Seu certificado está liberado.'
          : `Os certificados são liberados na ordem da trilha: conclua também <b>${esc(CERTIFICADOS[cert?.falta]?.titulo ?? '')}</b> para receber o seu.`;
        conquista = `Você concluiu o módulo ${modulo.titulo}! ${aviso.replace(/<[^>]+>/g, '')}`;
        el.testes.insertAdjacentHTML('afterbegin', `
          <div class="comemoracao">🏆 Você concluiu o módulo <b>${esc(modulo.titulo)}</b>!
            ${aviso}
            <a class="btn btn-roxo btn-pequeno" href="#/trilha">Ver no caminho</a></div>`);
      }
      definirStatus(aprovado ? 'Aceito! 🎉' : semPressao() ? 'Ainda não passou: veja o que falta' : 'Resposta errada', {
        falar: `${falarTestes(resultado, true)} ${conquista}`.trim(),
      });
    } catch (erro) {
      tratarErro(erro);
      el.testes.innerHTML = `<p class="veredito falha">Erro</p><p class="veredito-sub">${esc(erro.message)}</p>`;
    } finally {
      estado.ocupado = false;
      el.enviar.disabled = false;
    }
  }

  // ---------- eventos ----------
  if (el.executar) el.executar.onclick = () => executarPeloAluno();
  if (el.enviar) el.enviar.onclick = () => enviar();

  if (el.restaurar) el.restaurar.onclick = () => {
    if (!confirm('Voltar ao código original? Suas alterações serão perdidas.')) return;
    rascunhos.cancelar(estado.item.id);
    apagarRascunho(estado.item.id);
    editor.carregar(estado.item.arquivos);
    executar({ url: `/${editor.principal}` });
  };

  if (el.compartilhar) el.compartilhar.onclick = async () => {
    const link = `${location.origin}${location.pathname}${linkCompartilhado({ item: estado.item.id, arquivos: editor.arquivos })}`;
    try {
      await navigator.clipboard.writeText(link);
      definirStatus('🔗 Link copiado!');
    } catch {
      prompt('Copie o link:', link);
    }
  };

  return {
    abrir,
    terminal,
    redesenharDescricao: () => estado.item && renderDescricao(),
    aoMudarEstadoGo(pronto) {
      estado.goPronto = pronto;
      el.executar.disabled = !pronto;
      el.enviar.disabled = !pronto;
    },
  };
}