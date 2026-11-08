import { go, problema } from '../util.js';

export const probInterfaces = problema({
  id: 'go-interfaces',
  titulo: 'Interfaces e polimorfismo',
  dificuldade: 'dificil',
  enunciado: `
    <p>Interfaces definem comportamentos. Em Go, a implementação é implícita.</p>
    <ul>
      <li>Crie uma interface <code>Forma</code> com um método <code>Area() float64</code>.</li>
      <li>Crie structs <code>Quadrado</code> (lado float64) e <code>Circulo</code> (raio float64).</li>
      <li>Implemente a interface para ambas.</li>
      <li>No main, crie uma lista de formas e imprima a área de cada uma.</li>
    </ul>`,
  dica: 'Use <code>math.Pi</code> para o círculo. A área do quadrado é lado * lado.',
  inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

// TODO: defina a interface Forma

// TODO: defina as structs e implemente Area()

func main() {
  // TODO: teste com diferentes formas
}
`,
  solucao: go`
package main

import (
  "fmt"
  "math"
)

type Forma interface {
  Area() float64
}

type Quadrado struct {
  Lado float64
}

func (q Quadrado) Area() float64 {
  return q.Lado * q.Lado
}

type Circulo struct {
  Raio float64
}

func (c Circulo) Area() float64 {
  return math.Pi * c.Raio * c.Raio
}

func main() {
  formas := []Forma{
    Quadrado{Lado: 5},
    Circulo{Raio: 3},
  }
  for _, f := range formas {
    fmt.Printf("Área: %.2f\\n", f.Area())
  }
}
`,
  testes: [{ entrada: '', saida: 'Área: 25.00\nÁrea: 28.27' }],
});