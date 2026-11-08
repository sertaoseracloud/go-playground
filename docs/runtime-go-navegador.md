# Go de verdade no navegador

Relatório da troca do "compilador" do app (`src/go/compiler-browser.js`). Até aqui ele era um tradutor de um subconjunto de Go para JavaScript feito com expressões regulares. Ele não aguentava maps, goroutines e canais, `net/http`/`httptest`, genéricos, `encoding/json` nem `sort`, e a maioria dos 309 exercícios da trilha não rodava no app, mesmo com a solução correta.

**Recomendação (implementada):** o interpretador [yaegi](https://github.com/traefik/yaegi), compilado junto com a biblioteca padrão real do Go para `GOOS=js GOARCH=wasm` e rodando num Web Worker.

## Resultado

| Medida | Valor |
| --- | --- |
| Exercícios da trilha que passam no runtime do navegador | **309 de 309** (com os contornos de [Bugs do yaegi e contornos](#bugs-do-yaegi-e-contornos)) |
| Download | 27,9 MB sem compressão · **6,1 MB com gzip** · 4,3 MB com brotli |
| Primeira execução | download + compilação do wasm (cerca de 2,4 s com o arquivo já em cache, num notebook comum) |
| Execuções seguintes | 20 a 300 ms por envio, contando todos os casos de teste |
| Offline | sim: depois do primeiro download, o `.wasm` e o `wasm_exec.js` ficam no Cache Storage |
| stdin | sim: `entrada` dos casos chega em `os.Stdin`, `bufio.Scanner` e `fmt.Scan` |
| Goroutines, canais, `select`, `sync`, `time.Sleep` | sim, com o escalonador real do Go |
| `net/http/httptest` | sim: `NewRecorder` e também `NewServer` + `http.Get`, numa rede em memória |
| Laço infinito ou deadlock | o worker é encerrado depois de 10 s e recriado; a página não trava |

Os 35 exercícios de Web, que usam `net/http` e `httptest`, passam. A trilha inteira roda em cerca de 12 s no Node com `npm run validar:wasm`.

## Opções comparadas

| Opção | Download | Início | goroutines / httptest | Offline | Veredito |
| --- | --- | --- | --- | --- | --- |
| **yaegi em WASM** (medido) | 6,1 MB gzip | ~2 s na 1ª vez, depois ~0,1 s por execução | sim / sim (`NewServer` numa rede em memória) | sim | **escolhida** |
| Toolchain oficial (`cmd/compile` + `cmd/link`) em WASM | estimado em dezenas de MB: compilador e linker em wasm, mais a biblioteca padrão pré-compilada para js/wasm (`net/http` puxa `crypto/tls` e outros) | estimado em vários segundos por execução (compilar e linkar em wasm) | sim / sim (fidelidade total) | sim | não medida: pesada demais para cada envio e exige simular um sistema de arquivos para o compilador |
| TinyGo em WASM | — | — | parcial / não (`net/http` limitado, `reflect` e `encoding/json` incompletos) | — | inviável: o compilador do TinyGo depende do LLVM nativo e não roda no navegador; sobraria compilar num servidor |
| Serviço de execução (Go Playground ou servidor próprio) | ~0 | latência de rede a cada envio | sim / sim | **não** | o Go Playground público não aceita stdin e tem limite de uso; um servidor próprio custa infraestrutura, precisa isolar código de terceiros e contraria a promessa do app ("seu código fica salvo só neste navegador") |

A opção da toolchain oficial foi descartada pela estimativa, sem protótipo. Se a fidelidade total ao `go build` passar a valer mais que o tempo de resposta, vale medir.

## Como funciona

```
item.js ──compilarGo/executarGo──▶ compiler-browser.js ──postMessage──▶ go-worker.js
                                    (fila, limite de 10 s)               (Cache Storage, wasm_exec.js)
                                                                              │
                                                                              ▼
                                                                public/go/divergego.wasm
                                                                (go-wasm/main.go: yaegi + stdlib)
```

- **`go-wasm/`**: o programa Go que embute o yaegi.
  - `main.go` (só js/wasm) expõe `__divergeGoCompilar(arquivos)` e `__divergeGoRodar(arquivos, stdin)`. O cliente HTTP padrão disca na rede em memória do Go para js/wasm, e por isso `httptest.NewServer` funciona sem sair da aba.
  - `executar.go` monta um interpretador novo a cada execução, com stdin, stdout e stderr em memória (stdout limitado a 1 MB). `os.Exit` vira um panic tratado, para não encerrar o runtime.
  - `ajustes.go` tem os contornos dos bugs do yaegi (veja abaixo).
  - `nativo.go` é uma linha de comando para depurar fora do navegador, com o mesmo interpretador: `cd go-wasm && go run . main.go < entrada.txt`.
  - `executar_test.go` cobre cada contorno: `cd go-wasm && go test .`.
- **`scripts/construir-go-wasm.mjs`** (`npm run go:wasm`): monta `go-wasm/simbolos/` só com os pacotes da biblioteca padrão listados em `PACOTES` (a stdlib inteira deixaria o wasm com 39,6 MB) e compila `public/go/divergego.wasm`. Copia também o `wasm_exec.js` do mesmo Go e grava `versao.txt`, um hash que vai no `?v=` das URLs e invalida o cache a cada versão nova. Os dois diretórios gerados ficam fora do Git.
- **`predev` / `prebuild`**: geram o runtime se ele não existir. No `dev`, a falta do Go só gera um aviso. No `build`, falha. O CI instala o Go com `actions/setup-go` antes do build.
- **`src/go/go-worker.js`**: baixa, guarda em cache e instancia o wasm. Se um panic numa goroutine derrubar o runtime, devolve o `panic: ...` e recria a instância.
- **`src/go/compiler-browser.js`**: a interface de sempre. `compilarGo` confere o programa sem executar e devolve `{ js, erros }`; `js` agora é um pacote opaco com os arquivos. `executarGo(js, stdin)` roda e devolve `{ stdout, stderr, exitCode, ms }`. Erros e panics saem no formato do Go: `./main.go:4:14: undefined: y` e `panic: ...` seguido da pilha.
- **`scripts/validar-go-wasm.mjs`** (`npm run validar:wasm`): roda as soluções da trilha no mesmo wasm, pelo Node. Complementa o `validar-exercicios.mjs`, que usa o Go nativo.

Também saiu do `item.js` uma leitura do código direto do DOM do CodeMirror (`.cm-content`). O CodeMirror só desenha as linhas visíveis, então em programas longos o texto lido vinha sem as últimas linhas. Agora o código vem de `editor.arquivos`, que o editor atualiza a cada mudança.

## Bugs do yaegi e contornos

O yaegi v0.16.3 é a versão mais recente (de 05/11/2026). A trilha esbarrava em 8 bugs dele, e todos se repetem com o yaegi nativo, fora do wasm. Como o aluno escreve o mesmo tipo de código, o contorno fica no runtime sempre que dá. Antes de entregar o código ao yaegi, `go-wasm/ajustes.go` reescreve a árvore sintática: o programa faz a mesma coisa e as linhas não mudam, então as mensagens de erro continuam apontando a linha certa.

| Construção | Sintoma no yaegi | Contorno |
| --- | --- | --- |
| `for` com corpo vazio (`for i := 0; i < n; i++ {}`, `for range s {}`) | **pula tudo o que vem depois na função**, sem erro | runtime: o corpo ganha um `_ = 0` |
| `return <-ch` | `reflect.Value.Set using unaddressable value` | runtime: `{ _dg1 := <-ch; return _dg1 }` |
| `len`/`cap`/`append` direto num resultado que não é o primeiro (`return t, len(x)`) | grava no resultado errado (`SetInt on slice Value`); com `append`, devolve o slice antigo sem erro | runtime: o valor vai para uma variável antes do `return` |
| `for _, c := range canais`, com `canais` um slice de canais | `reflect: call of reflect.Value.Len on int Value` | runtime, quando o tipo `[]chan T` / `...<-chan T` está escrito na declaração: o laço passa a usar o índice |
| `errors.As(err, &ev)` com `ev *TipoDoAluno` | `*target must be interface or implement error` | runtime: `errors.As` próprio, que entende os tipos do programa |
| `fmt.Errorf("%w", &MeuErro{})`, `fmt.Println(&MeuErro{})` | `%!w(...)`; `Error()` não é chamado | runtime: `error` entra na tabela de interfaces que o yaegi preserva ao chamar o `fmt` |
| Função genérica com 2+ parâmetros de tipo inferidos (`Mapear(nomes, f)`) | infere `U` igual a `T` (`cannot use func(string) int as func(string) string`) | exercício: o `main` usa instanciação explícita, `Mapear[string, int](...)` |
| `fmt.Println(f())` com várias saídas, uma delas com `String()` | ignora o `String()` (`{1345 BRL}`) | exercício: `soma, err := a.Somar(b)` e depois `fmt.Println(soma, err)` |

Cada contorno do runtime tem um caso em `go-wasm/executar_test.go`. Quando uma versão nova do yaegi corrigir um bug, basta tirar o contorno e ver o teste continuar passando. Os dois últimos bugs ficam no interpretador do yaegi, e só um fork resolveria. O aluno ainda pode esbarrar neles com código próprio:

- **genéricos:** se a inferência falhar, escreva os tipos (`F[string, int](...)`);
- **várias saídas no `Println`:** guarde as saídas em variáveis antes de imprimir.

A lista `CONHECIDOS` em `scripts/validar-go-wasm.mjs` existe para um exercício que esbarre num bug sem contorno. Hoje ela está vazia.

## Limitações

- o yaegi não conhece os builtins `min` e `max` do Go 1.21 (`undefined: min`);
- o yaegi não acusa variável declarada e não usada, que o `go build` rejeita. O validador nativo continua pegando isso nos exercícios;
- passar um tipo do programa direto para um parâmetro `...error` da biblioteca padrão (`errors.Join(e1, &MeuErro{})`) falha; com uma variável `error` no meio funciona.

**Outras diferenças em relação ao `go run`:**

- é um interpretador: laços pesados de CPU rodam bem mais devagar que o binário compilado. Nos exercícios da trilha isso não aparece;
- os pacotes disponíveis são os de `PACOTES` em `scripts/construir-go-wasm.mjs`. Os símbolos da biblioteca padrão são os da API do Go 1.22 que o yaegi gera; recursos posteriores (como `range` sobre funções) podem faltar;
- `os.Stdin` e `os.Stdout` são um `io.Reader` e um `io.Writer`, não `*os.File` (`os.Stdin.Stat()` não compila);
- um deadlock aparece como "Tempo esgotado" depois de 10 s, não como `all goroutines are asleep`;
- um panic numa goroutine que não é a principal reinicia o runtime, e a mensagem mostra só a linha `panic: ...`.

## Mudanças em exercícios e no terminal

- `estruturas-prob-generico-map-filter`: o `main` (inicial e solução) usa `Mapear[string, string]` e `Mapear[string, int]`, e o enunciado explica a instanciação explícita.
- `arquitetura-prob-objeto-valor`: o `main` guarda o resultado de `Somar` e `NovoDinheiro` em variáveis antes do `Println`. A saída é a mesma.
- `nuvem-prob-storage-list`: as chaves vinham de um `map` sem ordenar, então o exercício passava ou falhava por sorte, no Go nativo e no navegador. O enunciado agora pede ordem alfabética, a dica cita `sort.Strings` e a solução ordena.
- O `go version` do terminal dizia `go1.22.0 js/wasm (simulado no navegador)`; agora diz que é Go no navegador, pelo yaegi em WebAssembly.
