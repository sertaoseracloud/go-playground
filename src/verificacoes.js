// Regras usadas pelos exercícios para conferir a saída gerada pelo aluno.
// Adaptado do php-playground para o contexto Go:
// Cada regra é um objeto com uma das chaves abaixo e, opcionalmente, `msg`:
//   { contem: 'texto' }              a saída stdout contém 'texto'
//   { naoContem: 'texto' }           a saída stdout NÃO contém 'texto'
//   { igual: 'texto' }               a saída stdout é exatamente 'texto' (após trim)
//   { regex: 'padrao' }              a saída stdout casa com a regex
//   { codigo: 'regex' }              o código-fonte do aluno casa com a regex
//   { semErros: true }               o Go não emitiu erros (stderr vazio e exitCode 0)
//   { exitCode: numero }             o código de saída é igual ao esperado

function normalizar(texto) {
 return String(texto ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Extrai o texto visível da saída Go (stdout).
 * No contexto Go, não há HTML/DOM como no php-playground;
 * a "página" é simplesmente a saída stdout do programa compilado.
 */
export function textoVisivel(stdout) {
 return normalizar(stdout);
}

function resultado(ok, regra, padrao, detalhe) {
 return { ok, regra, padrao, detalhe };
}

/**
 * Verifica uma única regra contra a saída/execução Go.
 * @param {Object} regra - Objeto com a regra de verificação
 * @param {Object} pagina - Objeto com { stdout, stderr, exitCode, codigo }
 * @returns {Object} Resultado com { ok, regra, padrao, detalhe }
 */
export function verificarRegra(regra, { stdout, stderr, exitCode, codigo }) {
 const saida = textoVisivel(stdout);

 if ('contem' in regra) {
 const padrao = normalizar(regra.contem);
 const ok = saida.includes(padrao);
 return resultado(ok, 'contem', padrao, ok ? undefined : `Saída não contém "${padrao}"`);
 }

 if ('naoContem' in regra) {
 const padrao = normalizar(regra.naoContem);
 const ok = !saida.includes(padrao);
 return resultado(ok, 'naoContem', padrao, ok ? undefined : `Saída contém "${padrao}" (não deveria)`);
 }

 if ('igual' in regra) {
 const padrao = normalizar(regra.igual);
 const ok = saida === padrao;
 return resultado(ok, 'igual', padrao, ok ? undefined : `Saída difere do esperado`);
 }

 if ('regex' in regra) {
 const padrao = regra.regex;
 const re = new RegExp(padrao);
 const ok = re.test(saida);
 return resultado(ok, 'regex', padrao, ok ? undefined : `Saída não casa com /${padrao}/`);
 }

 if ('codigo' in regra) {
 const padrao = regra.codigo;
 const re = new RegExp(padrao);
 const ok = re.test(codigo || '');
 return resultado(ok, 'codigo', padrao, ok ? undefined : `Código não casa com /${padrao}/`);
 }

 if (regra.semErros) {
 const temErro = (stderr && stderr.trim().length > 0) || (exitCode !== 0 && exitCode !== undefined);
 return resultado(!temErro, 'semErros', true, temErro ? `Erros na execução: ${primeiraLinhaDoErro(stderr) || `exit code ${exitCode}`}` : undefined);
 }

 if ('exitCode' in regra) {
 const esperado = regra.exitCode;
 const ok = exitCode === esperado;
 return resultado(ok, 'exitCode', esperado, ok ? undefined : `Exit code ${exitCode} != ${esperado}`);
 }

 return resultado(false, 'desconhecida', null, `Regra desconhecida: ${JSON.stringify(regra)}`);
}

/**
 * Detalha o resultado de uma regra para exibição ao aluno.
 * Retorna objeto com categoria, valor obtido e dica.
 */
export function detalharRegra(regra, pagina) {
 const r = verificarRegra(regra, pagina);
 const msg = regra.msg;

 if (r.ok) {
 return { ok: true, regra, msg };
 }

 return {
 ok: false,
 regra,
 msg: msg || r.detalhe,
 categoria: r.regra,
 obtido: r.padrao !== undefined && r.regra !== 'semErros' ? String(r.padrao) : undefined,
 };
}

/**
 * Extrai a primeira linha de erro de stderr.
 * @param {string} stderr - Saída de erro
 * @returns {string|null} Primeira linha de erro ou null
 */
export function primeiraLinhaDoErro(stderr) {
 if (!stderr) return null;
 const linhas = stderr.split('\n').filter((l) => l.trim());
 return linhas.length > 0 ? linhas[0].trim() : null;
}