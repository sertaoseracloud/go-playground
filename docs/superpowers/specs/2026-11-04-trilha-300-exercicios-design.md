# Design: Trilha de 300 Exercícios + Refinamento da Tela do Go Playground

**Data:** 2026-11-04
**Status:** Rascunho para aprovação
**Autor:** IA (com base em brainstorming com o usuário)

---

## 1. Intent e Porquê

Construir uma trilha completa de 300 exercícios de Go que leva alguém do **absoluto zero** (nunca programou) até conseguir:

1. **Passar em entrevistas técnicas** de Go (dominando fundamentos, concorrência, APIs e arquitetura).
2. **Construir projetos próprios profissionais** — especificamente uma API com Clean Architecture/Hexagonal, domínio isolado como microsserviço, integrando bancos de dados, cache e SDKs de nuvem.

O projeto final não é mais uma CLI (como discutido inicialmente), mas uma **API profissional com arquitetura hexagonal**, que é o tipo de código que empresas sérias escrevem e cobram em entrevistas.

---

## 2. Progressão Pedagógica

### Marco intermediário (exercício ~150)
A pessoa já consegue:
- Construir APIs HTTP simples (rotas, handlers, JSON)
- Entender estrutura de dados (slices, maps, structs)
- Dominar lógica de programação (condicionais, loops, funções, recursão)
- Escrever testes básicos

Ela **ainda não** usa goroutines, channels, gRPC, bancos de dados ou nuvem. Isso vem na segunda metade.

### Marco final (exercício 300)
A pessoa constrói uma API completa com:
- Clean Architecture / Hexagonal Architecture
- Domínio isolado como microsserviço
- Integração com MongoDB e PostgreSQL (SQLite para exercícios locais)
- Cache (Redis ou in-memory)
- SDKs da Azure e AWS
- gRPC além de HTTP
- Testes unitários, de integração e de contrato

---

## 3. Distribuição dos 300 Exercícios por Módulo

| # | Módulo | Exercícios | Foco |
|---|--------|-----------|------|
| 1 | **Lógica e Fundamentos** | 1–60 (60) | Variáveis, tipos, condicionais, loops, funções, recursão, strings, fmt |
| 2 | **Estrutura de Dados** | 61–120 (60) | Arrays, slices, maps, structs, métodos, interfaces, generics, ponteiros |
| 3 | **HTTP e APIs** | 121–170 (50) | net/http, rotas, middleware, JSON, validação, testes HTTP, request.http-style |
| 4 | **Concorrência** | 171–220 (50) | Goroutines, channels, select, sync, patterns (worker pool, fan-in/out, pipeline) |
| 5 | **Bancos e Cache** | 221–255 (35) | SQL/database, PostgreSQL, SQLite, MongoDB, Redis/cache, migrations |
| 6 | **Nuvem e gRPC** | 256–280 (25) | gRPC, protobuf, AWS SDK, Azure SDK, configuração, secrets |
| 7 | **Arquitetura e Projeto Final** | 281–300 (20) | Clean Arch, Hexagonal, DDD, microsserviço, projeto integrador completo |
| | **Total** | **300** | |

### Proporção lições vs problemas
- **~40% lições** (~120): conteúdo teórico com código executável
- **~60% problemas** (~180): exercícios práticos com testes automatizados

---

## 4. Refinamento da Tela do Playground

### Elementos para REMOVER

Comparando com o python-playground (referência canônica), estes elementos não fazem sentido para aprendizes e devem ser removidos:

1. **Seletor de workspace** (`default/dev/homolog/prod`) — conceito avançado de Go workspaces que confunde iniciantes. Não existe no python-playground.
2. **Aba "Grafo"** (`data-saida="grafo"`, "Quem depende de quem") — visualização de dependências é útil em projetos reais, não em exercícios.
3. **Aba "Estado"** (`data-saida="estado"`, "go.mod simulado") — conteúdo fixo, pouco didático.
4. **Botão "Limpar estado"** (`btn-resetar-estado`) — redundante com `go clean` no terminal.
5. **Botões duplicados Run/Clean na barra principal** (`btn-apply`, `btn-destroy`) — ações secundárias devem ir para menu "⋯ Mais ações".

### Elementos para AJUSTAR

1. **Botões secundários** (Restaurar, Compartilhar) movidos para menu "⋯ Mais ações" como no python-playground, reduzindo poluição visual.
2. **Terminal**: manter o estilo macOS com traffic lights (diferencial visual positivo do go-playground).
3. **Abas de saída**: simplificar para apenas "🖥️ Terminal" e "📤 Outputs" (removendo Grafo e Estado).

### Arquivos afetados pelo refinamento
- `index.html` — remover seletor workspace, abas grafo/estado, botão limpar-estado, botões apply/destroy
- `src/ui/item.js` — remover lógica associada aos elementos removidos, reorganizar botões secundários
- `src/estilo.css` — remover estilos dos elementos removidos

---

## 5. Conteúdo Detalhado por Módulo

### Módulo 1: Lógica e Fundamentos (1–60)
- Olá Mundo, package main, fmt
- Variáveis, tipos, declaração curta vs explícita
- Constantes, iota
- Condicionais (if/else, switch)
- Loops (for, for-range)
- Funções (parâmetros, retornos múltiplos, variádicas)
- Recursão
- Strings e manipulação
- Erros básicos (errors.New, fmt.Errorf)
- Pacotes e imports

### Módulo 2: Estrutura de Dados (61–120)
- Arrays e slices (len, cap, append, copy)
- Maps (criação, iteração, delete)
- Structs (campos, embedding, tags)
- Métodos e receivers (value vs pointer)
- Interfaces (implícitas, type assertions, type switches)
- Ponteiros
- Generics (type parameters, constraints)
- Ordenação e busca

### Módulo 3: HTTP e APIs (121–170)
- net/http básico (ListenAndServe, HandleFunc)
- Rotas e mux
- Request/Response (headers, status codes, body)
- JSON (encoding/json, struct tags)
- Middleware (logging, auth, CORS)
- Validação de entrada
- Testes HTTP (httptest)
- Estilo request.http (executar requisições do terminal)

### Módulo 4: Concorrência (171–220)
- Goroutines (go func, scheduling)
- Channels (buffered, unbuffered, direcionais)
- Select e timeout
- sync.Mutex, sync.RWMutex, sync.WaitGroup
- sync.Once, sync.Pool
- Patterns: worker pool, fan-in, fan-out, pipeline
- Context (cancelamento, timeout, valores)
- Race detector

### Módulo 5: Bancos e Cache (221–255)
- database/sql básico
- Drivers (PostgreSQL, SQLite)
- Queries parametrizadas, transactions
- Migrations
- MongoDB (driver oficial, CRUD, agregações)
- Cache in-memory e Redis
- Connection pooling

### Módulo 6: Nuvem e gRPC (256–280)
- Protocol Buffers e protoc
- gRPC (servidor, cliente, streaming)
- AWS SDK (S3, DynamoDB, Lambda)
- Azure SDK (Blob Storage, Cosmos DB, Functions)
- Configuração e variáveis de ambiente
- Secrets management

### Módulo 7: Arquitetura e Projeto Final (281–300)
- Clean Architecture (camadas: domain, application, infrastructure, presentation)
- Hexagonal Architecture (ports e adapters)
- Domain-Driven Design básico (entities, value objects, repositories)
- Microsserviço: definição de domínio, bounded context
- Projeto integrador: API completa com todos os conceitos anteriores
- Testes de integração e contrato
- Documentação (OpenAPI/Swagger)

---

## 6. Formato dos Exercícios

Cada exercício segue o formato existente em `util.js`:

```js
problema({
  id: 'modulo-topico-numero',
  titulo: 'Título descritivo',
  dificuldade: 'facil' | 'medio' | 'dificil',
  enunciado: '<p>Descrição HTML do que fazer</p>',
  dica: 'Dica contextual (não a resposta)',
  inicial: go`código inicial com TODOs`,
  solucao: go`solução completa`,
  testes: [{ entrada: '', saida: 'saída esperada' }],
})
```

### Critérios de dificuldade
- **Fácil**: sintaxe direta, um conceito, sem combinações
- **Médio**: combina 2+ conceitos, requer raciocínio
- **Difícil**: padrões complexos, múltiplas camadas, otimização

---

## 7. O Que Fica para o Builder Decidir

- Ordem exata dos exercícios dentro de cada módulo
- Textos específicos de enunciados, dicas e soluções
- Casos de teste ocultos (além dos visíveis)
- Integração do estilo request.http no terminal (comando customizado ou extensão)
- Se exercícios de nuvem usam mocks ou contas sandbox reais
- Ritmo de introdução de conceitos (um por exercício vs combinados)

---

## 8. Anti-goals (O Que NÃO É Esta Trilha)

- Não é um curso de DevOps/infraestrutura (sem Docker, K8s, CI/CD)
- Não é um tutorial de frontend (Go é backend)
- Não cobre frameworks web de terceiros (Gin, Echo, Fiber) — só stdlib
- Não é referência completa da linguagem (foca no que importa para APIs e entrevistas)
- Não substitui documentação oficial (linka para ela quando relevante)