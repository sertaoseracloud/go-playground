/**
 * Executa código JS compilado pelo GopherJS em um contexto isolado.
 *
 * NOTA DE SEGURANÇA: Esta função usa `new Function()` para avaliar o código,
 * o que NÃO é um sandbox de segurança real. Em produção, considere usar
 * Web Workers ou o módulo `vm` do Node.js com restrições adequadas para
 * isolar a execução do código compilado.
 *
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