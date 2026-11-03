import { detalharRegra, primeiraLinhaDoErro } from './verificacoes.js';

const agora = () => (typeof performance === 'undefined' ? Date.now() : performance.now());

/**
 * Roda os casos de teste do problema com os arquivos do aluno.
 *
 * Adaptado do php-playground para o contexto Go:
 * - "Executar" usa só os casos visíveis; "Enviar" inclui os ocultos (`oculto: true`).
 * - Cada caso pode ter `stdin` para entrada simulada via runtime Go.
 * - Um caso pode ter `passos`: uma sequência de execuções que compartilham
 *   estado (quando aplicável). Cada passo pode ter as próprias `regras`.
 *
 * `executar(arquivos, { stdin }, { contexto })` deve devolver { stdout, stderr, exitCode }.
 *
 * Cada caso do relatório traz, além do resultado das regras (com categoria, valor
 * obtido e dica; veja detalharRegra), o cenário (as execuções feitas),
 * o primeiro erro do Go e o tempo.
 */
export async function corrigir(problema, arquivos, executar, { incluirOcultos = true } = {}) {
  const codigo = Object.values(arquivos).join('\n');
  const casos = problema.testes.filter((t) => incluirOcultos || !t.oculto);
  const relatorio = [];
  for (const teste of casos) {
    const inicio = agora();
    const passos = teste.passos ?? [teste];
    const resultados = [];
    const cenario = [];
    let erroExecucao;
    for (const [i, passo] of passos.entries()) {
      const req = { url: passo.url, metodo: passo.metodo, corpo: passo.corpo, stdin: passo.stdin };
      // O executor PHP espera { seed } ou null; strings são convertidas para esse formato.
      const bancoArg = typeof problema.banco === 'string' ? { seed: problema.banco } : (problema.banco ?? null);
      const resposta = await executar(
        arquivos,
        req,
        bancoArg,
        { novaSessao: i === 0, manterBanco: i > 0, contexto: 'testes' },
      );
      // Normaliza resposta: aceita {html, erros} (PHP) ou {stdout, stderr, exitCode} (Go).
      const html = resposta.html ?? resposta.stdout ?? '';
      const stderr = resposta.erros ?? resposta.stderr ?? '';
      const exitCode = resposta.exitCode ?? (stderr ? 1 : 0);
      const pagina = { stdout: html, stderr, exitCode, codigo };
      cenario.push({ stdin: passo.stdin ?? '', url: passo.url, metodo: passo.metodo });
      erroExecucao ??= primeiraLinhaDoErro(stderr) || undefined;
      resultados.push(...(passo.regras ?? []).map((regra) => detalharRegra(regra, pagina)));
    }
    relatorio.push({
      descricao: teste.descricao,
      oculto: Boolean(teste.oculto),
      ok: resultados.every((r) => r.ok),
      resultados,
      cenario,
      ...(erroExecucao ? { erroExecucao } : {}),
      ms: Math.max(1, Math.round(agora() - inicio)),
    });
  }
  return { aprovado: relatorio.every((t) => t.ok), relatorio };
}