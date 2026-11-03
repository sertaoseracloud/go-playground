import { go, problema } from '../util.js';

export const probVariaveis = problema({
  id: 'go-primeiro-programa',
  titulo: 'Primeiro programa e variáveis',
  dificuldade: 'facil',
  enunciado: `
    <p>Em Go, declaramos variáveis com <code>var</code> ou de forma curta com <code>:=</code>.</p>
    <ul>
      <li>Crie uma variável <code>nome</code> do tipo string com o valor "DivergeGo".</li>
      <li>Crie uma variável <code>versao</code> com o valor 1.</li>
      <li>Imprima: <code>DivergeGo v1</code></li>
    </ul>`,
  dica: 'Use <code>fmt.Println(nome, "v" + versao)</code> para concatenar.',
  inicial: go`
package main

import "fmt"

func main() {
  // TODO: declare as variáveis e imprima
}
`,
  solucao: go`
package main

import "fmt"

func main() {
  nome := "DivergeGo"
  versao := 1
  fmt.Println(nome, "v"+versao)
}
`,
  testes: [{ entrada: '', saida: 'DivergeGo v1' }],
});