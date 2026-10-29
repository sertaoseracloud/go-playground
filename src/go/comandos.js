const COMANDOS_SUPORTADOS = new Set([
  'go',
  'help',
  'clear',
  'ls',
  'cat',
]);

const SUBCOMANDOS_GO = new Set([
  'run',
  'build',
  'test',
  'mod',
  'fmt',
  'vet',
  'version',
]);

/**
 * Analisa uma linha de comando e retorna seu nome, argumentos e validade.
 * @param {string} linha - A linha digitada pelo usuario.
 * @returns {{ nome: string, args: string[], valido: boolean }}
 */
export function parsearComando(linha) {
  if (!linha || !linha.trim()) {
    return { nome: '', args: [], valido: false };
  }

  const partes = linha.trim().split(/\s+/);
  const nome = partes[0];

  if (!COMANDOS_SUPORTADOS.has(nome)) {
    return { nome, args: partes.slice(1), valido: false };
  }

  // Valida subcomandos do go
  if (nome === 'go') {
    const subcmd = partes[1];
    if (subcmd && !SUBCOMANDOS_GO.has(subcmd)) {
      return { nome, args: partes.slice(1), valido: false };
    }
  }

  return { nome, args: partes.slice(1), valido: true };
}