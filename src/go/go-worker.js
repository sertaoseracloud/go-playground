/* Worker do runtime Go (worker clássico: usa importScripts para o wasm_exec.js do Go).
 *
 * Carrega public/go/divergego.wasm (Go compilado para GOOS=js GOARCH=wasm com o
 * interpretador yaegi, veja go-wasm/main.go) e atende mensagens:
 *
 *   { id, tipo: 'iniciar', base }                  -> { id, ok: true, ms }
 *   { id, tipo: 'compilar', arquivos }             -> { id, erros: string[] }
 *   { id, tipo: 'rodar', arquivos, stdin }         -> { id, stdout, stderr, exitCode }
 *
 * O módulo compilado fica no Cache Storage: depois do primeiro download o Go roda offline.
 * Se o programa do aluno derrubar o runtime (panic numa goroutine), a instância é recriada.
 */
const CACHE = 'divergego-runtime-go-v1';
let base = '';
let modulo = null;
let rodando = null; // { go, pronto }
let saidaRuntime = '';

async function baixarWasm(url) {
  try {
    const cache = await caches.open(CACHE);
    let resposta = await cache.match(url);
    if (!resposta) {
      resposta = await fetch(url);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ao baixar ${url}`);
      await cache.put(url, resposta.clone());
      // Versões antigas do mesmo arquivo ficam com outro ?v= na URL: limpa o que sobrou.
      const novo = new URL(url, self.location.href);
      for (const req of await cache.keys()) {
        const antigo = new URL(req.url);
        if (antigo.pathname === novo.pathname && antigo.href !== novo.href) await cache.delete(req);
      }
    }
    return resposta;
  } catch (erro) {
    if (typeof caches === 'undefined' || erro?.name === 'SecurityError') return fetch(url);
    throw erro;
  }
}

/** `?v=<hash>` do runtime atual (public/go/versao.txt); offline, fica o que estiver no cache. */
async function sufixoDeVersao() {
  const versao = await fetch(`${base}go/versao.txt`, { cache: 'no-cache' }).then((r) => (r.ok ? r.text() : ''), () => '');
  if (versao.trim()) return `?v=${encodeURIComponent(versao.trim())}`;
  const guardado = await caches.open(CACHE).then((c) => c.keys(), () => []);
  return guardado.length ? new URL(guardado[0].url).search : '';
}

async function carregarModulo(sufixo) {
  if (modulo) return modulo;
  const resposta = await baixarWasm(`${base}go/divergego.wasm${sufixo}`);
  modulo = await (WebAssembly.compileStreaming && resposta.headers.get('content-type')?.includes('wasm')
    ? WebAssembly.compileStreaming(resposta)
    : resposta.arrayBuffer().then((b) => WebAssembly.compile(b)));
  return modulo;
}

/** Capta o que o runtime Go escreve direto no stderr (por exemplo, um panic fatal). */
function capturarSaidaDoRuntime() {
  const fs = self.fs;
  if (!fs || fs.__divergego) return;
  const decodificador = new TextDecoder();
  const original = fs.writeSync.bind(fs);
  fs.writeSync = (fd, buf) => {
    if (fd === 1 || fd === 2) {
      saidaRuntime += decodificador.decode(buf);
      return buf.length;
    }
    return original(fd, buf);
  };
  fs.__divergego = true;
}

async function instancia() {
  if (rodando) return rodando;
  const mod = await carregarModulo();
  capturarSaidaDoRuntime();
  if (typeof self.Go !== 'function') throw new Error('wasm_exec.js não carregou.');
  const go = new self.Go();
  const pronto = new Promise((resolve) => { self.__divergeGoPronto = resolve; });
  const inst = await WebAssembly.instantiate(mod, go.importObject);
  const atual = { go, pronto, saiu: null };
  atual.saiu = go.run(inst).then(() => {
    if (rodando === atual) rodando = null;
    return go.exitCode ?? 2;
  });
  rodando = atual;
  await pronto;
  return atual;
}

/** Roda uma chamada ao Go; se a instância cair no meio, responde com o que ela escreveu. */
async function chamar(fn) {
  const atual = await instancia();
  saidaRuntime = '';
  const caiu = atual.saiu.then((codigo) => ({ caiu: true, codigo }));
  let r;
  try {
    r = await Promise.race([fn(), caiu]);
  } catch (erro) {
    // Um panic numa goroutine encerra o runtime no meio da chamada, e o wasm_exec.js
    // estoura ao voltar dela. Se foi isso, responde com a saída do panic.
    r = await Promise.race([caiu, new Promise((resolve) => setTimeout(() => resolve(null), 100))]);
    if (!r) throw erro;
  }
  if (r?.caiu) {
    return { stdout: '', stderr: resumirFalha(saidaRuntime), exitCode: r.codigo || 2 };
  }
  return r;
}

/**
 * Do que o runtime escreveu ao cair, fica o "panic: ..." ou o "fatal error: ..." (por exemplo,
 * um deadlock); a pilha seria a do interpretador, não a do programa do aluno.
 */
function resumirFalha(texto) {
  const falha = texto.match(/(?:panic|fatal error): [^\n]*(?:\n(?!\n|goroutine )[^\n]*)*/);
  const resumo = falha ? falha[0] : texto.trim() || 'O runtime Go encerrou durante a execução.';
  const onde = resumo.startsWith('panic') ? 'o panic aconteceu numa goroutine; ' : '';
  return `${resumo}\n\n(${onde}o Go foi reiniciado)`;
}

// Timers e callbacks de uma instância que já caiu ainda podem disparar e estourar
// "Go program has already exited". Não é erro da execução atual: ignora.
self.addEventListener('error', (evento) => {
  if (/Go program has already exited/.test(evento.message)) evento.preventDefault();
});
self.addEventListener('unhandledrejection', (evento) => {
  if (/Go program has already exited/.test(String(evento.reason?.message ?? evento.reason))) evento.preventDefault();
});

self.onmessage = async ({ data }) => {
  const { id, tipo } = data;
  try {
    if (tipo === 'iniciar') {
      base = data.base;
      const t0 = performance.now();
      const sufixo = await sufixoDeVersao();
      // O wasm_exec.js tem de ser o do mesmo Go que gerou o .wasm: os dois levam o mesmo ?v=.
      // Ele também vai para o cache, para o runtime funcionar offline.
      const exec = await baixarWasm(`${base}go/wasm_exec.js${sufixo}`).then((r) => r.text());
      (0, eval)(exec);
      await carregarModulo(sufixo);
      await instancia();
      self.postMessage({ id, ok: true, ms: Math.round(performance.now() - t0) });
    } else if (tipo === 'compilar') {
      const r = await chamar(() => self.__divergeGoCompilar(data.arquivos));
      self.postMessage({ id, erros: r.erros ?? (r.stderr ? [r.stderr] : []) });
    } else if (tipo === 'rodar') {
      const r = await chamar(() => self.__divergeGoRodar(data.arquivos, data.stdin ?? ''));
      self.postMessage({ id, stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode });
    }
  } catch (erro) {
    self.postMessage({ id, erro: erro?.message || String(erro) });
  }
};
