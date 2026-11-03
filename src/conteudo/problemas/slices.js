import { go, problema } from '../util.js';

export const probSlices = problema({
  id: 'go-slices',
  titulo: 'Slices e loops',
  dificuldade: 'medio',
  enunciado: `
    <p>Slices são como listas dinâmicas em Go. Use <code>for _, item := range slice</code> para percorrer.</p>
    <ul>
      <li>Crie um slice de strings com os nomes: "Ana", "Bruno", "Carla".</li>
      <li>Percorra o slice e imprima cada nome em uma linha.</li>
    </ul>`,
  dica: 'O loop <code>range</code> devolve o índice e o valor. Use <code>_</code> para ignorar o índice.',
  inicial: go`
package main

import "fmt"

func main() {
  // TODO: crie o slice e use o loop for-range
}
`,
  solucao: go`
package main

import "fmt"

func main() {
  nomes := []string{"Ana", "Bruno", "Carla"}
  for _, nome := range nomes {
    fmt.Println(nome)
  }
}
`,
  testes: [{ entrada: '', saida: 'Ana\nBruno\nCarla' }],
});