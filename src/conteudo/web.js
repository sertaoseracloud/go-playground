// Módulo 2: Web e HTTP. Servidores HTTP, rotas, middleware, JSON e templates HTML.
import { go, licao, problema } from './util.js';

export const moduloWeb = {
 id: 'web',
 titulo: 'Web e HTTP',
 icone: '🌐',
 descricao: 'Servidores HTTP com net/http, rotas, handlers, middleware, JSON APIs e templates HTML.',
 itens: [
 licao({
 id: 'licao-servidor-http',
 titulo: 'Seu primeiro servidor HTTP',
 resumo: `
 <p>O pacote <code>net/http</code> fornece tudo para criar servidores web em Go. A função <code>http.ListenAndServe</code> inicia um servidor que escuta requisições.</p>
 <ul>
 <li><code>http.HandleFunc("/rota", handler)</code> registra uma rota.</li>
 <li>O handler recebe <code>http.ResponseWriter</code> (para escrever a resposta) e <code>*http.Request</code> (dados da requisição).</li>
 <li><code>w.Write([]byte("texto"))</code> escreve o corpo da resposta.</li>
 </ul>`,
 codigo: go`
 package main

 import (
 "fmt"
 "net/http"
 )

 func home(w http.ResponseWriter, r *http.Request) {
 fmt.Fprintln(w, "<h1>Bem-vindo ao DivergeGo!</h1>")
 }

 func main() {
 http.HandleFunc("/", home)
 fmt.Println("Servidor rodando em http://localhost:8080")
 http.ListenAndServe(":8080", nil)
 }
 `,
 }),
 licao({
 id: 'licao-json-api',
 titulo: 'APIs JSON',
 resumo: `
 <p>Go tem suporte nativo a JSON via <code>encoding/json</code>. Use <code>json.NewEncoder(w).Encode(v)</code> para enviar JSON e <code>json.NewDecoder(r.Body).Decode(&v)</code> para ler.</p>
 <ul>
 <li>Struct tags (<code>json:"nome"</code>) controlam os nomes dos campos no JSON.</li>
 <li><code>w.Header().Set("Content-Type", "application/json")</code> define o tipo da resposta.</li>
 <li>Sempre verifique erros de encoding/decoding.</li>
 </ul>`,
 codigo: go`
 package main

 import (
 "encoding/json"
 "net/http"
 )

 type Mensagem struct {
 Texto string \`json:"texto"\`
 Autor string \`json:"autor"\`
 }

 func api(w http.ResponseWriter, r *http.Request) {
 w.Header().Set("Content-Type", "application/json")
 msg := Mensagem{Texto: "Olá, API!", Autor: "DivergeGo"}
 json.NewEncoder(w).Encode(msg)
 }

 func main() {
 http.HandleFunc("/api/mensagem", api)
 http.ListenAndServe(":8080", nil)
 }
 `,
 }),
 problema({
 id: 'prob-rota-status',
 titulo: 'Rota com status code',
 dificuldade: 'medio',
 enunciado: `
 <p>Crie um servidor HTTP com duas rotas:</p>
 <ul>
 <li><code>/ok</code> — retorna status 200 e o texto "Tudo certo".</li>
 <li><code>/erro</code> — retorna status 500 e o texto "Algo deu errado".</li>
 </ul>
 <p>No <code>main</code>, registre as rotas e inicie o servidor na porta 8080.</p>`,
 dica: 'Use <code>w.WriteHeader(statusCode)</code> ANTES de escrever o corpo da resposta.',
 inicial: go`
 package main

 import "net/http"

 // TODO: implemente os handlers /ok e /erro

 func main() {
 // TODO: registre as rotas e inicie o servidor
 }
 `,
 solucao: go`
 package main

 import "net/http"

 func ok(w http.ResponseWriter, r *http.Request) {
 w.WriteHeader(http.StatusOK)
 w.Write([]byte("Tudo certo"))
 }

 func erro(w http.ResponseWriter, r *http.Request) {
 w.WriteHeader(http.StatusInternalServerError)
 w.Write([]byte("Algo deu errado"))
 }

 func main() {
 http.HandleFunc("/ok", ok)
 http.HandleFunc("/erro", erro)
 http.ListenAndServe(":8080", nil)
 }
 `,
 testes: [{ entrada: '', saida: '' }],
 }),
 ],
};