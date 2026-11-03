import { go, problema } from '../util.js';

export const probStructs = problema({
  id: 'go-structs',
  titulo: 'Structs e métodos',
  dificuldade: 'medio',
  enunciado: `
    <p>Structs agrupam dados. Você pode definir métodos para elas usando receptores.</p>
    <ul>
      <li>Crie uma struct <code>Pessoa</code> com campos <code>Nome</code> (string) e <code>Idade</code> (int).</li>
      <li>Crie um método <code>Saudacao</code> que retorna "Olá, eu sou [Nome]".</li>
      <li>No main, crie uma pessoa "Ana" de 30 anos e imprima a saudação.</li>
    </ul>`,
  dica: 'A assinatura do método fica assim: <code>func (p Pessoa) Saudacao() string { ... }</code>',
  inicial: go`
package main

import "fmt"

// TODO: defina a struct Pessoa

// TODO: defina o método Saudacao

func main() {
  // TODO: crie a instância e imprima
}
`,
  solucao: go`
package main

import "fmt"

type Pessoa struct {
  Nome  string
  Idade int
}

func (p Pessoa) Saudacao() string {
  return "Olá, eu sou " + p.Nome
}

func main() {
  p := Pessoa{Nome: "Ana", Idade: 30}
  fmt.Println(p.Saudacao())
}
`,
  testes: [{ entrada: '', saida: 'Olá, eu sou Ana' }],
});