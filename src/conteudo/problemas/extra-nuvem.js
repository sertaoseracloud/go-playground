// Exercícios extras do módulo nuvem. Gerados a partir de soluções conferidas com o Go real:
// a saída esperada é a da solução, e o código inicial compila mas não passa.
import { go, problema } from '../util.js';

export const extraNuvem = [
  problema({
    id: 'nuvem-prob-env-padrao',
    titulo: "Variável de ambiente com padrão",
    dificuldade: 'facil',
    enunciado: "<p>Implemente <code>env(chave, padrao)</code>: devolva o valor da variável de ambiente ou o padrão se ela não estiver definida (ou estiver vazia).</p>",
    dica: "<code>if v := os.Getenv(chave); v != \"\" { return v }</code>.",
    inicial: go`
package main

import (
  "fmt"
  "os"
)

func env(chave, padrao string) string {
  // TODO: implemente
  return ""
}

func main() {
  os.Setenv("APP_REGIAO", "sa-east-1")
  os.Unsetenv("APP_PORTA")
  fmt.Println(env("APP_REGIAO", "us-east-1"))
  fmt.Println(env("APP_PORTA", "8080"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "os"
)

func env(chave, padrao string) string {
  if v := os.Getenv(chave); v != "" {
    return v
  }
  return padrao
}

func main() {
  os.Setenv("APP_REGIAO", "sa-east-1")
  os.Unsetenv("APP_PORTA")
  fmt.Println(env("APP_REGIAO", "us-east-1"))
  fmt.Println(env("APP_PORTA", "8080"))
}
`,
    testes: [{ saida: "sa-east-1\n8080" }],
  }),
  problema({
    id: 'nuvem-prob-backoff',
    titulo: "Backoff exponencial",
    dificuldade: 'facil',
    enunciado: "<p>Ao repetir uma chamada que falhou, esperamos cada vez mais. Implemente <code>espera(tentativa)</code>: 100ms × 2<sup>tentativa</sup>, limitado a 2 segundos.</p>",
    dica: "<code>d := 100 * time.Millisecond &lt;&lt; tentativa</code> (deslocar à esquerda dobra) e compare com <code>2 * time.Second</code>.",
    inicial: go`
package main

import (
  "fmt"
  "time"
)

func espera(tentativa int) time.Duration {
  // TODO: implemente
  return 0
}

func main() {
  for t := 0; t <= 6; t++ {
    fmt.Println(t, espera(t))
  }
}
`,
    solucao: go`
package main

import (
  "fmt"
  "time"
)

func espera(tentativa int) time.Duration {
  d := 100 * time.Millisecond << tentativa
  if d > 2*time.Second {
    return 2 * time.Second
  }
  return d
}

func main() {
  for t := 0; t <= 6; t++ {
    fmt.Println(t, espera(t))
  }
}
`,
    testes: [{ saida: "0 100ms\n1 200ms\n2 400ms\n3 800ms\n4 1.6s\n5 2s\n6 2s" }],
  }),
  problema({
    id: 'nuvem-prob-retry',
    titulo: "Repetindo chamadas que falham",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>comRetry(maximo, fn)</code>: chame <code>fn</code> até ela dar certo ou até <code>maximo</code> tentativas. Devolva o número de tentativas e o último erro (ou <code>nil</code>).</p>",
    dica: "<code>for t := 1; t &lt;= maximo; t++ { if err = fn(); err == nil { return t, nil } }</code>.",
    inicial: go`
package main

import (
  "errors"
  "fmt"
)

func comRetry(maximo int, fn func() error) (int, error) {
  // TODO: implemente
  return 0, nil
}

func instavel(falhas int) func() error {
  return func() error {
    if falhas > 0 {
      falhas--
      return errors.New("503 serviço indisponível")
    }
    return nil
  }
}

func main() {
  fmt.Println(comRetry(5, instavel(2)))
  fmt.Println(comRetry(3, instavel(10)))
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
)

func comRetry(maximo int, fn func() error) (int, error) {
  var err error
  for t := 1; t <= maximo; t++ {
    if err = fn(); err == nil {
      return t, nil
    }
  }
  return maximo, err
}

func instavel(falhas int) func() error {
  return func() error {
    if falhas > 0 {
      falhas--
      return errors.New("503 serviço indisponível")
    }
    return nil
  }
}

func main() {
  fmt.Println(comRetry(5, instavel(2)))
  fmt.Println(comRetry(3, instavel(10)))
}
`,
    testes: [{ saida: "3 <nil>\n3 503 serviço indisponível" }],
  }),
  problema({
    id: 'nuvem-prob-circuit-breaker',
    titulo: "Circuit breaker",
    dificuldade: 'dificil',
    enunciado: "<p>Implemente <code>Chamar(fn)</code> de um disjuntor: depois de <code>limite</code> falhas seguidas ele <b>abre</b> e passa a recusar chamadas com o erro <code>circuito aberto</code>, sem chamar <code>fn</code>. Um sucesso zera as falhas.</p>",
    dica: "Se <code>d.falhas &gt;= d.limite</code>, devolva o erro na hora. Senão, chame <code>fn</code>: erro incrementa, sucesso zera.",
    inicial: go`
package main

import (
  "errors"
  "fmt"
)

type Disjuntor struct {
  limite, falhas int
}

func (d *Disjuntor) Chamar(fn func() error) error {
  // TODO: implemente
  return nil
}

func main() {
  d := &Disjuntor{limite: 2}
  ok := func() error { return nil }
  falha := func() error { return errors.New("timeout") }
  for _, fn := range []func() error{falha, ok, falha, falha, ok, ok} {
    fmt.Println(d.Chamar(fn))
  }
}
`,
    solucao: go`
package main

import (
  "errors"
  "fmt"
)

type Disjuntor struct {
  limite, falhas int
}

func (d *Disjuntor) Chamar(fn func() error) error {
  if d.falhas >= d.limite {
    return errors.New("circuito aberto")
  }
  if err := fn(); err != nil {
    d.falhas++
    return err
  }
  d.falhas = 0
  return nil
}

func main() {
  d := &Disjuntor{limite: 2}
  ok := func() error { return nil }
  falha := func() error { return errors.New("timeout") }
  for _, fn := range []func() error{falha, ok, falha, falha, ok, ok} {
    fmt.Println(d.Chamar(fn))
  }
}
`,
    testes: [{ saida: "timeout\n<nil>\ntimeout\ntimeout\ncircuito aberto\ncircuito aberto" }],
  }),
  problema({
    id: 'nuvem-prob-listar-prefixo',
    titulo: "Listando objetos por prefixo",
    dificuldade: 'medio',
    enunciado: "<p>Num bucket S3, \"pastas\" são só prefixos. Implemente <code>listar(chaves, prefixo)</code>: devolva as chaves que começam com o prefixo, em ordem alfabética.</p>",
    dica: "<code>strings.HasPrefix</code> para filtrar e <code>sort.Strings</code> para ordenar.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "sort" e "strings".

func listar(chaves []string, prefixo string) []string {
  // TODO: implemente
  return nil
}

func main() {
  bucket := []string{"fotos/2026/b.jpg", "docs/cv.pdf", "fotos/2026/a.jpg", "fotos/2025/x.jpg", "fotos.txt"}
  fmt.Println(listar(bucket, "fotos/2026/"))
  fmt.Println(listar(bucket, "fotos/"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "sort"
  "strings"
)

func listar(chaves []string, prefixo string) []string {
  out := []string{}
  for _, k := range chaves {
    if strings.HasPrefix(k, prefixo) {
      out = append(out, k)
    }
  }
  sort.Strings(out)
  return out
}

func main() {
  bucket := []string{"fotos/2026/b.jpg", "docs/cv.pdf", "fotos/2026/a.jpg", "fotos/2025/x.jpg", "fotos.txt"}
  fmt.Println(listar(bucket, "fotos/2026/"))
  fmt.Println(listar(bucket, "fotos/"))
}
`,
    testes: [{ saida: "[fotos/2026/a.jpg fotos/2026/b.jpg]\n[fotos/2025/x.jpg fotos/2026/a.jpg fotos/2026/b.jpg]" }],
  }),
  problema({
    id: 'nuvem-prob-rollout-hash',
    titulo: "Liberação gradual por hash",
    dificuldade: 'dificil',
    enunciado: "<p>Para liberar uma funcionalidade para 30% dos usuários de forma <b>estável</b> (o mesmo usuário sempre cai no mesmo grupo), usamos um hash.</p>\n<p>Implemente <code>liberado(usuario, porcentagem)</code>: calcule o FNV-32a do nome, tire o resto da divisão por 100 e libere se for menor que a porcentagem.</p>",
    dica: "<code>h := fnv.New32a(); h.Write([]byte(usuario)); balde := h.Sum32() % 100</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "hash/fnv".

func liberado(usuario string, porcentagem uint32) bool {
  // TODO: implemente
  return false
}

func main() {
  liberados := 0
  for i := 0; i < 1000; i++ {
    if liberado(fmt.Sprintf("user-%d", i), 30) {
      liberados++
    }
  }
  fmt.Println("liberados de 1000:", liberados)
  fmt.Println(liberado("ana", 30) == liberado("ana", 30))
  fmt.Println(liberado("ana", 0), liberado("ana", 100))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "hash/fnv"
)

func liberado(usuario string, porcentagem uint32) bool {
  h := fnv.New32a()
  h.Write([]byte(usuario))
  return h.Sum32()%100 < porcentagem
}

func main() {
  liberados := 0
  for i := 0; i < 1000; i++ {
    if liberado(fmt.Sprintf("user-%d", i), 30) {
      liberados++
    }
  }
  fmt.Println("liberados de 1000:", liberados)
  fmt.Println(liberado("ana", 30) == liberado("ana", 30))
  fmt.Println(liberado("ana", 0), liberado("ana", 100))
}
`,
    testes: [{ saida: "liberados de 1000: 296\ntrue\nfalse true" }],
  }),
  problema({
    id: 'nuvem-prob-mascarar-segredo',
    titulo: "Mascarando segredos nos logs",
    dificuldade: 'facil',
    enunciado: "<p>Nunca registre um segredo inteiro. Implemente <code>mascarar(s)</code>: mostre só os 4 últimos caracteres, trocando os demais por <code>*</code>. Segredos com até 4 caracteres viram só <code>****</code>.</p>",
    dica: "<code>strings.Repeat(\"*\", len(s)-4) + s[len(s)-4:]</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "strings".

func mascarar(s string) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(mascarar("AKIAIOSFODNN7EXAMPLE"))
  fmt.Println(mascarar("abc"))
}
`,
    solucao: go`
package main

import (
  "fmt"
  "strings"
)

func mascarar(s string) string {
  if len(s) <= 4 {
    return "****"
  }
  return strings.Repeat("*", len(s)-4) + s[len(s)-4:]
}

func main() {
  fmt.Println(mascarar("AKIAIOSFODNN7EXAMPLE"))
  fmt.Println(mascarar("abc"))
}
`,
    testes: [{ saida: "****************MPLE\n****" }],
  }),
  problema({
    id: 'nuvem-prob-url-assinada',
    titulo: "URL assinada com HMAC",
    dificuldade: 'dificil',
    enunciado: "<p>URLs pré-assinadas permitem acesso temporário sem expor a chave. Implemente <code>assinar(caminho, expira, segredo)</code>: o HMAC-SHA256 de <code>caminho|expira</code> em hexadecimal.</p>\n<p>Implemente também <code>valida</code>, que recalcula e compara com <code>hmac.Equal</code>.</p>",
    dica: "<code>m := hmac.New(sha256.New, []byte(segredo)); m.Write([]byte(fmt.Sprintf(\"%s|%d\", caminho, expira))); hex.EncodeToString(m.Sum(nil))</code>.",
    inicial: go`
package main

import "fmt"

// Dica: você vai precisar importar "crypto/hmac" e "crypto/sha256" e "encoding/hex".

func assinar(caminho string, expira int64, segredo string) string {
  // TODO: implemente
  return ""
}

func valida(caminho string, expira int64, assinatura, segredo string) bool {
  // TODO: implemente
  return false
}

func main() {
  a := assinar("/videos/aula1.mp4", 1767225600, "chave-super-secreta")
  fmt.Println(len(a), a[:16])
  fmt.Println(valida("/videos/aula1.mp4", 1767225600, a, "chave-super-secreta"))
  fmt.Println(valida("/videos/aula2.mp4", 1767225600, a, "chave-super-secreta"))
}
`,
    solucao: go`
package main

import (
  "crypto/hmac"
  "crypto/sha256"
  "encoding/hex"
  "fmt"
)

func assinar(caminho string, expira int64, segredo string) string {
  m := hmac.New(sha256.New, []byte(segredo))
  m.Write([]byte(fmt.Sprintf("%s|%d", caminho, expira)))
  return hex.EncodeToString(m.Sum(nil))
}

func valida(caminho string, expira int64, assinatura, segredo string) bool {
  return hmac.Equal([]byte(assinar(caminho, expira, segredo)), []byte(assinatura))
}

func main() {
  a := assinar("/videos/aula1.mp4", 1767225600, "chave-super-secreta")
  fmt.Println(len(a), a[:16])
  fmt.Println(valida("/videos/aula1.mp4", 1767225600, a, "chave-super-secreta"))
  fmt.Println(valida("/videos/aula2.mp4", 1767225600, a, "chave-super-secreta"))
}
`,
    testes: [{ saida: "64 210ba75e211a749f\ntrue\nfalse" }],
  }),
  problema({
    id: 'nuvem-prob-saude-agregada',
    titulo: "Health check agregado",
    dificuldade: 'medio',
    enunciado: "<p>Implemente <code>statusGeral(deps)</code>: <code>fora</code> se alguma dependência <b>crítica</b> estiver fora; <code>degradado</code> se só dependências não críticas estiverem fora; senão <code>ok</code>.</p>",
    dica: "Percorra uma vez: crítica fora → devolva <code>fora</code> na hora; não crítica fora → marque <code>degradado</code>.",
    inicial: go`
package main

import "fmt"

type Dep struct {
  Nome    string
  Critica bool
  Ok      bool
}

func statusGeral(deps []Dep) string {
  // TODO: implemente
  return ""
}

func main() {
  fmt.Println(statusGeral([]Dep{{"banco", true, true}, {"cache", false, true}}))
  fmt.Println(statusGeral([]Dep{{"banco", true, true}, {"cache", false, false}}))
  fmt.Println(statusGeral([]Dep{{"banco", true, false}, {"cache", false, false}}))
}
`,
    solucao: go`
package main

import "fmt"

type Dep struct {
  Nome    string
  Critica bool
  Ok      bool
}

func statusGeral(deps []Dep) string {
  status := "ok"
  for _, d := range deps {
    if d.Ok {
      continue
    }
    if d.Critica {
      return "fora"
    }
    status = "degradado"
  }
  return status
}

func main() {
  fmt.Println(statusGeral([]Dep{{"banco", true, true}, {"cache", false, true}}))
  fmt.Println(statusGeral([]Dep{{"banco", true, true}, {"cache", false, false}}))
  fmt.Println(statusGeral([]Dep{{"banco", true, false}, {"cache", false, false}}))
}
`,
    testes: [{ saida: "ok\ndegradado\nfora" }],
  }),
  problema({
    id: 'nuvem-prob-token-bucket',
    titulo: "Rate limiting com token bucket",
    dificuldade: 'dificil',
    enunciado: "<p>O balde começa cheio com <code>capacidade</code> fichas e ganha <code>taxa</code> fichas por segundo (sem passar da capacidade). Cada pedido gasta uma ficha.</p>\n<p>Implemente <code>Permitir(agora)</code> (tempo em segundos): reabasteça pelo tempo passado desde a última chamada e diga se o pedido passa.</p>",
    dica: "<code>b.fichas += (agora - b.ultimo) * b.taxa</code>, limite a <code>b.capacidade</code>, atualize <code>b.ultimo</code>; se <code>b.fichas &gt;= 1</code>, gaste uma.",
    inicial: go`
package main

import "fmt"

type Balde struct {
  capacidade, taxa, fichas, ultimo float64
}

func (b *Balde) Permitir(agora float64) bool {
  // TODO: implemente
  return false
}

func main() {
  b := &Balde{capacidade: 3, taxa: 1, fichas: 3}
  for _, t := range []float64{0, 0, 0, 0, 0.5, 1, 1, 5, 5, 5, 5} {
    fmt.Print(b.Permitir(t), " ")
  }
  fmt.Println()
}
`,
    solucao: go`
package main

import "fmt"

type Balde struct {
  capacidade, taxa, fichas, ultimo float64
}

func (b *Balde) Permitir(agora float64) bool {
  b.fichas += (agora - b.ultimo) * b.taxa
  if b.fichas > b.capacidade {
    b.fichas = b.capacidade
  }
  b.ultimo = agora
  if b.fichas >= 1 {
    b.fichas--
    return true
  }
  return false
}

func main() {
  b := &Balde{capacidade: 3, taxa: 1, fichas: 3}
  for _, t := range []float64{0, 0, 0, 0, 0.5, 1, 1, 5, 5, 5, 5} {
    fmt.Print(b.Permitir(t), " ")
  }
  fmt.Println()
}
`,
    testes: [{ saida: "true true true false false true false true true true false" }],
  }),
];
