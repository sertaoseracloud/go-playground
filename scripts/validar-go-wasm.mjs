#!/usr/bin/env node
// Confere os problemas da trilha no runtime Go do navegador (public/go/divergego.wasm),
// o mesmo que o app usa, rodando no Node. Complementa o validar-exercicios.mjs (Go nativo).
//
//   node scripts/validar-go-wasm.mjs        # todos os problemas
//   node scripts/validar-go-wasm.mjs web    # só ids que contêm "web"
//
// Para cada problema, a solução tem de bater com `saida` em todos os casos.
// Os ids em CONHECIDOS são limitações conhecidas do interpretador (yaegi): aparecem no
// relatório, mas não fazem o script falhar. Um id que volta a passar também é avisado.
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { problemas } from '../src/conteudo/trilha.js';
import { normalizarSaida } from '../src/conteudo/util.js';

const filtro = process.argv[2] ?? '';
const raiz = new URL('..', import.meta.url);

// Problemas que esbarram numa limitação conhecida do yaegi (veja docs/runtime-go-navegador.md,
// seção "Limitações"). Hoje nenhum: os bugs que a trilha encontrava têm contorno em
// go-wasm/ajustes.go ou foram evitados no próprio exercício.
export const CONHECIDOS = new Set([]);

await import(pathToFileURL(fileURLToPath(new URL('public/go/wasm_exec.js', raiz))).href);
const bytes = await readFile(new URL('public/go/divergego.wasm', raiz)).catch(() => {
  console.error('public/go/divergego.wasm não existe: rode `npm run go:wasm`.');
  process.exit(1);
});

// O runtime Go espera eventos do JS; sem nada pendente o Node encerraria no meio.
const manterVivo = setInterval(() => {}, 1 << 30);
const t0 = Date.now();
const modulo = await WebAssembly.compile(bytes);
let rodar = null;

async function iniciar() {
  const go = new globalThis.Go();
  const pronto = new Promise((r) => { globalThis.__divergeGoPronto = r; });
  const instancia = await WebAssembly.instantiate(modulo, go.importObject);
  go.run(instancia).then(() => { rodar = null; });
  await pronto;
  rodar = globalThis.__divergeGoRodar;
}

await iniciar();
const tInicio = Date.now() - t0;
const comTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r({ timeout: true }), ms))]);

const alvo = problemas.filter((p) => p.id.includes(filtro));
const falharam = [];
for (const p of alvo) {
  const falhas = [];
  for (const [i, t] of p.testes.entries()) {
    if (typeof t.saida !== 'string') continue;
    if (!rodar) await iniciar();
    const r = await comTimeout(rodar(p.solucao, t.entrada ?? ''), 15_000);
    if (r.timeout) { falhas.push(`caso ${i + 1}: passou de 15 s`); await iniciar(); break; }
    if (normalizarSaida(r.stdout) !== normalizarSaida(t.saida)) {
      falhas.push(`caso ${i + 1}: saída diferente (exit ${r.exitCode})\n--- esperado\n${normalizarSaida(t.saida)}\n--- obtido\n${normalizarSaida(r.stdout)}${r.stderr ? `\n--- stderr\n${r.stderr.trim()}` : ''}`);
    }
  }
  if (falhas.length) falharam.push({ p, falhas });
}

const novos = falharam.filter(({ p }) => !CONHECIDOS.has(p.id));
const conhecidos = falharam.filter(({ p }) => CONHECIDOS.has(p.id));
const voltaram = alvo.filter((p) => CONHECIDOS.has(p.id) && !falharam.some((f) => f.p === p));
for (const { p, falhas } of novos) console.log(`\n✗ ${p.modulo}/${p.id}\n  ${falhas.join('\n  ').replace(/\n/g, '\n    ')}`);
if (conhecidos.length) console.log(`\nlimitações conhecidas do yaegi (${conhecidos.length}): ${conhecidos.map(({ p }) => p.id).join(', ')}`);
if (voltaram.length) console.log(`\nestes já passam e podem sair de CONHECIDOS: ${voltaram.map((p) => p.id).join(', ')}`);
console.log(`\n${alvo.length - falharam.length}/${alvo.length} problemas ok no runtime do navegador · início do runtime ${tInicio} ms · total ${((Date.now() - t0) / 1000).toFixed(1)} s`);
clearInterval(manterVivo);
process.exit(novos.length ? 1 : 0);
