// Utilitários para escrever o conteúdo da trilha do DivergeGo.
//
// go`...` escreve código Go dentro do JavaScript:
//   - os escapes do JavaScript valem (como num template comum): para o Go receber
//     "\n", escreva "\\n" no conteúdo; para uma crase, escreva \`;
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

/** Normaliza a saída do programa para comparar com `saida`: CRLF, espaços no fim das linhas e linhas vazias nas pontas. */
export const normalizarSaida = (texto) =>
  String(texto ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n').trim();

/**
 * Converte o atalho `{ saida, entrada? }` no formato de regras usado pelo corretor
 * (o mesmo do python-playground: `saidaIgual` + `semErros`) e garante um caso oculto.
 * Casos que já têm `regras` (ou `passos`) ficam como estão.
 */
export function normalizarTestes(testes = []) {
  const casos = testes.map(({ saida, regras, ...resto }) => {
    if (typeof saida !== 'string') return { ...resto, ...(regras ? { regras } : {}) };
    return {
      descricao: resto.oculto ? 'nada a mais' : 'saída',
      ...resto,
      saida,
      regras: [{ saidaIgual: saida }, { semErros: true }, ...(regras ?? [])],
    };
  });
  const visivel = casos.find((t) => !t.oculto && typeof t.saida === 'string');
  if (visivel && !casos.some((t) => t.oculto)) {
    casos.push({
      descricao: 'nada a mais',
      oculto: true,
      ...(visivel.entrada ? { entrada: visivel.entrada } : {}),
      saida: visivel.saida,
      regras: [{ saidaIgual: visivel.saida }],
    });
  }
  return casos;
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
 * @param {Array<{descricao?: string, entrada?: string, saida?: string, oculto?: boolean, regras?: Array}>} opts.testes
 *   Atalho: `{ saida: 'texto' }` vira `regras: [{ saidaIgual }, { semErros }]` (veja normalizarTestes);
 *   `entrada` é o stdin do programa.
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
    testes: normalizarTestes(testes),
  };
}

export const juntar = (...partes) => partes.join('\n');
