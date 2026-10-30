/**
 * Wrapper de compilação Go compatível com o navegador.
 *
 * No ambiente Node (build/dev server), delega para o compiler.js real que usa GopherJS.
 * No navegador, retorna um mock JS que imprime "Hello from GopherJS mock!" para permitir
 * que o terminal funcione sem o binário GopherJS instalado localmente.
 *
 * Em produção futura, este módulo será substituído por um bundle WASM do GopherJS
 * ou por comunicação via postMessage com um Web Worker dedicado.
 */

const MOCK_JS = `
/* Mock GopherJS Runtime (Browser) */
var $global = typeof window !== 'undefined' ? window : globalThis;
var $pkg = {};
var $print = function() {
  var args = Array.prototype.slice.call(arguments);
  console.log(args.join(' '));
};
function main() {
  $print("Hello from GopherJS mock!");
}
main();
`;

/**
 * Compila código Go para JavaScript.
 * @param {string} _codigo - Código fonte Go principal (não usado no mock).
 * @param {Record<string, string>} _arquivos - Mapa de nome do arquivo para conteúdo (não usado no mock).
 * @returns {Promise<{ js: string, erros: string[] }>}
 */
export async function compilarGo(_codigo, _arquivos) {
  // TODO: integrar com bundle WASM do GopherJS ou Web Worker para compilação real no browser.
  // Por ora, retorna o mock para permitir que o terminal execute algo visível.
  return { js: MOCK_JS, erros: [] };
}

/**
 * Executa código JS compilado pelo GopherJS em um contexto isolado.
 * Captura stdout/stderr via monkey-patch de console.log e redireciona para strings.
 * @param {string} js - O código JS compilado.
 * @param {string} [_stdin] - Entrada padrão simulada (não usada no mock).
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number }>}
 */
export async function executarGo(js, _stdin) {
  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  const originalLog = console.log;
  const originalError = console.error;

  try {
    // Monkey-patch para capturar saída do código executado
    console.log = (...args) => {
      stdout += args.join(' ') + '\n';
    };
    console.error = (...args) => {
      stderr += args.join(' ') + '\n';
    };

    // Executa o código em um escopo isolado usando new Function
    // NOTA DE SEGURANÇA: isto NÃO é um sandbox real. Em produção, usar Web Worker.
    const fn = new Function(js);
    fn();
  } catch (err) {
    stderr += err?.message || String(err);
    exitCode = 1;
  } finally {
    // Restaura os métodos originais
    console.log = originalLog;
    console.error = originalError;
  }

  return { stdout, stderr, exitCode };
}