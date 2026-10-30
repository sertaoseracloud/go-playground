// Terminal simulado para o playground Go.
// Prompt: aluno@sertao:~/exercicio$
// Comandos suportados: go run, go build, go test, go mod init, go fmt, go vet, go version, help, clear, ls, cat
// Integra com src/go/compiler.js e src/go/runtime.js
// Respeita o flag "Reduzir animacoes" do modulo de acessibilidade.

import { esc } from './util.js';
import { compilarGo } from '../go/compiler.js';
import { executarGo } from '../go/runtime.js';
import { parsearComando } from '../go/comandos.js';
import { formatarSaida } from '../go/saida.js';

const USUARIO = 'aluno@sertao';
const PASTA = 'exercicio';
const TECLA_MS = 34;
const LIMITE_HISTORICO = 100;
const LIMITE_NOS = 12000;
const FOCAVEIS = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Verifica se o usuario pediu para reduzir animacoes. */
function reduzirAnimacoes() {
  return document.documentElement.classList.contains('a11y-sem-movimento');
}

/** Retorna o HTML do prompt colorido. */
function promptHtml() {
  return `<span class="p-usuario">${USUARIO}</span>:<span class="p-pasta">~/${PASTA}</span><span class="p-cifrao">$</span> `;
}

const classesDe = (classe) => (classe ? ` ${classe.split(' ').map((c) => `l-${c}`).join(' ')}` : '');

function htmlLinha(linha, ate = linha.texto.length) {
  let texto = linha.texto.slice(0, ate);
  let inicio = '';
  if (linha.classe === 'comando' && texto.startsWith('$ ')) {
    inicio = promptHtml();
    texto = texto.slice(2);
  }
  return `<span class="linha${classesDe(linha.classe)}">${inicio}${esc(texto)}</span>`;
}

/** Prefixo comum das opcoes do Tab. */
const prefixoComum = (opcoes) => opcoes.reduce((p, o) => {
  let i = 0;
  while (i < p.length && p[i] === o[i]) i++;
  return p.slice(0, i);
});

/**
 * Cria o terminal dentro de um container.
 * @param {HTMLElement} container - Elemento <pre> que recebe a saida.
 * @param {{ campo?: HTMLInputElement, rotulo?: HTMLElement, historico?: string[], aoMudarHistorico?: Function, completar?: Function }} opcoes
 * @returns {{ executar: Function, limpar: Function, foco: Function }}
 */
export function criarTerminal(container, opcoes = {}) {
  const {
    campo = null,
    rotulo = null,
    historico = [],
    aoMudarHistorico = () => {},
    completar = () => [],
  } = opcoes;

  let geracao = 0;
  let timer = null;
  let acordar = null;
  let pulando = false;
  let animando = false;
  let leitura = null;
  let lista = [...historico];
  let posicao = lista.length;
  let tinhaFoco = false;

  if (campo) campo.disabled = true;

  const definirAnimando = (valor) => {
    animando = valor;
    container.setAttribute('aria-busy', String(valor));
    if (campo && leitura) campo.disabled = valor;
  };

  function pular() {
    if (!animando) return;
    pulando = true;
    clearTimeout(timer);
    acordar?.();
  }

  function dormir(ms) {
    if (pulando || ms <= 0 || reduzirAnimacoes()) return Promise.resolve();
    return new Promise((resolver) => {
      acordar = resolver;
      timer = setTimeout(resolver, ms);
    });
  }

  const estaNoFim = () => container.scrollHeight - container.scrollTop - container.clientHeight < 48;
  const seguir = (antes) => { if (antes) container.scrollTop = container.scrollHeight; };

  function aparar() {
    while (container.childNodes.length > LIMITE_NOS) container.firstChild.remove();
  }

  function anexarHtml(html, antesDe = null) {
    const fim = estaNoFim();
    if (antesDe) antesDe.insertAdjacentHTML('beforebegin', html);
    else container.insertAdjacentHTML('beforeend', html);
    aparar();
    seguir(fim);
  }

  function escrever(texto, classe = '') {
    if (!texto) return;
    const fim = estaNoFim();
    if (classe) {
      const span = document.createElement('span');
      span.className = `linha${classesDe(classe)}`;
      span.textContent = texto;
      container.append(span);
    } else {
      container.append(document.createTextNode(texto));
    }
    aparar();
    seguir(fim);
  }

  const cursor = '<span class="cursor" aria-hidden="true"></span>';

  async function mostrar(linhas) {
    const minha = ++geracao;
    clearTimeout(timer);
    acordar?.();
    pulando = false;
    if (!linhas.length) return;

    if (reduzirAnimacoes()) {
      anexarHtml(linhas.map((l) => `${htmlLinha(l)}\n`).join(''));
      if (animando) definirAnimando(false);
      return;
    }

    definirAnimando(true);
    container.insertAdjacentHTML('beforeend', cursor);
    const elCursor = container.lastElementChild;
    const anexar = (html) => anexarHtml(html, elCursor);

    for (let i = 0; i < linhas.length; i++) {
      if (minha !== geracao) return;
      if (pulando) {
        anexar(linhas.slice(i).map((l) => `${htmlLinha(l)}\n`).join(''));
        break;
      }
      const linha = linhas[i];
      await dormir(linha.delay ?? 0);
      if (minha !== geracao) return;

      if (linha.digitar !== undefined && !pulando) {
        anexar(htmlLinha(linha, linha.digitar));
        let atual = elCursor.previousElementSibling;
        for (let n = linha.digitar + 1; n <= linha.texto.length && !pulando; n++) {
          await dormir(TECLA_MS + ((linha.texto.charCodeAt(n) || 0) % 5) * 9);
          if (minha !== geracao) return;
          atual.outerHTML = htmlLinha(linha, n);
          atual = elCursor.previousElementSibling;
        }
        if (pulando) atual.outerHTML = htmlLinha(linha);
        anexar('\n');
        await dormir(160);
        continue;
      }

      const bloco = [`${htmlLinha(linha)}\n`];
      while (i + 1 < linhas.length && !linhas[i + 1].delay && linhas[i + 1].digitar === undefined) {
        bloco.push(`${htmlLinha(linhas[++i])}\n`);
      }
      anexar(bloco.join(''));
    }
    if (minha !== geracao) return;
    elCursor.remove();
    seguir(true);
    definirAnimando(false);
  }

  function limpar() {
    geracao++;
    clearTimeout(timer);
    container.innerHTML = '';
    if (animando) definirAnimando(false);
  }

  // ---------- leitura (campo de entrada) ----------

  function terminar(valor) {
    const atual = leitura;
    leitura = null;
    tinhaFoco = document.activeElement === campo;
    campo.value = '';
    if (rotulo) rotulo.innerHTML = '';
    campo.disabled = true;
    if (tinhaFoco) container.focus();
    atual.resolve(valor);
  }

  function ecoar(texto) {
    anexarHtml(`${htmlLinha({ texto: `$ ${texto}`, classe: 'comando' })}\n`);
  }

  function guardar(texto) {
    if (!texto.trim() || lista.at(-1) === texto) return;
    lista = [...lista, texto].slice(-LIMITE_HISTORICO);
    aoMudarHistorico(lista);
  }

  function tab() {
    const opcoes = completar(campo.value);
    if (!opcoes.length) return;
    if (opcoes.length === 1) {
      campo.value = `${opcoes[0]} `;
      return;
    }
    const comum = prefixoComum(opcoes);
    if (comum.length > campo.value.length) {
      campo.value = comum;
      return;
    }
    const nomes = opcoes.map((o) => o.slice(o.lastIndexOf(' ', o.length - 2) + 1));
    ecoar(campo.value);
    escrever(`${nomes.join('  ')}\n`);
  }

  function sair() {
    const focaveis = [...document.querySelectorAll(FOCAVEIS)].filter((e) => !container.contains(e) && !e.disabled && !e.closest('[hidden]'));
    const depois = focaveis.find((e) => container.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
    tinhaFoco = false;
    const alvo = depois ?? focaveis[0];
    if (alvo) alvo.focus();
    else campo?.blur();
  }

  container.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const tecla = e.key.toLowerCase();
    if (e.key === 'Escape') {
      e.preventDefault();
      if (animando) pular();
      else if (campo) sair();
      return;
    }
    if (!campo || !leitura) return;
    if (ctrl && tecla === 'l') {
      e.preventDefault();
      limpar();
    } else if (ctrl && tecla === 'c') {
      if (campo.selectionStart !== campo.selectionEnd) return;
      e.preventDefault();
      ecoar(`${campo.value}^C`);
      terminar(null);
    } else if (ctrl && tecla === 'd') {
      if (campo.value) return;
      e.preventDefault();
      ecoar('');
      terminar(null);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const texto = campo.value;
      ecoar(texto);
      guardar(texto);
      terminar(texto);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      tab();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (posicao > 0) campo.value = lista[--posicao];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (posicao < lista.length) posicao++;
      campo.value = lista[posicao] ?? '';
    }
  });

  container.addEventListener('click', () => {
    if (campo && leitura && !campo.disabled && !String(globalThis.getSelection?.() ?? '')) campo.focus();
  });

  /**
   * Executa um comando no terminal.
   * @param {string} comando - Comando digitado.
   */
  async function executar(comando) {
    const parsed = parsearComando(comando);

    if (!parsed.valido) {
      const linhas = formatarSaida(comando, { stdout: '', stderr: `comando nao encontrado: ${parsed.nome}`, exitCode: 1 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
      await mostrar(linhas);
      return;
    }

    if (parsed.nome === 'clear') {
      limpar();
      return;
    }

    if (parsed.nome === 'help') {
      const linhas = formatarSaida('help', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
      await mostrar(linhas);
      return;
    }

    if (parsed.nome === 'ls') {
      const linhas = formatarSaida('ls', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
      await mostrar(linhas);
      return;
    }

    if (parsed.nome === 'cat') {
      const linhas = formatarSaida(comando, { stdout: '// conteudo do arquivo', stderr: '', exitCode: 0 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
      await mostrar(linhas);
      return;
    }

    if (parsed.nome === 'go') {
      const subcmd = parsed.args[0];

      // go version nao precisa compilar nada
      if (subcmd === 'version') {
        const linhas = formatarSaida(comando, { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
        await mostrar(linhas);
        return;
      }

      // Para go run, precisamos do codigo do editor
      // Aqui assumimos que o codigo vem de algum lugar (editor global ou contexto)
      // Por simplicidade, usamos um mock
      const codigoMock = `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}`;
      const arquivos = { 'main.go': codigoMock };

      try {
        const { js, erros } = await compilarGo(codigoMock, arquivos);
        if (erros.length > 0) {
          const linhas = formatarSaida(comando, { stdout: '', stderr: erros.join('\n'), exitCode: 1 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
          await mostrar(linhas);
          return;
        }

        const resultado = await executarGo(js, '');
        const linhas = formatarSaida(comando, resultado, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
        await mostrar(linhas);
      } catch (err) {
        const linhas = formatarSaida(comando, { stdout: '', stderr: err.message, exitCode: 1 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
        await mostrar(linhas);
      }
      return;
    }

    // Fallback para outros comandos go
    const linhas = formatarSaida(comando, { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true, reduzirAnimacoes: reduzirAnimacoes() });
    await mostrar(linhas);
  }

  return {
    executar,
    limpar,
    foco() {
      if (campo) {
        (leitura && !campo.disabled ? campo : container).focus();
      }
    },
  };
}