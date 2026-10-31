# Plano de Migração DivergeGo → Astro + React (Ilhas)

**Data:** 2026-10-30
**Referência:** `spike-astro-k8s` (padrão já validado)
**Objetivo:** Migrar a SPA Vite pura do DivergeGo para Astro com ilhas React, mantendo o conteúdo, simulador e regras em JS puro (`src/`), trocando apenas a "casca" (rotas, SEO, layout).

---

## Diagnóstico da Fase 0 ✅

| Aspecto | DivergeGo (atual) | Spike K8s (referência) | Ação necessária |
|---------|-------------------|------------------------|-----------------|
| Framework | Vite + SPA hash routing | Astro 7.3 + React 19 (ilhas) | Adicionar Astro como camada superior |
| Rotas | Hash (`#/trilha`, `#/p/<id>`) | Arquivos `.astro` em `src/pages/` | Criar páginas estáticas + redirecionamento de hash legado |
| SEO | Prerender manual (`scripts/prerender.mjs`) | Meta tags no frontmatter + sitemap automático | Migrar para `<Base>` layout com props |
| Plugins Vite | `gopherjs-plugin`, `plugin-historico`, `publicarChave` | Mesmos plugins via `vite.define` no astro.config | Adaptar plugins para integração Astro |
| CSS | 4 arquivos globais (`estilo`, `caminho`, `cenarios`, `landing`) | Globais + `acessibilidade-ux.css` + `spike.css` | Importar mesmos globais no layout Base |
| Conteúdo | `src/conteudo/trilha.js` (stub vazio) | Ponte tipada em `src/lib/conteudo.ts` | Criar ponte equivalente quando trilha tiver dados |
| Ilhas | Nenhuma (tudo em JS vanilla) | `ProgressoTopo`, `PainelAcessibilidade`, `Exercicio`, `EditorYaml` | Extrair componentes UI para ilhas React |
| Build | `vite build && node scripts/prerender.mjs` | `astro build && node scripts/conferir-segredo.mjs` | Substituir script de build |
| Segredos | `CERTIFICADO_SEGREDO` via vite.define | Mesmo padrão via astro.config define | Replicar lógica de derivação SHA-256 |

### Estrutura atual do DivergeGo
- **SPA pura:** `index.html` + `src/main.js` com roteamento por hash
- **Telas:** landing, inicio, item, certificado, validador, instrutor, acessibilidade, privacidade, licenca, termos, novidades
- **UI:** 15 módulos em `src/ui/` (menu, editor, terminal, neuro, acessibilidade, etc.)
- **Go no browser:** `src/go/` (compiler, runtime, comandos, saida, http-shim, grpc-web-shim, service-worker-client)
- **CSS:** 4 arquivos globais
- **Scripts:** gopherjs-plugin, plugin-historico, prerender, gerar-badges, conferir-build

---

## Fases da Migração

### Fase 1: Infraestrutura Astro (esqueleto funcional)
**Meta:** Site roda em `astro dev` com landing page renderizada, sem quebrar a SPA existente.

1. **Criar `astro.config.mjs`**
   - Adaptar do spike: trocar prefixo `kubernetes-playground:` → `go-playground:`
   - Manter plugins Vite (`gopherjs-plugin`, `plugin-historico`) via `vite.plugins`
   - Replicar lógica de segredos e `define` (__CHAVE_CERTIFICADO__, __SEMENTE_ED25519__, etc.)
   - `base: '/go-playground/'` (produção) e `/go-playground/homologacao/` (homologação)
   - `publicDir: 'public'` (badges, ícones, og-capa)
   - Integrations: `@astrojs/react`, `@astrojs/sitemap` (só em produção)
   - Fonts: Atkinson Hyperlegible + Fira Code via fontsource

2. **Criar `src/layouts/Base.astro`**
   - Adaptar do spike: trocar marca ☸️ → 🏗️, nome → DivergeGo
   - Importar CSS globais: `estilo.css`, `caminho.css`, `cenarios.css`, `landing.css`
   - Script inline de tema (localStorage) igual ao spike
   - Slot para `<head>` extra e conteúdo principal
   - Header com nav (Trilha, Playground livre, Validar, Instrutor)
   - Região `aria-live` para anúncios
   - Flutuantes (ajuda e preferências) como slot ou ilha futura

3. **Criar `src/pages/index.astro`**
   - Renderizar landing via `renderLanding()` (mesmo HTML do prerender atual)
   - Redirecionamento de hash legado (`destinoDeHashAntigo`)
   - Props SEO: título e descrição de `PRINCIPAL`

4. **Criar `src/lib/rotas.ts`**
   - Adaptar do spike: mesmas rotas (`/`, `/trilha/`, `/p/[id]/`, `/livre/`, `/validar/`)
   - Função `destinoDeHashAntigo` cobrindo todos os formatos do DivergeGo
   - Incluir rotas extras: `/instrutor/`, `/acessibilidade/`, `/privacidade/`, `/licenca/`, `/termos/`, `/novidades/`, `/certificado/`

5. **Criar `src/lib/conteudo.ts`**
   - Ponte tipada para `src/conteudo/trilha.js` (atualmente stub vazio)
   - Interfaces `Item`, `Modulo`, `Teste` iguais ao spike
   - Funções `item()`, `vizinhosDe()`, `semHtml()`

6. **Atualizar `package.json`**
   - Adicionar dependências: `astro`, `@astrojs/react`, `@astrojs/sitemap`, `react`, `react-dom`, `nanostores`, `@nanostores/react`
   - Adicionar devDependencies: `@astrojs/check`, `typescript`, `@types/react`, `@types/react-dom`
   - Scripts: `dev: astro dev`, `build: astro build`, `preview: astro preview`, `check: astro check`
   - Manter dependências existentes (codemirror, qrcode-generator, etc.)

7. **Verificação da Fase 1**
   - `npm run dev` abre landing page em `localhost:4321/go-playground/`
   - Landing renderiza HTML correto (mesmo conteúdo do prerender atual)
   - Links antigos (`#/trilha`, `#/p/basico-01`) redirecionam para rotas novas
   - Tema salvo aplica antes da primeira pintura (sem flash)
   - `npm run build` gera `dist/` com HTML estático e sitemap.xml

### Fase 2: Páginas Estáticas (SEO completo)
**Meta:** Todas as telas informativas viram páginas `.astro` com meta tags individuais.

1. **Criar páginas informativas:**
   - `src/pages/trilha/index.astro` — lista de módulos e exercícios
   - `src/pages/livre/index.astro` — playground livre
   - `src/pages/instrutor/index.astro` — perfil do instrutor
   - `src/pages/acessibilidade/index.astro` — recursos de acessibilidade
   - `src/pages/privacidade/index.astro` — política de privacidade
   - `src/pages/licenca/index.astro` — licença AGPL
   - `src/pages/termos/index.astro` — termos de uso
   - `src/pages/novidades/index.astro` — changelog (virtual:historico)
   - `src/pages/validar/index.astro` — validador de certificado
   - `src/pages/certificado/index.astro` — emissão de certificado
   - `src/pages/404.astro` — página não encontrada

2. **Criar página dinâmica de exercício:**
   - `src/pages/p/[id].astro` — getStaticPaths sobre `todosOsItens`
   - Frontmatter com título, descrição, dados estruturados do exercício
   - Placeholder para ilha do editor/terminal (Fase 3)

3. **Dados estruturados schema.org**
   - Adaptar `dadosEstruturados()` de `src/seo.js` para cada página
   - JSON-LD no `<head>` via slot do Base

4. **Verificação da Fase 2**
   - Cada página tem `<title>` e `<meta description>` únicos
   - Lighthouse SEO ≥ 90 em todas as páginas
   - Sitemap inclui todas as rotas
   - Dados estruturados validam no Rich Results Test

### Fase 3: Ilhas React (Interatividade)
**Meta:** Extrair componentes UI interativos para ilhas React, mantendo o resto como HTML estático.

1. **Ilhas prioritárias:**
   - `ProgressoTopo.tsx` — barra de progresso no header
   - `PainelAcessibilidade.tsx` — painel ♿ flutuante
   - `MenuTopo.tsx` — menu responsivo (mobile/desktop)
   - `Flutuantes.tsx` — botões de ajuda, acessibilidade, privacidade

2. **Ilhas de exercício:**
   - `EditorGo.tsx` — CodeMirror + botões Run/Send
   - `TerminalSimulado.tsx` — saída do go run/test/vet
   - `AbasSaida.tsx` — Terminal, Cobertura, Outputs, Docs
   - `ValidadorCertificado.tsx` — formulário de validação

3. **Estado compartilhado:**
   - Nanostores para progresso, preferências, estado do exercício
   - Persistência em localStorage com prefixo `go-playground:`

4. **Verificação da Fase 3**
   - Editor funciona (compila Go, mostra testes)
   - Progresso salva e carrega corretamente
   - Painel de acessibilidade aplica temas e tamanhos
   - Sem regressão em leitores de tela (axe-core)

### Fase 4: Plugins e Build (Paridade completa)
**Meta:** Build do Astro produz mesmo output que o build Vite atual, incluindo certificados e badges.

1. **Adaptar plugins Vite:**
   - `gopherjs-plugin` → funciona via `vite.plugins` no astro.config
   - `plugin-historico` → virtual module compatível com Astro
   - `publicarChave` → hook `astro:build:done` para emitir assets

2. **Badges SVG:**
   - `scripts/gerar-badges.mjs` roda pós-build
   - Output em `public/badge/` (já existe)

3. **Conferir build:**
   - `scripts/conferir-build.mjs` adaptado para verificar dist/ do Astro
   - `scripts/conferir-segredo.mjs` igual ao spike

4. **Homologação:**
   - `HOMOLOGACAO=1` gera build em `/go-playground/homologacao/`
   - Noindex, prefixo de storage diferente, faixa de aviso

5. **Verificação da Fase 4**
   - `npm run build` completa sem erros
   - Certificados assinados verificáveis fora do site
   - Badges gerados corretamente
   - Homologação funciona isoladamente

### Fase 5: Limpeza e Documentação
**Meta:** Remover código legado da SPA e documentar a nova arquitetura.

1. **Remover:**
   - `index.html` (substituído por `src/pages/index.astro`)
   - `src/main.js` (lógica distribuída em páginas e ilhas)
   - `scripts/prerender.mjs` (Astro faz isso nativamente)
   - `vite.config.js` (substituído por `astro.config.mjs`)

2. **Manter:**
   - Todo `src/conteudo/`, `src/go/`, `src/ui/` (lógica de negócio)
   - `src/seo.js`, `src/ambiente.js`, `src/certificados.js`
   - `scripts/gerar-badges.mjs`, `scripts/plugin-historico.mjs`
   - CSS globais

3. **Documentar:**
   - README atualizado com nova estrutura
   - Guia de desenvolvimento (como adicionar exercícios, ilhas, páginas)
   - CI/CD atualizado para `astro build`

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| GopherJS plugin incompatível com Astro | Alto | Testar na Fase 1; fallback para mock se falhar |
| Perda de acessibilidade na migração | Crítico | Axe-core em cada fase; teste manual com leitor de tela |
| URLs antigas quebram bookmarks | Médio | Redirecionamento de hash cobre todos os formatos conhecidos |
| Estado de progresso perdido | Alto | Mesma chave localStorage; teste de migração de dados |
| Build time aumenta muito | Baixo | Astro SSG é rápido; monitorar e otimizar se necessário |
| Trilha vazia (stub) bloqueia páginas | Médio | Fase 2 depende de dados; começar com páginas informativas |

---

## Critérios de Sucesso

- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90
- [ ] WCAG 2.2 AA validado com axe-core
- [ ] Todos os links antigos redirecionam corretamente
- [ ] Editor Go compila e testa no browser
- [ ] Certificados assinados e verificáveis
- [ ] Homologação isolada e funcional
- [ ] Build < 60 segundos
- [ ] Zero regressão em funcionalidades existentes

---

## Próximos Passos Imediatos

1. Criar `astro.config.mjs` (Fase 1.1)
2. Criar `src/layouts/Base.astro` (Fase 1.2)
3. Criar `src/pages/index.astro` (Fase 1.3)
4. Criar `src/lib/rotas.ts` (Fase 1.4)
5. Atualizar `package.json` com dependências Astro (Fase 1.6)
6. Rodar `npm run dev` e validar landing page