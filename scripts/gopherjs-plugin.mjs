import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Plugin Vite que compila arquivos .go usando o binário GopherJS.
 * Se o binário não estiver instalado, gera um mock JS para não quebrar o dev server.
 */
export default function gopherjsPlugin() {
  return {
    name: 'vite:gopherjs',
    async transform(code, id) {
      if (!id.endsWith('.go')) return null;

      const dir = await mkdtemp(join(tmpdir(), 'gopherjs-vite-'));
      try {
        // Escreve o arquivo Go no diretório temporário
        const goFileName = 'main.go';
        await writeFile(join(dir, goFileName), code);

        // Executa gopherjs build
        const js = await new Promise((resolve, reject) => {
          execFile('gopherjs', ['build', '-o', 'output.js'], { cwd: dir }, async (error, stdout, stderr) => {
            if (error) {
              if (error.code === 'ENOENT') {
                // Binário não encontrado: gera mock JS em vez de quebrar o dev server
                const mockJs = `
/* Mock GopherJS Runtime (Vite Plugin) */
var $global = this;
var $pkg = {};
var $print = console.log;
function main() {
  $print("Hello from GopherJS mock!");
}
main();
`;
                resolve(mockJs);
              } else {
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

        // Retorna como módulo ES
        return {
          code: `export default ${JSON.stringify(js)};`,
          map: null,
        };
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    },
  };
}