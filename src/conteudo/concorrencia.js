// Módulo 3: Concorrência. Goroutines, channels, select, sync e padrões concorrentes.
import { go, licao, problema } from './util.js';

export const moduloConcorrencia = {
 id: 'concorrencia',
 titulo: 'Concorrência',
 icone: '⚡',
 descricao: 'Goroutines, channels, select, pacotes sync e padrões concorrentes em Go.',
 itens: [
 licao({
 id: 'licao-goroutines',
 titulo: 'Goroutines',
 resumo: `
 <p>Uma <b>goroutine</b> é uma thread leve gerenciada pelo runtime do Go. Basta prefixar uma chamada de função com <code>go</code> para executá-la concorrentemente.</p>
 <ul>
 <li><code>go func() { ... }()</code> inicia uma goroutine anônima.</li>
 <li>Milhares de goroutines podem rodar simultaneamente com baixo custo de memória.</li>
 <li>O scheduler do Go multiplexa goroutines sobre threads do SO automaticamente.</li>
 </ul>`,
 codigo: go`
 package main

 import (
 "fmt"
 "time"
 )

 func saudacao(nome string) {
 time.Sleep(1 * time.Second)
 fmt.Println("Olá,", nome)
 }

 func main() {
 go saudacao("Alice")
 go saudacao("Bob")
 time.Sleep(2 * time.Second)
 fmt.Println("Fim")
 }
 `,
 }),
 licao({
 id: 'licao-channels',
 titulo: 'Channels',
 resumo: `
 <p>Channels são canais tipados para comunicação entre goroutines. Eles sincronizam envio e recebimento de valores.</p>
 <ul>
 <li><code>ch := make(chan int)</code> cria um channel não-buffered.</li>
 <li><code>ch <- valor</code> envia; <code>valor := <-ch</code> recebe.</li>
 <li><code>close(ch)</code> fecha o channel; receivers podem usar <code>v, ok := <-ch</code>.</li>
 <li>Channels buffered (<code>make(chan int, n)</code>) permitem até n envios sem bloqueio.</li>
 </ul>`,
 codigo: go`
 package main

 import "fmt"

 func produtor(ch chan<- int) {
 for i := 1; i <= 5; i++ {
 ch <- i
 }
 close(ch)
 }

 func main() {
 ch := make(chan int)
 go produtor(ch)
 for v := range ch {
 fmt.Println("Recebido:", v)
 }
 }
 `,
 }),
 problema({
 id: 'prob-contador-concorrente',
 titulo: 'Contador concorrente seguro',
 dificuldade: 'medio',
 enunciado: `
 <p>Crie um contador que pode ser incrementado por múltiplas goroutines simultaneamente sem race condition.</p>
 <ul>
 <li>Use <code>sync.Mutex</code> para proteger o acesso ao contador.</li>
 <li>Lance 10 goroutines, cada uma incrementando o contador 100 vezes.</li>
 <li>Imprima o valor final (deve ser 1000).</li>
 </ul>`,
 dica: 'Chame <code>mu.Lock()</code> antes de modificar e <code>mu.Unlock()</code> depois. Ou use <code>defer mu.Unlock()</code> logo após o Lock.',
 inicial: go`
 package main

 import (
 "fmt"
 "sync"
 )

 // TODO: implemente o contador seguro com Mutex

 func main() {
 // TODO: lance 10 goroutines, cada uma incrementando 100 vezes
 // TODO: imprima o resultado final
 }
 `,
 solucao: go`
 package main

 import (
 "fmt"
 "sync"
 )

 var (
 contador int
 mu sync.Mutex
 )

 func incrementar(wg *sync.WaitGroup) {
 defer wg.Done()
 for i := 0; i < 100; i++ {
 mu.Lock()
 contador++
 mu.Unlock()
 }
 }

 func main() {
 var wg sync.WaitGroup
 for i := 0; i < 10; i++ {
 wg.Add(1)
 go incrementar(&wg)
 }
 wg.Wait()
 fmt.Println(contador)
 }
 `,
 testes: [{ entrada: '', saida: '1000' }],
 }),
 ],
};