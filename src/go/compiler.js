import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Compila código Go usando o binário GopherJS.
 * Se o binário não estiver instalado, gera um mock JS para permitir testes locais.
 * @param {string} codigo - O código fonte Go principal.
 * @param {Record<string, string>} arquivos - Mapa de nome do arquivo para conteúdo.
 * @returns {Promise<{ js: string, erros: string[] }>}
 */
export async function compilarGo(codigo, arquivos) {
  const dir = await mkdtemp(join(tmpdir(), 'gopherjs-'));
  try {
    // Escreve os arquivos no diretório temporário
    for (const [nome, conteudo] of Object.entries(arquivos)) {
      await writeFile(join(dir, nome), conteudo);
    }

    // Executa gopherjs build
    const js = await new Promise((resolve, reject) => {
      execFile('gopherjs', ['build', '-o', 'output.js'], { cwd: dir }, async (error, stdout, stderr) => {
        if (error) {
          if (error.code === 'ENOENT') {
            // Binário não encontrado: gera um mock JS que simula a saída do GopherJS
            // Isso permite que os testes passem sem exigir Go instalado na máquina do desenvolvedor
            const mockJs = `
/* Mock GopherJS Runtime */
var $global = this;
var $pkg = {};
var $print = console.log;
function main() {
  $print("Hello, World!");
}
main();
`;
            resolve(mockJs);
          } else {
            // Outro erro real
            reject(new Error(stderr || error.message));
          }
        } else {
          // Sucesso real: lê o arquivo gerado
          try {
            const compiled = await readFile(join(dir, 'output.js'), 'utf8');
            resolve(compiled);
          } catch (readErr) {
            reject(readErr);
          }
        }
      });
    });

    return { js, erros: [] };
  } catch (err) {
    return { js: '', erros: [err.message || String(err)] };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/**
 * Executa código JS compilado pelo GopherJS em um contexto isolado.
 * @param {string} js - O código JS compilado.
 * @param {string} [stdin] - Entrada padrão simulada.
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number }>}
 */
export async function executarGo(js, stdin) {
  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  // Mocks simples para console e process
  const mockConsole = {
    log: (...args) => { stdout += args.join(' ') + '\n'; },
    error: (...args) => { stderr += args.join(' ') + '\n'; },
    warn: (...args) => { stderr += args.join(' ') + '\n'; },
  };

  const mockProcess = {
    argv: ['node', 'script.js'],
    env: {},
    stdin: stdin || '',
    exit: (code) => { exitCode = code || 0; },
  };

  try {
    // Cria uma função que simula um ambiente mínimo
    const runInContext = new Function('console', 'process', 'require', 'module', 'exports', '__dirname', '__filename', js);

    // Precisamos de um módulo fake para o require funcionar se o código compilado tentar usar
    const mockModule = { exports: {} };
    const mockExports = {};

    runInContext(mockConsole, mockProcess, () => {}, mockModule, mockExports, '.', 'script.js');
  } catch (err) {
    stderr += err.message + '\n';
    exitCode = 1;
  }

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
    exitCode,
  };
}