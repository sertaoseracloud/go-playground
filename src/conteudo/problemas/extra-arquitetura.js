// Exercícios extras do módulo arquitetura. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraArquitetura = [
  problema({
    id: 'arquitetura-prob-opcoes-funcionais',
    titulo: "Opções funcionais",
    dificuldade: 'medio',
    enunciado: "<p>O padrão <b>functional options</b> deixa construtores flexíveis: <code>NovoServidor(ComPorta(9090))</code>.</p>\n<p>Implemente <code>ComPorta</code> e <code>ComTimeout</code>, que devolvem funções que alteram o <code>*Servidor</code>.</p>",
    dica: "<code>return func(s *Servidor) { s.Porta = p }</code>.",
    inicial: go`
package main

import "fmt"

type Servidor struct {
  Porta   int
  Timeout int
}

type Opcao func(*Servidor)

func ComPorta(p int) Opcao {
  // TODO: implemente
  return func(*Servidor) {}
}

func ComTimeout(seg int) Opcao {
  // TODO: implemente
  return func(*Servidor) {}
}

func NovoServidor(opcoes ...Opcao) *Servidor {
  s := &Servidor{Porta: 8080, Timeout: 30}
  for _, o := range opcoes {
    o(s)
  }
  return s
}

func main() {
  fmt.Println(*NovoServidor())
  fmt.Println(*NovoServidor(ComPorta(9090)))
  fmt.Println(*NovoServidor(ComTimeout(5), ComPorta(443)))
}
`,
    solucao: go`
package main

import "fmt"

type Servidor struct {
  Porta   int
  Timeout int
}

type Opcao func(*Servidor)

func ComPorta(p int) Opcao {
  return func(s *Servidor) { s.Porta = p }
}

func ComTimeout(seg int) Opcao {
  return func(s *Servidor) { s.Timeout = seg }
}

func NovoServidor(opcoes ...Opcao) *Servidor {
  s := &Servidor{Porta: 8080, Timeout: 30}
  for _, o := range opcoes {
    o(s)
  }
  return s
}

func main() {
  fmt.Println(*NovoServidor())
  fmt.Println(*NovoServidor(ComPorta(9090)))
  fmt.Println(*NovoServidor(ComTimeout(5), ComPorta(443)))
}
`,
    testes: [{ saida: "{8080 30}\n{9090 30}\n{443 5}" }],
  }),
  problema({
    id: 'arquitetura-prob-injecao-dependencia',
    titulo: "Injeção de dependência",
    dificuldade: 'medio',
    enunciado: "<p>O <code>Cadastro</code> depende da interface <code>Notificador</code>, não de um e-mail concreto: assim podemos trocar por um falso nos testes.</p>\n<p>Implemente <code>Registrar(nome)</code>: guarde o nome e chame <code>c.notif.Enviar(nome, \"bem-vindo!\")</code>.</p>",
    dica: "Basta <code>c.nomes = append(c.nomes, nome)</code> e depois usar <code>c.notif</code>.",
    inicial: go`
package main

import "fmt"

type Notificador interface {
  Enviar(para, msg string)
}

type NotificadorFalso struct {
  enviados []string
}

func (n *NotificadorFalso) Enviar(para, msg string) {
  n.enviados = append(n.enviados, para+": "+msg)
}

type Cadastro struct {
  notif Notificador
  nomes []string
}

func (c *Cadastro) Registrar(nome string) {
  // TODO: implemente
}

func main() {
  falso := &NotificadorFalso{}
  c := &Cadastro{notif: falso}
  c.Registrar("Ana")
  c.Registrar("Bia")
  fmt.Println(c.nomes)
  fmt.Println(falso.enviados)
}
`,
    solucao: go`
package main

import "fmt"

type Notificador interface {
  Enviar(para, msg string)
}

type NotificadorFalso struct {
  enviados []string
}

func (n *NotificadorFalso) Enviar(para, msg string) {
  n.enviados = append(n.enviados, para+": "+msg)
}

type Cadastro struct {
  notif Notificador
  nomes []string
}

func (c *Cadastro) Registrar(nome string) {
  c.nomes = append(c.nomes, nome)
  c.notif.Enviar(nome, "bem-vindo!")
}

func main() {
  falso := &NotificadorFalso{}
  c := &Cadastro{notif: falso}
  c.Registrar("Ana")
  c.Registrar("Bia")
  fmt.Println(c.nomes)
  fmt.Println(falso.enviados)
}
`,
    testes: [{ saida: "[Ana Bia]\n[Ana: bem-vindo! Bia: bem-vindo!]" }],
  }),
  problema({
    id: 'arquitetura-prob-decorator',
    titulo: "Decorator com interfaces",
    dificuldade: 'medio',
    enunciado: "<p><code>ComCache</code> embrulha qualquer <code>Cotacao</code> e guarda os resultados, sem mudar a cotação original.</p>\n<p>Implemente <code>Preco(moeda)</code>: devolva do cache se já tiver; senão, consulte <code>c.interna</code> e guarde.</p>",
    dica: "Mesmo padrão do cache-aside: <code>if v, ok := c.cache[moeda]; ok { return v }</code>.",
    inicial: go`
package main

import "fmt"

type Cotacao interface {
  Preco(moeda string) float64
}

type CotacaoLenta struct {
  chamadas int
}

func (c *CotacaoLenta) Preco(moeda string) float64 {
  c.chamadas++
  return map[string]float64{"USD": 5.4, "EUR": 5.9}[moeda]
}

type ComCache struct {
  interna Cotacao
  cache   map[string]float64
}

func (c *ComCache) Preco(moeda string) float64 {
  // TODO: implemente
  return 0
}

func main() {
  lenta := &CotacaoLenta{}
  var cot Cotacao = &ComCache{interna: lenta, cache: map[string]float64{}}
  for _, m := range []string{"USD", "EUR", "USD", "USD"} {
    fmt.Print(cot.Preco(m), " ")
  }
  fmt.Println()
  fmt.Println("chamadas reais:", lenta.chamadas)
}
`,
    solucao: go`
package main

import "fmt"

type Cotacao interface {
  Preco(moeda string) float64
}

type CotacaoLenta struct {
  chamadas int
}

func (c *CotacaoLenta) Preco(moeda string) float64 {
  c.chamadas++
  return map[string]float64{"USD": 5.4, "EUR": 5.9}[moeda]
}

type ComCache struct {
  interna Cotacao
  cache   map[string]float64
}

func (c *ComCache) Preco(moeda string) float64 {
  if v, ok := c.cache[moeda]; ok {
    return v
  }
  v := c.interna.Preco(moeda)
  c.cache[moeda] = v
  return v
}

func main() {
  lenta := &CotacaoLenta{}
  var cot Cotacao = &ComCache{interna: lenta, cache: map[string]float64{}}
  for _, m := range []string{"USD", "EUR", "USD", "USD"} {
    fmt.Print(cot.Preco(m), " ")
  }
  fmt.Println()
  fmt.Println("chamadas reais:", lenta.chamadas)
}
`,
    testes: [{ saida: "5.4 5.9 5.4 5.4\nchamadas reais: 2" }],
  }),
  problema({
    id: 'arquitetura-prob-maquina-estados',
    titulo: "Máquina de estados de um pedido",
    dificuldade: 'medio',
    enunciado: "<p>Um pedido só pode seguir as transições permitidas: <code>novo → pago → enviado → entregue</code>, e <code>novo → cancelado</code>.</p>\n<p>Implemente <code>Mudar(para)</code>: mude o estado se a transição for permitida; senão devolva o erro <code>DE -&gt; PARA não permitido</code>.</p>",
    dica: "Consulte <code>transicoes[p.Estado]</code> e procure <code>para</code> na lista. Use <code>fmt.Errorf</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "slices".

var transicoes = map[string][]string{
  "novo":    {"pago", "cancelado"},
  "pago":    {"enviado"},
  "enviado": {"entregue"},
}

type Pedido struct {
  Estado string
}

func (p *Pedido) Mudar(para string) error {
  // TODO: implemente
  return nil
}

func main() {
  p := &Pedido{Estado: "novo"}
  for _, e := range []string{"enviado", "pago", "cancelado", "enviado", "entregue"} {
    fmt.Println(p.Mudar(e), p.Estado)
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "slices"
)

var transicoes = map[string][]string{
  "novo":    {"pago", "cancelado"},
  "pago":    {"enviado"},
  "enviado": {"entregue"},
}

type Pedido struct {
  Estado string
}

func (p *Pedido) Mudar(para string) error {
  if !slices.Contains(transicoes[p.Estado], para) {
    return fmt.Errorf("%s -> %s não permitido", p.Estado, para)
  }
  p.Estado = para
  return nil
}

func main() {
  p := &Pedido{Estado: "novo"}
  for _, e := range []string{"enviado", "pago", "cancelado", "enviado", "entregue"} {
    fmt.Println(p.Mudar(e), p.Estado)
  }
}
`,
    testes: [{ saida: "novo -> enviado não permitido novo\n<nil> pago\npago -> cancelado não permitido pago\n<nil> enviado\n<nil> entregue" }],
  }),
  problema({
    id: 'arquitetura-prob-command-undo',
    titulo: "Command com desfazer",
    dificuldade: 'dificil',
    enunciado: "<p>Cada comando sabe se aplicar e se desfazer. Implemente <code>Executar(c)</code> (aplica e guarda no histórico) e <code>Desfazer()</code> (desfaz o último, se houver).</p>",
    dica: "O histórico é uma pilha: <code>append</code> ao executar; ao desfazer, pegue o último, chame <code>Desfazer</code> e encurte o slice.",
    inicial: go`
package main

import "fmt"

type Comando interface {
  Aplicar(texto string) string
  Desfazer(texto string) string
}

type Acrescentar struct {
  trecho string
}

func (a Acrescentar) Aplicar(t string) string   { return t + a.trecho }
func (a Acrescentar) Desfazer(t string) string { return t[:len(t)-len(a.trecho)] }

type Editor struct {
  Texto     string
  historico []Comando
}

func (e *Editor) Executar(c Comando) {
  // TODO: implemente
}

func (e *Editor) Desfazer() {
  // TODO: implemente
}

func main() {
  e := &Editor{}
  e.Executar(Acrescentar{"Olá"})
  e.Executar(Acrescentar{", mundo"})
  e.Executar(Acrescentar{"!"})
  fmt.Println(e.Texto)
  e.Desfazer()
  fmt.Println(e.Texto)
  e.Desfazer()
  e.Desfazer()
  e.Desfazer()
  fmt.Printf("%q\\n", e.Texto)
}
`,
    solucao: go`
package main

import "fmt"

type Comando interface {
  Aplicar(texto string) string
  Desfazer(texto string) string
}

type Acrescentar struct {
  trecho string
}

func (a Acrescentar) Aplicar(t string) string   { return t + a.trecho }
func (a Acrescentar) Desfazer(t string) string { return t[:len(t)-len(a.trecho)] }

type Editor struct {
  Texto     string
  historico []Comando
}

func (e *Editor) Executar(c Comando) {
  e.Texto = c.Aplicar(e.Texto)
  e.historico = append(e.historico, c)
}

func (e *Editor) Desfazer() {
  if len(e.historico) == 0 {
    return
  }
  ultimo := e.historico[len(e.historico)-1]
  e.Texto = ultimo.Desfazer(e.Texto)
  e.historico = e.historico[:len(e.historico)-1]
}

func main() {
  e := &Editor{}
  e.Executar(Acrescentar{"Olá"})
  e.Executar(Acrescentar{", mundo"})
  e.Executar(Acrescentar{"!"})
  fmt.Println(e.Texto)
  e.Desfazer()
  fmt.Println(e.Texto)
  e.Desfazer()
  e.Desfazer()
  e.Desfazer()
  fmt.Printf("%q\\n", e.Texto)
}
`,
    testes: [{ saida: "Olá, mundo!\nOlá, mundo\n\"\"" }],
  }),
  problema({
    id: 'arquitetura-prob-event-bus',
    titulo: "Barramento de eventos",
    dificuldade: 'medio',
    enunciado: "<p>Implemente um barramento simples: <code>Assinar(evento, fn)</code> registra um ouvinte e <code>Publicar(evento, dado)</code> chama todos os ouvintes daquele evento, na ordem de inscrição.</p>",
    dica: "Um <code>map[string][]func(string)</code>: <code>append</code> ao assinar e um <code>for</code> ao publicar.",
    inicial: go`
package main

import "fmt"

type Barramento struct {
  ouvintes map[string][]func(string)
}

func (b *Barramento) Assinar(evento string, fn func(string)) {
  // TODO: implemente
}

func (b *Barramento) Publicar(evento, dado string) {
  // TODO: implemente
}

func main() {
  b := &Barramento{ouvintes: map[string][]func(string){}}
  b.Assinar("pedido.criado", func(d string) { fmt.Println("estoque reservou", d) })
  b.Assinar("pedido.criado", func(d string) { fmt.Println("email enviado para", d) })
  b.Assinar("pedido.pago", func(d string) { fmt.Println("nota fiscal de", d) })
  b.Publicar("pedido.criado", "#42")
  b.Publicar("pedido.pago", "#42")
  b.Publicar("pedido.cancelado", "#42")
}
`,
    solucao: go`
package main

import "fmt"

type Barramento struct {
  ouvintes map[string][]func(string)
}

func (b *Barramento) Assinar(evento string, fn func(string)) {
  b.ouvintes[evento] = append(b.ouvintes[evento], fn)
}

func (b *Barramento) Publicar(evento, dado string) {
  for _, fn := range b.ouvintes[evento] {
    fn(dado)
  }
}

func main() {
  b := &Barramento{ouvintes: map[string][]func(string){}}
  b.Assinar("pedido.criado", func(d string) { fmt.Println("estoque reservou", d) })
  b.Assinar("pedido.criado", func(d string) { fmt.Println("email enviado para", d) })
  b.Assinar("pedido.pago", func(d string) { fmt.Println("nota fiscal de", d) })
  b.Publicar("pedido.criado", "#42")
  b.Publicar("pedido.pago", "#42")
  b.Publicar("pedido.cancelado", "#42")
}
`,
    testes: [{ saida: "estoque reservou #42\nemail enviado para #42\nnota fiscal de #42" }],
  }),
  problema({
    id: 'arquitetura-prob-erros-sentinela',
    titulo: "Erros com errors.Is e errors.As",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>buscar(id)</code>: para id menor ou igual a 0, devolva um <code>*ErroValidacao</code> (campo <code>id</code>); para id maior que 100, devolva <code>ErrNaoEncontrado</code> <b>embrulhado</b> com contexto (<code>usuario ID: ...</code>); senão, devolva <code>usuario-ID</code>.</p>",
    dica: "Para embrulhar: <code>fmt.Errorf(\"usuario %d: %w\", id, ErrNaoEncontrado)</code>. O <code>%w</code> mantém o erro original acessível para <code>errors.Is</code>.",
    inicial: go`
package main

import (
  "errors"
  "fmt"
)

var ErrNaoEncontrado = errors.New("não encontrado")

type ErroValidacao struct {
  Campo string
}

func (e *ErroValidacao) Error() string { return "campo inválido: " + e.Campo }

func buscar(id int) (string, error) {
  // TODO: implemente
  return "", nil
}

func main() {
  for _, id := range []int{7, 500, -1} {
    u, err := buscar(id)
    var ev *ErroValidacao
    switch {
    case err == nil:
      fmt.Println("ok", u)
    case errors.Is(err, ErrNaoEncontrado):
      fmt.Println("404", err)
    case errors.As(err, &ev):
      fmt.Println("400", ev.Campo)
    }
  }
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
)

var ErrNaoEncontrado = errors.New("não encontrado")

type ErroValidacao struct {
  Campo string
}

func (e *ErroValidacao) Error() string { return "campo inválido: " + e.Campo }

func buscar(id int) (string, error) {
  if id <= 0 {
    return "", &ErroValidacao{Campo: "id"}
  }
  if id > 100 {
    return "", fmt.Errorf("usuario %d: %w", id, ErrNaoEncontrado)
  }
  return fmt.Sprintf("usuario-%d", id), nil
}

func main() {
  for _, id := range []int{7, 500, -1} {
    u, err := buscar(id)
    var ev *ErroValidacao
    switch {
    case err == nil:
      fmt.Println("ok", u)
    case errors.Is(err, ErrNaoEncontrado):
      fmt.Println("404", err)
    case errors.As(err, &ev):
      fmt.Println("400", ev.Campo)
    }
  }
}
`,
    testes: [{ saida: "ok usuario-7\n404 usuario 500: não encontrado\n400 id" }],
  }),
  problema({
    id: 'arquitetura-prob-objeto-valor',
    titulo: "Objeto de valor: Dinheiro",
    dificuldade: 'medio',
    enunciado: "<p>Dinheiro em <code>float64</code> perde centavos. Use centavos inteiros.</p>\n<p>Implemente <code>NovoDinheiro(centavos, moeda)</code> (erro <code>valor negativo</code> se for negativo) e <code>Somar(outro)</code> (erro <code>moedas diferentes</code> se as moedas não baterem). <code>String()</code> já está pronto.</p>",
    dica: "Os campos são privados: só dá para criar um <code>Dinheiro</code> válido pelo construtor.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "errors".

type Dinheiro struct {
  centavos int64
  moeda    string
}

func NovoDinheiro(centavos int64, moeda string) (Dinheiro, error) {
  // TODO: implemente
  return Dinheiro{}, nil
}

func (d Dinheiro) Somar(outro Dinheiro) (Dinheiro, error) {
  // TODO: implemente
  return Dinheiro{}, nil
}

func (d Dinheiro) String() string {
  return fmt.Sprintf("%s %d,%02d", d.moeda, d.centavos/100, d.centavos%100)
}

func main() {
  a, _ := NovoDinheiro(1050, "BRL")
  b, _ := NovoDinheiro(295, "BRL")
  c, _ := NovoDinheiro(100, "USD")
  soma, err := a.Somar(b)
  fmt.Println(soma, err)
  soma, err = a.Somar(c)
  fmt.Println(soma, err)
  negativo, err := NovoDinheiro(-5, "BRL")
  fmt.Println(negativo, err)
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
)

type Dinheiro struct {
  centavos int64
  moeda    string
}

func NovoDinheiro(centavos int64, moeda string) (Dinheiro, error) {
  if centavos < 0 {
    return Dinheiro{}, errors.New("valor negativo")
  }
  return Dinheiro{centavos, moeda}, nil
}

func (d Dinheiro) Somar(outro Dinheiro) (Dinheiro, error) {
  if d.moeda != outro.moeda {
    return Dinheiro{}, errors.New("moedas diferentes")
  }
  return Dinheiro{d.centavos + outro.centavos, d.moeda}, nil
}

func (d Dinheiro) String() string {
  return fmt.Sprintf("%s %d,%02d", d.moeda, d.centavos/100, d.centavos%100)
}

func main() {
  a, _ := NovoDinheiro(1050, "BRL")
  b, _ := NovoDinheiro(295, "BRL")
  c, _ := NovoDinheiro(100, "USD")
  soma, err := a.Somar(b)
  fmt.Println(soma, err)
  soma, err = a.Somar(c)
  fmt.Println(soma, err)
  negativo, err := NovoDinheiro(-5, "BRL")
  fmt.Println(negativo, err)
}
`,
    testes: [{ saida: "BRL 13,45 <nil>\n 0,00 moedas diferentes\n 0,00 valor negativo" }],
  }),
  problema({
    id: 'arquitetura-prob-fabrica',
    titulo: "Fábrica de exportadores",
    dificuldade: 'facil',
    enunciado: "<p>Implemente a fábrica <code>NovoExportador(formato)</code>: devolva um <code>CSV</code> para <code>\"csv\"</code>, um <code>JSON</code> para <code>\"json\"</code> e um erro <code>formato desconhecido: X</code> para o resto.</p>",
    dica: "Um <code>switch formato</code> devolvendo <code>CSV{}</code>, <code>JSON{}</code> ou <code>nil, fmt.Errorf(...)</code>.",
    inicial: go`
package main

import "fmt"

type Exportador interface {
  Exportar(dados []string) string
}

type CSV struct{}

func (CSV) Exportar(d []string) string {
  out := ""
  for i, v := range d {
    if i > 0 {
      out += ","
    }
    out += v
  }
  return out
}

type JSON struct{}

func (JSON) Exportar(d []string) string { return fmt.Sprintf("%q", d) }

func NovoExportador(formato string) (Exportador, error) {
  // TODO: implemente
  return nil, nil
}

func main() {
  dados := []string{"ana", "bia"}
  for _, f := range []string{"csv", "json", "xml"} {
    e, err := NovoExportador(f)
    if err != nil {
      fmt.Println(err)
      continue
    }
    fmt.Println(e.Exportar(dados))
  }
}
`,
    solucao: go`
package main

import "fmt"

type Exportador interface {
  Exportar(dados []string) string
}

type CSV struct{}

func (CSV) Exportar(d []string) string {
  out := ""
  for i, v := range d {
    if i > 0 {
      out += ","
    }
    out += v
  }
  return out
}

type JSON struct{}

func (JSON) Exportar(d []string) string { return fmt.Sprintf("%q", d) }

func NovoExportador(formato string) (Exportador, error) {
  switch formato {
  case "csv":
    return CSV{}, nil
  case "json":
    return JSON{}, nil
  }
  return nil, fmt.Errorf("formato desconhecido: %s", formato)
}

func main() {
  dados := []string{"ana", "bia"}
  for _, f := range []string{"csv", "json", "xml"} {
    e, err := NovoExportador(f)
    if err != nil {
      fmt.Println(err)
      continue
    }
    fmt.Println(e.Exportar(dados))
  }
}
`,
    testes: [{ saida: "ana,bia\n[\"ana\" \"bia\"]\nformato desconhecido: xml" }],
  }),
  problema({
    id: 'arquitetura-prob-porta-adaptador',
    titulo: "Portas e adaptadores",
    dificuldade: 'dificil',
    enunciado: "<p>Na arquitetura hexagonal, o domínio define <b>portas</b> (interfaces) e o mundo externo fornece <b>adaptadores</b>.</p>\n<p>Implemente <code>Finalizar(total)</code>: cobre com <code>c.pagamentos.Cobrar(total)</code>; se der certo, salve o pedido com <code>c.pedidos.Salvar</code> e devolva o ID; se a cobrança falhar, devolva o erro embrulhado como <code>checkout: ...</code> sem salvar.</p>",
    dica: "<code>if err := c.pagamentos.Cobrar(total); err != nil { return \"\", fmt.Errorf(\"checkout: %w\", err) }</code>.",
    inicial: go`
package main

import (
  "errors"
  "fmt"
)

type Pagamentos interface {
  Cobrar(total float64) error
}

type Pedidos interface {
  Salvar(total float64) string
}

type Checkout struct {
  pagamentos Pagamentos
  pedidos    Pedidos
}

func (c *Checkout) Finalizar(total float64) (string, error) {
  // TODO: implemente
  return "", nil
}

type GatewayFalso struct{ limite float64 }

func (g GatewayFalso) Cobrar(total float64) error {
  if total > g.limite {
    return errors.New("cartão recusado")
  }
  return nil
}

type PedidosMemoria struct{ salvos []float64 }

func (p *PedidosMemoria) Salvar(total float64) string {
  p.salvos = append(p.salvos, total)
  return fmt.Sprintf("PED-%d", len(p.salvos))
}

func main() {
  repo := &PedidosMemoria{}
  c := &Checkout{pagamentos: GatewayFalso{limite: 500}, pedidos: repo}
  fmt.Println(c.Finalizar(120))
  fmt.Println(c.Finalizar(900))
  fmt.Println(c.Finalizar(80))
  fmt.Println(repo.salvos)
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
)

type Pagamentos interface {
  Cobrar(total float64) error
}

type Pedidos interface {
  Salvar(total float64) string
}

type Checkout struct {
  pagamentos Pagamentos
  pedidos    Pedidos
}

func (c *Checkout) Finalizar(total float64) (string, error) {
  if err := c.pagamentos.Cobrar(total); err != nil {
    return "", fmt.Errorf("checkout: %w", err)
  }
  return c.pedidos.Salvar(total), nil
}

type GatewayFalso struct{ limite float64 }

func (g GatewayFalso) Cobrar(total float64) error {
  if total > g.limite {
    return errors.New("cartão recusado")
  }
  return nil
}

type PedidosMemoria struct{ salvos []float64 }

func (p *PedidosMemoria) Salvar(total float64) string {
  p.salvos = append(p.salvos, total)
  return fmt.Sprintf("PED-%d", len(p.salvos))
}

func main() {
  repo := &PedidosMemoria{}
  c := &Checkout{pagamentos: GatewayFalso{limite: 500}, pedidos: repo}
  fmt.Println(c.Finalizar(120))
  fmt.Println(c.Finalizar(900))
  fmt.Println(c.Finalizar(80))
  fmt.Println(repo.salvos)
}
`,
    testes: [{ saida: "PED-1 <nil>\n checkout: cartão recusado\nPED-2 <nil>\n[120 80]" }],
  }),
];
