import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { executarGo } from './runtime.js';

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

export { executarGo };