// Exercícios extras do módulo web. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraWeb = [
  problema({
    id: 'web-prob-ola-handler',
    titulo: "Primeiro handler HTTP",
    dificuldade: 'facil',
    enunciado: "<p>Um <b>handler</b> recebe a resposta (<code>http.ResponseWriter</code>) e o pedido (<code>*http.Request</code>).</p>\n<p>Implemente <code>ola</code> para escrever <code>Olá, web!</code> na resposta. O <code>main</code> já chama o handler com <code>httptest</code> e imprime o status e o corpo.</p>",
    dica: "Use <code>fmt.Fprint(w, \"Olá, web!\")</code>. Sem chamar <code>WriteHeader</code>, o status é 200.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func ola(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  req := httptest.NewRequest("GET", "/", nil)
  ola(rec, req)
  fmt.Println(rec.Code)
  fmt.Println(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func ola(w http.ResponseWriter, r *http.Request) {
  fmt.Fprint(w, "Olá, web!")
}

func main() {
  rec := httptest.NewRecorder()
  req := httptest.NewRequest("GET", "/", nil)
  ola(rec, req)
  fmt.Println(rec.Code)
  fmt.Println(rec.Body.String())
}
`,
    testes: [{ saida: "200\nOlá, web!" }],
  }),
  problema({
    id: 'web-prob-status-criado',
    titulo: "Status 201 Created",
    dificuldade: 'facil',
    enunciado: "<p>Ao criar um recurso, a API responde <code>201 Created</code>.</p>\n<p>Implemente <code>criar</code>: escreva o status <code>http.StatusCreated</code> e o corpo <code>criado</code>.</p>",
    dica: "Chame <code>w.WriteHeader(http.StatusCreated)</code> <b>antes</b> de escrever o corpo.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func criar(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  criar(rec, httptest.NewRequest("POST", "/itens", nil))
  fmt.Println(rec.Code, rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func criar(w http.ResponseWriter, r *http.Request) {
  w.WriteHeader(http.StatusCreated)
  fmt.Fprint(w, "criado")
}

func main() {
  rec := httptest.NewRecorder()
  criar(rec, httptest.NewRequest("POST", "/itens", nil))
  fmt.Println(rec.Code, rec.Body.String())
}
`,
    testes: [{ saida: "201 criado" }],
  }),
  problema({
    id: 'web-prob-query-nome',
    titulo: "Lendo a query string",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>saudar</code>: leia o parâmetro <code>nome</code> da URL e responda <code>Olá, NOME!</code>.</p>\n<p>Se o parâmetro não vier, use <code>visitante</code>.</p>",
    dica: "<code>r.URL.Query().Get(\"nome\")</code> devolve <code>\"\"</code> quando o parâmetro não existe.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func saudar(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  for _, url := range []string{"/?nome=Ana", "/"} {
    rec := httptest.NewRecorder()
    saudar(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func saudar(w http.ResponseWriter, r *http.Request) {
  nome := r.URL.Query().Get("nome")
  if nome == "" {
    nome = "visitante"
  }
  fmt.Fprintf(w, "Olá, %s!", nome)
}

func main() {
  for _, url := range []string{"/?nome=Ana", "/"} {
    rec := httptest.NewRecorder()
    saudar(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(rec.Body.String())
  }
}
`,
    testes: [{ saida: "Olá, Ana!\nOlá, visitante!" }],
  }),
  problema({
    id: 'web-prob-metodo-permitido',
    titulo: "Só aceita GET",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>soGet</code>: para <code>GET</code>, responda <code>ok</code>; para qualquer outro método, responda status <code>405</code> com o corpo <code>método não permitido</code>.</p>",
    dica: "Compare <code>r.Method</code> com <code>http.MethodGet</code> e use <code>http.Error(w, \"método não permitido\", http.StatusMethodNotAllowed)</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func soGet(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  for _, m := range []string{"GET", "POST", "DELETE"} {
    rec := httptest.NewRecorder()
    soGet(rec, httptest.NewRequest(m, "/", nil))
    fmt.Println(m, rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func soGet(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodGet {
    http.Error(w, "método não permitido", http.StatusMethodNotAllowed)
    return
  }
  fmt.Fprint(w, "ok")
}

func main() {
  for _, m := range []string{"GET", "POST", "DELETE"} {
    rec := httptest.NewRecorder()
    soGet(rec, httptest.NewRequest(m, "/", nil))
    fmt.Println(m, rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    testes: [{ saida: "GET 200 ok\nPOST 405 método não permitido\nDELETE 405 método não permitido" }],
  }),
  problema({
    id: 'web-prob-header-content-type',
    titulo: "Cabeçalho Content-Type",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>texto</code>: defina o cabeçalho <code>Content-Type</code> como <code>text/plain; charset=utf-8</code> e escreva <code>Go na web</code>.</p>",
    dica: "Cabeçalhos são definidos com <code>w.Header().Set(...)</code> antes de escrever o corpo.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func texto(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  texto(rec, httptest.NewRequest("GET", "/", nil))
  fmt.Println(rec.Header().Get("Content-Type"))
  fmt.Println(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func texto(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "text/plain; charset=utf-8")
  fmt.Fprint(w, "Go na web")
}

func main() {
  rec := httptest.NewRecorder()
  texto(rec, httptest.NewRequest("GET", "/", nil))
  fmt.Println(rec.Header().Get("Content-Type"))
  fmt.Println(rec.Body.String())
}
`,
    testes: [{ saida: "text/plain; charset=utf-8\nGo na web" }],
  }),
  problema({
    id: 'web-prob-json-struct',
    titulo: "Respondendo JSON",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>produto</code>: responda o JSON do produto <code>{ID: 7, Nome: \"Caneca\", Preco: 29.9}</code>, com <code>Content-Type: application/json</code>.</p>\n<p>As tags da struct já definem os nomes dos campos em minúsculas.</p>",
    dica: "Use <code>json.NewEncoder(w).Encode(p)</code>. O <code>Encode</code> coloca uma quebra de linha no fim.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "encoding/json".

type Produto struct {
  ID    int     \`json:"id"\`
  Nome  string  \`json:"nome"\`
  Preco float64 \`json:"preco"\`
}

func produto(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  produto(rec, httptest.NewRequest("GET", "/produto", nil))
  fmt.Println(rec.Header().Get("Content-Type"))
  fmt.Print(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Produto struct {
  ID    int     \`json:"id"\`
  Nome  string  \`json:"nome"\`
  Preco float64 \`json:"preco"\`
}

func produto(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(Produto{ID: 7, Nome: "Caneca", Preco: 29.9})
}

func main() {
  rec := httptest.NewRecorder()
  produto(rec, httptest.NewRequest("GET", "/produto", nil))
  fmt.Println(rec.Header().Get("Content-Type"))
  fmt.Print(rec.Body.String())
}
`,
    testes: [{ saida: "application/json\n{\"id\":7,\"nome\":\"Caneca\",\"preco\":29.9}" }],
  }),
  problema({
    id: 'web-prob-json-decode',
    titulo: "Lendo JSON do corpo",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>cadastrar</code>: leia um <code>Usuario</code> do corpo JSON e responda <code>cadastrado: NOME (IDADE anos)</code>.</p>\n<p>Se o JSON for inválido, responda <code>400</code> com <code>json inválido</code>.</p>",
    dica: "<code>json.NewDecoder(r.Body).Decode(&u)</code> devolve um erro quando o corpo não é JSON válido.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

// Dica: você vai precisar importar "encoding/json".

type Usuario struct {
  Nome  string \`json:"nome"\`
  Idade int    \`json:"idade"\`
}

func cadastrar(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  for _, corpo := range []string{\`{"nome":"Bia","idade":31}\`, \`{nome}\`} {
    rec := httptest.NewRecorder()
    cadastrar(rec, httptest.NewRequest("POST", "/usuarios", strings.NewReader(corpo)))
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

type Usuario struct {
  Nome  string \`json:"nome"\`
  Idade int    \`json:"idade"\`
}

func cadastrar(w http.ResponseWriter, r *http.Request) {
  var u Usuario
  if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
    http.Error(w, "json inválido", http.StatusBadRequest)
    return
  }
  fmt.Fprintf(w, "cadastrado: %s (%d anos)", u.Nome, u.Idade)
}

func main() {
  for _, corpo := range []string{\`{"nome":"Bia","idade":31}\`, \`{nome}\`} {
    rec := httptest.NewRecorder()
    cadastrar(rec, httptest.NewRequest("POST", "/usuarios", strings.NewReader(corpo)))
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    testes: [{ saida: "200 cadastrado: Bia (31 anos)\n400 json inválido" }],
  }),
  problema({
    id: 'web-prob-mux-rotas',
    titulo: "Rotas com ServeMux",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>rotas</code>: devolva um <code>*http.ServeMux</code> com duas rotas:</p>\n<ul><li><code>GET /</code> responde <code>início</code></li><li><code>GET /sobre</code> responde <code>sobre nós</code></li></ul>\n<p>Qualquer outro caminho deve dar <code>404</code> (o <code>ServeMux</code> faz isso sozinho com o padrão <code>/{$}</code>).</p>",
    dica: "No Go 1.22+, <code>mux.HandleFunc(\"GET /{$}\", ...)</code> casa só com a raiz exata.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func rotas() *http.ServeMux {
  // TODO: implemente
  return http.NewServeMux()
}

func main() {
  mux := rotas()
  for _, url := range []string{"/", "/sobre", "/nada"} {
    rec := httptest.NewRecorder()
    mux.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(url, rec.Code)
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func rotas() *http.ServeMux {
  mux := http.NewServeMux()
  mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "início")
  })
  mux.HandleFunc("GET /sobre", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "sobre nós")
  })
  return mux
}

func main() {
  mux := rotas()
  for _, url := range []string{"/", "/sobre", "/nada"} {
    rec := httptest.NewRecorder()
    mux.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(url, rec.Code)
  }
}
`,
    testes: [{ saida: "/ 200\n/sobre 200\n/nada 404" }],
  }),
  problema({
    id: 'web-prob-path-value',
    titulo: "Parâmetro no caminho",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>rotas</code> com a rota <code>GET /livros/{id}</code>, que responde <code>livro ID</code>.</p>\n<p>Use o recurso de padrões do <code>ServeMux</code> do Go 1.22.</p>",
    dica: "Dentro do handler, <code>r.PathValue(\"id\")</code> devolve o pedaço do caminho.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func rotas() *http.ServeMux {
  // TODO: implemente
  return http.NewServeMux()
}

func main() {
  mux := rotas()
  for _, url := range []string{"/livros/42", "/livros/go-101"} {
    rec := httptest.NewRecorder()
    mux.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(rec.Code, rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func rotas() *http.ServeMux {
  mux := http.NewServeMux()
  mux.HandleFunc("GET /livros/{id}", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "livro %s", r.PathValue("id"))
  })
  return mux
}

func main() {
  mux := rotas()
  for _, url := range []string{"/livros/42", "/livros/go-101"} {
    rec := httptest.NewRecorder()
    mux.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(rec.Code, rec.Body.String())
  }
}
`,
    testes: [{ saida: "200 livro 42\n200 livro go-101" }],
  }),
  problema({
    id: 'web-prob-middleware-log',
    titulo: "Middleware de log",
    dificuldade: 'medio',
    enunciado: "<p>Um <b>middleware</b> recebe um handler e devolve outro que faz algo antes/depois.</p>\n<p>Implemente <code>logar</code>: antes de chamar o próximo handler, imprima <code>-&gt; MÉTODO CAMINHO</code>; depois, imprima <code>&lt;- fim</code>.</p>",
    dica: "Devolva <code>http.HandlerFunc(func(w, r) { ...; next.ServeHTTP(w, r); ... })</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func logar(next http.Handler) http.Handler {
  // TODO: implemente
  return next
}

func main() {
  h := logar(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("handler rodou")
  }))
  h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", "/pedidos", nil))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func logar(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("->", r.Method, r.URL.Path)
    next.ServeHTTP(w, r)
    fmt.Println("<- fim")
  })
}

func main() {
  h := logar(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("handler rodou")
  }))
  h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", "/pedidos", nil))
}
`,
    testes: [{ saida: "-> GET /pedidos\nhandler rodou\n<- fim" }],
  }),
  problema({
    id: 'web-prob-middleware-auth',
    titulo: "Middleware de autenticação",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>exigirToken</code>: só deixe passar pedidos com o cabeçalho <code>Authorization: Bearer segredo</code>.</p>\n<p>Sem o token correto, responda <code>401</code> com <code>não autorizado</code> e <b>não</b> chame o próximo handler.</p>",
    dica: "Leia com <code>r.Header.Get(\"Authorization\")</code> e use <code>http.Error</code> com <code>http.StatusUnauthorized</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func exigirToken(next http.Handler) http.Handler {
  // TODO: implemente
  return next
}

func main() {
  h := exigirToken(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "dados secretos")
  }))
  for _, token := range []string{"Bearer segredo", "Bearer errado", ""} {
    req := httptest.NewRequest("GET", "/painel", nil)
    if token != "" {
      req.Header.Set("Authorization", token)
    }
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, req)
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func exigirToken(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.Header.Get("Authorization") != "Bearer segredo" {
      http.Error(w, "não autorizado", http.StatusUnauthorized)
      return
    }
    next.ServeHTTP(w, r)
  })
}

func main() {
  h := exigirToken(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "dados secretos")
  }))
  for _, token := range []string{"Bearer segredo", "Bearer errado", ""} {
    req := httptest.NewRequest("GET", "/painel", nil)
    if token != "" {
      req.Header.Set("Authorization", token)
    }
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, req)
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    testes: [{ saida: "200 dados secretos\n401 não autorizado\n401 não autorizado" }],
  }),
  problema({
    id: 'web-prob-encadear-middlewares',
    titulo: "Encadeando middlewares",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>encadear(h, mws...)</code>: aplique os middlewares de forma que o <b>primeiro</b> da lista seja o mais externo (roda primeiro).</p>\n<p>O <code>main</code> monta <code>encadear(final, marcar(\"A\"), marcar(\"B\"))</code> e a saída deve mostrar A entrando antes de B.</p>",
    dica: "Percorra a lista de trás para frente: <code>for i := len(mws) - 1; i &gt;= 0; i-- { h = mws[i](h) }</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Middleware func(http.Handler) http.Handler

func encadear(h http.Handler, mws ...Middleware) http.Handler {
  // TODO: implemente
  return h
}

func marcar(nome string) Middleware {
  return func(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      fmt.Println("entra", nome)
      next.ServeHTTP(w, r)
      fmt.Println("sai", nome)
    })
  }
}

func main() {
  final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("handler")
  })
  h := encadear(final, marcar("A"), marcar("B"))
  h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", "/", nil))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Middleware func(http.Handler) http.Handler

func encadear(h http.Handler, mws ...Middleware) http.Handler {
  for i := len(mws) - 1; i >= 0; i-- {
    h = mws[i](h)
  }
  return h
}

func marcar(nome string) Middleware {
  return func(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      fmt.Println("entra", nome)
      next.ServeHTTP(w, r)
      fmt.Println("sai", nome)
    })
  }
}

func main() {
  final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("handler")
  })
  h := encadear(final, marcar("A"), marcar("B"))
  h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", "/", nil))
}
`,
    testes: [{ saida: "entra A\nentra B\nhandler\nsai B\nsai A" }],
  }),
  problema({
    id: 'web-prob-url-parse',
    titulo: "Desmontando uma URL",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>partes(endereco)</code>: use <code>net/url</code> para devolver o esquema, o host e o caminho da URL.</p>",
    dica: "<code>u, err := url.Parse(endereco)</code> e depois <code>u.Scheme</code>, <code>u.Host</code>, <code>u.Path</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "net/url".

func partes(endereco string) (string, string, string) {
  // TODO: implemente
  return "", "", ""
}

func main() {
  esquema, host, caminho := partes("https://api.exemplo.com:8443/v1/pedidos?pagina=2")
  fmt.Println(esquema)
  fmt.Println(host)
  fmt.Println(caminho)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/url"
)

func partes(endereco string) (string, string, string) {
  u, err := url.Parse(endereco)
  if err != nil {
    return "", "", ""
  }
  return u.Scheme, u.Host, u.Path
}

func main() {
  esquema, host, caminho := partes("https://api.exemplo.com:8443/v1/pedidos?pagina=2")
  fmt.Println(esquema)
  fmt.Println(host)
  fmt.Println(caminho)
}
`,
    testes: [{ saida: "https\napi.exemplo.com:8443\n/v1/pedidos" }],
  }),
  problema({
    id: 'web-prob-montar-query',
    titulo: "Montando a query string",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>buscaURL(termo, pagina)</code>: devolva <code>/busca?</code> seguido da query com <code>q</code> e <code>pagina</code>, com os caracteres especiais codificados.</p>",
    dica: "Use <code>url.Values{}</code>, <code>v.Set(...)</code> e <code>v.Encode()</code> (que ordena as chaves).",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "net/url" e "strconv".

func buscaURL(termo string, pagina int) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(buscaURL("go web", 1))
  fmt.Println(buscaURL("café & pão", 3))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/url"
  "strconv"
)

func buscaURL(termo string, pagina int) string {
  v := url.Values{}
  v.Set("q", termo)
  v.Set("pagina", strconv.Itoa(pagina))
  return "/busca?" + v.Encode()
}

func main() {
  fmt.Println(buscaURL("go web", 1))
  fmt.Println(buscaURL("café & pão", 3))
}
`,
    testes: [{ saida: "/busca?pagina=1&q=go+web\n/busca?pagina=3&q=caf%C3%A9+%26+p%C3%A3o" }],
  }),
  problema({
    id: 'web-prob-query-int',
    titulo: "Parâmetro numérico com padrão",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>paginaDe(r)</code>: leia o parâmetro <code>pagina</code>. Se faltar, não for número ou for menor que 1, devolva <code>1</code>.</p>",
    dica: "Use <code>strconv.Atoi</code> e trate o erro devolvendo o padrão.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "strconv".

func paginaDe(r *http.Request) int {
  // TODO: implemente
  return 0
}

func main() {
  for _, url := range []string{"/?pagina=3", "/", "/?pagina=abc", "/?pagina=-2"} {
    fmt.Println(url, paginaDe(httptest.NewRequest("GET", url, nil)))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strconv"
)

func paginaDe(r *http.Request) int {
  p, err := strconv.Atoi(r.URL.Query().Get("pagina"))
  if err != nil || p < 1 {
    return 1
  }
  return p
}

func main() {
  for _, url := range []string{"/?pagina=3", "/", "/?pagina=abc", "/?pagina=-2"} {
    fmt.Println(url, paginaDe(httptest.NewRequest("GET", url, nil)))
  }
}
`,
    testes: [{ saida: "/?pagina=3 3\n/ 1\n/?pagina=abc 1\n/?pagina=-2 1" }],
  }),
  problema({
    id: 'web-prob-paginar',
    titulo: "Paginando uma lista",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>paginar(itens, pagina, tamanho)</code>: devolva os itens da página pedida (começando em 1).</p>\n<p>Uma página além do fim devolve uma lista vazia.</p>",
    dica: "Calcule <code>inicio := (pagina-1)*tamanho</code>, limite <code>fim</code> a <code>len(itens)</code> e devolva <code>itens[inicio:fim]</code>.",
    inicial: go`
package main

import "fmt"

func paginar(itens []string, pagina, tamanho int) []string {
  // TODO: implemente
  return nil
}

func main() {
  itens := []string{"a", "b", "c", "d", "e", "f", "g"}
  for p := 1; p <= 4; p++ {
    fmt.Println(p, paginar(itens, p, 3))
  }
}
`,
    solucao: go`
package main

import "fmt"

func paginar(itens []string, pagina, tamanho int) []string {
  inicio := (pagina - 1) * tamanho
  if inicio >= len(itens) {
    return []string{}
  }
  fim := inicio + tamanho
  if fim > len(itens) {
    fim = len(itens)
  }
  return itens[inicio:fim]
}

func main() {
  itens := []string{"a", "b", "c", "d", "e", "f", "g"}
  for p := 1; p <= 4; p++ {
    fmt.Println(p, paginar(itens, p, 3))
  }
}
`,
    testes: [{ saida: "1 [a b c]\n2 [d e f]\n3 [g]\n4 []" }],
  }),
  problema({
    id: 'web-prob-json-lista',
    titulo: "Lista em JSON",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>listar</code>: responda a lista de tarefas em JSON. Uma lista vazia deve virar <code>[]</code>, não <code>null</code>.</p>",
    dica: "Inicialize com <code>[]Tarefa{}</code> em vez de <code>var t []Tarefa</code>: o primeiro vira <code>[]</code>, o segundo <code>null</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "encoding/json".

type Tarefa struct {
  Titulo string \`json:"titulo"\`
  Feita  bool   \`json:"feita"\`
}

var tarefas []Tarefa

func listar(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  listar(rec, httptest.NewRequest("GET", "/tarefas", nil))
  fmt.Print(rec.Body.String())
  tarefas = append(tarefas, Tarefa{"estudar Go", true}, Tarefa{"fazer API", false})
  rec = httptest.NewRecorder()
  listar(rec, httptest.NewRequest("GET", "/tarefas", nil))
  fmt.Print(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Tarefa struct {
  Titulo string \`json:"titulo"\`
  Feita  bool   \`json:"feita"\`
}

var tarefas []Tarefa

func listar(w http.ResponseWriter, r *http.Request) {
  lista := []Tarefa{}
  lista = append(lista, tarefas...)
  json.NewEncoder(w).Encode(lista)
}

func main() {
  rec := httptest.NewRecorder()
  listar(rec, httptest.NewRequest("GET", "/tarefas", nil))
  fmt.Print(rec.Body.String())
  tarefas = append(tarefas, Tarefa{"estudar Go", true}, Tarefa{"fazer API", false})
  rec = httptest.NewRecorder()
  listar(rec, httptest.NewRequest("GET", "/tarefas", nil))
  fmt.Print(rec.Body.String())
}
`,
    testes: [{ saida: "[]\n[{\"titulo\":\"estudar Go\",\"feita\":true},{\"titulo\":\"fazer API\",\"feita\":false}]" }],
  }),
  problema({
    id: 'web-prob-json-omitempty',
    titulo: "Campos opcionais no JSON",
    dificuldade: 'facil',
    enunciado: "<p>Ajuste as tags da struct e implemente <code>paraJSON</code> (que devolve o JSON como string). O campo <code>Apelido</code> só deve aparecer quando não estiver vazio, e <code>Senha</code> nunca deve aparecer.</p>",
    dica: "Use <code>json:\"apelido,omitempty\"</code> e <code>json:\"-\"</code>. Para a string, <code>b, _ := json.Marshal(c)</code> e <code>string(b)</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "encoding/json".

type Conta struct {
  Email   string \`json:"email"\`
  Apelido string \`json:"apelido,omitempty"\`
  Senha   string \`json:"-"\`
}

func paraJSON(c Conta) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(paraJSON(Conta{Email: "ana@ex.com", Apelido: "aninha", Senha: "123"}))
  fmt.Println(paraJSON(Conta{Email: "bob@ex.com", Senha: "abc"}))
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
)

type Conta struct {
  Email   string \`json:"email"\`
  Apelido string \`json:"apelido,omitempty"\`
  Senha   string \`json:"-"\`
}

func paraJSON(c Conta) string {
  b, err := json.Marshal(c)
  if err != nil {
    return ""
  }
  return string(b)
}

func main() {
  fmt.Println(paraJSON(Conta{Email: "ana@ex.com", Apelido: "aninha", Senha: "123"}))
  fmt.Println(paraJSON(Conta{Email: "bob@ex.com", Senha: "abc"}))
}
`,
    testes: [{ saida: "{\"email\":\"ana@ex.com\",\"apelido\":\"aninha\"}\n{\"email\":\"bob@ex.com\"}" }],
  }),
  problema({
    id: 'web-prob-json-map',
    titulo: "JSON a partir de map",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>resumo(total, ok)</code>: devolva o JSON <code>{\"ok\":..., \"total\":...}</code> usando um <code>map[string]any</code>.</p>",
    dica: "<code>json.Marshal</code> ordena as chaves de um map em ordem alfabética.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "encoding/json".

func resumo(total int, ok bool) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(resumo(3, true))
  fmt.Println(resumo(0, false))
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
)

func resumo(total int, ok bool) string {
  b, _ := json.Marshal(map[string]any{"total": total, "ok": ok})
  return string(b)
}

func main() {
  fmt.Println(resumo(3, true))
  fmt.Println(resumo(0, false))
}
`,
    testes: [{ saida: "{\"ok\":true,\"total\":3}\n{\"ok\":false,\"total\":0}" }],
  }),
  problema({
    id: 'web-prob-erro-json',
    titulo: "Erros padronizados em JSON",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>erroJSON(w, status, msg)</code>: responda o status e o corpo <code>{\"erro\":\"MSG\"}</code> com <code>Content-Type: application/json</code>.</p>",
    dica: "Ordem: <code>Header().Set</code>, depois <code>WriteHeader</code>, depois <code>json.NewEncoder(w).Encode(...)</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "encoding/json".

func erroJSON(w http.ResponseWriter, status int, msg string) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  erroJSON(rec, http.StatusNotFound, "pedido não encontrado")
  fmt.Println(rec.Code, rec.Header().Get("Content-Type"))
  fmt.Print(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
)

func erroJSON(w http.ResponseWriter, status int, msg string) {
  w.Header().Set("Content-Type", "application/json")
  w.WriteHeader(status)
  json.NewEncoder(w).Encode(map[string]string{"erro": msg})
}

func main() {
  rec := httptest.NewRecorder()
  erroJSON(rec, http.StatusNotFound, "pedido não encontrado")
  fmt.Println(rec.Code, rec.Header().Get("Content-Type"))
  fmt.Print(rec.Body.String())
}
`,
    testes: [{ saida: "404 application/json\n{\"erro\":\"pedido não encontrado\"}" }],
  }),
  problema({
    id: 'web-prob-validar-cadastro',
    titulo: "Validando o cadastro",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>validar(c)</code>: devolva a lista de problemas do cadastro, nesta ordem:</p>\n<ul><li><code>nome obrigatório</code> se o nome estiver vazio;</li><li><code>email inválido</code> se o email não tiver <code>@</code>;</li><li><code>idade mínima 18</code> se a idade for menor que 18.</li></ul>",
    dica: "Comece com <code>erros := []string{}</code> e vá dando <code>append</code>. <code>strings.Contains</code> ajuda no email.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

type Cadastro struct {
  Nome  string
  Email string
  Idade int
}

func validar(c Cadastro) []string {
  // TODO: implemente
  return nil
}

func main() {
  fmt.Println(validar(Cadastro{"Ana", "ana@ex.com", 30}))
  fmt.Println(validar(Cadastro{"", "bob.ex.com", 16}))
  fmt.Println(validar(Cadastro{"Caio", "caio@", 17}))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

type Cadastro struct {
  Nome  string
  Email string
  Idade int
}

func validar(c Cadastro) []string {
  erros := []string{}
  if strings.TrimSpace(c.Nome) == "" {
    erros = append(erros, "nome obrigatório")
  }
  if !strings.Contains(c.Email, "@") {
    erros = append(erros, "email inválido")
  }
  if c.Idade < 18 {
    erros = append(erros, "idade mínima 18")
  }
  return erros
}

func main() {
  fmt.Println(validar(Cadastro{"Ana", "ana@ex.com", 30}))
  fmt.Println(validar(Cadastro{"", "bob.ex.com", 16}))
  fmt.Println(validar(Cadastro{"Caio", "caio@", 17}))
}
`,
    testes: [{ saida: "[]\n[nome obrigatório email inválido idade mínima 18]\n[idade mínima 18]" }],
  }),
  problema({
    id: 'web-prob-form-post',
    titulo: "Formulário HTML (POST)",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>contato</code>: leia os campos <code>nome</code> e <code>mensagem</code> de um formulário enviado por POST e responda <code>NOME disse: MENSAGEM</code>.</p>",
    dica: "<code>r.FormValue(\"nome\")</code> já chama <code>ParseForm</code> e lê o corpo <code>application/x-www-form-urlencoded</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func contato(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  corpo := strings.NewReader("nome=Lia&mensagem=Adorei+o+curso")
  req := httptest.NewRequest("POST", "/contato", corpo)
  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
  rec := httptest.NewRecorder()
  contato(rec, req)
  fmt.Println(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func contato(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "%s disse: %s", r.FormValue("nome"), r.FormValue("mensagem"))
}

func main() {
  corpo := strings.NewReader("nome=Lia&mensagem=Adorei+o+curso")
  req := httptest.NewRequest("POST", "/contato", corpo)
  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
  rec := httptest.NewRecorder()
  contato(rec, req)
  fmt.Println(rec.Body.String())
}
`,
    testes: [{ saida: "Lia disse: Adorei o curso" }],
  }),
  problema({
    id: 'web-prob-template-html',
    titulo: "Template HTML seguro",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>renderizar(nome)</code>: use <code>html/template</code> para gerar <code>&lt;p&gt;Olá, NOME&lt;/p&gt;</code>.</p>\n<p>O pacote escapa o HTML sozinho, protegendo contra XSS: veja o que acontece com o segundo nome.</p>",
    dica: "<code>template.Must(template.New(\"t\").Parse(\"&lt;p&gt;Olá, {{.}}&lt;/p&gt;\"))</code> e <code>t.Execute(&amp;buf, nome)</code> com um <code>strings.Builder</code>.",
    inicial: go`
package main

import (
  "fmt"
  "html/template"
)

// Dica: você vai precisar importar "strings".

var tpl = template.Must(template.New("t").Parse("<p>Olá, {{.}}</p>"))

func renderizar(nome string) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(renderizar("Ana"))
  fmt.Println(renderizar("<script>alert(1)</script>"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "html/template"
  "strings"
)

var tpl = template.Must(template.New("t").Parse("<p>Olá, {{.}}</p>"))

func renderizar(nome string) string {
  var b strings.Builder
  tpl.Execute(&b, nome)
  return b.String()
}

func main() {
  fmt.Println(renderizar("Ana"))
  fmt.Println(renderizar("<script>alert(1)</script>"))
}
`,
    testes: [{ saida: "<p>Olá, Ana</p>\n<p>Olá, &lt;script&gt;alert(1)&lt;/script&gt;</p>" }],
  }),
  problema({
    id: 'web-prob-template-lista',
    titulo: "Template com range",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>menu(itens)</code>: gere uma lista <code>&lt;ul&gt;</code> com um <code>&lt;li&gt;</code> por item, sem espaços entre as tags.</p>",
    dica: "O template <code>&lt;ul&gt;{{range .}}&lt;li&gt;{{.}}&lt;/li&gt;{{end}}&lt;/ul&gt;</code> repete o miolo para cada item.",
    inicial: go`
package main

import (
  "fmt"
  "html/template"
)

// Dica: você vai precisar importar "strings".

var tplMenu = template.Must(template.New("menu").Parse("<ul>{{range .}}<li>{{.}}</li>{{end}}</ul>"))

func menu(itens []string) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(menu([]string{"Início", "Cursos", "Contato"}))
  fmt.Println(menu(nil))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "html/template"
  "strings"
)

var tplMenu = template.Must(template.New("menu").Parse("<ul>{{range .}}<li>{{.}}</li>{{end}}</ul>"))

func menu(itens []string) string {
  var b strings.Builder
  tplMenu.Execute(&b, itens)
  return b.String()
}

func main() {
  fmt.Println(menu([]string{"Início", "Cursos", "Contato"}))
  fmt.Println(menu(nil))
}
`,
    testes: [{ saida: "<ul><li>Início</li><li>Cursos</li><li>Contato</li></ul>\n<ul></ul>" }],
  }),
  problema({
    id: 'web-prob-cookie-definir',
    titulo: "Definindo um cookie",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>entrar</code>: defina um cookie <code>sessao=abc123</code> com <code>Path=/</code> e <code>HttpOnly</code>, e responda <code>bem-vindo</code>.</p>",
    dica: "<code>http.SetCookie(w, &amp;http.Cookie{Name: ..., Value: ..., Path: \"/\", HttpOnly: true})</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func entrar(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  entrar(rec, httptest.NewRequest("POST", "/login", nil))
  fmt.Println(rec.Header().Get("Set-Cookie"))
  fmt.Println(rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func entrar(w http.ResponseWriter, r *http.Request) {
  http.SetCookie(w, &http.Cookie{Name: "sessao", Value: "abc123", Path: "/", HttpOnly: true})
  fmt.Fprint(w, "bem-vindo")
}

func main() {
  rec := httptest.NewRecorder()
  entrar(rec, httptest.NewRequest("POST", "/login", nil))
  fmt.Println(rec.Header().Get("Set-Cookie"))
  fmt.Println(rec.Body.String())
}
`,
    testes: [{ saida: "sessao=abc123; Path=/; HttpOnly\nbem-vindo" }],
  }),
  problema({
    id: 'web-prob-cookie-ler',
    titulo: "Lendo um cookie",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>painel</code>: se houver o cookie <code>sessao</code>, responda <code>sessão: VALOR</code>; senão, responda <code>401</code> com <code>faça login</code>.</p>",
    dica: "<code>c, err := r.Cookie(\"sessao\")</code> devolve <code>http.ErrNoCookie</code> quando ele não existe.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func painel(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  com := httptest.NewRequest("GET", "/painel", nil)
  com.AddCookie(&http.Cookie{Name: "sessao", Value: "xyz"})
  for _, req := range []*http.Request{com, httptest.NewRequest("GET", "/painel", nil)} {
    rec := httptest.NewRecorder()
    painel(rec, req)
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func painel(w http.ResponseWriter, r *http.Request) {
  c, err := r.Cookie("sessao")
  if err != nil {
    http.Error(w, "faça login", http.StatusUnauthorized)
    return
  }
  fmt.Fprintf(w, "sessão: %s", c.Value)
}

func main() {
  com := httptest.NewRequest("GET", "/painel", nil)
  com.AddCookie(&http.Cookie{Name: "sessao", Value: "xyz"})
  for _, req := range []*http.Request{com, httptest.NewRequest("GET", "/painel", nil)} {
    rec := httptest.NewRecorder()
    painel(rec, req)
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    testes: [{ saida: "200 sessão: xyz\n401 faça login" }],
  }),
  problema({
    id: 'web-prob-redirect',
    titulo: "Redirecionamento",
    dificuldade: 'facil',
    enunciado: "<p>A página <code>/antigo</code> mudou de endereço. Implemente <code>antigo</code> para redirecionar permanentemente (<code>301</code>) para <code>/novo</code>.</p>",
    dica: "<code>http.Redirect(w, r, \"/novo\", http.StatusMovedPermanently)</code> define o status e o cabeçalho <code>Location</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func antigo(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  antigo(rec, httptest.NewRequest("GET", "/antigo", nil))
  fmt.Println(rec.Code, rec.Header().Get("Location"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func antigo(w http.ResponseWriter, r *http.Request) {
  http.Redirect(w, r, "/novo", http.StatusMovedPermanently)
}

func main() {
  rec := httptest.NewRecorder()
  antigo(rec, httptest.NewRequest("GET", "/antigo", nil))
  fmt.Println(rec.Code, rec.Header().Get("Location"))
}
`,
    testes: [{ saida: "301 /novo" }],
  }),
  problema({
    id: 'web-prob-cors',
    titulo: "Cabeçalhos CORS",
    dificuldade: 'medio',
    enunciado: "<p>Implemente o middleware <code>cors</code>: em toda resposta, defina <code>Access-Control-Allow-Origin: https://app.exemplo.com</code>.</p>\n<p>Para o método <code>OPTIONS</code> (pré-requisição), defina também <code>Access-Control-Allow-Methods: GET, POST</code>, responda <code>204</code> e não chame o próximo handler.</p>",
    dica: "Defina os cabeçalhos antes de <code>WriteHeader</code>. Use <code>http.StatusNoContent</code> e <code>return</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func cors(next http.Handler) http.Handler {
  // TODO: implemente
  return next
}

func main() {
  h := cors(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "dados")
  }))
  for _, m := range []string{"OPTIONS", "GET"} {
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, httptest.NewRequest(m, "/api", nil))
    fmt.Println(m, rec.Code, rec.Header().Get("Access-Control-Allow-Origin"), rec.Header().Get("Access-Control-Allow-Methods"), rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func cors(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "https://app.exemplo.com")
    if r.Method == http.MethodOptions {
      w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
      w.WriteHeader(http.StatusNoContent)
      return
    }
    next.ServeHTTP(w, r)
  })
}

func main() {
  h := cors(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "dados")
  }))
  for _, m := range []string{"OPTIONS", "GET"} {
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, httptest.NewRequest(m, "/api", nil))
    fmt.Println(m, rec.Code, rec.Header().Get("Access-Control-Allow-Origin"), rec.Header().Get("Access-Control-Allow-Methods"), rec.Body.String())
  }
}
`,
    testes: [{ saida: "OPTIONS 204 https://app.exemplo.com GET, POST\nGET 200 https://app.exemplo.com  dados" }],
  }),
  problema({
    id: 'web-prob-health',
    titulo: "Endpoint de health check",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>saude</code>: responda o JSON <code>{\"status\":\"ok\",\"versao\":\"1.4.0\"}</code>.</p>",
    dica: "Uma struct com tags <code>json:\"status\"</code> e <code>json:\"versao\"</code> mantém a ordem dos campos.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "encoding/json".

type Saude struct {
  Status string \`json:"status"\`
  Versao string \`json:"versao"\`
}

func saude(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rec := httptest.NewRecorder()
  saude(rec, httptest.NewRequest("GET", "/saude", nil))
  fmt.Print(rec.Code, " ", rec.Body.String())
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Saude struct {
  Status string \`json:"status"\`
  Versao string \`json:"versao"\`
}

func saude(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(Saude{Status: "ok", Versao: "1.4.0"})
}

func main() {
  rec := httptest.NewRecorder()
  saude(rec, httptest.NewRequest("GET", "/saude", nil))
  fmt.Print(rec.Code, " ", rec.Body.String())
}
`,
    testes: [{ saida: "200 {\"status\":\"ok\",\"versao\":\"1.4.0\"}" }],
  }),
  problema({
    id: 'web-prob-crud-memoria',
    titulo: "CRUD em memória",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>ServeHTTP</code> da <code>Loja</code>, um recurso REST em <code>/itens</code>:</p>\n<ul><li><code>GET</code>: responde os nomes separados por vírgula;</li>\n<li><code>POST</code>: adiciona o corpo como nome e responde <code>201</code>;</li>\n<li><code>DELETE</code>: remove o último item e responde <code>204</code> (ou <code>404</code> se estiver vazia).</li></ul>",
    dica: "Um <code>switch r.Method</code> organiza bem. Para ler o corpo: <code>b, _ := io.ReadAll(r.Body)</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

// Dica: você vai precisar importar "io".

type Loja struct {
  itens []string
}

func (l *Loja) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  loja := &Loja{}
  passos := []struct{ metodo, corpo string }{
    {"POST", "caneta"}, {"POST", "caderno"}, {"GET", ""}, {"DELETE", ""}, {"GET", ""}, {"DELETE", ""}, {"DELETE", ""},
  }
  for _, p := range passos {
    rec := httptest.NewRecorder()
    loja.ServeHTTP(rec, httptest.NewRequest(p.metodo, "/itens", strings.NewReader(p.corpo)))
    fmt.Println(p.metodo, rec.Code, rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "io"
  "net/http"
  "net/http/httptest"
  "strings"
)

type Loja struct {
  itens []string
}

func (l *Loja) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  switch r.Method {
  case http.MethodGet:
    fmt.Fprint(w, strings.Join(l.itens, ","))
  case http.MethodPost:
    b, _ := io.ReadAll(r.Body)
    l.itens = append(l.itens, string(b))
    w.WriteHeader(http.StatusCreated)
  case http.MethodDelete:
    if len(l.itens) == 0 {
      w.WriteHeader(http.StatusNotFound)
      return
    }
    l.itens = l.itens[:len(l.itens)-1]
    w.WriteHeader(http.StatusNoContent)
  default:
    w.WriteHeader(http.StatusMethodNotAllowed)
  }
}

func main() {
  loja := &Loja{}
  passos := []struct{ metodo, corpo string }{
    {"POST", "caneta"}, {"POST", "caderno"}, {"GET", ""}, {"DELETE", ""}, {"GET", ""}, {"DELETE", ""}, {"DELETE", ""},
  }
  for _, p := range passos {
    rec := httptest.NewRecorder()
    loja.ServeHTTP(rec, httptest.NewRequest(p.metodo, "/itens", strings.NewReader(p.corpo)))
    fmt.Println(p.metodo, rec.Code, rec.Body.String())
  }
}
`,
    testes: [{ saida: "POST 201\nPOST 201\nGET 200 caneta,caderno\nDELETE 204\nGET 200 caneta\nDELETE 204\nDELETE 404" }],
  }),
  problema({
    id: 'web-prob-request-id',
    titulo: "Request ID no contexto",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente o middleware <code>comID</code>: guarde no <b>contexto</b> do pedido o valor do cabeçalho <code>X-Request-ID</code> (ou <code>sem-id</code> se faltar).</p>\n<p>Implemente também <code>idDe(r)</code>, que lê esse valor do contexto.</p>",
    dica: "<code>ctx := context.WithValue(r.Context(), chaveID, id)</code> e <code>next.ServeHTTP(w, r.WithContext(ctx))</code>. Para ler: <code>r.Context().Value(chaveID).(string)</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "context".

type chave string

const chaveID chave = "request-id"

func comID(next http.Handler) http.Handler {
  // TODO: implemente
  return next
}

func idDe(r *http.Request) string {
  // TODO: implemente
  return ""
}

func main() {
  h := comID(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("pedido", idDe(r))
  }))
  req := httptest.NewRequest("GET", "/", nil)
  req.Header.Set("X-Request-ID", "req-777")
  h.ServeHTTP(httptest.NewRecorder(), req)
  h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", "/", nil))
}
`,
    solucao: go`
package main

import (
  "context"
  "fmt"
  "net/http"
  "net/http/httptest"
)

type chave string

const chaveID chave = "request-id"

func comID(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    id := r.Header.Get("X-Request-ID")
    if id == "" {
      id = "sem-id"
    }
    next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), chaveID, id)))
  })
}

func idDe(r *http.Request) string {
  id, _ := r.Context().Value(chaveID).(string)
  return id
}

func main() {
  h := comID(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("pedido", idDe(r))
  }))
  req := httptest.NewRequest("GET", "/", nil)
  req.Header.Set("X-Request-ID", "req-777")
  h.ServeHTTP(httptest.NewRecorder(), req)
  h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", "/", nil))
}
`,
    testes: [{ saida: "pedido req-777\npedido sem-id" }],
  }),
  problema({
    id: 'web-prob-basic-auth',
    titulo: "Autenticação básica",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>admin</code>: aceite só o usuário <code>admin</code> com a senha <code>s3nh4</code> (HTTP Basic Auth), respondendo <code>área admin</code>.</p>\n<p>Caso contrário, responda <code>401</code> com o cabeçalho <code>WWW-Authenticate: Basic realm=\"admin\"</code>.</p>",
    dica: "<code>usuario, senha, ok := r.BasicAuth()</code> decodifica o cabeçalho <code>Authorization</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func admin(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  certo := httptest.NewRequest("GET", "/admin", nil)
  certo.SetBasicAuth("admin", "s3nh4")
  errado := httptest.NewRequest("GET", "/admin", nil)
  errado.SetBasicAuth("admin", "1234")
  for _, req := range []*http.Request{certo, errado} {
    rec := httptest.NewRecorder()
    admin(rec, req)
    fmt.Println(rec.Code, rec.Header().Get("WWW-Authenticate"), rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func admin(w http.ResponseWriter, r *http.Request) {
  usuario, senha, ok := r.BasicAuth()
  if !ok || usuario != "admin" || senha != "s3nh4" {
    w.Header().Set("WWW-Authenticate", \`Basic realm="admin"\`)
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  fmt.Fprint(w, "área admin")
}

func main() {
  certo := httptest.NewRequest("GET", "/admin", nil)
  certo.SetBasicAuth("admin", "s3nh4")
  errado := httptest.NewRequest("GET", "/admin", nil)
  errado.SetBasicAuth("admin", "1234")
  for _, req := range []*http.Request{certo, errado} {
    rec := httptest.NewRecorder()
    admin(rec, req)
    fmt.Println(rec.Code, rec.Header().Get("WWW-Authenticate"), rec.Body.String())
  }
}
`,
    testes: [{ saida: "200  área admin\n401 Basic realm=\"admin\"" }],
  }),
  problema({
    id: 'web-prob-recover',
    titulo: "Middleware que recupera panic",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>recuperar</code>: se o próximo handler der <code>panic</code>, o servidor não pode cair. Responda <code>500</code> com <code>erro interno</code> e imprima <code>recuperado: MOTIVO</code>.</p>",
    dica: "Use <code>defer func() { if p := recover(); p != nil { ... } }()</code> antes de chamar <code>next.ServeHTTP</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func recuperar(next http.Handler) http.Handler {
  // TODO: implemente
  return next
}

func main() {
  h := recuperar(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/quebra" {
      panic("divisão por zero")
    }
    fmt.Fprint(w, "tudo certo")
  }))
  for _, url := range []string{"/", "/quebra"} {
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(url, rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func recuperar(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    defer func() {
      if p := recover(); p != nil {
        fmt.Println("recuperado:", p)
        http.Error(w, "erro interno", http.StatusInternalServerError)
      }
    }()
    next.ServeHTTP(w, r)
  })
}

func main() {
  h := recuperar(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/quebra" {
      panic("divisão por zero")
    }
    fmt.Fprint(w, "tudo certo")
  }))
  for _, url := range []string{"/", "/quebra"} {
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(url, rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    testes: [{ saida: "/ 200 tudo certo\nrecuperado: divisão por zero\n/quebra 500 erro interno" }],
  }),
  problema({
    id: 'web-prob-status-recorder',
    titulo: "Registrando o status da resposta",
    dificuldade: 'dificil',
    enunciado: "<p>Para registrar o status de cada resposta, embrulhamos o <code>ResponseWriter</code>.</p>\n<p>Implemente <code>WriteHeader</code> do <code>gravador</code> (guarde o código e repasse) e o middleware <code>medir</code>, que imprime <code>CAMINHO -&gt; STATUS</code> depois do handler. Se o handler não chamar <code>WriteHeader</code>, o status é 200.</p>",
    dica: "Em <code>medir</code>: <code>g := &amp;gravador{ResponseWriter: w, status: 200}</code>, chame <code>next.ServeHTTP(g, r)</code> e imprima <code>g.status</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type gravador struct {
  http.ResponseWriter
  status int
}

func (g *gravador) WriteHeader(codigo int) {
  // TODO: implemente
}

func medir(next http.Handler) http.Handler {
  // TODO: implemente
  return next
}

func main() {
  h := medir(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/sumiu" {
      w.WriteHeader(http.StatusNotFound)
      return
    }
    fmt.Fprint(w, "ok")
  }))
  for _, url := range []string{"/", "/sumiu"} {
    h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", url, nil))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type gravador struct {
  http.ResponseWriter
  status int
}

func (g *gravador) WriteHeader(codigo int) {
  g.status = codigo
  g.ResponseWriter.WriteHeader(codigo)
}

func medir(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    g := &gravador{ResponseWriter: w, status: http.StatusOK}
    next.ServeHTTP(g, r)
    fmt.Println(r.URL.Path, "->", g.status)
  })
}

func main() {
  h := medir(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/sumiu" {
      w.WriteHeader(http.StatusNotFound)
      return
    }
    fmt.Fprint(w, "ok")
  }))
  for _, url := range []string{"/", "/sumiu"} {
    h.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", url, nil))
  }
}
`,
    testes: [{ saida: "/ -> 200\n/sumiu -> 404" }],
  }),
  problema({
    id: 'web-prob-etag',
    titulo: "Cache com ETag",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>pagina</code>: responda o conteúdo com o cabeçalho <code>ETag: \"v3\"</code>.</p>\n<p>Se o pedido trouxer <code>If-None-Match: \"v3\"</code>, responda <code>304 Not Modified</code> sem corpo.</p>",
    dica: "Compare <code>r.Header.Get(\"If-None-Match\")</code> com o ETag e use <code>http.StatusNotModified</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

const etag = \`"v3"\`

func pagina(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  primeira := httptest.NewRequest("GET", "/", nil)
  segunda := httptest.NewRequest("GET", "/", nil)
  segunda.Header.Set("If-None-Match", \`"v3"\`)
  for _, req := range []*http.Request{primeira, segunda} {
    rec := httptest.NewRecorder()
    pagina(rec, req)
    fmt.Printf("%d %s %q\\n", rec.Code, rec.Header().Get("ETag"), rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

const etag = \`"v3"\`

func pagina(w http.ResponseWriter, r *http.Request) {
  w.Header().Set("ETag", etag)
  if r.Header.Get("If-None-Match") == etag {
    w.WriteHeader(http.StatusNotModified)
    return
  }
  fmt.Fprint(w, "conteúdo da página")
}

func main() {
  primeira := httptest.NewRequest("GET", "/", nil)
  segunda := httptest.NewRequest("GET", "/", nil)
  segunda.Header.Set("If-None-Match", \`"v3"\`)
  for _, req := range []*http.Request{primeira, segunda} {
    rec := httptest.NewRecorder()
    pagina(rec, req)
    fmt.Printf("%d %s %q\\n", rec.Code, rec.Header().Get("ETag"), rec.Body.String())
  }
}
`,
    testes: [{ saida: "200 \"v3\" \"conteúdo da página\"\n304 \"v3\" \"\"" }],
  }),
  problema({
    id: 'web-prob-cliente-servidor',
    titulo: "Cliente HTTP contra servidor de teste",
    dificuldade: 'medio',
    enunciado: "<p>O <code>httptest.NewServer</code> sobe um servidor de verdade na máquina, só para testes.</p>\n<p>Implemente <code>buscar(url)</code>: faça um <code>GET</code> com <code>http.Get</code> e devolva o status e o corpo.</p>",
    dica: "Depois do <code>http.Get</code>, lembre do <code>defer resp.Body.Close()</code> e leia com <code>io.ReadAll(resp.Body)</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "io".

func buscar(url string) (int, string) {
  // TODO: implemente
  return 0, ""
}

func main() {
  srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "pong")
  }))
  defer srv.Close()
  status, corpo := buscar(srv.URL + "/ping")
  fmt.Println(status, corpo)
}
`,
    solucao: go`
package main

import (
  "fmt"
  "io"
  "net/http"
  "net/http/httptest"
)

func buscar(url string) (int, string) {
  resp, err := http.Get(url)
  if err != nil {
    return 0, err.Error()
  }
  defer resp.Body.Close()
  corpo, _ := io.ReadAll(resp.Body)
  return resp.StatusCode, string(corpo)
}

func main() {
  srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "pong")
  }))
  defer srv.Close()
  status, corpo := buscar(srv.URL + "/ping")
  fmt.Println(status, corpo)
}
`,
    testes: [{ saida: "200 pong" }],
  }),
  problema({
    id: 'web-prob-cliente-json',
    titulo: "Consumindo uma API JSON",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>clima(base, cidade)</code>: faça <code>GET base/clima?cidade=CIDADE</code>, decodifique o JSON e devolva <code>CIDADE: TEMP°C</code>.</p>",
    dica: "Monte a URL com <code>url.QueryEscape</code>, decodifique com <code>json.NewDecoder(resp.Body).Decode(&amp;c)</code>.",
    inicial: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "net/url".

type Clima struct {
  Cidade string  \`json:"cidade"\`
  Temp   float64 \`json:"temp"\`
}

func clima(base, cidade string) string {
  // TODO: implemente
  return ""
}

func main() {
  temps := map[string]float64{"Recife": 29.5, "São Paulo": 21}
  srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    c := r.URL.Query().Get("cidade")
    json.NewEncoder(w).Encode(Clima{Cidade: c, Temp: temps[c]})
  }))
  defer srv.Close()
  fmt.Println(clima(srv.URL, "Recife"))
  fmt.Println(clima(srv.URL, "São Paulo"))
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "net/http"
  "net/http/httptest"
  "net/url"
)

type Clima struct {
  Cidade string  \`json:"cidade"\`
  Temp   float64 \`json:"temp"\`
}

func clima(base, cidade string) string {
  resp, err := http.Get(base + "/clima?cidade=" + url.QueryEscape(cidade))
  if err != nil {
    return "erro"
  }
  defer resp.Body.Close()
  var c Clima
  if err := json.NewDecoder(resp.Body).Decode(&c); err != nil {
    return "erro"
  }
  return fmt.Sprintf("%s: %.1f°C", c.Cidade, c.Temp)
}

func main() {
  temps := map[string]float64{"Recife": 29.5, "São Paulo": 21}
  srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    c := r.URL.Query().Get("cidade")
    json.NewEncoder(w).Encode(Clima{Cidade: c, Temp: temps[c]})
  }))
  defer srv.Close()
  fmt.Println(clima(srv.URL, "Recife"))
  fmt.Println(clima(srv.URL, "São Paulo"))
}
`,
    testes: [{ saida: "Recife: 29.5°C\nSão Paulo: 21.0°C" }],
  }),
  problema({
    id: 'web-prob-json-estrito',
    titulo: "JSON sem campos desconhecidos",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>decodificar(corpo)</code>: leia um <code>Pedido</code> do JSON, mas <b>rejeite</b> campos que a struct não conhece. Devolva <code>ok: PRODUTO xQTD</code> ou <code>rejeitado</code>.</p>",
    dica: "Crie o decoder e chame <code>dec.DisallowUnknownFields()</code> antes do <code>Decode</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "encoding/json" e "strings".

type Pedido struct {
  Produto string \`json:"produto"\`
  Qtd     int    \`json:"qtd"\`
}

func decodificar(corpo string) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(decodificar(\`{"produto":"café","qtd":2}\`))
  fmt.Println(decodificar(\`{"produto":"café","qtd":2,"admin":true}\`))
}
`,
    solucao: go`
package main

import (
  "encoding/json"
  "fmt"
  "strings"
)

type Pedido struct {
  Produto string \`json:"produto"\`
  Qtd     int    \`json:"qtd"\`
}

func decodificar(corpo string) string {
  dec := json.NewDecoder(strings.NewReader(corpo))
  dec.DisallowUnknownFields()
  var p Pedido
  if err := dec.Decode(&p); err != nil {
    return "rejeitado"
  }
  return fmt.Sprintf("ok: %s x%d", p.Produto, p.Qtd)
}

func main() {
  fmt.Println(decodificar(\`{"produto":"café","qtd":2}\`))
  fmt.Println(decodificar(\`{"produto":"café","qtd":2,"admin":true}\`))
}
`,
    testes: [{ saida: "ok: café x2\nrejeitado" }],
  }),
  problema({
    id: 'web-prob-limite-corpo',
    titulo: "Limitando o tamanho do corpo",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>upload</code>: aceite no máximo <b>10 bytes</b> no corpo. Se couber, responda <code>recebido N bytes</code>; se passar, responda <code>413</code> com <code>muito grande</code>.</p>",
    dica: "<code>r.Body = http.MaxBytesReader(w, r.Body, 10)</code> faz o <code>io.ReadAll</code> falhar quando o limite estoura.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

// Dica: você vai precisar importar "io".

func upload(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  for _, corpo := range []string{"pequeno", "um arquivo bem maior"} {
    rec := httptest.NewRecorder()
    upload(rec, httptest.NewRequest("POST", "/upload", strings.NewReader(corpo)))
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "io"
  "net/http"
  "net/http/httptest"
  "strings"
)

func upload(w http.ResponseWriter, r *http.Request) {
  r.Body = http.MaxBytesReader(w, r.Body, 10)
  dados, err := io.ReadAll(r.Body)
  if err != nil {
    http.Error(w, "muito grande", http.StatusRequestEntityTooLarge)
    return
  }
  fmt.Fprintf(w, "recebido %d bytes", len(dados))
}

func main() {
  for _, corpo := range []string{"pequeno", "um arquivo bem maior"} {
    rec := httptest.NewRecorder()
    upload(rec, httptest.NewRequest("POST", "/upload", strings.NewReader(corpo)))
    fmt.Println(rec.Code, strings.TrimSpace(rec.Body.String()))
  }
}
`,
    testes: [{ saida: "200 recebido 7 bytes\n413 muito grande" }],
  }),
  problema({
    id: 'web-prob-query-multipla',
    titulo: "Parâmetro repetido na URL",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>tags(r)</code>: devolva todos os valores do parâmetro <code>tag</code> (ex.: <code>?tag=go&amp;tag=web</code>), juntos com <code>+</code>.</p>",
    dica: "<code>r.URL.Query()[\"tag\"]</code> devolve um <code>[]string</code> com todos os valores.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "strings".

func tags(r *http.Request) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(tags(httptest.NewRequest("GET", "/posts?tag=go&tag=web&tag=api", nil)))
  fmt.Printf("%q\\n", tags(httptest.NewRequest("GET", "/posts", nil)))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func tags(r *http.Request) string {
  return strings.Join(r.URL.Query()["tag"], "+")
}

func main() {
  fmt.Println(tags(httptest.NewRequest("GET", "/posts?tag=go&tag=web&tag=api", nil)))
  fmt.Printf("%q\\n", tags(httptest.NewRequest("GET", "/posts", nil)))
}
`,
    testes: [{ saida: "go+web+api\n\"\"" }],
  }),
  problema({
    id: 'web-prob-slug',
    titulo: "Gerando slugs para URLs",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>slug(titulo)</code>: deixe em minúsculas, troque cada sequência de caracteres que não sejam letras ASCII ou dígitos por um único <code>-</code> e tire os <code>-</code> das pontas.</p>",
    dica: "Percorra as runas: letra/dígito ASCII entra; qualquer outra coisa vira <code>-</code> se o último caractere ainda não for <code>-</code>. No fim, <code>strings.Trim(s, \"-\")</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

func slug(titulo string) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(slug("Aprenda Go em 30 dias!"))
  fmt.Println(slug("  APIs REST -- com Go  "))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func slug(titulo string) string {
  var b strings.Builder
  for _, r := range strings.ToLower(titulo) {
    if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
      b.WriteRune(r)
    } else if !strings.HasSuffix(b.String(), "-") {
      b.WriteRune('-')
    }
  }
  return strings.Trim(b.String(), "-")
}

func main() {
  fmt.Println(slug("Aprenda Go em 30 dias!"))
  fmt.Println(slug("  APIs REST -- com Go  "))
}
`,
    testes: [{ saida: "aprenda-go-em-30-dias\napis-rest-com-go" }],
  }),
  problema({
    id: 'web-prob-rate-limit',
    titulo: "Limite de pedidos por cliente",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>Permitir(ip)</code>: cada IP pode fazer no máximo <code>limite</code> pedidos; depois disso, devolva <code>false</code>.</p>\n<p>O <code>main</code> usa o limitador num handler que responde <code>429</code> quando o limite estoura.</p>",
    dica: "Guarde a contagem num <code>map[string]int</code>: incremente e compare com <code>l.limite</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Limitador struct {
  limite int
  contas map[string]int
}

func (l *Limitador) Permitir(ip string) bool {
  // TODO: implemente
  return false
}

func main() {
  lim := &Limitador{limite: 2, contas: map[string]int{}}
  h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if !lim.Permitir(r.RemoteAddr) {
      w.WriteHeader(http.StatusTooManyRequests)
      return
    }
    fmt.Fprint(w, "ok")
  })
  for _, ip := range []string{"1.1.1.1", "1.1.1.1", "2.2.2.2", "1.1.1.1"} {
    req := httptest.NewRequest("GET", "/", nil)
    req.RemoteAddr = ip
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, req)
    fmt.Println(ip, rec.Code)
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Limitador struct {
  limite int
  contas map[string]int
}

func (l *Limitador) Permitir(ip string) bool {
  l.contas[ip]++
  return l.contas[ip] <= l.limite
}

func main() {
  lim := &Limitador{limite: 2, contas: map[string]int{}}
  h := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    if !lim.Permitir(r.RemoteAddr) {
      w.WriteHeader(http.StatusTooManyRequests)
      return
    }
    fmt.Fprint(w, "ok")
  })
  for _, ip := range []string{"1.1.1.1", "1.1.1.1", "2.2.2.2", "1.1.1.1"} {
    req := httptest.NewRequest("GET", "/", nil)
    req.RemoteAddr = ip
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, req)
    fmt.Println(ip, rec.Code)
  }
}
`,
    testes: [{ saida: "1.1.1.1 200\n1.1.1.1 200\n2.2.2.2 200\n1.1.1.1 429" }],
  }),
  problema({
    id: 'web-prob-negociacao',
    titulo: "Negociação de conteúdo",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>perfil</code>: se o cabeçalho <code>Accept</code> contiver <code>application/json</code>, responda <code>{\"nome\":\"Ana\"}</code>; senão, responda o texto <code>Nome: Ana</code>.</p>",
    dica: "<code>strings.Contains(r.Header.Get(\"Accept\"), \"application/json\")</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

// Dica: você vai precisar importar "strings".

func perfil(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  for _, accept := range []string{"application/json", "text/html"} {
    req := httptest.NewRequest("GET", "/perfil", nil)
    req.Header.Set("Accept", accept)
    rec := httptest.NewRecorder()
    perfil(rec, req)
    fmt.Println(rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
  "strings"
)

func perfil(w http.ResponseWriter, r *http.Request) {
  if strings.Contains(r.Header.Get("Accept"), "application/json") {
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprint(w, \`{"nome":"Ana"}\`)
    return
  }
  fmt.Fprint(w, "Nome: Ana")
}

func main() {
  for _, accept := range []string{"application/json", "text/html"} {
    req := httptest.NewRequest("GET", "/perfil", nil)
    req.Header.Set("Accept", accept)
    rec := httptest.NewRecorder()
    perfil(rec, req)
    fmt.Println(rec.Body.String())
  }
}
`,
    testes: [{ saida: "{\"nome\":\"Ana\"}\nNome: Ana" }],
  }),
  problema({
    id: 'web-prob-roteador-manual',
    titulo: "Roteador feito à mão",
    dificuldade: 'dificil',
    enunciado: "<p>Construa um roteador simples: <code>Adicionar(metodo, caminho, h)</code> registra um handler e <code>ServeHTTP</code> escolhe pelo par <b>método + caminho</b>.</p>\n<p>Caminho desconhecido: <code>404</code>. Caminho conhecido com outro método: <code>405</code>.</p>",
    dica: "Use <code>map[string]map[string]http.HandlerFunc</code>: caminho → método → handler.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Roteador struct {
  rotas map[string]map[string]http.HandlerFunc
}

func (rt *Roteador) Adicionar(metodo, caminho string, h http.HandlerFunc) {
  // TODO: implemente
}

func (rt *Roteador) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  // TODO: implemente
}

func main() {
  rt := &Roteador{rotas: map[string]map[string]http.HandlerFunc{}}
  rt.Adicionar("GET", "/livros", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "lista") })
  rt.Adicionar("POST", "/livros", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "criado") })
  casos := [][2]string{{"GET", "/livros"}, {"POST", "/livros"}, {"PUT", "/livros"}, {"GET", "/autores"}}
  for _, c := range casos {
    rec := httptest.NewRecorder()
    rt.ServeHTTP(rec, httptest.NewRequest(c[0], c[1], nil))
    fmt.Println(c[0], c[1], rec.Code, rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

type Roteador struct {
  rotas map[string]map[string]http.HandlerFunc
}

func (rt *Roteador) Adicionar(metodo, caminho string, h http.HandlerFunc) {
  if rt.rotas[caminho] == nil {
    rt.rotas[caminho] = map[string]http.HandlerFunc{}
  }
  rt.rotas[caminho][metodo] = h
}

func (rt *Roteador) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  metodos, ok := rt.rotas[r.URL.Path]
  if !ok {
    w.WriteHeader(http.StatusNotFound)
    return
  }
  h, ok := metodos[r.Method]
  if !ok {
    w.WriteHeader(http.StatusMethodNotAllowed)
    return
  }
  h(w, r)
}

func main() {
  rt := &Roteador{rotas: map[string]map[string]http.HandlerFunc{}}
  rt.Adicionar("GET", "/livros", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "lista") })
  rt.Adicionar("POST", "/livros", func(w http.ResponseWriter, r *http.Request) { fmt.Fprint(w, "criado") })
  casos := [][2]string{{"GET", "/livros"}, {"POST", "/livros"}, {"PUT", "/livros"}, {"GET", "/autores"}}
  for _, c := range casos {
    rec := httptest.NewRecorder()
    rt.ServeHTTP(rec, httptest.NewRequest(c[0], c[1], nil))
    fmt.Println(c[0], c[1], rec.Code, rec.Body.String())
  }
}
`,
    testes: [{ saida: "GET /livros 200 lista\nPOST /livros 200 criado\nPUT /livros 405\nGET /autores 404" }],
  }),
  problema({
    id: 'web-prob-strip-prefix',
    titulo: "Versionando a API com prefixo",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>api()</code>: devolva um handler em que <code>/v1/</code> é removido do caminho antes de chegar ao handler interno, que responde <code>caminho: CAMINHO</code>.</p>",
    dica: "<code>http.StripPrefix(\"/v1\", interno)</code> tira o prefixo de <code>r.URL.Path</code>.",
    inicial: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func api() http.Handler {
  // TODO: implemente
  return http.NotFoundHandler()
}

func main() {
  h := api()
  for _, url := range []string{"/v1/usuarios", "/v1/pedidos/9"} {
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(rec.Body.String())
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "net/http"
  "net/http/httptest"
)

func api() http.Handler {
  interno := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "caminho: %s", r.URL.Path)
  })
  return http.StripPrefix("/v1", interno)
}

func main() {
  h := api()
  for _, url := range []string{"/v1/usuarios", "/v1/pedidos/9"} {
    rec := httptest.NewRecorder()
    h.ServeHTTP(rec, httptest.NewRequest("GET", url, nil))
    fmt.Println(rec.Body.String())
  }
}
`,
    testes: [{ saida: "caminho: /usuarios\ncaminho: /pedidos/9" }],
  }),
];
