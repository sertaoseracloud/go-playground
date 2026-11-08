#!/usr/bin/env node
// Confere todos os problemas da trilha com o Go real instalado na máquina.
//
//   node scripts/validar-exercicios.mjs            # todos os problemas
//   node scripts/validar-exercicios.mjs web        # só ids que contêm "web"
//
// Para cada problema:
//   1. a solução compila e a saída bate com `saida` de cada caso de teste;
//   2. o código inicial compila (go build), mas NÃO passa nos testes.
// Também confere ids únicos e campos obrigatórios. Sai com código 1 se algo falhar.
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { itens, problemas, DIFICULDADES } from '../src/conteudo/trilha.js';
import { normalizarSaida } from '../src/conteudo/util.js';

const filtro = process.argv[2] ?? '';

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function rodar(cmd, args, { cwd, stdin = '' } = {}, tentativa = 0) {
  try {
    return await new Promise((resolve, reject) => {
      const filho = execFile(cmd, args, { cwd, timeout: 60_000, maxBuffer: 4 << 20 }, (erro, stdout, stderr) => {
        if (erro?.syscall === 'spawn') return reject(erro);
        resolve({ ok: !erro, stdout: String(stdout), stderr: String(stderr) });
      });
      filho.on('error', reject);
      filho.stdin?.end(stdin);
    });
  } catch (erro) {
    // No Windows, muitos processos ao mesmo tempo às vezes falham com "spawn UNKNOWN".
    if (tentativa < 10) return esperar(1000 * (tentativa + 1)).then(() => rodar(cmd, args, { cwd, stdin }, tentativa + 1));
    return { ok: false, stdout: '', stderr: `falha ao iniciar ${cmd}: ${erro.message}` };
  }
}

async function emPasta(arquivos, fn) {
  const dir = await mkdtemp(join(tmpdir(), 'divergego-'));
  try {
    await writeFile(join(dir, 'go.mod'), 'module exercicio\n\ngo 1.22\n');
    for (const [nome, conteudo] of Object.entries(arquivos)) await writeFile(join(dir, nome), conteudo);
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  }
}

async function conferir(p) {
  const falhas = [];
  if (!DIFICULDADES[p.dificuldade]) falhas.push(`dificuldade inválida: ${p.dificuldade}`);
  if (!p.enunciado || !p.dica) falhas.push('enunciado e dica são obrigatórios');
  if (!p.testes?.length || !p.testes.some((t) => !t.oculto)) falhas.push('precisa de ao menos um caso visível');
  if (p.testes?.some((t) => typeof t.saida !== 'string' && !t.regras)) falhas.push('caso sem `saida` nem `regras`');

  await emPasta(p.solucao, async (dir) => {
    const build = await rodar('go', ['build', '-o', 'prog.exe', '.'], { cwd: dir });
    if (!build.ok) return falhas.push(`solução não compila:\n${build.stderr.trim()}`);
    for (const [i, t] of p.testes.entries()) {
      if (typeof t.saida !== 'string') continue;
      const r = await rodar(join(dir, 'prog.exe'), [], { cwd: dir, stdin: t.entrada ?? '' });
      if (normalizarSaida(r.stdout) !== normalizarSaida(t.saida)) {
        falhas.push(`caso ${i + 1}: saída diferente\n--- esperado\n${normalizarSaida(t.saida)}\n--- obtido\n${normalizarSaida(r.stdout)}${r.stderr ? `\n--- stderr\n${r.stderr.trim()}` : ''}`);
      }
    }
  });

  await emPasta(p.arquivos, async (dir) => {
    const build = await rodar('go', ['build', '-o', 'prog.exe', '.'], { cwd: dir });
    if (!build.ok) return falhas.push(`código inicial não compila:\n${build.stderr.trim()}`);
    let passa = true;
    for (const t of p.testes) {
      if (typeof t.saida !== 'string') continue;
      const r = await rodar(join(dir, 'prog.exe'), [], { cwd: dir, stdin: t.entrada ?? '' });
      if (normalizarSaida(r.stdout) !== normalizarSaida(t.saida)) passa = false;
    }
    if (passa) falhas.push('código inicial já passa nos testes');
  });
  return falhas;
}

const ids = itens.map((i) => i.id);
const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
if (repetidos.length) console.error(`ids repetidos: ${[...new Set(repetidos)].join(', ')}`);

const alvo = problemas.filter((p) => p.id.includes(filtro));
const fila = [...alvo];
const resultados = [];
await Promise.all(Array.from({ length: Number(process.env.PARALELO ?? 1) }, async () => {
  while (fila.length) {
    const p = fila.shift();
    resultados.push({ p, falhas: await conferir(p) });
  }
}));

const ruins = resultados.filter((r) => r.falhas.length).sort((a, b) => a.p.id.localeCompare(b.p.id));
for (const { p, falhas } of ruins) console.log(`\n✗ ${p.modulo}/${p.id}\n  ${falhas.join('\n  ').replace(/\n/g, '\n    ')}`);
console.log(`\n${alvo.length - ruins.length}/${alvo.length} problemas ok · total na trilha: ${problemas.length} problemas, ${itens.length} itens`);
process.exit(ruins.length || repetidos.length ? 1 : 0);
