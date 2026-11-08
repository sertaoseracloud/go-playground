// Exercícios extras do módulo bancos. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraBancos = [
  problema({
    id: 'bancos-prob-repo-map',
    titulo: "Repositório em memória com map",
    dificuldade: 'facil',
    enunciado: "<p>Implemente um repositório de clientes indexado por ID: <code>Salvar(c)</code> grava (ou substitui) e <code>Buscar(id)</code> devolve o cliente e se ele existe.</p>",
    dica: "Use o map <code>r.dados[c.ID] = c</code> e a leitura com dois valores <code>c, ok := r.dados[id]</code>.",
    inicial: go`
package main

import "fmt"

type Cliente struct {
  ID   int
  Nome string
}

type Repo struct {
  dados map[int]Cliente
}

func (r *Repo) Salvar(c Cliente) {
  // TODO: implemente
}

func (r *Repo) Buscar(id int) (Cliente, bool) {
  // TODO: implemente
  return Cliente{}, false
}

func main() {
  r := &Repo{dados: map[int]Cliente{}}
  r.Salvar(Cliente{1, "Ana"})
  r.Salvar(Cliente{2, "Bia"})
  r.Salvar(Cliente{1, "Ana Paula"})
  fmt.Println(r.Buscar(1))
  fmt.Println(r.Buscar(3))
}
`,
    solucao: go`
package main

import "fmt"

type Cliente struct {
  ID   int
  Nome string
}

type Repo struct {
  dados map[int]Cliente
}

func (r *Repo) Salvar(c Cliente) {
  r.dados[c.ID] = c
}

func (r *Repo) Buscar(id int) (Cliente, bool) {
  c, ok := r.dados[id]
  return c, ok
}

func main() {
  r := &Repo{dados: map[int]Cliente{}}
  r.Salvar(Cliente{1, "Ana"})
  r.Salvar(Cliente{2, "Bia"})
  r.Salvar(Cliente{1, "Ana Paula"})
  fmt.Println(r.Buscar(1))
  fmt.Println(r.Buscar(3))
}
`,
    testes: [{ saida: "{1 Ana Paula} true\n{0 } false" }],
  }),
  problema({
    id: 'bancos-prob-placeholders',
    titulo: "Placeholders contra SQL injection",
    dificuldade: 'medio',
    enunciado: "<p>Nunca concatene valores do usuário no SQL. Implemente <code>montarConsulta(filtros)</code>: gere <code>SELECT * FROM produtos WHERE</code> com uma condição <code>coluna = ?</code> por filtro (colunas em ordem alfabética, unidas por <code>AND</code>) e devolva também os argumentos na mesma ordem.</p>",
    dica: "Ordene as chaves com <code>sort.Strings</code>, monte as partes com <code>col + \" = ?\"</code> e una com <code>strings.Join(partes, \" AND \")</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort" e "strings".

func montarConsulta(filtros map[string]any) (string, []any) {
  // TODO: implemente
  return "", nil
}

func main() {
  sql, args := montarConsulta(map[string]any{"nome": "x' OR '1'='1", "ativo": true})
  fmt.Println(sql)
  fmt.Println(args)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
  "strings"
)

func montarConsulta(filtros map[string]any) (string, []any) {
  cols := make([]string, 0, len(filtros))
  for c := range filtros {
    cols = append(cols, c)
  }
  sort.Strings(cols)
  partes := []string{}
  args := []any{}
  for _, c := range cols {
    partes = append(partes, c+" = ?")
    args = append(args, filtros[c])
  }
  return "SELECT * FROM produtos WHERE " + strings.Join(partes, " AND "), args
}

func main() {
  sql, args := montarConsulta(map[string]any{"nome": "x' OR '1'='1", "ativo": true})
  fmt.Println(sql)
  fmt.Println(args)
}
`,
    testes: [{ saida: "SELECT * FROM produtos WHERE ativo = ? AND nome = ?\n[true x' OR '1'='1]" }],
  }),
  problema({
    id: 'bancos-prob-transacao-snapshot',
    titulo: "Transação com rollback",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>Transacao(fn)</code>: tire uma cópia dos saldos, rode <code>fn</code> e, se ela devolver erro, restaure a cópia (rollback). Sem erro, as mudanças ficam (commit).</p>",
    dica: "Copie o map com um laço (<code>copia[k] = v</code>); em caso de erro, <code>b.saldos = copia</code>.",
    inicial: go`
package main

import (
  "errors"
  "fmt"
)

type Banco struct {
  saldos map[string]int
}

func (b *Banco) Transacao(fn func(map[string]int) error) error {
  // TODO: implemente
  return nil
}

func transferir(de, para string, valor int) func(map[string]int) error {
  return func(s map[string]int) error {
    s[de] -= valor
    if s[de] < 0 {
      return errors.New("saldo insuficiente")
    }
    s[para] += valor
    return nil
  }
}

func main() {
  b := &Banco{saldos: map[string]int{"ana": 100, "bia": 50}}
  fmt.Println(b.Transacao(transferir("ana", "bia", 30)), b.saldos)
  fmt.Println(b.Transacao(transferir("bia", "ana", 500)), b.saldos)
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
)

type Banco struct {
  saldos map[string]int
}

func (b *Banco) Transacao(fn func(map[string]int) error) error {
  copia := make(map[string]int, len(b.saldos))
  for k, v := range b.saldos {
    copia[k] = v
  }
  if err := fn(b.saldos); err != nil {
    b.saldos = copia
    return err
  }
  return nil
}

func transferir(de, para string, valor int) func(map[string]int) error {
  return func(s map[string]int) error {
    s[de] -= valor
    if s[de] < 0 {
      return errors.New("saldo insuficiente")
    }
    s[para] += valor
    return nil
  }
}

func main() {
  b := &Banco{saldos: map[string]int{"ana": 100, "bia": 50}}
  fmt.Println(b.Transacao(transferir("ana", "bia", 30)), b.saldos)
  fmt.Println(b.Transacao(transferir("bia", "ana", 500)), b.saldos)
}
`,
    testes: [{ saida: "<nil> map[ana:70 bia:80]\nsaldo insuficiente map[ana:70 bia:80]" }],
  }),
  problema({
    id: 'bancos-prob-group-by',
    titulo: "GROUP BY em memória",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>totalPorCategoria(vendas)</code>: o equivalente a <code>SELECT categoria, SUM(valor) ... GROUP BY categoria</code>, devolvendo um map.</p>",
    dica: "<code>totais[v.Categoria] += v.Valor</code>. O <code>fmt.Println</code> de um map já imprime as chaves em ordem.",
    inicial: go`
package main

import "fmt"

type Venda struct {
  Categoria string
  Valor     float64
}

func totalPorCategoria(vendas []Venda) map[string]float64 {
  // TODO: implemente
  return nil
}

func main() {
  vendas := []Venda{{"livros", 40}, {"jogos", 150}, {"livros", 25.5}, {"café", 12}, {"jogos", 50}}
  fmt.Println(totalPorCategoria(vendas))
}
`,
    solucao: go`
package main

import "fmt"

type Venda struct {
  Categoria string
  Valor     float64
}

func totalPorCategoria(vendas []Venda) map[string]float64 {
  totais := map[string]float64{}
  for _, v := range vendas {
    totais[v.Categoria] += v.Valor
  }
  return totais
}

func main() {
  vendas := []Venda{{"livros", 40}, {"jogos", 150}, {"livros", 25.5}, {"café", 12}, {"jogos", 50}}
  fmt.Println(totalPorCategoria(vendas))
}
`,
    testes: [{ saida: "map[café:12 jogos:200 livros:65.5]" }],
  }),
  problema({
    id: 'bancos-prob-join',
    titulo: "JOIN entre duas tabelas",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>juntar(pedidos, clientes)</code>: para cada pedido, monte a linha <code>#ID NOME_DO_CLIENTE R$ TOTAL</code> (um INNER JOIN: pedidos sem cliente ficam de fora).</p>",
    dica: "Indexe os clientes num <code>map[int]string</code> primeiro; depois percorra os pedidos consultando o map.",
    inicial: go`
package main

import "fmt"

type Cliente struct {
  ID   int
  Nome string
}

type Pedido struct {
  ID, ClienteID int
  Total         float64
}

func juntar(pedidos []Pedido, clientes []Cliente) []string {
  // TODO: implemente
  return nil
}

func main() {
  clientes := []Cliente{{1, "Ana"}, {2, "Bia"}}
  pedidos := []Pedido{{10, 2, 99.9}, {11, 1, 15}, {12, 7, 42}}
  for _, linha := range juntar(pedidos, clientes) {
    fmt.Println(linha)
  }
}
`,
    solucao: go`
package main

import "fmt"

type Cliente struct {
  ID   int
  Nome string
}

type Pedido struct {
  ID, ClienteID int
  Total         float64
}

func juntar(pedidos []Pedido, clientes []Cliente) []string {
  nomes := map[int]string{}
  for _, c := range clientes {
    nomes[c.ID] = c.Nome
  }
  out := []string{}
  for _, p := range pedidos {
    if nome, ok := nomes[p.ClienteID]; ok {
      out = append(out, fmt.Sprintf("#%d %s R$ %.2f", p.ID, nome, p.Total))
    }
  }
  return out
}

func main() {
  clientes := []Cliente{{1, "Ana"}, {2, "Bia"}}
  pedidos := []Pedido{{10, 2, 99.9}, {11, 1, 15}, {12, 7, 42}}
  for _, linha := range juntar(pedidos, clientes) {
    fmt.Println(linha)
  }
}
`,
    testes: [{ saida: "#10 Bia R$ 99.90\n#11 Ana R$ 15.00" }],
  }),
  problema({
    id: 'bancos-prob-soft-delete',
    titulo: "Exclusão lógica (soft delete)",
    dificuldade: 'medio',
    enunciado: "<p>Em vez de apagar, marcamos o registro como excluído. Implemente <code>Excluir(id)</code> (marca <code>Excluido = true</code>) e <code>Ativos()</code> (devolve os nomes não excluídos).</p>",
    dica: "Percorra com índice para alterar o slice original: <code>for i := range t.linhas { if t.linhas[i].ID == id { t.linhas[i].Excluido = true } }</code>.",
    inicial: go`
package main

import "fmt"

type Linha struct {
  ID       int
  Nome     string
  Excluido bool
}

type Tabela struct {
  linhas []Linha
}

func (t *Tabela) Excluir(id int) {
  // TODO: implemente
}

func (t *Tabela) Ativos() []string {
  // TODO: implemente
  return nil
}

func main() {
  t := &Tabela{linhas: []Linha{{1, "caneta", false}, {2, "lápis", false}, {3, "borracha", false}}}
  t.Excluir(2)
  fmt.Println(t.Ativos())
  fmt.Println(len(t.linhas))
}
`,
    solucao: go`
package main

import "fmt"

type Linha struct {
  ID       int
  Nome     string
  Excluido bool
}

type Tabela struct {
  linhas []Linha
}

func (t *Tabela) Excluir(id int) {
  for i := range t.linhas {
    if t.linhas[i].ID == id {
      t.linhas[i].Excluido = true
    }
  }
}

func (t *Tabela) Ativos() []string {
  out := []string{}
  for _, l := range t.linhas {
    if !l.Excluido {
      out = append(out, l.Nome)
    }
  }
  return out
}

func main() {
  t := &Tabela{linhas: []Linha{{1, "caneta", false}, {2, "lápis", false}, {3, "borracha", false}}}
  t.Excluir(2)
  fmt.Println(t.Ativos())
  fmt.Println(len(t.linhas))
}
`,
    testes: [{ saida: "[caneta borracha]\n3" }],
  }),
  problema({
    id: 'bancos-prob-lock-otimista',
    titulo: "Lock otimista com versão",
    dificuldade: 'dificil',
    enunciado: "<p>Para evitar que duas pessoas sobrescrevam a mesma edição, cada registro tem uma <code>Versao</code>.</p>\n<p>Implemente <code>Atualizar(novoTexto, versaoLida)</code>: só atualize se <code>versaoLida</code> for igual à versão atual (e incremente a versão); senão, devolva o erro <code>conflito: versão X, atual Y</code>.</p>",
    dica: "Compare as versões, use <code>fmt.Errorf</code> para o erro e, no sucesso, <code>r.Versao++</code>.",
    inicial: go`
package main

import "fmt"

type Registro struct {
  Texto  string
  Versao int
}

func (r *Registro) Atualizar(novoTexto string, versaoLida int) error {
  // TODO: implemente
  return nil
}

func main() {
  doc := &Registro{Texto: "rascunho", Versao: 1}
  lidaPorAna, lidaPorBia := doc.Versao, doc.Versao
  fmt.Println(doc.Atualizar("versão da Ana", lidaPorAna))
  fmt.Println(doc.Atualizar("versão da Bia", lidaPorBia))
  fmt.Println(doc.Texto, doc.Versao)
}
`,
    solucao: go`
package main

import "fmt"

type Registro struct {
  Texto  string
  Versao int
}

func (r *Registro) Atualizar(novoTexto string, versaoLida int) error {
  if versaoLida != r.Versao {
    return fmt.Errorf("conflito: versão %d, atual %d", versaoLida, r.Versao)
  }
  r.Texto = novoTexto
  r.Versao++
  return nil
}

func main() {
  doc := &Registro{Texto: "rascunho", Versao: 1}
  lidaPorAna, lidaPorBia := doc.Versao, doc.Versao
  fmt.Println(doc.Atualizar("versão da Ana", lidaPorAna))
  fmt.Println(doc.Atualizar("versão da Bia", lidaPorBia))
  fmt.Println(doc.Texto, doc.Versao)
}
`,
    testes: [{ saida: "<nil>\nconflito: versão 1, atual 2\nversão da Ana 2" }],
  }),
  problema({
    id: 'bancos-prob-upsert',
    titulo: "Upsert",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>upsert(estoque, item, qtd)</code>: se o item existir, some a quantidade; se não, insira. Devolva <code>\"inserido\"</code> ou <code>\"atualizado\"</code>.</p>",
    dica: "Verifique com <code>_, ok := estoque[item]</code> antes de somar.",
    inicial: go`
package main

import "fmt"

func upsert(estoque map[string]int, item string, qtd int) string {
  // TODO: implemente
  return ""
}

func main() {
  e := map[string]int{"arroz": 10}
  fmt.Println(upsert(e, "feijão", 5))
  fmt.Println(upsert(e, "arroz", 3))
  fmt.Println(e)
}
`,
    solucao: go`
package main

import "fmt"

func upsert(estoque map[string]int, item string, qtd int) string {
  _, ok := estoque[item]
  estoque[item] += qtd
  if ok {
    return "atualizado"
  }
  return "inserido"
}

func main() {
  e := map[string]int{"arroz": 10}
  fmt.Println(upsert(e, "feijão", 5))
  fmt.Println(upsert(e, "arroz", 3))
  fmt.Println(e)
}
`,
    testes: [{ saida: "inserido\natualizado\nmap[arroz:13 feijão:5]" }],
  }),
  problema({
    id: 'bancos-prob-cache-aside',
    titulo: "Cache-aside",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>Buscar(id)</code> com o padrão cache-aside: procure no cache; se não achar, busque no \"banco\" (<code>s.banco</code>), guarde no cache e devolva.</p>\n<p>O <code>main</code> conta quantas vezes o banco foi consultado.</p>",
    dica: "Se <code>v, ok := s.cache[id]; ok</code>, devolva logo. Senão, <code>v := s.banco(id)</code> e <code>s.cache[id] = v</code>.",
    inicial: go`
package main

import "fmt"

type Servico struct {
  cache map[int]string
  banco func(int) string
}

func (s *Servico) Buscar(id int) string {
  // TODO: implemente
  return ""
}

func main() {
  consultas := 0
  s := &Servico{cache: map[int]string{}, banco: func(id int) string {
    consultas++
    return fmt.Sprintf("produto-%d", id)
  }}
  for _, id := range []int{1, 2, 1, 1, 2, 3} {
    fmt.Print(s.Buscar(id), " ")
  }
  fmt.Println()
  fmt.Println("consultas ao banco:", consultas)
}
`,
    solucao: go`
package main

import "fmt"

type Servico struct {
  cache map[int]string
  banco func(int) string
}

func (s *Servico) Buscar(id int) string {
  if v, ok := s.cache[id]; ok {
    return v
  }
  v := s.banco(id)
  s.cache[id] = v
  return v
}

func main() {
  consultas := 0
  s := &Servico{cache: map[int]string{}, banco: func(id int) string {
    consultas++
    return fmt.Sprintf("produto-%d", id)
  }}
  for _, id := range []int{1, 2, 1, 1, 2, 3} {
    fmt.Print(s.Buscar(id), " ")
  }
  fmt.Println()
  fmt.Println("consultas ao banco:", consultas)
}
`,
    testes: [{ saida: "produto-1 produto-2 produto-1 produto-1 produto-2 produto-3\nconsultas ao banco: 3" }],
  }),
  problema({
    id: 'bancos-prob-migracoes',
    titulo: "Ordem das migrações",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>pendentes(todas, aplicadas)</code>: devolva as migrações ainda não aplicadas, em ordem crescente de nome (os nomes começam com a data).</p>",
    dica: "Monte um conjunto com as aplicadas, filtre <code>todas</code> e ordene com <code>sort.Strings</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort".

func pendentes(todas, aplicadas []string) []string {
  // TODO: implemente
  return nil
}

func main() {
  todas := []string{"2026_03_cria_pedidos", "2026_01_cria_usuarios", "2026_05_indice_email", "2026_02_cria_produtos"}
  aplicadas := []string{"2026_01_cria_usuarios", "2026_02_cria_produtos"}
  for _, m := range pendentes(todas, aplicadas) {
    fmt.Println(m)
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
)

func pendentes(todas, aplicadas []string) []string {
  feitas := map[string]bool{}
  for _, a := range aplicadas {
    feitas[a] = true
  }
  out := []string{}
  for _, m := range todas {
    if !feitas[m] {
      out = append(out, m)
    }
  }
  sort.Strings(out)
  return out
}

func main() {
  todas := []string{"2026_03_cria_pedidos", "2026_01_cria_usuarios", "2026_05_indice_email", "2026_02_cria_produtos"}
  aplicadas := []string{"2026_01_cria_usuarios", "2026_02_cria_produtos"}
  for _, m := range pendentes(todas, aplicadas) {
    fmt.Println(m)
  }
}
`,
    testes: [{ saida: "2026_03_cria_pedidos\n2026_05_indice_email" }],
  }),
  problema({
    id: 'bancos-prob-indice',
    titulo: "Criando um índice",
    dificuldade: 'medio',
    enunciado: "<p>Buscar percorrendo a tabela inteira é lento. Implemente <code>indexarPorEmail(usuarios)</code>: monte um map de email (em minúsculas) para a posição do usuário no slice.</p>",
    dica: "<code>idx[strings.ToLower(u.Email)] = i</code> para cada <code>i, u</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

type Usuario struct {
  Nome, Email string
}

func indexarPorEmail(usuarios []Usuario) map[string]int {
  // TODO: implemente
  return nil
}

func main() {
  us := []Usuario{{"Ana", "Ana@Ex.com"}, {"Bia", "bia@ex.com"}, {"Caio", "CAIO@ex.com"}}
  idx := indexarPorEmail(us)
  for _, e := range []string{"caio@ex.com", "ana@ex.com"} {
    fmt.Println(e, "->", us[idx[e]].Nome)
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

type Usuario struct {
  Nome, Email string
}

func indexarPorEmail(usuarios []Usuario) map[string]int {
  idx := make(map[string]int, len(usuarios))
  for i, u := range usuarios {
    idx[strings.ToLower(u.Email)] = i
  }
  return idx
}

func main() {
  us := []Usuario{{"Ana", "Ana@Ex.com"}, {"Bia", "bia@ex.com"}, {"Caio", "CAIO@ex.com"}}
  idx := indexarPorEmail(us)
  for _, e := range []string{"caio@ex.com", "ana@ex.com"} {
    fmt.Println(e, "->", us[idx[e]].Nome)
  }
}
`,
    testes: [{ saida: "caio@ex.com -> Caio\nana@ex.com -> Ana" }],
  }),
  problema({
    id: 'bancos-prob-n-mais-um',
    titulo: "Evitando o N+1",
    dificuldade: 'dificil',
    enunciado: "<p>Buscar o autor de cada post com uma consulta por post é o problema \"N+1\". Implemente <code>carregarAutores(posts, buscarVarios)</code>: junte os IDs <b>únicos</b> dos autores, faça <b>uma</b> chamada a <code>buscarVarios</code> e devolva <code>TITULO por AUTOR</code> para cada post.</p>",
    dica: "Use um conjunto para os IDs, ordene-os (<code>sort.Ints</code>) para a chamada ser previsível e consulte o map devolvido.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort".

type Post struct {
  Titulo  string
  AutorID int
}

func carregarAutores(posts []Post, buscarVarios func([]int) map[int]string) []string {
  // TODO: implemente
  return nil
}

func main() {
  nomes := map[int]string{1: "Ana", 2: "Bia", 3: "Caio"}
  chamadas := 0
  buscar := func(ids []int) map[int]string {
    chamadas++
    fmt.Println("SELECT ... WHERE id IN", ids)
    out := map[int]string{}
    for _, id := range ids {
      out[id] = nomes[id]
    }
    return out
  }
  posts := []Post{{"Go 101", 2}, {"Canais", 1}, {"Generics", 2}, {"Testes", 3}}
  for _, l := range carregarAutores(posts, buscar) {
    fmt.Println(l)
  }
  fmt.Println("consultas:", chamadas)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
)

type Post struct {
  Titulo  string
  AutorID int
}

func carregarAutores(posts []Post, buscarVarios func([]int) map[int]string) []string {
  vistos := map[int]bool{}
  ids := []int{}
  for _, p := range posts {
    if !vistos[p.AutorID] {
      vistos[p.AutorID] = true
      ids = append(ids, p.AutorID)
    }
  }
  sort.Ints(ids)
  autores := buscarVarios(ids)
  out := []string{}
  for _, p := range posts {
    out = append(out, p.Titulo+" por "+autores[p.AutorID])
  }
  return out
}

func main() {
  nomes := map[int]string{1: "Ana", 2: "Bia", 3: "Caio"}
  chamadas := 0
  buscar := func(ids []int) map[int]string {
    chamadas++
    fmt.Println("SELECT ... WHERE id IN", ids)
    out := map[int]string{}
    for _, id := range ids {
      out[id] = nomes[id]
    }
    return out
  }
  posts := []Post{{"Go 101", 2}, {"Canais", 1}, {"Generics", 2}, {"Testes", 3}}
  for _, l := range carregarAutores(posts, buscar) {
    fmt.Println(l)
  }
  fmt.Println("consultas:", chamadas)
}
`,
    testes: [{ saida: "SELECT ... WHERE id IN [1 2 3]\nGo 101 por Bia\nCanais por Ana\nGenerics por Bia\nTestes por Caio\nconsultas: 1" }],
  }),
  problema({
    id: 'bancos-prob-pool-conexoes',
    titulo: "Pool de conexões",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente um pool com um número fixo de conexões: <code>Pegar()</code> devolve uma conexão livre (ou <code>\"\", false</code> se todas estiverem em uso) e <code>Devolver(c)</code> a coloca de volta.</p>",
    dica: "Um canal com buffer guarda as conexões livres. <code>Pegar</code> usa <code>select</code> com <code>default</code> para não bloquear.",
    inicial: go`
package main

import "fmt"

type Pool struct {
  livres chan string
}

func NovoPool(n int) *Pool {
  p := &Pool{livres: make(chan string, n)}
  for i := 1; i <= n; i++ {
    p.livres <- fmt.Sprintf("conn-%d", i)
  }
  return p
}

func (p *Pool) Pegar() (string, bool) {
  // TODO: implemente
  return "", false
}

func (p *Pool) Devolver(c string) {
  // TODO: implemente
}

func main() {
  p := NovoPool(2)
  a, _ := p.Pegar()
  b, _ := p.Pegar()
  fmt.Println(a, b)
  fmt.Println(p.Pegar())
  p.Devolver(a)
  fmt.Println(p.Pegar())
}
`,
    solucao: go`
package main

import "fmt"

type Pool struct {
  livres chan string
}

func NovoPool(n int) *Pool {
  p := &Pool{livres: make(chan string, n)}
  for i := 1; i <= n; i++ {
    p.livres <- fmt.Sprintf("conn-%d", i)
  }
  return p
}

func (p *Pool) Pegar() (string, bool) {
  select {
  case c := <-p.livres:
    return c, true
  default:
    return "", false
  }
}

func (p *Pool) Devolver(c string) {
  p.livres <- c
}

func main() {
  p := NovoPool(2)
  a, _ := p.Pegar()
  b, _ := p.Pegar()
  fmt.Println(a, b)
  fmt.Println(p.Pegar())
  p.Devolver(a)
  fmt.Println(p.Pegar())
}
`,
    testes: [{ saida: "conn-1 conn-2\n false\nconn-1 true" }],
  }),
  problema({
    id: 'bancos-prob-csv-registros',
    titulo: "Importando CSV",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>importar(texto)</code>: leia o CSV (com cabeçalho) usando <code>encoding/csv</code> e devolva os produtos. Linhas com preço inválido são ignoradas.</p>",
    dica: "<code>linhas, _ := csv.NewReader(strings.NewReader(texto)).ReadAll()</code>; pule <code>linhas[0]</code> e converta o preço com <code>strconv.ParseFloat</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "encoding/csv" e "strconv" e "strings".

type Produto struct {
  Nome  string
  Preco float64
}

func importar(texto string) []Produto {
  // TODO: implemente
  return nil
}

func main() {
  texto := "nome,preco\\ncaneca,29.90\\n\\"livro, capa dura\\",80\\ncadeira,abc\\n"
  for _, p := range importar(texto) {
    fmt.Printf("%s: %.2f\\n", p.Nome, p.Preco)
  }
}
`,
    solucao: go`
package main

import (
  "encoding/csv"
  "fmt"
  "strconv"
  "strings"
)

type Produto struct {
  Nome  string
  Preco float64
}

func importar(texto string) []Produto {
  linhas, err := csv.NewReader(strings.NewReader(texto)).ReadAll()
  if err != nil {
    return nil
  }
  out := []Produto{}
  for _, l := range linhas[1:] {
    preco, err := strconv.ParseFloat(l[1], 64)
    if err != nil {
      continue
    }
    out = append(out, Produto{l[0], preco})
  }
  return out
}

func main() {
  texto := "nome,preco\\ncaneca,29.90\\n\\"livro, capa dura\\",80\\ncadeira,abc\\n"
  for _, p := range importar(texto) {
    fmt.Printf("%s: %.2f\\n", p.Nome, p.Preco)
  }
}
`,
    testes: [{ saida: "caneca: 29.90\nlivro, capa dura: 80.00" }],
  }),
  problema({
    id: 'bancos-prob-chave-redis',
    titulo: "Chaves no estilo Redis com expiração",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente um cache com expiração usando um relógio simulado (<code>c.agora</code>, em segundos): <code>Definir(chave, valor, ttl)</code> grava com prazo e <code>Obter(chave)</code> devolve o valor se ainda não expirou.</p>",
    dica: "Guarde <code>expira := c.agora + ttl</code> junto do valor. Em <code>Obter</code>, se <code>c.agora &gt;= expira</code>, apague a chave e devolva <code>\"\", false</code>.",
    inicial: go`
package main

import "fmt"

type entrada struct {
  valor  string
  expira int
}

type Cache struct {
  agora int
  dados map[string]entrada
}

func (c *Cache) Definir(chave, valor string, ttl int) {
  // TODO: implemente
}

func (c *Cache) Obter(chave string) (string, bool) {
  // TODO: implemente
  return "", false
}

func main() {
  c := &Cache{dados: map[string]entrada{}}
  c.Definir("sessao:ana", "token123", 30)
  c.agora = 10
  fmt.Println(c.Obter("sessao:ana"))
  c.agora = 30
  fmt.Println(c.Obter("sessao:ana"))
  fmt.Println(len(c.dados))
}
`,
    solucao: go`
package main

import "fmt"

type entrada struct {
  valor  string
  expira int
}

type Cache struct {
  agora int
  dados map[string]entrada
}

func (c *Cache) Definir(chave, valor string, ttl int) {
  c.dados[chave] = entrada{valor: valor, expira: c.agora + ttl}
}

func (c *Cache) Obter(chave string) (string, bool) {
  e, ok := c.dados[chave]
  if !ok {
    return "", false
  }
  if c.agora >= e.expira {
    delete(c.dados, chave)
    return "", false
  }
  return e.valor, true
}

func main() {
  c := &Cache{dados: map[string]entrada{}}
  c.Definir("sessao:ana", "token123", 30)
  c.agora = 10
  fmt.Println(c.Obter("sessao:ana"))
  c.agora = 30
  fmt.Println(c.Obter("sessao:ana"))
  fmt.Println(len(c.dados))
}
`,
    testes: [{ saida: "token123 true\n false\n0" }],
  }),
  problema({
    id: 'bancos-prob-paginacao-cursor',
    titulo: "Paginação por cursor",
    dificuldade: 'dificil',
    enunciado: "<p>Paginação por cursor é estável mesmo com inserções. Implemente <code>pagina(ids, depois, limite)</code>: devolva até <code>limite</code> IDs (o slice está ordenado) <b>maiores</b> que o cursor <code>depois</code>, e o próximo cursor (o último ID devolvido, ou <code>0</code> se acabou).</p>",
    dica: "Percorra pegando só <code>id &gt; depois</code> até encher. O próximo cursor é o último pego, se a página veio cheia.",
    inicial: go`
package main

import "fmt"

func pagina(ids []int, depois, limite int) ([]int, int) {
  // TODO: implemente
  return nil, 0
}

func main() {
  ids := []int{3, 8, 15, 21, 30, 42, 57}
  cursor := 0
  for {
    p, prox := pagina(ids, cursor, 3)
    fmt.Println(p, prox)
    if prox == 0 {
      break
    }
    cursor = prox
  }
}
`,
    solucao: go`
package main

import "fmt"

func pagina(ids []int, depois, limite int) ([]int, int) {
  out := []int{}
  for _, id := range ids {
    if id > depois {
      out = append(out, id)
      if len(out) == limite {
        break
      }
    }
  }
  proximo := 0
  if len(out) == limite {
    proximo = out[len(out)-1]
  }
  return out, proximo
}

func main() {
  ids := []int{3, 8, 15, 21, 30, 42, 57}
  cursor := 0
  for {
    p, prox := pagina(ids, cursor, 3)
    fmt.Println(p, prox)
    if prox == 0 {
      break
    }
    cursor = prox
  }
}
`,
    testes: [{ saida: "[3 8 15] 15\n[21 30 42] 42\n[57] 0" }],
  }),
];
