// Regras usadas pelos exercícios para conferir a página/saída gerada pelo aluno.
// Compatível com a assinatura do php-playground ({ html, erros, codigo }) para testes de paridade
// e com a assinatura Go ({ stdout, stderr, exitCode, codigo }) para uso interno.
// Cada regra é um objeto com uma das chaves abaixo e, opcionalmente, `msg`:
//   { contem: 'texto' }              o texto visível contém 'texto'
//   { naoContem: 'texto' }           o texto visível NÃO contém 'texto'
//   { seletor: 'css', min, max, igual }  quantidade de elementos que casam com o seletor
//   { seletor: 'css', texto: 'x' }   algum elemento do seletor contém o texto 'x'
//   { codigo: 'regex' }              o código-fonte do aluno casa com a regex
//   { semErros: true }               não houve erros nem avisos
//   { igual: 'texto' }               a saída é exatamente 'texto' (após trim)
//   { regex: 'padrao' }              a saída casa com a regex
//   { exitCode: numero }             o código de saída é igual ao esperado
//   { saidaIgual: 'texto' }          a saída é igual, linha a linha (sem espaços no fim das linhas)
import { normalizarSaida } from './conteudo/util.js';

function documento(html) {
  if (typeof DOMParser !== 'undefined') {
    return new DOMParser().parseFromString(html, 'text/html');
  }
  return null;
}

function normalizar(texto) {
  return String(texto ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Extrai o texto visível de HTML ou stdout.
 * Se receber HTML válido com tags, extrai o texto do DOM; caso contrário, trata como stdout puro.
 */
export function textoVisivel(htmlOuStdout) {
  const texto = String(htmlOuStdout ?? '');
  if (/<[a-z][\s\S]*>/i.test(texto)) {
    const doc = documento(texto);
    if (doc) {
      doc.querySelectorAll('script, style').forEach((el) => el.remove());
      return normalizar(doc.body?.textContent ?? '');
    }
  }
  return normalizar(texto);
}

function resultado(ok, regra, padrao, detalhe) {
  return { ok, mensagem: regra.msg ?? padrao, detalhe };
}

/**
 * Verifica uma única regra contra a página/saída.
 * Aceita tanto { html, erros, codigo } (php-playground/testes) quanto { stdout, stderr, exitCode, codigo } (Go interno).
 */
export function verificarRegra(regra, pagina) {
  const html = pagina.html ?? pagina.stdout ?? '';
  const erros = pagina.erros ?? pagina.stderr ?? '';
  const codigo = pagina.codigo ?? '';
  const exitCode = pagina.exitCode;
  const saida = textoVisivel(html);

  if ('contem' in regra) {
    const ok = saida.includes(normalizar(regra.contem));
    return resultado(ok, regra, `A página deve mostrar "${regra.contem}"`, ok ? undefined : 'texto não encontrado');
  }

  if ('naoContem' in regra) {
    const ok = !saida.includes(normalizar(regra.naoContem));
    return resultado(ok, regra, `A página não deve mostrar "${regra.naoContem}"`, ok ? undefined : 'texto encontrado');
  }

  if ('seletor' in regra && 'texto' in regra) {
    const doc = documento(html);
    const esperado = normalizar(regra.texto);
    const elementos = doc ? [...doc.querySelectorAll(regra.seletor)] : [];
    const ok = elementos.some((e) => normalizar(e.textContent).includes(esperado));
    return resultado(ok, regra, `Um elemento "${regra.seletor}" deve conter "${regra.texto}"`,
      ok ? undefined : `nenhum "${regra.seletor}" com esse texto`);
  }

  if ('seletor' in regra) {
    const doc = documento(html);
    const qtd = doc ? doc.querySelectorAll(regra.seletor).length : 0;
    const { min, max, igual } = regra;
    let ok;
    let padrao;
    if (igual !== undefined) {
      ok = qtd === igual;
      padrao = `A página deve ter exatamente ${igual} elemento(s) "${regra.seletor}"`;
    } else {
      ok = qtd >= (min ?? 1) && (max === undefined || qtd <= max);
      padrao = max === undefined
        ? `A página deve ter pelo menos ${min ?? 1} elemento(s) "${regra.seletor}"`
        : `A página deve ter entre ${min ?? 0} e ${max} elemento(s) "${regra.seletor}"`;
    }
    return resultado(ok, regra, padrao, ok ? undefined : `encontrei ${qtd} elemento(s) "${regra.seletor}"`);
  }

  if ('codigo' in regra) {
    const ok = new RegExp(regra.codigo, 'i').test(codigo);
    return resultado(ok, regra, `O código deve usar ${regra.codigo}`);
  }

  if ('semErros' in regra) {
    const ok = !erros || erros.trim() === '';
    return resultado(ok, regra, 'O programa não deve mostrar erros nem avisos', ok ? undefined : erros.trim().split('\n')[0]);
  }

  if ('saidaIgual' in regra) {
    // Igual ao python-playground: compara linha a linha, ignorando espaços no fim das linhas.
    const obtida = normalizarSaida(pagina.stdout ?? pagina.html);
    const esperada = normalizarSaida(regra.saidaIgual);
    const ok = obtida === esperada;
    let detalhe;
    if (!ok) {
      const [lo, le] = [obtida.split('\n'), esperada.split('\n')];
      const i = le.findIndex((l, k) => lo[k] !== l);
      const n = i < 0 ? le.length : i;
      detalhe = i < 0
        ? `a saída tem ${lo.length - le.length} linha(s) a mais`
        : `linha ${n + 1}: esperado "${le[n]}", veio "${lo[n] ?? '(nada)'}"`;
    }
    return resultado(ok, regra, 'A saída é exatamente a pedida', detalhe);
  }

  if ('igual' in regra) {
    const padrao = normalizar(regra.igual);
    const ok = saida === padrao;
    return resultado(ok, regra, `A saída deve ser exatamente "${regra.igual}"`, ok ? undefined : 'Saída difere do esperado');
  }

  if ('regex' in regra) {
    const padrao = regra.regex;
    const re = new RegExp(padrao);
    const ok = re.test(saida);
    return resultado(ok, regra, `A saída deve casar com /${padrao}/`, ok ? undefined : `Saída não casa com /${padrao}/`);
  }

  if ('exitCode' in regra) {
    const esperado = regra.exitCode;
    const ok = exitCode === esperado;
    return resultado(ok, regra, `Exit code deve ser ${esperado}`, ok ? undefined : `Exit code ${exitCode} != ${esperado}`);
  }

  throw new Error(`Regra desconhecida: ${JSON.stringify(regra)}`);
}

/**
 * Detalha o resultado de uma regra para exibição ao aluno.
 * Retorna objeto com categoria, valor obtido e dica.
 */
export function detalharRegra(regra, pagina) {
 const r = verificarRegra(regra, pagina);
 const msg = regra.msg;

 if (r.ok) {
 return { ok: true, regra, msg, mensagem: r.mensagem };
 }

 return {
 ok: false,
 regra,
 msg: msg || r.detalhe,
 mensagem: r.mensagem,
 detalhe: r.detalhe,
 categoria: r.regra,
 obtido: r.padrao !== undefined && r.regra !== 'semErros' ? String(r.padrao) : undefined,
 };
}

/**
 * Descreve uma regra em linguagem simples para exibição ao aluno.
 * Compatível com a assinatura do php-playground para testes de paridade.
 * @param {Object} regra - Objeto com a regra de verificação
 * @returns {string|null} Descrição da regra ou null se desconhecida
 */
export function descreverRegra(regra) {
 if (regra.msg) return regra.msg;
 if ('contem' in regra) return `A página mostra "${regra.contem}"`;
 if ('naoContem' in regra) return `A página não mostra "${regra.naoContem}"`;
 if ('seletor' in regra && 'texto' in regra) return `Tem um elemento ${regra.seletor} com o texto "${regra.texto}"`;
 if ('seletor' in regra) {
 const { min, max, igual } = regra;
 if (igual !== undefined) return `Tem exatamente ${igual} elemento(s) ${regra.seletor}`;
 if (max !== undefined) return `Tem de ${min ?? 0} a ${max} elemento(s) ${regra.seletor}`;
 return (min ?? 1) === 1 ? `Tem um elemento ${regra.seletor}` : `Tem pelo menos ${min} elementos ${regra.seletor}`;
 }
 if ('semErros' in regra) return 'O programa roda sem erros nem avisos';
 if ('saidaIgual' in regra) return 'A saída é exatamente a pedida';
 if ('igual' in regra) return `A saída é exatamente "${regra.igual}"`;
 if ('regex' in regra) return `A saída casa com /${regra.regex}/`;
 if ('codigo' in regra) return `O código usa ${regra.codigo}`;
 if ('exitCode' in regra) return `Exit code é ${regra.exitCode}`;
 return null;
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