// Módulo 1: Go básico. Sintaxe fundamental, tipos, controle de fluxo, funções e pacotes.
import { go, licao, problema } from './util.js';

export const moduloBasico = {
 id: 'basico',
 titulo: 'Go básico',
 icone: '🐹',
 descricao: 'Sintaxe, tipos, variáveis, constantes, controle de fluxo, funções, pacotes e o ciclo de vida de um programa Go.',
 itens: [
 licao({
 id: 'licao-ola-mundo',
 titulo: 'Olá, Mundo!',
 resumo: `
 <p><b>Go</b> é uma linguagem compilada, estaticamente tipada e concorrente, criada pelo Google. Todo programa Go começa no pacote <code>main</code> com a função <code>main()</code>.</p>
 <p>O pacote <code>fmt</code> fornece funções de formatação de entrada/saída. <code>fmt.Println</code> imprime uma linha no terminal.</p>
 <ul>
 <li>Cada arquivo pertence a um <b>pacote</b> (declarado na primeira linha).</li>
 <li>A função <code>main()</code> é o ponto de entrada do programa.</li>
 <li>Imports ficam entre parênteses quando há mais de um.</li>
 </ul>`,
 codigo: go`
 package main

 import "fmt"

 func main() {
 fmt.Println("Olá, Mundo!")
 }
 `,
 }),
 licao({
 id: 'licao-variaveis',
 titulo: 'Variáveis e tipos',
 resumo: `
 <p>Go é <b>estaticamente tipado</b>: toda variável tem um tipo fixo. Você pode declarar explicitamente ou deixar o compilador inferir.</p>
 <ul>
 <li><code>var nome string = "Ana"</code> — declaração explícita.</li>
 <li><code>idade := 30</code> — declaração curta (só dentro de funções).</li>
 <li>Tipos básicos: <code>bool</code>, <code>string</code>, <code>int</code>, <code>float64</code>, <code>byte</code>.</li>
 <li>Valores zero: <code>0</code> para números, <code>""</code> para strings, <code>false</code> para bools.</li>
 </ul>`,
 codigo: go`
 package main

 import "fmt"

 func main() {
 var nome string = "Ana"
 idade := 30
 ativo := true

 fmt.Println(nome, idade, ativo)
 }
 `,
 }),
 problema({
 id: 'prob-soma',
 titulo: 'Soma simples',
 dificuldade: 'facil',
 enunciado: `
 <p>Escreva uma função <code>Soma(a, b int) int</code> que retorna a soma de dois inteiros.</p>
 <p>No <code>main</code>, chame <code>Soma(3, 4)</code> e imprima o resultado com <code>fmt.Println</code>.</p>`,
 dica: 'A assinatura da função fica fora do main: <code>func Soma(a, b int) int { ... }</code>.',
 inicial: go`
 package main

 import "fmt"

 // TODO: implemente Soma aqui

 func main() {
 // TODO: chame Soma e imprima
 }
 `,
 solucao: go`
 package main

 import "fmt"

 func Soma(a, b int) int {
 return a + b
 }

 func main() {
 fmt.Println(Soma(3, 4))
 }
 `,
 testes: [{ entrada: '', saida: '7' }],
 }),
 problema({
 id: 'prob-par-impar',
 titulo: 'Par ou ímpar',
 dificuldade: 'medio',
 enunciado: `
 <p>Escreva uma função <code>ParOuImpar(n int) string</code> que retorna <code>"par"</code> se <code>n</code> for par e <code>"impar"</code> se for ímpar.</p>
 <p>No <code>main</code>, teste com os valores <code>4</code> e <code>7</code>, imprimindo cada resultado em uma linha separada.</p>`,
 dica: 'Use o operador resto: <code>n % 2 == 0</code> verifica se é par.',
 inicial: go`
 package main

 import "fmt"

 // TODO: implemente ParOuImpar aqui

 func main() {
 // TODO: teste com 4 e 7
 }
 `,
 solucao: go`
 package main

 import "fmt"

 func ParOuImpar(n int) string {
 if n%2 == 0 {
 return "par"
 }
 return "impar"
 }

 func main() {
 fmt.Println(ParOuImpar(4))
 fmt.Println(ParOuImpar(7))
 }
 `,
 testes: [{ entrada: '', saida: 'par\nimpar' }],
 }),
 ],
};