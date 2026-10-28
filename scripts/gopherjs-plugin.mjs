import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Plugin Vite que compila arquivos .go usando o binário Gopher */
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
        await new Promise((resolve, reject) => {
          execFile('gopherjs', ['build', '-o', 'output.js'], { cwd: dir }, (error) => {
            if (error) {
              if (error.code === 'ENOENT') {
                reject(new Error(
                  'GopherJS não encontrado. Instale Go e execute: go install github.com/gopherjs/gopherjs@latest'
                ));
              } else {
                reject(error);
              }
            } else {
              resolve();
            }
          });
        });

        // Lê o JS compilado
        const js = await readFile(join(dir, 'output.js'), 'utf8');

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