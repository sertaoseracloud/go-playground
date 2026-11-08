import { go, licao, problema } from './util.js';
import { extraConcorrencia } from './problemas/extra-concorrencia.js';

export const moduloConcorrencia = {
  id: 'concorrencia',
  titulo: 'Concorrência',
  icone: '⚡',
  descricao: 'Goroutines, channels, select, pacotes sync e padrões concorrentes em Go.',
  itens: [
    licao({
      id: 'concorrencia-licao-goroutines',
      titulo: 'Goroutines (conceito)',
      resumo: `<p>Uma <b>goroutine</b> é uma thread leve gerenciada pelo runtime do Go.</p><ul><li><code>go func()</code> inicia execução concorrente.</li><li>Milhares de goroutines podem rodar simultaneamente.</li><li>O scheduler multiplexa goroutines sobre threads do SO.</li></ul>`,
      codigo: go`
package main

import "fmt"

func saudacao(nome string) {
  fmt.Println("Ola,", nome)
}

func main() {
  saudacao("Alice")
  saudacao("Bob")
  fmt.Println("Fim")
}
`,
    }),
    licao({
      id: 'concorrencia-licao-channels',
      titulo: 'Channels (conceito)',
      resumo: `<p>Channels são canais tipados para comunicação entre goroutines.</p><ul><li><code>ch := make(chan int)</code> cria um channel não-buffered.</li><li><code>ch &lt;- valor</code> envia; <code>valor := &lt;-ch</code> recebe.</li><li><code>close(ch)</code> fecha o channel.</li></ul>`,
      codigo: go`
package main

import "fmt"

func main() {
  ch := []int{}
  for i := 1; i <= 5; i++ {
    ch = append(ch, i)
  }
  for _, v := range ch {
    fmt.Println("Recebido:", v)
  }
}
`,
    }),
    licao({
      id: 'concorrencia-licao-buffered-channels',
      titulo: 'Buffered Channels',
      resumo: `<p>Um <b>buffered channel</b> possui capacidade interna definida na criação.</p><ul><li><code>ch := make(chan int, 3)</code> cria canal com buffer de tamanho 3.</li><li>Útil para desacoplar ritmos diferentes entre produtor e consumidor.</li><li>O buffer funciona como uma fila FIFO.</li></ul>`,
      codigo: go`
package main

import "fmt"

func main() {
  buf := []int{}
  buf = append(buf, 10)
  buf = append(buf, 20)
  buf = append(buf, 30)
  fmt.Println(buf[0])
  fmt.Println(buf[1])
  fmt.Println(buf[2])
}
`,
    }),
    licao({
      id: 'concorrencia-licao-select',
      titulo: 'Select (conceito)',
      resumo: `<p>O <code>select</code> permite aguardar múltiplos channels simultaneamente.</p><ul><li>Cada <code>case</code> tenta enviar ou receber de um canal diferente.</li><li>Se mais de um estiver pronto, um é escolhido aleatoriamente.</li><li><code>default</code> torna o select não-bloqueante.</li></ul>`,
      codigo: go`
package main

import "fmt"

func main() {
  ch1 := []string{"msg1"}
  ch2 := []string{"msg2"}
  if len(ch1) > 0 {
    fmt.Println(ch1[0])
  } else if len(ch2) > 0 {
    fmt.Println(ch2[0])
  }
}
`,
    }),
    licao({
      id: 'concorrencia-licao-mutex',
      titulo: 'sync.Mutex',
      resumo: `<p><code>sync.Mutex</code> protege dados compartilhados garantindo acesso exclusivo.</p><ul><li><code>mu.Lock()</code> adquire o lock; <code>mu.Unlock()</code> libera.</li><li>Sempre faça Unlock após Lock.</li><li><code>sync.RWMutex</code> permite múltiplos leitores ou um escritor.</li></ul>`,
      codigo: go`
package main

import "fmt"

type Mutex struct {
  travado bool
}

func (m *Mutex) Lock() {
  m.travado = true
}

func (m *Mutex) Unlock() {
  m.travado = false
}

var contador int
var mu Mutex

func incrementar() {
  mu.Lock()
  contador++
  mu.Unlock()
}

func main() {
  for i := 0; i < 100; i++ {
    incrementar()
  }
  fmt.Println(contador)
}
`,
    }),
    licao({
      id: 'concorrencia-licao-waitgroup',
      titulo: 'sync.WaitGroup',
      resumo: `<p><code>sync.WaitGroup</code> espera um conjunto de goroutines terminar.</p><ul><li><code>wg.Add(n)</code> registra n goroutines pendentes.</li><li><code>wg.Done()</code> sinaliza conclusão.</li><li><code>wg.Wait()</code> bloqueia até todas chamarem Done.</li></ul>`,
      codigo: go`
package main

import "fmt"

type WaitGroup struct {
  pendentes int
}

func (wg *WaitGroup) Add(n int) {
  wg.pendentes = wg.pendentes + n
}

func (wg *WaitGroup) Done() {
  wg.pendentes--
}

func tarefa(id int, wg *WaitGroup) {
  fmt.Println("Tarefa", id, "concluida")
  wg.Done()
}

func main() {
  wg := WaitGroup{pendentes: 0}
  for i := 1; i <= 3; i++ {
    wg.Add(1)
    tarefa(i, &wg)
  }
  fmt.Println("Todas concluidas")
}
`,
    }),
    licao({
      id: 'concorrencia-licao-once',
      titulo: 'sync.Once',
      resumo: `<p><code>sync.Once</code> garante que uma função execute exatamente uma vez.</p><ul><li><code>once.Do(func)</code> executa apenas na primeira chamada.</li><li>Chamadas subsequentes são ignoradas.</li><li>Ideal para inicialização lazy de singletons.</li></ul>`,
      codigo: go`
package main

import "fmt"

type Once struct {
  feito bool
}

func (o *Once) Do(fn func()) {
  if !o.feito {
    o.feito = true
    fn()
  }
}

var once Once
var config string

func initConfig() {
  config = "carregado"
  fmt.Println("Inicializando...")
}

func main() {
  once.Do(initConfig)
  fmt.Println(config)
  once.Do(initConfig)
  fmt.Println(config)
}
`,
    }),
    licao({
      id: 'concorrencia-licao-atomic',
      titulo: 'Atomic Operations (conceito)',
      resumo: `<p>O pacote <code>sync/atomic</code> oferece operações atômicas de baixo nível.</p><ul><li><code>atomic.AddInt64(&amp;x, 1)</code> incrementa atomicamente.</li><li><code>atomic.LoadInt64(&amp;x)</code> lê valor de forma segura.</li><li>Mais rápido que Mutex para contadores simples.</li></ul>`,
      codigo: go`
package main

import "fmt"

var contador int

func main() {
  for i := 0; i < 1000; i++ {
    contador++
  }
  fmt.Println(contador)
}
`,
    }),
    licao({
      id: 'concorrencia-licao-race-conditions',
      titulo: 'Race Conditions (conceito)',
      resumo: `<p>Uma <b>race condition</b> ocorre quando duas goroutines acessam o mesmo dado concorrentemente e pelo menos uma escreve.</p><ul><li>Resultados imprevisíveis e difíceis de reproduzir.</li><li>Use <code>go run -race</code> para detectar races.</li><li>Proteja dados com Mutex, channels ou atomics.</li></ul>`,
      codigo: go`
package main

import "fmt"

var saldo int

func depositar(valor int) {
  saldo = saldo + valor
}

func main() {
  for i := 0; i < 100; i++ {
    depositar(10)
  }
  fmt.Println(saldo)
}
`,
    }),
    licao({
      id: 'concorrencia-licao-deadlocks',
      titulo: 'Deadlocks (conceito)',
      resumo: `<p>Um <b>deadlock</b> ocorre quando goroutines ficam permanentemente bloqueadas.</p><ul><li>Causa comum: enviar/receber em canal fechado ou sem par.</li><li>Mutexes adquiridos em ordem inconsistente causam deadlock.</li><li>O runtime detecta deadlocks e faz panic.</li></ul>`,
      codigo: go`
package main

import "fmt"

func main() {
  ch := []int{}
  ch = append(ch, 42)
  v := ch[0]
  fmt.Println(v)
}
`,
    }),
    licao({
      id: 'concorrencia-licao-worker-pool',
      titulo: 'Worker Pool (padrão)',
      resumo: `<p>O padrão <b>Worker Pool</b> limita goroutines ativas processando tarefas.</p><ul><li>Crie N workers que leem de um canal compartilhado.</li><li>Feche o canal quando todo trabalho for enviado.</li><li>Workers terminam ao encontrar canal fechado.</li></ul>`,
      codigo: go`
package main

import "fmt"

func worker(id int, jobs []int) []int {
  results := []int{}
  for _, j := range jobs {
    results = append(results, j*2)
  }
  return results
}

func main() {
  jobs := []int{1, 2, 3, 4, 5}
  res := worker(1, jobs)
  for _, r := range res {
    fmt.Println(r)
  }
}
`,
    }),
    licao({
      id: 'concorrencia-licao-pipeline',
      titulo: 'Pipeline (padrão)',
      resumo: `<p>O padrão <b>Pipeline</b> conecta estágios de processamento via channels.</p><ul><li>Cada estágio recebe de entrada e envia para saída.</li><li>Estágios podem ser replicados para paralelismo.</li><li>Permite composição de transformações complexas.</li></ul>`,
      codigo: go`
package main

import "fmt"

func gerar(nums []int) []int {
  return nums
}

func dobrar(nums []int) []int {
  out := []int{}
  for _, v := range nums {
    out = append(out, v*2)
  }
  return out
}

func main() {
  dados := gerar([]int{1, 2, 3})
  resultado := dobrar(dados)
  for _, v := range resultado {
    fmt.Println(v)
  }
}
`,
    }),
    licao({
      id: 'concorrencia-licao-fanin-fanout',
      titulo: 'Fan-in / Fan-out (conceito)',
      resumo: `<p><b>Fan-out</b> distribui trabalho para múltiplos workers. <b>Fan-in</b> combina resultados em um só canal.</p><ul><li>Fan-out: múltiplas goroutines leem do mesmo canal.</li><li>Fan-in: merge combina múltiplos canais de saída.</li><li>Juntos formam pipelines paralelos escaláveis.</li></ul>`,
      codigo: go`
package main

import "fmt"

func merge(fontes [][]int) []int {
  resultado := []int{}
  for _, f := range fontes {
    for _, v := range f {
      resultado = append(resultado, v)
    }
  }
  return resultado
}

func main() {
  ch1 := []int{1, 2, 3}
  ch2 := []int{4, 5, 6}
  combinado := merge([][]int{ch1, ch2})
  for _, v := range combinado {
    fmt.Println(v)
  }
}
`,
    }),
    licao({
      id: 'concorrencia-licao-context',
      titulo: 'Context (conceito)',
      resumo: `<p>O pacote <code>context</code> propaga cancelamento, deadlines e valores.</p><ul><li><code>context.Background()</code> é a raiz de qualquer contexto.</li><li><code>context.WithCancel</code> cria contexto cancelável manualmente.</li><li><code>context.WithTimeout</code> cancela automaticamente após duração.</li></ul>`,
      codigo: go`
package main

import "fmt"

type Context struct {
  cancelado bool
}

func trabalhador(ctx Context, id int) {
  if !ctx.cancelado {
    fmt.Println("Worker", id, "executando")
  } else {
    fmt.Println("Worker", id, "cancelado")
  }
}

func main() {
  ctx := Context{cancelado: false}
  trabalhador(ctx, 1)
  trabalhador(ctx, 2)
  ctx.cancelado = true
  trabalhador(ctx, 3)
}
`,
    }),
    licao({
      id: 'concorrencia-licao-errgroup',
      titulo: 'Errgroup (conceito)',
      resumo: `<p><code>errgroup.Group</code> estende WaitGroup com propagação de erros e cancelamento automático.</p><ul><li><code>g.Go(func) error</code> lança goroutine que pode retornar erro.</li><li><code>g.Wait()</code> retorna o primeiro erro não-nil encontrado.</li><li>Ideal para operações concorrentes onde qualquer falha invalida o resultado.</li></ul>`,
      codigo: go`
package main

import "fmt"

type Result struct {
  valor int
  erro  string
}

func tarefaSegura(id int) Result {
  if id == 3 {
    return Result{valor: 0, erro: "falha na tarefa 3"}
  }
  return Result{valor: id * 10, erro: ""}
}

func main() {
  resultados := []Result{}
  for i := 1; i <= 5; i++ {
    resultados = append(resultados, tarefaSegura(i))
  }
  for _, r := range resultados {
    if r.erro != "" {
      fmt.Println("Erro:", r.erro)
    } else {
      fmt.Println("OK:", r.valor)
    }
  }
}
`,
    }),
    problema({
      id: 'concorrencia-prob-processar-tasks',
      titulo: 'Processar Tasks',
      dificuldade: 'facil',
      enunciado: '<p>Processe 5 tasks sequencialmente. Cada task imprime "Task N: ok". Imprima todas.</p>',
      dica: 'Use um loop for de 1 a 5 imprimindo cada task.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: processe 5 tasks
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  for i := 1; i <= 5; i++ {
    fmt.Println("Task", i, ": ok")
  }
}
`,
      testes: [{ saida: 'Task 1 : ok\nTask 2 : ok\nTask 3 : ok\nTask 4 : ok\nTask 5 : ok' }],
    }),
    problema({
      id: 'concorrencia-prob-pipeline-filter-map',
      titulo: 'Pipeline Filter+Map',
      dificuldade: 'medio',
      enunciado: '<p>Pipeline filter+map. Dados [1..8]. Filtro: pares. Map: *10. Imprima resultados.</p>',
      dica: 'Primeiro filtre em novo slice, depois aplique map.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  dados := []int{1, 2, 3, 4, 5, 6, 7, 8}
  _ = dados // TODO: use dados
  // TODO: filter pares, map *10
}
`,
      solucao: go`
package main

import "fmt"

func filtrarPares(nums []int) []int {
  out := []int{}
  for _, v := range nums {
    if v%2 == 0 {
      out = append(out, v)
    }
  }
  return out
}

func multiplica10(nums []int) []int {
  out := []int{}
  for _, v := range nums {
    out = append(out, v*10)
  }
  return out
}

func main() {
  dados := []int{1, 2, 3, 4, 5, 6, 7, 8}
  pares := filtrarPares(dados)
  resultado := multiplica10(pares)
  for _, v := range resultado {
    fmt.Println(v)
  }
}
`,
      testes: [{ saida: '20\n40\n60\n80' }],
    }),
    problema({
      id: 'concorrencia-prob-mutex-contador',
      titulo: 'Mutex Contador',
      dificuldade: 'medio',
      enunciado: '<p>Crie um contador seguro com Mutex simulado. Simule 10 workers incrementando 100 vezes cada. Imprima o valor final (deve ser 1000).</p>',
      dica: 'Crie uma struct Mutex com campo booleano. Chame Lock antes de modificar e Unlock depois.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: implemente o contador seguro com Mutex simulado

func main() {
  // TODO: simule 10 workers incrementando 100 vezes cada
}
`,
      solucao: go`
package main

import "fmt"

type Mutex struct {
  travado bool
}

func (m *Mutex) Lock() {
  m.travado = true
}

func (m *Mutex) Unlock() {
  m.travado = false
}

var contador int
var mu Mutex

func incrementar(n int) {
  for i := 0; i < n; i++ {
    mu.Lock()
    contador++
    mu.Unlock()
  }
}

func main() {
  for w := 0; w < 10; w++ {
    incrementar(100)
  }
  fmt.Println(contador)
}
`,
      testes: [{ saida: '1000' }],
    }),
    problema({
      id: 'concorrencia-prob-waitgroup-simulado',
      titulo: 'WaitGroup Simulado',
      dificuldade: 'facil',
      enunciado: '<p>Simule WaitGroup. 5 tarefas imprimem "Tarefa N feita". Quando pendentes=0, imprima "Todas concluidas".</p>',
      dica: 'Incremente pendentes antes de cada tarefa, decremente apos.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: simule 5 tarefas com WaitGroup
}
`,
      solucao: go`
package main

import "fmt"

type WaitGroup struct {
  pendentes int
}

func (wg *WaitGroup) Add(n int) {
  wg.pendentes = wg.pendentes + n
}

func (wg *WaitGroup) Done() {
  wg.pendentes--
}

func main() {
  wg := WaitGroup{pendentes: 0}
  for i := 1; i <= 5; i++ {
    wg.Add(1)
    fmt.Println("Tarefa", i, "feita")
    wg.Done()
  }
  if wg.pendentes == 0 {
    fmt.Println("Todas concluidas")
  }
}
`,
      testes: [{ saida: 'Tarefa 1 feita\nTarefa 2 feita\nTarefa 3 feita\nTarefa 4 feita\nTarefa 5 feita\nTodas concluidas' }],
    }),
    problema({
      id: 'concorrencia-prob-producer-consumer',
      titulo: 'Producer-Consumer',
      dificuldade: 'medio',
      enunciado: '<p>Simule produtor-consumidor. Produtor gera 1..6 no buffer. Consumidor imprime "Processado: X" para cada item.</p>',
      dica: 'Use append para produzir e for-range para consumir.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  buffer := []int{}
  _ = buffer // TODO: use buffer
  // TODO: produza 1..6 e consuma imprimindo
}
`,
      solucao: go`
package main

import "fmt"

func produzir(buffer []int) []int {
  for i := 1; i <= 6; i++ {
    buffer = append(buffer, i)
  }
  return buffer
}

func consumir(buffer []int) {
  for _, v := range buffer {
    fmt.Println("Processado:", v)
  }
}

func main() {
  buffer := []int{}
  buffer = produzir(buffer)
  consumir(buffer)
}
`,
      testes: [{ saida: 'Processado: 1\nProcessado: 2\nProcessado: 3\nProcessado: 4\nProcessado: 5\nProcessado: 6' }],
    }),
    problema({
      id: 'concorrencia-prob-fanin-merge',
      titulo: 'Fan-in Merge',
      dificuldade: 'medio',
      enunciado: '<p>Combine resultados de dois workers. A=[10,20,30], B=[40,50,60]. Merge intercalado: 10,40,20,50,30,60.</p>',
      dica: 'Itere pelos dois slices simultaneamente usando indice.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  a := []int{10, 20, 30}
  _ = a // TODO: use a
  b := []int{40, 50, 60}
  _ = b // TODO: use b
  // TODO: merge intercalado
}
`,
      solucao: go`
package main

import "fmt"

func mergeIntercalado(a []int, b []int) []int {
  resultado := []int{}
  for i := 0; i < len(a); i++ {
    resultado = append(resultado, a[i])
    resultado = append(resultado, b[i])
  }
  return resultado
}

func main() {
  a := []int{10, 20, 30}
  b := []int{40, 50, 60}
  combinado := mergeIntercalado(a, b)
  for _, v := range combinado {
    fmt.Println(v)
  }
}
`,
      testes: [{ saida: '10\n40\n20\n50\n30\n60' }],
    }),
    problema({
      id: 'concorrencia-prob-timeout-simulado',
      titulo: 'Timeout Simulado',
      dificuldade: 'medio',
      enunciado: '<p>Simule timeout. Tarefa tenta processar 100 itens, timeout é 5. Se atingir limite, imprima "Timeout atingido".</p>',
      dica: 'Use contador dentro do loop e compare com limite.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: simule tarefa com timeout de 5 iteracoes
}
`,
      solucao: go`
package main

import "fmt"

func tarefaComTimeout(total int, limite int) {
  for i := 0; i < total; i++ {
    if i >= limite {
      fmt.Println("Timeout atingido")
      return
    }
  }
  fmt.Println("Concluido")
}

func main() {
  tarefaComTimeout(100, 5)
}
`,
      testes: [{ saida: 'Timeout atingido' }],
    }),
    problema({
      id: 'concorrencia-prob-rate-limiter',
      titulo: 'Rate Limiter',
      dificuldade: 'medio',
      enunciado: '<p>Simule rate limiter: max 3 requisições por lote. 8 requisições (1..8). Imprima "Lote N: X Y Z".</p>',
      dica: 'Itere com passo 3 e use slicing para cada lote.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  requisicoes := []int{1, 2, 3, 4, 5, 6, 7, 8}
  _ = requisicoes // TODO: use requisicoes
  // TODO: processe em lotes de 3
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  requisicoes := []int{1, 2, 3, 4, 5, 6, 7, 8}
  lote := 1
  for i := 0; i < len(requisicoes); i += 3 {
    fim := i + 3
    if fim > len(requisicoes) {
      fim = len(requisicoes)
    }
    batch := requisicoes[i:fim]
    fmt.Print("Lote ", lote, ":")
    for _, v := range batch {
      fmt.Print(" ", v)
    }
    fmt.Println("")
    lote++
  }
}
`,
      testes: [{ saida: 'Lote 1: 1 2 3\nLote 2: 4 5 6\nLote 3: 7 8' }],
    }),
    problema({
      id: 'concorrencia-prob-map-reduce',
      titulo: 'Map-Reduce',
      dificuldade: 'dificil',
      enunciado: '<p>Map-Reduce simulado. Dados: [2,3,4,5]. Map: quadrado. Reduce: soma. Imprima resultado (54).</p>',
      dica: 'Aplique map gerando novo slice, depois percorra somando.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  dados := []int{2, 3, 4, 5}
  _ = dados // TODO: use dados
  // TODO: map (quadrado) e reduce (soma)
}
`,
      solucao: go`
package main

import "fmt"

func mapQuadrado(nums []int) []int {
  out := []int{}
  for _, v := range nums {
    out = append(out, v*v)
  }
  return out
}

func reduceSoma(nums []int) int {
  total := 0
  for _, v := range nums {
    total = total + v
  }
  return total
}

func main() {
  dados := []int{2, 3, 4, 5}
  mapeado := mapQuadrado(dados)
  resultado := reduceSoma(mapeado)
  fmt.Println(resultado)
}
`,
      testes: [{ saida: '54' }],
    }),
    problema({
      id: 'concorrencia-prob-barrier-sync',
      titulo: 'Barrier Sync',
      dificuldade: 'medio',
      enunciado: '<p>Simule barreira. 3 workers executam fase 1, imprima "Barreira liberada", depois fase 2.</p>',
      dica: 'Execute fases 1 em sequencia, barreira, depois fases 2.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: simule 3 workers com barreira entre fases
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  workers := []int{1, 2, 3}
  for _, w := range workers {
    fmt.Println("Worker", w, "fase 1")
  }
  fmt.Println("Barreira liberada")
  for _, w := range workers {
    fmt.Println("Worker", w, "fase 2")
  }
}
`,
      testes: [{ saida: 'Worker 1 fase 1\nWorker 2 fase 1\nWorker 3 fase 1\nBarreira liberada\nWorker 1 fase 2\nWorker 2 fase 2\nWorker 3 fase 2' }],
    }),
    problema({
      id: 'concorrencia-prob-worker-pool-exec',
      titulo: 'Worker Pool Exec',
      dificuldade: 'facil',
      enunciado: '<p>Implemente um worker pool simulado. Tarefas: []int{1,2,3,4,5,6,7,8}. Simule 2 workers (cada um pega metade). Cada tarefa multiplicada por 3. Imprima resultados em ordem.</p>',
      dica: 'Divida o slice em partes iguais. Cada worker processa sua parte.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  tarefas := []int{1, 2, 3, 4, 5, 6, 7, 8}
  _ = tarefas // TODO: use tarefas
  // TODO: processe com 2 workers simulados
}
`,
      solucao: go`
package main

import "fmt"

func worker(tarefas []int, inicio int, resultados []int) {
  for i, t := range tarefas {
    resultados[inicio+i] = t * 3
  }
}

func main() {
  tarefas := []int{1, 2, 3, 4, 5, 6, 7, 8}
  resultados := make([]int, len(tarefas))
  meio := len(tarefas) / 2
  worker(tarefas[:meio], 0, resultados)
  worker(tarefas[meio:], meio, resultados)
  for _, r := range resultados {
    fmt.Println(r)
  }
}
`,
      testes: [{ saida: '3\n6\n9\n12\n15\n18\n21\n24' }],
    }),
    problema({
      id: 'concorrencia-prob-channel-buffer',
      titulo: 'Channel Buffer',
      dificuldade: 'medio',
      enunciado: '<p>Buffer circular tamanho 3. Insira 10,20,30,40,50. Sobrescreva quando cheio. Imprima conteúdo final (30,40,50).</p>',
      dica: 'Use índice modular (pos % tamanho) para determinar onde escrever.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: buffer circular de tamanho 3
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  tamanho := 3
  buf := make([]int, tamanho)
  pos := 0
  valores := []int{10, 20, 30, 40, 50}
  for _, v := range valores {
    buf[pos%tamanho] = v
    pos++
  }
  // do mais antigo para o mais novo
  for i := 0; i < tamanho; i++ {
    fmt.Println(buf[(pos+i)%tamanho])
  }
}
`,
      testes: [{ saida: '30\n40\n50' }],
    }),
    problema({
      id: 'concorrencia-prob-select-simulado',
      titulo: 'Select Simulado',
      dificuldade: 'medio',
      enunciado: '<p>Simule select com 2 canais. ch1=[100], ch2=[200]. Verifique qual tem dado primeiro e imprima "Recebido: X".</p>',
      dica: 'Use if/else verificando len de cada slice.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  ch1 := []int{100}
  _ = ch1 // TODO: use ch1
  ch2 := []int{200}
  _ = ch2 // TODO: use ch2
  // TODO: selecione o primeiro disponivel
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  ch1 := []int{100}
  ch2 := []int{200}
  if len(ch1) > 0 {
    fmt.Println("Recebido:", ch1[0])
  } else if len(ch2) > 0 {
    fmt.Println("Recebido:", ch2[0])
  }
}
`,
      testes: [{ saida: 'Recebido: 100' }],
    }),
    problema({
      id: 'concorrencia-prob-once-init',
      titulo: 'Once Init',
      dificuldade: 'facil',
      enunciado: '<p>Simule sync.Once. Chame inicializar 3 vezes, mas só execute na primeira. Imprima "Inicializado" apenas uma vez.</p>',
      dica: 'Use struct Once com campo booleano feito.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: simule Once com 3 chamadas
}
`,
      solucao: go`
package main

import "fmt"

type Once struct {
  feito bool
}

func (o *Once) Do(fn func()) {
  if !o.feito {
    o.feito = true
    fn()
  }
}

func main() {
  var once Once
  for i := 0; i < 3; i++ {
    once.Do(func() {
      fmt.Println("Inicializado")
    })
  }
}
`,
      testes: [{ saida: 'Inicializado' }],
    }),
    problema({
      id: 'concorrencia-prob-race-detect',
      titulo: 'Race Detect',
      dificuldade: 'medio',
      enunciado: '<p>Simule detecção de race. Dois "workers" escrevem em variavel compartilhada sem proteção. Imprima "Race detectado" se ambos escreverem.</p>',
      dica: 'Simule dois writes sequenciais e detecte que não houve proteção.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: simule race condition
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  compartilhado := 0
  escritas := 0
  compartilhado = 1
  escritas++
  compartilhado = 2
  escritas++
  if escritas > 1 {
    fmt.Println("Race detectado: valor final", compartilhado)
  }
}
`,
      testes: [{ saida: 'Race detectado: valor final 2' }],
    }),
    problema({
      id: 'concorrencia-prob-deadlock-prevent',
      titulo: 'Deadlock Prevent',
      dificuldade: 'medio',
      enunciado: '<p>Previna deadlock ordenando locks. Worker A precisa de lock1 e lock2. Sempre adquira lock1 antes de lock2. Imprima "Seguro".</p>',
      dica: 'Adquira locks em ordem consistente.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: previna deadlock com ordenacao de locks
}
`,
      solucao: go`
package main

import "fmt"

type Mutex struct {
  travado bool
}

func (m *Mutex) Lock() {
  m.travado = true
}

func (m *Mutex) Unlock() {
  m.travado = false
}

func main() {
  var lock1 Mutex
  var lock2 Mutex
  lock1.Lock()
  lock2.Lock()
  fmt.Println("Seguro")
  lock2.Unlock()
  lock1.Unlock()
}
`,
      testes: [{ saida: 'Seguro' }],
    }),
    problema({
      id: 'concorrencia-prob-concurrent-sum',
      titulo: 'Concurrent Sum',
      dificuldade: 'facil',
      enunciado: '<p>Soma concorrente simulada. 4 workers somam parcelas [10,20,30,40]. Imprima soma total (100).</p>',
      dica: 'Some todos os elementos do slice.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  parcelas := []int{10, 20, 30, 40}
  _ = parcelas // TODO: use parcelas
  // TODO: some todas as parcelas
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  parcelas := []int{10, 20, 30, 40}
  total := 0
  for _, p := range parcelas {
    total = total + p
  }
  fmt.Println(total)
}
`,
      testes: [{ saida: '100' }],
    }),
    problema({
      id: 'concorrencia-prob-parallel-search',
      titulo: 'Parallel Search',
      dificuldade: 'medio',
      enunciado: '<p>Busca paralela simulada. Dados [5,12,8,23,15,3]. Busque 23. Divida em 2 metades. Imprima "Encontrado: 23 na posicao 3".</p>',
      dica: 'Busque em cada metade e retorne o índice.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  dados := []int{5, 12, 8, 23, 15, 3}
  _ = dados // TODO: use dados
  alvo := 23
  _ = alvo // TODO: use alvo
  // TODO: busca paralela simulada
}
`,
      solucao: go`
package main

import "fmt"

func buscar(nums []int, alvo int, offset int) int {
  for i, v := range nums {
    if v == alvo {
      return offset + i
    }
  }
  return -1
}

func main() {
  dados := []int{5, 12, 8, 23, 15, 3}
  alvo := 23
  meio := len(dados) / 2
  pos := buscar(dados[:meio], alvo, 0)
  if pos == -1 {
    pos = buscar(dados[meio:], alvo, meio)
  }
  fmt.Println("Encontrado:", alvo, "na posicao", pos)
}
`,
      testes: [{ saida: 'Encontrado: 23 na posicao 3' }],
    }),
    problema({
      id: 'concorrencia-prob-batch-processor',
      titulo: 'Batch Processor',
      dificuldade: 'medio',
      enunciado: '<p>Processe em batches de 3. Dados [1,2,3,4,5,6,7]. Imprima "Batch N: X Y Z".</p>',
      dica: 'Itere com passo 3 e fatie o slice.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  dados := []int{1, 2, 3, 4, 5, 6, 7}
  _ = dados // TODO: use dados
  // TODO: processe em batches de 3
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  dados := []int{1, 2, 3, 4, 5, 6, 7}
  batch := 1
  for i := 0; i < len(dados); i += 3 {
    fim := i + 3
    if fim > len(dados) {
      fim = len(dados)
    }
    grupo := dados[i:fim]
    fmt.Print("Batch ", batch, ":")
    for _, v := range grupo {
      fmt.Print(" ", v)
    }
    fmt.Println("")
    batch++
  }
}
`,
      testes: [{ saida: 'Batch 1: 1 2 3\nBatch 2: 4 5 6\nBatch 3: 7' }],
    }),
    problema({
      id: 'concorrencia-prob-task-queue',
      titulo: 'Task Queue',
      dificuldade: 'facil',
      enunciado: '<p>Fila de tarefas. Adicione 3 tarefas ["a","b","c"]. Processe removendo da frente. Imprima "Processando: X".</p>',
      dica: 'Use slice como fila, remova o primeiro elemento.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: fila de tarefas
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  fila := []string{"a", "b", "c"}
  for len(fila) > 0 {
    tarefa := fila[0]
    fila = fila[1:]
    fmt.Println("Processando:", tarefa)
  }
}
`,
      testes: [{ saida: 'Processando: a\nProcessando: b\nProcessando: c' }],
    }),
    problema({
      id: 'concorrencia-prob-result-collector',
      titulo: 'Result Collector',
      dificuldade: 'medio',
      enunciado: '<p>Colete resultados de 3 workers. W1=10, W2=20, W3=30. Armazene em slice e imprima "Total: 60".</p>',
      dica: 'Colete em slice e some no final.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: colete resultados e some
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  resultados := []int{}
  resultados = append(resultados, 10)
  resultados = append(resultados, 20)
  resultados = append(resultados, 30)
  total := 0
  for _, v := range resultados {
    total = total + v
  }
  fmt.Println("Total:", total)
}
`,
      testes: [{ saida: 'Total: 60' }],
    }),
    problema({
      id: 'concorrencia-prob-error-aggregator',
      titulo: 'Error Aggregator',
      dificuldade: 'medio',
      enunciado: '<p>Agregue erros de 5 tarefas. Tarefas 2 e 4 falham. Imprima "Erros: 2".</p>',
      dica: 'Conte quantas tarefas retornaram erro.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: agregue erros de 5 tarefas
}
`,
      solucao: go`
package main

import "fmt"

func executar(id int) bool {
  return id == 2 || id == 4
}

func main() {
  erros := 0
  for i := 1; i <= 5; i++ {
    if executar(i) {
      erros++
    }
  }
  fmt.Println("Erros:", erros)
}
`,
      testes: [{ saida: 'Erros: 2' }],
    }),
    problema({
      id: 'concorrencia-prob-retry-backoff',
      titulo: 'Retry With Backoff',
      dificuldade: 'dificil',
      enunciado: '<p>Retry com backoff. Tente 4 vezes. Falha nas tentativas 1,2,3; sucesso na 4. Imprima "Tentativa N: falha" ou "Tentativa N: sucesso".</p>',
      dica: 'Use loop com contador e condicao de parada.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: retry ate sucesso na tentativa 4
}
`,
      solucao: go`
package main

import "fmt"

func tentar(n int) bool {
  return n >= 4
}

func main() {
  for i := 1; i <= 4; i++ {
    if tentar(i) {
      fmt.Println("Tentativa", i, ": sucesso")
      break
    } else {
      fmt.Println("Tentativa", i, ": falha")
    }
  }
}
`,
      testes: [{ saida: 'Tentativa 1 : falha\nTentativa 2 : falha\nTentativa 3 : falha\nTentativa 4 : sucesso' }],
    }),
    problema({
      id: 'concorrencia-prob-semaphore-simulado',
      titulo: 'Semaphore Simulado',
      dificuldade: 'dificil',
      enunciado: '<p>Semáforo limita a 2 tarefas simultâneas. 5 tarefas. Imprima "Inicio N" e "Fim N" em lotes de 2.</p>',
      dica: 'Processe 2 tarefas por vez em lotes sequenciais.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: simule semaforo com limite de 2
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  tarefas := []int{1, 2, 3, 4, 5}
  maxConc := 2
  for i := 0; i < len(tarefas); i += maxConc {
    fim := i + maxConc
    if fim > len(tarefas) {
      fim = len(tarefas)
    }
    for j := i; j < fim; j++ {
      fmt.Println("Inicio", tarefas[j])
    }
    for j := i; j < fim; j++ {
      fmt.Println("Fim", tarefas[j])
    }
  }
}
`,
      testes: [{ saida: 'Inicio 1\nInicio 2\nFim 1\nFim 2\nInicio 3\nInicio 4\nFim 3\nFim 4\nInicio 5\nFim 5' }],
    }),
    problema({
      id: 'concorrencia-prob-priority-queue',
      titulo: 'Priority Queue',
      dificuldade: 'dificil',
      enunciado: '<p>Fila de prioridade. Itens [(3,"c"),(1,"a"),(2,"b")]. Processe por prioridade (menor primeiro). Imprima "Item: X".</p>',
      dica: 'Ordene por prioridade antes de processar.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: fila de prioridade
}
`,
      solucao: go`
package main

import "fmt"

type Item struct {
  prio int
  nome string
}

func main() {
  itens := []Item{
    {prio: 3, nome: "c"},
    {prio: 1, nome: "a"},
    {prio: 2, nome: "b"},
  }
  for i := 0; i < len(itens); i++ {
    for j := i + 1; j < len(itens); j++ {
      if itens[j].prio < itens[i].prio {
        itens[i], itens[j] = itens[j], itens[i]
      }
    }
  }
  for _, item := range itens {
    fmt.Println("Item:", item.nome)
  }
}
`,
      testes: [{ saida: 'Item: a\nItem: b\nItem: c' }],
    }),
    problema({
      id: 'concorrencia-prob-load-balancer',
      titulo: 'Load Balancer',
      dificuldade: 'medio',
      enunciado: '<p>Load balancer round-robin. 3 servers, 7 requests. Distribua em ordem circular. Imprima "Server N: req M".</p>',
      dica: 'Use operador modulo para ciclar entre servers.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: load balancer round-robin
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  servers := 3
  requests := 7
  for r := 1; r <= requests; r++ {
    s := (r-1)%servers + 1
    fmt.Println("Server", s, ": req", r)
  }
}
`,
      testes: [{ saida: 'Server 1 : req 1\nServer 2 : req 2\nServer 3 : req 3\nServer 1 : req 4\nServer 2 : req 5\nServer 3 : req 6\nServer 1 : req 7' }],
    }),
    problema({
      id: 'concorrencia-prob-health-checker',
      titulo: 'Health Checker',
      dificuldade: 'medio',
      enunciado: '<p>Health checker. Verifique 3 servicos. Servico 2 esta "down". Imprima "Servico N: up" ou "Servico N: down".</p>',
      dica: 'Verifique condicao para cada servico.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: health check de 3 servicos
}
`,
      solucao: go`
package main

import "fmt"

func status(id int) string {
  if id == 2 {
    return "down"
  }
  return "up"
}

func main() {
  for i := 1; i <= 3; i++ {
    fmt.Println("Servico", i, ":", status(i))
  }
}
`,
      testes: [{ saida: 'Servico 1 : up\nServico 2 : down\nServico 3 : up' }],
    }),
    problema({
      id: 'concorrencia-prob-circuit-breaker',
      titulo: 'Circuit Breaker',
      dificuldade: 'dificil',
      enunciado: '<p>Circuit breaker. Após 3 falhas consecutivas, abra o circuito. 6 tentativas, todas falham. Imprima "Tentativa N: falha" e "Circuito aberto" após a terceira.</p>',
      dica: 'Conte falhas consecutivas e pare quando atingir limite.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: circuit breaker com 3 falhas
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  falhas := 0
  limite := 3
  for i := 1; i <= 6; i++ {
    if falhas >= limite {
      fmt.Println("Circuito aberto")
      break
    }
    fmt.Println("Tentativa", i, ": falha")
    falhas++
  }
}
`,
      testes: [{ saida: 'Tentativa 1 : falha\nTentativa 2 : falha\nTentativa 3 : falha\nCircuito aberto' }],
    }),
    problema({
      id: 'concorrencia-prob-graceful-shutdown',
      titulo: 'Graceful Shutdown',
      dificuldade: 'medio',
      enunciado: '<p>Graceful shutdown. Processe items 1..10. Sinal de shutdown no item 6. Pare graciosamente. Imprima "Processando N" e "Shutdown graciosos".</p>',
      dica: 'Verifique sinal de shutdown a cada iteracao.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: graceful shutdown no item 6
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  shutdown := false
  for i := 1; i <= 10; i++ {
    if shutdown {
      break
    }
    fmt.Println("Processando", i)
    if i == 6 {
      shutdown = true
    }
  }
  fmt.Println("Shutdown gracioso")
}
`,
      testes: [{ saida: 'Processando 1\nProcessando 2\nProcessando 3\nProcessando 4\nProcessando 5\nProcessando 6\nShutdown gracioso' }],
    }),
    problema({
      id: 'concorrencia-prob-metrics-collector',
      titulo: 'Metrics Collector',
      dificuldade: 'medio',
      enunciado: '<p>Colete métricas de 4 operacoes. Tempos: [10,25,15,30]. Calcule media. Imprima "Media: 20".</p>',
      dica: 'Some todos os tempos e divida pela quantidade.',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  tempos := []int{10, 25, 15, 30}
  _ = tempos // TODO: use tempos
  // TODO: calcule media das metricas
}
`,
      solucao: go`
package main

import "fmt"

func main() {
  tempos := []int{10, 25, 15, 30}
  total := 0
  for _, t := range tempos {
    total = total + t
  }
  media := total / len(tempos)
  fmt.Println("Media:", media)
}
`,
      testes: [{ saida: 'Media: 20' }],
    }),
    ...extraConcorrencia,
  ],
};