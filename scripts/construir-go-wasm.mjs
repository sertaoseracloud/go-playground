#!/usr/bin/env node
// Gera o runtime Go do navegador: public/go/divergego.wasm + public/go/wasm_exec.js.
//
//   node scripts/construir-go-wasm.mjs              # sempre recompila
//   node scripts/construir-go-wasm.mjs --se-faltar  # só se os arquivos não existirem (prebuild)
//   node scripts/construir-go-wasm.mjs --se-faltar --opcional  # idem, mas sem Go só avisa (predev)
//
// Precisa do Go instalado (a mesma versão em todo lugar: o wasm_exec.js copiado é o do Go
// que compilou o .wasm). O programa em go-wasm/ embute o interpretador yaegi; aqui montamos
// go-wasm/simbolos/ só com os pacotes da biblioteca padrão que a trilha usa, para o
// download ficar menor (veja PACOTES).
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const pastaGo = join(raiz, 'go-wasm');
const pastaSimbolos = join(pastaGo, 'simbolos');
const pastaSaida = join(raiz, 'public', 'go');
const wasm = join(pastaSaida, 'divergego.wasm');
const wasmExec = join(pastaSaida, 'wasm_exec.js');
const run = promisify(execFile);

// Pacotes da biblioteca padrão disponíveis para o código do aluno (nomes de import).
// Os pacotes genéricos (slices, maps, cmp) vêm do próprio yaegi, em código-fonte.
export const PACOTES = [
  'bufio', 'bytes', 'cmp', 'container/heap', 'container/list', 'container/ring', 'context',
  'crypto', 'crypto/hmac', 'crypto/md5', 'crypto/rand', 'crypto/sha1', 'crypto/sha256', 'crypto/sha512', 'crypto/subtle',
  'database/sql', 'database/sql/driver',
  'encoding', 'encoding/base64', 'encoding/binary', 'encoding/csv', 'encoding/hex', 'encoding/json', 'encoding/xml',
  'errors', 'flag', 'fmt', 'hash', 'hash/crc32', 'hash/fnv', 'hash/maphash', 'html', 'html/template',
  'io', 'io/fs', 'io/ioutil', 'log', 'log/slog', 'maps', 'math', 'math/big', 'math/bits', 'math/rand',
  'mime', 'net', 'net/http', 'net/http/httptest', 'net/http/httputil', 'net/netip', 'net/textproto', 'net/url',
  'os', 'path', 'path/filepath', 'reflect', 'regexp', 'runtime', 'slices', 'sort', 'strconv', 'strings',
  'sync', 'sync/atomic', 'testing', 'text/tabwriter', 'text/template', 'time', 'unicode', 'unicode/utf16', 'unicode/utf8',
];

const existe = (p) => stat(p).then(() => true, () => false);

async function go(args, opcoes = {}) {
  const { stdout } = await run('go', args, { cwd: pastaGo, maxBuffer: 16 << 20, ...opcoes });
  return stdout.trim();
}

async function montarSimbolos() {
  const { Dir } = JSON.parse(await go(['mod', 'download', '-json', 'github.com/traefik/yaegi']));
  const origem = join(Dir, 'stdlib');
  await rm(pastaSimbolos, { recursive: true, force: true });
  await mkdir(pastaSimbolos, { recursive: true });
  // go1_22_<pacote>.go vale para Go >= 1.22 (os go1_21_* ficam de fora com essas versões).
  const permitidos = new Set(PACOTES.map((p) => `go1_22_${p.replace(/[/.]/g, '_')}.go`));
  for (const nome of await readdir(origem)) {
    const gerado = /^go1_2\d_/.test(nome);
    const suporte = /^(stdlib|maptypes|restricted|wrapper-composed|stdlib-go1\.\d+)\.go$/.test(nome);
    if ((gerado && permitidos.has(nome)) || suporte) {
      await cp(join(origem, nome), join(pastaSimbolos, nome));
    }
  }
  await cp(join(Dir, 'LICENSE'), join(pastaSimbolos, 'LICENSE'));
  await writeFile(join(pastaSimbolos, 'LEIA-ME.txt'),
    'Gerado por scripts/construir-go-wasm.mjs a partir de github.com/traefik/yaegi/stdlib (licença Apache-2.0 em LICENSE).\nNão edite: rode o script de novo.\n');
}

async function principal() {
  if (process.argv.includes('--se-faltar') && await existe(wasm) && await existe(wasmExec) && await existe(join(pastaSaida, 'versao.txt'))) return;
  const inicio = Date.now();
  console.log('Runtime Go do navegador: montando os símbolos da biblioteca padrão…');
  await montarSimbolos();
  await mkdir(pastaSaida, { recursive: true });
  console.log('Compilando go-wasm/ para GOOS=js GOARCH=wasm (leva cerca de 1 minuto)…');
  await go(['build', '-p', '1', '-trimpath', '-gcflags=all=-c=1', '-ldflags=-s -w', '-o', wasm, '.'], {
    env: { ...process.env, GOOS: 'js', GOARCH: 'wasm', CGO_ENABLED: '0' },
  });
  const goroot = await go(['env', 'GOROOT']);
  const candidatos = [join(goroot, 'lib', 'wasm', 'wasm_exec.js'), join(goroot, 'misc', 'wasm', 'wasm_exec.js')];
  let copiado = false;
  for (const c of candidatos) {
    if (await existe(c)) { await writeFile(wasmExec, await readFile(c)); copiado = true; break; }
  }
  if (!copiado) throw new Error(`wasm_exec.js não encontrado em ${candidatos.join(' nem em ')}`);
  // O worker usa este hash no ?v= das URLs: runtime novo, cache novo.
  const hash = createHash('sha256').update(await readFile(wasm)).update(await readFile(wasmExec)).digest('hex').slice(0, 16);
  await writeFile(join(pastaSaida, 'versao.txt'), `${hash}\n`);
  const mb = ((await stat(wasm)).size / 1e6).toFixed(1);
  console.log(`Pronto: public/go/divergego.wasm (${mb} MB) em ${((Date.now() - inicio) / 1000).toFixed(0)} s, com ${await go(['version'])}.`);
}

principal().catch((erro) => {
  if (erro.code === 'ENOENT') {
    console.error('Go não encontrado. Instale o Go (https://go.dev/dl/) para gerar o runtime do navegador.');
  } else {
    console.error(erro.stderr || erro.message);
  }
  if (process.argv.includes('--opcional')) {
    console.error('Seguindo sem o runtime Go: o app vai avisar ao executar código. Rode `npm run go:wasm` depois de instalar o Go.');
    process.exit(0);
  }
  process.exit(1);
});
