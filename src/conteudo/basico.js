import { go, licao, problema } from './util.js';
import { probVariaveis } from './problemas/variaveis.js';
import { probSlices } from './problemas/slices.js';
import { probStructs } from './problemas/structs.js';
import { probInterfaces } from './problemas/interfaces.js';
import { extraBasico } from './problemas/extra-basico.js';

// ============================================================
// LIÇÕES (~15)
// ============================================================

const licaoOlaMundo = licao({
  id: 'licao-ola-mundo',
  titulo: 'Olá Mundo',
  resumo: 'Seu primeiro programa em Go usando fmt.Println.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      fmt.Println("Olá, Mundo!")
    }
  `,
});

const licaoVariaveis = licao({
  id: 'licao-variaveis',
  titulo: 'Variáveis',
  resumo: 'Declaração de variáveis com var e :=.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      var nome string = "Go"
      idade := 15
      fmt.Println(nome, idade)
    }
  `,
});

const licaoConstantes = licao({
  id: 'basico-constantes',
  titulo: 'Constantes',
  resumo: 'Valores imutáveis declarados com const.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      const pi = 3.14159
      const linguagem = "Go"
      fmt.Println(linguagem, pi)
    }
  `,
});

const licaoTipos = licao({
  id: 'basico-tipos',
  titulo: 'Tipos básicos',
  resumo: 'int, float64, string, bool e conversões.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      var inteiro int = 42
      var flutuante float64 = 3.14
      var texto string = "Go"
      var logico bool = true
      fmt.Println(inteiro, flutuante, texto, logico)
    }
  `,
});

const licaoIfElse = licao({
  id: 'basico-if-else',
  titulo: 'If / Else',
  resumo: 'Condições com if, else if e else.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      nota := 7
      if nota >= 9 {
        fmt.Println("Excelente")
      } else if nota >= 7 {
        fmt.Println("Aprovado")
      } else {
        fmt.Println("Reprovado")
      }
    }
  `,
});

const licaoSwitch = licao({
  id: 'basico-switch',
  titulo: 'Switch',
  resumo: 'Seleção múltipla com switch/case/default.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      dia := 3
      switch dia {
      case 1:
        fmt.Println("Segunda")
      case 2:
        fmt.Println("Terça")
      case 3:
        fmt.Println("Quarta")
      default:
        fmt.Println("Outro dia")
      }
    }
  `,
});

const licaoFor = licao({
  id: 'basico-for',
  titulo: 'Loop For',
  resumo: 'O único loop de Go: for clássico e infinito.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      for i := 1; i <= 5; i++ {
        fmt.Println(i)
      }
    }
  `,
});

const licaoForRange = licao({
  id: 'basico-for-range',
  titulo: 'For Range',
  resumo: 'Iterando sobre slices com for-range.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      frutas := []string{"Maçã", "Banana", "Uva"}
      for i, fruta := range frutas {
        fmt.Println(i, fruta)
      }
    }
  `,
});

const licaoFuncoes = licao({
  id: 'basico-funcoes',
  titulo: 'Funções',
  resumo: 'Definindo e chamando funções.',
  codigo: go`
    package main

    import "fmt"

    func saudacao(nome string) string {
      return "Olá, " + nome
    }

    func main() {
      msg := saudacao("Go")
      fmt.Println(msg)
    }
  `,
});

const licaoMultiplosRetornos = licao({
  id: 'basico-multiplos-retornos',
  titulo: 'Múltiplos retornos',
  resumo: 'Funções que devolvem mais de um valor.',
  codigo: go`
    package main

    import "fmt"

    func dividir(a, b float64) (float64, bool) {
      if b == 0 {
        return 0, false
      }
      return a / b, true
    }

    func main() {
      resultado, ok := dividir(10, 3)
      if ok {
        fmt.Printf("%.2f\\n", resultado)
      }
    }
  `,
});

const licaoStrings = licao({
  id: 'basico-strings',
  titulo: 'Strings',
  resumo: 'Operações básicas com strings e len().',
  codigo: go`
    package main

    import "fmt"

    func main() {
      s := "Hello, Go!"
      fmt.Println(len(s))
      fmt.Println(s[0])
      fmt.Println(s[7:])
    }
  `,
});

const licaoSlicesBasico = licao({
  id: 'basico-slices-basico',
  titulo: 'Slices básico',
  resumo: 'Criando e manipulando slices.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      nums := []int{10, 20, 30}
      nums = append(nums, 40)
      fmt.Println(nums)
      fmt.Println(len(nums))
    }
  `,
});

const licaoMapsBasico = licao({
  id: 'basico-maps-basico',
  titulo: 'Maps básico',
  resumo: 'Mapas associativos chave-valor.',
  codigo: go`
    package main

    import "fmt"

    func main() {
      cores := make(map[string]string)
      cores["vermelho"] = "#FF0000"
      cores["verde"] = "#00FF00"
      fmt.Println(cores["vermelho"])
      fmt.Println(len(cores))
    }
  `,
});

const licaoStructsBasico = licao({
  id: 'basico-structs-basico',
  titulo: 'Structs básico',
  resumo: 'Agrupando campos em tipos personalizados.',
  codigo: go`
    package main

    import "fmt"

    type Carro struct {
      Marca string
      Ano   int
    }

    func main() {
      c := Carro{Marca: "Fusca", Ano: 1970}
      fmt.Println(c.Marca, c.Ano)
    }
  `,
});

const licaoPonteiros = licao({
  id: 'basico-ponteiros',
  titulo: 'Ponteiros conceito',
  resumo: 'Referências a valores na memória com & e *.',
  codigo: go`
    package main

    import "fmt"

    func dobrar(x *int) {
      *x = *x * 2
    }

    func main() {
      n := 5
      dobrar(&n)
      fmt.Println(n)
    }
  `,
});

// ============================================================
// PROBLEMAS (~35)
// ============================================================

// --- Aritmética ---

const probSoma = problema({
  id: 'prob-soma',
  titulo: 'Soma simples',
  dificuldade: 'facil',
  enunciado: '<p>Imprima a soma de 3 + 7.</p>',
  dica: 'Use <code>fmt.Println(3 + 7)</code>.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima a soma de 3 + 7
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      fmt.Println(3 + 7)
    }
  `,
  testes: [{ entrada: '', saida: '10' }],
});

const probSubtracao = problema({
  id: 'basico-subtracao',
  titulo: 'Subtração',
  dificuldade: 'facil',
  enunciado: '<p>Calcule e imprima 100 - 37.</p>',
  dica: 'Use <code>fmt.Println(100 - 37)</code>.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima 100 - 37
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      fmt.Println(100 - 37)
    }
  `,
  testes: [{ entrada: '', saida: '63' }],
});

const probMultiplicacao = problema({
  id: 'basico-multiplicacao',
  titulo: 'Multiplicação',
  dificuldade: 'facil',
  enunciado: '<p>Imprima o resultado de 6 * 7.</p>',
  dica: 'Use <code>fmt.Println(6 * 7)</code>.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima 6 * 7
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      fmt.Println(6 * 7)
    }
  `,
  testes: [{ entrada: '', saida: '42' }],
});

const probDivisao = problema({
  id: 'basico-divisao',
  titulo: 'Divisão inteira',
  dificuldade: 'facil',
  enunciado: '<p>Imprima a divisão inteira de 17 / 5.</p>',
  dica: 'Em Go, divisão entre inteiros resulta em inteiro.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima 17 / 5
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      fmt.Println(17 / 5)
    }
  `,
  testes: [{ entrada: '', saida: '3' }],
});

const probModulo = problema({
  id: 'basico-modulo',
  titulo: 'Resto da divisão',
  dificuldade: 'facil',
  enunciado: '<p>Imprima o resto da divisão de 17 por 5.</p>',
  dica: 'Use o operador <code>%</code>.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima 17 % 5
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      fmt.Println(17 % 5)
    }
  `,
  testes: [{ entrada: '', saida: '2' }],
});

const probMedia = problema({
  id: 'basico-media',
  titulo: 'Média de três números',
  dificuldade: 'facil',
  enunciado: '<p>Calcule e imprima a média de 10, 20 e 30 como float.</p>',
  dica: 'Some os valores e divida por 3.0 para obter float.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: calcule e imprima a média
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      media := (10.0 + 20.0 + 30.0) / 3.0
      fmt.Printf("%.1f\\n", media)
    }
  `,
  testes: [{ entrada: '', saida: '20.0' }],
});

const probMaximo = problema({
  id: 'basico-maximo',
  titulo: 'Maior de dois',
  dificuldade: 'facil',
  enunciado: '<p>Dados a=15 e b=22, imprima o maior valor.</p>',
  dica: 'Use <code>if a > b</code> para comparar.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  a := 15
  _ = a // TODO: use a
  b := 22
  _ = b // TODO: use b
  // TODO: imprima o maior
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      a := 15
      b := 22
      if a > b {
        fmt.Println(a)
      } else {
        fmt.Println(b)
      }
    }
  `,
  testes: [{ entrada: '', saida: '22' }],
});

const probMinimo = problema({
  id: 'basico-minimo',
  titulo: 'Menor de três',
  dificuldade: 'medio',
  enunciado: '<p>Dados a=8, b=3, c=12, imprima o menor valor.</p>',
  dica: 'Compare pares sequencialmente.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  a := 8
  _ = a // TODO: use a
  b := 3
  _ = b // TODO: use b
  c := 12
  _ = c // TODO: use c
  // TODO: imprima o menor
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      a := 8
      b := 3
      c := 12
      menor := a
      if b < menor {
        menor = b
      }
      if c < menor {
        menor = c
      }
      fmt.Println(menor)
    }
  `,
  testes: [{ entrada: '', saida: '3' }],
});

// --- Strings ---

const probInverterString = problema({
  id: 'basico-inverter-string',
  titulo: 'Inverter string',
  dificuldade: 'medio',
  enunciado: '<p>Inverta a string "GoLang" e imprima o resultado.</p>',
  dica: 'Converta para slice de bytes, percorra de trás para frente.',
  inicial: go`
    package main

    import "fmt"

    func inverter(s string) string {
      // TODO: implemente
      return ""
    }

    func main() {
      fmt.Println(inverter("GoLang"))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func inverter(s string) string {
      bytes := []byte(s)
      resultado := make([]byte, len(bytes))
      for i := 0; i < len(bytes); i++ {
        resultado[i] = bytes[len(bytes)-1-i]
      }
      return string(resultado)
    }

    func main() {
      fmt.Println(inverter("GoLang"))
    }
  `,
  testes: [{ entrada: '', saida: 'gnaLoG' }],
});

const probContarVogais = problema({
  id: 'basico-contar-vogais',
  titulo: 'Contar vogais',
  dificuldade: 'medio',
  enunciado: '<p>Conte quantas vogais existem em "DivergeGo" e imprima o número.</p>',
  dica: 'Percorra cada caractere e verifique se é vogal.',
  inicial: go`
    package main

    import "fmt"

    func contarVogais(s string) int {
      // TODO: implemente
      return 0
    }

    func main() {
      fmt.Println(contarVogais("DivergeGo"))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func ehVogal(c byte) bool {
      return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' ||
        c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U'
    }

    func contarVogais(s string) int {
      count := 0
      for i := 0; i < len(s); i++ {
        if ehVogal(s[i]) {
          count++
        }
      }
      return count
    }

    func main() {
      fmt.Println(contarVogais("DivergeGo"))
    }
  `,
  testes: [{ entrada: '', saida: '4' }],
});

const probPalindromo = problema({
  id: 'basico-palindromo',
  titulo: 'Verificar palíndromo',
  dificuldade: 'medio',
  enunciado: '<p>Verifique se "arara" é palíndromo. Imprima "sim" ou "nao".</p>',
  dica: 'Compare caracteres das extremidades ao centro.',
  inicial: go`
    package main

    import "fmt"

    func ehPalindromo(s string) bool {
      // TODO: implemente
      return false
    }

    func main() {
      if ehPalindromo("arara") {
        fmt.Println("sim")
      } else {
        fmt.Println("nao")
      }
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func ehPalindromo(s string) bool {
      for i := 0; i < len(s)/2; i++ {
        if s[i] != s[len(s)-1-i] {
          return false
        }
      }
      return true
    }

    func main() {
      if ehPalindromo("arara") {
        fmt.Println("sim")
      } else {
        fmt.Println("nao")
      }
    }
  `,
  testes: [{ entrada: '', saida: 'sim' }],
});

const probMaiusculas = problema({
  id: 'basico-maiusculas',
  titulo: 'Converter para maiúsculas',
  dificuldade: 'medio',
  enunciado: '<p>Converta "hello" para maiúsculas sem usar strings.ToUpper. Imprima o resultado.</p>',
  dica: 'Subtraia 32 do valor ASCII de letras minúsculas.',
  inicial: go`
    package main

    import "fmt"

    func paraMaiusculas(s string) string {
      // TODO: implemente
      return ""
    }

    func main() {
      fmt.Println(paraMaiusculas("hello"))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func paraMaiusculas(s string) string {
      bytes := []byte(s)
      for i := 0; i < len(bytes); i++ {
        if bytes[i] >= 'a' && bytes[i] <= 'z' {
          bytes[i] = bytes[i] - 32
        }
      }
      return string(bytes)
    }

    func main() {
      fmt.Println(paraMaiusculas("hello"))
    }
  `,
  testes: [{ entrada: '', saida: 'HELLO' }],
});

const probSubstring = problema({
  id: 'basico-substring',
  titulo: 'Extrair substring',
  dificuldade: 'facil',
  enunciado: '<p>Extraia e imprima os caracteres de índice 0 a 4 (exclusive) de "GoLang".</p>',
  dica: 'Use fatiamento: <code>s[0:4]</code>.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  s := "GoLang"
  _ = s // TODO: use s
  // TODO: imprima a substring [0:4]
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      s := "GoLang"
      fmt.Println(s[0:4])
    }
  `,
  testes: [{ entrada: '', saida: 'GoLa' }],
});

// --- Loops ---

const probTabuada = problema({
  id: 'basico-tabuada',
  titulo: 'Tabuada do 5',
  dificuldade: 'facil',
  enunciado: '<p>Imprima a tabuada do 5 de 1 a 10, uma linha por multiplicação no formato "5 x N = R".</p>',
  dica: 'Use um loop for de 1 a 10.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima a tabuada do 5
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      for i := 1; i <= 10; i++ {
        fmt.Printf("5 x %d = %d\\n", i, 5*i)
      }
    }
  `,
  testes: [{ entrada: '', saida: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50' }],
});

const probFatorial = problema({
  id: 'basico-fatorial',
  titulo: 'Fatorial',
  dificuldade: 'medio',
  enunciado: '<p>Calcule e imprima o fatorial de 6.</p>',
  dica: 'Multiplique de 1 até N acumulativamente.',
  inicial: go`
    package main

    import "fmt"

    func fatorial(n int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      fmt.Println(fatorial(6))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func fatorial(n int) int {
      resultado := 1
      for i := 2; i <= n; i++ {
        resultado = resultado * i
      }
      return resultado
    }

    func main() {
      fmt.Println(fatorial(6))
    }
  `,
  testes: [{ entrada: '', saida: '720' }],
});

const probFibonacci = problema({
  id: 'basico-fibonacci',
  titulo: 'Fibonacci',
  dificuldade: 'medio',
  enunciado: '<p>Imprima os 8 primeiros números da sequência de Fibonacci (começando por 0).</p>',
  dica: 'Mantenha duas variáveis: anterior e atual.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima 8 números de Fibonacci
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      a := 0
      b := 1
      for i := 0; i < 8; i++ {
        fmt.Println(a)
        temp := a + b
        a = b
        b = temp
      }
    }
  `,
  testes: [{ entrada: '', saida: '0\n1\n1\n2\n3\n5\n8\n13' }],
});

const probSomaN = problema({
  id: 'basico-soma-n',
  titulo: 'Soma de 1 a N',
  dificuldade: 'facil',
  enunciado: '<p>Calcule e imprima a soma de 1 a 100.</p>',
  dica: 'Use um loop acumulador ou a fórmula n*(n+1)/2.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: some de 1 a 100
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      soma := 0
      for i := 1; i <= 100; i++ {
        soma = soma + i
      }
      fmt.Println(soma)
    }
  `,
  testes: [{ entrada: '', saida: '5050' }],
});

const probPrimos = problema({
  id: 'basico-primos',
  titulo: 'Números primos até 20',
  dificuldade: 'dificil',
  enunciado: '<p>Imprima todos os números primos de 2 a 20, um por linha.</p>',
  dica: 'Para cada número, verifique se algum divisor de 2 até n/2 divide ele.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func ehPrimo(n int) bool {
  // TODO: implemente
  return false
}

func main() {
  // TODO: imprima primos de 2 a 20
}
`,
  solucao: go`
    package main

    import "fmt"

    func ehPrimo(n int) bool {
      if n < 2 {
        return false
      }
      for i := 2; i <= n/2; i++ {
        if n%i == 0 {
          return false
        }
      }
      return true
    }

    func main() {
      for i := 2; i <= 20; i++ {
        if ehPrimo(i) {
          fmt.Println(i)
        }
      }
    }
  `,
  testes: [{ entrada: '', saida: '2\n3\n5\n7\n11\n13\n17\n19' }],
});

// --- Condicionais ---

const probParImpar = problema({
  id: 'prob-par-impar',
  titulo: 'Par ou ímpar',
  dificuldade: 'facil',
  enunciado: '<p>Verifique se 7 é par ou ímpar. Imprima "par" ou "impar".</p>',
  dica: 'Use <code>n % 2 == 0</code> para verificar paridade.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  n := 7
  _ = n // TODO: use n
  // TODO: imprima "par" ou "impar"
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      n := 7
      if n%2 == 0 {
        fmt.Println("par")
      } else {
        fmt.Println("impar")
      }
    }
  `,
  testes: [{ entrada: '', saida: 'impar' }],
});

const probClassificarNumero = problema({
  id: 'basico-classificar-numero',
  titulo: 'Classificar número',
  dificuldade: 'facil',
  enunciado: '<p>Dado n=-5, imprima "negativo", "zero" ou "positivo".</p>',
  dica: 'Use if/else if/else para as três faixas.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  n := -5
  _ = n // TODO: use n
  // TODO: classifique o número
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      n := -5
      if n > 0 {
        fmt.Println("positivo")
      } else if n < 0 {
        fmt.Println("negativo")
      } else {
        fmt.Println("zero")
      }
    }
  `,
  testes: [{ entrada: '', saida: 'negativo' }],
});

const probDiaSemana = problema({
  id: 'basico-dia-semana',
  titulo: 'Dia da semana',
  dificuldade: 'facil',
  enunciado: '<p>Dado dia=5, imprima o nome do dia usando switch (1=Segunda ... 7=Domingo).</p>',
  dica: 'Use switch com cases de 1 a 7.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  dia := 5
  _ = dia // TODO: use dia
  // TODO: use switch para imprimir o dia
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      dia := 5
      switch dia {
      case 1:
        fmt.Println("Segunda")
      case 2:
        fmt.Println("Terca")
      case 3:
        fmt.Println("Quarta")
      case 4:
        fmt.Println("Quinta")
      case 5:
        fmt.Println("Sexta")
      case 6:
        fmt.Println("Sabado")
      case 7:
        fmt.Println("Domingo")
      default:
        fmt.Println("Invalido")
      }
    }
  `,
  testes: [{ entrada: '', saida: 'Sexta' }],
});

const probNotaConceito = problema({
  id: 'basico-nota-conceito',
  titulo: 'Nota e conceito',
  dificuldade: 'medio',
  enunciado: '<p>Dada nota=85, imprima o conceito: A (>=90), B (>=80), C (>=70), D (>=60), F (<60).</p>',
  dica: 'Use if/else if encadeado começando pela maior nota.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  nota := 85
  _ = nota // TODO: use nota
  // TODO: imprima o conceito
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      nota := 85
      if nota >= 90 {
        fmt.Println("A")
      } else if nota >= 80 {
        fmt.Println("B")
      } else if nota >= 70 {
        fmt.Println("C")
      } else if nota >= 60 {
        fmt.Println("D")
      } else {
        fmt.Println("F")
      }
    }
  `,
  testes: [{ entrada: '', saida: 'B' }],
});

const probAnoBissexto = problema({
  id: 'basico-ano-bissexto',
  titulo: 'Ano bissexto',
  dificuldade: 'medio',
  enunciado: '<p>Verifique se 2024 é bissexto. Imprima "sim" ou "nao".</p><p>Regra: divisível por 4, exceto séculos não divisíveis por 400.</p>',
  dica: 'Use combinações de módulo: %4, %100, %400.',
  inicial: go`
    package main

    import "fmt"

    func ehBissexto(ano int) bool {
      // TODO: implemente
      return false
    }

    func main() {
      if ehBissexto(2024) {
        fmt.Println("sim")
      } else {
        fmt.Println("nao")
      }
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func ehBissexto(ano int) bool {
      if ano%400 == 0 {
        return true
      }
      if ano%100 == 0 {
        return false
      }
      if ano%4 == 0 {
        return true
      }
      return false
    }

    func main() {
      if ehBissexto(2024) {
        fmt.Println("sim")
      } else {
        fmt.Println("nao")
      }
    }
  `,
  testes: [{ entrada: '', saida: 'sim' }],
});

// --- Funções ---

const probMultiplosRetornos = problema({
  id: 'basico-multiplos-retornos-prob',
  titulo: 'Múltiplos retornos',
  dificuldade: 'medio',
  enunciado: '<p>Crie uma função <code>divmod(a, b int) (int, int)</code> que retorna quociente e resto. Chame com (17, 5) e imprima ambos.</p>',
  dica: 'Retorne <code>a/b, a%b</code>.',
  inicial: go`
    package main

    import "fmt"

    func divmod(a, b int) (int, int) {
      // TODO: implemente
      return 0, 0
    }

    func main() {
      q, r := divmod(17, 5)
      fmt.Println(q)
      fmt.Println(r)
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func divmod(a, b int) (int, int) {
      return a / b, a % b
    }

    func main() {
      q, r := divmod(17, 5)
      fmt.Println(q)
      fmt.Println(r)
    }
  `,
  testes: [{ entrada: '', saida: '3\n2' }],
});

const probAbsoluto = problema({
  id: 'basico-absoluto',
  titulo: 'Valor absoluto',
  dificuldade: 'facil',
  enunciado: '<p>Crie uma função <code>abs(n int) int</code> que retorna o valor absoluto. Teste com -42.</p>',
  dica: 'Se n < 0, retorne -n.',
  inicial: go`
    package main

    import "fmt"

    func abs(n int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      fmt.Println(abs(-42))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func abs(n int) int {
      if n < 0 {
        return -n
      }
      return n
    }

    func main() {
      fmt.Println(abs(-42))
    }
  `,
  testes: [{ entrada: '', saida: '42' }],
});

const probPotencia = problema({
  id: 'basico-potencia',
  titulo: 'Potência inteira',
  dificuldade: 'medio',
  enunciado: '<p>Crie <code>potencia(base, exp int) int</code> sem usar math.Pow. Teste com potencia(2, 10).</p>',
  dica: 'Multiplique a base por si mesma exp vezes.',
  inicial: go`
    package main

    import "fmt"

    func potencia(base, exp int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      fmt.Println(potencia(2, 10))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func potencia(base, exp int) int {
      resultado := 1
      for i := 0; i < exp; i++ {
        resultado = resultado * base
      }
      return resultado
    }

    func main() {
      fmt.Println(potencia(2, 10))
    }
  `,
  testes: [{ entrada: '', saida: '1024' }],
});

const probTrocarValores = problema({
  id: 'basico-trocar-valores',
  titulo: 'Trocar valores com ponteiro',
  dificuldade: 'medio',
  enunciado: '<p>Crie <code>trocar(a, b *int)</code> que troca os valores apontados. Teste com a=3, b=7.</p>',
  dica: 'Use uma variável temporária para guardar um dos valores.',
  inicial: go`
    package main

    import "fmt"

    func trocar(a, b *int) {
      // TODO: implemente
    }

    func main() {
      a := 3
      b := 7
      trocar(&a, &b)
      fmt.Println(a)
      fmt.Println(b)
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func trocar(a, b *int) {
      temp := *a
      *a = *b
      *b = temp
    }

    func main() {
      a := 3
      b := 7
      trocar(&a, &b)
      fmt.Println(a)
      fmt.Println(b)
    }
  `,
  testes: [{ entrada: '', saida: '7\n3' }],
});

// --- Slices ---

const probAppendSlice = problema({
  id: 'basico-append-slice',
  titulo: 'Append em slice',
  dificuldade: 'facil',
  enunciado: '<p>Comece com <code>[]int{1, 2, 3}</code>, adicione 4 e 5 com append, e imprima o slice.</p>',
  dica: 'Use <code>append(slice, val1, val2)</code>.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  nums := []int{1, 2, 3}
  _ = nums // TODO: use nums
  // TODO: adicione 4 e 5 e imprima
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      nums := []int{1, 2, 3}
      nums = append(nums, 4, 5)
      fmt.Println(nums)
    }
  `,
  testes: [{ entrada: '', saida: '[1 2 3 4 5]' }],
});

const probFiltrarPares = problema({
  id: 'basico-filtrar-pares',
  titulo: 'Filtrar pares',
  dificuldade: 'medio',
  enunciado: '<p>Dado <code>[]int{1,2,3,4,5,6,7,8}</code>, crie um novo slice só com os pares e imprima.</p>',
  dica: 'Percorra com for-range e use append condicional.',
  inicial: go`
    package main

    import "fmt"

    func filtrarPares(nums []int) []int {
      // TODO: implemente
      return nil
    }

    func main() {
      nums := []int{1, 2, 3, 4, 5, 6, 7, 8}
      fmt.Println(filtrarPares(nums))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func filtrarPares(nums []int) []int {
      var resultado []int
      for _, n := range nums {
        if n%2 == 0 {
          resultado = append(resultado, n)
        }
      }
      return resultado
    }

    func main() {
      nums := []int{1, 2, 3, 4, 5, 6, 7, 8}
      fmt.Println(filtrarPares(nums))
    }
  `,
  testes: [{ entrada: '', saida: '[2 4 6 8]' }],
});

const probSomarElementos = problema({
  id: 'basico-somar-elementos',
  titulo: 'Somar elementos do slice',
  dificuldade: 'facil',
  enunciado: '<p>Some todos os elementos de <code>[]int{10, 20, 30, 40}</code> e imprima o total.</p>',
  dica: 'Use um acumulador com for-range.',
  inicial: go`
    package main

    import "fmt"

    func somar(nums []int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      nums := []int{10, 20, 30, 40}
      fmt.Println(somar(nums))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func somar(nums []int) int {
      total := 0
      for _, n := range nums {
        total = total + n
      }
      return total
    }

    func main() {
      nums := []int{10, 20, 30, 40}
      fmt.Println(somar(nums))
    }
  `,
  testes: [{ entrada: '', saida: '100' }],
});

const probMaiorElemento = problema({
  id: 'basico-maior-elemento',
  titulo: 'Maior elemento do slice',
  dificuldade: 'facil',
  enunciado: '<p>Encontre e imprima o maior valor em <code>[]int{3, 7, 2, 9, 1, 5}</code>.</p>',
  dica: 'Comece assumindo que o primeiro é o maior e compare.',
  inicial: go`
    package main

    import "fmt"

    func maior(nums []int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      nums := []int{3, 7, 2, 9, 1, 5}
      fmt.Println(maior(nums))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func maior(nums []int) int {
      m := nums[0]
      for _, n := range nums {
        if n > m {
          m = n
        }
      }
      return m
    }

    func main() {
      nums := []int{3, 7, 2, 9, 1, 5}
      fmt.Println(maior(nums))
    }
  `,
  testes: [{ entrada: '', saida: '9' }],
});

const probContarOcorrencias = problema({
  id: 'basico-contar-ocorrencias',
  titulo: 'Contar ocorrências',
  dificuldade: 'medio',
  enunciado: '<p>Conte quantas vezes o valor 3 aparece em <code>[]int{1,3,2,3,4,3,5}</code> e imprima.</p>',
  dica: 'Percorra com for-range e incremente um contador.',
  inicial: go`
    package main

    import "fmt"

    func contar(nums []int, alvo int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      nums := []int{1, 3, 2, 3, 4, 3, 5}
      fmt.Println(contar(nums, 3))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func contar(nums []int, alvo int) int {
      c := 0
      for _, n := range nums {
        if n == alvo {
          c++
        }
      }
      return c
    }

    func main() {
      nums := []int{1, 3, 2, 3, 4, 3, 5}
      fmt.Println(contar(nums, 3))
    }
  `,
  testes: [{ entrada: '', saida: '3' }],
});

// --- Structs ---

const probRetanguloArea = problema({
  id: 'basico-retangulo-area',
  titulo: 'Retângulo com Area',
  dificuldade: 'medio',
  enunciado: '<p>Crie struct <code>Retangulo</code> com Largura e Altura (float64). Implemente método <code>Area()</code>. Teste com 5.0 e 3.0.</p>',
  dica: 'Área = largura * altura.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: defina Retangulo e metodo Area

func main() {
  // TODO: teste
}
`,
  solucao: go`
    package main

    import "fmt"

    type Retangulo struct {
      Largura float64
      Altura  float64
    }

    func (r Retangulo) Area() float64 {
      return r.Largura * r.Altura
    }

    func main() {
      r := Retangulo{Largura: 5.0, Altura: 3.0}
      fmt.Printf("%.1f\\n", r.Area())
    }
  `,
  testes: [{ entrada: '', saida: '15.0' }],
});

const probContaSaldo = problema({
  id: 'basico-conta-saldo',
  titulo: 'Conta bancária',
  dificuldade: 'medio',
  enunciado: '<p>Crie struct <code>Conta</code> com Saldo (float64). Implemente <code>Depositar(valor float64)</code> e <code>Sacar(valor float64) bool</code>. Deposite 100, saque 30, imprima saldo.</p>',
  dica: 'Usar receptor ponteiro para modificar o saldo.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: defina Conta e metodos

func main() {
  // TODO: teste depositar e sacar
}
`,
  solucao: go`
    package main

    import "fmt"

    type Conta struct {
      Saldo float64
    }

    func (c *Conta) Depositar(valor float64) {
      c.Saldo = c.Saldo + valor
    }

    func (c *Conta) Sacar(valor float64) bool {
      if valor > c.Saldo {
        return false
      }
      c.Saldo = c.Saldo - valor
      return true
    }

    func main() {
      conta := Conta{Saldo: 0}
      conta.Depositar(100)
      conta.Sacar(30)
      fmt.Printf("%.1f\\n", conta.Saldo)
    }
  `,
  testes: [{ entrada: '', saida: '70.0' }],
});

const probPessoaSaudacao = problema({
  id: 'basico-pessoa-saudacao',
  titulo: 'Pessoa com saudação personalizada',
  dificuldade: 'medio',
  enunciado: '<p>Crie struct <code>Pessoa</code> com Nome (string) e Idade (int). Método <code>Apresentar()</code> imprime "Meu nome é X e tenho Y anos". Teste com "Carlos", 25.</p>',
  dica: 'Use fmt.Sprintf ou concatenação dentro do método.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: defina Pessoa e metodo Apresentar

func main() {
  // TODO: teste
}
`,
  solucao: go`
    package main

    import "fmt"

    type Pessoa struct {
      Nome  string
      Idade int
    }

    func (p Pessoa) Apresentar() {
      fmt.Printf("Meu nome e %s e tenho %d anos\\n", p.Nome, p.Idade)
    }

    func main() {
      p := Pessoa{Nome: "Carlos", Idade: 25}
      p.Apresentar()
    }
  `,
  testes: [{ entrada: '', saida: 'Meu nome e Carlos e tenho 25 anos' }],
});

const probCirculoPerimetro = problema({
  id: 'basico-circulo-perimetro',
  titulo: 'Círculo com perímetro',
  dificuldade: 'medio',
  enunciado: '<p>Crie struct <code>Circulo</code> com Raio (float64). Método <code>Perimetro()</code> retorna 2*pi*raio. Use pi=3.14159. Teste com raio=5.</p>',
  dica: 'Declare pi como constante local.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: defina Circulo e metodo Perimetro

func main() {
  // TODO: teste
}
`,
  solucao: go`
    package main

    import "fmt"

    const pi = 3.14159

    type Circulo struct {
      Raio float64
    }

    func (c Circulo) Perimetro() float64 {
      return 2 * pi * c.Raio
    }

    func main() {
      c := Circulo{Raio: 5}
      fmt.Printf("%.2f\\n", c.Perimetro())
    }
  `,
  testes: [{ entrada: '', saida: '31.42' }],
});

const probTemperaturaConversao = problema({
  id: 'basico-temperatura-conversao',
  titulo: 'Conversão de temperatura',
  dificuldade: 'facil',
  enunciado: '<p>Crie struct <code>Temp</code> com Celsius (float64). Método <code>Fahrenheit()</code> retorna C*9/5+32. Teste com 100°C.</p>',
  dica: 'Fórmula: F = C * 9 / 5 + 32.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: defina Temp e metodo Fahrenheit

func main() {
  // TODO: teste
}
`,
  solucao: go`
    package main

    import "fmt"

    type Temp struct {
      Celsius float64
    }

    func (t Temp) Fahrenheit() float64 {
      return t.Celsius*9/5 + 32
    }

    func main() {
      t := Temp{Celsius: 100}
      fmt.Printf("%.1f\\n", t.Fahrenheit())
    }
  `,
  testes: [{ entrada: '', saida: '212.0' }],
});

// --- Extras variados ---

const probMdc = problema({
  id: 'basico-mdc',
  titulo: 'MDC de dois números',
  dificuldade: 'dificil',
  enunciado: '<p>Calcule o MDC de 48 e 18 usando o algoritmo de Euclides e imprima.</p>',
  dica: 'Enquanto b != 0: a, b = b, a%b.',
  inicial: go`
    package main

    import "fmt"

    func mdc(a, b int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      fmt.Println(mdc(48, 18))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func mdc(a, b int) int {
      for b != 0 {
        temp := b
        b = a % b
        a = temp
      }
      return a
    }

    func main() {
      fmt.Println(mdc(48, 18))
    }
  `,
  testes: [{ entrada: '', saida: '6' }],
});

const probInverterSlice = problema({
  id: 'basico-inverter-slice',
  titulo: 'Inverter slice',
  dificuldade: 'medio',
  enunciado: '<p>Inverta o slice <code>[]int{1,2,3,4,5}</code> in-place e imprima.</p>',
  dica: 'Troque elementos das extremidades até o meio.',
  inicial: go`
    package main

    import "fmt"

    func inverter(nums []int) {
      // TODO: implemente
    }

    func main() {
      nums := []int{1, 2, 3, 4, 5}
      inverter(nums)
      fmt.Println(nums)
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func inverter(nums []int) {
      n := len(nums)
      for i := 0; i < n/2; i++ {
        temp := nums[i]
        nums[i] = nums[n-1-i]
        nums[n-1-i] = temp
      }
    }

    func main() {
      nums := []int{1, 2, 3, 4, 5}
      inverter(nums)
      fmt.Println(nums)
    }
  `,
  testes: [{ entrada: '', saida: '[5 4 3 2 1]' }],
});

const probFizzBuzz = problema({
  id: 'basico-fizzbuzz',
  titulo: 'FizzBuzz',
  dificuldade: 'medio',
  enunciado: '<p>Imprima de 1 a 15: "Fizz" para múltiplos de 3, "Buzz" para 5, "FizzBuzz" para ambos, senão o número.</p>',
  dica: 'Verifique divisibilidade por 15 primeiro.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: implemente FizzBuzz de 1 a 15
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      for i := 1; i <= 15; i++ {
        if i%15 == 0 {
          fmt.Println("FizzBuzz")
        } else if i%3 == 0 {
          fmt.Println("Fizz")
        } else if i%5 == 0 {
          fmt.Println("Buzz")
        } else {
          fmt.Println(i)
        }
      }
    }
  `,
  testes: [{ entrada: '', saida: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }],
});

const probSegundoMaior = problema({
  id: 'basico-segundo-maior',
  titulo: 'Segundo maior elemento',
  dificuldade: 'dificil',
  enunciado: '<p>Encontre o segundo maior valor em <code>[]int{10, 5, 20, 8, 15}</code> e imprima.</p>',
  dica: 'Mantenha duas variáveis: maior e segundoMaior.',
  inicial: go`
    package main

    import "fmt"

    func segundoMaior(nums []int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      nums := []int{10, 5, 20, 8, 15}
      fmt.Println(segundoMaior(nums))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func segundoMaior(nums []int) int {
      maior := nums[0]
      segundo := nums[0]
      for _, n := range nums {
        if n > maior {
          segundo = maior
          maior = n
        } else if n > segundo && n != maior {
          segundo = n
        }
      }
      return segundo
    }

    func main() {
      nums := []int{10, 5, 20, 8, 15}
      fmt.Println(segundoMaior(nums))
    }
  `,
  testes: [{ entrada: '', saida: '15' }],
});

const probSomaDigitos = problema({
  id: 'basico-soma-digitos',
  titulo: 'Soma dos dígitos',
  dificuldade: 'medio',
  enunciado: '<p>Calcule a soma dos dígitos de 12345 e imprima o resultado.</p>',
  dica: 'Use n%10 para pegar o último dígito e n/10 para remover.',
  inicial: go`
    package main

    import "fmt"

    func somaDigitos(n int) int {
      // TODO: implemente
      return 0
    }

    func main() {
      fmt.Println(somaDigitos(12345))
    }
  `,
  solucao: go`
    package main

    import "fmt"

    func somaDigitos(n int) int {
      soma := 0
      for n > 0 {
        soma = soma + n%10
        n = n / 10
      }
      return soma
    }

    func main() {
      fmt.Println(somaDigitos(12345))
    }
  `,
  testes: [{ entrada: '', saida: '15' }],
});

const probTabelaMultiplicacao = problema({
  id: 'basico-tabela-multiplicacao',
  titulo: 'Tabela de multiplicação',
  dificuldade: 'dificil',
  enunciado: '<p>Imprima uma tabela 3x3 de multiplicação onde cada célula é i*j (i,j de 1 a 3). Use Printf com formatação.</p>',
  dica: 'Dois loops aninhados. Use fmt.Print dentro do loop interno e fmt.Println ao final de cada linha.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
  // TODO: imprima tabela 3x3
}
`,
  solucao: go`
    package main

    import "fmt"

    func main() {
      for i := 1; i <= 3; i++ {
        for j := 1; j <= 3; j++ {
          fmt.Printf("%d ", i*j)
        }
        fmt.Println()
      }
    }
  `,
  testes: [{ entrada: '', saida: '1 2 3 \n2 4 6 \n3 6 9 ' }],
});

// ============================================================
// EXPORTAÇÃO DO MÓDULO
// ============================================================

export const moduloBasico = {
  id: 'basico',
  titulo: 'Go básico',
  icone: '🐹',
  descricao: 'Fundamentos da linguagem Go: variáveis, controle de fluxo, funções, slices, structs e ponteiros.',
  itens: [
    // Lições
    licaoOlaMundo,
    licaoVariaveis,
    licaoConstantes,
    licaoTipos,
    licaoIfElse,
    licaoSwitch,
    licaoFor,
    licaoForRange,
    licaoFuncoes,
    licaoMultiplosRetornos,
    licaoStrings,
    licaoSlicesBasico,
    licaoMapsBasico,
    licaoStructsBasico,
    licaoPonteiros,

    // Problemas importados
    probVariaveis,
    probSlices,
    probStructs,
    probInterfaces,

    // Problemas - Aritmética
    probSoma,
    probSubtracao,
    probMultiplicacao,
    probDivisao,
    probModulo,
    probMedia,
    probMaximo,
    probMinimo,

    // Problemas - Strings
    probInverterString,
    probContarVogais,
    probPalindromo,
    probMaiusculas,
    probSubstring,

    // Problemas - Loops
    probTabuada,
    probFatorial,
    probFibonacci,
    probSomaN,
    probPrimos,

    // Problemas - Condicionais
    probParImpar,
    probClassificarNumero,
    probDiaSemana,
    probNotaConceito,
    probAnoBissexto,

    // Problemas - Funções
    probMultiplosRetornos,
    probAbsoluto,
    probPotencia,
    probTrocarValores,

    // Problemas - Slices
    probAppendSlice,
    probFiltrarPares,
    probSomarElementos,
    probMaiorElemento,
    probContarOcorrencias,

    // Problemas - Structs
    probRetanguloArea,
    probContaSaldo,
    probPessoaSaudacao,
    probCirculoPerimetro,
    probTemperaturaConversao,

    // Problemas - Extras
    probMdc,
    probInverterSlice,
    probFizzBuzz,
    probSegundoMaior,
    probSomaDigitos,
    probTabelaMultiplicacao,
    ...extraBasico,
  ],
};