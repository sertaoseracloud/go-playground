# SDD ledger — plan: ../docs/superpowers/plans/2026-10-28-divergego-infrastructure.md

## Pre-flight scan
- Task 1 brief requires `gopherjs` as npm dependency, but GopherJS is a Go CLI binary (`go install github.com/gopherjs/gopherjs@latest`), not an npm package. Ruling: remove from package.json dependencies; integrate via CLI invocation in Task 4's Vite plugin instead. Cost if wrong: npm install fails, blocking all tasks.
- Tasks 2-10 reference files created by earlier tasks (ambiente.js, ed25519.js, etc.) — no circular dependencies detected.
- Coverage thresholds (72/65/65/74) copied from terraform-playground; will need adjustment after first measurement in Task 4. Noted as deferred minor.

## Task progress
Task 1: implementer done (commits 8f04c96..580724f, DONE_WITH_CONCERNS — gopherjs removed from deps per ruling above; 3/3 tests pass).
Task 1: minor (deferred): package.json qrcode-generator indented with 8 spaces instead of 4 (cosmetic).
Task 1: minor (deferred): tests/infra/package-json.test.js required-scripts array omits test:e2e (script itself exists in package.json).
Task 1: complete (commits 8f04c96..580724f, review clean — verdict APPROVED, gopherjs deviation accepted per pre-flight ruling)
Task 2: implementer done (commits 580724f..ce81fa5, DONE — 2/2 tests pass, no concerns).
Task 2: complete (commits 580724f..ce81fa5, review clean — verdict APPROVED, no findings requiring fixes)
Task 3: implementer done (commits ce81fa5..0c3f37e, DONE — 2/2 tests pass, no concerns).
Task 3: complete (commits ce81fa5..0c3f37e, review clean — verdict APPROVED, no findings)
Task 4: fix round 1/5 (4 addressed, 0 open — redundant executarGo export re-exported from runtime.js; plugin falls back to mock output instead of throwing when gopherjs binary missing; comment typo fixed; new Function() sandbox limitation documented in runtime.js; commits effae2c..0af6700)
Task 4: minor (deferred): runtime.js uses new Function() — not a real security sandbox; production browser use should move execution to a Web Worker (documented in JSDoc).
Task 4: complete (commits effae2c..0af6700, review clean — re-review verdict ALL_ADDRESSED, no new breakage)
Task 5: implementer done (commits 0af6700..8a6649a, DONE — 1/1 test pass). Review returned NEEDS_FIXES; adjudication parked 3 findings (trilha.js 1-module stub is correct per plan Task 10 design; seo.js JSON-LD/OG out of scope for parity; unused `esc` exists in terraform-playground too; linguagem-go stub acceptable per brief).
Task 5: Ruling: trilha.js stub with 1 module stands — plan Task 10 defines trilha.js as a stub; landing.js iterates modulos dynamically, so the 10 cards appear when content plans populate the array. Cost if wrong: landing page ships with one card until content plans land.
Task 5: Ruling: seo.js parity without JSON-LD/OG image tags stands — reference playgrounds have neither; adding them is a new feature, not parity. Cost if wrong: social previews lack a rich card until a later content task.
Task 5: fix round 1/5 (2 addressed, 0 open — acessibilidade wired to iniciarRegua/iniciarPausa; layout-calculo.js imported and inline stub removed; commits 8a6649a..d0e0bf8)
Task 5: complete (commits 0af6700..d0e0bf8, re-review verdict ALL_ADDRESSED, no new breakage, 3 findings parked with rulings)
Task 6: implementer done (commits d0e0bf8..8af2b93, DONE — 27/27 tests pass, no concerns). Reviewer verdict APPROVED. Minor deferred: magic number delays (200/1000) could become named constants; reduzirAnimacoes access path slightly inconsistent between terminal.js (DOM class) and saida.js (option param) but both functional.
Task 6: complete (commits d0e0bf8..8af2b93, review clean — verdict APPROVED)
Task 7: implementer done (commits 8af2b93..094d8fb, DONE — 1/1 test pass). Review returned NEEDS_FIXES; adjudication kept 3 findings (ambiente.js import, module 7+ guard, idempotent patch) and parked 2 minors (test only checks internal Map state — acceptable per brief; SW-not-ready errors swallowed silently — deferred).
Task 7: fix round 1/5 (3 addressed, 0 open — PREFIXO_ARMAZENAMENTO imported from ambiente.js; registrarServiceWorker(moduloNumero) guards modules < 7; patchGopherJSHttp idempotent via _patched flag; commits 094d8fb..ee0986d)
Task 7: complete (commits 8af2b93..ee0986d, re-review verdict ALL_ADDRESSED, no new breakage, 2 minors deferred)
Task 8: implementer done (commits ee0986d..89cb35c, DONE — 1/1 test pass). Review returned NEEDS_FIXES; adjudication kept 2 Important findings (per-request SW listener, internal Map exposure) and parked 1 minor (criarFrameGrpcWeb/buscarHandlerGrpc uncalled — YAGNI, deferred to final review).
Task 8: fix round 1/5 (2 addressed, 0 open — persistent message listener with pendingGrpcRequests Map keyed by messageId; registrarServicoGrpc._servicos exposure removed; commits 89cb35c..91f4263)
Task 8: complete (commits ee0986d..91f4263, re-review verdict ALL_ADDRESSED, no new breakage, 1 minor parked)
Task 9: implementer done (commits 91f4263..f632c54, DONE — 1/1 test pass, no concerns). Reviewer verdict APPROVED, no Critical/Important findings. Minor deferred: conferir-build reads all JS assets into memory (acceptable for build-time check); gerar-badges imports from stub modules (expected, will pick up content when populated later).
Task 9: complete (commits 91f4263..f632c54, review clean — verdict APPROVED)
Task 10: implementer done (commits f632c54..0006250, DONE — 3/3 README tests pass, npm run build succeeded, conferir-build.mjs dist principal passed).
Task 10: Ruling: task review skipped and accepted on implementer evidence — the reviewer dispatch failed 3× with transient claude-opus-5-5 classifier timeouts, and the user explicitly approved Task 10 ("aprova task 10 e continua"). Cost if wrong: any Task 10 defect (README structure, certificate prefix, trilha.js interface) reaches the final whole-branch review unfiltered.
Task 10: complete (commits f632c54..0006250, user-approved per ruling above — no independent task review)
All 10 tasks complete. Proceeding to final whole-branch review.
Task 10: implementer done (commits f632c54..0006250, DONE — 3/3 README tests pass, npm run build succeeded, conferir-build.mjs dist principal passed).
Task 10: Ruling: task review skipped and accepted on implementer evidence — the reviewer dispatch failed 3× with transient claude-opus-5-5 classifier timeouts, and the user explicitly approved Task 10 ("aprova task 10 e continua"). Cost if wrong: any Task 10 defect (README structure, certificate prefix, trilha.js interface) reaches the final whole-branch review unfiltered.
Task 10: complete (commits f632c54..0006250, user-approved per ruling above — no independent task review)
All 10 tasks complete. Proceeding to final whole-branch review.
Trilhas: infrastructure created (util.js with go` tag, licao/problema helpers; basico.js with 4 items; trilha.js wired with LIVRE, PROXIMOS_MODULOS, buscarItem, vizinhos). Build validated with ephemeral CERTIFICADO_SEGREDO. Committed as feat(go): add trilha content infrastructure and basico module with 4 items.
Trilhas: landing updated to render PROXIMOS_MODULOS placeholders with em-breve styles (landing.js + landing.css). Support files created (cenarios.js, falas-da-vila.js, glossario.js) for parity with TF/PHP/Python. All committed and build validated.
Trilhas: moduloWeb added (web.js — 3 items: servidor HTTP, JSON API, status code exercise). trilha.js updated to import moduloWeb; PROXIMOS_MODULOS reduced to concorrencia + projetos. Build validated and committed.
Migração Astro: astro.config.mjs criado com hook de certificados como integração Astro (publicarChave); ed25519.js corrigido para API v2 do @noble/ed25519 (etc.sha512Sync + conversão hex→bytes); src/novidades.js criado com histórico de releases; conferir-build.mjs protegido contra caminhos inválidos sem side effects na importação; .astro/ adicionado ao .gitignore. Build e testes verdes (12 suítes, 47 casos). Commit 2ec3b80.