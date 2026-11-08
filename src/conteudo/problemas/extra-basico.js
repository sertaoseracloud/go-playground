// Exercícios extras do módulo basico. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraBasico = [
  problema({
    id: 'basico-prob-fizzbuzz',
    titulo: "FizzBuzz",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>fizzbuzz(n)</code>: devolva <code>Fizz</code> para múltiplos de 3, <code>Buzz</code> para múltiplos de 5, <code>FizzBuzz</code> para múltiplos dos dois e o próprio número (como texto) nos outros casos.</p>",
    dica: "Teste o múltiplo de 15 primeiro. Para converter o número: <code>strconv.Itoa(n)</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strconv".

func fizzbuzz(n int) string {
  // TODO: implemente
  return ""
}

func main() {
  for i := 1; i <= 15; i++ {
    fmt.Print(fizzbuzz(i), " ")
  }
  fmt.Println()
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strconv"
)

func fizzbuzz(n int) string {
  switch {
  case n%15 == 0:
    return "FizzBuzz"
  case n%3 == 0:
    return "Fizz"
  case n%5 == 0:
    return "Buzz"
  }
  return strconv.Itoa(n)
}

func main() {
  for i := 1; i <= 15; i++ {
    fmt.Print(fizzbuzz(i), " ")
  }
  fmt.Println()
}
`,
    testes: [{ saida: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz" }],
  }),
  problema({
    id: 'basico-prob-fatorial',
    titulo: "Fatorial",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>fatorial(n)</code>: o produto de 1 até <code>n</code> (e <code>fatorial(0) = 1</code>). Use <code>uint64</code> para caber números grandes.</p>",
    dica: "Comece com <code>r := uint64(1)</code> e multiplique num laço de 2 até <code>n</code>.",
    inicial: go`
package main

import "fmt"

func fatorial(n uint64) uint64 {
  // TODO: implemente
  return 0
}

func main() {
  for _, n := range []uint64{0, 1, 5, 10, 20} {
    fmt.Println(n, fatorial(n))
  }
}
`,
    solucao: go`
package main

import "fmt"

func fatorial(n uint64) uint64 {
  r := uint64(1)
  for i := uint64(2); i <= n; i++ {
    r *= i
  }
  return r
}

func main() {
  for _, n := range []uint64{0, 1, 5, 10, 20} {
    fmt.Println(n, fatorial(n))
  }
}
`,
    testes: [{ saida: "0 1\n1 1\n5 120\n10 3628800\n20 2432902008176640000" }],
  }),
  problema({
    id: 'basico-prob-vogais',
    titulo: "Contando vogais",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>vogais(s)</code>: conte as vogais (a, e, i, o, u), ignorando maiúsculas. Letras acentuadas não contam.</p>",
    dica: "Percorra <code>strings.ToLower(s)</code> e use <code>strings.ContainsRune(\"aeiou\", r)</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

func vogais(s string) int {
  // TODO: implemente
  return 0
}

func main() {
  fmt.Println(vogais("Gopher"))
  fmt.Println(vogais("PROGRAMAR EM GO"))
  fmt.Println(vogais("xyz"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func vogais(s string) int {
  n := 0
  for _, r := range strings.ToLower(s) {
    if strings.ContainsRune("aeiou", r) {
      n++
    }
  }
  return n
}

func main() {
  fmt.Println(vogais("Gopher"))
  fmt.Println(vogais("PROGRAMAR EM GO"))
  fmt.Println(vogais("xyz"))
}
`,
    testes: [{ saida: "2\n5\n0" }],
  }),
  problema({
    id: 'basico-prob-primo',
    titulo: "Número primo",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>primo(n)</code>: diga se <code>n</code> é primo. Basta testar divisores até a raiz quadrada.</p>",
    dica: "Números menores que 2 não são primos. Teste <code>for d := 2; d*d &lt;= n; d++</code>.",
    inicial: go`
package main

import "fmt"

func primo(n int) bool {
  // TODO: implemente
  return false
}

func main() {
  for _, n := range []int{1, 2, 17, 21, 97, 100} {
    fmt.Println(n, primo(n))
  }
}
`,
    solucao: go`
package main

import "fmt"

func primo(n int) bool {
  if n < 2 {
    return false
  }
  for d := 2; d*d <= n; d++ {
    if n%d == 0 {
      return false
    }
  }
  return true
}

func main() {
  for _, n := range []int{1, 2, 17, 21, 97, 100} {
    fmt.Println(n, primo(n))
  }
}
`,
    testes: [{ saida: "1 false\n2 true\n17 true\n21 false\n97 true\n100 false" }],
  }),
  problema({
    id: 'basico-prob-palindromo',
    titulo: "Palíndromo",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>palindromo(s)</code>: diga se o texto é lido igual de trás para frente, ignorando espaços e maiúsculas. Funciona com acentos: trabalhe com runas.</p>",
    dica: "Monte um <code>[]rune</code> só com o que não é espaço (em minúsculas) e compare as pontas indo para o meio.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

func palindromo(s string) bool {
  // TODO: implemente
  return false
}

func main() {
  fmt.Println(palindromo("Ame o poema"))
  fmt.Println(palindromo("ovo"))
  fmt.Println(palindromo("Gopher"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func palindromo(s string) bool {
  rs := []rune{}
  for _, r := range strings.ToLower(s) {
    if r != ' ' {
      rs = append(rs, r)
    }
  }
  for i, j := 0, len(rs)-1; i < j; i, j = i+1, j-1 {
    if rs[i] != rs[j] {
      return false
    }
  }
  return true
}

func main() {
  fmt.Println(palindromo("Ame o poema"))
  fmt.Println(palindromo("ovo"))
  fmt.Println(palindromo("Gopher"))
}
`,
    testes: [{ saida: "true\ntrue\nfalse" }],
  }),
];
