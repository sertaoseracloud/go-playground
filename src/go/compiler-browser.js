/**
 * Go de verdade no navegador.
 *
 * O código do aluno roda no interpretador yaegi compilado para WebAssembly
 * (go-wasm/main.go → public/go/divergego.wasm, gerado por `npm run go:wasm`).
 * É a biblioteca padrão real do Go: maps, goroutines e canais, genéricos,
 * encoding/json, sort, net/http e httptest (numa rede em memória, sem sair da aba).
 *
 * Tudo roda num Web Worker (src/go/go-worker.js), para um laço infinito não travar
 * a página: depois de LIMITE_MS o worker é encerrado e recriado.
 *
 * A interface continua a mesma de antes: `compilarGo` devolve `{ js, erros }`, onde
 * `js` agora é só um pacote opaco com os arquivos, que `executarGo` roda.
 */

/** Tempo máximo de uma execução (laço infinito, deadlock…). */
export const LIMITE_MS = 10_000;

let worker = null;
let iniciando = null;
let proximoId = 1;
const pendentes = new Map();
let fila = Promise.resolve();
let carregado = false;

function baseDoSite() {
  const base = import.meta.env?.BASE_URL ?? './';
  return new URL(base, document.baseURI).href;
}

function criarWorker() {
  worker = new Worker(new URL('./go-worker.js', import.meta.url));
  worker.onmessage = ({ data }) => {
    const p = pendentes.get(data.id);
    if (!p) return;
    pendentes.delete(data.id);
    if (data.erro) p.reject(new Error(data.erro));
    else p.resolve(data);
  };
  worker.onerror = (evento) => {
    const erro = new Error(evento.message || 'Falha no worker do Go.');
    for (const p of pendentes.values()) p.reject(erro);
    pendentes.clear();
  };
}

function pedir(mensagem) {
  const id = proximoId++;
  return new Promise((resolve, reject) => {
    pendentes.set(id, { resolve, reject });
    worker.postMessage({ ...mensagem, id });
  });
}

function descartarWorker() {
  worker?.terminate();
  worker = null;
  iniciando = null;
  for (const p of pendentes.values()) p.reject(new Error('Worker do Go encerrado.'));
  pendentes.clear();
}

/**
 * Baixa e inicia o runtime Go (só na primeira vez; depois vem do cache, inclusive offline).
 * Pode ser chamada cedo para adiantar o download.
 * @returns {Promise<void>}
 */
export function prepararGo() {
  if (!iniciando) {
    try {
      criarWorker();
    } catch (erro) {
      return Promise.reject(new Error(`Não foi possível carregar o Go no navegador: ${erro?.message || erro}`));
    }
    iniciando = pedir({ tipo: 'iniciar', base: baseDoSite() })
      .then(() => { carregado = true; })
      .catch((erro) => {
        descartarWorker();
        throw new Error(`Não foi possível carregar o Go no navegador: ${erro.message}`);
      });
  }
  return iniciando;
}

/** Se o runtime já foi baixado e iniciado nesta aba. */
export const goCarregado = () => carregado;

/** Uma chamada por vez: o interpretador é compartilhado. */
function emFila(fn) {
  const resultado = fila.then(fn, fn);
  fila = resultado.catch(() => {});
  return resultado;
}

function soGo(codigo, arquivos) {
  const todos = { ...(arquivos || {}) };
  if (codigo != null) todos['main.go'] = codigo;
  return Object.fromEntries(Object.entries(todos).filter(([nome, c]) => nome.endsWith('.go') && typeof c === 'string'));
}

/**
 * Confere (compila) o programa Go, sem executar.
 * @param {string} codigo - Código de main.go.
 * @param {Record<string, string>} arquivos - Mapa de nome → conteúdo (main.go e outros .go).
 * @returns {Promise<{ js: string, erros: string[] }>} `js` é o pacote que `executarGo` roda.
 */
export async function compilarGo(codigo, arquivos = {}) {
  const fontes = soGo(codigo || arquivos['main.go'] || '', arquivos);
  if (!Object.values(fontes).some((c) => c.trim())) return { js: '', erros: ['Código vazio.'] };
  try {
    await prepararGo();
    const { erros } = await emFila(() => pedir({ tipo: 'compilar', arquivos: fontes }));
    if (erros.length) return { js: '', erros };
    return { js: JSON.stringify(fontes), erros: [] };
  } catch (erro) {
    return { js: '', erros: [erro?.message || String(erro)] };
  }
}

/**
 * Executa o programa devolvido por `compilarGo`.
 * @param {string} js - Pacote devolvido por `compilarGo`.
 * @param {string} [stdin] - Entrada padrão (a `entrada` dos casos de teste).
 * @param {{ limiteMs?: number }} [opcoes]
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number, ms: number }>}
 */
export async function executarGo(js, stdin = '', { limiteMs = LIMITE_MS } = {}) {
  if (!js || !js.trim()) return { stdout: '', stderr: '', exitCode: 0, ms: 0 };
  let arquivos;
  try {
    arquivos = JSON.parse(js);
  } catch {
    return { stdout: '', stderr: 'Programa inválido: compile com compilarGo antes de executar.', exitCode: 1, ms: 0 };
  }
  try {
    await prepararGo();
  } catch (erro) {
    return { stdout: '', stderr: erro.message, exitCode: 1, ms: 0 };
  }
  return emFila(async () => {
    const t0 = performance.now();
    let relogio;
    const estourou = new Promise((resolve) => {
      relogio = setTimeout(() => resolve({ estourou: true }), limiteMs);
    });
    try {
      const r = await Promise.race([pedir({ tipo: 'rodar', arquivos, stdin: stdin ?? '' }), estourou]);
      const ms = Math.round(performance.now() - t0);
      if (r.estourou) {
        descartarWorker();
        prepararGo().catch(() => {}); // já deixa o próximo runtime carregando
        return {
          stdout: '',
          stderr: `Tempo esgotado: o programa rodou por mais de ${limiteMs / 1000} s e foi interrompido (laço infinito ou deadlock?).`,
          exitCode: 124,
          ms,
        };
      }
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode, ms };
    } catch (erro) {
      return { stdout: '', stderr: erro?.message || String(erro), exitCode: 1, ms: Math.round(performance.now() - t0) };
    } finally {
      clearTimeout(relogio);
    }
  });
}
