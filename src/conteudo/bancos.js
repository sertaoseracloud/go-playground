import { go, licao, problema } from './util.js';
import { extraBancos } from './problemas/extra-bancos.js';

export const moduloBancos = {
  id: 'bancos',
  titulo: 'Bancos e Cache',
  icone: '🗄️',
  descricao: 'SQL/database, PostgreSQL, SQLite, MongoDB, Redis/cache e migrations.',
  itens: [
    // === LIÇÕES (15) ===
    licao({
      id: 'bancos-conceitos-sql-licao',
      titulo: 'Conceitos SQL Fundamentais',
      resumo: '<p>SQL (Structured Query Language) é a linguagem padrão para bancos relacionais. Aprenda os conceitos básicos: tabelas, linhas, colunas e tipos de dados.</p>',
      codigo: go`package main

import "fmt"

// Registro representa uma linha em uma tabela
type Registro struct {
  ID    int
  Nome  string
  Valor float64
}

func main() {
  // Simulando uma tabela com slice de structs
  tabela := []Registro{
    {ID: 1, Nome: "Produto A", Valor: 10.50},
    {ID: 2, Nome: "Produto B", Valor: 25.00},
    {ID: 3, Nome: "Produto C", Valor: 15.75},
  }

  fmt.Println("=== Tabela de Produtos ===")
  for _, r := range tabela {
    fmt.Printf("ID: %d | Nome: %s | Valor: %.2f\\n", r.ID, r.Nome, r.Valor)
  }
}`,
    }),

    licao({
      id: 'bancos-create-table-licao',
      titulo: 'CREATE TABLE - Definindo Estrutura',
      resumo: '<p>CREATE TABLE define a estrutura de dados. Em Go, usamos structs para modelar tabelas. Cada campo da struct corresponde a uma coluna.</p>',
      codigo: go`package main

import "fmt"

// Usuario simula CREATE TABLE usuarios (id INT, nome VARCHAR, email VARCHAR, ativo BOOL)
type Usuario struct {
  ID    int
  Nome  string
  Email string
  Ativo bool
}

func main() {
  // Criando instâncias (como INSERT após CREATE TABLE)
  u1 := Usuario{ID: 1, Nome: "Ana", Email: "ana@email.com", Ativo: true}
  u2 := Usuario{ID: 2, Nome: "Carlos", Email: "carlos@email.com", Ativo: false}

  usuarios := []Usuario{u1, u2}

  fmt.Println("Estrutura da tabela 'usuarios':")
  fmt.Println("- id: INT PRIMARY KEY")
  fmt.Println("- nome: VARCHAR(100)")
  fmt.Println("- email: VARCHAR(255)")
  fmt.Println("- ativo: BOOLEAN")
  fmt.Println()
  fmt.Println("Registros inseridos:")
  for _, u := range usuarios {
    fmt.Printf("%+v\\n", u)
  }
}`,
    }),

    licao({
      id: 'bancos-insert-licao',
      titulo: 'INSERT - Adicionando Registros',
      resumo: '<p>INSERT adiciona novas linhas à tabela. Em Go, simulamos com append() em slices. Cada append equivale a um INSERT INTO.</p>',
      codigo: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func InserirProduto(tabela []Produto, p Produto) []Produto {
  return append(tabela, p)
}

func main() {
  var produtos []Produto

  // Simulando INSERT INTO produtos VALUES (...)
  produtos = InserirProduto(produtos, Produto{ID: 1, Nome: "Laptop", Preco: 2500.00})
  produtos = InserirProduto(produtos, Produto{ID: 2, Nome: "Mouse", Preco: 45.90})
  produtos = InserirProduto(produtos, Produto{ID: 3, Nome: "Teclado", Preco: 120.00})

  fmt.Println("Produtos após INSERT:")
  for _, p := range produtos {
    fmt.Printf("ID=%d Nome=%s Preco=%.2f\\n", p.ID, p.Nome, p.Preco)
  }
  fmt.Printf("Total de registros: %d\\n", len(produtos))
}`,
    }),

    licao({
      id: 'bancos-select-licao',
      titulo: 'SELECT - Consultando Dados',
      resumo: '<p>SELECT recupera dados da tabela. Em Go, iteramos sobre slices com for-range para simular consultas. SELECT * equivale a percorrer todo o slice.</p>',
      codigo: go`package main

import "fmt"

type Cliente struct {
  ID     int
  Nome   string
  Cidade string
}

// SelecionarTodos simula SELECT * FROM clientes
func SelecionarTodos(clientes []Cliente) []Cliente {
  return clientes
}

// SelecionarPorCidade simula SELECT * FROM clientes WHERE cidade = ?
func SelecionarPorCidade(clientes []Cliente, cidade string) []Cliente {
  var resultado []Cliente
  for _, c := range clientes {
    if c.Cidade == cidade {
      resultado = append(resultado, c)
    }
  }
  return resultado
}

func main() {
  clientes := []Cliente{
    {ID: 1, Nome: "Maria", Cidade: "São Paulo"},
    {ID: 2, Nome: "João", Cidade: "Rio"},
    {ID: 3, Nome: "Pedro", Cidade: "São Paulo"},
  }

  fmt.Println("SELECT * FROM clientes:")
  for _, c := range SelecionarTodos(clientes) {
    fmt.Printf("%+v\\n", c)
  }

  fmt.Println("\\nSELECT * FROM clientes WHERE cidade='São Paulo':")
  for _, c := range SelecionarPorCidade(clientes, "São Paulo") {
    fmt.Printf("%+v\\n", c)
  }
}`,
    }),

    licao({
      id: 'bancos-where-licao',
      titulo: 'WHERE - Filtrando Resultados',
      resumo: '<p>WHERE filtra registros baseado em condições. Em Go, usamos if dentro de loops para aplicar filtros. Operadores: =, !=, >, <, >=, <=.</p>',
      codigo: go`package main

import "fmt"

type Funcionario struct {
  ID         int
  Nome       string
  Salario    float64
  Departamento string
}

// FiltrarPorSalarioMinimo simula WHERE salario >= valor
func FiltrarPorSalarioMinimo(funcs []Funcionario, min float64) []Funcionario {
  var resultado []Funcionario
  for _, f := range funcs {
    if f.Salario >= min {
      resultado = append(resultado, f)
    }
  }
  return resultado
}

func main() {
  funcs := []Funcionario{
    {ID: 1, Nome: "Ana", Salario: 3500, Departamento: "TI"},
    {ID: 2, Nome: "Bruno", Salario: 4200, Departamento: "Vendas"},
    {ID: 3, Nome: "Carla", Salario: 2800, Departamento: "TI"},
    {ID: 4, Nome: "Daniel", Salario: 5000, Departamento: "Gerência"},
  }

  fmt.Println("WHERE salario >= 3500:")
  for _, f := range FiltrarPorSalarioMinimo(funcs, 3500) {
    fmt.Printf("%s: R$%.2f\\n", f.Nome, f.Salario)
  }
}`,
    }),

    licao({
      id: 'bancos-update-licao',
      titulo: 'UPDATE - Modificando Registros',
      resumo: '<p>UPDATE altera valores existentes. Em Go, iteramos sobre o slice e modificamos campos específicos quando encontramos o registro desejado.</p>',
      codigo: go`package main

import "fmt"

type Item struct {
  ID       int
  Nome     string
  Estoque  int
}

// AtualizarEstoque simula UPDATE itens SET estoque = novoValor WHERE id = idBusca
func AtualizarEstoque(itens []Item, idBusca int, novoEstoque int) bool {
  for i, item := range itens {
    if item.ID == idBusca {
      itens[i].Estoque = novoEstoque
      return true
    }
  }
  return false
}

func main() {
  itens := []Item{
    {ID: 1, Nome: "Camisa", Estoque: 10},
    {ID: 2, Nome: "Calça", Estoque: 5},
    {ID: 3, Nome: "Sapato", Estoque: 8},
  }

  fmt.Println("Antes do UPDATE:")
  for _, i := range itens {
    fmt.Printf("ID=%d Estoque=%d\\n", i.ID, i.Estoque)
  }

  AtualizarEstoque(itens, 2, 20)

  fmt.Println("\\nApós UPDATE itens SET estoque=20 WHERE id=2:")
  for _, i := range itens {
    fmt.Printf("ID=%d Estoque=%d\\n", i.ID, i.Estoque)
  }
}`,
    }),

    licao({
      id: 'bancos-delete-licao',
      titulo: 'DELETE - Removendo Registros',
      resumo: '<p>DELETE remove linhas da tabela. Em Go, recriamos o slice sem o elemento desejado usando append combinado com índices.</p>',
      codigo: go`package main

import "fmt"

type Tarefa struct {
  ID          int
  Descricao   string
  Concluida   bool
}

// DeletarPorID simula DELETE FROM tarefas WHERE id = idBusca
func DeletarPorID(tarefas []Tarefa, idBusca int) []Tarefa {
  var resultado []Tarefa
  for _, t := range tarefas {
    if t.ID != idBusca {
      resultado = append(resultado, t)
    }
  }
  return resultado
}

func main() {
  tarefas := []Tarefa{
    {ID: 1, Descricao: "Comprar leite", Concluida: false},
    {ID: 2, Descricao: "Pagar conta", Concluida: true},
    {ID: 3, Descricao: "Ler livro", Concluida: false},
  }

  fmt.Println("Antes do DELETE:")
  for _, t := range tarefas {
    fmt.Printf("ID=%d %s\\n", t.ID, t.Descricao)
  }

  tarefas = DeletarPorID(tarefas, 2)

  fmt.Println("\\nApós DELETE WHERE id=2:")
  for _, t := range tarefas {
    fmt.Printf("ID=%d %s\\n", t.ID, t.Descricao)
  }
}`,
    }),

    licao({
      id: 'bancos-join-licao',
      titulo: 'JOIN - Combinando Tabelas',
      resumo: '<p>JOIN combina dados de múltiplas tabelas por uma chave comum. Em Go, simulamos buscando correspondências entre slices diferentes.</p>',
      codigo: go`package main

import "fmt"

type Pedido struct {
  ID        int
  ClienteID int
  Valor     float64
}

type Cliente struct {
  ID   int
  Nome string
}

// JoinPedidoCliente simula SELECT p.*, c.nome FROM pedidos p JOIN clientes c ON p.cliente_id = c.id
func JoinPedidoCliente(pedidos []Pedido, clientes []Cliente) {
  for _, p := range pedidos {
    for _, c := range clientes {
      if p.ClienteID == c.ID {
        fmt.Printf("Pedido #%d | Cliente: %s | Valor: R$%.2f\\n", p.ID, c.Nome, p.Valor)
        break
      }
    }
  }
}

func main() {
  clientes := []Cliente{
    {ID: 1, Nome: "Alice"},
    {ID: 2, Nome: "Bob"},
  }

  pedidos := []Pedido{
    {ID: 101, ClienteID: 1, Valor: 150.00},
    {ID: 102, ClienteID: 2, Valor: 89.90},
    {ID: 103, ClienteID: 1, Valor: 200.00},
  }

  fmt.Println("INNER JOIN pedidos-clientes:")
  JoinPedidoCliente(pedidos, clientes)
}`,
    }),

    licao({
      id: 'bancos-indices-licao',
      titulo: 'Índices - Otimizando Buscas',
      resumo: '<p>Índices aceleram buscas criando estruturas auxiliares. Em Go, podemos simular índices usando maps para acesso O(1) por chave.</p>',
      codigo: go`package main

import "fmt"

type Livro struct {
  ISBN   string
  Titulo string
  Autor  string
}

// CriarIndicePorISBN simula CREATE INDEX idx_isbn ON livros(isbn)
func CriarIndicePorISBN(livros []Livro) map[string]Livro {
  indice := make(map[string]Livro)
  for _, l := range livros {
    indice[l.ISBN] = l
  }
  return indice
}

func main() {
  livros := []Livro{
    {ISBN: "978-0-13-419044-0", Titulo: "The Go Programming Language", Autor: "Donovan"},
    {ISBN: "978-0-596-51774-8", Titulo: "The C Programming Language", Autor: "Kernighan"},
    {ISBN: "978-0-13-235088-4", Titulo: "Clean Code", Autor: "Martin"},
  }

  indice := CriarIndicePorISBN(livros)

  isbnBusca := "978-0-13-419044-0"
  if livro, ok := indice[isbnBusca]; ok {
    fmt.Printf("Encontrado: %s por %s\\n", livro.Titulo, livro.Autor)
  } else {
    fmt.Println("Não encontrado")
  }
}`,
    }),

    licao({
      id: 'bancos-transacoes-licao',
      titulo: 'Transações - ACID e Atomicidade',
      resumo: '<p>Transações garantem atomicidade: todas as operações succeeds ou nenhuma é aplicada. Em Go, simulamos rollback revertendo mudanças em caso de erro.</p>',
      codigo: go`package main

import "fmt"

type Conta struct {
  ID     int
  Titular string
  Saldo  float64
}

// TransferirSimulado simula uma transação com rollback
func TransferirSimulado(contas []Conta, origemID, destinoID int, valor float64) ([]Conta, bool) {
  // Backup para rollback
  backup := make([]Conta, len(contas))
  copy(backup, contas)

  var origemIdx, destinoIdx int = -1, -1
  for i, c := range contas {
    if c.ID == origemID {
      origemIdx = i
    }
    if c.ID == destinoID {
      destinoIdx = i
    }
  }

  if origemIdx == -1 || destinoIdx == -1 {
    return backup, false
  }

  if contas[origemIdx].Saldo < valor {
    fmt.Println("ERRO: Saldo insuficiente - ROLLBACK")
    return backup, false
  }

  // Executar transferência
  contas[origemIdx].Saldo -= valor
  contas[destinoIdx].Saldo += valor

  fmt.Println("COMMIT: Transferência realizada")
  return contas, true
}

func main() {
  contas := []Conta{
    {ID: 1, Titular: "Ana", Saldo: 1000.00},
    {ID: 2, Titular: "Bob", Saldo: 500.00},
  }

  fmt.Println("Antes:", contas[0].Saldo, contas[1].Saldo)
  contas, _ = TransferirSimulado(contas, 1, 2, 300.00)
  fmt.Println("Depois:", contas[0].Saldo, contas[1].Saldo)
}`,
    }),

    licao({
      id: 'bancos-nosql-licao',
      titulo: 'NoSQL - Documentos e Flexibilidade',
      resumo: '<p>NoSQL usa documentos flexíveis ao invés de tabelas rígidas. Em Go, simulamos com structs aninhadas e campos opcionais.</p>',
      codigo: go`package main

import "fmt"

// Documento simula um documento NoSQL com campos variáveis
type Documento struct {
  ID     string
  Tipo   string
  Campos map[string]string
}

func main() {
  // Documentos podem ter estruturas diferentes
  usuario := Documento{
    ID:   "doc1",
    Tipo: "usuario",
    Campos: map[string]string{
      "nome":  "Maria",
      "email": "maria@test.com",
    },
  }

  produto := Documento{
    ID:   "doc2",
    Tipo: "produto",
    Campos: map[string]string{
      "titulo": "Notebook",
      "preco":  "2500",
      "marca":  "Dell",
    },
  }

  docs := []Documento{usuario, produto}

  fmt.Println("Coleção NoSQL:")
  for _, d := range docs {
    fmt.Printf("[%s] ID=%s\\n", d.Tipo, d.ID)
    for k, v := range d.Campos {
      fmt.Printf("  %s: %s\\n", k, v)
    }
  }
}`,
    }),

    licao({
      id: 'bancos-cache-licao',
      titulo: 'Cache - Acelerando Leituras',
      resumo: '<p>Cache armazena resultados frequentes em memória para evitar consultas repetidas. Em Go, usamos maps como cache simples.</p>',
      codigo: go`package main

import "fmt"

type CacheSimples struct {
  dados map[string]string
  hits  int
  misses int
}

func NovoCache() *CacheSimples {
  return &CacheSimples{
    dados: make(map[string]string),
  }
}

func (c *CacheSimples) Get(chave string) (string, bool) {
  if val, ok := c.dados[chave]; ok {
    c.hits++
    return val, true
  }
  c.misses++
  return "", false
}

func (c *CacheSimples) Set(chave, valor string) {
  c.dados[chave] = valor
}

func main() {
  cache := NovoCache()

  // Simulando consulta cara
  cache.Set("user:1", "Nome: Ana, Email: ana@test.com")

  // Primeira busca (cache hit)
  if val, ok := cache.Get("user:1"); ok {
    fmt.Println("CACHE HIT:", val)
  }

  // Chave não existe (cache miss)
  if _, ok := cache.Get("user:999"); !ok {
    fmt.Println("CACHE MISS: user:999 não encontrado")
  }

  fmt.Printf("Stats - Hits: %d, Misses: %d\\n", cache.hits, cache.misses)
}`,
    }),

    licao({
      id: 'bancos-redis-licao',
      titulo: 'Redis - Cache Distribuído',
      resumo: '<p>Redis é um banco chave-valor em memória usado como cache distribuído. Suporta TTL (tempo de vida) e expiração automática.</p>',
      codigo: go`package main

import "fmt"

// RedisMock simula operações básicas do Redis
type RedisMock struct {
  store map[string]string
  ttl   map[string]int // TTL em "segundos" simulados
}

func NovoRedis() *RedisMock {
  return &RedisMock{
    store: make(map[string]string),
    ttl:   make(map[string]int),
  }
}

func (r *RedisMock) SET(key, value string) {
  r.store[key] = value
  fmt.Printf("SET %s = %s\\n", key, value)
}

func (r *RedisMock) GET(key string) string {
  if val, ok := r.store[key]; ok {
    return val
  }
  return "(nil)"
}

func (r *RedisMock) DEL(key string) {
  delete(r.store, key)
  fmt.Printf("DEL %s\\n", key)
}

func main() {
  redis := NovoRedis()

  redis.SET("session:abc123", "userID=42")
  fmt.Println("GET session:abc123:", redis.GET("session:abc123"))

  redis.DEL("session:abc123")
  fmt.Println("GET após DEL:", redis.GET("session:abc123"))
}`,
    }),

    licao({
      id: 'bancos-migrations-licao',
      titulo: 'Migrations - Evolução do Schema',
      resumo: '<p>Migrations versionam mudanças no schema do banco. Cada migration tem UP (aplicar) e DOWN (reverter). Em Go, simulamos com funções que alteram structs.</p>',
      codigo: go`package main

import "fmt"

type Migration struct {
  Versao    int
  Nome      string
  Aplicada  bool
}

type SchemaTracker struct {
  Migrations []Migration
  VersaoAtual int
}

func (s *SchemaTracker) Up(m Migration) {
  m.Aplicada = true
  s.Migrations = append(s.Migrations, m)
  s.VersaoAtual = m.Versao
  fmt.Printf("UP: v%d - %s\\n", m.Versao, m.Nome)
}

func (s *SchemaTracker) Down() {
  if len(s.Migrations) > 0 {
    ultima := s.Migrations[len(s.Migrations)-1]
    s.Migrations = s.Migrations[:len(s.Migrations)-1]
    if len(s.Migrations) > 0 {
      s.VersaoAtual = s.Migrations[len(s.Migrations)-1].Versao
    } else {
      s.VersaoAtual = 0
    }
    fmt.Printf("DOWN: revertendo v%d - %s\\n", ultima.Versao, ultima.Nome)
  }
}

func main() {
  tracker := &SchemaTracker{}

  tracker.Up(Migration{Versao: 1, Nome: "create_users_table"})
  tracker.Up(Migration{Versao: 2, Nome: "add_email_to_users"})
  tracker.Up(Migration{Versao: 3, Nome: "create_orders_table"})

  fmt.Printf("Versão atual: %d\\n", tracker.VersaoAtual)

  tracker.Down()
  fmt.Printf("Versão após rollback: %d\\n", tracker.VersaoAtual)
}`,
    }),

    licao({
      id: 'bancos-connection-pool-licao',
      titulo: 'Connection Pool - Gerenciando Conexões',
      resumo: '<p>Connection pool reutiliza conexões abertas ao invés de criar novas. Isso reduz overhead e melhora performance em aplicações concorrentes.</p>',
      codigo: go`package main

import "fmt"

type Connection struct {
  ID       int
  InUse    bool
}

type ConnectionPool struct {
  connections []Connection
  maxSize     int
}

func NewPool(size int) *ConnectionPool {
  pool := &ConnectionPool{maxSize: size}
  for i := 1; i <= size; i++ {
    pool.connections = append(pool.connections, Connection{ID: i, InUse: false})
  }
  return pool
}

func (p *ConnectionPool) Acquire() int {
  for i, conn := range p.connections {
    if !conn.InUse {
      p.connections[i].InUse = true
      fmt.Printf("Adquirida conexão #%d\\n", conn.ID)
      return conn.ID
    }
  }
  fmt.Println("Pool esgotado!")
  return -1
}

func (p *ConnectionPool) Release(id int) {
  for i, conn := range p.connections {
    if conn.ID == id {
      p.connections[i].InUse = false
      fmt.Printf("Liberada conexão #%d\\n", id)
      return
    }
  }
}

func main() {
  pool := NewPool(3)

  c1 := pool.Acquire()
  c2 := pool.Acquire()
  _ = pool.Acquire()
  _ = pool.Acquire() // Deve falhar

  pool.Release(c1)
  pool.Release(c2)
}`,
    }),

    // === PROBLEMAS (30) ===

    // CRUD Básico
    problema({
      id: 'bancos-crud-inserir-facil',
      titulo: 'Inserir Registro em Slice',
      dificuldade: 'facil',
      enunciado: '<p>Implemente a função <code>InserirUsuario</code> que recebe um slice de Usuarios e um novo Usuario, e retorna o slice com o novo registro adicionado.</p>',
      dica: 'Use append() para adicionar elementos a um slice.',
      inicial: go`package main

import "fmt"

type Usuario struct {
  ID   int
  Nome string
}

func InserirUsuario(usuarios []Usuario, novo Usuario) []Usuario {
  // Implemente aqui
  return usuarios
}

func main() {
  usuarios := []Usuario{{ID: 1, Nome: "Ana"}}
  usuarios = InserirUsuario(usuarios, Usuario{ID: 2, Nome: "Bob"})
  for _, u := range usuarios {
    fmt.Printf("%d:%s\\n", u.ID, u.Nome)
  }
}`,
      solucao: go`package main

import "fmt"

type Usuario struct {
  ID   int
  Nome string
}

func InserirUsuario(usuarios []Usuario, novo Usuario) []Usuario {
  return append(usuarios, novo)
}

func main() {
  usuarios := []Usuario{{ID: 1, Nome: "Ana"}}
  usuarios = InserirUsuario(usuarios, Usuario{ID: 2, Nome: "Bob"})
  for _, u := range usuarios {
    fmt.Printf("%d:%s\\n", u.ID, u.Nome)
  }
}`,
      testes: [{ entrada: '', saida: '1:Ana\n2:Bob' }],
    }),

    problema({
      id: 'bancos-crud-buscar-id-facil',
      titulo: 'Buscar Registro por ID',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>BuscarPorID</code> que recebe um slice de Produtos e um ID, retornando o produto encontrado ou um Produto vazio se não existir.</p>',
      dica: 'Itere sobre o slice e compare o campo ID. Retorne o primeiro match.',
      inicial: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func BuscarPorID(produtos []Produto, id int) Produto {
  // Implemente aqui
  return Produto{}
}

func main() {
  produtos := []Produto{
    {ID: 1, Nome: "Mouse", Preco: 25.0},
    {ID: 2, Nome: "Teclado", Preco: 75.0},
  }
  p := BuscarPorID(produtos, 2)
  fmt.Printf("%d:%s:%.0f\\n", p.ID, p.Nome, p.Preco)
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func BuscarPorID(produtos []Produto, id int) Produto {
  for _, p := range produtos {
    if p.ID == id {
      return p
    }
  }
  return Produto{}
}

func main() {
  produtos := []Produto{
    {ID: 1, Nome: "Mouse", Preco: 25.0},
    {ID: 2, Nome: "Teclado", Preco: 75.0},
  }
  p := BuscarPorID(produtos, 2)
  fmt.Printf("%d:%s:%.0f\\n", p.ID, p.Nome, p.Preco)
}`,
      testes: [{ entrada: '', saida: '2:Teclado:75' }],
    }),

    problema({
      id: 'bancos-crud-atualizar-facil',
      titulo: 'Atualizar Campo de Registro',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>AtualizarPreco</code> que recebe um slice de Produtos, um ID e um novo preço. Atualize o preço do produto com aquele ID e retorne true se encontrou, false caso contrário.</p>',
      dica: 'Use índice no for-loop para modificar o elemento diretamente no slice.',
      inicial: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func AtualizarPreco(produtos []Produto, id int, novoPreco float64) bool {
  // Implemente aqui
  return false
}

func main() {
  produtos := []Produto{
    {ID: 1, Nome: "Mouse", Preco: 25.0},
    {ID: 2, Nome: "Teclado", Preco: 75.0},
  }
  ok := AtualizarPreco(produtos, 1, 30.0)
  fmt.Printf("%v:%.0f\\n", ok, produtos[0].Preco)
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func AtualizarPreco(produtos []Produto, id int, novoPreco float64) bool {
  for i, p := range produtos {
    if p.ID == id {
      produtos[i].Preco = novoPreco
      return true
    }
  }
  return false
}

func main() {
  produtos := []Produto{
    {ID: 1, Nome: "Mouse", Preco: 25.0},
    {ID: 2, Nome: "Teclado", Preco: 75.0},
  }
  ok := AtualizarPreco(produtos, 1, 30.0)
  fmt.Printf("%v:%.0f\\n", ok, produtos[0].Preco)
}`,
      testes: [{ entrada: '', saida: 'true:30' }],
    }),

    problema({
      id: 'bancos-crud-deletar-facil',
      titulo: 'Deletar Registro por ID',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>DeletarPorID</code> que remove um registro do slice pelo ID. Retorne o novo slice sem o elemento removido.</p>',
      dica: 'Crie um novo slice e adicione apenas os elementos cujo ID é diferente do alvo.',
      inicial: go`package main

import "fmt"

type Registro struct {
  ID   int
  Dado string
}

func DeletarPorID(registros []Registro, id int) []Registro {
  // Implemente aqui
  return registros
}

func main() {
  regs := []Registro{{1, "a"}, {2, "b"}, {3, "c"}}
  regs = DeletarPorID(regs, 2)
  for _, r := range regs {
    fmt.Printf("%d:%s ", r.ID, r.Dado)
  }
  fmt.Println()
}`,
      solucao: go`package main

import "fmt"

type Registro struct {
  ID   int
  Dado string
}

func DeletarPorID(registros []Registro, id int) []Registro {
  var resultado []Registro
  for _, r := range registros {
    if r.ID != id {
      resultado = append(resultado, r)
    }
  }
  return resultado
}

func main() {
  regs := []Registro{{1, "a"}, {2, "b"}, {3, "c"}}
  regs = DeletarPorID(regs, 2)
  for _, r := range regs {
    fmt.Printf("%d:%s ", r.ID, r.Dado)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: '1:a 3:c' }],
    }),

    // Consultas e Filtros
    problema({
      id: 'bancos-consulta-filtrar-medio',
      titulo: 'Filtrar por Campo String',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>FiltrarPorDepartamento</code> que retorna todos os funcionários de um departamento específico.</p>',
      dica: 'Compare strings com == dentro de um loop for-range.',
      inicial: go`package main

import "fmt"

type Funcionario struct {
  ID           int
  Nome         string
  Departamento string
}

func FiltrarPorDepartamento(funcs []Funcionario, dept string) []Funcionario {
  // Implemente aqui
  return nil
}

func main() {
  funcs := []Funcionario{
    {1, "Ana", "TI"},
    {2, "Bob", "RH"},
    {3, "Carol", "TI"},
  }
  resultado := FiltrarPorDepartamento(funcs, "TI")
  for _, f := range resultado {
    fmt.Printf("%s ", f.Nome)
  }
  fmt.Println()
}`,
      solucao: go`package main

import "fmt"

type Funcionario struct {
  ID           int
  Nome         string
  Departamento string
}

func FiltrarPorDepartamento(funcs []Funcionario, dept string) []Funcionario {
  var resultado []Funcionario
  for _, f := range funcs {
    if f.Departamento == dept {
      resultado = append(resultado, f)
    }
  }
  return resultado
}

func main() {
  funcs := []Funcionario{
    {1, "Ana", "TI"},
    {2, "Bob", "RH"},
    {3, "Carol", "TI"},
  }
  resultado := FiltrarPorDepartamento(funcs, "TI")
  for _, f := range resultado {
    fmt.Printf("%s ", f.Nome)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: 'Ana Carol' }],
    }),

    problema({
      id: 'bancos-consulta-contar-facil',
      titulo: 'Contar Registros',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>ContarAtivos</code> que retorna quantos usuários têm Ativo=true.</p>',
      dica: 'Use len() para contar ou incremente um contador no loop.',
      inicial: go`package main

import "fmt"

type Usuario struct {
  ID    int
  Nome  string
  Ativo bool
}

func ContarAtivos(usuarios []Usuario) int {
  // Implemente aqui
  return 0
}

func main() {
  usuarios := []Usuario{
    {1, "Ana", true},
    {2, "Bob", false},
    {3, "Carol", true},
    {4, "Dan", true},
  }
  fmt.Println(ContarAtivos(usuarios))
}`,
      solucao: go`package main

import "fmt"

type Usuario struct {
  ID    int
  Nome  string
  Ativo bool
}

func ContarAtivos(usuarios []Usuario) int {
  count := 0
  for _, u := range usuarios {
    if u.Ativo {
      count++
    }
  }
  return count
}

func main() {
  usuarios := []Usuario{
    {1, "Ana", true},
    {2, "Bob", false},
    {3, "Carol", true},
    {4, "Dan", true},
  }
  fmt.Println(ContarAtivos(usuarios))
}`,
      testes: [{ entrada: '', saida: '3' }],
    }),

    problema({
      id: 'bancos-consulta-somar-medio',
      titulo: 'Somar Valores de Campo',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>SomarPrecos</code> que retorna a soma dos preços de todos os produtos no slice.</p>',
      dica: 'Inicialize uma variável float64 com 0 e acumule no loop.',
      inicial: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func SomarPrecos(produtos []Produto) float64 {
  // Implemente aqui
  return 0
}

func main() {
  produtos := []Produto{
    {1, "A", 10.5},
    {2, "B", 20.0},
    {3, "C", 5.5},
  }
  fmt.Printf("%.1f\\n", SomarPrecos(produtos))
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func SomarPrecos(produtos []Produto) float64 {
  total := 0.0
  for _, p := range produtos {
    total += p.Preco
  }
  return total
}

func main() {
  produtos := []Produto{
    {1, "A", 10.5},
    {2, "B", 20.0},
    {3, "C", 5.5},
  }
  fmt.Printf("%.1f\\n", SomarPrecos(produtos))
}`,
      testes: [{ entrada: '', saida: '36.0' }],
    }),

    problema({
      id: 'bancos-consulta-media-medio',
      titulo: 'Calcular Média de Valores',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>MediaNotas</code> que calcula a média das notas de um slice de Alunos. Se o slice estiver vazio, retorne 0.</p>',
      dica: 'Some todas as notas e divida por len(alunos). Verifique divisão por zero.',
      inicial: go`package main

import "fmt"

type Aluno struct {
  ID   int
  Nome string
  Nota float64
}

func MediaNotas(alunos []Aluno) float64 {
  // Implemente aqui
  return 0
}

func main() {
  alunos := []Aluno{
    {1, "Ana", 8.0},
    {2, "Bob", 6.0},
    {3, "Carol", 10.0},
  }
  fmt.Printf("%.1f\\n", MediaNotas(alunos))
}`,
      solucao: go`package main

import "fmt"

type Aluno struct {
  ID   int
  Nome string
  Nota float64
}

func MediaNotas(alunos []Aluno) float64 {
  if len(alunos) == 0 {
    return 0
  }
  soma := 0.0
  for _, a := range alunos {
    soma += a.Nota
  }
  return soma / float64(len(alunos))
}

func main() {
  alunos := []Aluno{
    {1, "Ana", 8.0},
    {2, "Bob", 6.0},
    {3, "Carol", 10.0},
  }
  fmt.Printf("%.1f\\n", MediaNotas(alunos))
}`,
      testes: [{ entrada: '', saida: '8.0' }],
    }),

    problema({
      id: 'bancos-consulta-ordenar-dificil',
      titulo: 'Ordenar Resultados por Campo',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>OrdenarPorPreco</code> que retorna uma cópia do slice ordenada por preço crescente (bubble sort simples).</p>',
      dica: 'Use bubble sort: compare pares adjacentes e troque se estiverem na ordem errada. Repita até não haver trocas.',
      inicial: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func OrdenarPorPreco(produtos []Produto) []Produto {
  // Implemente aqui (bubble sort)
  return produtos
}

func main() {
  produtos := []Produto{
    {1, "C", 30.0},
    {2, "A", 10.0},
    {3, "B", 20.0},
  }
  ordenados := OrdenarPorPreco(produtos)
  for _, p := range ordenados {
    fmt.Printf("%s:%.0f ", p.Nome, p.Preco)
  }
  fmt.Println()
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

func OrdenarPorPreco(produtos []Produto) []Produto {
  // Copiar slice
  resultado := make([]Produto, len(produtos))
  copy(resultado, produtos)

  // Bubble sort
  n := len(resultado)
  for i := 0; i < n-1; i++ {
    for j := 0; j < n-i-1; j++ {
      if resultado[j].Preco > resultado[j+1].Preco {
        temp := resultado[j]
        resultado[j] = resultado[j+1]
        resultado[j+1] = temp
      }
    }
  }
  return resultado
}

func main() {
  produtos := []Produto{
    {1, "C", 30.0},
    {2, "A", 10.0},
    {3, "B", 20.0},
  }
  ordenados := OrdenarPorPreco(produtos)
  for _, p := range ordenados {
    fmt.Printf("%s:%.0f ", p.Nome, p.Preco)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: 'A:10 B:20 C:30' }],
    }),

    // Cache
    problema({
      id: 'bancos-cache-implementar-medio',
      titulo: 'Implementar Cache Simples',
      dificuldade: 'medio',
      enunciado: '<p>Implemente um cache com métodos <code>Get</code> e <code>Set</code>. Get retorna o valor e true se existir, ou string vazia e false se não existir.</p>',
      dica: 'Use um map[string]string internamente. Get verifica existência com comma-ok idiom.',
      inicial: go`package main

import "fmt"

type Cache struct {
  dados map[string]string
}

func NovoCache() *Cache {
  return &Cache{dados: make(map[string]string)}
}

func (c *Cache) Set(chave, valor string) {
  // Implemente
}

func (c *Cache) Get(chave string) (string, bool) {
  // Implemente
  return "", false
}

func main() {
  cache := NovoCache()
  cache.Set("k1", "v1")
  val, ok := cache.Get("k1")
  fmt.Printf("%s:%v\\n", val, ok)
  _, ok2 := cache.Get("k2")
  fmt.Printf("%v\\n", ok2)
}`,
      solucao: go`package main

import "fmt"

type Cache struct {
  dados map[string]string
}

func NovoCache() *Cache {
  return &Cache{dados: make(map[string]string)}
}

func (c *Cache) Set(chave, valor string) {
  c.dados[chave] = valor
}

func (c *Cache) Get(chave string) (string, bool) {
  val, ok := c.dados[chave]
  return val, ok
}

func main() {
  cache := NovoCache()
  cache.Set("k1", "v1")
  val, ok := cache.Get("k1")
  fmt.Printf("%s:%v\\n", val, ok)
  _, ok2 := cache.Get("k2")
  fmt.Printf("%v\\n", ok2)
}`,
      testes: [{ entrada: '', saida: 'v1:true\nfalse' }],
    }),

    problema({
      id: 'bancos-cache-ttl-dificil',
      titulo: 'Cache com TTL Simulado',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente um cache onde cada entrada tem um TTL (tempo de vida). Use um contador global como "relógio". Get deve retornar miss se o TTL expirou.</p>',
      dica: 'Armazene junto com o valor o timestamp de expiração. No Get, compare com o tempo atual.',
      inicial: go`package main

import "fmt"

var tempoGlobal int = 0

type Entrada struct {
  Valor     string
  ExpiraEm  int
}

type CacheTTL struct {
  dados map[string]Entrada
}

func NovoCacheTTL() *CacheTTL {
  return &CacheTTL{dados: make(map[string]Entrada)}
}

func (c *CacheTTL) Set(chave, valor string, ttl int) {
  // Implemente: armazene com ExpiraEm = tempoGlobal + ttl
}

func (c *CacheTTL) Get(chave string) (string, bool) {
  // Implemente: verifique se tempoGlobal < ExpiraEm
  return "", false
}

func main() {
  cache := NovoCacheTTL()
  cache.Set("key", "value", 5) // expira em tempo 5

  tempoGlobal = 3
  val, ok := cache.Get("key")
  fmt.Printf("t=3: %s %v\\n", val, ok)

  tempoGlobal = 6
  _, ok2 := cache.Get("key")
  fmt.Printf("t=6: %v\\n", ok2)
}`,
      solucao: go`package main

import "fmt"

var tempoGlobal int = 0

type Entrada struct {
  Valor     string
  ExpiraEm  int
}

type CacheTTL struct {
  dados map[string]Entrada
}

func NovoCacheTTL() *CacheTTL {
  return &CacheTTL{dados: make(map[string]Entrada)}
}

func (c *CacheTTL) Set(chave, valor string, ttl int) {
  c.dados[chave] = Entrada{Valor: valor, ExpiraEm: tempoGlobal + ttl}
}

func (c *CacheTTL) Get(chave string) (string, bool) {
  entrada, ok := c.dados[chave]
  if !ok {
    return "", false
  }
  if tempoGlobal >= entrada.ExpiraEm {
    delete(c.dados, chave)
    return "", false
  }
  return entrada.Valor, true
}

func main() {
  cache := NovoCacheTTL()
  cache.Set("key", "value", 5)

  tempoGlobal = 3
  val, ok := cache.Get("key")
  fmt.Printf("t=3: %s %v\\n", val, ok)

  tempoGlobal = 6
  _, ok2 := cache.Get("key")
  fmt.Printf("t=6: %v\\n", ok2)
}`,
      testes: [{ entrada: '', saida: 't=3: value true\nt=6: false' }],
    }),

    problema({
      id: 'bancos-cache-invalidacao-medio',
      titulo: 'Invalidação de Cache',
      tamanho: 'medio',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>InvalidarPrefixo</code> que remove todas as entradas do cache cuja chave começa com um prefixo dado.</p>',
      dica: 'Itere sobre o map e use comparação de substring para verificar o prefixo.',
      inicial: go`package main

import "fmt"

type Cache struct {
  dados map[string]string
}

func NovoCache() *Cache {
  return &Cache{dados: make(map[string]string)}
}

func (c *Cache) Set(k, v string) { c.dados[k] = v }

func (c *Cache) Count() int { return len(c.dados) }

func (c *Cache) InvalidarPrefixo(prefixo string) {
  // Implemente: remova chaves que começam com prefixo
}

func main() {
  cache := NovoCache()
  cache.Set("user:1", "Ana")
  cache.Set("user:2", "Bob")
  cache.Set("prod:1", "Mouse")
  cache.Set("prod:2", "Teclado")

  cache.InvalidarPrefixo("user:")
  fmt.Println(cache.Count())
}`,
      solucao: go`package main

import "fmt"

type Cache struct {
  dados map[string]string
}

func NovoCache() *Cache {
  return &Cache{dados: make(map[string]string)}
}

func (c *Cache) Set(k, v string) { c.dados[k] = v }

func (c *Cache) Count() int { return len(c.dados) }

func (c *Cache) InvalidarPrefixo(prefixo string) {
  var chavesParaRemover []string
  for k := range c.dados {
    if len(k) >= len(prefixo) && k[:len(prefixo)] == prefixo {
      chavesParaRemover = append(chavesParaRemover, k)
    }
  }
  for _, k := range chavesParaRemover {
    delete(c.dados, k)
  }
}

func main() {
  cache := NovoCache()
  cache.Set("user:1", "Ana")
  cache.Set("user:2", "Bob")
  cache.Set("prod:1", "Mouse")
  cache.Set("prod:2", "Teclado")

  cache.InvalidarPrefixo("user:")
  fmt.Println(cache.Count())
}`,
      testes: [{ entrada: '', saida: '2' }],
    }),

    // Modelagem
    problema({
      id: 'bancos-model-usuario-validacao-medio',
      titulo: 'Validação de Struct Usuario',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>ValidarUsuario</code> que retorna true se Nome não está vazio e Email contém "@". Caso contrário, retorna false.</p>',
      dica: 'Verifique len(Nome) > 0 e busque "@" na string Email.',
      inicial: go`package main

import "fmt"

type Usuario struct {
  Nome  string
  Email string
}

func ValidarUsuario(u Usuario) bool {
  // Implemente aqui
  return false
}

func main() {
  u1 := Usuario{"Ana", "ana@test.com"}
  u2 := Usuario{"", "bob@test.com"}
  u3 := Usuario{"Carol", "invalido"}
  fmt.Printf("%v %v %v\\n", ValidarUsuario(u1), ValidarUsuario(u2), ValidarUsuario(u3))
}`,
      solucao: go`package main

import "fmt"

type Usuario struct {
  Nome  string
  Email string
}

func ValidarUsuario(u Usuario) bool {
  if len(u.Nome) == 0 {
    return false
  }
  temArroba := false
  for _, c := range u.Email {
    if c == '@' {
      temArroba = true
      break
    }
  }
  return temArroba
}

func main() {
  u1 := Usuario{"Ana", "ana@test.com"}
  u2 := Usuario{"", "bob@test.com"}
  u3 := Usuario{"Carol", "invalido"}
  fmt.Printf("%v %v %v\\n", ValidarUsuario(u1), ValidarUsuario(u2), ValidarUsuario(u3))
}`,
      testes: [{ entrada: '', saida: 'true false false' }],
    }),

    problema({
      id: 'bancos-model-produto-preco-facil',
      titulo: 'Struct Produto com Preço Formatado',
      dificuldade: 'facil',
      enunciado: '<p>Implemente o método <code>PrecoFormatado</code> no tipo Produto que retorna o preço como string formatada com 2 casas decimais.</p>',
      dica: 'Use fmt.Sprintf("%.2f", p.Preco) para formatar.',
      inicial: go`package main

import "fmt"

type Produto struct {
  Nome  string
  Preco float64
}

func (p Produto) PrecoFormatado() string {
  // Implemente aqui
  return ""
}

func main() {
  p := Produto{"Mouse", 29.9}
  fmt.Println(p.PrecoFormatado())
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  Nome  string
  Preco float64
}

func (p Produto) PrecoFormatado() string {
  return fmt.Sprintf("%.2f", p.Preco)
}

func main() {
  p := Produto{"Mouse", 29.9}
  fmt.Println(p.PrecoFormatado())
}`,
      testes: [{ entrada: '', saida: '29.90' }],
    }),

    problema({
      id: 'bancos-model-pedido-itens-dificil',
      titulo: 'Pedido com Múltiplos Itens',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>TotalPedido</code> que calcula o valor total de um pedido somando preço * quantidade de cada item.</p>',
      dica: 'Itere sobre os itens do pedido e acumule Preco * Quantidade.',
      inicial: go`package main

import "fmt"

type ItemPedido struct {
  Nome       string
  PrecoUnit  float64
  Quantidade int
}

type Pedido struct {
  ID    int
  Itens []ItemPedido
}

func TotalPedido(p Pedido) float64 {
  // Implemente aqui
  return 0
}

func main() {
  p := Pedido{
    ID: 1,
    Itens: []ItemPedido{
      {"Mouse", 25.0, 2},
      {"Teclado", 75.0, 1},
      {"Cabo", 5.0, 3},
    },
  }
  fmt.Printf("%.2f\\n", TotalPedido(p))
}`,
      solucao: go`package main

import "fmt"

type ItemPedido struct {
  Nome       string
  PrecoUnit  float64
  Quantidade int
}

type Pedido struct {
  ID    int
  Itens []ItemPedido
}

func TotalPedido(p Pedido) float64 {
  total := 0.0
  for _, item := range p.Itens {
    total += item.PrecoUnit * float64(item.Quantidade)
  }
  return total
}

func main() {
  p := Pedido{
    ID: 1,
    Itens: []ItemPedido{
      {"Mouse", 25.0, 2},
      {"Teclado", 75.0, 1},
      {"Cabo", 5.0, 3},
    },
  }
  fmt.Printf("%.2f\\n", TotalPedido(p))
}`,
      testes: [{ entrada: '', saida: '140.00' }],
    }),

    // Transações Simuladas
    problema({
      id: 'bancos-transacao-transferencia-dificil',
      titulo: 'Transferência com Validação',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>Transferir</code> que transfere valor de uma conta para outra. Retorne false se saldo insuficiente ou conta não encontrada. Modifique o slice in-place.</p>',
      dica: 'Primeiro encontre ambos os índices. Valide saldo. Depois modifique os saldos.',
      inicial: go`package main

import "fmt"

type Conta struct {
  ID    int
  Saldo float64
}

func Transferir(contas []Conta, origemID, destinoID int, valor float64) bool {
  // Implemente aqui
  return false
}

func main() {
  contas := []Conta{{1, 1000}, {2, 500}}
  ok := Transferir(contas, 1, 2, 300)
  fmt.Printf("%v:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo)
}`,
      solucao: go`package main

import "fmt"

type Conta struct {
  ID    int
  Saldo float64
}

func Transferir(contas []Conta, origemID, destinoID int, valor float64) bool {
  origemIdx := -1
  destinoIdx := -1
  for i, c := range contas {
    if c.ID == origemID {
      origemIdx = i
    }
    if c.ID == destinoID {
      destinoIdx = i
    }
  }
  if origemIdx == -1 || destinoIdx == -1 {
    return false
  }
  if contas[origemIdx].Saldo < valor {
    return false
  }
  contas[origemIdx].Saldo -= valor
  contas[destinoIdx].Saldo += valor
  return true
}

func main() {
  contas := []Conta{{1, 1000}, {2, 500}}
  ok := Transferir(contas, 1, 2, 300)
  fmt.Printf("%v:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo)
}`,
      testes: [{ entrada: '', saida: 'true:700:800' }],
    }),

    problema({
      id: 'bancos-transacao-rollback-dificil',
      titulo: 'Rollback em Caso de Erro',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>TransferirComRollback</code> que tenta transferir mas reverte se qualquer validação falhar. Use backup do slice original.</p>',
      dica: 'Faça copy() do slice antes de modificar. Se falhar, restaure do backup.',
      inicial: go`package main

import "fmt"

type Conta struct {
  ID    int
  Saldo float64
}

func TransferirComRollback(contas []Conta, origID, destID int, valor float64) ([]Conta, bool) {
  // Implemente com backup e rollback
  return contas, false
}

func main() {
  contas := []Conta{{1, 100}, {2, 500}}
  // Tentar transferir 200 (saldo insuficiente)
  contas, ok := TransferirComRollback(contas, 1, 2, 200)
  fmt.Printf("%v:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo)

  // Agora uma transferência que cabe no saldo
  contas, ok = TransferirComRollback(contas, 1, 2, 50)
  fmt.Printf("%v:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo)
}`,
      solucao: go`package main

import "fmt"

type Conta struct {
  ID    int
  Saldo float64
}

func TransferirComRollback(contas []Conta, origID, destID int, valor float64) ([]Conta, bool) {
  // Backup
  backup := make([]Conta, len(contas))
  copy(backup, contas)

  origIdx := -1
  destIdx := -1
  for i, c := range contas {
    if c.ID == origID {
      origIdx = i
    }
    if c.ID == destID {
      destIdx = i
    }
  }

  if origIdx == -1 || destIdx == -1 || contas[origIdx].Saldo < valor {
    return backup, false // Rollback
  }

  contas[origIdx].Saldo -= valor
  contas[destIdx].Saldo += valor
  return contas, true
}

func main() {
  contas := []Conta{{1, 100}, {2, 500}}
  contas, ok := TransferirComRollback(contas, 1, 2, 200)
  fmt.Printf("%v:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo)

  // Agora uma transferência que cabe no saldo
  contas, ok = TransferirComRollback(contas, 1, 2, 50)
  fmt.Printf("%v:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo)
}`,
      testes: [{ entrada: '', saida: 'false:100:500\ntrue:50:550' }],
    }),

    // Agregações
    problema({
      id: 'bancos-agreg-groupby-dificil',
      titulo: 'Group By Simulado',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>AgruparPorCategoria</code> que retorna um map onde a chave é a categoria e o valor é a contagem de produtos naquela categoria.</p>',
      dica: 'Itere sobre produtos e incremente o contador no map para cada categoria.',
      inicial: go`package main

import "fmt"

type Produto struct {
  Nome     string
  Categoria string
}

func AgruparPorCategoria(produtos []Produto) map[string]int {
  // Implemente aqui
  return nil
}

func main() {
  produtos := []Produto{
    {"Mouse", "Eletrônico"},
    {"Teclado", "Eletrônico"},
    {"Cadeira", "Móvel"},
    {"Mesa", "Móvel"},
    {"Monitor", "Eletrônico"},
  }
  grupos := AgruparPorCategoria(produtos)
  fmt.Printf("Eletrônico:%d Móvel:%d\\n", grupos["Eletrônico"], grupos["Móvel"])
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  Nome     string
  Categoria string
}

func AgruparPorCategoria(produtos []Produto) map[string]int {
  grupos := make(map[string]int)
  for _, p := range produtos {
    grupos[p.Categoria]++
  }
  return grupos
}

func main() {
  produtos := []Produto{
    {"Mouse", "Eletrônico"},
    {"Teclado", "Eletrônico"},
    {"Cadeira", "Móvel"},
    {"Mesa", "Móvel"},
    {"Monitor", "Eletrônico"},
  }
  grupos := AgruparPorCategoria(produtos)
  fmt.Printf("Eletrônico:%d Móvel:%d\\n", grupos["Eletrônico"], grupos["Móvel"])
}`,
      testes: [{ entrada: '', saida: 'Eletrônico:3 Móvel:2' }],
    }),

    problema({
      id: 'bancos-agreg-having-dificil',
      titulo: 'Having - Filtrar Grupos',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>CategoriasComMinimo</code> que retorna apenas categorias que têm pelo menos N produtos.</p>',
      dica: 'Primeiro agrupe, depois filtre o map mantendo apenas entradas com count >= minimo.',
      inicial: go`package main

import "fmt"

type Produto struct {
  Nome     string
  Categoria string
}

func CategoriasComMinimo(produtos []Produto, minimo int) []string {
  // Implemente aqui
  return nil
}

func main() {
  produtos := []Produto{
    {"A", "X"}, {"B", "X"}, {"C", "X"},
    {"D", "Y"}, {"E", "Y"},
    {"F", "Z"},
  }
  cats := CategoriasComMinimo(produtos, 2)
  for _, c := range cats {
    fmt.Printf("%s ", c)
  }
  fmt.Println()
}`,
      solucao: go`package main

import (
  "fmt"
  "sort"
)

type Produto struct {
  Nome     string
  Categoria string
}

func CategoriasComMinimo(produtos []Produto, minimo int) []string {
  grupos := make(map[string]int)
  for _, p := range produtos {
    grupos[p.Categoria]++
  }
  var resultado []string
  for cat, count := range grupos {
    if count >= minimo {
      resultado = append(resultado, cat)
    }
  }
  sort.Strings(resultado)
  return resultado
}

func main() {
  produtos := []Produto{
    {"A", "X"}, {"B", "X"}, {"C", "X"},
    {"D", "Y"}, {"E", "Y"},
    {"F", "Z"},
  }
  cats := CategoriasComMinimo(produtos, 2)
  for _, c := range cats {
    fmt.Printf("%s ", c)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: 'X Y' }],
    }),

    problema({
      id: 'bancos-agreg-distinct-medio',
      titulo: 'Distinct - Valores Únicos',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>ValoresDistintos</code> que retorna um slice com valores únicos de um campo, sem duplicatas.</p>',
      dica: 'Use um map como set para rastrear valores já vistos.',
      inicial: go`package main

import "fmt"

type Registro struct {
  Categoria string
}

func ValoresDistintos(regs []Registro) []string {
  // Implemente aqui
  return nil
}

func main() {
  regs := []Registro{{"A"}, {"B"}, {"A"}, {"C"}, {"B"}}
  distintos := ValoresDistintos(regs)
  for _, d := range distintos {
    fmt.Printf("%s ", d)
  }
  fmt.Println()
}`,
      solucao: go`package main

import "fmt"

type Registro struct {
  Categoria string
}

func ValoresDistintos(regs []Registro) []string {
  vistos := make(map[string]bool)
  var resultado []string
  for _, r := range regs {
    if !vistos[r.Categoria] {
      vistos[r.Categoria] = true
      resultado = append(resultado, r.Categoria)
    }
  }
  return resultado
}

func main() {
  regs := []Registro{{"A"}, {"B"}, {"A"}, {"C"}, {"B"}}
  distintos := ValoresDistintos(regs)
  for _, d := range distintos {
    fmt.Printf("%s ", d)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: 'A B C' }],
    }),

    // Mais problemas variados
    problema({
      id: 'bancos-crud-batch-insert-medio',
      titulo: 'Batch Insert - Inserção em Lote',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>InserirLote</code> que adiciona múltiplos registros de uma vez. Retorne o número de registros inseridos.</p>',
      dica: 'Use append com ... para expandir o slice de novos registros.',
      inicial: go`package main

import "fmt"

type Item struct {
  ID   int
  Nome string
}

func InserirLote(tabela []Item, novos []Item) ([]Item, int) {
  // Implemente aqui
  return tabela, 0
}

func main() {
  tabela := []Item{{1, "A"}}
  novos := []Item{{2, "B"}, {3, "C"}, {4, "D"}}
  tabela, count := InserirLote(tabela, novos)
  fmt.Printf("%d:%d\\n", count, len(tabela))
}`,
      solucao: go`package main

import "fmt"

type Item struct {
  ID   int
  Nome string
}

func InserirLote(tabela []Item, novos []Item) ([]Item, int) {
  tabela = append(tabela, novos...)
  return tabela, len(novos)
}

func main() {
  tabela := []Item{{1, "A"}}
  novos := []Item{{2, "B"}, {3, "C"}, {4, "D"}}
  tabela, count := InserirLote(tabela, novos)
  fmt.Printf("%d:%d\\n", count, len(tabela))
}`,
      testes: [{ entrada: '', saida: '3:4' }],
    }),

    problema({
      id: 'bancos-consulta-max-min-medio',
      titulo: 'Buscar Maior e Menor Valor',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>MaiorEMenor</code> que retorna o maior e menor preço de um slice de produtos.</p>',
      dica: 'Inicialize max com o menor valor possível e min com o maior. Compare no loop.',
      inicial: go`package main

import "fmt"

type Produto struct {
  Preco float64
}

func MaiorEMenor(produtos []Produto) (float64, float64) {
  // Implemente aqui
  return 0, 0
}

func main() {
  produtos := []Produto{{10}, {50}, {25}, {5}, {40}}
  max, min := MaiorEMenor(produtos)
  fmt.Printf("%.0f:%.0f\\n", max, min)
}`,
      solucao: go`package main

import "fmt"

type Produto struct {
  Preco float64
}

func MaiorEMenor(produtos []Produto) (float64, float64) {
  if len(produtos) == 0 {
    return 0, 0
  }
  max := produtos[0].Preco
  min := produtos[0].Preco
  for _, p := range produtos {
    if p.Preco > max {
      max = p.Preco
    }
    if p.Preco < min {
      min = p.Preco
    }
  }
  return max, min
}

func main() {
  produtos := []Produto{{10}, {50}, {25}, {5}, {40}}
  max, min := MaiorEMenor(produtos)
  fmt.Printf("%.0f:%.0f\\n", max, min)
}`,
      testes: [{ entrada: '', saida: '50:5' }],
    }),

    problema({
      id: 'bancos-join-left-dificil',
      titulo: 'LEFT JOIN Simulado',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>LeftJoin</code> que retorna todos os pedidos com nome do cliente. Se cliente não existir, use "Desconhecido".</p>',
      dica: 'Para cada pedido, busque o cliente. Se não encontrar, use valor default.',
      inicial: go`package main

import "fmt"

type Pedido struct {
  ID        int
  ClienteID int
}

type Cliente struct {
  ID   int
  Nome string
}

type ResultadoJoin struct {
  PedidoID    int
  ClienteNome string
}

func LeftJoin(pedidos []Pedido, clientes []Cliente) []ResultadoJoin {
  // Implemente aqui
  return nil
}

func main() {
  pedidos := []Pedido{{1, 10}, {2, 20}, {3, 99}}
  clientes := []Cliente{{10, "Ana"}, {20, "Bob"}}
  resultados := LeftJoin(pedidos, clientes)
  for _, r := range resultados {
    fmt.Printf("%d:%s ", r.PedidoID, r.ClienteNome)
  }
  fmt.Println()
}`,
      solucao: go`package main

import "fmt"

type Pedido struct {
  ID        int
  ClienteID int
}

type Cliente struct {
  ID   int
  Nome string
}

type ResultadoJoin struct {
  PedidoID    int
  ClienteNome string
}

func LeftJoin(pedidos []Pedido, clientes []Cliente) []ResultadoJoin {
  var resultados []ResultadoJoin
  for _, p := range pedidos {
    nome := "Desconhecido"
    for _, c := range clientes {
      if c.ID == p.ClienteID {
        nome = c.Nome
        break
      }
    }
    resultados = append(resultados, ResultadoJoin{PedidoID: p.ID, ClienteNome: nome})
  }
  return resultados
}

func main() {
  pedidos := []Pedido{{1, 10}, {2, 20}, {3, 99}}
  clientes := []Cliente{{10, "Ana"}, {20, "Bob"}}
  resultados := LeftJoin(pedidos, clientes)
  for _, r := range resultados {
    fmt.Printf("%d:%s ", r.PedidoID, r.ClienteNome)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: '1:Ana 2:Bob 3:Desconhecido' }],
    }),

    problema({
      id: 'bancos-indice-busca-rapida-medio',
      titulo: 'Índice para Busca Rápida',
      dificuldade: 'medio',
      enunciado: '<p>Crie um índice (map) por email e implemente <code>BuscarPorEmail</code> que usa o índice para busca O(1).</p>',
      dica: 'Construa o map uma vez, depois use lookup direto.',
      inicial: go`package main

import "fmt"

type Usuario struct {
  ID    int
  Email string
}

func ConstruirIndiceEmail(usuarios []Usuario) map[string]int {
  // Implemente: map[email] -> ID
  return nil
}

func main() {
  usuarios := []Usuario{{1, "a@x.com"}, {2, "b@x.com"}, {3, "c@x.com"}}
  indice := ConstruirIndiceEmail(usuarios)
  fmt.Printf("%d %d\\n", indice["b@x.com"], indice["z@x.com"])
}`,
      solucao: go`package main

import "fmt"

type Usuario struct {
  ID    int
  Email string
}

func ConstruirIndiceEmail(usuarios []Usuario) map[string]int {
  indice := make(map[string]int)
  for _, u := range usuarios {
    indice[u.Email] = u.ID
  }
  return indice
}

func main() {
  usuarios := []Usuario{{1, "a@x.com"}, {2, "b@x.com"}, {3, "c@x.com"}}
  indice := ConstruirIndiceEmail(usuarios)
  fmt.Printf("%d %d\\n", indice["b@x.com"], indice["z@x.com"])
}`,
      testes: [{ entrada: '', saida: '2 0' }],
    }),

    problema({
      id: 'bancos-cache-hit-rate-medio',
      titulo: 'Taxa de Hit do Cache',
      dificuldade: 'medio',
      enunciado: '<p>Implemente um cache que rastreia hits e misses. O método <code>TaxaHit</code> retorna a porcentagem de acertos (0-100).</p>',
      dica: 'Taxa = hits / (hits + misses) * 100. Cuidado com divisão por zero.',
      inicial: go`package main

import "fmt"

type Cache struct {
  dados  map[string]string
  hits   int
  misses int
}

func NovoCache() *Cache {
  return &Cache{dados: make(map[string]string)}
}

func (c *Cache) Set(k, v string) { c.dados[k] = v }

func (c *Cache) Get(k string) (string, bool) {
  // Implemente contando hits/misses
  return "", false
}

func (c *Cache) TaxaHit() float64 {
  // Implemente
  return 0
}

func main() {
  cache := NovoCache()
  cache.Set("a", "1")
  cache.Get("a") // hit
  cache.Get("a") // hit
  cache.Get("b") // miss
  fmt.Printf("%.0f\\n", cache.TaxaHit())
}`,
      solucao: go`package main

import "fmt"

type Cache struct {
  dados  map[string]string
  hits   int
  misses int
}

func NovoCache() *Cache {
  return &Cache{dados: make(map[string]string)}
}

func (c *Cache) Set(k, v string) { c.dados[k] = v }

func (c *Cache) Get(k string) (string, bool) {
  if v, ok := c.dados[k]; ok {
    c.hits++
    return v, true
  }
  c.misses++
  return "", false
}

func (c *Cache) TaxaHit() float64 {
  total := c.hits + c.misses
  if total == 0 {
    return 0
  }
  return float64(c.hits) / float64(total) * 100
}

func main() {
  cache := NovoCache()
  cache.Set("a", "1")
  cache.Get("a")
  cache.Get("a")
  cache.Get("b")
  fmt.Printf("%.0f\\n", cache.TaxaHit())
}`,
      testes: [{ entrada: '', saida: '67' }],
    }),

    problema({
      id: 'bancos-migration-aplicar-facil',
      titulo: 'Aplicar Migration',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>AplicarMigration</code> que adiciona uma migration ao tracker e incrementa a versão.</p>',
      dica: 'Append na lista de migrations e atualize versaoAtual.',
      inicial: go`package main

import "fmt"

type Tracker struct {
  VersaoAtual int
  Migrations  []string
}

func (t *Tracker) AplicarMigration(nome string) {
  // Implemente aqui
}

func main() {
  t := &Tracker{}
  t.AplicarMigration("create_users")
  t.AplicarMigration("add_email")
  fmt.Printf("%d:%d\\n", t.VersaoAtual, len(t.Migrations))
}`,
      solucao: go`package main

import "fmt"

type Tracker struct {
  VersaoAtual int
  Migrations  []string
}

func (t *Tracker) AplicarMigration(nome string) {
  t.Migrations = append(t.Migrations, nome)
  t.VersaoAtual++
}

func main() {
  t := &Tracker{}
  t.AplicarMigration("create_users")
  t.AplicarMigration("add_email")
  fmt.Printf("%d:%d\\n", t.VersaoAtual, len(t.Migrations))
}`,
      testes: [{ entrada: '', saida: '2:2' }],
    }),

    problema({
      id: 'bancos-pool-adquirir-liberar-medio',
      titulo: 'Connection Pool Básico',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>Adquirir</code> e <code>Liberar</code> em um pool de conexões. Adquirir marca como em uso e retorna o ID. Liberar marca como disponível.</p>',
      dica: 'Busque conexão com InUse=false para adquirir. Para liberar, encontre pelo ID e marque InUse=false.',
      inicial: go`package main

import "fmt"

type Conn struct {
  ID    int
  InUse bool
}

type Pool struct {
  Conns []Conn
}

func NovoPool(size int) *Pool {
  p := &Pool{}
  for i := 1; i <= size; i++ {
    p.Conns = append(p.Conns, Conn{ID: i, InUse: false})
  }
  return p
}

func (p *Pool) Adquirir() int {
  // Implemente: retorne ID da primeira conexão livre, ou -1
  return -1
}

func (p *Pool) Liberar(id int) {
  // Implemente: marque conexão como não em uso
}

func main() {
  pool := NovoPool(2)
  c1 := pool.Adquirir()
  c2 := pool.Adquirir()
  c3 := pool.Adquirir() // deve retornar -1
  fmt.Printf("%d:%d:%d\\n", c1, c2, c3)
  pool.Liberar(c1)
  c4 := pool.Adquirir()
  fmt.Printf("%d\\n", c4)
}`,
      solucao: go`package main

import "fmt"

type Conn struct {
  ID    int
  InUse bool
}

type Pool struct {
  Conns []Conn
}

func NovoPool(size int) *Pool {
  p := &Pool{}
  for i := 1; i <= size; i++ {
    p.Conns = append(p.Conns, Conn{ID: i, InUse: false})
  }
  return p
}

func (p *Pool) Adquirir() int {
  for i, c := range p.Conns {
    if !c.InUse {
      p.Conns[i].InUse = true
      return c.ID
    }
  }
  return -1
}

func (p *Pool) Liberar(id int) {
  for i, c := range p.Conns {
    if c.ID == id {
      p.Conns[i].InUse = false
      return
    }
  }
}

func main() {
  pool := NovoPool(2)
  c1 := pool.Adquirir()
  c2 := pool.Adquirir()
  c3 := pool.Adquirir()
  fmt.Printf("%d:%d:%d\\n", c1, c2, c3)
  pool.Liberar(c1)
  c4 := pool.Adquirir()
  fmt.Printf("%d\\n", c4)
}`,
      testes: [{ entrada: '', saida: '1:2:-1\n1' }],
    }),

    problema({
      id: 'bancos-consulta-top-n-medio',
      titulo: 'Top N Resultados',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>TopN</code> que retorna os N primeiros registros de um slice (ou todos se slice tiver menos que N).</p>',
      dica: 'Use slicing: slice[:n] mas verifique limites antes.',
      inicial: go`package main

import "fmt"

type Item struct {
  Nome string
}

func TopN(itens []Item, n int) []Item {
  // Implemente aqui
  return nil
}

func main() {
  itens := []Item{{"A"}, {"B"}, {"C"}, {"D"}, {"E"}}
  top := TopN(itens, 3)
  for _, i := range top {
    fmt.Printf("%s ", i.Nome)
  }
  fmt.Println()
}`,
      solucao: go`package main

import "fmt"

type Item struct {
  Nome string
}

func TopN(itens []Item, n int) []Item {
  if n >= len(itens) {
    return itens
  }
  return itens[:n]
}

func main() {
  itens := []Item{{"A"}, {"B"}, {"C"}, {"D"}, {"E"}}
  top := TopN(itens, 3)
  for _, i := range top {
    fmt.Printf("%s ", i.Nome)
  }
  fmt.Println()
}`,
      testes: [{ entrada: '', saida: 'A B C' }],
    }),

    problema({
      id: 'bancos-nosql-documento-flexivel-medio',
      titulo: 'Documento NoSQL Flexível',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>GetCampo</code> que busca um campo em um documento NoSQL. Retorne o valor e true se existir, ou "" e false se não.</p>',
      dica: 'Use map lookup com comma-ok idiom.',
      inicial: go`package main

import "fmt"

type Documento struct {
  ID     string
  Campos map[string]string
}

func GetCampo(doc Documento, campo string) (string, bool) {
  // Implemente aqui
  return "", false
}

func main() {
  doc := Documento{
    ID: "1",
    Campos: map[string]string{"nome": "Ana", "cidade": "SP"},
  }
  v1, ok1 := GetCampo(doc, "nome")
  v2, ok2 := GetCampo(doc, "idade")
  fmt.Printf("%s:%v %s:%v\\n", v1, ok1, v2, ok2)
}`,
      solucao: go`package main

import "fmt"

type Documento struct {
  ID     string
  Campos map[string]string
}

func GetCampo(doc Documento, campo string) (string, bool) {
  val, ok := doc.Campos[campo]
  return val, ok
}

func main() {
  doc := Documento{
    ID: "1",
    Campos: map[string]string{"nome": "Ana", "cidade": "SP"},
  }
  v1, ok1 := GetCampo(doc, "nome")
  v2, ok2 := GetCampo(doc, "idade")
  fmt.Printf("%s:%v %s:%v\\n", v1, ok1, v2, ok2)
}`,
      testes: [{ entrada: '', saida: 'Ana:true :false' }],
    }),

    problema({
      id: 'bancos-crud-upsert-dificil',
      titulo: 'Upsert - Insert ou Update',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>Upsert</code> que insere um registro se não existir (por ID) ou atualiza se já existir. Retorne true se foi update, false se foi insert.</p>',
      dica: 'Busque pelo ID primeiro. Se encontrar, atualize. Se não, faça append.',
      inicial: go`package main

import "fmt"

type Registro struct {
  ID    int
  Valor string
}

func Upsert(regs []Registro, r Registro) ([]Registro, bool) {
  // Implemente aqui
  return regs, false
}

func main() {
  regs := []Registro{{1, "a"}, {2, "b"}}
  regs, wasUpdate := Upsert(regs, Registro{2, "B_ATUALIZADO"})
  fmt.Printf("%v:%d:%s\\n", wasUpdate, len(regs), regs[1].Valor)
  regs, wasUpdate2 := Upsert(regs, Registro{3, "c"})
  fmt.Printf("%v:%d\\n", wasUpdate2, len(regs))
}`,
      solucao: go`package main

import "fmt"

type Registro struct {
  ID    int
  Valor string
}

func Upsert(regs []Registro, r Registro) ([]Registro, bool) {
  for i, reg := range regs {
    if reg.ID == r.ID {
      regs[i].Valor = r.Valor
      return regs, true
    }
  }
  return append(regs, r), false
}

func main() {
  regs := []Registro{{1, "a"}, {2, "b"}}
  regs, wasUpdate := Upsert(regs, Registro{2, "B_ATUALIZADO"})
  fmt.Printf("%v:%d:%s\\n", wasUpdate, len(regs), regs[1].Valor)
  regs, wasUpdate2 := Upsert(regs, Registro{3, "c"})
  fmt.Printf("%v:%d\\n", wasUpdate2, len(regs))
}`,
      testes: [{ entrada: '', saida: 'true:2:B_ATUALIZADO\nfalse:3' }],
    }),

    problema({
      id: 'bancos-agreg-soma-por-grupo-dificil',
      titulo: 'Soma Agrupada por Categoria',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>SomaPorCategoria</code> que retorna um map com a soma dos preços agrupados por categoria.</p>',
      dica: 'Similar ao group by count, mas acumulando valores ao invés de incrementar.',
      inicial: go`package main

import "fmt"

type Venda struct {
  Categoria string
  Valor     float64
}

func SomaPorCategoria(vendas []Venda) map[string]float64 {
  // Implemente aqui
  return nil
}

func main() {
  vendas := []Venda{
    {"TI", 100}, {"TI", 200}, {"RH", 50}, {"RH", 75}, {"Vendas", 300},
  }
  somas := SomaPorCategoria(vendas)
  fmt.Printf("TI:%.0f RH:%.0f Vendas:%.0f\\n", somas["TI"], somas["RH"], somas["Vendas"])
}`,
      solucao: go`package main

import "fmt"

type Venda struct {
  Categoria string
  Valor     float64
}

func SomaPorCategoria(vendas []Venda) map[string]float64 {
  somas := make(map[string]float64)
  for _, v := range vendas {
    somas[v.Categoria] += v.Valor
  }
  return somas
}

func main() {
  vendas := []Venda{
    {"TI", 100}, {"TI", 200}, {"RH", 50}, {"RH", 75}, {"Vendas", 300},
  }
  somas := SomaPorCategoria(vendas)
  fmt.Printf("TI:%.0f RH:%.0f Vendas:%.0f\\n", somas["TI"], somas["RH"], somas["Vendas"])
}`,
      testes: [{ entrada: '', saida: 'TI:300 RH:125 Vendas:300' }],
    }),

    problema({
      id: 'bancos-cache-lru-simples-dificil',
      titulo: 'Cache com Limite de Tamanho',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente um cache com tamanho máximo. Quando cheio, remova a entrada mais antiga (FIFO simplificado) antes de inserir nova.</p>',
      dica: 'Mantenha um slice de chaves na ordem de inserção. Ao exceder limite, remova a primeira chave.',
      inicial: go`package main

import "fmt"

type CacheLimitado struct {
  dados    map[string]string
  ordem    []string
  maxItems int
}

func NovoCacheLimitado(max int) *CacheLimitado {
  return &CacheLimitado{
    dados:    make(map[string]string),
    maxItems: max,
  }
}

func (c *CacheLimitado) Set(k, v string) {
  // Implemente com evicção FIFO
}

func (c *CacheLimitado) Get(k string) (string, bool) {
  v, ok := c.dados[k]
  return v, ok
}

func (c *CacheLimitado) Size() int {
  return len(c.dados)
}

func main() {
  cache := NovoCacheLimitado(3)
  cache.Set("a", "1")
  cache.Set("b", "2")
  cache.Set("c", "3")
  cache.Set("d", "4") // deve evictar "a"
  _, ok := cache.Get("a")
  fmt.Printf("%v:%d\\n", ok, cache.Size())
}`,
      solucao: go`package main

import "fmt"

type CacheLimitado struct {
  dados    map[string]string
  ordem    []string
  maxItems int
}

func NovoCacheLimitado(max int) *CacheLimitado {
  return &CacheLimitado{
    dados:    make(map[string]string),
    maxItems: max,
  }
}

func (c *CacheLimitado) Set(k, v string) {
  // Se chave já existe, atualize
  if _, ok := c.dados[k]; ok {
    c.dados[k] = v
    return
  }
  // Se cheio, evictar o mais antigo
  if len(c.dados) >= c.maxItems {
    oldest := c.ordem[0]
    c.ordem = c.ordem[1:]
    delete(c.dados, oldest)
  }
  c.dados[k] = v
  c.ordem = append(c.ordem, k)
}

func (c *CacheLimitado) Get(k string) (string, bool) {
  v, ok := c.dados[k]
  return v, ok
}

func (c *CacheLimitado) Size() int {
  return len(c.dados)
}

func main() {
  cache := NovoCacheLimitado(3)
  cache.Set("a", "1")
  cache.Set("b", "2")
  cache.Set("c", "3")
  cache.Set("d", "4")
  _, ok := cache.Get("a")
  fmt.Printf("%v:%d\\n", ok, cache.Size())
}`,
      testes: [{ entrada: '', saida: 'false:3' }],
    }),

    problema({
      id: 'bancos-consulta-paginacao-dificil',
      titulo: 'Paginação de Resultados',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>Paginar</code> que retorna uma página de resultados dado página (1-based) e tamanho da página.</p>',
      dica: 'Calcule início = (pagina-1)*tamanho. Use slicing com verificação de limites.',
      inicial: go`package main

import "fmt"

type Item struct {
  ID int
}

func Paginar(itens []Item, pagina, tamanho int) []Item {
  // Implemente aqui
  return nil
}

func main() {
  itens := []Item{{1}, {2}, {3}, {4}, {5}, {6}, {7}}
  p1 := Paginar(itens, 1, 3)
  p2 := Paginar(itens, 2, 3)
  p3 := Paginar(itens, 3, 3)
  fmt.Printf("%d %d %d\\n", len(p1), len(p2), len(p3))
  fmt.Printf("%d %d\\n", p2[0].ID, p3[0].ID)
}`,
      solucao: go`package main

import "fmt"

type Item struct {
  ID int
}

func Paginar(itens []Item, pagina, tamanho int) []Item {
  inicio := (pagina - 1) * tamanho
  if inicio >= len(itens) {
    return []Item{}
  }
  fim := inicio + tamanho
  if fim > len(itens) {
    fim = len(itens)
  }
  return itens[inicio:fim]
}

func main() {
  itens := []Item{{1}, {2}, {3}, {4}, {5}, {6}, {7}}
  p1 := Paginar(itens, 1, 3)
  p2 := Paginar(itens, 2, 3)
  p3 := Paginar(itens, 3, 3)
  fmt.Printf("%d %d %d\\n", len(p1), len(p2), len(p3))
  fmt.Printf("%d %d\\n", p2[0].ID, p3[0].ID)
}`,
      testes: [{ entrada: '', saida: '3 3 1\n4 7' }],
    }),

    problema({
      id: 'bancos-transacao-multi-op-dificil',
      titulo: 'Transação com Múltiplas Operações',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>ExecutarTransacao</code> que executa uma lista de operações. Se qualquer operação falhar, reverta todas as anteriores.</p>',
      dica: 'Faça backup antes de cada operação. Se falhar, restaure o backup original.',
      inicial: go`package main

import "fmt"

type Conta struct {
  ID    int
  Saldo float64
}

type Operacao struct {
  OrigemID int
  DestID   int
  Valor    float64
}

func ExecutarTransacao(contas []Conta, ops []Operacao) ([]Conta, bool) {
  // Implemente com rollback total
  return contas, false
}

func main() {
  contas := []Conta{{1, 1000}, {2, 500}, {3, 200}}
  ops := []Operacao{
    {1, 2, 100}, // OK
    {2, 3, 50},  // OK
    {3, 1, 500}, // Falha (saldo insuficiente)
  }
  contas, ok := ExecutarTransacao(contas, ops)
  fmt.Printf("%v:%.0f:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo, contas[2].Saldo)

  // Agora uma transação que dá certo
  contas = []Conta{{1, 1000}, {2, 500}, {3, 200}}
  contas, ok = ExecutarTransacao(contas, []Operacao{{1, 2, 100}, {2, 3, 50}})
  fmt.Printf("%v:%.0f:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo, contas[2].Saldo)
}`,
      solucao: go`package main

import "fmt"

type Conta struct {
  ID    int
  Saldo float64
}

type Operacao struct {
  OrigemID int
  DestID   int
  Valor    float64
}

func ExecutarTransacao(contas []Conta, ops []Operacao) ([]Conta, bool) {
  // Backup original
  original := make([]Conta, len(contas))
  copy(original, contas)

  for _, op := range ops {
    origIdx := -1
    destIdx := -1
    for i, c := range contas {
      if c.ID == op.OrigemID {
        origIdx = i
      }
      if c.ID == op.DestID {
        destIdx = i
      }
    }
    if origIdx == -1 || destIdx == -1 || contas[origIdx].Saldo < op.Valor {
      return original, false // Rollback completo
    }
    contas[origIdx].Saldo -= op.Valor
    contas[destIdx].Saldo += op.Valor
  }
  return contas, true
}

func main() {
  contas := []Conta{{1, 1000}, {2, 500}, {3, 200}}
  ops := []Operacao{
    {1, 2, 100},
    {2, 3, 50},
    {3, 1, 500},
  }
  contas, ok := ExecutarTransacao(contas, ops)
  fmt.Printf("%v:%.0f:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo, contas[2].Saldo)

  // Agora uma transação que dá certo
  contas = []Conta{{1, 1000}, {2, 500}, {3, 200}}
  contas, ok = ExecutarTransacao(contas, []Operacao{{1, 2, 100}, {2, 3, 50}})
  fmt.Printf("%v:%.0f:%.0f:%.0f\\n", ok, contas[0].Saldo, contas[1].Saldo, contas[2].Saldo)
}`,
      testes: [{ entrada: '', saida: 'false:1000:500:200\ntrue:900:550:250' }],
    }),
    ...extraBancos,
  ],
};