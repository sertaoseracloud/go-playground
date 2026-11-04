# Content Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the content infrastructure and module scaffolding to support 300 Go exercises across 7 modules, with mock adapters for browser-only services (databases, cloud SDKs, gRPC).

**Architecture:** Extend the existing `util.js` problem/licao format with optional `args` field for CLI tests, restructure `trilha.js` to import modules directly (removing dynamic injection), create 4 new module files (estruturas.js, bancos.js, nuvem.js, arquitetura.js) with placeholder items, and build a `mocks/` directory providing FakeS3, FakeMongo, FakeRedis, FakeDB adapters backed by in-memory maps that expose realistic Go-like APIs.

**Tech Stack:** Vanilla JS (ESM), Go template strings via `go` tag, no build step, in-memory mock adapters.

**Spec:** `docs/superpowers/specs/2026-11-04-trilha-300-exercicios-design.md` §3, §5, §6

## Global Constraints

- All exercises must run fully in the browser via WASM — no real network calls, no real databases, no real cloud services.
- Mock adapters must expose APIs that mirror real Go SDKs closely enough that skills transfer to real code.
- Each module file exports a single `modulo*` object matching the shape in `basico.js`.
- Exercise IDs follow `{modulo}-{topico}-{numero}` pattern (e.g., `estruturas-slices-append`).
- ~40% lições, ~60% problemas ratio per module.
- No third-party Go frameworks (Gin, Echo, Fiber) — stdlib only for HTTP.
- `PROXIMOS_MODULOS` in `trilha.js` must be updated as modules are implemented.

## Review Focus

1. **Mock adapter API fidelity:** FakeS3/FakeMongo/FakeRedis must match real SDK method signatures closely enough that students can transition to real services without relearning — verify each mock against official Go SDK docs.
2. **Exercise ID uniqueness:** With 300 exercises, duplicate IDs would silently overwrite entries in the `porId` map — every new exercise must have a globally unique ID verified at import time.
3. **Module load order:** Modules must appear in `modulos` array in pedagogical order (basico → estruturas → web → concorrencia → bancos → nuvem → arquitetura) — wrong order breaks progression and unlock logic.
4. **Test format backward compatibility:** Adding optional `args` field to test objects must not break existing exercises that use `{ entrada, saida }` format — all current tests must continue passing.
5. **Memory leaks in mock adapters:** In-memory stores in mocks persist across exercises within a session — each exercise must get a fresh mock instance or mocks must provide a reset mechanism.

---

### Task 1: Extend test format with optional args field

**Files:**
- Modify: `src/conteudo/util.js`
- Test: existing test suite (backward compatibility)

**Interfaces:**
- Consumes: existing `problema()` function signature
- Produces: `problema()` accepts optional `args` in test objects; existing callers unaffected

- [ ] **Step 1: Verify current test format works**

Run: `npm test`
Expected: All existing tests pass. Note baseline count.

- [ ] **Step 2: Document args field in util.js**

Add JSDoc comment to `problema()` describing the extended test format:
```js
/**
 * @param {Object} opts
 * @param {Array<{entrada?: string, saida?: string, args?: string[], oculto?: boolean, regras?: Array}>} opts.testes
 */
```

No code change needed — `problema()` already passes `testes` through without validation. The `args` field is consumed by the runtime, not by `util.js`.

- [ ] **Step 3: Verify runtime handles args field**

Search `src/ui/item.js` and `src/go/runtime.js` for where `testes` entries are consumed. Confirm that extra fields (`args`) are ignored gracefully (no destructuring that would throw on unexpected keys). If destructuring is used, add `args` to the destructured fields or use rest spread.

- [ ] **Step 4: Run tests to confirm no regressions**

Run: `npm test`
Expected: Same pass count as Step 1.

- [ ] **Step 5: Commit**

```bash
git add src/conteudo/util.js
git commit -m "docs: document optional args field in exercise test format"
```

---

### Task 2: Restructure trilha.js to direct imports

**Files:**
- Modify: `src/conteudo/trilha.js`

**Interfaces:**
- Consumes: all module exports (`moduloBasico`, `moduloWeb`, `moduloConcorrencia`, future modules)
- Produces: clean `modulos` array without dynamic injection; `PROBLEMAS_EXTRAS` removed

- [ ] **Step 1: Remove PROBLEMAS_EXTRAS dynamic injection**

Delete lines 46–56 in `trilha.js` (the `PROBLEMAS_EXTRAS` array and the `if (moduloBasico...)` block that injects problems dynamically). These problems should be imported directly into their respective modules instead.

- [ ] **Step 2: Move extra problems into basico.js**

In `src/conteudo/basico.js`, add imports for `probVariaveis`, `probSlices`, `probStructs`, `probInterfaces` from `./problemas/*.js` and include them in `moduloBasico.itens` array at appropriate positions.

- [ ] **Step 3: Update trilha.js imports**

Remove the four `import { prob* }` lines (lines 9–12). Keep only module imports. The `modulos` array stays as `[moduloBasico, moduloWeb, moduloConcorrencia]` for now — new modules added in later tasks.

- [ ] **Step 4: Update porId map construction**

Line 61 currently spreads `PROBLEMAS_EXTRAS` into the map. Remove that spread since those problems are now inside `moduloBasico.itens` and will be included via the `itens` flatMap on line 58.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: All tests pass. Same exercise count as before (no exercises lost or duplicated).

- [ ] **Step 6: Commit**

```bash
git add src/conteudo/trilha.js src/conteudo/basico.js
git commit -m "refactor: replace dynamic problem injection with direct module imports"
```

---

### Task 3: Create mock adapter infrastructure

**Files:**
- Create: `src/conteudo/mocks/index.js`
- Create: `src/conteudo/mocks/fake-db.js`
- Create: `src/conteudo/mocks/fake-s3.js`
- Create: `src/conteudo/mocks/fake-mongo.js`
- Create: `src/conteudo/mocks/fake-redis.js`

**Interfaces:**
- Consumes: none
- Produces: `createFakeDB()`, `createFakeS3()`, `createFakeMongo()`, `createFakeRedis()` factory functions returning objects with realistic API surfaces backed by in-memory Maps

- [ ] **Step 1: Write failing test for FakeDB**

Create `tests/conteudo/mocks/fake-db.test.js`:
```js
test('FakeDB supports Query, Exec, Insert, and Transaction', () => {
  const db = createFakeDB();
  db.Exec('CREATE TABLE users (id INT, name TEXT)');
  db.Exec("INSERT INTO users VALUES (1, 'Alice')");
  const rows = db.Query('SELECT * FROM users WHERE id = ?', [1]);
  assert.deepStrictEqual(rows, [{ id: 1, name: 'Alice' }]);
});

test('FakeDB provides fresh instance per call', () => {
  const db1 = createFakeDB();
  const db2 = createFakeDB();
  db1.Exec("INSERT INTO t VALUES (1)");
  assert.strictEqual(db2.Query('SELECT * FROM t').length, 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/conteudo/mocks/fake-db.test.js`
Expected: FAIL — `createFakeDB` not defined.

- [ ] **Step 3: Implement FakeDB in fake-db.js**

Create `src/conteudo/mocks/fake-db.js` exporting `createFakeDB()`. Internal state: `Map<tableName, Array<row>>`. Methods: `Exec(sql, args?)`, `Query(sql, args?)`, `Begin()` (returns tx object with same API), `Close()`. SQL parsing is minimal — match table names and simple INSERT/SELECT patterns sufficient for exercises. Not a real SQL engine.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/conteudo/mocks/fake-db.test.js`
Expected: PASS.

- [ ] **Step 5: Write failing tests for FakeS3, FakeMongo, FakeRedis**

Similar pattern:
- FakeS3: `PutObject(bucket, key, body)`, `GetObject(bucket, key)`, `DeleteObject(bucket, key)`, `ListObjects(bucket)`
- FakeMongo: `InsertOne(collection, doc)`, `Find(collection, filter)`, `UpdateOne(collection, filter, update)`, `DeleteOne(collection, filter)`
- FakeRedis: `Set(key, value)`, `Get(key)`, `Del(key)`, `Expire(key, ttl)`, `Keys(pattern)`

Each gets a freshness test (separate instances don't share state).

- [ ] **Step 6: Implement FakeS3, FakeMongo, FakeRedis**

Create each file with factory function. All backed by `Map`. Redis `Expire` uses `setTimeout` to delete after TTL (or tracks expiry timestamps checked on Get). Mongo `Find` supports simple field equality filters.

- [ ] **Step 7: Create mocks/index.js barrel export**

```js
export { createFakeDB } from './fake-db.js';
export { createFakeS3 } from './fake-s3.js';
export { createFakeMongo } from './fake-mongo.js';
export { createFakeRedis } from './fake-redis.js';
```

- [ ] **Step 8: Run all mock tests**

Run: `npm test -- tests/conteudo/mocks/`
Expected: All PASS.

- [ ] **Step 9: Commit**

```bash
git add src/conteudo/mocks/ tests/conteudo/mocks/
git commit -m "feat: add mock adapters for DB, S3, MongoDB, and Redis"
```

---

### Task 4: Scaffold Módulo 2 — Estrutura de Dados

**Files:**
- Create: `src/conteudo/estruturas.js`
- Modify: `src/conteudo/trilha.js`

**Interfaces:**
- Consumes: `licao`, `problema`, `go` from `./util.js`
- Produces: `moduloEstruturas` with id `'estruturas'`, ~5 placeholder items (2 lições + 3 problemas)

- [ ] **Step 1: Create estruturas.js with placeholder items**

Create `src/conteudo/estruturas.js` following `basico.js` pattern:
```js
import { go, licao, problema } from './util.js';

export const moduloEstruturas = {
  id: 'estruturas',
  titulo: 'Estrutura de Dados',
  icone: '📦',
  descricao: 'Arrays, slices, maps, structs, métodos, interfaces, generics e ponteiros.',
  itens: [
    licao({ id: 'estruturas-arrays-licao', titulo: 'Arrays e Slices', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    licao({ id: 'estruturas-maps-licao', titulo: 'Maps', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    problema({ id: 'estruturas-slices-append', titulo: 'Append em Slices', dificuldade: 'facil', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
    problema({ id: 'estruturas-maps-contagem', titulo: 'Contagem com Maps', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
    problema({ id: 'estruturas-structs-pessoa', titulo: 'Struct Pessoa', dificuldade: 'facil', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
  ],
};
```

- [ ] **Step 2: Register module in trilha.js**

Add `import { moduloEstruturas } from './estruturas.js';` and insert into `modulos` array after `moduloBasico`: `[moduloBasico, moduloEstruturas, moduloWeb, moduloConcorrencia]`.

- [ ] **Step 3: Update PROXIMOS_MODULOS**

Remove any entry with `id: 'estruturas'` from `PROXIMOS_MODULOS` if present (it's now a real module).

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: All pass. New items appear in `itens` array. No duplicate IDs.

- [ ] **Step 5: Commit**

```bash
git add src/conteudo/estruturas.js src/conteudo/trilha.js
git commit -m "feat: scaffold Módulo 2 (Estrutura de Dados) with placeholder items"
```

---

### Task 5: Scaffold Módulos 5, 6, 7 — Bancos, Nuvem, Arquitetura

**Files:**
- Create: `src/conteudo/bancos.js`
- Create: `src/conteudo/nuvem.js`
- Create: `src/conteudo/arquitetura.js`
- Modify: `src/conteudo/trilha.js`

**Interfaces:**
- Consumes: `licao`, `problema`, `go` from `./util.js`; mock adapters from `./mocks/index.js`
- Produces: `moduloBancos` (id `'bancos'`), `moduloNuvem` (id `'nuvem'`), `moduloArquitetura` (id `'arquitetura'`) with placeholder items

- [ ] **Step 1: Create bancos.js with placeholder items referencing mocks**

Create `src/conteudo/bancos.js` with ~4 placeholder items. Include a comment showing how exercises will use `createFakeDB()`:
```js
// Exercises in this module use mock adapters from ./mocks/index.js
// so they run fully in the browser without real databases.
import { go, licao, problema } from './util.js';

export const moduloBancos = {
  id: 'bancos',
  titulo: 'Bancos e Cache',
  icone: '🗄️',
  descricao: 'SQL/database, PostgreSQL, SQLite, MongoDB, Redis/cache e migrations.',
  itens: [
    licao({ id: 'bancos-sql-basico-licao', titulo: 'database/sql Básico', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    problema({ id: 'bancos-sql-insert', titulo: 'INSERT com database/sql', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'Use o FakeDB do playground.', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
    licao({ id: 'bancos-mongo-crud-licao', titulo: 'MongoDB CRUD', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    problema({ id: 'bancos-redis-cache', titulo: 'Cache com Redis', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'Use o FakeRedis do playground.', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
  ],
};
```

- [ ] **Step 2: Create nuvem.js with placeholder items**

Create `src/conteudo/nuvem.js` with ~3 placeholder items. Note that gRPC exercises will use pre-generated `.pb.go` files provided as initial code:
```js
import { go, licao, problema } from './util.js';

export const moduloNuvem = {
  id: 'nuvem',
  titulo: 'Nuvem e gRPC',
  icone: '☁️',
  descricao: 'gRPC, protobuf, AWS SDK, Azure SDK, configuração e secrets.',
  itens: [
    licao({ id: 'nuvem-grpc-conceitos-licao', titulo: 'Conceitos de gRPC', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    problema({ id: 'nuvem-grpc-handler', titulo: 'Implementar Handler gRPC', dificuldade: 'dificil', enunciado: '<p>TODO — código .pb.go fornecido como inicial</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
    problema({ id: 'nuvem-s3-upload', titulo: 'Upload para S3 (Fake)', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'Use o FakeS3 do playground.', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
  ],
};
```

- [ ] **Step 3: Create arquitetura.js with placeholder items**

Create `src/conteudo/arquitetura.js` with ~3 placeholder items:
```js
import { go, licao, problema } from './util.js';

export const moduloArquitetura = {
  id: 'arquitetura',
  titulo: 'Arquitetura e Projeto Final',
  icone: '🏛️',
  descricao: 'Clean Architecture, Hexagonal, DDD, microsserviço e projeto integrador.',
  itens: [
    licao({ id: 'arq-clean-arch-licao', titulo: 'Clean Architecture', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    licao({ id: 'arq-hexagonal-licao', titulo: 'Hexagonal Architecture', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    problema({ id: 'arq-projeto-final-api', titulo: 'API Hexagonal Completa', dificuldade: 'dificil', enunciado: '<p>TODO — projeto integrador</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
  ],
};
```

- [ ] **Step 4: Register all three modules in trilha.js**

Add imports and update `modulos` array to full pedagogical order:
```js
import { moduloBasico } from './basico.js';
import { moduloEstruturas } from './estruturas.js';
import { moduloWeb } from './web.js';
import { moduloConcorrencia } from './concorrencia.js';
import { moduloBancos } from './bancos.js';
import { moduloNuvem } from './nuvem.js';
import { moduloArquitetura } from './arquitetura.js';

export const modulos = [
  moduloBasico, moduloEstruturas, moduloWeb, moduloConcorrencia,
  moduloBancos, moduloNuvem, moduloArquitetura,
];
```

- [ ] **Step 5: Clear PROXIMOS_MODULOS**

Replace `PROXIMOS_MODULOS` content with an empty array `[]` or remove entries that are now real modules. Keep the export for forward compatibility.

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: All pass. Seven modules in `modulos`. No duplicate IDs across all modules.

- [ ] **Step 7: Commit**

```bash
git add src/conteudo/bancos.js src/conteudo/nuvem.js src/conteudo/arquitetura.js src/conteudo/trilha.js
git commit -m "feat: scaffold Módulos 5-7 (Bancos, Nuvem, Arquitetura) and register all 7 modules"
```

---

### Task 6: Validate exercise ID uniqueness at startup

**Files:**
- Modify: `src/conteudo/trilha.js`

**Interfaces:**
- Consumes: `itens` array (all exercises from all modules)
- Produces: runtime assertion that catches duplicate IDs during development

- [ ] **Step 1: Write failing test for duplicate ID detection**

Create `tests/conteudo/trilha.test.js`:
```js
import { itens } from '../../src/conteudo/trilha.js';

test('all exercise IDs are unique', () => {
  const ids = itens.map((i) => i.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.strictEqual(duplicates.length, 0, `Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);
});
```

- [ ] **Step 2: Run test to verify it passes with current data**

Run: `npm test -- tests/conteudo/trilha.test.js`
Expected: PASS (no duplicates exist yet — this is a safety net).

- [ ] **Step 3: Add dev-mode assertion to trilha.js**

After the `porId` map construction (line ~61), add:
```js
// Dev-only: catch duplicate exercise IDs early.
if (typeof globalThis.process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  const seen = new Set();
  for (const item of itens) {
    if (seen.has(item.id)) throw new Error(`Duplicate exercise ID: ${item.id}`);
    seen.add(item.id);
  }
}
```

This runs only in Node/test environments, not in the browser bundle.

- [ ] **Step 4: Run full test suite**

Run: `npm test`
Expected: All pass including the new uniqueness test.

- [ ] **Step 5: Commit**

```bash
git add src/conteudo/trilha.js tests/conteudo/trilha.test.js
git commit -m "feat: validate exercise ID uniqueness at startup in dev mode"
```

---

## Execution Handoff

Two plans are ready for review:

1. **[Screen Refinement](2026-11-04-screen-refinement.md)** — 5 tasks, removes advanced UI elements and adds "⋯ Mais ações" menu. Independent of content work; can ship first.
2. **[Content Framework](2026-11-04-content-framework.md)** — 6 tasks, builds mock adapters, restructures module imports, scaffolds all 7 modules with placeholders. Foundation for writing 300 exercises.

These plans are independent and can execute in either order or in parallel. Screen refinement is smaller and lower-risk; content framework unblocks all future exercise authoring.

Plan complete and saved to `docs/superpowers/plans/`. Please review both plans. Which execution approach would you prefer?

- **Subagent-driven** — A fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** — I implement every task myself in this session, the way this harness runs work, then one fresh reviewer on the most capable model checks the whole branch. Cheapest and fastest; no independent review until the end. Runs well with a mid-tier session model, since the plan carries the design.

For these plans I recommend **native**, because the tasks are sequential within each plan (each builds on the previous task's interfaces), there are only 11 tasks total across both plans, and the spec already pins every interface — a subagent per task would re-read the same spec 11 times without adding much safety. Does the plan capture what you want, and which approach should we use?