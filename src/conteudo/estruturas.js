import { go, licao, problema } from './util.js';
import { extraEstruturas } from './problemas/extra-estruturas.js';

export const moduloEstruturas = {
 id: 'estruturas',
 titulo: 'Estrutura de Dados',
 icone: '\u{1f4e6}',
 descricao: 'Arrays, slices, maps, structs, métodos, interfaces, generics e ponteiros.',
 itens: [
 licao({
 id: 'estruturas-licao-arrays',
 titulo: 'Arrays em Go',
 resumo: 'Arrays têm tamanho fixo definido no tipo. São valores, não referências.',
 codigo: go`
 package main
 import "fmt"

 func main() {
 var a [5]int
 a[0] = 10
 a[1] = 20
 fmt.Println("Array:", a)
 fmt.Println("Tamanho:", len(a))

 b := [3]string{"Go", "Rust", "C"}
 fmt.Println("Strings:", b)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-slices',
 titulo: 'Slices: Arrays Dinâmicos',
 resumo: 'Slices são referências a arrays subjacentes. Têm len e cap dinâmicos.',
 codigo: go`
 package main
 import "fmt"

 func main() {
 s := []int{1, 2, 3, 4, 5}
 fmt.Println("Slice:", s)
 fmt.Println("Len:", len(s))

 sub := s[1:3]
 fmt.Println("Sub-slice:", sub)

 s[1] = 99
 fmt.Println("Original apos mudanca:", s)
 fmt.Println("Sub-slice reflete:", sub)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-append-copy',
 titulo: 'Append e Copy',
 resumo: 'append adiciona elementos (pode realocar). copy copia entre slices.',
 codigo: go`
 package main
 import "fmt"

 func main() {
 s := []int{1, 2}
 s = append(s, 3, 4)
 fmt.Println("Apos append:", s)

 dst := make([]int, len(s))
 copy(dst, s)
 fmt.Println("Copia:", dst)

 dst[0] = 99
 fmt.Println("Original:", s)
 fmt.Println("Copia modificada:", dst)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-maps',
 titulo: 'Maps',
 resumo: 'Maps associam chaves a valores. Use make ou literal para criar.',
 codigo: go`
 package main
 import "fmt"

 func main() {
 m := make(map[string]int)
 m["Ana"] = 25
 m["Bob"] = 30
 fmt.Println("Map:", m)
 fmt.Println("Ana:", m["Ana"])

 m["Carol"] = 28
 delete(m, "Bob")
 fmt.Println("Apos mudancas:", m)

 v, ok := m["Bob"]
 fmt.Println("Bob existe?", ok, "valor:", v)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-structs',
 titulo: 'Structs',
 resumo: 'Structs agrupam campos heterogêneos. São tipos compostos por valor.',
 codigo: go`
 package main
 import "fmt"

 type Pessoa struct {
 Nome string
 Idade int
 }

 func main() {
 p := Pessoa{Nome: "Ana", Idade: 25}
 fmt.Println("Pessoa:", p)
 fmt.Println("Nome:", p.Nome)

 p.Idade = 26
 fmt.Println("Atualizada:", p)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-metodos',
 titulo: 'Métodos',
 resumo: 'Métodos são funções com receptor. Podem ser por valor ou ponteiro.',
 codigo: go`
 package main
 import "fmt"

 type Retangulo struct {
 Largura float64
 Altura float64
 }

 func (r Retangulo) Area() float64 {
 return r.Largura * r.Altura
 }

 func (r *Retangulo) Escalar(fator float64) {
 r.Largura = r.Largura * fator
 r.Altura = r.Altura * fator
 }

 func main() {
 r := Retangulo{Largura: 3, Altura: 4}
 fmt.Println("Area:", r.Area())
 r.Escalar(2)
 fmt.Println("Apos escalar:", r)
 fmt.Println("Nova area:", r.Area())
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-ponteiros',
 titulo: 'Ponteiros',
 resumo: 'Ponteiros armazenam endereços de memória. Use & e * para acessar.',
 codigo: go`
 package main
 import "fmt"

 func dobrar(x *int) {
 *x = *x * 2
 }

 func main() {
 n := 5
 fmt.Println("Antes:", n)
 dobrar(&n)
 fmt.Println("Depois:", n)

 p := &n
 fmt.Println("Endereco:", p)
 fmt.Println("Valor via ponteiro:", *p)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-embedded',
 titulo: 'Embedded Structs',
 resumo: 'Composição: inclua uma struct dentro de outra para herdar campos.',
 codigo: go`
 package main
 import "fmt"

 type Endereco struct {
 Rua string
 Cidade string
 }

 type Funcionario struct {
 Nome string
 Endereco
 }

 func main() {
 f := Funcionario{
 Nome: "Ana",
 Endereco: Endereco{Rua: "Av. Brasil", Cidade: "SP"},
 }
 fmt.Println("Nome:", f.Nome)
 fmt.Println("Cidade (promovido):", f.Cidade)
 fmt.Println("Endereco completo:", f.Endereco)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-sort',
 titulo: 'Ordenação Simples',
 resumo: 'Implemente bubble sort para entender ordenação sem packages externos.',
 codigo: go`
 package main
 import "fmt"

 func bubbleSort(s []int) {
 n := len(s)
 for i := 0; i < n; i++ {
 for j := 0; j < n-1-i; j++ {
 if s[j] > s[j+1] {
 s[j], s[j+1] = s[j+1], s[j]
 }
 }
 }
 }

 func main() {
 nums := []int{5, 3, 8, 1, 2}
 fmt.Println("Antes:", nums)
 bubbleSort(nums)
 fmt.Println("Depois:", nums)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-slice-structs',
 titulo: 'Slice de Structs',
 resumo: 'Coleções de structs são comuns. Combine com métodos para processar.',
 codigo: go`
 package main
 import "fmt"

 type Produto struct {
 Nome string
 Preco float64
 }

 func total(produtos []Produto) float64 {
 soma := 0.0
 for _, p := range produtos {
 soma = soma + p.Preco
 }
 return soma
 }

 func main() {
 lista := []Produto{
 {"Caneta", 2.5},
 {"Caderno", 15.0},
 {"Borracha", 1.0},
 }
 fmt.Println("Total:", total(lista))
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-map-slices',
 titulo: 'Maps de Slices',
 resumo: 'Agrupe dados por chave usando map[string][]tipo.',
 codigo: go`
 package main
 import "fmt"

 func main() {
 notas := make(map[string][]int)
 notas["Ana"] = []int{8, 9, 7}
 notas["Bob"] = []int{6, 7, 8}

 for nome, ns := range notas {
 soma := 0
 for _, n := range ns {
 soma = soma + n
 }
 media := soma / len(ns)
 fmt.Println(nome, "media:", media)
 }
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-iteracao-maps',
 titulo: 'Iteração em Maps',
 resumo: 'for-range em maps não tem ordem garantida. Ordene chaves se necessário.',
 codigo: go`
 package main
 import "fmt"

 func main() {
 cores := make(map[int]string)
 cores[1] = "vermelho"
 cores[2] = "verde"
 cores[3] = "azul"

 chaves := []int{}
 for k := range cores {
 chaves = append(chaves, k)
 }

 for i := 0; i < len(chaves); i++ {
 for j := i + 1; j < len(chaves); j++ {
 if chaves[i] > chaves[j] {
 chaves[i], chaves[j] = chaves[j], chaves[i]
 }
 }
 }

 for _, k := range chaves {
 fmt.Println(k, cores[k])
 }
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-comparacao-structs',
 titulo: 'Comparação de Structs',
 resumo: 'Structs comparáveis podem usar ==. Campos incomparáveis impedem isso.',
 codigo: go`
 package main
 import "fmt"

 type Ponto struct {
 X int
 Y int
 }

 func main() {
 a := Ponto{X: 1, Y: 2}
 b := Ponto{X: 1, Y: 2}
 c := Ponto{X: 3, Y: 4}

 fmt.Println("a == b:", a == b)
 fmt.Println("a == c:", a == c)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-interface-conceito',
 titulo: 'Interfaces (Conceito)',
 resumo: 'Interfaces definem comportamento. Em Go, implementação é implícita.',
 codigo: go`
 package main
 import "fmt"

 type Descritivel interface {
 Descrever() string
 }

 type Livro struct {
 Titulo string
 }

 func (l Livro) Descrever() string {
 return "Livro: " + l.Titulo
 }

 func imprimir(d Descritivel) {
 fmt.Println(d.Descrever())
 }

 func main() {
 l := Livro{Titulo: "Go Programming"}
 imprimir(l)
 }
 `,
 }),
 licao({
 id: 'estruturas-licao-type-switch',
 titulo: 'Type Switch (Conceito)',
 resumo: 'Type switch identifica o tipo concreto de uma interface.',
 codigo: go`
 package main
 import "fmt"

 func descrever(i interface{}) string {
 switch v := i.(type) {
 case int:
 return fmt.Sprintf("Inteiro: %d", v)
 case string:
 return fmt.Sprintf("String: %s", v)
 default:
 return "Tipo desconhecido"
 }
 }

 func main() {
 fmt.Println(descrever(42))
 fmt.Println(descrever("ola"))
 fmt.Println(descrever(3.14))
 }
 `,
 }),
 problema({
 id: 'estruturas-prob-array-fixo',
 titulo: 'Array Fixo de Inteiros',
 dificuldade: 'facil',
 enunciado: '<p>Crie um array de 5 inteiros, preencha com 10,20,30,40,50 e imprima cada elemento em uma linha.</p>',
 dica: '<p>Use var arr [5]int e atribua cada posicao.</p>',
 inicial: go`
package main
import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
// Crie um array [5]int e imprima cada elemento
}
`,
 solucao: go`
 package main
 import "fmt"

 func main() {
 var arr [5]int
 arr[0] = 10
 arr[1] = 20
 arr[2] = 30
 arr[3] = 40
 arr[4] = 50
 for i := 0; i < 5; i++ {
 fmt.Println(arr[i])
 }
 }
 `,
 testes: [{ entrada: '', saida: '10\n20\n30\n40\n50' }],
 }),
 problema({
 id: 'estruturas-prob-slice-dinamico',
 titulo: 'Slice Dinamico',
 dificuldade: 'facil',
 enunciado: '<p>Crie um slice com os numeros de 1 a 5 usando literal e imprima-o.</p>',
 dica: '<p>Use []int{1, 2, 3, 4, 5} e fmt.Println.</p>',
 inicial: go`
package main
import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
// Crie e imprima um slice [1..5]
}
`,
 solucao: go`
 package main
 import "fmt"

 func main() {
 s := []int{1, 2, 3, 4, 5}
 fmt.Println(s)
 }
 `,
 testes: [{ entrada: '', saida: '[1 2 3 4 5]' }],
 }),
 problema({
 id: 'estruturas-prob-append-elementos',
 titulo: 'Append de Elementos',
 dificuldade: 'facil',
 enunciado: '<p>Comece com um slice vazio. Adicione 1, 2, 3 usando append e imprima.</p>',
 dica: '<p>Use s := []int{} e s = append(s, valor).</p>',
 inicial: go`
package main
import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

func main() {
// Crie slice vazio, adicione 1,2,3 e imprima
}
`,
 solucao: go`
 package main
 import "fmt"

 func main() {
 s := []int{}
 s = append(s, 1)
 s = append(s, 2)
 s = append(s, 3)
 fmt.Println(s)
 }
 `,
 testes: [{ entrada: '', saida: '[1 2 3]' }],
 }),
   ...extraEstruturas,
  ],
};
