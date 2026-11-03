# SDD ledger — plan: docs/superpowers/plans/2026-10-30-migracao-astro.md

## Pre-flight scan
- All Fase 1 reference files verified present: trilha.js, seo.js, ambiente.js, certificados.js, plugin-historico.mjs, gerar-badges.mjs, 5 CSS globals, vite.config.js.
- GopherJS is a Go CLI binary, not an npm package; integrated via Vite plugin (same as infrastructure plan ruling).
- CSS globals live in src/ (not public/css/): estilo.css, caminho.css, cenarios.css, landing.css, acessibilidade-ux.css.

## Task progress
Fase 1: complete (commits up to 100e6d5..latest, astro.config.mjs + Base.astro + index.astro + rotas.ts + package.json scripts + deps installed + .gitignore updated; landing verified HTTP 200 at /go-playground/).
Fase 2: complete (src/lib/conteudo.ts bridge + trilha/livre/validar/instrutor static pages; all 5 routes verified HTTP 200 on dev server).
Fase 3: complete (src/stores/progresso.ts + src/stores/preferencias.ts nanostores; src/islands/ProgressoTopo.tsx + PainelAcessibilidade.tsx React islands wired into Base.astro with client:idle; all 5 routes verified HTTP 200 after island integration).
Fase 4: complete (src/pages/p/[id].astro dynamic exercise page with getStaticPaths from content bridge; routes /p/licao-ola-mundo/, /p/prob-soma/, /p/licao-variaveis/ verified HTTP 200 on dev server port 4322).