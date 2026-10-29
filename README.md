# 🐹 DivergeGo

Trilha de exercícios no estilo LeetCode para aprender **Go → Web → Concorrência → Projetos** na prática.
O compilador e os testes rodam **simulados dentro do navegador**: `go run`, `go test` e `go vet` com a
mesma saída do Go de verdade, mas **sem instalar nada, sem servidor e sem configuração**.
O site é estático e fica no GitHub Pages.

**Acesse:** https://sertaoseracloud.github.io/go-playground/

**Acessível para todas as pessoas.** O nome vem de *neurodivergente*: a plataforma foi feita para pessoas cegas (o leitor de tela fala o resultado de cada teste), surdas e mudas (nada depende de som ou de voz, com tradução para Libras pelo VLibras) e neurodivergentes (perfis para TDAH, dislexia, autismo e ansiedade). A meta é a WCAG 2.2 nível AA, conferida com o axe-core a cada versão. Detalhes na página **Acessibilidade** do site (`#/acessibilidade`).

## O que tem

- **Landing page** (`#/`): apresenta o projeto, a trilha, os certificados e os recursos de
  acessibilidade. Os números (exercícios, módulos, projetos) vêm do próprio conteúdo. A trilha fica
  em `#/trilha`, e quem já começou vê "▶ Continuar" no topo.
- **300 exercícios** com dificuldade Fácil/Médio/Difícil, mais **lições** de conceito no começo de cada assunto:
  1. **Fundamentos de Go** (50): sintaxe, tipos, funções, pacotes, estruturas, interfaces, tratamento de erros, `defer`, `panic/recover`, ponteiros e slices.
  2. **Web e APIs** (55): `net/http`, roteamento, templates HTML, middleware, autenticação JWT, APIs REST, upload de arquivos, CORS e rate limiting.
  3. **Concorrência** (55): goroutines, WaitGroups, channels, `select`, padrões de concorrência (worker pool, fan-in/fan-out), `context`, cancelamento e race detector.
  4. **Tópicos Avançados** (50): generics, reflection, CGO, profiling, benchmarking, arquitetura limpa e testes de integração.
  5. **🏗️ Módulo extra: Projetos**: 8 aplicações completas construídas em **etapas encadeadas**
     (40 etapas). Cada etapa cria um arquivo `.go` novo, e o código de partida é o **código do próprio
     aluno** na etapa anterior (ou a referência, se ele não a resolveu):

  | Projeto | Destaques |
  | --- | --- |
  | 🛠️ CLI Tool | Flags, leitura de stdin, saída colorida, testes de aceitação |
  | 🌐 Servidor Web | Roteamento manual, templates, sessões, upload de arquivos |
  | ⚡ API REST | CRUD com SQLite, validação, documentação Swagger, testes de integração |
  | 🔄 Processador Paralelo | Worker pool, canais, context, monitoramento de memória |
  | 📦 Microserviço | gRPC, protobufs, descoberta de serviços, logs estruturados |
  | 🧩 Biblioteca Genérica | Generics, constraints, benchmarks, fuzzing |
  | 🌎 Integrador Externo | HTTP client resiliente, retry, circuit breaker, mocks |
  | 🔐 Ferramenta de Segurança | Criptografia, hashing, análise de vulnerabilidades em código |

- **Como no LeetCode**: **▶ Testar** roda os casos visíveis; **⬆ Enviar** roda todos, inclusive os
  **casos ocultos** (outras entradas, edge cases). Resposta fixa no código não passa.
- **👨‍🏫 Quem é o instrutor?** (`#/instrutor` e seção na landing): perfil de Cláudio Filipe Lima Rapôso
  (atuação, reconhecimentos, certificações e formação), com a foto servida pelo próprio site
  (`public/instrutor.webp`). Os dados ficam em `src/instrutor.js`, sem telefone nem endereço.
- **☕ Apoie o projeto** (`#/apoie`): PIX de qualquer valor para a conta PicPay do instrutor, por **QR Code**
  ou **copia e cola** (com botão de copiar). O código segue o BR Code do Banco Central (campos EMV e
  CRC16) e é montado no navegador por `src/apoio.js`; o QR Code sai da biblioteca `qrcode-generator` (MIT).
  A chave fica em `PIX.chave`: sem ela, o apoio aparece como "em breve".
- **Casos de teste detalhados** (aba 🧪 Testes): cada caso mostra o **cenário** como linha de comando
  (`go test -run TestExercicio`, `go vet`), o placar e o tempo;
  cada verificação mostra a **categoria** (Compilação, Output, Cobertura...), o valor **obtido** e, quando falha, o **motivo** e uma
  **💡 dica** de onde mexer. Antes de rodar, o caso lista o que vai conferir. Nos ocultos, os valores ficam
  escondidos e só aparece o que falhou. Os detalhes saem de `detalharRegra` em `src/verificacoes.js`.
- **Terminal simulado, com movimento de terminal de verdade**: o comando é digitado no prompt
  (`aluno@sertao:~/exercicio$`), o primeiro `go run` baixa dependências (se houver), e o `go test`
  mostra a saída padrão do Go (`ok`, `FAIL`, `--- PASS`, `--- FAIL`).
  **⏩ Pular** (ou `Esc`) mostra tudo na hora, e com **Reduzir animações** a saída aparece de uma vez.
  O ritmo de cada linha vem de `src/tf/saida.js`, e a animação, de `src/ui/terminal.js`.
- **Terminal interativo** (`src/tf/comandos.js`): o prompt aceita `go run`, `go test [-v]`,
  `go vet`, `go fmt`, `go mod tidy`, além de `ls`, `cat`, `clear` e `help`. Teclas: ↑/↓ histórico, Tab
  completa, Ctrl+C cancela, Ctrl+L limpa, Esc pula a animação ou sai do terminal. Os botões ▶ Testar e ✔ Enviar digitam o comando.
- **Abas de saída**: 🖥️ Terminal, 📊 **Cobertura** (visualização de linhas cobertas) e 📤 **Outputs**. O estado de cada exercício fica salvo no navegador.
- **Aba 📘 Docs**: documentação da biblioteca padrão usada em cada exercício (funções, structs, interfaces).
- **Playground livre** (`#/livre`) com vários arquivos e pastas de módulos.
- **♿ Acessibilidade**: temas Dracula, Alto contraste, Claro e Suave; tamanho do texto (87,5% a 175%,
  editor incluído); fonte Atkinson Hyperlegible; mais espaçamento; links sublinhados e foco reforçado;
  reduzir animações; **🔊 Ouvir** o enunciado; atalhos de teclado; "Pular para o conteúdo";
  rótulos e regiões `aria-live` para leitores de tela.
- **🧠 Neurodiversidade** (recomendações do W3C para acessibilidade cognitiva, COGA): perfis rápidos
  (🎯 Foco, 📖 Leitura facilitada, 🌿 Calmo, 🤝 Sem pressão), modo foco, lista de tarefas com caixas de
  marcar, régua de leitura, linhas curtas e lembrete de pausa.
- **Instruções com estrutura previsível**: todo desafio mostra um roteiro curto, 🎯 **O que fazer**
  em lista, 📚 **Palavras técnicas** (até 6 termos com explicação simples, **analogia do dia a dia** e
  exemplo; glossário em `src/conteudo/glossario.js`), ✅ **Como saber que deu certo** e 💡 Dica.
- **❓ Tutorial** passo a passo, **progresso** por módulo e **compartilhar** com o código no link.

### Trilha gamificada e certificados

- A trilha (`#/trilha`) é um **caminho** em zigue-zague. Lição vale 5 XP, fácil 10, médio 20 e difícil 40.
  O aluno sobe de **nível** (Iniciante → Mestre do Go) e ganha uma **sequência de dias** 🔥.
- O próximo módulo **desbloqueia quando o atual chega a 70%**.
- Ao concluir 100% de um módulo, o 🏆 libera o **certificado do módulo**; com todos, o 🎓 libera o
  **certificado final**. Os certificados são emitidos pela **Sertão será cloud** e assinados por
  **Cláudio Raposo**, com **badge digital no estilo Credly** e botões para **publicar no LinkedIn** e
  **adicionar ao perfil**.
- **Carga horária**: cada atividade tem um tempo estimado (lição 10 min, fácil 15, médio 30, difícil
  45), mostrado no exercício. O certificado de cada módulo vale a soma, arredondada para cima em horas e
  com o mínimo de 1 hora; o final soma os módulos. As horas ficam fixas em
  `src/certificados.js` (não entram no selo, então certificados antigos continuam válidos) e
  `tests/carga-horaria.test.js` avisa quando o conteúdo mudar. A regra fica em `src/cargaHoraria.js`.
- **Selo de verificação** (HMAC-SHA256) e **cadeia de certificados**: cada certificado inclui no selo o hash do anterior, então mudar uma data ou um
  nome em qualquer ponto quebra os seguintes.
- **🔎 Validador** (`#/validar`): três abas (link ou código, impresso/PDF e arquivo XML). Quem abre um
  link de validação vê o resultado primeiro, com o badge, os dados e a cadeia como linha do tempo.
  As cores separam "válido" (verde), "alterado" (vermelho), "não consegui ler / faltam dados" (âmbar)
  e "link antigo" (ciano), e mudar o texto apaga o resultado anterior.
- **↩️ Restaurar o progresso pelo certificado**: ao validar um certificado válido pelo link ou código,
  quem tem neste navegador o **mesmo nome** do certificado (acentos e maiúsculas contam) restaura o
  módulo e os anteriores da cadeia, nas datas do certificado. O certificado emitido de novo é o mesmo;
  nada do que já está no navegador é apagado (`src/restaurar.js`).
- **🗺️ Cenários da trilha**: cada módulo tem um mapa em tiles de pixel art (como nos RPGs clássicos) que ocupa a
  tela toda e rola junto com a página, com uma estrada que faz curvas pelos exercícios e uma vila que cresce a
  cada exercício resolvido (casas, filhos e filhotes, calculados do progresso, sem nada a mais no navegador), com o
  tema do assunto, com personagens andando de tile em tile, sem pisar na água nem no caminho (`src/ui/cenarios/`). É só decoração:
  o leitor de tela não lê, e os personagens param com "reduzir movimento" e no alto contraste.
- **📄 XML do certificado** e **✍️ assinatura Ed25519** com a chave pública em `chave-publica-ed25519.txt`.
- **A palavra secreta nunca entra no código nem no site.** Ela fica no secret
  `CERTIFICADO_SEGREDO` do GitHub Actions; o build injeta só um valor derivado dela
  (`vite.config.js`) e falha se o secret não existir. Para gerar o build localmente:
  `CERTIFICADO_SEGREDO='...' npm run build`. Trocar a palavra invalida os selos já emitidos.
- **Limite:** sem servidor, a chave derivada vai no JavaScript do site. O selo pega alterações no
  link, mas quem estudar o código publicado consegue gerar selos.

Cada badge tem uma página estática em `public/badge/<módulo>/` com as meta tags `og:` para a prévia do
LinkedIn. Esses arquivos, a capa `og-capa.png` e os ícones saem de `src/badges.js` e `src/certificados.js`;
depois de mudar um deles, rode `npm run badges` e faça commit de `public/`.

### Privacidade, cookies e LGPD

A página **🔒 Privacidade** (`#/privacidade`) explica como os dados são tratados:

- **Sem cookies e sem rastreamento**: não há analytics, anúncios nem servidor próprio.
- **Dados só no navegador** (`localStorage`, prefixo `go-playground:`): progresso, datas, dias
  de estudo, nome do certificado, código, estado simulado de cada exercício e preferências. A tabela
  completa fica em [`src/privacidade.js`](src/privacidade.js), e um teste falha se o código passar a
  gravar uma chave que não está documentada.
- **Nada vai para fora**: o simulador não faz chamadas de rede e não pede credenciais.
- **LGPD**: finalidade, base legal do nome (consentimento), direitos do art. 18 com
  **📥 Baixar meus dados** e **🗑️ Apagar meus dados**, e cuidado com menores (art. 14).

## O simulador

```
Editor (CodeMirror, Go) ──arquivos .go──▶ parser simplificado + type checker
                                                                      │
             bibliotecas padrão simuladas (fmt, net/http, testing...)
                                                                      ▼
   terminal / cobertura / outputs ◀── run → test → vet ──▶ regras dos testes
```

- [`src/tf/lexer.js`](src/tf/lexer.js) e [`src/tf/parser.js`](src/tf/parser.js): Parser de Go simplificado.
- [`src/tf/funcoes.js`](src/tf/funcoes.js): Funções comuns da biblioteca padrão.
- [`src/tf/esquema/`](src/tf/esquema/): Definições de structs e interfaces usadas nos exercícios.
- [`src/tf/motor.js`](src/tf/motor.js): Simulação de execução, testes e geração de cobertura.

**Importante:** é um simulador para aprender. Ele não substitui o Go de verdade nem cobre
todas as bibliotecas. Antes de criar sistemas reais, teste num ambiente controlado.

## Como adicionar conteúdo

Cada módulo fica num arquivo em [`src/conteudo/`](src/conteudo/) (`basico.js`, `web.js`, etc.), com uma lista `itens` de lições e problemas, na ordem em que aparecem. Escreva o Go com a
tag `` go`...` ``.

Um problema tem `enunciado`, `dica`, `dificuldade`, `inicial`, `solucao` e `testes`. Cada teste pode
trocar o comando (`comando: 'test'`) e ser oculto (`oculto: true`). As regras ficam documentadas em
[`src/verificacoes.js`](src/verificacoes.js).

Os testes do projeto rodam **toda a trilha** no simulador: as lições não têm erros, cada solução passa
em todos os casos e cada código inicial ainda não passa.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local com recarga
npm run lint     # ESLint
npm test         # testes (motor, regras e toda a trilha)
npm run test:cobertura  # os mesmos testes, com o limite de cobertura
npm run build    # gera dist/ (precisa de CERTIFICADO_SEGREDO)
npm run test:e2e        # Playwright contra o dist (fluxo, axe nos 4 temas, larguras de celular)
npm run lighthouse      # Lighthouse CI contra o dist
npm run badges   # regenera badges, capa e ícones em public/
```

Para testar um build local sem o segredo de verdade:

```bash
CERTIFICADO_SEGREDO=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") npm run build
```

## Como publicar

O repositório segue o **gitflow**. Pense no `develop` como o ensaio geral e no `main` como a estreia:

- **`feature/*`**: cada mudança nasce de `develop` e volta para ele por PR (rebase). Em cada push,
  [`feature-pr.yml`](.github/workflows/feature-pr.yml) sobe a versão patch uma vez por versão-base e
  abre ou atualiza o PR automaticamente.
- **`develop`**: tudo o que já foi aceito. Cada push publica a **homologação** em
  <https://sertaoseracloud.github.io/go-playground/homologacao/>, com uma faixa de aviso,
  progresso guardado à parte (prefixo `go-playground-homologacao:`), outro segredo de
  certificado, `noindex` e sem `sitemap.xml`. É onde a versão é conferida no navegador antes de sair.
- **`release/*`**: sai de `develop` com a versão nova no `package.json` e entra no `main` por PR
  (merge commit). Cada push no `main` publica o site principal e cria a tag `v<versão>`, se ela
  ainda não existir. Depois, um PR de `main` para `develop` traz a release de volta.
- **`hotfix/*`**: correção urgente que sai do `main` e entra nele do mesmo jeito.

`main` e `develop` só recebem PR, com os checks verdes. Os workflows:

- [`testes.yml`](.github/workflows/testes.yml): em todo PR. Lint sem avisos, testes com limite de
  cobertura, `npm audit`, E2E no Chromium e Lighthouse bloqueiam. Firefox, WebKit e celular só informam.
- [`deploy.yml`](.github/workflows/deploy.yml): em cada push no `main` ou no `develop`. Roda os
  testes, monta o principal (do `main`) na raiz e a homologação (do `develop`) em `/homologacao/`,
  confere os dois com `scripts/conferir-build.mjs`, publica e testa os dois endereços no ar. Só
  depois do smoke test verde cria a tag de produção ou abre o PR de `develop` para `main`.
- [`auditoria-semanal.yml`](.github/workflows/auditoria-semanal.yml): Lighthouse no site no ar todo domingo.

Secrets do GitHub Actions (Settings > Secrets > Actions), gerados aleatoriamente e que ninguém conhece:
`CERTIFICADO_SEGREDO` (site principal) e `CERTIFICADO_SEGREDO_HOMOLOGACAO` (homologação).
Configure também `FEATURE_PR_TOKEN` com acesso de escrita a Contents e Pull requests para que o
workflow crie a PR e os checks de PR sejam disparados.

## Licença

O DivergeGo é **software livre com copyleft**:

- **Código**: [GNU AGPL-3.0-or-later](LICENSE).
- **Conteúdo didático** (lições, exercícios, projetos, glossário): [CC BY-SA 4.0](LICENSE-CONTEUDO.md).
  Crédito sugerido: "DivergeGo, Sertão será cloud (CC BY-SA 4.0)".
- **Fora da licença**: o nome, a marca e o logotipo da Sertão será cloud e a emissão de certificados
  em nome dela.

**Marcas**: Go e Gopher são marcas da Google LLC. Este projeto é independente e não é afiliado nem endossado por elas.

Copyright (C) 2026 Sertão será cloud.