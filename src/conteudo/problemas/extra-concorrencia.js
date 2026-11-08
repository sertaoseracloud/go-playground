// Exercícios extras do módulo concorrencia. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraConcorrencia = [
  problema({
    id: 'concorrencia-prob-waitgroup-soma',
    titulo: "Somando em goroutines",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>somaParalela(partes)</code>: some cada parte numa goroutine, guardando o resultado em <code>parciais[i]</code>, espere todas com <code>sync.WaitGroup</code> e devolva o total.</p>",
    dica: "<code>wg.Add(1)</code> antes de cada <code>go func(i int) { defer wg.Done(); ... }(i)</code> e <code>wg.Wait()</code> no fim.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sync".

func somaParalela(partes [][]int) int {
  // TODO: implemente
  return 0
}

func main() {
  fmt.Println(somaParalela([][]int{{1, 2, 3}, {4, 5}, {6, 7, 8, 9}}))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sync"
)

func somaParalela(partes [][]int) int {
  parciais := make([]int, len(partes))
  var wg sync.WaitGroup
  for i, p := range partes {
    wg.Add(1)
    go func(i int, p []int) {
      defer wg.Done()
      for _, v := range p {
        parciais[i] += v
      }
    }(i, p)
  }
  wg.Wait()
  total := 0
  for _, s := range parciais {
    total += s
  }
  return total
}

func main() {
  fmt.Println(somaParalela([][]int{{1, 2, 3}, {4, 5}, {6, 7, 8, 9}}))
}
`,
    testes: [{ saida: "45" }],
  }),
  problema({
    id: 'concorrencia-prob-mutex-real',
    titulo: "Contador protegido por Mutex",
    dificuldade: 'facil',
    enunciado: "<p>Mil goroutines chamam <code>Inc()</code> ao mesmo tempo. Implemente <code>Inc</code> protegendo o campo com o <code>sync.Mutex</code>, para o total sair sempre 1000.</p>",
    dica: "<code>c.mu.Lock()</code>, <code>defer c.mu.Unlock()</code>, <code>c.n++</code>.",
    inicial: go`
package main

import (
  "fmt"
  "sync"
)

type Contador struct {
  mu sync.Mutex
  n  int
}

func (c *Contador) Inc() {
  // TODO: implemente
}

func main() {
  c := &Contador{}
  var wg sync.WaitGroup
  for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func() {
      defer wg.Done()
      c.Inc()
    }()
  }
  wg.Wait()
  fmt.Println(c.n)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sync"
)

type Contador struct {
  mu sync.Mutex
  n  int
}

func (c *Contador) Inc() {
  c.mu.Lock()
  defer c.mu.Unlock()
  c.n++
}

func main() {
  c := &Contador{}
  var wg sync.WaitGroup
  for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func() {
      defer wg.Done()
      c.Inc()
    }()
  }
  wg.Wait()
  fmt.Println(c.n)
}
`,
    testes: [{ saida: "1000" }],
  }),
  problema({
    id: 'concorrencia-prob-canal-gerador',
    titulo: "Gerador com canal",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>gerar(n)</code>: devolva um canal que recebe os números de 1 a <code>n</code> e depois é <b>fechado</b>, para o <code>range</code> do <code>main</code> terminar.</p>",
    dica: "Crie o canal, dispare uma goroutine que envia e chama <code>close(ch)</code>, e devolva o canal.",
    inicial: go`
package main

import "fmt"

func gerar(n int) <-chan int {
  // TODO: implemente
  return func() chan int { ch := make(chan int); close(ch); return ch }()
}

func main() {
  for v := range gerar(5) {
    fmt.Print(v, " ")
  }
  fmt.Println()
}
`,
    solucao: go`
package main

import "fmt"

func gerar(n int) <-chan int {
  ch := make(chan int)
  go func() {
    defer close(ch)
    for i := 1; i <= n; i++ {
      ch <- i
    }
  }()
  return ch
}

func main() {
  for v := range gerar(5) {
    fmt.Print(v, " ")
  }
  fmt.Println()
}
`,
    testes: [{ saida: "1 2 3 4 5" }],
  }),
  problema({
    id: 'concorrencia-prob-pipeline-canais',
    titulo: "Pipeline com canais",
    dificuldade: 'medio',
    enunciado: "<p>Implemente o estágio <code>quadrados(entrada)</code>: leia cada número do canal de entrada e envie o quadrado num canal de saída, que deve ser fechado quando a entrada acabar.</p>",
    dica: "Dentro da goroutine: <code>for v := range entrada { saida &lt;- v * v }</code> e depois <code>close(saida)</code>.",
    inicial: go`
package main

import "fmt"

func numeros(vs ...int) <-chan int {
  ch := make(chan int)
  go func() {
    defer close(ch)
    for _, v := range vs {
      ch <- v
    }
  }()
  return ch
}

func quadrados(entrada <-chan int) <-chan int {
  // TODO: implemente
  return func() chan int { ch := make(chan int); close(ch); return ch }()
}

func main() {
  for v := range quadrados(quadrados(numeros(1, 2, 3, 4))) {
    fmt.Println(v)
  }
}
`,
    solucao: go`
package main

import "fmt"

func numeros(vs ...int) <-chan int {
  ch := make(chan int)
  go func() {
    defer close(ch)
    for _, v := range vs {
      ch <- v
    }
  }()
  return ch
}

func quadrados(entrada <-chan int) <-chan int {
  saida := make(chan int)
  go func() {
    defer close(saida)
    for v := range entrada {
      saida <- v * v
    }
  }()
  return saida
}

func main() {
  for v := range quadrados(quadrados(numeros(1, 2, 3, 4))) {
    fmt.Println(v)
  }
}
`,
    testes: [{ saida: "1\n16\n81\n256" }],
  }),
  problema({
    id: 'concorrencia-prob-worker-pool-real',
    titulo: "Worker pool de verdade",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>processar(tarefas, workers)</code>: suba <code>workers</code> goroutines que leem do canal <code>jobs</code> e mandam <code>tarefa*10</code> para <code>resultados</code>.</p>\n<p>Como a ordem de chegada varia, o <code>main</code> ordena os resultados antes de imprimir.</p>",
    dica: "Encha e feche <code>jobs</code>; use um <code>WaitGroup</code> para fechar <code>resultados</code> quando todos os workers terminarem.",
    inicial: go`
package main

import (
  "fmt"
  "sort"
)

// Dica: você vai precisar importar "sync".

func processar(tarefas []int, workers int) []int {
  // TODO: implemente
  return nil
}

func main() {
  r := processar([]int{5, 3, 8, 1, 9, 2}, 3)
  sort.Ints(r)
  fmt.Println(r)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
  "sync"
)

func processar(tarefas []int, workers int) []int {
  jobs := make(chan int)
  resultados := make(chan int)
  var wg sync.WaitGroup
  for w := 0; w < workers; w++ {
    wg.Add(1)
    go func() {
      defer wg.Done()
      for t := range jobs {
        resultados <- t * 10
      }
    }()
  }
  go func() {
    for _, t := range tarefas {
      jobs <- t
    }
    close(jobs)
  }()
  go func() {
    wg.Wait()
    close(resultados)
  }()
  out := []int{}
  for r := range resultados {
    out = append(out, r)
  }
  return out
}

func main() {
  r := processar([]int{5, 3, 8, 1, 9, 2}, 3)
  sort.Ints(r)
  fmt.Println(r)
}
`,
    testes: [{ saida: "[10 20 30 50 80 90]" }],
  }),
  problema({
    id: 'concorrencia-prob-select-primeiro',
    titulo: "Select: quem responde primeiro",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>primeiro(a, b)</code>: com <code>select</code>, devolva a mensagem do canal que estiver pronto. No <code>main</code>, só um dos canais recebe algo em cada chamada.</p>",
    dica: "<code>select { case m := &lt;-a: return m; case m := &lt;-b: return m }</code>.",
    inicial: go`
package main

import "fmt"

func primeiro(a, b <-chan string) string {
  // TODO: implemente
  return ""
}

func main() {
  a := make(chan string, 1)
  b := make(chan string, 1)
  a <- "servidor A"
  fmt.Println(primeiro(a, b))
  b <- "servidor B"
  fmt.Println(primeiro(a, b))
}
`,
    solucao: go`
package main

import "fmt"

func primeiro(a, b <-chan string) string {
  select {
  case m := <-a:
    return m
  case m := <-b:
    return m
  }
}

func main() {
  a := make(chan string, 1)
  b := make(chan string, 1)
  a <- "servidor A"
  fmt.Println(primeiro(a, b))
  b <- "servidor B"
  fmt.Println(primeiro(a, b))
}
`,
    testes: [{ saida: "servidor A\nservidor B" }],
  }),
  problema({
    id: 'concorrencia-prob-select-default',
    titulo: "Envio sem bloquear",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>tentarEnviar(ch, v)</code>: envie <code>v</code> se houver espaço no canal e devolva <code>true</code>; se o canal estiver cheio, devolva <code>false</code> <b>sem bloquear</b>.</p>",
    dica: "Um <code>select</code> com <code>default</code> nunca bloqueia: <code>select { case ch &lt;- v: return true; default: return false }</code>.",
    inicial: go`
package main

import "fmt"

func tentarEnviar(ch chan int, v int) bool {
  // TODO: implemente
  return false
}

func main() {
  fila := make(chan int, 2)
  for i := 1; i <= 4; i++ {
    fmt.Println(i, tentarEnviar(fila, i))
  }
  fmt.Println(len(fila))
}
`,
    solucao: go`
package main

import "fmt"

func tentarEnviar(ch chan int, v int) bool {
  select {
  case ch <- v:
    return true
  default:
    return false
  }
}

func main() {
  fila := make(chan int, 2)
  for i := 1; i <= 4; i++ {
    fmt.Println(i, tentarEnviar(fila, i))
  }
  fmt.Println(len(fila))
}
`,
    testes: [{ saida: "1 true\n2 true\n3 false\n4 false\n2" }],
  }),
  problema({
    id: 'concorrencia-prob-contexto-cancelar',
    titulo: "Cancelando com context",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>contar(ctx, saida)</code>: envie 1, 2, 3, ... no canal <code>saida</code> até o contexto ser cancelado; então feche o canal.</p>\n<p>O <code>main</code> lê 4 números e cancela.</p>",
    dica: "No laço: <code>select { case &lt;-ctx.Done(): close(saida); return; case saida &lt;- n: n++ }</code>.",
    inicial: go`
package main

import (
  "context"
  "fmt"
)

func contar(ctx context.Context, saida chan<- int) {
  // TODO: implemente
  close(saida)
}

func main() {
  ctx, cancelar := context.WithCancel(context.Background())
  ch := make(chan int)
  go contar(ctx, ch)
  for i := 0; i < 4; i++ {
    fmt.Println(<-ch)
  }
  cancelar()
  for range ch {
  }
  fmt.Println("cancelado:", ctx.Err())
}
`,
    solucao: go`
package main

import (
  "context"
  "fmt"
)

func contar(ctx context.Context, saida chan<- int) {
  n := 1
  for {
    select {
    case <-ctx.Done():
      close(saida)
      return
    case saida <- n:
      n++
    }
  }
}

func main() {
  ctx, cancelar := context.WithCancel(context.Background())
  ch := make(chan int)
  go contar(ctx, ch)
  for i := 0; i < 4; i++ {
    fmt.Println(<-ch)
  }
  cancelar()
  for range ch {
  }
  fmt.Println("cancelado:", ctx.Err())
}
`,
    testes: [{ saida: "1\n2\n3\n4\ncancelado: context canceled" }],
  }),
  problema({
    id: 'concorrencia-prob-semaforo',
    titulo: "Limitando concorrência com semáforo",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>executar(tarefas, limite)</code>: rode cada tarefa numa goroutine, mas com no máximo <code>limite</code> rodando ao mesmo tempo. O <code>main</code> mede o pico de goroutines ativas.</p>",
    dica: "Um canal com buffer funciona como semáforo: <code>sem &lt;- struct{}{}</code> para entrar e <code>&lt;-sem</code> para sair.",
    inicial: go`
package main

import (
  "fmt"
  "sync/atomic"
)

// Dica: você vai precisar importar "sync".

func executar(tarefas []func(), limite int) {
  // TODO: implemente
}

func main() {
  var ativas, pico, feitas int64
  tarefa := func() {
    agora := atomic.AddInt64(&ativas, 1)
    for {
      p := atomic.LoadInt64(&pico)
      if agora <= p || atomic.CompareAndSwapInt64(&pico, p, agora) {
        break
      }
    }
    for i := 0; i < 100000; i++ {
    }
    atomic.AddInt64(&feitas, 1)
    atomic.AddInt64(&ativas, -1)
  }
  tarefas := make([]func(), 20)
  for i := range tarefas {
    tarefas[i] = tarefa
  }
  executar(tarefas, 3)
  fmt.Println("feitas:", feitas)
  fmt.Println("pico até 3:", pico <= 3 && pico >= 1)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sync"
  "sync/atomic"
)

func executar(tarefas []func(), limite int) {
  sem := make(chan struct{}, limite)
  var wg sync.WaitGroup
  for _, t := range tarefas {
    wg.Add(1)
    sem <- struct{}{}
    go func(t func()) {
      defer wg.Done()
      defer func() { <-sem }()
      t()
    }(t)
  }
  wg.Wait()
}

func main() {
  var ativas, pico, feitas int64
  tarefa := func() {
    agora := atomic.AddInt64(&ativas, 1)
    for {
      p := atomic.LoadInt64(&pico)
      if agora <= p || atomic.CompareAndSwapInt64(&pico, p, agora) {
        break
      }
    }
    for i := 0; i < 100000; i++ {
    }
    atomic.AddInt64(&feitas, 1)
    atomic.AddInt64(&ativas, -1)
  }
  tarefas := make([]func(), 20)
  for i := range tarefas {
    tarefas[i] = tarefa
  }
  executar(tarefas, 3)
  fmt.Println("feitas:", feitas)
  fmt.Println("pico até 3:", pico <= 3 && pico >= 1)
}
`,
    testes: [{ saida: "feitas: 20\npico até 3: true" }],
  }),
  problema({
    id: 'concorrencia-prob-once',
    titulo: "Inicialização única com sync.Once",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>configuracao()</code>: carregue a configuração (chamando <code>carregar()</code>) <b>uma única vez</b>, mesmo com 10 goroutines chamando ao mesmo tempo.</p>",
    dica: "<code>once.Do(func() { cfg = carregar() })</code> e devolva <code>cfg</code>.",
    inicial: go`
package main

import (
  "fmt"
  "sync"
  "sync/atomic"
)

var (
  once      sync.Once
  cfg       string
  carregou  int32
)

func carregar() string {
  atomic.AddInt32(&carregou, 1)
  return "região=sa-east-1"
}

func configuracao() string {
  // TODO: implemente
  return ""
}

func main() {
  var wg sync.WaitGroup
  for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
      defer wg.Done()
      configuracao()
    }()
  }
  wg.Wait()
  fmt.Println(configuracao())
  fmt.Println("carregamentos:", carregou)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sync"
  "sync/atomic"
)

var (
  once      sync.Once
  cfg       string
  carregou  int32
)

func carregar() string {
  atomic.AddInt32(&carregou, 1)
  return "região=sa-east-1"
}

func configuracao() string {
  once.Do(func() { cfg = carregar() })
  return cfg
}

func main() {
  var wg sync.WaitGroup
  for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
      defer wg.Done()
      configuracao()
    }()
  }
  wg.Wait()
  fmt.Println(configuracao())
  fmt.Println("carregamentos:", carregou)
}
`,
    testes: [{ saida: "região=sa-east-1\ncarregamentos: 1" }],
  }),
  problema({
    id: 'concorrencia-prob-fan-in',
    titulo: "Fan-in: juntando canais",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>juntar(canais...)</code>: devolva um único canal que recebe tudo o que chega em qualquer um dos canais e fecha quando <b>todos</b> fecharem.</p>",
    dica: "Uma goroutine por canal repassando os valores, um <code>WaitGroup</code> e outra goroutine que fecha a saída depois do <code>wg.Wait()</code>.",
    inicial: go`
package main

import (
  "fmt"
  "sort"
)

// Dica: você vai precisar importar "sync".

func fonte(nome string, n int) <-chan string {
  ch := make(chan string)
  go func() {
    defer close(ch)
    for i := 1; i <= n; i++ {
      ch <- fmt.Sprintf("%s%d", nome, i)
    }
  }()
  return ch
}

func juntar(canais ...<-chan string) <-chan string {
  // TODO: implemente
  return func() chan string { ch := make(chan string); close(ch); return ch }()
}

func main() {
  todos := []string{}
  for v := range juntar(fonte("a", 2), fonte("b", 3), fonte("c", 1)) {
    todos = append(todos, v)
  }
  sort.Strings(todos)
  fmt.Println(todos)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
  "sync"
)

func fonte(nome string, n int) <-chan string {
  ch := make(chan string)
  go func() {
    defer close(ch)
    for i := 1; i <= n; i++ {
      ch <- fmt.Sprintf("%s%d", nome, i)
    }
  }()
  return ch
}

func juntar(canais ...<-chan string) <-chan string {
  saida := make(chan string)
  var wg sync.WaitGroup
  for _, c := range canais {
    wg.Add(1)
    go func(c <-chan string) {
      defer wg.Done()
      for v := range c {
        saida <- v
      }
    }(c)
  }
  go func() {
    wg.Wait()
    close(saida)
  }()
  return saida
}

func main() {
  todos := []string{}
  for v := range juntar(fonte("a", 2), fonte("b", 3), fonte("c", 1)) {
    todos = append(todos, v)
  }
  sort.Strings(todos)
  fmt.Println(todos)
}
`,
    testes: [{ saida: "[a1 a2 b1 b2 b3 c1]" }],
  }),
  problema({
    id: 'concorrencia-prob-primeiro-erro',
    titulo: "Parando no primeiro erro",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>verificarTodos(urls, checar)</code>: chame <code>checar</code> para cada URL em paralelo e devolva o <b>primeiro</b> erro que acontecer (ou <code>nil</code>).</p>",
    dica: "Um canal de erros com buffer <code>len(urls)</code>; depois do <code>wg.Wait()</code>, feche e devolva o primeiro valor não nulo.",
    inicial: go`
package main

import (
  "errors"
  "fmt"
  "strings"
)

// Dica: você vai precisar importar "sync".

func verificarTodos(urls []string, checar func(string) error) error {
  // TODO: implemente
  return nil
}

func main() {
  checar := func(u string) error {
    if strings.Contains(u, "fora") {
      return errors.New(u + " fora do ar")
    }
    return nil
  }
  fmt.Println(verificarTodos([]string{"api", "site", "cdn"}, checar))
  fmt.Println(verificarTodos([]string{"api", "fora", "cdn"}, checar))
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
  "strings"
  "sync"
)

func verificarTodos(urls []string, checar func(string) error) error {
  erros := make(chan error, len(urls))
  var wg sync.WaitGroup
  for _, u := range urls {
    wg.Add(1)
    go func(u string) {
      defer wg.Done()
      if err := checar(u); err != nil {
        erros <- err
      }
    }(u)
  }
  wg.Wait()
  close(erros)
  return <-erros
}

func main() {
  checar := func(u string) error {
    if strings.Contains(u, "fora") {
      return errors.New(u + " fora do ar")
    }
    return nil
  }
  fmt.Println(verificarTodos([]string{"api", "site", "cdn"}, checar))
  fmt.Println(verificarTodos([]string{"api", "fora", "cdn"}, checar))
}
`,
    testes: [{ saida: "<nil>\nfora fora do ar" }],
  }),
];
