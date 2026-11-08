import { go, licao } from './util.js';
import { extraWeb } from './problemas/extra-web.js';

export const moduloWeb = {
  id: 'web',
  titulo: 'Web e HTTP',
  icone: '\u{1F310}',
  descricao: 'Servidores HTTP com net/http, rotas, handlers, middleware, JSON APIs e templates HTML.',
  itens: [
  licao({
    id: 'licao-servidor-http',
    titulo: 'Seu primeiro servidor HTTP',
    resumo: `<p>O pacote <code>net/http</code> fornece tudo para servidores web. Simulamos com structs Request e Response.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func homeHandler(r Request) Response {
 return Response{Status: 200, Body: "Bem-vindo!"}
}

func main() {
 req := Request{Method: "GET", Path: "/", Body: ""}
 resp := homeHandler(req)
 fmt.Println(resp.Status, resp.Body)
}`,
  }),
  licao({
    id: 'licao-json-api',
    titulo: 'APIs JSON',
    resumo: `<p>Go tem suporte nativo a JSON. Simulamos construindo strings com fmt.Sprintf.</p>`,
    codigo: go`package main

import "fmt"

type Msg struct {
 Texto string
 Autor string
}

func toJSON(m Msg) string {
 return fmt.Sprintf("{\\"texto\\": \\"%s\\", \\"autor\\": \\"%s\\"}", m.Texto, m.Autor)
}

func main() {
 m := Msg{Texto: "Ola", Autor: "Go"}
 fmt.Println(toJSON(m))
}`,
  }),
  licao({
    id: 'licao-handlers',
    titulo: 'Handlers: funcoes que respondem requisicoes',
    resumo: `<p>Um handler recebe Request e retorna Response.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func ola(r Request) Response {
 return Response{Status: 200, Body: "Ola, mundo!"}
}

func main() {
 fmt.Println(ola(Request{Path: "/ola"}).Body)
}`,
  }),
  licao({
    id: 'licao-rotas',
    titulo: 'Rotas: mapeando caminhos para handlers',
    resumo: `<p>Rotas conectam URL a handler via switch no Path.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func rotear(r Request) Response {
 switch r.Path {
 case "/":
  return Response{Status: 200, Body: "Home"}
 case "/sobre":
  return Response{Status: 200, Body: "Sobre"}
 default:
  return Response{Status: 404, Body: "Nao encontrado"}
 }
}

func main() {
 fmt.Println(rotear(Request{Path: "/"}).Body)
 fmt.Println(rotear(Request{Path: "/x"}).Body)
}`,
  }),
  licao({
    id: 'licao-query-params',
    titulo: 'Query Parameters',
    resumo: `<p>Query params sao valores apos ? na URL.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Query string
 Body string
}
type Response struct {
 Status int
 Body string
}

func busca(r Request) Response {
 if r.Query == "" {
  return Response{Status: 400, Body: "Parametro obrigatorio"}
 }
 return Response{Status: 200, Body: "Resultados: " + r.Query}
}

func main() {
 fmt.Println(busca(Request{Query: "go"}).Body)
 fmt.Println(busca(Request{Query: ""}).Body)
}`,
  }),
  licao({
    id: 'licao-post-body',
    titulo: 'POST e corpo da requisicao',
    resumo: `<p>POST envia dados no body.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func eco(r Request) Response {
 if r.Method != "POST" {
  return Response{Status: 405, Body: "So POST"}
 }
 return Response{Status: 200, Body: "Eco: " + r.Body}
}

func main() {
 fmt.Println(eco(Request{Method: "POST", Body: "teste"}).Body)
}`,
  }),
  licao({
    id: 'licao-json-encoding',
    titulo: 'JSON Encoding',
    resumo: `<p>Serializar converte struct em string JSON.</p>`,
    codigo: go`package main

import "fmt"

type User struct {
 Nome string
 Idade int
}

func toJSON(u User) string {
 return fmt.Sprintf("{\\"nome\\": \\"%s\\", \\"idade\\": %d}", u.Nome, u.Idade)
}

func main() {
 fmt.Println(toJSON(User{Nome: "Ana", Idade: 30}))
}`,
  }),
  licao({
    id: 'licao-json-decoding',
    titulo: 'JSON Decoding',
    resumo: `<p>Desserializar extrai valores de string JSON.</p>`,
    codigo: go`package main

import "fmt"

func extrair(js, campo string) string {
 chave := "\\"" + campo + "\\": \\""
 for i := 0; i <= len(js)-len(chave); i++ {
  if js[i:i+len(chave)] == chave {
   ini := i + len(chave)
   fim := ini
   for fim < len(js) && js[fim] != '"' {
    fim++
   }
   return js[ini:fim]
  }
 }
 return ""
}

func main() {
 j := "{\\"nome\\": \\"Go\\"}"
 fmt.Println(extrair(j, "nome"))
}`,
  }),
  licao({
    id: 'licao-status-codes',
    titulo: 'Status Codes HTTP',
    resumo: `<p>200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error.</p>`,
    codigo: go`package main

import "fmt"

func statusText(s int) string {
 switch s {
 case 200:
  return "OK"
 case 404:
  return "Not Found"
 case 500:
  return "Error"
 default:
  return "Unknown"
 }
}

func main() {
 fmt.Println(statusText(200))
 fmt.Println(statusText(404))
}`,
  }),
  licao({
    id: 'licao-headers',
    titulo: 'Headers HTTP',
    resumo: `<p>Headers sao metadados como slice de strings.</p>`,
    codigo: go`package main

import "fmt"

type Resp struct {
 Status int
 Body string
 Headers []string
}

func api() Resp {
 return Resp{Status: 200, Body: "ok", Headers: []string{"Content-Type: application/json"}}
}

func main() {
 r := api()
 for _, h := range r.Headers {
  fmt.Println(h)
 }
}`,
  }),
  licao({
    id: 'licao-middleware',
    titulo: 'Middleware conceitual',
    resumo: `<p>Middleware envolve o handler para logging ou auth.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func handler(r Request) Response {
 return Response{Status: 200, Body: "dados"}
}

func logMW(r Request) Response {
 fmt.Println("[LOG]", r.Path)
 return handler(r)
}

func main() {
 fmt.Println(logMW(Request{Path: "/api"}).Body)
}`,
  }),
  licao({
    id: 'licao-templates-html',
    titulo: 'Templates HTML conceituais',
    resumo: `<p>Templates substituem marcadores {{campo}} por valores.</p>`,
    codigo: go`package main

import "fmt"

func render(tpl, nome string) string {
 m := "{{nome}}"
 res := ""
 i := 0
 for i < len(tpl) {
  if i+len(m) <= len(tpl) && tpl[i:i+len(m)] == m {
   res += nome
   i += len(m)
  } else {
   res += string(tpl[i])
   i++
  }
 }
 return res
}

func main() {
 fmt.Println(render("<h1>Ola, {{nome}}!</h1>", "Carlos"))
}`,
  }),
  licao({
    id: 'licao-rest',
    titulo: 'REST: principios para APIs',
    resumo: `<p>GET lista, POST cria, PUT atualiza, DELETE remove.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func api(r Request) Response {
 switch r.Method {
 case "GET":
  return Response{Status: 200, Body: "[user1]"}
 case "POST":
  return Response{Status: 201, Body: "Criado"}
 case "DELETE":
  return Response{Status: 200, Body: "Removido"}
 default:
  return Response{Status: 405, Body: "Nao suportado"}
 }
}

func main() {
 fmt.Println(api(Request{Method: "GET"}).Body)
 fmt.Println(api(Request{Method: "POST"}).Body)
}`,
  }),
  licao({
    id: 'licao-cors',
    titulo: 'CORS conceitual',
    resumo: `<p>CORS controla quais origens acessam sua API.</p>`,
    codigo: go`package main

import "fmt"

type Req struct {
 Method string
 Origin string
}
type Res struct {
 Status int
 AllowOrigin string
}

func cors(r Req) Res {
 if r.Method == "OPTIONS" {
  return Res{Status: 200, AllowOrigin: "*"}
 }
 return Res{Status: 200, AllowOrigin: r.Origin}
}

func main() {
 fmt.Println(cors(Req{Method: "OPTIONS"}).AllowOrigin)
}`,
  }),
  licao({
    id: 'licao-autenticacao',
    titulo: 'Autenticacao conceitual',
    resumo: `<p>Sem token valido, retorne 401.</p>`,
    codigo: go`package main

import "fmt"

type Req struct {
 Token string
}
type Res struct {
 Status int
 Body string
}

func auth(r Req) Res {
 if r.Token == "" {
  return Res{Status: 401, Body: "Token ausente"}
 }
 if r.Token != "secret" {
  return Res{Status: 401, Body: "Invalido"}
 }
 return Res{Status: 200, Body: "OK"}
}

func main() {
 fmt.Println(auth(Req{Token: "secret"}).Body)
 fmt.Println(auth(Req{Token: ""}).Body)
}`,
  }),
  licao({
    id: 'licao-logging',
    titulo: 'Logging de requisicoes',
    resumo: `<p>Logging registra info sobre cada requisicao.</p>`,
    codigo: go`package main

import "fmt"

type Request struct {
 Method string
 Path string
 Body string
}
type Response struct {
 Status int
 Body string
}

func handler(r Request) Response {
 return Response{Status: 200, Body: "OK"}
}

func logReq(r Request, resp Response) {
 fmt.Printf("[%s] %s -> %d\\n", r.Method, r.Path, resp.Status)
}

func main() {
 reqs := []Request{{Method: "GET", Path: "/"}, {Method: "POST", Path: "/users"}}
 for _, r := range reqs {
  resp := handler(r)
  logReq(r, resp)
 }
}`,
  }),
   ...extraWeb,
  ],
};
