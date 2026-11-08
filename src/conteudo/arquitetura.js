import { go, licao, problema } from './util.js';
import { extraArquitetura } from './problemas/extra-arquitetura.js';

export const moduloArquitetura = {
  id: 'arquitetura',
  titulo: 'Arquitetura e Padrões',
  icone: '🏛️',
  descricao: 'Clean Architecture, DDD, CQRS, Event Sourcing, microserviços e padrões de projeto.',
  itens: [
    // === LIÇÕES (15) ===

    licao({
      id: 'arquitetura-clean-arch-conceito',
      titulo: 'Clean Architecture - Conceito',
      resumo: 'Clean Architecture separa o código em camadas: Domínio, Aplicação, Infraestrutura e Interface. O domínio não depende de nada externo.',
      codigo: go`
        package main

        import "fmt"

        // Camada de Domínio - regra pura
        type Produto struct {
          Nome  string
          Preco float64
        }

        func (p Produto) CalcularDesconto(percentual float64) float64 {
          return p.Preco * (1 - percentual/100)
        }

        // Camada de Aplicação - orquestra
        func AplicarDesconto(p Produto, pct float64) float64 {
          return p.CalcularDesconto(pct)
        }

        func main() {
          p := Produto{Nome: "Livro", Preco: 100}
          final := AplicarDesconto(p, 10)
          fmt.Printf("Preço final: %.2f\\n", final)
        }
      `,
    }),

    licao({
      id: 'arquitetura-ddd-conceito',
      titulo: 'DDD - Domain-Driven Design',
      resumo: 'DDD foca no modelo de domínio. Entidades têm identidade; Value Objects são imutáveis e definidos por seus atributos.',
      codigo: go`
        package main

        import "fmt"

        // Entity: tem ID único
        type Cliente struct {
          ID   int
          Nome string
        }

        // Value Object: definido pelos valores
        type Endereco struct {
          Rua    string
          Cidade string
        }

        func (e Endereco) String() string {
          return e.Rua + ", " + e.Cidade
        }

        func main() {
          c := Cliente{ID: 1, Nome: "Ana"}
          end := Endereco{Rua: "Av. Brasil", Cidade: "SP"}
          fmt.Println(c.Nome)
          fmt.Println(end.String())
        }
      `,
    }),

    licao({
      id: 'arquitetura-bounded-context',
      titulo: 'Bounded Context',
      resumo: 'Bounded Context define limites onde um modelo é válido. "Produto" em Vendas pode ser diferente de "Produto" em Estoque.',
      codigo: go`
        package main

        import "fmt"

        // Contexto de Vendas
        type ProdutoVenda struct {
          SKU   string
          Preco float64
        }

        // Contexto de Estoque
        type ProdutoEstoque struct {
          SKU       string
          Quantidade int
        }

        func main() {
          pv := ProdutoVenda{SKU: "ABC", Preco: 29.90}
          pe := ProdutoEstoque{SKU: "ABC", Quantidade: 50}
          fmt.Println("Venda:", pv.SKU, pv.Preco)
          fmt.Println("Estoque:", pe.SKU, pe.Quantidade)
        }
      `,
    }),

    licao({
      id: 'arquitetura-entity-vs-value-object',
      titulo: 'Entity vs Value Object',
      resumo: 'Entities têm identidade (ID). Value Objects são comparados por valor e devem ser imutáveis.',
      codigo: go`
        package main

        import "fmt"

        type Pedido struct {
          ID     int
          Valor  float64
        }

        type Dinheiro struct {
          Valor    float64
          Moeda    string
        }

        func (d Dinheiro) Igual(outro Dinheiro) bool {
          return d.Valor == outro.Valor && d.Moeda == outro.Moeda
        }

        func main() {
          p1 := Pedido{ID: 1, Valor: 100}
          p2 := Pedido{ID: 1, Valor: 200}
          fmt.Println("Mesmo pedido?", p1.ID == p2.ID)

          d1 := Dinheiro{Valor: 100, Moeda: "BRL"}
          d2 := Dinheiro{Valor: 100, Moeda: "BRL"}
          fmt.Println("Mesmo dinheiro?", d1.Igual(d2))
        }
      `,
    }),

    licao({
      id: 'arquitetura-repository-pattern',
      titulo: 'Repository Pattern',
      resumo: 'Repository abstrai o acesso a dados. O domínio não sabe se os dados vêm de memória, banco ou API.',
      codigo: go`
        package main

        import "fmt"

        type Usuario struct {
          ID   int
          Nome string
        }

        type RepoUsuarios struct {
          dados []Usuario
        }

        func (r *RepoUsuarios) Salvar(u Usuario) {
          r.dados = append(r.dados, u)
        }

        func (r *RepoUsuarios) BuscarPorID(id int) Usuario {
          for _, u := range r.dados {
            if u.ID == id {
              return u
            }
          }
          return Usuario{}
        }

        func main() {
          repo := RepoUsuarios{}
          repo.Salvar(Usuario{ID: 1, Nome: "Ana"})
          repo.Salvar(Usuario{ID: 2, Nome: "Bob"})
          u := repo.BuscarPorID(2)
          fmt.Println(u.Nome)
        }
      `,
    }),

    licao({
      id: 'arquitetura-factory-pattern',
      titulo: 'Factory Pattern',
      resumo: 'Factory encapsula a criação de objetos. O chamador não precisa saber qual struct concreta será criada.',
      codigo: go`
        package main

        import "fmt"

        type Notificacao struct {
          Tipo    string
          Mensagem string
        }

        func CriarNotificacao(tipo string, msg string) Notificacao {
          switch tipo {
          case "email":
            return Notificacao{Tipo: "EMAIL", Mensagem: msg}
          case "sms":
            return Notificacao{Tipo: "SMS", Mensagem: msg}
          default:
            return Notificacao{Tipo: "DESCONHECIDO", Mensagem: msg}
          }
        }

        func main() {
          n1 := CriarNotificacao("email", "Olá")
          n2 := CriarNotificacao("sms", "Oi")
          fmt.Println(n1.Tipo, n1.Mensagem)
          fmt.Println(n2.Tipo, n2.Mensagem)
        }
      `,
    }),

    licao({
      id: 'arquitetura-strategy-pattern',
      titulo: 'Strategy Pattern',
      resumo: 'Strategy permite trocar algoritmos em tempo de execução. Cada estratégia implementa a mesma interface.',
      codigo: go`
        package main

        import "fmt"

        type DescontoFunc func(preco float64) float64

        func DescontoFixo(preco float64) float64 {
          return preco - 10
        }

        func DescontoPercentual(preco float64) float64 {
          return preco * 0.9
        }

        func Aplicar(preco float64, estrategia DescontoFunc) float64 {
          return estrategia(preco)
        }

        func main() {
          preco := 100.0
          fmt.Printf("Fixo: %.2f\\n", Aplicar(preco, DescontoFixo))
          fmt.Printf("Pct: %.2f\\n", Aplicar(preco, DescontoPercentual))
        }
      `,
    }),

    licao({
      id: 'arquitetura-observer-pattern',
      titulo: 'Observer Pattern',
      resumo: 'Observer notifica múltiplos listeners quando algo acontece. Útil para eventos de domínio.',
      codigo: go`
        package main

        import "fmt"

        type Listener func(evento string)

        type Emissor struct {
          listeners []Listener
        }

        func (e *Emissor) Registrar(l Listener) {
          e.listeners = append(e.listeners, l)
        }

        func (e *Emissor) Emitir(evento string) {
          for _, l := range e.listeners {
            l(evento)
          }
        }

        func main() {
          emissor := Emissor{}
          emissor.Registrar(func(e string) {
            fmt.Println("Log:", e)
          })
          emissor.Registrar(func(e string) {
            fmt.Println("Email:", e)
          })
          emissor.Emitir("pedido.criado")
        }
      `,
    }),

    licao({
      id: 'arquitetura-singleton-conceito',
      titulo: 'Singleton - Conceito',
      resumo: 'Singleton garante uma única instância. Em Go, variáveis de pacote podem simular isso sem goroutines.',
      codigo: go`
        package main

        import "fmt"

        var instanciaConfig *Config

        type Config struct {
          AppName string
          Versao  string
        }

        func ObterConfig() *Config {
          if instanciaConfig == nil {
            instanciaConfig = &Config{AppName: "MinhaApp", Versao: "1.0"}
          }
          return instanciaConfig
        }

        func main() {
          c1 := ObterConfig()
          c2 := ObterConfig()
          fmt.Println(c1.AppName)
          fmt.Println("Mesma instância?", c1 == c2)
        }
      `,
    }),

    licao({
      id: 'arquitetura-dependency-injection',
      titulo: 'Dependency Injection',
      resumo: 'DI injeta dependências ao invés de criá-las internamente. Facilita testes e troca de implementações.',
      codigo: go`
        package main

        import "fmt"

        type Armazenamento struct {
          dados []string
        }

        func (a *Armazenamento) Salvar(s string) {
          a.dados = append(a.dados, s)
        }

        func (a *Armazenamento) Listar() []string {
          return a.dados
        }

        type Servico struct {
          store *Armazenamento
        }

        func NovoServico(s *Armazenamento) *Servico {
          return &Servico{store: s}
        }

        func (s *Servico) Adicionar(item string) {
          s.store.Salvar(item)
        }

        func main() {
          store := &Armazenamento{}
          svc := NovoServico(store)
          svc.Adicionar("item1")
          svc.Adicionar("item2")
          for _, v := range store.Listar() {
            fmt.Println(v)
          }
        }
      `,
    }),

    licao({
      id: 'arquitetura-cqrs-conceito',
      titulo: 'CQRS - Command Query Separation',
      resumo: 'CQRS separa operações de escrita (Commands) das de leitura (Queries). Modelos diferentes para cada lado.',
      codigo: go`
        package main

        import "fmt"

        type Conta struct {
          ID    int
          Saldo float64
        }

        var contas []Conta

        // Command: altera estado
        func Depositar(id int, valor float64) {
          for i, c := range contas {
            if c.ID == id {
              contas[i].Saldo = c.Saldo + valor
            }
          }
        }

        // Query: apenas lê
        func ConsultarSaldo(id int) float64 {
          for _, c := range contas {
            if c.ID == id {
              return c.Saldo
            }
          }
          return 0
        }

        func main() {
          contas = append(contas, Conta{ID: 1, Saldo: 100})
          Depositar(1, 50)
          fmt.Printf("Saldo: %.2f\\n", ConsultarSaldo(1))
        }
      `,
    }),

    licao({
      id: 'arquitetura-event-sourcing-conceito',
      titulo: 'Event Sourcing - Conceito',
      resumo: 'Event Sourcing armazena eventos ao invés do estado atual. O estado é reconstruído aplicando eventos.',
      codigo: go`
        package main

        import "fmt"

        type Evento struct {
          Tipo  string
          Valor float64
        }

        type ContaES struct {
          eventos []Evento
          saldo   float64
        }

        func (c *ContaES) Aplicar(e Evento) {
          c.eventos = append(c.eventos, e)
          switch e.Tipo {
          case "deposito":
            c.saldo += e.Valor
          case "saque":
            c.saldo -= e.Valor
          }
        }

        func (c *ContaES) Saldo() float64 {
          return c.saldo
        }

        func main() {
          conta := ContaES{}
          conta.Aplicar(Evento{Tipo: "deposito", Valor: 100})
          conta.Aplicar(Evento{Tipo: "deposito", Valor: 50})
          conta.Aplicar(Evento{Tipo: "saque", Valor: 30})
          fmt.Printf("Saldo: %.2f, Eventos: %d\\n", conta.Saldo(), len(conta.eventos))
        }
      `,
    }),

    licao({
      id: 'arquitetura-microservicos-conceito',
      titulo: 'Microserviços - Conceito',
      resumo: 'Microserviços dividem a aplicação em serviços independentes. Cada serviço tem seu próprio banco e responsabilidade.',
      codigo: go`
        package main

        import "fmt"

        // Simula chamada entre serviços
        type ServicoPedidos struct{}

        func (s *ServicoPedidos) CriarPedido(produtoID int) string {
          return fmt.Sprintf("Pedido criado para produto %d", produtoID)
        }

        type ServicoEstoque struct{}

        func (s *ServicoEstoque) VerificarDisponibilidade(produtoID int) bool {
          return produtoID <= 100
        }

        func main() {
          estoque := ServicoEstoque{}
          pedidos := ServicoPedidos{}

          produtoID := 42
          if estoque.VerificarDisponibilidade(produtoID) {
            resultado := pedidos.CriarPedido(produtoID)
            fmt.Println(resultado)
          } else {
            fmt.Println("Produto indisponível")
          }
        }
      `,
    }),

    licao({
      id: 'arquitetura-api-gateway-conceito',
      titulo: 'API Gateway - Conceito',
      resumo: 'API Gateway centraliza requisições, roteia para serviços internos e pode agregar respostas.',
      codigo: go`
        package main

        import "fmt"

        type Rota struct {
          Caminho string
          Servico string
        }

        type Gateway struct {
          rotas []Rota
        }

        func (g *Gateway) Registrar(caminho string, servico string) {
          g.rotas = append(g.rotas, Rota{Caminho: caminho, Servico: servico})
        }

        func (g *Gateway) Roteiar(caminho string) string {
          for _, r := range g.rotas {
            if r.Caminho == caminho {
              return r.Servico
            }
          }
          return "404"
        }

        func main() {
          gw := Gateway{}
          gw.Registrar("/pedidos", "ServicoPedidos")
          gw.Registrar("/usuarios", "ServicoUsuarios")
          fmt.Println(gw.Roteiar("/pedidos"))
          fmt.Println(gw.Roteiar("/desconhecido"))
        }
      `,
    }),

    licao({
      id: 'arquitetura-hexagonal-conceito',
      titulo: 'Hexagonal Architecture',
      resumo: 'Arquitetura Hexagonal (Ports & Adapters) isola o domínio. Ports são interfaces; Adapters são implementações.',
      codigo: go`
        package main

        import "fmt"

        // Port: contrato que o domínio define
        type RepositorioTarefa struct {
          tarefas []string
        }

        func (r *RepositorioTarefa) Adicionar(t string) {
          r.tarefas = append(r.tarefas, t)
        }

        func (r *RepositorioTarefa) Listar() []string {
          return r.tarefas
        }

        // Adapter: implementação concreta (em memória)
        type ServicoTarefa struct {
          repo *RepositorioTarefa
        }

        func (s *ServicoTarefa) Criar(nome string) {
          s.repo.Adicionar(nome)
        }

        func main() {
          repo := &RepositorioTarefa{}
          svc := ServicoTarefa{repo: repo}
          svc.Criar("Aprender Go")
          svc.Criar("Praticar DDD")
          for _, t := range repo.Listar() {
            fmt.Println(t)
          }
        }
      `,
    }),

    // === PROBLEMAS (30) ===

    // --- Repository (3 problemas) ---

    problema({
      id: 'arquitetura-repo-usuario-1',
      titulo: 'Repositório de Usuários',
      dificuldade: 'facil',
      enunciado: '<p>Implemente um repositório em memória para usuários. O repositório deve ter métodos <code>Salvar</code> e <code>BuscarPorID</code>.</p>',
      dica: '<p>Use um slice de structs dentro do repositório. Percorra com for-range para buscar.</p>',
      inicial: go`
package main

import "fmt"

type Usuario struct {
  ID   int
  Nome string
}

type RepoUsuarios struct {
  dados []Usuario
}

// Implemente Salvar e BuscarPorID

func main() {
  repo := RepoUsuarios{}
  repo.Salvar(Usuario{ID: 1, Nome: "Ana"})
  repo.Salvar(Usuario{ID: 2, Nome: "Bob"})
  u := repo.BuscarPorID(2)
  fmt.Println(u.Nome)
}

func (r *RepoUsuarios) Salvar(u Usuario) {
  // TODO: implemente
}

func (r *RepoUsuarios) BuscarPorID(id int) Usuario {
  // TODO: implemente
  return Usuario{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type Usuario struct {
          ID   int
          Nome string
        }

        type RepoUsuarios struct {
          dados []Usuario
        }

        func (r *RepoUsuarios) Salvar(u Usuario) {
          r.dados = append(r.dados, u)
        }

        func (r *RepoUsuarios) BuscarPorID(id int) Usuario {
          for _, u := range r.dados {
            if u.ID == id {
              return u
            }
          }
          return Usuario{}
        }

        func main() {
          repo := RepoUsuarios{}
          repo.Salvar(Usuario{ID: 1, Nome: "Ana"})
          repo.Salvar(Usuario{ID: 2, Nome: "Bob"})
          u := repo.BuscarPorID(2)
          fmt.Println(u.Nome)
        }
      `,
      testes: [{ entrada: '', saida: 'Bob' }],
    }),

    problema({
      id: 'arquitetura-repo-produto-2',
      titulo: 'Repositório de Produtos com Listagem',
      dificuldade: 'medio',
      enunciado: '<p>Crie um repositório de produtos com métodos <code>Salvar</code>, <code>BuscarPorID</code> e <code>ListarTodos</code>. <code>ListarTodos</code> deve imprimir cada produto no formato "ID: Nome - Preço".</p>',
      dica: '<p>Use fmt.Printf para formatar a saída. Use for-range em ListarTodos.</p>',
      inicial: go`
package main

import "fmt"

var _ = fmt.Println // TODO: use o pacote fmt e apague esta linha

type Produto struct {
  ID    int
  Nome  string
  Preco float64
}

type RepoProdutos struct {
  dados []Produto
}

// Implemente Salvar, BuscarPorID e ListarTodos

func main() {
  repo := RepoProdutos{}
  repo.Salvar(Produto{ID: 1, Nome: "Caneta", Preco: 2.50})
  repo.Salvar(Produto{ID: 2, Nome: "Caderno", Preco: 15.00})
  repo.ListarTodos()
}

func (r *RepoProdutos) Salvar(p Produto) {
  // TODO: implemente
}

func (r *RepoProdutos) ListarTodos() {
  // TODO: implemente
}
`,
      solucao: go`
        package main

        import "fmt"

        type Produto struct {
          ID    int
          Nome  string
          Preco float64
        }

        type RepoProdutos struct {
          dados []Produto
        }

        func (r *RepoProdutos) Salvar(p Produto) {
          r.dados = append(r.dados, p)
        }

        func (r *RepoProdutos) BuscarPorID(id int) Produto {
          for _, p := range r.dados {
            if p.ID == id {
              return p
            }
          }
          return Produto{}
        }

        func (r *RepoProdutos) ListarTodos() {
          for _, p := range r.dados {
            fmt.Printf("%d: %s - %.2f\\n", p.ID, p.Nome, p.Preco)
          }
        }

        func main() {
          repo := RepoProdutos{}
          repo.Salvar(Produto{ID: 1, Nome: "Caneta", Preco: 2.50})
          repo.Salvar(Produto{ID: 2, Nome: "Caderno", Preco: 15.00})
          repo.ListarTodos()
        }
      `,
      testes: [{ entrada: '', saida: '1: Caneta - 2.50\n2: Caderno - 15.00' }],
    }),

    problema({
      id: 'arquitetura-repo-pedido-3',
      titulo: 'Repositório de Pedidos com Filtro',
      dificuldade: 'medio',
      enunciado: '<p>Implemente um repositório de pedidos com <code>Salvar</code> e <code>BuscarPorCliente</code> que retorna todos os pedidos de um cliente específico pelo nome.</p>',
      dica: '<p>Percorra todos os pedidos e colete os que têm o mesmo cliente em um novo slice.</p>',
      inicial: go`
package main

import "fmt"

type Pedido struct {
  ID     int
  Cliente string
  Valor  float64
}

type RepoPedidos struct {
  dados []Pedido
}

// Implemente Salvar e BuscarPorCliente

func main() {
  repo := RepoPedidos{}
  repo.Salvar(Pedido{ID: 1, Cliente: "Ana", Valor: 100})
  repo.Salvar(Pedido{ID: 2, Cliente: "Bob", Valor: 200})
  repo.Salvar(Pedido{ID: 3, Cliente: "Ana", Valor: 150})
  pedidos := repo.BuscarPorCliente("Ana")
  for _, p := range pedidos {
    fmt.Printf("Pedido %d: %.2f\\n", p.ID, p.Valor)
  }
}

func (r *RepoPedidos) Salvar(p Pedido) {
  // TODO: implemente
}

func (r *RepoPedidos) BuscarPorCliente(cliente string) []Pedido {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        type Pedido struct {
          ID     int
          Cliente string
          Valor  float64
        }

        type RepoPedidos struct {
          dados []Pedido
        }

        func (r *RepoPedidos) Salvar(p Pedido) {
          r.dados = append(r.dados, p)
        }

        func (r *RepoPedidos) BuscarPorCliente(cliente string) []Pedido {
          var resultado []Pedido
          for _, p := range r.dados {
            if p.Cliente == cliente {
              resultado = append(resultado, p)
            }
          }
          return resultado
        }

        func main() {
          repo := RepoPedidos{}
          repo.Salvar(Pedido{ID: 1, Cliente: "Ana", Valor: 100})
          repo.Salvar(Pedido{ID: 2, Cliente: "Bob", Valor: 200})
          repo.Salvar(Pedido{ID: 3, Cliente: "Ana", Valor: 150})
          pedidos := repo.BuscarPorCliente("Ana")
          for _, p := range pedidos {
            fmt.Printf("Pedido %d: %.2f\\n", p.ID, p.Valor)
          }
        }
      `,
      testes: [{ entrada: '', saida: 'Pedido 1: 100.00\nPedido 3: 150.00' }],
    }),

    // --- Factory (3 problemas) ---

    problema({
      id: 'arquitetura-factory-notificacao-4',
      titulo: 'Fábrica de Notificações',
      dificuldade: 'facil',
      enunciado: '<p>Crie uma função <code>CriarNotificacao(tipo, mensagem)</code> que retorna uma struct com o tipo normalizado (maiúsculas) e a mensagem.</p>',
      dica: '<p>Use switch para mapear "email" → "EMAIL", "sms" → "SMS", "push" → "PUSH".</p>',
      inicial: go`
package main

import "fmt"

type Notificacao struct {
  Tipo     string
  Mensagem string
}

// Implemente CriarNotificacao

func main() {
  n1 := CriarNotificacao("email", "Bem-vindo")
  n2 := CriarNotificacao("sms", "Código: 123")
  n3 := CriarNotificacao("push", "Nova mensagem")
  fmt.Println(n1.Tipo, n1.Mensagem)
  fmt.Println(n2.Tipo, n2.Mensagem)
  fmt.Println(n3.Tipo, n3.Mensagem)
}

func CriarNotificacao(tipo string, mensagem string) Notificacao {
  // TODO: implemente
  return Notificacao{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type Notificacao struct {
          Tipo     string
          Mensagem string
        }

        func CriarNotificacao(tipo string, mensagem string) Notificacao {
          switch tipo {
          case "email":
            return Notificacao{Tipo: "EMAIL", Mensagem: mensagem}
          case "sms":
            return Notificacao{Tipo: "SMS", Mensagem: mensagem}
          case "push":
            return Notificacao{Tipo: "PUSH", Mensagem: mensagem}
          default:
            return Notificacao{Tipo: "DESCONHECIDO", Mensagem: mensagem}
          }
        }

        func main() {
          n1 := CriarNotificacao("email", "Bem-vindo")
          n2 := CriarNotificacao("sms", "Código: 123")
          n3 := CriarNotificacao("push", "Nova mensagem")
          fmt.Println(n1.Tipo, n1.Mensagem)
          fmt.Println(n2.Tipo, n2.Mensagem)
          fmt.Println(n3.Tipo, n3.Mensagem)
        }
      `,
      testes: [{ entrada: '', saida: 'EMAIL Bem-vindo\nSMS Código: 123\nPUSH Nova mensagem' }],
    }),

    problema({
      id: 'arquitetura-factory-pagamento-5',
      titulo: 'Fábrica de Pagamentos',
      dificuldade: 'medio',
      enunciado: '<p>Crie uma fábrica que cria structs de pagamento baseadas no tipo. Cada tipo tem campos diferentes: Cartao tem Numero e Parcelas; Pix tem Chave.</p>',
      dica: '<p>Retorne uma struct Pagamento com Tipo e um campo Detalhes como string formatada.</p>',
      inicial: go`
package main

import "fmt"

type Pagamento struct {
  Tipo    string
  Detalhes string
}

// Implemente CriarPagamentoCartao e CriarPagamentoPix

func main() {
  p1 := CriarPagamentoCartao("1234-5678", 3)
  p2 := CriarPagamentoPix("chave@email.com")
  fmt.Println(p1.Tipo, p1.Detalhes)
  fmt.Println(p2.Tipo, p2.Detalhes)
}

func CriarPagamentoCartao(numero string, parcelas int) Pagamento {
  // TODO: implemente
  return Pagamento{}
}

func CriarPagamentoPix(chave string) Pagamento {
  // TODO: implemente
  return Pagamento{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type Pagamento struct {
          Tipo    string
          Detalhes string
        }

        func CriarPagamentoCartao(numero string, parcelas int) Pagamento {
          return Pagamento{
            Tipo: "CARTAO",
            Detalhes: fmt.Sprintf("Numero=%s Parcelas=%d", numero, parcelas),
          }
        }

        func CriarPagamentoPix(chave string) Pagamento {
          return Pagamento{
            Tipo: "PIX",
            Detalhes: fmt.Sprintf("Chave=%s", chave),
          }
        }

        func main() {
          p1 := CriarPagamentoCartao("1234-5678", 3)
          p2 := CriarPagamentoPix("chave@email.com")
          fmt.Println(p1.Tipo, p1.Detalhes)
          fmt.Println(p2.Tipo, p2.Detalhes)
        }
      `,
      testes: [{ entrada: '', saida: 'CARTAO Numero=1234-5678 Parcelas=3\nPIX Chave=chave@email.com' }],
    }),

    problema({
      id: 'arquitetura-factory-relatorio-6',
      titulo: 'Fábrica de Relatórios',
      dificuldade: 'medio',
      enunciado: '<p>Crie uma fábrica que gera relatórios em diferentes formatos. A função <code>GerarRelatorio(formato, dados)</code> deve retornar o relatório formatado.</p>',
      dica: '<p>Para "csv", junte os dados com vírgula. Para "texto", junte com nova linha.</p>',
      inicial: go`
package main

import "fmt"

// Implemente GerarRelatorio(formato string, dados []string) string

func main() {
  dados := []string{"Ana", "Bob", "Carol"}
  fmt.Println(GerarRelatorio("csv", dados))
  fmt.Println(GerarRelatorio("texto", dados))
}

func GerarRelatorio(formato string, dados []string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func GerarRelatorio(formato string, dados []string) string {
          resultado := ""
          switch formato {
          case "csv":
            for i, d := range dados {
              if i > 0 {
                resultado += ","
              }
              resultado += d
            }
          case "texto":
            for i, d := range dados {
              if i > 0 {
                resultado += "\\n"
              }
              resultado += d
            }
          default:
            resultado = "formato desconhecido"
          }
          return resultado
        }

        func main() {
          dados := []string{"Ana", "Bob", "Carol"}
          fmt.Println(GerarRelatorio("csv", dados))
          fmt.Println(GerarRelatorio("texto", dados))
        }
      `,
      testes: [{ entrada: '', saida: 'Ana,Bob,Carol\nAna\nBob\nCarol' }],
    }),

    // --- Strategy (3 problemas) ---

    problema({
      id: 'arquitetura-strategy-desconto-7',
      titulo: 'Estratégia de Desconto Fixo',
      dificuldade: 'facil',
      enunciado: '<p>Implemente uma função <code>AplicarDescontoFixo(preco, valor)</code> que subtrai um valor fixo do preço.</p>',
      dica: '<p>Simplesmente retorne preco - valor.</p>',
      inicial: go`
package main

import "fmt"

// Implemente AplicarDescontoFixo

func main() {
  fmt.Printf("%.2f\\n", AplicarDescontoFixo(100, 15))
  fmt.Printf("%.2f\\n", AplicarDescontoFixo(50, 10))
}

func AplicarDescontoFixo(preco float64, valor float64) float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func AplicarDescontoFixo(preco float64, valor float64) float64 {
          return preco - valor
        }

        func main() {
          fmt.Printf("%.2f\\n", AplicarDescontoFixo(100, 15))
          fmt.Printf("%.2f\\n", AplicarDescontoFixo(50, 10))
        }
      `,
      testes: [{ entrada: '', saida: '85.00\n40.00' }],
    }),

    problema({
      id: 'arquitetura-strategy-percentual-8',
      titulo: 'Estratégia de Desconto Percentual',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>AplicarDescontoPercentual(preco, percentual)</code> que aplica um desconto percentual.</p>',
      dica: '<p>Multiplique o preço por (1 - percentual/100).</p>',
      inicial: go`
package main

import "fmt"

// Implemente AplicarDescontoPercentual

func main() {
  fmt.Printf("%.2f\\n", AplicarDescontoPercentual(200, 10))
  fmt.Printf("%.2f\\n", AplicarDescontoPercentual(80, 25))
}

func AplicarDescontoPercentual(preco float64, percentual float64) float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func AplicarDescontoPercentual(preco float64, percentual float64) float64 {
          return preco * (1 - percentual/100)
        }

        func main() {
          fmt.Printf("%.2f\\n", AplicarDescontoPercentual(200, 10))
          fmt.Printf("%.2f\\n", AplicarDescontoPercentual(80, 25))
        }
      `,
      testes: [{ entrada: '', saida: '180.00\n60.00' }],
    }),

    problema({
      id: 'arquitetura-strategy-progressivo-9',
      titulo: 'Estratégia de Desconto Progressivo',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>AplicarDescontoProgressivo(preco, quantidade)</code>: 5% até 3 itens, 10% de 4-7, 15% acima de 7.</p>',
      dica: '<p>Use if/else if para definir faixas de quantidade.</p>',
      inicial: go`
package main

import "fmt"

// Implemente AplicarDescontoProgressivo

func main() {
  fmt.Printf("%.2f\\n", AplicarDescontoProgressivo(100, 2))
  fmt.Printf("%.2f\\n", AplicarDescontoProgressivo(100, 5))
  fmt.Printf("%.2f\\n", AplicarDescontoProgressivo(100, 10))
}

func AplicarDescontoProgressivo(preco float64, quantidade int) float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func AplicarDescontoProgressivo(preco float64, quantidade int) float64 {
          var desconto float64
          if quantidade <= 3 {
            desconto = 5
          } else if quantidade <= 7 {
            desconto = 10
          } else {
            desconto = 15
          }
          return preco * (1 - desconto/100)
        }

        func main() {
          fmt.Printf("%.2f\\n", AplicarDescontoProgressivo(100, 2))
          fmt.Printf("%.2f\\n", AplicarDescontoProgressivo(100, 5))
          fmt.Printf("%.2f\\n", AplicarDescontoProgressivo(100, 10))
        }
      `,
      testes: [{ entrada: '', saida: '95.00\n90.00\n85.00' }],
    }),

    // --- Observer (2 problemas) ---

    problema({
      id: 'arquitetura-observer-eventos-10',
      titulo: 'Sistema de Eventos Simples',
      dificuldade: 'medio',
      enunciado: '<p>Crie um sistema de eventos com <code>Registrar</code> e <code>Emitir</code>. Ao emitir, todos os listeners registrados devem ser chamados.</p>',
      dica: '<p>Armazene funções em um slice. No Emitir, percorra e chame cada uma.</p>',
      inicial: go`
package main

import "fmt"

type Listener func(msg string)

type EventBus struct {
  listeners []Listener
}

// Implemente Registrar e Emitir

func main() {
  bus := EventBus{}
  bus.Registrar(func(m string) { fmt.Println("A:", m) })
  bus.Registrar(func(m string) { fmt.Println("B:", m) })
  bus.Emitir("evento1")
}

func (e *EventBus) Registrar(l Listener) {
  // TODO: implemente
}

func (e *EventBus) Emitir(msg string) {
  // TODO: implemente
}
`,
      solucao: go`
        package main

        import "fmt"

        type Listener func(msg string)

        type EventBus struct {
          listeners []Listener
        }

        func (e *EventBus) Registrar(l Listener) {
          e.listeners = append(e.listeners, l)
        }

        func (e *EventBus) Emitir(msg string) {
          for _, l := range e.listeners {
            l(msg)
          }
        }

        func main() {
          bus := EventBus{}
          bus.Registrar(func(m string) { fmt.Println("A:", m) })
          bus.Registrar(func(m string) { fmt.Println("B:", m) })
          bus.Emitir("evento1")
        }
      `,
      testes: [{ entrada: '', saida: 'A: evento1\nB: evento1' }],
    }),

    problema({
      id: 'arquitetura-observer-contador-11',
      titulo: 'Observer com Contador',
      dificuldade: 'medio',
      enunciado: '<p>Crie um observer que conta quantas vezes cada listener foi chamado. Imprima o contador após emitir 3 eventos.</p>',
      dica: '<p>Use variáveis globais ou um slice paralelo para contar chamadas.</p>',
      inicial: go`
package main

import "fmt"

var contadores []int

type Listener func()

type Observador struct {
  listeners []Listener
}

// Implemente Registrar e Notificar

func main() {
  obs := Observador{}
  contadores = []int{0, 0}
  obs.Registrar(func() { contadores[0]++ })
  obs.Registrar(func() { contadores[1]++ })
  obs.Notificar()
  obs.Notificar()
  obs.Notificar()
  fmt.Println(contadores[0], contadores[1])
}

func (o *Observador) Registrar(l Listener) {
  // TODO: implemente
}

func (o *Observador) Notificar() {
  // TODO: implemente
}
`,
      solucao: go`
        package main

        import "fmt"

        var contadores []int

        type Listener func()

        type Observador struct {
          listeners []Listener
        }

        func (o *Observador) Registrar(l Listener) {
          o.listeners = append(o.listeners, l)
        }

        func (o *Observador) Notificar() {
          for _, l := range o.listeners {
            l()
          }
        }

        func main() {
          obs := Observador{}
          contadores = []int{0, 0}
          obs.Registrar(func() { contadores[0]++ })
          obs.Registrar(func() { contadores[1]++ })
          obs.Notificar()
          obs.Notificar()
          obs.Notificar()
          fmt.Println(contadores[0], contadores[1])
        }
      `,
      testes: [{ entrada: '', saida: '3 3' }],
    }),

    // --- Builder (3 problemas) ---

    problema({
      id: 'arquitetura-builder-email-12',
      titulo: 'Builder de Email',
      dificuldade: 'medio',
      enunciado: '<p>Crie um builder para construir emails passo a passo. Use métodos encadeados: <code>ComDestinatario</code>, <code>ComAssunto</code>, <code>ComCorpo</code>.</p>',
      dica: '<p>Cada método retorna o ponteiro do builder para permitir encadeamento.</p>',
      inicial: go`
package main

import "fmt"

type Email struct {
  Destinatario string
  Assunto      string
  Corpo        string
}

type EmailBuilder struct {
  email Email
}

// Implemente ComDestinatario, ComAssunto, ComCorpo e Construir

func main() {
  b := EmailBuilder{}
  email := b.ComDestinatario("ana@mail.com").ComAssunto("Olá").ComCorpo("Tudo bem?").Construir()
  fmt.Println(email.Destinatario)
  fmt.Println(email.Assunto)
  fmt.Println(email.Corpo)
}

func (b *EmailBuilder) ComDestinatario(d string) *EmailBuilder {
  // TODO: implemente
  return nil
}

func (b *EmailBuilder) ComAssunto(a string) *EmailBuilder {
  // TODO: implemente
  return nil
}

func (b *EmailBuilder) ComCorpo(c string) *EmailBuilder {
  // TODO: implemente
  return nil
}

func (b *EmailBuilder) Construir() Email {
  // TODO: implemente
  return Email{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type Email struct {
          Destinatario string
          Assunto      string
          Corpo        string
        }

        type EmailBuilder struct {
          email Email
        }

        func (b *EmailBuilder) ComDestinatario(d string) *EmailBuilder {
          b.email.Destinatario = d
          return b
        }

        func (b *EmailBuilder) ComAssunto(a string) *EmailBuilder {
          b.email.Assunto = a
          return b
        }

        func (b *EmailBuilder) ComCorpo(c string) *EmailBuilder {
          b.email.Corpo = c
          return b
        }

        func (b *EmailBuilder) Construir() Email {
          return b.email
        }

        func main() {
          b := EmailBuilder{}
          email := b.ComDestinatario("ana@mail.com").ComAssunto("Olá").ComCorpo("Tudo bem?").Construir()
          fmt.Println(email.Destinatario)
          fmt.Println(email.Assunto)
          fmt.Println(email.Corpo)
        }
      `,
      testes: [{ entrada: '', saida: 'ana@mail.com\nOlá\nTudo bem?' }],
    }),

    problema({
      id: 'arquitetura-builder-query-13',
      titulo: 'Builder de Query SQL',
      dificuldade: 'dificil',
      enunciado: '<p>Crie um builder que monta uma query SELECT. Métodos: <code>Select(campos)</code>, <code>From(tabela)</code>, <code>Where(condicao)</code>. <code>Build()</code> retorna a string.</p>',
      dica: '<p>Concatene strings em cada método. No Build, monte "SELECT ... FROM ... WHERE ...".</p>',
      inicial: go`
        package main

        import "fmt"

        type QueryBuilder struct {
          campos    string
          tabela    string
          condicao  string
        }

        // Implemente Select, From, Where e Build (cada um devolve o próprio builder)
        func (qb *QueryBuilder) Select(campos string) *QueryBuilder {
          // TODO: implemente
          return qb
        }

        func (qb *QueryBuilder) From(tabela string) *QueryBuilder {
          // TODO: implemente
          return qb
        }

        func (qb *QueryBuilder) Where(condicao string) *QueryBuilder {
          // TODO: implemente
          return qb
        }

        func (qb *QueryBuilder) Build() string {
          // TODO: implemente
          return ""
        }

        func main() {
          qb := QueryBuilder{}
          q := qb.Select("nome, idade").From("usuarios").Where("ativo = true").Build()
          fmt.Println(q)
        }
      `,
      solucao: go`
        package main

        import "fmt"

        type QueryBuilder struct {
          campos    string
          tabela    string
          condicao  string
        }

        func (qb *QueryBuilder) Select(campos string) *QueryBuilder {
          qb.campos = campos
          return qb
        }

        func (qb *QueryBuilder) From(tabela string) *QueryBuilder {
          qb.tabela = tabela
          return qb
        }

        func (qb *QueryBuilder) Where(condicao string) *QueryBuilder {
          qb.condicao = condicao
          return qb
        }

        func (qb *QueryBuilder) Build() string {
          resultado := "SELECT " + qb.campos + " FROM " + qb.tabela
          if qb.condicao != "" {
            resultado += " WHERE " + qb.condicao
          }
          return resultado
        }

        func main() {
          qb := QueryBuilder{}
          q := qb.Select("nome, idade").From("usuarios").Where("ativo = true").Build()
          fmt.Println(q)
        }
      `,
      testes: [{ entrada: '', saida: 'SELECT nome, idade FROM usuarios WHERE ativo = true' }],
    }),

    problema({
      id: 'arquitetura-builder-config-14',
      titulo: 'Builder de Configuração',
      dificuldade: 'medio',
      enunciado: '<p>Crie um builder de configuração de servidor com métodos <code>ComHost</code>, <code>ComPorta</code>, <code>ComTimeout</code>. Valores padrão: host="localhost", porta=8080, timeout=30.</p>',
      dica: '<p>Inicialize o builder com valores padrão. Os métodos sobrescrevem apenas o que for chamado.</p>',
      inicial: go`
package main

import "fmt"

type ServerConfig struct {
  Host    string
  Porta   int
  Timeout int
}

type ConfigBuilder struct {
  config ServerConfig
}

// Implemente NovoConfigBuilder, ComHost, ComPorta, ComTimeout e Construir

func main() {
  cfg := NovoConfigBuilder().ComPorta(3000).ComTimeout(60).Construir()
  fmt.Println(cfg.Host, cfg.Porta, cfg.Timeout)
}

func NovoConfigBuilder() *ConfigBuilder {
  // TODO: implemente
  return nil
}

func (b *ConfigBuilder) ComPorta(p int) *ConfigBuilder {
  // TODO: implemente
  return nil
}

func (b *ConfigBuilder) ComTimeout(t int) *ConfigBuilder {
  // TODO: implemente
  return nil
}

func (b *ConfigBuilder) Construir() ServerConfig {
  // TODO: implemente
  return ServerConfig{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type ServerConfig struct {
          Host    string
          Porta   int
          Timeout int
        }

        type ConfigBuilder struct {
          config ServerConfig
        }

        func NovoConfigBuilder() *ConfigBuilder {
          return &ConfigBuilder{
            config: ServerConfig{Host: "localhost", Porta: 8080, Timeout: 30},
          }
        }

        func (b *ConfigBuilder) ComHost(h string) *ConfigBuilder {
          b.config.Host = h
          return b
        }

        func (b *ConfigBuilder) ComPorta(p int) *ConfigBuilder {
          b.config.Porta = p
          return b
        }

        func (b *ConfigBuilder) ComTimeout(t int) *ConfigBuilder {
          b.config.Timeout = t
          return b
        }

        func (b *ConfigBuilder) Construir() ServerConfig {
          return b.config
        }

        func main() {
          cfg := NovoConfigBuilder().ComPorta(3000).ComTimeout(60).Construir()
          fmt.Println(cfg.Host, cfg.Porta, cfg.Timeout)
        }
      `,
      testes: [{ entrada: '', saida: 'localhost 3000 60' }],
    }),

    // --- Adapter (2 problemas) ---

    problema({
      id: 'arquitetura-adapter-legado-15',
      titulo: 'Adapter para Serviço Legado',
      dificuldade: 'medio',
      enunciado: '<p>Um serviço legado usa <code>BuscarUsuarioPorCPF(cpf)</code> mas sua aplicação precisa de <code>BuscarUsuario(id)</code>. Crie um adapter.</p>',
      dica: '<p>O adapter recebe o ID, converte para CPF (simule com formatação) e chama o serviço legado.</p>',
      inicial: go`
package main

import "fmt"

type ServicoLegado struct{}

func (s *ServicoLegado) BuscarUsuarioPorCPF(cpf string) string {
  return "Usuario:" + cpf
}

type AdapterUsuario struct {
  legado *ServicoLegado
}

// Implemente BuscarUsuario(id int) string

func main() {
  legado := &ServicoLegado{}
  adapter := AdapterUsuario{legado: legado}
  fmt.Println(adapter.BuscarUsuario(123))
}

func (a *AdapterUsuario) BuscarUsuario(id int) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        type ServicoLegado struct{}

        func (s *ServicoLegado) BuscarUsuarioPorCPF(cpf string) string {
          return "Usuario:" + cpf
        }

        type AdapterUsuario struct {
          legado *ServicoLegado
        }

        func (a *AdapterUsuario) BuscarUsuario(id int) string {
          cpf := fmt.Sprintf("%011d", id)
          return a.legado.BuscarUsuarioPorCPF(cpf)
        }

        func main() {
          legado := &ServicoLegado{}
          adapter := AdapterUsuario{legado: legado}
          fmt.Println(adapter.BuscarUsuario(123))
        }
      `,
      testes: [{ entrada: '', saida: 'Usuario:00000000123' }],
    }),

    problema({
      id: 'arquitetura-adapter-formato-16',
      titulo: 'Adapter de Formato de Dados',
      dificuldade: 'medio',
      enunciado: '<p>Um serviço retorna dados como "nome|idade|cidade" mas sua aplicação precisa de uma struct. Crie um adapter que faz o parsing.</p>',
      dica: '<p>Percorra a string caractere por caractere para dividir nos pipes, já que o compiler não suporta strings.Split.</p>',
      inicial: go`
package main

import "fmt"

type Pessoa struct {
  Nome   string
  Idade  int
  Cidade string
}

type ServicoDados struct{}

func (s *ServicoDados) ObterRaw() string {
  return "Ana|30|São Paulo"
}

// Implemente AdaptarPessoa(raw string) Pessoa

func main() {
  svc := ServicoDados{}
  raw := svc.ObterRaw()
  p := AdaptarPessoa(raw)
  fmt.Println(p.Nome, p.Idade, p.Cidade)
}

func AdaptarPessoa(raw string) Pessoa {
  // TODO: implemente
  return Pessoa{}
}
`,
      solucao: go`
        package main

        import (
          "fmt"
          "strconv"
          "strings"
        )

        type Pessoa struct {
          Nome   string
          Idade  int
          Cidade string
        }

        type ServicoDados struct{}

        func (s *ServicoDados) ObterRaw() string {
          return "Ana|30|São Paulo"
        }

        func AdaptarPessoa(raw string) Pessoa {
          partes := strings.Split(raw, "|")
          idade, _ := strconv.Atoi(partes[1])
          return Pessoa{Nome: partes[0], Idade: idade, Cidade: partes[2]}
        }

        func main() {
          svc := ServicoDados{}
          raw := svc.ObterRaw()
          p := AdaptarPessoa(raw)
          fmt.Println(p.Nome, p.Idade, p.Cidade)
        }
      `,
      testes: [{ entrada: '', saida: 'Ana 30 São Paulo' }],
    }),

    // --- Decorator (2 problemas) ---

    problema({
      id: 'arquitetura-decorator-log-17',
      titulo: 'Decorator de Logging',
      dificuldade: 'medio',
      enunciado: '<p>Crie uma função decorator que adiciona logging antes e depois de executar uma função. Imprima "[LOG] Antes" e "[LOG] Depois".</p>',
      dica: '<p>Crie uma função que recebe outra função como parâmetro e a envolve com prints.</p>',
      inicial: go`
package main

import "fmt"

func Processar() {
  fmt.Println("Processando...")
}

// Implemente ComLog(fn func()) func()

func main() {
  decorado := ComLog(Processar)
  decorado()
}

func ComLog(fn func()) func() {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func Processar() {
          fmt.Println("Processando...")
        }

        func ComLog(fn func()) func() {
          return func() {
            fmt.Println("[LOG] Antes")
            fn()
            fmt.Println("[LOG] Depois")
          }
        }

        func main() {
          decorado := ComLog(Processar)
          decorado()
        }
      `,
      testes: [{ entrada: '', saida: '[LOG] Antes\nProcessando...\n[LOG] Depois' }],
    }),

    problema({
      id: 'arquitetura-decorator-timing-18',
      titulo: 'Decorator de Contagem',
      dificuldade: 'medio',
      enunciado: '<p>Crie um decorator que conta quantas vezes uma função foi chamada. Após 3 chamadas, imprima o total.</p>',
      dica: '<p>Use uma variável capturada pelo closure para manter o contador.</p>',
      inicial: go`
package main

import "fmt"

func Tarefa() {
  fmt.Println("Executando tarefa")
}

// Implemente ComContador(fn func()) func()

func main() {
  contada := ComContador(Tarefa)
  contada()
  contada()
  contada()
}

func ComContador(fn func()) func() {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func Tarefa() {
          fmt.Println("Executando tarefa")
        }

        func ComContador(fn func()) func() {
          contador := 0
          return func() {
            contador++
            fn()
            fmt.Printf("Chamada #%d\\n", contador)
          }
        }

        func main() {
          contada := ComContador(Tarefa)
          contada()
          contada()
          contada()
        }
      `,
      testes: [{ entrada: '', saida: 'Executando tarefa\nChamada #1\nExecutando tarefa\nChamada #2\nExecutando tarefa\nChamada #3' }],
    }),

    // --- Domain (4 problemas) ---

    problema({
      id: 'arquitetura-domain-validacao-19',
      titulo: 'Validação de Entidade de Domínio',
      dificuldade: 'facil',
      enunciado: '<p>Crie uma função <code>ValidarEmail(email)</code> que verifica se contém "@" e ".". Retorne "valido" ou "invalido".</p>',
      dica: '<p>Percorra a string procurando os caracteres especiais.</p>',
      inicial: go`
package main

import "fmt"

// Implemente ValidarEmail

func main() {
  fmt.Println(ValidarEmail("ana@mail.com"))
  fmt.Println(ValidarEmail("invalido"))
  fmt.Println(ValidarEmail("sem@ponto"))
}

func ValidarEmail(email string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func ValidarEmail(email string) string {
          temArroba := false
          temPonto := false
          for i := 0; i < len(email); i++ {
            if email[i] == '@' {
              temArroba = true
            }
            if email[i] == '.' {
              temPonto = true
            }
          }
          if temArroba && temPonto {
            return "valido"
          }
          return "invalido"
        }

        func main() {
          fmt.Println(ValidarEmail("ana@mail.com"))
          fmt.Println(ValidarEmail("invalido"))
          fmt.Println(ValidarEmail("sem@ponto"))
        }
      `,
      testes: [{ entrada: '', saida: 'valido\ninvalido\ninvalido' }],
    }),

    problema({
      id: 'arquitetura-domain-calculo-20',
      titulo: 'Regra de Negócio - Frete',
      dificuldade: 'facil',
      enunciado: '<p>Calcule frete: peso até 1kg = R$10, até 5kg = R$20, acima = R$30. Implemente <code>CalcularFrete(peso)</code>.</p>',
      dica: '<p>Use if/else if para as faixas de peso.</p>',
      inicial: go`
package main

import "fmt"

// Implemente CalcularFrete

func main() {
  fmt.Printf("%.2f\\n", CalcularFrete(0.5))
  fmt.Printf("%.2f\\n", CalcularFrete(3))
  fmt.Printf("%.2f\\n", CalcularFrete(10))
}

func CalcularFrete(peso float64) float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func CalcularFrete(peso float64) float64 {
          if peso <= 1 {
            return 10
          } else if peso <= 5 {
            return 20
          }
          return 30
        }

        func main() {
          fmt.Printf("%.2f\\n", CalcularFrete(0.5))
          fmt.Printf("%.2f\\n", CalcularFrete(3))
          fmt.Printf("%.2f\\n", CalcularFrete(10))
        }
      `,
      testes: [{ entrada: '', saida: '10.00\n20.00\n30.00' }],
    }),

    problema({
      id: 'arquitetura-domain-transferencia-21',
      titulo: 'Transferência entre Contas',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>Transferir(origem, destino, valor)</code> que transfere saldo entre contas. Se saldo insuficiente, não transfere e imprime "saldo insuficiente".</p>',
      dica: '<p>Verifique o saldo da origem antes de debitar. Use ponteiros para modificar as structs.</p>',
      inicial: go`
package main

import "fmt"

type Conta struct {
  Titular string
  Saldo   float64
}

// Implemente Transferir

func main() {
  c1 := Conta{Titular: "Ana", Saldo: 100}
  c2 := Conta{Titular: "Bob", Saldo: 50}
  Transferir(&c1, &c2, 30)
  fmt.Printf("%.2f %.2f\\n", c1.Saldo, c2.Saldo)
  Transferir(&c1, &c2, 200)
  fmt.Printf("%.2f %.2f\\n", c1.Saldo, c2.Saldo)
}

func Transferir(origem *Conta, destino *Conta, valor float64) {
  // TODO: implemente
}
`,
      solucao: go`
        package main

        import "fmt"

        type Conta struct {
          Titular string
          Saldo   float64
        }

        func Transferir(origem *Conta, destino *Conta, valor float64) {
          if origem.Saldo < valor {
            fmt.Println("saldo insuficiente")
            return
          }
          origem.Saldo -= valor
          destino.Saldo += valor
        }

        func main() {
          c1 := Conta{Titular: "Ana", Saldo: 100}
          c2 := Conta{Titular: "Bob", Saldo: 50}
          Transferir(&c1, &c2, 30)
          fmt.Printf("%.2f %.2f\\n", c1.Saldo, c2.Saldo)
          Transferir(&c1, &c2, 200)
          fmt.Printf("%.2f %.2f\\n", c1.Saldo, c2.Saldo)
        }
      `,
      testes: [{ entrada: '', saida: '70.00 80.00\nsaldo insuficiente\n70.00 80.00' }],
    }),

    problema({
      id: 'arquitetura-domain-carrinho-22',
      titulo: 'Carrinho de Compras',
      dificuldade: 'medio',
      enunciado: '<p>Implemente um carrinho com <code>Adicionar</code> e <code>Total</code>. Cada item tem nome, preço e quantidade.</p>',
      dica: '<p>No Total, percorra os itens e some preco * quantidade.</p>',
      inicial: go`
package main

import "fmt"

type Item struct {
  Nome      string
  Preco     float64
  Quantidade int
}

type Carrinho struct {
  itens []Item
}

// Implemente Adicionar e Total

func main() {
  c := Carrinho{}
  c.Adicionar(Item{Nome: "Caneta", Preco: 2.50, Quantidade: 3})
  c.Adicionar(Item{Nome: "Caderno", Preco: 15.00, Quantidade: 1})
  fmt.Printf("Total: %.2f\\n", c.Total())
}

func (c *Carrinho) Adicionar(item Item) {
  // TODO: implemente
}

func (c *Carrinho) Total() float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        type Item struct {
          Nome      string
          Preco     float64
          Quantidade int
        }

        type Carrinho struct {
          itens []Item
        }

        func (c *Carrinho) Adicionar(item Item) {
          c.itens = append(c.itens, item)
        }

        func (c *Carrinho) Total() float64 {
          total := 0.0
          for _, item := range c.itens {
            total += item.Preco * float64(item.Quantidade)
          }
          return total
        }

        func main() {
          c := Carrinho{}
          c.Adicionar(Item{Nome: "Caneta", Preco: 2.50, Quantidade: 3})
          c.Adicionar(Item{Nome: "Caderno", Preco: 15.00, Quantidade: 1})
          fmt.Printf("Total: %.2f\\n", c.Total())
        }
      `,
      testes: [{ entrada: '', saida: 'Total: 22.50' }],
    }),

    // --- CQRS (3 problemas) ---

    problema({
      id: 'arquitetura-cqrs-comandos-23',
      titulo: 'CQRS - Comandos de Estoque',
      dificuldade: 'medio',
      enunciado: '<p>Implemente comandos <code>AdicionarEstoque</code> e <code>RemoverEstoque</code> que modificam um slice global de produtos.</p>',
      dica: '<p>Busque o produto por ID e modifique a quantidade. Se não encontrar, adicione.</p>',
      inicial: go`
package main

import "fmt"

type Produto struct {
  ID         int
  Nome       string
  Quantidade int
}

var estoque []Produto

// Implemente AdicionarEstoque e RemoverEstoque

func main() {
  estoque = []Produto{{ID: 1, Nome: "Caneta", Quantidade: 10}}
  AdicionarEstoque(1, 5)
  RemoverEstoque(1, 3)
  for _, p := range estoque {
    fmt.Printf("%s: %d\\n", p.Nome, p.Quantidade)
  }
}

func AdicionarEstoque(id int, qtd int) {
  // TODO: implemente
}

func RemoverEstoque(id int, qtd int) {
  // TODO: implemente
}
`,
      solucao: go`
        package main

        import "fmt"

        type Produto struct {
          ID         int
          Nome       string
          Quantidade int
        }

        var estoque []Produto

        func AdicionarEstoque(id int, qtd int) {
          for i, p := range estoque {
            if p.ID == id {
              estoque[i].Quantidade += qtd
              return
            }
          }
        }

        func RemoverEstoque(id int, qtd int) {
          for i, p := range estoque {
            if p.ID == id {
              if estoque[i].Quantidade >= qtd {
                estoque[i].Quantidade -= qtd
              }
              return
            }
          }
        }

        func main() {
          estoque = []Produto{{ID: 1, Nome: "Caneta", Quantidade: 10}}
          AdicionarEstoque(1, 5)
          RemoverEstoque(1, 3)
          for _, p := range estoque {
            fmt.Printf("%s: %d\\n", p.Nome, p.Quantidade)
          }
        }
      `,
      testes: [{ entrada: '', saida: 'Caneta: 12' }],
    }),

    problema({
      id: 'arquitetura-cqrs-consultas-24',
      titulo: 'CQRS - Consultas de Estoque',
      dificuldade: 'medio',
      enunciado: '<p>Implemente consultas <code>ConsultarPorID</code> e <code>ConsultarDisponiveis</code> (quantidade > 0) sem modificar o estado.</p>',
      dica: '<p>Consultas apenas leem e retornam dados. Não modificam o slice.</p>',
      inicial: go`
package main

import "fmt"

type Produto struct {
  ID         int
  Nome       string
  Quantidade int
}

var estoque []Produto

// Implemente ConsultarPorID e ConsultarDisponiveis

func main() {
  estoque = []Produto{
    {ID: 1, Nome: "Caneta", Quantidade: 10},
    {ID: 2, Nome: "Borracha", Quantidade: 0},
    {ID: 3, Nome: "Lápis", Quantidade: 5},
  }
  p := ConsultarPorID(1)
  fmt.Println(p.Nome)
  disp := ConsultarDisponiveis()
  for _, d := range disp {
    fmt.Println(d.Nome)
  }
}

func ConsultarPorID(id int) Produto {
  // TODO: implemente
  return Produto{}
}

func ConsultarDisponiveis() []Produto {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        type Produto struct {
          ID         int
          Nome       string
          Quantidade int
        }

        var estoque []Produto

        func ConsultarPorID(id int) Produto {
          for _, p := range estoque {
            if p.ID == id {
              return p
            }
          }
          return Produto{}
        }

        func ConsultarDisponiveis() []Produto {
          var resultado []Produto
          for _, p := range estoque {
            if p.Quantidade > 0 {
              resultado = append(resultado, p)
            }
          }
          return resultado
        }

        func main() {
          estoque = []Produto{
            {ID: 1, Nome: "Caneta", Quantidade: 10},
            {ID: 2, Nome: "Borracha", Quantidade: 0},
            {ID: 3, Nome: "Lápis", Quantidade: 5},
          }
          p := ConsultarPorID(1)
          fmt.Println(p.Nome)
          disp := ConsultarDisponiveis()
          for _, d := range disp {
            fmt.Println(d.Nome)
          }
        }
      `,
      testes: [{ entrada: '', saida: 'Caneta\nCaneta\nLápis' }],
    }),

    problema({
      id: 'arquitetura-cqrs-conta-25',
      titulo: 'CQRS - Conta Bancária Completa',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente CQRS completo para conta bancária: comandos (Depositar, Sacar) e queries (Saldo, Extrato). O extrato mostra todas as transações.</p>',
      dica: '<p>Mantenha um slice de transações separado. Comandos adicionam transações e atualizam saldo.</p>',
      inicial: go`
package main

import "fmt"

type Transacao struct {
  Tipo  string
  Valor float64
}

var saldo float64
var historico []Transacao

// Implemente Depositar, Sacar, ConsultarSaldo e ConsultarExtrato

func main() {
  saldo = 100
  Depositar(50)
  Sacar(30)
  fmt.Printf("Saldo: %.2f\\n", ConsultarSaldo())
  ConsultarExtrato()
}

func Depositar(valor float64) {
  // TODO: implemente
}

func Sacar(valor float64) {
  // TODO: implemente
}

func ConsultarSaldo() float64 {
  // TODO: implemente
  return 0
}

func ConsultarExtrato() {
  // TODO: implemente
}
`,
      solucao: go`
        package main

        import "fmt"

        type Transacao struct {
          Tipo  string
          Valor float64
        }

        var saldo float64
        var historico []Transacao

        func Depositar(valor float64) {
          saldo += valor
          historico = append(historico, Transacao{Tipo: "deposito", Valor: valor})
        }

        func Sacar(valor float64) {
          if saldo >= valor {
            saldo -= valor
            historico = append(historico, Transacao{Tipo: "saque", Valor: valor})
          }
        }

        func ConsultarSaldo() float64 {
          return saldo
        }

        func ConsultarExtrato() {
          for _, t := range historico {
            fmt.Printf("%s: %.2f\\n", t.Tipo, t.Valor)
          }
        }

        func main() {
          saldo = 100
          Depositar(50)
          Sacar(30)
          fmt.Printf("Saldo: %.2f\\n", ConsultarSaldo())
          ConsultarExtrato()
        }
      `,
      testes: [{ entrada: '', saida: 'Saldo: 120.00\ndeposito: 50.00\nsaque: 30.00' }],
    }),

    // --- Pipeline (3 problemas) ---

    problema({
      id: 'arquitetura-pipeline-transform-26',
      titulo: 'Pipeline de Transformação',
      dificuldade: 'medio',
      enunciado: '<p>Crie um pipeline que aplica transformações sequenciais em um número: dobrar, somar 10, dividir por 2.</p>',
      dica: '<p>Aplique cada transformação em sequência, passando o resultado para a próxima.</p>',
      inicial: go`
package main

import "fmt"

func Dobrar(n float64) float64 { return n * 2 }
func Somar10(n float64) float64 { return n + 10 }
func Dividir2(n float64) float64 { return n / 2 }

// Implemente Pipeline(inicio float64) float64

func main() {
  resultado := Pipeline(5)
  fmt.Printf("%.2f\\n", resultado)
}

func Pipeline(inicio float64) float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func Dobrar(n float64) float64 { return n * 2 }
        func Somar10(n float64) float64 { return n + 10 }
        func Dividir2(n float64) float64 { return n / 2 }

        func Pipeline(inicio float64) float64 {
          resultado := Dobrar(inicio)
          resultado = Somar10(resultado)
          resultado = Dividir2(resultado)
          return resultado
        }

        func main() {
          resultado := Pipeline(5)
          fmt.Printf("%.2f\\n", resultado)
        }
      `,
      testes: [{ entrada: '', saida: '10.00' }],
    }),

    problema({
      id: 'arquitetura-pipeline-texto-27',
      titulo: 'Pipeline de Texto',
      dificuldade: 'medio',
      enunciado: '<p>Crie um pipeline que processa texto: remover espaços iniciais/finais (trim simulado), converter para maiúsculas (simulado), adicionar prefixo.</p>',
      dica: '<p>Como o compiler é limitado, simplifique: apenas adicione prefixo e sufixo ao texto.</p>',
      inicial: go`
package main

import "fmt"

// Implemente PipelineTexto(texto string) string
// Deve retornar "[PROCESSADO] texto original [FIM]"

func main() {
  resultado := PipelineTexto("hello world")
  fmt.Println(resultado)
}

func PipelineTexto(texto string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func PipelineTexto(texto string) string {
          etapa1 := "[PROCESSADO] " + texto
          etapa2 := etapa1 + " [FIM]"
          return etapa2
        }

        func main() {
          resultado := PipelineTexto("hello world")
          fmt.Println(resultado)
        }
      `,
      testes: [{ entrada: '', saida: '[PROCESSADO] hello world [FIM]' }],
    }),

    problema({
      id: 'arquitetura-pipeline-dados-28',
      titulo: 'Pipeline de Filtragem e Agregação',
      dificuldade: 'dificil',
      enunciado: '<p>Dado um slice de números, filtre os pares, dobre cada um e some todos. Implemente como pipeline.</p>',
      dica: '<p>Faça três passes: filtrar pares, dobrar, somar. Ou combine em um único loop.</p>',
      inicial: go`
package main

import "fmt"

// Implemente PipelineNumeros(nums []int) int

func main() {
  nums := []int{1, 2, 3, 4, 5, 6}
  resultado := PipelineNumeros(nums)
  fmt.Println(resultado)
}

func PipelineNumeros(nums []int) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func PipelineNumeros(nums []int) int {
          soma := 0
          for _, n := range nums {
            if n%2 == 0 {
              soma += n * 2
            }
          }
          return soma
        }

        func main() {
          nums := []int{1, 2, 3, 4, 5, 6}
          resultado := PipelineNumeros(nums)
          fmt.Println(resultado)
        }
      `,
      testes: [{ entrada: '', saida: '24' }],
    }),

    // --- Problemas integrados / avançados (2 problemas) ---

    problema({
      id: 'arquitetura-integrado-crud-29',
      titulo: 'CRUD Completo com Repository',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente CRUD completo para tarefas: Criar, Listar, Concluir (marcar como feita) e ContarPendentes.</p>',
      dica: '<p>Use um slice de structs com campo Feito bool. Concluir busca por ID e marca Feito=true.</p>',
      inicial: go`
package main

import "fmt"

type Tarefa struct {
  ID    int
  Titulo string
  Feito  bool
}

type RepoTarefas struct {
  dados  []Tarefa
  proxID int
}

// Implemente Criar, Listar, Concluir e ContarPendentes

func main() {
  repo := RepoTarefas{proxID: 1}
  repo.Criar("Aprender Go")
  repo.Criar("Praticar DDD")
  repo.Criar("Estudar Clean Arch")
  repo.Concluir(1)
  repo.Listar()
  fmt.Printf("Pendentes: %d\\n", repo.ContarPendentes())
}

func (r *RepoTarefas) Criar(titulo string) {
  // TODO: implemente
}

func (r *RepoTarefas) Concluir(id int) {
  // TODO: implemente
}

func (r *RepoTarefas) Listar() {
  // TODO: implemente
}

func (r *RepoTarefas) ContarPendentes() int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        type Tarefa struct {
          ID    int
          Titulo string
          Feito  bool
        }

        type RepoTarefas struct {
          dados  []Tarefa
          proxID int
        }

        func (r *RepoTarefas) Criar(titulo string) {
          r.dados = append(r.dados, Tarefa{ID: r.proxID, Titulo: titulo, Feito: false})
          r.proxID++
        }

        func (r *RepoTarefas) Listar() {
          for _, t := range r.dados {
            status := "[ ]"
            if t.Feito {
              status = "[x]"
            }
            fmt.Printf("%d. %s %s\\n", t.ID, status, t.Titulo)
          }
        }

        func (r *RepoTarefas) Concluir(id int) {
          for i, t := range r.dados {
            if t.ID == id {
              r.dados[i].Feito = true
              return
            }
          }
        }

        func (r *RepoTarefas) ContarPendentes() int {
          count := 0
          for _, t := range r.dados {
            if !t.Feito {
              count++
            }
          }
          return count
        }

        func main() {
          repo := RepoTarefas{proxID: 1}
          repo.Criar("Aprender Go")
          repo.Criar("Praticar DDD")
          repo.Criar("Estudar Clean Arch")
          repo.Concluir(1)
          repo.Listar()
          fmt.Printf("Pendentes: %d\\n", repo.ContarPendentes())
        }
      `,
      testes: [{ entrada: '', saida: '1. [x] Aprender Go\n2. [ ] Praticar DDD\n3. [ ] Estudar Clean Arch\nPendentes: 2' }],
    }),

    problema({
      id: 'arquitetura-integrado-event-store-30',
      titulo: 'Event Store Simples',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente um Event Store que armazena eventos e reconstrói o estado de uma conta aplicando-os em ordem.</p>',
      dica: '<p>Armazene eventos em um slice. Reconstruir percorre e aplica cada evento ao saldo.</p>',
      inicial: go`
package main

import "fmt"

type Evento struct {
  Tipo  string
  Valor float64
}

type EventStore struct {
  eventos []Evento
}

// Implemente AdicionarEvento e ReconstruirSaldo

func main() {
  store := EventStore{}
  store.AdicionarEvento("deposito", 100)
  store.AdicionarEvento("deposito", 50)
  store.AdicionarEvento("saque", 30)
  store.AdicionarEvento("deposito", 20)
  fmt.Printf("Saldo: %.2f\\n", store.ReconstruirSaldo())
  fmt.Printf("Eventos: %d\\n", len(store.eventos))
}

func (e *EventStore) AdicionarEvento(tipo string, valor float64) {
  // TODO: implemente
}

func (e *EventStore) ReconstruirSaldo() float64 {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        type Evento struct {
          Tipo  string
          Valor float64
        }

        type EventStore struct {
          eventos []Evento
        }

        func (e *EventStore) AdicionarEvento(tipo string, valor float64) {
          e.eventos = append(e.eventos, Evento{Tipo: tipo, Valor: valor})
        }

        func (e *EventStore) ReconstruirSaldo() float64 {
          saldo := 0.0
          for _, ev := range e.eventos {
            switch ev.Tipo {
            case "deposito":
              saldo += ev.Valor
            case "saque":
              saldo -= ev.Valor
            }
          }
          return saldo
        }

        func main() {
          store := EventStore{}
          store.AdicionarEvento("deposito", 100)
          store.AdicionarEvento("deposito", 50)
          store.AdicionarEvento("saque", 30)
          store.AdicionarEvento("deposito", 20)
          fmt.Printf("Saldo: %.2f\\n", store.ReconstruirSaldo())
          fmt.Printf("Eventos: %d\\n", len(store.eventos))
        }
      `,
      testes: [{ entrada: '', saida: 'Saldo: 140.00\nEventos: 4' }],
    }),
    ...extraArquitetura,
  ],
};