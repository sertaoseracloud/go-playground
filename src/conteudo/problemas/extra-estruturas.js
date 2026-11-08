// Exercícios extras do módulo estruturas. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraEstruturas = [
  problema({
    id: 'estruturas-prob-soma-array',
    titulo: "Soma de um array",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>soma(nums [5]int)</code>: devolva a soma dos 5 elementos do array.</p>",
    dica: "Percorra com <code>for _, n := range nums</code> acumulando num total.",
    inicial: go`
package main

import "fmt"

func soma(nums [5]int) int {
  // TODO: implemente
  return 0
}

func main() {
  fmt.Println(soma([5]int{1, 2, 3, 4, 5}))
  fmt.Println(soma([5]int{10, -3, 0, 7, 1}))
}
`,
    solucao: go`
package main

import "fmt"

func soma(nums [5]int) int {
  total := 0
  for _, n := range nums {
    total += n
  }
  return total
}

func main() {
  fmt.Println(soma([5]int{1, 2, 3, 4, 5}))
  fmt.Println(soma([5]int{10, -3, 0, 7, 1}))
}
`,
    testes: [{ saida: "15\n15" }],
  }),
  problema({
    id: 'estruturas-prob-maior-menor',
    titulo: "Maior e menor do slice",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>extremos(nums)</code>: devolva o menor e o maior valor do slice (que nunca vem vazio).</p>",
    dica: "Comece com <code>menor, maior := nums[0], nums[0]</code> e compare com os demais.",
    inicial: go`
package main

import "fmt"

func extremos(nums []int) (int, int) {
  // TODO: implemente
  return 0, 0
}

func main() {
  fmt.Println(extremos([]int{7, 2, 9, 4}))
  fmt.Println(extremos([]int{-5}))
}
`,
    solucao: go`
package main

import "fmt"

func extremos(nums []int) (int, int) {
  menor, maior := nums[0], nums[0]
  for _, n := range nums[1:] {
    if n < menor {
      menor = n
    }
    if n > maior {
      maior = n
    }
  }
  return menor, maior
}

func main() {
  fmt.Println(extremos([]int{7, 2, 9, 4}))
  fmt.Println(extremos([]int{-5}))
}
`,
    testes: [{ saida: "2 9\n-5 -5" }],
  }),
  problema({
    id: 'estruturas-prob-inverter-slice',
    titulo: "Invertendo um slice",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>inverter(s)</code>: inverta o slice <b>no lugar</b>, trocando os elementos das pontas.</p>",
    dica: "Use dois índices: <code>for i, j := 0, len(s)-1; i &lt; j; i, j = i+1, j-1 { s[i], s[j] = s[j], s[i] }</code>.",
    inicial: go`
package main

import "fmt"

func inverter(s []string) {
  // TODO: implemente
}

func main() {
  dias := []string{"seg", "ter", "qua", "qui"}
  inverter(dias)
  fmt.Println(dias)
  um := []string{"só"}
  inverter(um)
  fmt.Println(um)
}
`,
    solucao: go`
package main

import "fmt"

func inverter(s []string) {
  for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
    s[i], s[j] = s[j], s[i]
  }
}

func main() {
  dias := []string{"seg", "ter", "qua", "qui"}
  inverter(dias)
  fmt.Println(dias)
  um := []string{"só"}
  inverter(um)
  fmt.Println(um)
}
`,
    testes: [{ saida: "[qui qua ter seg]\n[só]" }],
  }),
  problema({
    id: 'estruturas-prob-filtrar-pares',
    titulo: "Filtrando pares",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>pares(nums)</code>: devolva um <b>novo</b> slice só com os números pares, na mesma ordem.</p>",
    dica: "Comece com <code>out := []int{}</code> e use <code>append</code> quando <code>n%2 == 0</code>.",
    inicial: go`
package main

import "fmt"

func pares(nums []int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(pares([]int{1, 2, 3, 4, 5, 6}))
  fmt.Println(pares([]int{1, 3, 5}))
}
`,
    solucao: go`
package main

import "fmt"

func pares(nums []int) []int {
  out := []int{}
  for _, n := range nums {
    if n%2 == 0 {
      out = append(out, n)
    }
  }
  return out
}

func main() {
  fmt.Println(pares([]int{1, 2, 3, 4, 5, 6}))
  fmt.Println(pares([]int{1, 3, 5}))
}
`,
    testes: [{ saida: "[2 4 6]\n[]" }],
  }),
  problema({
    id: 'estruturas-prob-remover-indice',
    titulo: "Removendo pelo índice",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>remover(s, i)</code>: devolva o slice sem o elemento da posição <code>i</code>, mantendo a ordem dos demais.</p>",
    dica: "<code>append(s[:i], s[i+1:]...)</code> junta o que vem antes e depois do índice.",
    inicial: go`
package main

import "fmt"

func remover(s []int, i int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(remover([]int{10, 20, 30, 40}, 1))
  fmt.Println(remover([]int{10, 20, 30, 40}, 0))
  fmt.Println(remover([]int{10, 20, 30, 40}, 3))
}
`,
    solucao: go`
package main

import "fmt"

func remover(s []int, i int) []int {
  return append(s[:i], s[i+1:]...)
}

func main() {
  fmt.Println(remover([]int{10, 20, 30, 40}, 1))
  fmt.Println(remover([]int{10, 20, 30, 40}, 0))
  fmt.Println(remover([]int{10, 20, 30, 40}, 3))
}
`,
    testes: [{ saida: "[10 30 40]\n[20 30 40]\n[10 20 30]" }],
  }),
  problema({
    id: 'estruturas-prob-inserir-indice',
    titulo: "Inserindo no meio",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>inserir(s, i, v)</code>: devolva o slice com <code>v</code> na posição <code>i</code>, empurrando os demais para a direita.</p>",
    dica: "Aumente com <code>s = append(s, 0)</code>, desloque com <code>copy(s[i+1:], s[i:])</code> e grave <code>s[i] = v</code>.",
    inicial: go`
package main

import "fmt"

func inserir(s []int, i, v int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(inserir([]int{1, 2, 4}, 2, 3))
  fmt.Println(inserir([]int{2, 3}, 0, 1))
  fmt.Println(inserir([]int{1, 2}, 2, 3))
}
`,
    solucao: go`
package main

import "fmt"

func inserir(s []int, i, v int) []int {
  s = append(s, 0)
  copy(s[i+1:], s[i:])
  s[i] = v
  return s
}

func main() {
  fmt.Println(inserir([]int{1, 2, 4}, 2, 3))
  fmt.Println(inserir([]int{2, 3}, 0, 1))
  fmt.Println(inserir([]int{1, 2}, 2, 3))
}
`,
    testes: [{ saida: "[1 2 3 4]\n[1 2 3]\n[1 2 3]" }],
  }),
  problema({
    id: 'estruturas-prob-sem-repetidos',
    titulo: "Removendo repetidos",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>unicos(s)</code>: devolva os valores sem repetição, na ordem da <b>primeira</b> aparição.</p>",
    dica: "Use um <code>map[string]bool</code> como conjunto de \"já vistos\".",
    inicial: go`
package main

import "fmt"

func unicos(s []string) []string {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(unicos([]string{"go", "py", "go", "rs", "py", "go"}))
  fmt.Println(unicos([]string{"a"}))
}
`,
    solucao: go`
package main

import "fmt"

func unicos(s []string) []string {
  vistos := map[string]bool{}
  out := []string{}
  for _, v := range s {
    if !vistos[v] {
      vistos[v] = true
      out = append(out, v)
    }
  }
  return out
}

func main() {
  fmt.Println(unicos([]string{"go", "py", "go", "rs", "py", "go"}))
  fmt.Println(unicos([]string{"a"}))
}
`,
    testes: [{ saida: "[go py rs]\n[a]" }],
  }),
  problema({
    id: 'estruturas-prob-rotacionar',
    titulo: "Rotacionando um slice",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>rotacionar(s, k)</code>: devolva um novo slice com os elementos deslocados <code>k</code> posições para a esquerda (circularmente).</p>",
    dica: "Normalize com <code>k %= len(s)</code> e junte <code>s[k:]</code> com <code>s[:k]</code> num slice novo.",
    inicial: go`
package main

import "fmt"

func rotacionar(s []int, k int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(rotacionar([]int{1, 2, 3, 4, 5}, 2))
  fmt.Println(rotacionar([]int{1, 2, 3, 4, 5}, 7))
  fmt.Println(rotacionar([]int{1, 2, 3}, 0))
}
`,
    solucao: go`
package main

import "fmt"

func rotacionar(s []int, k int) []int {
  if len(s) == 0 {
    return s
  }
  k %= len(s)
  out := make([]int, 0, len(s))
  out = append(out, s[k:]...)
  return append(out, s[:k]...)
}

func main() {
  fmt.Println(rotacionar([]int{1, 2, 3, 4, 5}, 2))
  fmt.Println(rotacionar([]int{1, 2, 3, 4, 5}, 7))
  fmt.Println(rotacionar([]int{1, 2, 3}, 0))
}
`,
    testes: [{ saida: "[3 4 5 1 2]\n[3 4 5 1 2]\n[1 2 3]" }],
  }),
  problema({
    id: 'estruturas-prob-pedacos',
    titulo: "Dividindo em pedaços",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>pedacos(s, n)</code>: divida o slice em grupos de até <code>n</code> elementos (o último pode ser menor).</p>",
    dica: "Ande de <code>n</code> em <code>n</code>: <code>for i := 0; i &lt; len(s); i += n</code> e limite o fim a <code>len(s)</code>.",
    inicial: go`
package main

import "fmt"

func pedacos(s []int, n int) [][]int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(pedacos([]int{1, 2, 3, 4, 5, 6, 7}, 3))
  fmt.Println(pedacos([]int{1, 2, 3, 4}, 2))
}
`,
    solucao: go`
package main

import "fmt"

func pedacos(s []int, n int) [][]int {
  out := [][]int{}
  for i := 0; i < len(s); i += n {
    fim := i + n
    if fim > len(s) {
      fim = len(s)
    }
    out = append(out, s[i:fim])
  }
  return out
}

func main() {
  fmt.Println(pedacos([]int{1, 2, 3, 4, 5, 6, 7}, 3))
  fmt.Println(pedacos([]int{1, 2, 3, 4}, 2))
}
`,
    testes: [{ saida: "[[1 2 3] [4 5 6] [7]]\n[[1 2] [3 4]]" }],
  }),
  problema({
    id: 'estruturas-prob-copia-independente',
    titulo: "Cópia independente",
    dificuldade: 'medio',
    enunciado: "<p>Fatiar (<code>s[:]</code>) não copia: os dois slices dividem o mesmo array.</p>\n<p>Implemente <code>clonar(s)</code>: devolva uma cópia que <b>não</b> muda quando o original muda.</p>",
    dica: "<code>c := make([]int, len(s))</code> e <code>copy(c, s)</code>.",
    inicial: go`
package main

import "fmt"

func clonar(s []int) []int {
  // TODO: implemente
  return nil
}

func main() {
  original := []int{1, 2, 3}
  copia := clonar(original)
  original[0] = 99
  fmt.Println(original)
  fmt.Println(copia)
}
`,
    solucao: go`
package main

import "fmt"

func clonar(s []int) []int {
  c := make([]int, len(s))
  copy(c, s)
  return c
}

func main() {
  original := []int{1, 2, 3}
  copia := clonar(original)
  original[0] = 99
  fmt.Println(original)
  fmt.Println(copia)
}
`,
    testes: [{ saida: "[99 2 3]\n[1 2 3]" }],
  }),
  problema({
    id: 'estruturas-prob-matriz-soma',
    titulo: "Soma das linhas da matriz",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>somaLinhas(m)</code>: devolva um slice com a soma de cada linha da matriz.</p>",
    dica: "Dois laços: o externo percorre as linhas, o interno soma os valores da linha.",
    inicial: go`
package main

import "fmt"

func somaLinhas(m [][]int) []int {
  // TODO: implemente
  return nil
}

func main() {
  m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
  fmt.Println(somaLinhas(m))
}
`,
    solucao: go`
package main

import "fmt"

func somaLinhas(m [][]int) []int {
  out := make([]int, len(m))
  for i, linha := range m {
    for _, v := range linha {
      out[i] += v
    }
  }
  return out
}

func main() {
  m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
  fmt.Println(somaLinhas(m))
}
`,
    testes: [{ saida: "[6 15 24]" }],
  }),
  problema({
    id: 'estruturas-prob-transposta',
    titulo: "Matriz transposta",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>transpor(m)</code>: troque linhas por colunas. Uma matriz 2×3 vira 3×2.</p>",
    dica: "Crie <code>t</code> com <code>len(m[0])</code> linhas de tamanho <code>len(m)</code> e faça <code>t[j][i] = m[i][j]</code>.",
    inicial: go`
package main

import "fmt"

func transpor(m [][]int) [][]int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(transpor([][]int{{1, 2, 3}, {4, 5, 6}}))
}
`,
    solucao: go`
package main

import "fmt"

func transpor(m [][]int) [][]int {
  t := make([][]int, len(m[0]))
  for j := range t {
    t[j] = make([]int, len(m))
    for i := range m {
      t[j][i] = m[i][j]
    }
  }
  return t
}

func main() {
  fmt.Println(transpor([][]int{{1, 2, 3}, {4, 5, 6}}))
}
`,
    testes: [{ saida: "[[1 4] [2 5] [3 6]]" }],
  }),
  problema({
    id: 'estruturas-prob-achatar',
    titulo: "Achatando uma matriz",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>achatar(m)</code>: junte todas as linhas da matriz num único slice.</p>",
    dica: "<code>out = append(out, linha...)</code> para cada linha.",
    inicial: go`
package main

import "fmt"

func achatar(m [][]string) []string {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(achatar([][]string{{"a", "b"}, {}, {"c"}, {"d", "e"}}))
}
`,
    solucao: go`
package main

import "fmt"

func achatar(m [][]string) []string {
  out := []string{}
  for _, linha := range m {
    out = append(out, linha...)
  }
  return out
}

func main() {
  fmt.Println(achatar([][]string{{"a", "b"}, {}, {"c"}, {"d", "e"}}))
}
`,
    testes: [{ saida: "[a b c d e]" }],
  }),
  problema({
    id: 'estruturas-prob-contar-palavras',
    titulo: "Contando palavras",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>contar(texto)</code>: devolva um <code>map</code> com quantas vezes cada palavra aparece (ignore maiúsculas).</p>",
    dica: "<code>strings.Fields(strings.ToLower(texto))</code> separa as palavras; depois <code>m[p]++</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

func contar(texto string) map[string]int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(contar("Go é simples e Go é rápido"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func contar(texto string) map[string]int {
  m := map[string]int{}
  for _, p := range strings.Fields(strings.ToLower(texto)) {
    m[p]++
  }
  return m
}

func main() {
  fmt.Println(contar("Go é simples e Go é rápido"))
}
`,
    testes: [{ saida: "map[e:1 go:2 rápido:1 simples:1 é:2]" }],
  }),
  problema({
    id: 'estruturas-prob-chaves-ordenadas',
    titulo: "Chaves do map em ordem",
    dificuldade: 'facil',
    enunciado: "<p>A ordem de um <code>range</code> sobre map é aleatória. Implemente <code>chaves(m)</code>: devolva as chaves em ordem alfabética.</p>",
    dica: "Junte as chaves num slice e chame <code>sort.Strings</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort".

func chaves(m map[string]int) []string {
  // TODO: implemente
  return nil
}

func main() {
  estoque := map[string]int{"uva": 3, "banana": 12, "maçã": 5, "abacaxi": 1}
  for _, k := range chaves(estoque) {
    fmt.Println(k, estoque[k])
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
)

func chaves(m map[string]int) []string {
  out := make([]string, 0, len(m))
  for k := range m {
    out = append(out, k)
  }
  sort.Strings(out)
  return out
}

func main() {
  estoque := map[string]int{"uva": 3, "banana": 12, "maçã": 5, "abacaxi": 1}
  for _, k := range chaves(estoque) {
    fmt.Println(k, estoque[k])
  }
}
`,
    testes: [{ saida: "abacaxi 1\nbanana 12\nmaçã 5\nuva 3" }],
  }),
  problema({
    id: 'estruturas-prob-agrupar',
    titulo: "Agrupando por inicial",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>agrupar(nomes)</code>: devolva um <code>map[string][]string</code> que agrupa os nomes pela primeira letra.</p>",
    dica: "<code>ini := string(nome[0])</code> e <code>m[ini] = append(m[ini], nome)</code> (append funciona com slice nil).",
    inicial: go`
package main

import "fmt"

func agrupar(nomes []string) map[string][]string {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(agrupar([]string{"Ana", "Bia", "Alan", "Caio", "Beto"}))
}
`,
    solucao: go`
package main

import "fmt"

func agrupar(nomes []string) map[string][]string {
  m := map[string][]string{}
  for _, n := range nomes {
    ini := string(n[0])
    m[ini] = append(m[ini], n)
  }
  return m
}

func main() {
  fmt.Println(agrupar([]string{"Ana", "Bia", "Alan", "Caio", "Beto"}))
}
`,
    testes: [{ saida: "map[A:[Ana Alan] B:[Bia Beto] C:[Caio]]" }],
  }),
  problema({
    id: 'estruturas-prob-inverter-map',
    titulo: "Invertendo um map",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>inverter(m)</code>: troque chaves por valores (os valores são únicos).</p>",
    dica: "Crie um map novo e faça <code>out[v] = k</code> para cada par.",
    inicial: go`
package main

import "fmt"

func inverter(m map[string]string) map[string]string {
  // TODO: implemente
  return nil
}

func main() {
  siglas := map[string]string{"PE": "Pernambuco", "BA": "Bahia", "CE": "Ceará"}
  fmt.Println(inverter(siglas))
}
`,
    solucao: go`
package main

import "fmt"

func inverter(m map[string]string) map[string]string {
  out := make(map[string]string, len(m))
  for k, v := range m {
    out[v] = k
  }
  return out
}

func main() {
  siglas := map[string]string{"PE": "Pernambuco", "BA": "Bahia", "CE": "Ceará"}
  fmt.Println(inverter(siglas))
}
`,
    testes: [{ saida: "map[Bahia:BA Ceará:CE Pernambuco:PE]" }],
  }),
  problema({
    id: 'estruturas-prob-chave-existe',
    titulo: "A chave existe?",
    dificuldade: 'facil',
    enunciado: "<p>Ler uma chave que não existe devolve o valor zero. Implemente <code>preco(tabela, item)</code>: devolva <code>\"R$ X\"</code> se o item existir e <code>\"indisponível\"</code> se não existir.</p>\n<p>Atenção: um item pode existir com preço 0.</p>",
    dica: "Use a forma com dois valores: <code>v, ok := tabela[item]</code>.",
    inicial: go`
package main

import "fmt"

func preco(tabela map[string]float64, item string) string {
  // TODO: implemente
  return ""
}

func main() {
  tabela := map[string]float64{"café": 4.5, "água": 0}
  for _, item := range []string{"café", "água", "suco"} {
    fmt.Println(item, preco(tabela, item))
  }
}
`,
    solucao: go`
package main

import "fmt"

func preco(tabela map[string]float64, item string) string {
  v, ok := tabela[item]
  if !ok {
    return "indisponível"
  }
  return fmt.Sprintf("R$ %.2f", v)
}

func main() {
  tabela := map[string]float64{"café": 4.5, "água": 0}
  for _, item := range []string{"café", "água", "suco"} {
    fmt.Println(item, preco(tabela, item))
  }
}
`,
    testes: [{ saida: "café R$ 4.50\nágua R$ 0.00\nsuco indisponível" }],
  }),
  problema({
    id: 'estruturas-prob-intersecao',
    titulo: "Interseção de conjuntos",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>intersecao(a, b)</code>: devolva os elementos presentes nos dois slices, em ordem crescente e sem repetição.</p>",
    dica: "Monte um conjunto com <code>a</code> (<code>map[int]bool</code>), percorra <code>b</code> e ordene o resultado com <code>sort.Ints</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort".

func intersecao(a, b []int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(intersecao([]int{5, 1, 3, 7, 3}, []int{3, 7, 7, 9, 1}))
  fmt.Println(intersecao([]int{1, 2}, []int{3, 4}))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
)

func intersecao(a, b []int) []int {
  emA := map[int]bool{}
  for _, v := range a {
    emA[v] = true
  }
  vistos := map[int]bool{}
  out := []int{}
  for _, v := range b {
    if emA[v] && !vistos[v] {
      vistos[v] = true
      out = append(out, v)
    }
  }
  sort.Ints(out)
  return out
}

func main() {
  fmt.Println(intersecao([]int{5, 1, 3, 7, 3}, []int{3, 7, 7, 9, 1}))
  fmt.Println(intersecao([]int{1, 2}, []int{3, 4}))
}
`,
    testes: [{ saida: "[1 3 7]\n[]" }],
  }),
  problema({
    id: 'estruturas-prob-metodos-retangulo',
    titulo: "Métodos de um retângulo",
    dificuldade: 'facil',
    enunciado: "<p>Implemente os métodos <code>Area</code> e <code>Perimetro</code> da struct <code>Retangulo</code>.</p>",
    dica: "Área = largura × altura; perímetro = 2 × (largura + altura).",
    inicial: go`
package main

import "fmt"

type Retangulo struct {
  Largura, Altura float64
}

func (r Retangulo) Area() float64 {
  // TODO: implemente
  return 0
}

func (r Retangulo) Perimetro() float64 {
  // TODO: implemente
  return 0
}

func main() {
  r := Retangulo{Largura: 3, Altura: 4.5}
  fmt.Println(r.Area(), r.Perimetro())
}
`,
    solucao: go`
package main

import "fmt"

type Retangulo struct {
  Largura, Altura float64
}

func (r Retangulo) Area() float64 {
  return r.Largura * r.Altura
}

func (r Retangulo) Perimetro() float64 {
  return 2 * (r.Largura + r.Altura)
}

func main() {
  r := Retangulo{Largura: 3, Altura: 4.5}
  fmt.Println(r.Area(), r.Perimetro())
}
`,
    testes: [{ saida: "13.5 15" }],
  }),
  problema({
    id: 'estruturas-prob-receptor-ponteiro',
    titulo: "Receptor ponteiro",
    dificuldade: 'facil',
    enunciado: "<p>Um método com receptor <b>valor</b> recebe uma cópia: as mudanças se perdem.</p>\n<p>Implemente <code>Marcar(pontos)</code> com receptor <b>ponteiro</b>, somando os pontos ao total.</p>",
    dica: "A assinatura já está como <code>func (p *Placar) Marcar(pontos int)</code>: basta <code>p.Total += pontos</code>.",
    inicial: go`
package main

import "fmt"

type Placar struct {
  Time  string
  Total int
}

func (p *Placar) Marcar(pontos int) {
  // TODO: implemente
}

func main() {
  p := Placar{Time: "Sertão FC"}
  p.Marcar(3)
  p.Marcar(1)
  p.Marcar(3)
  fmt.Println(p.Time, p.Total)
}
`,
    solucao: go`
package main

import "fmt"

type Placar struct {
  Time  string
  Total int
}

func (p *Placar) Marcar(pontos int) {
  p.Total += pontos
}

func main() {
  p := Placar{Time: "Sertão FC"}
  p.Marcar(3)
  p.Marcar(1)
  p.Marcar(3)
  fmt.Println(p.Time, p.Total)
}
`,
    testes: [{ saida: "Sertão FC 7" }],
  }),
  problema({
    id: 'estruturas-prob-embedding',
    titulo: "Composição com embedding",
    dificuldade: 'medio',
    enunciado: "<p><code>Funcionario</code> embute <code>Pessoa</code>, então ganha os campos e métodos dela.</p>\n<p>Implemente <code>Apresentar</code> (devolve <code>Sou NOME</code>) e <code>Cracha</code> (devolve <code>NOME - CARGO</code>, usando os campos promovidos).</p>",
    dica: "Dentro de <code>Cracha</code>, <code>f.Nome</code> funciona porque o campo vem da <code>Pessoa</code> embutida.",
    inicial: go`
package main

import "fmt"

type Pessoa struct {
  Nome string
}

func (p Pessoa) Apresentar() string {
  // TODO: implemente
  return ""
}

type Funcionario struct {
  Pessoa
  Cargo string
}

func (f Funcionario) Cracha() string {
  // TODO: implemente
  return ""
}

func main() {
  f := Funcionario{Pessoa: Pessoa{Nome: "Rita"}, Cargo: "Engenheira"}
  fmt.Println(f.Apresentar())
  fmt.Println(f.Cracha())
}
`,
    solucao: go`
package main

import "fmt"

type Pessoa struct {
  Nome string
}

func (p Pessoa) Apresentar() string {
  return "Sou " + p.Nome
}

type Funcionario struct {
  Pessoa
  Cargo string
}

func (f Funcionario) Cracha() string {
  return f.Nome + " - " + f.Cargo
}

func main() {
  f := Funcionario{Pessoa: Pessoa{Nome: "Rita"}, Cargo: "Engenheira"}
  fmt.Println(f.Apresentar())
  fmt.Println(f.Cracha())
}
`,
    testes: [{ saida: "Sou Rita\nRita - Engenheira" }],
  }),
  problema({
    id: 'estruturas-prob-ordenar-structs',
    titulo: "Ordenando structs",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>ordenar(alunos)</code>: ordene por nota <b>decrescente</b>; em caso de empate, por nome em ordem alfabética.</p>",
    dica: "<code>sort.Slice(a, func(i, j int) bool { ... })</code>: compare as notas e, se iguais, os nomes.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort".

type Aluno struct {
  Nome string
  Nota int
}

func ordenar(a []Aluno) {
  // TODO: implemente
}

func main() {
  turma := []Aluno{{"Caio", 8}, {"Ana", 9}, {"Bia", 8}, {"Davi", 10}}
  ordenar(turma)
  for _, a := range turma {
    fmt.Println(a.Nome, a.Nota)
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
)

type Aluno struct {
  Nome string
  Nota int
}

func ordenar(a []Aluno) {
  sort.Slice(a, func(i, j int) bool {
    if a[i].Nota != a[j].Nota {
      return a[i].Nota > a[j].Nota
    }
    return a[i].Nome < a[j].Nome
  })
}

func main() {
  turma := []Aluno{{"Caio", 8}, {"Ana", 9}, {"Bia", 8}, {"Davi", 10}}
  ordenar(turma)
  for _, a := range turma {
    fmt.Println(a.Nome, a.Nota)
  }
}
`,
    testes: [{ saida: "Davi 10\nAna 9\nBia 8\nCaio 8" }],
  }),
  problema({
    id: 'estruturas-prob-pilha',
    titulo: "Pilha (stack)",
    dificuldade: 'medio',
    enunciado: "<p>Implemente a pilha: <code>Empilhar(v)</code> coloca no topo e <code>Desempilhar()</code> tira do topo, devolvendo o valor e <code>true</code> (ou <code>0, false</code> se estiver vazia).</p>",
    dica: "O topo é o fim do slice: <code>v := p.itens[len(p.itens)-1]</code> e <code>p.itens = p.itens[:len(p.itens)-1]</code>.",
    inicial: go`
package main

import "fmt"

type Pilha struct {
  itens []int
}

func (p *Pilha) Empilhar(v int) {
  // TODO: implemente
}

func (p *Pilha) Desempilhar() (int, bool) {
  // TODO: implemente
  return 0, false
}

func main() {
  p := &Pilha{}
  p.Empilhar(1)
  p.Empilhar(2)
  p.Empilhar(3)
  for i := 0; i < 4; i++ {
    fmt.Println(p.Desempilhar())
  }
}
`,
    solucao: go`
package main

import "fmt"

type Pilha struct {
  itens []int
}

func (p *Pilha) Empilhar(v int) {
  p.itens = append(p.itens, v)
}

func (p *Pilha) Desempilhar() (int, bool) {
  if len(p.itens) == 0 {
    return 0, false
  }
  v := p.itens[len(p.itens)-1]
  p.itens = p.itens[:len(p.itens)-1]
  return v, true
}

func main() {
  p := &Pilha{}
  p.Empilhar(1)
  p.Empilhar(2)
  p.Empilhar(3)
  for i := 0; i < 4; i++ {
    fmt.Println(p.Desempilhar())
  }
}
`,
    testes: [{ saida: "3 true\n2 true\n1 true\n0 false" }],
  }),
  problema({
    id: 'estruturas-prob-fila',
    titulo: "Fila (queue)",
    dificuldade: 'medio',
    enunciado: "<p>Implemente a fila de atendimento: <code>Entrar(nome)</code> coloca no fim e <code>Atender()</code> tira do começo (ou devolve <code>\"\"</code> se estiver vazia).</p>",
    dica: "Tire do começo com <code>v := f.itens[0]</code> e <code>f.itens = f.itens[1:]</code>.",
    inicial: go`
package main

import "fmt"

type Fila struct {
  itens []string
}

func (f *Fila) Entrar(nome string) {
  // TODO: implemente
}

func (f *Fila) Atender() string {
  // TODO: implemente
  return ""
}

func main() {
  f := &Fila{}
  f.Entrar("Ana")
  f.Entrar("Bia")
  fmt.Println(f.Atender())
  f.Entrar("Caio")
  fmt.Println(f.Atender())
  fmt.Println(f.Atender())
  fmt.Printf("%q\\n", f.Atender())
}
`,
    solucao: go`
package main

import "fmt"

type Fila struct {
  itens []string
}

func (f *Fila) Entrar(nome string) {
  f.itens = append(f.itens, nome)
}

func (f *Fila) Atender() string {
  if len(f.itens) == 0 {
    return ""
  }
  v := f.itens[0]
  f.itens = f.itens[1:]
  return v
}

func main() {
  f := &Fila{}
  f.Entrar("Ana")
  f.Entrar("Bia")
  fmt.Println(f.Atender())
  f.Entrar("Caio")
  fmt.Println(f.Atender())
  fmt.Println(f.Atender())
  fmt.Printf("%q\\n", f.Atender())
}
`,
    testes: [{ saida: "Ana\nBia\nCaio\n\"\"" }],
  }),
  problema({
    id: 'estruturas-prob-parenteses',
    titulo: "Parênteses balanceados",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>balanceado(s)</code>: diga se os <code>()</code>, <code>[]</code> e <code>{}</code> abrem e fecham na ordem certa.</p>",
    dica: "Use uma pilha de runas: empilhe ao abrir; ao fechar, o topo precisa ser o par correspondente.",
    inicial: go`
package main

import "fmt"

func balanceado(s string) bool {
  // TODO: implemente
  return false
}

func main() {
  for _, s := range []string{"(a[b]{c})", "([)]", "((", "f(x) = {y[0]}"} {
    fmt.Println(s, balanceado(s))
  }
}
`,
    solucao: go`
package main

import "fmt"

func balanceado(s string) bool {
  pares := map[rune]rune{')': '(', ']': '[', '}': '{'}
  pilha := []rune{}
  for _, c := range s {
    switch c {
    case '(', '[', '{':
      pilha = append(pilha, c)
    case ')', ']', '}':
      if len(pilha) == 0 || pilha[len(pilha)-1] != pares[c] {
        return false
      }
      pilha = pilha[:len(pilha)-1]
    }
  }
  return len(pilha) == 0
}

func main() {
  for _, s := range []string{"(a[b]{c})", "([)]", "((", "f(x) = {y[0]}"} {
    fmt.Println(s, balanceado(s))
  }
}
`,
    testes: [{ saida: "(a[b]{c}) true\n([)] false\n(( false\nf(x) = {y[0]} true" }],
  }),
  problema({
    id: 'estruturas-prob-lista-ligada',
    titulo: "Lista ligada",
    dificuldade: 'medio',
    enunciado: "<p>Implemente a lista ligada: <code>Adicionar(v)</code> coloca um nó no fim e <code>Itens()</code> devolve os valores do começo ao fim.</p>",
    dica: "Se <code>l.inicio == nil</code>, o novo nó vira o início; senão, ande com <code>n := l.inicio; for n.prox != nil { n = n.prox }</code>.",
    inicial: go`
package main

import "fmt"

type No struct {
  valor int
  prox  *No
}

type Lista struct {
  inicio *No
}

func (l *Lista) Adicionar(v int) {
  // TODO: implemente
}

func (l *Lista) Itens() []int {
  // TODO: implemente
  return nil
}

func main() {
  l := &Lista{}
  fmt.Println(l.Itens())
  for _, v := range []int{4, 8, 15, 16} {
    l.Adicionar(v)
  }
  fmt.Println(l.Itens())
}
`,
    solucao: go`
package main

import "fmt"

type No struct {
  valor int
  prox  *No
}

type Lista struct {
  inicio *No
}

func (l *Lista) Adicionar(v int) {
  novo := &No{valor: v}
  if l.inicio == nil {
    l.inicio = novo
    return
  }
  n := l.inicio
  for n.prox != nil {
    n = n.prox
  }
  n.prox = novo
}

func (l *Lista) Itens() []int {
  out := []int{}
  for n := l.inicio; n != nil; n = n.prox {
    out = append(out, n.valor)
  }
  return out
}

func main() {
  l := &Lista{}
  fmt.Println(l.Itens())
  for _, v := range []int{4, 8, 15, 16} {
    l.Adicionar(v)
  }
  fmt.Println(l.Itens())
}
`,
    testes: [{ saida: "[]\n[4 8 15 16]" }],
  }),
  problema({
    id: 'estruturas-prob-inverter-lista',
    titulo: "Invertendo a lista ligada",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>inverter(inicio)</code>: inverta a lista ligada trocando os ponteiros e devolva o novo início.</p>",
    dica: "Três ponteiros: <code>var ant *No</code>, <code>atual := inicio</code>; a cada passo guarde <code>prox := atual.prox</code>, aponte <code>atual.prox = ant</code> e avance.",
    inicial: go`
package main

import "fmt"

type No struct {
  valor string
  prox  *No
}

func inverter(inicio *No) *No {
  // TODO: implemente
  return nil
}

func imprimir(n *No) {
  for ; n != nil; n = n.prox {
    fmt.Print(n.valor, " ")
  }
  fmt.Println()
}

func main() {
  lista := &No{"a", &No{"b", &No{"c", &No{"d", nil}}}}
  imprimir(lista)
  imprimir(inverter(lista))
}
`,
    solucao: go`
package main

import "fmt"

type No struct {
  valor string
  prox  *No
}

func inverter(inicio *No) *No {
  var ant *No
  atual := inicio
  for atual != nil {
    prox := atual.prox
    atual.prox = ant
    ant = atual
    atual = prox
  }
  return ant
}

func imprimir(n *No) {
  for ; n != nil; n = n.prox {
    fmt.Print(n.valor, " ")
  }
  fmt.Println()
}

func main() {
  lista := &No{"a", &No{"b", &No{"c", &No{"d", nil}}}}
  imprimir(lista)
  imprimir(inverter(lista))
}
`,
    testes: [{ saida: "a b c d\nd c b a" }],
  }),
  problema({
    id: 'estruturas-prob-arvore-busca',
    titulo: "Árvore binária de busca",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>inserir(raiz, v)</code> numa árvore binária de busca (menores à esquerda, maiores ou iguais à direita) e <code>emOrdem(raiz, out)</code>, que percorre esquerda → raiz → direita.</p>\n<p>O percurso em ordem devolve os valores ordenados.</p>",
    dica: "As duas funções são recursivas. Em <code>inserir</code>, se <code>raiz == nil</code>, devolva <code>&amp;Arvore{valor: v}</code>.",
    inicial: go`
package main

import "fmt"

type Arvore struct {
  valor     int
  esq, dir  *Arvore
}

func inserir(raiz *Arvore, v int) *Arvore {
  // TODO: implemente
  return nil
}

func emOrdem(raiz *Arvore, out []int) []int {
  // TODO: implemente
  return nil
}

func main() {
  var raiz *Arvore
  for _, v := range []int{50, 30, 70, 20, 40, 60, 80, 35} {
    raiz = inserir(raiz, v)
  }
  fmt.Println(emOrdem(raiz, nil))
}
`,
    solucao: go`
package main

import "fmt"

type Arvore struct {
  valor     int
  esq, dir  *Arvore
}

func inserir(raiz *Arvore, v int) *Arvore {
  if raiz == nil {
    return &Arvore{valor: v}
  }
  if v < raiz.valor {
    raiz.esq = inserir(raiz.esq, v)
  } else {
    raiz.dir = inserir(raiz.dir, v)
  }
  return raiz
}

func emOrdem(raiz *Arvore, out []int) []int {
  if raiz == nil {
    return out
  }
  out = emOrdem(raiz.esq, out)
  out = append(out, raiz.valor)
  return emOrdem(raiz.dir, out)
}

func main() {
  var raiz *Arvore
  for _, v := range []int{50, 30, 70, 20, 40, 60, 80, 35} {
    raiz = inserir(raiz, v)
  }
  fmt.Println(emOrdem(raiz, nil))
}
`,
    testes: [{ saida: "[20 30 35 40 50 60 70 80]" }],
  }),
  problema({
    id: 'estruturas-prob-busca-binaria',
    titulo: "Busca binária",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>buscar(s, alvo)</code> num slice <b>ordenado</b>: devolva o índice do alvo ou <code>-1</code>. Corte o intervalo pela metade a cada passo.</p>",
    dica: "<code>ini, fim := 0, len(s)-1</code>; enquanto <code>ini &lt;= fim</code>, olhe o meio e descarte a metade errada.",
    inicial: go`
package main

import "fmt"

func buscar(s []int, alvo int) int {
  // TODO: implemente
  return 0
}

func main() {
  s := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
  for _, alvo := range []int{23, 2, 91, 7} {
    fmt.Println(alvo, buscar(s, alvo))
  }
}
`,
    solucao: go`
package main

import "fmt"

func buscar(s []int, alvo int) int {
  ini, fim := 0, len(s)-1
  for ini <= fim {
    meio := (ini + fim) / 2
    switch {
    case s[meio] == alvo:
      return meio
    case s[meio] < alvo:
      ini = meio + 1
    default:
      fim = meio - 1
    }
  }
  return -1
}

func main() {
  s := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
  for _, alvo := range []int{23, 2, 91, 7} {
    fmt.Println(alvo, buscar(s, alvo))
  }
}
`,
    testes: [{ saida: "23 5\n2 0\n91 9\n7 -1" }],
  }),
  problema({
    id: 'estruturas-prob-generico-maximo',
    titulo: "Máximo genérico",
    dificuldade: 'medio',
    enunciado: "<p>Implemente a função genérica <code>Maximo[T cmp.Ordered](s []T) T</code>, que funciona com inteiros, floats e strings.</p>",
    dica: "O corpo é igual ao de um máximo comum: comece com <code>m := s[0]</code> e compare com <code>&gt;</code>.",
    inicial: go`
package main

import (
  "cmp"
  "fmt"
)

func Maximo[T cmp.Ordered](s []T) T {
  // TODO: implemente
  return *new(T)
}

func main() {
  fmt.Println(Maximo([]int{3, 9, 2}))
  fmt.Println(Maximo([]float64{1.5, -2, 0.7}))
  fmt.Println(Maximo([]string{"pera", "uva", "maçã"}))
}
`,
    solucao: go`
package main

import (
  "cmp"
  "fmt"
)

func Maximo[T cmp.Ordered](s []T) T {
  m := s[0]
  for _, v := range s[1:] {
    if v > m {
      m = v
    }
  }
  return m
}

func main() {
  fmt.Println(Maximo([]int{3, 9, 2}))
  fmt.Println(Maximo([]float64{1.5, -2, 0.7}))
  fmt.Println(Maximo([]string{"pera", "uva", "maçã"}))
}
`,
    testes: [{ saida: "9\n1.5\nuva" }],
  }),
  problema({
    id: 'estruturas-prob-generico-map-filter',
    titulo: "Map e Filter genéricos",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>Mapear[T, U any](s []T, f func(T) U) []U</code> e <code>Filtrar[T any](s []T, ok func(T) bool) []T</code>.</p><p>O <code>main</code> chama <code>Mapear[string, int](...)</code> com os tipos escritos: é a instanciação explícita, útil quando a inferência de tipos não consegue deduzir <code>U</code> ou quando você quer deixar o tipo claro para quem lê.</p>",
    dica: "Em <code>Mapear</code>, crie <code>out := make([]U, 0, len(s))</code> e dê <code>append(out, f(v))</code>.",
    inicial: go`
package main

import (
  "fmt"
  "strings"
)

func Mapear[T, U any](s []T, f func(T) U) []U {
  // TODO: implemente
  return nil
}

func Filtrar[T any](s []T, ok func(T) bool) []T {
  // TODO: implemente
  return nil
}

func main() {
  nomes := []string{"ana", "bia", "carlos", "di"}
  fmt.Println(Mapear[string, string](nomes, strings.ToUpper))
  fmt.Println(Mapear[string, int](nomes, func(s string) int { return len(s) }))
  fmt.Println(Filtrar(nomes, func(s string) bool { return len(s) == 3 }))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func Mapear[T, U any](s []T, f func(T) U) []U {
  out := make([]U, 0, len(s))
  for _, v := range s {
    out = append(out, f(v))
  }
  return out
}

func Filtrar[T any](s []T, ok func(T) bool) []T {
  out := []T{}
  for _, v := range s {
    if ok(v) {
      out = append(out, v)
    }
  }
  return out
}

func main() {
  nomes := []string{"ana", "bia", "carlos", "di"}
  fmt.Println(Mapear[string, string](nomes, strings.ToUpper))
  fmt.Println(Mapear[string, int](nomes, func(s string) int { return len(s) }))
  fmt.Println(Filtrar(nomes, func(s string) bool { return len(s) == 3 }))
}
`,
    testes: [{ saida: "[ANA BIA CARLOS DI]\n[3 3 6 2]\n[ana bia]" }],
  }),
  problema({
    id: 'estruturas-prob-pilha-generica',
    titulo: "Pilha genérica",
    dificuldade: 'dificil',
    enunciado: "<p>A <code>Pilha[T]</code> funciona com qualquer tipo. Implemente <code>Empilhar(v T)</code> e <code>Topo() (T, bool)</code>, que olha o topo sem remover.</p>",
    dica: "Para devolver o valor zero de <code>T</code> quando vazia: <code>var zero T; return zero, false</code>.",
    inicial: go`
package main

import "fmt"

type Pilha[T any] struct {
  itens []T
}

func (p *Pilha[T]) Empilhar(v T) {
  // TODO: implemente
}

func (p *Pilha[T]) Topo() (T, bool) {
  // TODO: implemente
  return *new(T), false
}

func main() {
  nums := &Pilha[int]{}
  fmt.Println(nums.Topo())
  nums.Empilhar(7)
  nums.Empilhar(42)
  fmt.Println(nums.Topo())
  palavras := &Pilha[string]{}
  palavras.Empilhar("go")
  fmt.Println(palavras.Topo())
}
`,
    solucao: go`
package main

import "fmt"

type Pilha[T any] struct {
  itens []T
}

func (p *Pilha[T]) Empilhar(v T) {
  p.itens = append(p.itens, v)
}

func (p *Pilha[T]) Topo() (T, bool) {
  if len(p.itens) == 0 {
    var zero T
    return zero, false
  }
  return p.itens[len(p.itens)-1], true
}

func main() {
  nums := &Pilha[int]{}
  fmt.Println(nums.Topo())
  nums.Empilhar(7)
  nums.Empilhar(42)
  fmt.Println(nums.Topo())
  palavras := &Pilha[string]{}
  palavras.Empilhar("go")
  fmt.Println(palavras.Topo())
}
`,
    testes: [{ saida: "0 false\n42 true\ngo true" }],
  }),
  problema({
    id: 'estruturas-prob-heap-top',
    titulo: "Os 3 maiores com heap",
    dificuldade: 'dificil',
    enunciado: "<p>O pacote <code>container/heap</code> mantém o menor elemento no topo. Implemente <code>top3(nums)</code>: devolva os 3 maiores em ordem decrescente usando o <code>MinHeap</code> já pronto.</p>",
    dica: "Dê <code>heap.Push</code> em cada número e, se o heap passar de 3, <code>heap.Pop</code> (sai o menor). No fim, retire tudo e inverta.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "container/heap".

type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any {
  old := *h
  v := old[len(old)-1]
  *h = old[:len(old)-1]
  return v
}

func top3(nums []int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(top3([]int{5, 1, 9, 3, 7, 8, 2}))
  fmt.Println(top3([]int{4, 6}))
}
`,
    solucao: go`
package main

import (
  "container/heap"
  "fmt"
)

type MinHeap []int

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any {
  old := *h
  v := old[len(old)-1]
  *h = old[:len(old)-1]
  return v
}

func top3(nums []int) []int {
  h := &MinHeap{}
  for _, n := range nums {
    heap.Push(h, n)
    if h.Len() > 3 {
      heap.Pop(h)
    }
  }
  out := make([]int, h.Len())
  for i := len(out) - 1; i >= 0; i-- {
    out[i] = heap.Pop(h).(int)
  }
  return out
}

func main() {
  fmt.Println(top3([]int{5, 1, 9, 3, 7, 8, 2}))
  fmt.Println(top3([]int{4, 6}))
}
`,
    testes: [{ saida: "[9 8 7]\n[6 4]" }],
  }),
  problema({
    id: 'estruturas-prob-dois-somam',
    titulo: "Dois números que somam o alvo",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>doisSomam(nums, alvo)</code>: devolva os índices dos dois números que somam <code>alvo</code> (ou <code>-1, -1</code>). Faça em uma só passada, usando um map.</p>",
    dica: "Guarde <code>visto[valor] = indice</code>; para cada número, procure <code>alvo - n</code> no map antes de guardá-lo.",
    inicial: go`
package main

import "fmt"

func doisSomam(nums []int, alvo int) (int, int) {
  // TODO: implemente
  return 0, 0
}

func main() {
  fmt.Println(doisSomam([]int{2, 7, 11, 15}, 9))
  fmt.Println(doisSomam([]int{3, 2, 4}, 6))
  fmt.Println(doisSomam([]int{1, 2}, 10))
}
`,
    solucao: go`
package main

import "fmt"

func doisSomam(nums []int, alvo int) (int, int) {
  visto := map[int]int{}
  for i, n := range nums {
    if j, ok := visto[alvo-n]; ok {
      return j, i
    }
    visto[n] = i
  }
  return -1, -1
}

func main() {
  fmt.Println(doisSomam([]int{2, 7, 11, 15}, 9))
  fmt.Println(doisSomam([]int{3, 2, 4}, 6))
  fmt.Println(doisSomam([]int{1, 2}, 10))
}
`,
    testes: [{ saida: "0 1\n1 2\n-1 -1" }],
  }),
  problema({
    id: 'estruturas-prob-anagrama',
    titulo: "Anagramas",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>anagrama(a, b)</code>: diga se as duas palavras usam exatamente as mesmas letras (ignore maiúsculas e espaços).</p>",
    dica: "Conte as runas de <code>a</code> num <code>map[rune]int</code>, desconte as de <code>b</code> e confira se tudo zerou.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

func anagrama(a, b string) bool {
  // TODO: implemente
  return false
}

func main() {
  fmt.Println(anagrama("Roma", "amor"))
  fmt.Println(anagrama("Iracema", "America"))
  fmt.Println(anagrama("go", "golang"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func anagrama(a, b string) bool {
  conta := map[rune]int{}
  for _, r := range strings.ToLower(a) {
    if r != ' ' {
      conta[r]++
    }
  }
  for _, r := range strings.ToLower(b) {
    if r != ' ' {
      conta[r]--
    }
  }
  for _, n := range conta {
    if n != 0 {
      return false
    }
  }
  return true
}

func main() {
  fmt.Println(anagrama("Roma", "amor"))
  fmt.Println(anagrama("Iracema", "America"))
  fmt.Println(anagrama("go", "golang"))
}
`,
    testes: [{ saida: "true\ntrue\nfalse" }],
  }),
  problema({
    id: 'estruturas-prob-intercalar-ordenados',
    titulo: "Intercalando listas ordenadas",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>intercalar(a, b)</code>: junte dois slices <b>já ordenados</b> num só, também ordenado, sem chamar <code>sort</code>.</p>",
    dica: "Dois índices: compare <code>a[i]</code> com <code>b[j]</code>, pegue o menor e avance; no fim, junte o que sobrou.",
    inicial: go`
package main

import "fmt"

func intercalar(a, b []int) []int {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(intercalar([]int{1, 4, 9}, []int{2, 3, 10, 12}))
  fmt.Println(intercalar(nil, []int{5}))
}
`,
    solucao: go`
package main

import "fmt"

func intercalar(a, b []int) []int {
  out := make([]int, 0, len(a)+len(b))
  i, j := 0, 0
  for i < len(a) && j < len(b) {
    if a[i] <= b[j] {
      out = append(out, a[i])
      i++
    } else {
      out = append(out, b[j])
      j++
    }
  }
  out = append(out, a[i:]...)
  return append(out, b[j:]...)
}

func main() {
  fmt.Println(intercalar([]int{1, 4, 9}, []int{2, 3, 10, 12}))
  fmt.Println(intercalar(nil, []int{5}))
}
`,
    testes: [{ saida: "[1 2 3 4 9 10 12]\n[5]" }],
  }),
];
