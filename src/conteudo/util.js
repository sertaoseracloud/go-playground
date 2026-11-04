// Utilitários para escrever o conteúdo da trilha do DivergeGo.
//
// go`...` escreve código Go dentro do JavaScript:
//   - barras invertidas ficam como estão (como String.raw);
//   - o recuo comum e a primeira linha em branco são removidos.

export function go(strings, ...valores) {
  const texto = String.raw({ raw: strings }, ...valores);
  const linhas = texto.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const recuo = Math.min(
    ...linhas.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length),
  );
  return `${linhas.map((l) => l.slice(Number.isFinite(recuo) ? recuo : 0)).join('\n')}\n`;
}

/** Arquivos: aceita uma string (vira main.go) ou um objeto { arquivo: conteúdo }. */
export const arquivos = (v) => (typeof v === 'string' ? { 'main.go': v } : v);

export function licao({ id, titulo, resumo, codigo }) {
  return { id, tipo: 'licao', titulo, resumo, arquivos: arquivos(codigo) };
}

/**
 * Cria um problema da trilha.
 * @param {Object} opts
 * @param {string} opts.id - Identificador único no formato `{modulo}-{topico}-{numero}`.
 * @param {string} opts.titulo
 * @param {'facil'|'medio'|'dificil'} opts.dificuldade
 * @param {string} opts.enunciado - HTML com a descrição do problema.
 * @param {string} opts.dica - HTML com dica opcional.
 * @param {string|Object} opts.inicial - Código Go inicial (string vira main.go).
 * @param {string|Object} opts.solucao - Código Go da solução.
 * @param {Array<{entrada?: string, saida?: string, args?: string[], oculto?: boolean, regras?: Array}>} opts.testes
 *   Cada teste aceita `entrada`/`saida` para stdin/stdout ou `args` para argumentos de linha de comando.
 *   Campos extras são ignorados pelo runtime.
 */
export function problema({
  id,
  titulo,
  dificuldade,
  enunciado,
  dica,
  inicial,
  solucao,
  testes,
}) {
  return {
    id,
    tipo: 'problema',
    titulo,
    dificuldade,
    enunciado,
    dica,
    arquivos: arquivos(inicial),
    solucao: arquivos(solucao),
    testes,
  };
}

export const juntar = (...partes) => partes.join('\n');