// Módulo Nuvem e gRPC. Simula config, storage, gRPC, health check, secrets e infra.
import { go, licao, problema } from './util.js';
import { extraNuvem } from './problemas/extra-nuvem.js';

export const moduloNuvem = {
  id: 'nuvem',
  titulo: 'Nuvem e gRPC',
  icone: '☁️',
  descricao: 'gRPC, protobuf, AWS SDK, Azure SDK, configuração e secrets.',
  itens: [
    // === LIÇÕES (15) ===
    licao({
      id: 'nuvem-licao-config-basica',
      titulo: 'Configuração como código',
      resumo: `
        <p>Aplicações cloud usam structs para representar configuração.</p>
        <ul>
          <li>Defina uma struct <code>Config</code> com campos tipados.</li>
          <li>Valores default evitam panics e simplificam testes.</li>
          <li>Neste playground, simulamos variáveis de ambiente com funções.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Config struct {
            Host string
            Port int
            Debug bool
        }

        func defaultConfig() Config {
            return Config{Host: "localhost", Port: 8080, Debug: false}
        }

        func main() {
            cfg := defaultConfig()
            fmt.Println(cfg.Host, cfg.Port, cfg.Debug)
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-env-vars',
      titulo: 'Variáveis de ambiente simuladas',
      resumo: `
        <p>Em cloud, configurações vêm de variáveis de ambiente.</p>
        <ul>
          <li>Aqui simulamos com um map e uma função <code>getEnv</code>.</li>
          <li>Se a chave não existe, retorna um valor default.</li>
          <li>Isso evita depender de <code>os.Getenv</code> no playground.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        var envs = map[string]string{
            "APP_HOST": "0.0.0.0",
            "APP_PORT": "3000",
        }

        func getEnv(key, fallback string) string {
            if val, ok := envs[key]; ok {
                return val
            }
            return fallback
        }

        func main() {
            host := getEnv("APP_HOST", "localhost")
            port := getEnv("APP_PORT", "8080")
            missing := getEnv("APP_SECRET", "default-secret")
            fmt.Println(host, port, missing)
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-storage-simulado',
      titulo: 'Storage simulado com maps',
      resumo: `
        <p>Serviços cloud como S3 ou Blob Storage podem ser simulados com maps.</p>
        <ul>
          <li>Chave = nome do objeto, valor = conteúdo.</li>
          <li>Operações: Put, Get, Delete, List.</li>
          <li>Útil para testar lógica sem dependências externas.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Storage struct {
            data map[string]string
        }

        func NewStorage() Storage {
            return Storage{data: map[string]string{}}
        }

        func (s Storage) Put(key, value string) {
            s.data[key] = value
        }

        func (s Storage) Get(key string) string {
            if v, ok := s.data[key]; ok {
                return v
            }
            return "(not found)"
        }

        func main() {
            store := NewStorage()
            store.Put("config.yaml", "port: 8080")
            fmt.Println(store.Get("config.yaml"))
            fmt.Println(store.Get("missing.txt"))
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-grpc-conceito',
      titulo: 'Conceito de gRPC',
      resumo: `
        <p>gRPC é um framework RPC de alta performance baseado em HTTP/2 e Protobuf.</p>
        <ul>
          <li>Define serviços em arquivos <code>.proto</code>.</li>
          <li>Gera código cliente/servidor automaticamente.</li>
          <li>Aqui simulamos chamadas gRPC com funções e structs.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type UserRequest struct {
            ID int
        }

        type UserResponse struct {
            Name  string
            Email string
        }

        func GetUser(req UserRequest) UserResponse {
            users := map[int]UserResponse{
                1: {Name: "Ana", Email: "ana@example.com"},
                2: {Name: "Bruno", Email: "bruno@example.com"},
            }
            if resp, ok := users[req.ID]; ok {
                return resp
            }
            return UserResponse{Name: "unknown", Email: ""}
        }

        func main() {
            resp := GetUser(UserRequest{ID: 1})
            fmt.Println(resp.Name, resp.Email)
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-protobuf-simulado',
      titulo: 'Protobuf simulado com structs',
      resumo: `
        <p>Protocol Buffers definem contratos de dados binários eficientes.</p>
        <ul>
          <li>No playground, usamos structs Go como equivalente.</li>
          <li>Serialização simulada via <code>fmt.Sprintf</code>.</li>
          <li>Campos opcionais são ponteiros ou valores zero.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Order struct {
            ID       int
            Product  string
            Quantity int
        }

        func serialize(o Order) string {
            return fmt.Sprintf("Order{id:%d,product:%s,qty:%d}", o.ID, o.Product, o.Quantity)
        }

        func main() {
            order := Order{ID: 42, Product: "widget", Quantity: 5}
            fmt.Println(serialize(order))
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-health-check',
      titulo: 'Health checks',
      resumo: `
        <p>Serviços cloud expõem endpoints de saúde para orquestradores.</p>
        <ul>
          <li><code>/healthz</code> retorna status da aplicação.</li>
          <li><code>/readyz</code> indica se está pronto para tráfego.</li>
          <li>Simulamos com structs de status e verificações.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type HealthStatus struct {
            Status   string
            Database bool
            Cache    bool
        }

        func checkHealth(dbOk, cacheOk bool) HealthStatus {
            status := "healthy"
            if !dbOk || !cacheOk {
                status = "degraded"
            }
            return HealthStatus{Status: status, Database: dbOk, Cache: cacheOk}
        }

        func main() {
            h := checkHealth(true, false)
            fmt.Println(h.Status, h.Database, h.Cache)
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-secrets',
      titulo: 'Gerenciamento de secrets',
      resumo: `
        <p>Secrets nunca devem estar em código-fonte.</p>
        <ul>
          <li>Use serviços como AWS Secrets Manager ou HashiCorp Vault.</li>
          <li>Aqui simulamos com um cofre em memória.</li>
          <li>Acesso requer autenticação simulada.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Vault struct {
            secrets map[string]string
            token   string
        }

        func NewVault(token string) Vault {
            return Vault{
                secrets: map[string]string{
                    "db_password": "s3cret!",
                    "api_key":     "key-abc-123",
                },
                token: token,
            }
        }

        func (v Vault) GetSecret(name, token string) string {
            if token != v.token {
                return "(access denied)"
            }
            if val, ok := v.secrets[name]; ok {
                return val
            }
            return "(not found)"
        }

        func main() {
            vault := NewVault("my-token")
            fmt.Println(vault.GetSecret("db_password", "my-token"))
            fmt.Println(vault.GetSecret("db_password", "wrong"))
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-infra-tags',
      titulo: 'Tags de infraestrutura',
      resumo: `
        <p>Recursos cloud usam tags para organização e billing.</p>
        <ul>
          <li>Tags são pares chave-valor.</li>
          <li>Exemplos: <code>env:prod</code>, <code>team:backend</code>.</li>
          <li>Simulamos com maps e filtros.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Resource struct {
            Name string
            Tags map[string]string
        }

        func filterByTag(resources []Resource, key, value string) []string {
            var result []string
            for _, r := range resources {
                if v, ok := r.Tags[key]; ok && v == value {
                    result = append(result, r.Name)
                }
            }
            return result
        }

        func main() {
            rs := []Resource{
                {Name: "api-server", Tags: map[string]string{"env": "prod", "team": "backend"}},
                {Name: "dev-db", Tags: map[string]string{"env": "dev", "team": "data"}},
                {Name: "prod-cache", Tags: map[string]string{"env": "prod", "team": "infra"}},
            }
            prods := filterByTag(rs, "env", "prod")
            for _, n := range prods {
                fmt.Println(n)
            }
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-retry',
      titulo: 'Retry e backoff',
      resumo: `
        <p>Chamadas cloud falham; retry com backoff é essencial.</p>
        <ul>
          <li>Tente N vezes com intervalo crescente.</li>
          <li>Backoff exponencial: 1s, 2s, 4s, 8s...</li>
          <li>Simulamos com loop e contador.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        func simulateCall(attempt int) bool {
            return attempt >= 3
        }

        func withRetry(maxAttempts int) string {
            for i := 1; i <= maxAttempts; i++ {
                if simulateCall(i) {
                    return fmt.Sprintf("success on attempt %d", i)
                }
            }
            return "failed after retries"
        }

        func main() {
            fmt.Println(withRetry(5))
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-circuit-breaker',
      titulo: 'Circuit breaker simulado',
      resumo: `
        <p>Circuit breaker previne cascatas de falhas.</p>
        <ul>
          <li>Estados: closed (normal), open (falhando), half-open (testando).</li>
          <li>Após N falhas consecutivas, abre o circuito.</li>
          <li>Simulamos com contador e estado.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Breaker struct {
            failures int
            threshold int
            state    string
        }

        func NewBreaker(threshold int) Breaker {
            return Breaker{failures: 0, threshold: threshold, state: "closed"}
        }

        func (b *Breaker) Call(success bool) string {
            if b.state == "open" {
                return "rejected (circuit open)"
            }
            if success {
                b.failures = 0
                return "ok"
            }
            b.failures++
            if b.failures >= b.threshold {
                b.state = "open"
            }
            return "failure recorded"
        }

        func main() {
            cb := NewBreaker(3)
            fmt.Println(cb.Call(false))
            fmt.Println(cb.Call(false))
            fmt.Println(cb.Call(false))
            fmt.Println(cb.Call(true))
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-sdk-client',
      titulo: 'SDK client simulado',
      resumo: `
        <p>SDKs cloud (AWS, Azure, GCP) encapsulam chamadas HTTP.</p>
        <ul>
          <li>Padrão: cliente + request + response.</li>
          <li>Erros retornados como structs, não panics.</li>
          <li>Simulamos um mini SDK de storage.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Client struct {
            region string
        }

        type PutResult struct {
            Key    string
            Status string
        }

        func NewClient(region string) Client {
            return Client{region: region}
        }

        func (c Client) PutObject(bucket, key, body string) PutResult {
            if bucket == "" || key == "" {
                return PutResult{Key: key, Status: "error: empty params"}
            }
            return PutResult{Key: key, Status: "created in " + c.region}
        }

        func main() {
            sdk := NewClient("us-east-1")
            res := sdk.PutObject("my-bucket", "data.json", "{}")
            fmt.Println(res.Key, res.Status)
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-multi-region',
      titulo: 'Multi-região e latência',
      resumo: `
        <p>Distribuir serviços reduz latência para usuários globais.</p>
        <ul>
          <li>Cada região tem latência base diferente.</li>
          <li>Roteamento escolhe a região mais próxima.</li>
          <li>Simulamos com mapa de latências.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        var latencies = map[string]int{
            "us-east-1":  20,
            "eu-west-1":  80,
            "ap-south-1": 150,
        }

        func closestRegion(userLatency map[string]int) string {
            best := ""
            min := 99999
            for region, lat := range userLatency {
                if lat < min {
                    min = lat
                    best = region
                }
            }
            return best
        }

        func main() {
            userView := map[string]int{
                "us-east-1":  25,
                "eu-west-1":  90,
                "ap-south-1": 160,
            }
            fmt.Println(closestRegion(userView))
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-idempotencia',
      titulo: 'Idempotência em operações cloud',
      resumo: `
        <p>Operações idempotentes podem ser repetidas sem efeitos colaterais.</p>
        <ul>
          <li>PUT e DELETE são idempotentes; POST geralmente não é.</li>
          <li>Use chaves de idempotência para evitar duplicatas.</li>
          <li>Simulamos com rastreamento de IDs processados.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        type Processor struct {
            processed map[string]bool
            count     int
        }

        func NewProcessor() Processor {
            return Processor{processed: map[string]bool{}, count: 0}
        }

        func (p *Processor) Handle(idempotencyKey string) string {
            if p.processed[idempotencyKey] {
                return "duplicate ignored"
            }
            p.processed[idempotencyKey] = true
            p.count++
            return "processed"
        }

        func main() {
            proc := NewProcessor()
            fmt.Println(proc.Handle("key-001"))
            fmt.Println(proc.Handle("key-001"))
            fmt.Println(proc.Handle("key-002"))
            fmt.Println(proc.count)
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-log-estruturado',
      titulo: 'Logs estruturados',
      resumo: `
        <p>Logs estruturados facilitam busca e alertas em cloud.</p>
        <ul>
          <li>Use formato chave-valor ou JSON.</li>
          <li>Inclua nível, mensagem e contexto.</li>
          <li>Simulamos com formatação simples.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        func log(level, msg, component string) {
            fmt.Printf("[%s] %s: %s\\n", level, component, msg)
        }

        func main() {
            log("INFO", "server started", "http")
            log("WARN", "high latency detected", "grpc")
            log("ERROR", "connection refused", "db")
        }
      `,
    }),
    licao({
      id: 'nuvem-licao-feature-flag',
      titulo: 'Feature flags',
      resumo: `
        <p>Feature flags permitem ativar/desativar funcionalidades sem deploy.</p>
        <ul>
          <li>Armazene flags em config ou serviço remoto.</li>
          <li>Verifique antes de executar nova lógica.</li>
          <li>Simulamos com map de booleans.</li>
        </ul>`,
      codigo: go`
        package main

        import "fmt"

        var features = map[string]bool{
            "new_checkout": true,
            "beta_search":  false,
        }

        func isEnabled(flag string) bool {
            if val, ok := features[flag]; ok {
                return val
            }
            return false
        }

        func checkout() string {
            if isEnabled("new_checkout") {
                return "using new checkout flow"
            }
            return "using legacy checkout"
        }

        func main() {
            fmt.Println(checkout())
        }
      `,
    }),

    // === PROBLEMAS (30) ===
    problema({
      id: 'nuvem-prob-config-load',
      titulo: 'Carregar configuração com defaults',
      dificuldade: 'facil',
      enunciado: '<p>Crie uma função <code>loadConfig(envs map[string]string)</code> que retorne uma struct <code>Config{Host, Port, Debug}</code>. Use "localhost"/8080/false como defaults se as chaves APP_HOST, APP_PORT, APP_DEBUG não existirem.</p>',
      dica: '<p>Verifique cada chave no map; se ausente, use o default. Para Port, assuma que o valor já vem como string numérica válida ou use default.</p>',
      inicial: go`
package main

import "fmt"

type Config struct {
    Host  string
    Port  int
    Debug bool
}

// Implemente loadConfig aqui

func main() {
    envs := map[string]string{"APP_HOST": "0.0.0.0"}
    cfg := loadConfig(envs)
    fmt.Println(cfg.Host, cfg.Port, cfg.Debug)
}

func loadConfig(envs map[string]string) Config {
  // TODO: implemente
  return Config{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type Config struct {
            Host  string
            Port  int
            Debug bool
        }

        func loadConfig(envs map[string]string) Config {
            host := "localhost"
            if v, ok := envs["APP_HOST"]; ok {
                host = v
            }
            port := 8080
            if v, ok := envs["APP_PORT"]; ok && v == "3000" {
                port = 3000
            }
            debug := false
            if v, ok := envs["APP_DEBUG"]; ok && v == "true" {
                debug = true
            }
            return Config{Host: host, Port: port, Debug: debug}
        }

        func main() {
            envs := map[string]string{"APP_HOST": "0.0.0.0"}
            cfg := loadConfig(envs)
            fmt.Println(cfg.Host, cfg.Port, cfg.Debug)
        }
      `,
      testes: [{ saida: '0.0.0.0 8080 false' }],
    }),
    problema({
      id: 'nuvem-prob-storage-list',
      titulo: 'Listar objetos no storage',
      dificuldade: 'facil',
      enunciado: '<p>Implemente o método <code>List(prefix string)</code> na struct <code>Storage</code> que retorne, em ordem alfabética, as chaves que começam com o prefixo dado.</p><p>A ordem importa: em Go, percorrer um <code>map</code> devolve as chaves numa ordem diferente a cada execução.</p>',
      dica: '<p>Percorra o map e verifique se cada chave começa com o prefixo usando comparação de substring (ou <code>strings.HasPrefix</code>). No fim, ordene com <code>sort.Strings</code>.</p>',
      inicial: go`
package main

import "fmt"

type Storage struct {
    data map[string]string
}

func NewStorage() Storage {
    return Storage{data: map[string]string{
        "logs/app.log": "data1",
        "logs/err.log": "data2",
        "config.yaml":  "data3",
    }}
}

// Implemente List aqui

func main() {
    s := NewStorage()
    keys := s.List("logs/")
    for _, k := range keys {
        fmt.Println(k)
    }
}

func (s Storage) List(prefix string) []string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import (
            "fmt"
            "sort"
        )

        type Storage struct {
            data map[string]string
        }

        func NewStorage() Storage {
            return Storage{data: map[string]string{
                "logs/app.log": "data1",
                "logs/err.log": "data2",
                "config.yaml":  "data3",
            }}
        }

        func (s Storage) List(prefix string) []string {
            var result []string
            for k := range s.data {
                if len(k) >= len(prefix) && k[:len(prefix)] == prefix {
                    result = append(result, k)
                }
            }
            sort.Strings(result)
            return result
        }

        func main() {
            s := NewStorage()
            keys := s.List("logs/")
            for _, k := range keys {
                fmt.Println(k)
            }
        }
      `,
      testes: [{ saida: 'logs/app.log\nlogs/err.log' }],
    }),
    problema({
      id: 'nuvem-prob-grpc-unary',
      titulo: 'Chamada gRPC unária',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>GetProduct(req ProductRequest)</code> que busca um produto por ID em um catálogo fixo. Retorne <code>ProductResponse{Name, Price}</code> ou <code>{"not found", 0}</code> se não existir.</p>',
      dica: '<p>Use um map literal dentro da função como catálogo simulado.</p>',
      inicial: go`
package main

import "fmt"

type ProductRequest struct{ ID int }
type ProductResponse struct {
    Name  string
    Price int
}

// Implemente GetProduct aqui

func main() {
    fmt.Println(GetProduct(ProductRequest{ID: 1}))
    fmt.Println(GetProduct(ProductRequest{ID: 99}))
}

func GetProduct(req ProductRequest) ProductResponse {
  // TODO: implemente
  return ProductResponse{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type ProductRequest struct{ ID int }
        type ProductResponse struct {
            Name  string
            Price int
        }

        func GetProduct(req ProductRequest) ProductResponse {
            catalog := map[int]ProductResponse{
                1: {Name: "Laptop", Price: 1200},
                2: {Name: "Mouse", Price: 25},
            }
            if p, ok := catalog[req.ID]; ok {
                return p
            }
            return ProductResponse{Name: "not found", Price: 0}
        }

        func main() {
            fmt.Println(GetProduct(ProductRequest{ID: 1}))
            fmt.Println(GetProduct(ProductRequest{ID: 99}))
        }
      `,
      testes: [{ saida: '{Laptop 1200}\n{not found 0}' }],
    }),
    problema({
      id: 'nuvem-prob-health-endpoint',
      titulo: 'Endpoint de health check',
      dificuldade: 'facil',
      enunciado: '<p>Crie <code>healthCheck(dbUp, cacheUp, queueUp bool)</code> que retorne "healthy" se todos estiverem up, "degraded" se pelo menos um mas não todos, e "unhealthy" se nenhum.</p>',
      dica: '<p>Conte quantos estão true e use switch ou if encadeado.</p>',
      inicial: go`
package main

import "fmt"

// Implemente healthCheck aqui

func main() {
    fmt.Println(healthCheck(true, true, true))
    fmt.Println(healthCheck(true, false, true))
    fmt.Println(healthCheck(false, false, false))
}

func healthCheck(dbUp, cacheUp, queueUp bool) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func healthCheck(dbUp, cacheUp, queueUp bool) string {
            count := 0
            if dbUp { count++ }
            if cacheUp { count++ }
            if queueUp { count++ }
            if count == 3 {
                return "healthy"
            }
            if count > 0 {
                return "degraded"
            }
            return "unhealthy"
        }

        func main() {
            fmt.Println(healthCheck(true, true, true))
            fmt.Println(healthCheck(true, false, true))
            fmt.Println(healthCheck(false, false, false))
        }
      `,
      testes: [{ saida: 'healthy\ndegraded\nunhealthy' }],
    }),
    problema({
      id: 'nuvem-prob-secret-rotate',
      titulo: 'Rotação de secrets',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>rotateSecret(vault map[string]string, name, newValue string)</code> que atualiza o secret e retorna o valor antigo. Se não existir, retorne "".</p>',
      dica: '<p>Leia o valor atual antes de sobrescrever.</p>',
      inicial: go`
package main

import "fmt"

// Implemente rotateSecret aqui

func main() {
    vault := map[string]string{"api_key": "old-key"}
    old := rotateSecret(vault, "api_key", "new-key")
    fmt.Println(old, vault["api_key"])
}

func rotateSecret(vault map[string]string, name, newValue string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func rotateSecret(vault map[string]string, name, newValue string) string {
            old := vault[name]
            vault[name] = newValue
            return old
        }

        func main() {
            vault := map[string]string{"api_key": "old-key"}
            old := rotateSecret(vault, "api_key", "new-key")
            fmt.Println(old, vault["api_key"])
        }
      `,
      testes: [{ saida: 'old-key new-key' }],
    }),
    problema({
      id: 'nuvem-prob-tag-cost',
      titulo: 'Calcular custo por tag',
      dificuldade: 'medio',
      enunciado: '<p>Dado um slice de <code>Resource{Name, Cost, Tags}</code>, implemente <code>costByTag(resources, tagKey, tagValue)</code> que soma o custo dos recursos com aquela tag.</p>',
      dica: '<p>Itere, verifique a tag e acumule o custo.</p>',
      inicial: go`
package main

import "fmt"

type Resource struct {
    Name string
    Cost int
    Tags map[string]string
}

// Implemente costByTag aqui

func main() {
    rs := []Resource{
        {Name: "a", Cost: 100, Tags: map[string]string{"env": "prod"}},
        {Name: "b", Cost: 50, Tags: map[string]string{"env": "dev"}},
        {Name: "c", Cost: 200, Tags: map[string]string{"env": "prod"}},
    }
    fmt.Println(costByTag(rs, "env", "prod"))
}

func costByTag(resources []Resource, tagKey, tagValue string) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        type Resource struct {
            Name string
            Cost int
            Tags map[string]string
        }

        func costByTag(resources []Resource, tagKey, tagValue string) int {
            total := 0
            for _, r := range resources {
                if v, ok := r.Tags[tagKey]; ok && v == tagValue {
                    total += r.Cost
                }
            }
            return total
        }

        func main() {
            rs := []Resource{
                {Name: "a", Cost: 100, Tags: map[string]string{"env": "prod"}},
                {Name: "b", Cost: 50, Tags: map[string]string{"env": "dev"}},
                {Name: "c", Cost: 200, Tags: map[string]string{"env": "prod"}},
            }
            fmt.Println(costByTag(rs, "env", "prod"))
        }
      `,
      testes: [{ saida: '300' }],
    }),
    problema({
      id: 'nuvem-prob-retry-exponential',
      titulo: 'Retry com backoff exponencial',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>retryWithBackoff(maxRetries int, call func(int) bool)</code> que tenta até maxRetries vezes. A função call recebe o número da tentativa (1-based). Retorne o número da tentativa em que teve sucesso, ou -1 se falhou todas.</p>',
      dica: '<p>Loop simples; o backoff é conceitual neste playground pois não temos sleep.</p>',
      inicial: go`
package main

import "fmt"

// Implemente retryWithBackoff aqui

func main() {
    result := retryWithBackoff(5, func(attempt int) bool {
        return attempt == 3
    })
    fmt.Println(result)
}

func retryWithBackoff(maxRetries int, call func(int) bool) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func retryWithBackoff(maxRetries int, call func(int) bool) int {
            for i := 1; i <= maxRetries; i++ {
                if call(i) {
                    return i
                }
            }
            return -1
        }

        func main() {
            result := retryWithBackoff(5, func(attempt int) bool {
                return attempt == 3
            })
            fmt.Println(result)
        }
      `,
      testes: [{ saida: '3' }],
    }),
    problema({
      id: 'nuvem-prob-circuit-state',
      titulo: 'Transições de circuit breaker',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>simulateBreaker(threshold, calls []bool)</code> que processa uma sequência de chamadas. Retorne um slice de strings com o resultado de cada chamada: "ok", "failure", ou "rejected". O circuito abre após threshold falhas consecutivas.</p>',
      dica: '<p>Mantenha contador de falhas consecutivas; resete em sucesso. Quando aberto, tudo é rejected.</p>',
      inicial: go`
package main

import "fmt"

// Implemente simulateBreaker aqui

func main() {
    results := simulateBreaker(2, []bool{true, false, false, true, false})
    for _, r := range results {
        fmt.Println(r)
    }
}

func simulateBreaker(threshold int, calls []bool) []string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func simulateBreaker(threshold int, calls []bool) []string {
            var results []string
            failures := 0
            open := false
            for _, success := range calls {
                if open {
                    results = append(results, "rejected")
                    continue
                }
                if success {
                    failures = 0
                    results = append(results, "ok")
                } else {
                    failures++
                    results = append(results, "failure")
                    if failures >= threshold {
                        open = true
                    }
                }
            }
            return results
        }

        func main() {
            results := simulateBreaker(2, []bool{true, false, false, true, false})
            for _, r := range results {
                fmt.Println(r)
            }
        }
      `,
      testes: [{ saida: 'ok\nfailure\nfailure\nrejected\nrejected' }],
    }),
    problema({
      id: 'nuvem-prob-sdk-error',
      titulo: 'Tratamento de erro em SDK',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>safePut(client, bucket, key, body)</code> que chama <code>client.PutObject</code> e retorna "ok" se Status começar com "created", ou a mensagem de erro caso contrário.</p>',
      dica: '<p>Verifique os primeiros caracteres de Status ou use comparação direta.</p>',
      inicial: go`
package main

import "fmt"

type Client struct{ region string }
type PutResult struct{ Key, Status string }

func (c Client) PutObject(bucket, key, body string) PutResult {
    if bucket == "" {
        return PutResult{Key: key, Status: "error: empty bucket"}
    }
    return PutResult{Key: key, Status: "created in " + c.region}
}

// Implemente safePut aqui

func main() {
    c := Client{region: "us-east-1"}
    fmt.Println(safePut(c, "bucket", "key", "data"))
    fmt.Println(safePut(c, "", "key", "data"))
}

func safePut(c Client, bucket, key, body string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        type Client struct{ region string }
        type PutResult struct{ Key, Status string }

        func (c Client) PutObject(bucket, key, body string) PutResult {
            if bucket == "" {
                return PutResult{Key: key, Status: "error: empty bucket"}
            }
            return PutResult{Key: key, Status: "created in " + c.region}
        }

        func safePut(c Client, bucket, key, body string) string {
            res := c.PutObject(bucket, key, body)
            if len(res.Status) >= 7 && res.Status[:7] == "created" {
                return "ok"
            }
            return res.Status
        }

        func main() {
            c := Client{region: "us-east-1"}
            fmt.Println(safePut(c, "bucket", "key", "data"))
            fmt.Println(safePut(c, "", "key", "data"))
        }
      `,
      testes: [{ saida: 'ok\nerror: empty bucket' }],
    }),
    problema({
      id: 'nuvem-prob-region-select',
      titulo: 'Selecionar região por latência',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>selectRegion(latencies map[string]int, maxLatency int)</code> que retorne o nome da região com menor latência que esteja abaixo de maxLatency. Se nenhuma, retorne "none".</p>',
      dica: '<p>Itere o map, filtre por maxLatency e rastreie o mínimo.</p>',
      inicial: go`
package main

import "fmt"

// Implemente selectRegion aqui

func main() {
    lats := map[string]int{"us": 20, "eu": 80, "asia": 200}
    fmt.Println(selectRegion(lats, 100))
    fmt.Println(selectRegion(lats, 10))
}

func selectRegion(latencies map[string]int, maxLatency int) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func selectRegion(latencies map[string]int, maxLatency int) string {
            best := "none"
            min := maxLatency
            for region, lat := range latencies {
                if lat < min {
                    min = lat
                    best = region
                }
            }
            return best
        }

        func main() {
            lats := map[string]int{"us": 20, "eu": 80, "asia": 200}
            fmt.Println(selectRegion(lats, 100))
            fmt.Println(selectRegion(lats, 10))
        }
      `,
      testes: [{ saida: 'us\nnone' }],
    }),
    problema({
      id: 'nuvem-prob-idempotent-process',
      titulo: 'Processador idempotente',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>processOrders(ids []string)</code> que processe cada ID apenas uma vez. Retorne o número de pedidos efetivamente processados (ignorando duplicatas).</p>',
      dica: '<p>Use um map para rastrear IDs já vistos.</p>',
      inicial: go`
package main

import "fmt"

// Implemente processOrders aqui

func main() {
    ids := []string{"a", "b", "a", "c", "b", "d"}
    fmt.Println(processOrders(ids))
}

func processOrders(ids []string) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func processOrders(ids []string) int {
            seen := map[string]bool{}
            count := 0
            for _, id := range ids {
                if !seen[id] {
                    seen[id] = true
                    count++
                }
            }
            return count
        }

        func main() {
            ids := []string{"a", "b", "a", "c", "b", "d"}
            fmt.Println(processOrders(ids))
        }
      `,
      testes: [{ saida: '4' }],
    }),
    problema({
      id: 'nuvem-prob-log-filter',
      titulo: 'Filtrar logs por nível',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>filterLogs(logs []string, level string)</code> que retorne apenas as linhas que começam com "[LEVEL]" onde LEVEL é o parâmetro dado.</p>',
      dica: '<p>Construa o prefixo "[" + level + "]" e compare o início de cada string.</p>',
      inicial: go`
package main

import "fmt"

// Implemente filterLogs aqui

func main() {
    logs := []string{"[INFO] started", "[ERROR] fail", "[INFO] ok", "[WARN] slow"}
    filtered := filterLogs(logs, "ERROR")
    for _, l := range filtered {
        fmt.Println(l)
    }
}

func filterLogs(logs []string, level string) []string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func filterLogs(logs []string, level string) []string {
            prefix := "[" + level + "]"
            var result []string
            for _, log := range logs {
                if len(log) >= len(prefix) && log[:len(prefix)] == prefix {
                    result = append(result, log)
                }
            }
            return result
        }

        func main() {
            logs := []string{"[INFO] started", "[ERROR] fail", "[INFO] ok", "[WARN] slow"}
            filtered := filterLogs(logs, "ERROR")
            for _, l := range filtered {
                fmt.Println(l)
            }
        }
      `,
      testes: [{ saida: '[ERROR] fail' }],
    }),
    problema({
      id: 'nuvem-prob-feature-toggle',
      titulo: 'Toggle de feature com porcentagem',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>shouldEnable(userID int, percentage int)</code> que retorne true se userID % 100 &lt; percentage. Isso simula rollout gradual.</p>',
      dica: '<p>Operador módulo determina o bucket do usuário.</p>',
      inicial: go`
package main

import "fmt"

// Implemente shouldEnable aqui

func main() {
    fmt.Println(shouldEnable(42, 50))
    fmt.Println(shouldEnable(99, 50))
    fmt.Println(shouldEnable(10, 10))
}

func shouldEnable(userID int, percentage int) bool {
  // TODO: implemente
  return false
}
`,
      solucao: go`
        package main

        import "fmt"

        func shouldEnable(userID int, percentage int) bool {
            return userID%100 < percentage
        }

        func main() {
            fmt.Println(shouldEnable(42, 50))
            fmt.Println(shouldEnable(99, 50))
            fmt.Println(shouldEnable(10, 10))
        }
      `,
      testes: [{ saida: 'true\nfalse\nfalse' }],
    }),
    problema({
      id: 'nuvem-prob-vault-audit',
      titulo: 'Audit de acesso a secrets',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>auditAccess(logs []AccessLog)</code> que conte quantos acessos foram negados (Success == false). AccessLog tem campos Who, Secret, Success.</p>',
      dica: '<p>Loop simples com contador condicional.</p>',
      inicial: go`
package main

import "fmt"

type AccessLog struct {
    Who     string
    Secret  string
    Success bool
}

// Implemente auditAccess aqui

func main() {
    logs := []AccessLog{
        {"alice", "db_pass", true},
        {"bob", "api_key", false},
        {"carol", "db_pass", false},
        {"alice", "api_key", true},
    }
    fmt.Println(auditAccess(logs))
}

func auditAccess(logs []AccessLog) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        type AccessLog struct {
            Who     string
            Secret  string
            Success bool
        }

        func auditAccess(logs []AccessLog) int {
            denied := 0
            for _, l := range logs {
                if !l.Success {
                    denied++
                }
            }
            return denied
        }

        func main() {
            logs := []AccessLog{
                {"alice", "db_pass", true},
                {"bob", "api_key", false},
                {"carol", "db_pass", false},
                {"alice", "api_key", true},
            }
            fmt.Println(auditAccess(logs))
        }
      `,
      testes: [{ saida: '2' }],
    }),
    problema({
      id: 'nuvem-prob-storage-delete-prefix',
      titulo: 'Deletar por prefixo',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>deletePrefix(store map[string]string, prefix string)</code> que remova todas as chaves começando com prefix. Retorne o número de chaves removidas.</p>',
      dica: '<p>Colete as chaves a deletar primeiro, depois delete-as para evitar modificar o map durante iteração.</p>',
      inicial: go`
package main

import "fmt"

// Implemente deletePrefix aqui

func main() {
    store := map[string]string{
        "tmp/a": "1", "tmp/b": "2", "perm/c": "3",
    }
    removed := deletePrefix(store, "tmp/")
    fmt.Println(removed, len(store))
}

func deletePrefix(store map[string]string, prefix string) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func deletePrefix(store map[string]string, prefix string) int {
            var toDelete []string
            for k := range store {
                if len(k) >= len(prefix) && k[:len(prefix)] == prefix {
                    toDelete = append(toDelete, k)
                }
            }
            for _, k := range toDelete {
                delete(store, k)
            }
            return len(toDelete)
        }

        func main() {
            store := map[string]string{
                "tmp/a": "1", "tmp/b": "2", "perm/c": "3",
            }
            removed := deletePrefix(store, "tmp/")
            fmt.Println(removed, len(store))
        }
      `,
      testes: [{ saida: '2 1' }],
    }),
    problema({
      id: 'nuvem-prob-grpc-stream',
      titulo: 'Stream gRPC simulado',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>streamEvents(count int)</code> que retorne um slice de strings "event-N" para N de 1 a count. Simula server streaming.</p>',
      dica: '<p>Loop for clássico construindo o slice.</p>',
      inicial: go`
package main

import "fmt"

// Implemente streamEvents aqui

func main() {
    events := streamEvents(3)
    for _, e := range events {
        fmt.Println(e)
    }
}

func streamEvents(count int) []string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func streamEvents(count int) []string {
            events := make([]string, count)
            for i := 0; i < count; i++ {
                events[i] = fmt.Sprintf("event-%d", i+1)
            }
            return events
        }

        func main() {
            events := streamEvents(3)
            for _, e := range events {
                fmt.Println(e)
            }
        }
      `,
      testes: [{ saida: 'event-1\nevent-2\nevent-3' }],
    }),
    problema({
      id: 'nuvem-prob-config-validate',
      titulo: 'Validar configuração',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>validateConfig(cfg Config)</code> que retorne um slice de erros (strings). Erros: "host required" se Host vazio, "port must be positive" se Port &lt;= 0.</p>',
      dica: '<p>Verifique cada campo e append ao slice de erros.</p>',
      inicial: go`
package main

import "fmt"

type Config struct {
    Host string
    Port int
}

// Implemente validateConfig aqui

func main() {
    errs := validateConfig(Config{Host: "", Port: -1})
    for _, e := range errs {
        fmt.Println(e)
    }
}

func validateConfig(cfg Config) []string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        type Config struct {
            Host string
            Port int
        }

        func validateConfig(cfg Config) []string {
            var errs []string
            if cfg.Host == "" {
                errs = append(errs, "host required")
            }
            if cfg.Port <= 0 {
                errs = append(errs, "port must be positive")
            }
            return errs
        }

        func main() {
            errs := validateConfig(Config{Host: "", Port: -1})
            for _, e := range errs {
                fmt.Println(e)
            }
        }
      `,
      testes: [{ saida: 'host required\nport must be positive' }],
    }),
    problema({
      id: 'nuvem-prob-infra-scale',
      titulo: 'Auto-scaling simulado',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>desiredInstances(cpuPercent, current, min, max int)</code>. Se cpu > 80, dobre current (até max). Se cpu < 20, reduza à metade (até min). Caso contrário, mantenha.</p>',
      dica: '<p>Três branches com clamp nos limites.</p>',
      inicial: go`
package main

import "fmt"

// Implemente desiredInstances aqui

func main() {
    fmt.Println(desiredInstances(90, 2, 1, 10))
    fmt.Println(desiredInstances(10, 8, 1, 10))
    fmt.Println(desiredInstances(50, 4, 1, 10))
}

func desiredInstances(cpuPercent, current, min, max int) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func desiredInstances(cpuPercent, current, min, max int) int {
            if cpuPercent > 80 {
                doubled := current * 2
                if doubled > max {
                    return max
                }
                return doubled
            }
            if cpuPercent < 20 {
                halved := current / 2
                if halved < min {
                    return min
                }
                return halved
            }
            return current
        }

        func main() {
            fmt.Println(desiredInstances(90, 2, 1, 10))
            fmt.Println(desiredInstances(10, 8, 1, 10))
            fmt.Println(desiredInstances(50, 4, 1, 10))
        }
      `,
      testes: [{ saida: '4\n4\n4' }],
    }),
    problema({
      id: 'nuvem-prob-secret-mask',
      titulo: 'Mascarar secrets em logs',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>maskSecret(text, secret string)</code> que substitua todas as ocorrências de secret em text por "***".</p>',
      dica: '<p>Percorra o texto procurando o segredo; construa o resultado sem usar strings.Replace (não disponível).</p>',
      inicial: go`
package main

import "fmt"

// Implemente maskSecret aqui

func main() {
    fmt.Println(maskSecret("token=abc123 and abc123 again", "abc123"))
}

func maskSecret(text, secret string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func maskSecret(text, secret string) string {
            if secret == "" {
                return text
            }
            result := ""
            i := 0
            for i < len(text) {
                if i+len(secret) <= len(text) && text[i:i+len(secret)] == secret {
                    result += "***"
                    i += len(secret)
                } else {
                    result += string(text[i])
                    i++
                }
            }
            return result
        }

        func main() {
            fmt.Println(maskSecret("token=abc123 and abc123 again", "abc123"))
        }
      `,
      testes: [{ saida: 'token=*** and *** again' }],
    }),
    problema({
      id: 'nuvem-prob-health-degraded-detail',
      titulo: 'Detalhar status degradado',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>healthDetail(components map[string]bool)</code> que retorne "healthy" se todos true, "unhealthy" se todos false, ou "degraded: X down" onde X é o número de componentes false.</p>',
      dica: '<p>Conte falses e use fmt.Sprintf para formatar.</p>',
      inicial: go`
package main

import "fmt"

// Implemente healthDetail aqui

func main() {
    fmt.Println(healthDetail(map[string]bool{"db": true, "cache": true}))
    fmt.Println(healthDetail(map[string]bool{"db": false, "cache": true, "queue": false}))
    fmt.Println(healthDetail(map[string]bool{"db": false}))
}

func healthDetail(components map[string]bool) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func healthDetail(components map[string]bool) string {
            total := len(components)
            downs := 0
            for _, up := range components {
                if !up {
                    downs++
                }
            }
            if downs == 0 {
                return "healthy"
            }
            if downs == total {
                return "unhealthy"
            }
            return fmt.Sprintf("degraded: %d down", downs)
        }

        func main() {
            fmt.Println(healthDetail(map[string]bool{"db": true, "cache": true}))
            fmt.Println(healthDetail(map[string]bool{"db": false, "cache": true, "queue": false}))
            fmt.Println(healthDetail(map[string]bool{"db": false}))
        }
      `,
      testes: [{ saida: 'healthy\ndegraded: 2 down\nunhealthy' }],
    }),
    problema({
      id: 'nuvem-prob-sdk-pagination',
      titulo: 'Paginação em SDK',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>fetchAllPages(totalItems, pageSize int)</code> que retorne um slice de ints representando páginas (1, 2, 3...) necessárias para cobrir totalItems.</p>',
      dica: '<p>Divisão inteira com arredondamento para cima: (total + size - 1) / size.</p>',
      inicial: go`
package main

import "fmt"

// Implemente fetchAllPages aqui

func main() {
    pages := fetchAllPages(25, 10)
    for _, p := range pages {
        fmt.Println(p)
    }
}

func fetchAllPages(totalItems, pageSize int) []int {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func fetchAllPages(totalItems, pageSize int) []int {
            totalPages := (totalItems + pageSize - 1) / pageSize
            pages := make([]int, totalPages)
            for i := 0; i < totalPages; i++ {
                pages[i] = i + 1
            }
            return pages
        }

        func main() {
            pages := fetchAllPages(25, 10)
            for _, p := range pages {
                fmt.Println(p)
            }
        }
      `,
      testes: [{ saida: '1\n2\n3' }],
    }),
    problema({
      id: 'nuvem-prob-env-parse-int',
      titulo: 'Parsear env var numérica',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>getIntEnv(envs map[string]string, key string, defaultVal int)</code>. Se a chave existe e o valor é "42", retorne 42. Caso contrário, retorne defaultVal. Simplificação: só reconheça "42", "8080", "3000" como válidos.</p>',
      dica: '<p>Switch ou if chain mapeando strings conhecidas para ints.</p>',
      inicial: go`
package main

import "fmt"

// Implemente getIntEnv aqui

func main() {
    envs := map[string]string{"PORT": "8080", "TIMEOUT": "xyz"}
    fmt.Println(getIntEnv(envs, "PORT", 3000))
    fmt.Println(getIntEnv(envs, "TIMEOUT", 30))
    fmt.Println(getIntEnv(envs, "MISSING", 99))
}

func getIntEnv(envs map[string]string, key string, defaultVal int) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func getIntEnv(envs map[string]string, key string, defaultVal int) int {
            val, ok := envs[key]
            if !ok {
                return defaultVal
            }
            if val == "42" { return 42 }
            if val == "8080" { return 8080 }
            if val == "3000" { return 3000 }
            return defaultVal
        }

        func main() {
            envs := map[string]string{"PORT": "8080", "TIMEOUT": "xyz"}
            fmt.Println(getIntEnv(envs, "PORT", 3000))
            fmt.Println(getIntEnv(envs, "TIMEOUT", 30))
            fmt.Println(getIntEnv(envs, "MISSING", 99))
        }
      `,
      testes: [{ saida: '8080\n30\n99' }],
    }),
    problema({
      id: 'nuvem-prob-storage-size',
      titulo: 'Tamanho total do storage',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>totalSize(store map[string]string)</code> que retorne a soma dos comprimentos de todos os valores.</p>',
      dica: '<p>Itere o map e some len(value).</p>',
      inicial: go`
package main

import "fmt"

// Implemente totalSize aqui

func main() {
    store := map[string]string{"a": "hello", "b": "world!", "c": "go"}
    fmt.Println(totalSize(store))
}

func totalSize(store map[string]string) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func totalSize(store map[string]string) int {
            total := 0
            for _, v := range store {
                total += len(v)
            }
            return total
        }

        func main() {
            store := map[string]string{"a": "hello", "b": "world!", "c": "go"}
            fmt.Println(totalSize(store))
        }
      `,
      testes: [{ saida: '13' }],
    }),
    problema({
      id: 'nuvem-prob-grpc-interceptor',
      titulo: 'Interceptor gRPC simulado',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>withLogging(handler func(string) string, name string)</code> que retorne uma nova função que, ao ser chamada, imprime "calling NAME" e depois retorna o resultado do handler.</p>',
      dica: '<p>Retorne uma closure que wrapa o handler. Note: closures são suportadas.</p>',
      inicial: go`
package main

import "fmt"

// Implemente withLogging aqui

func greet(input string) string {
    return "hello " + input
}

func main() {
    logged := withLogging(greet, "greet")
    fmt.Println(logged("world"))
}

func withLogging(handler func(string) string, name string) func(string) string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func withLogging(handler func(string) string, name string) func(string) string {
            return func(input string) string {
                fmt.Println("calling " + name)
                return handler(input)
            }
        }

        func greet(input string) string {
            return "hello " + input
        }

        func main() {
            logged := withLogging(greet, "greet")
            fmt.Println(logged("world"))
        }
      `,
      testes: [{ saida: 'calling greet\nhello world' }],
    }),
    problema({
      id: 'nuvem-prob-infra-drift',
      titulo: 'Detectar drift de configuração',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>detectDrift(desired, actual map[string]string)</code> que retorne um slice de chaves onde os valores diferem. Ignore chaves presentes apenas em um dos maps.</p>',
      dica: '<p>Itere desired, verifique se a chave existe em actual e compare.</p>',
      inicial: go`
package main

import "fmt"

// Implemente detectDrift aqui

func main() {
    desired := map[string]string{"port": "8080", "host": "0.0.0.0", "debug": "false"}
    actual := map[string]string{"port": "3000", "host": "0.0.0.0", "extra": "val"}
    drifts := detectDrift(desired, actual)
    for _, d := range drifts {
        fmt.Println(d)
    }
}

func detectDrift(desired, actual map[string]string) []string {
  // TODO: implemente
  return nil
}
`,
      solucao: go`
        package main

        import "fmt"

        func detectDrift(desired, actual map[string]string) []string {
            var drifts []string
            for k, dv := range desired {
                if av, ok := actual[k]; ok && av != dv {
                    drifts = append(drifts, k)
                }
            }
            return drifts
        }

        func main() {
            desired := map[string]string{"port": "8080", "host": "0.0.0.0", "debug": "false"}
            actual := map[string]string{"port": "3000", "host": "0.0.0.0", "extra": "val"}
            drifts := detectDrift(desired, actual)
            for _, d := range drifts {
                fmt.Println(d)
            }
        }
      `,
      testes: [{ saida: 'port' }],
    }),
    problema({
      id: 'nuvem-prob-retry-budget',
      titulo: 'Budget de retries',
      dificuldade: 'dificil',
      enunciado: '<p>Implemente <code>retryWithBudget(maxTotal int, costs []int)</code> que processe tentativas sequencialmente enquanto o custo acumulado não exceder maxTotal. Retorne quantas tentativas foram feitas.</p>',
      dica: '<p>Acumule custos; pare quando ultrapassar o budget.</p>',
      inicial: go`
package main

import "fmt"

// Implemente retryWithBudget aqui

func main() {
    fmt.Println(retryWithBudget(10, []int{3, 4, 5, 2}))
}

func retryWithBudget(maxTotal int, costs []int) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func retryWithBudget(maxTotal int, costs []int) int {
            used := 0
            attempts := 0
            for _, c := range costs {
                if used+c > maxTotal {
                    break
                }
                used += c
                attempts++
            }
            return attempts
        }

        func main() {
            fmt.Println(retryWithBudget(10, []int{3, 4, 5, 2}))
        }
      `,
      testes: [{ saida: '2' }],
    }),
    problema({
      id: 'nuvem-prob-multi-env-config',
      titulo: 'Config multi-ambiente',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>configForEnv(env string)</code> que retorne Config{Host, Port}. dev: localhost/3000, staging: staging.local/8080, prod: prod.local/443. Default: localhost/8080.</p>',
      dica: '<p>Switch no env string.</p>',
      inicial: go`
package main

import "fmt"

type Config struct {
    Host string
    Port int
}

// Implemente configForEnv aqui

func main() {
    fmt.Println(configForEnv("prod"))
    fmt.Println(configForEnv("unknown"))
}

func configForEnv(env string) Config {
  // TODO: implemente
  return Config{}
}
`,
      solucao: go`
        package main

        import "fmt"

        type Config struct {
            Host string
            Port int
        }

        func configForEnv(env string) Config {
            switch env {
            case "dev":
                return Config{Host: "localhost", Port: 3000}
            case "staging":
                return Config{Host: "staging.local", Port: 8080}
            case "prod":
                return Config{Host: "prod.local", Port: 443}
            default:
                return Config{Host: "localhost", Port: 8080}
            }
        }

        func main() {
            fmt.Println(configForEnv("prod"))
            fmt.Println(configForEnv("unknown"))
        }
      `,
      testes: [{ saida: '{prod.local 443}\n{localhost 8080}' }],
    }),
    problema({
      id: 'nuvem-prob-storage-copy',
      titulo: 'Copiar objeto entre buckets',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>copyObject(store map[string]string, src, dst string)</code> que copie o valor de src para dst. Se src não existir, não faça nada. Retorne true se copiou, false caso contrário.</p>',
      dica: '<p>Verifique existência com comma-ok idiom antes de atribuir.</p>',
      inicial: go`
package main

import "fmt"

// Implemente copyObject aqui

func main() {
    store := map[string]string{"a": "hello", "b": "world"}
    fmt.Println(copyObject(store, "a", "c"))
    fmt.Println(copyObject(store, "missing", "d"))
    fmt.Println(store["c"])
}

func copyObject(store map[string]string, src, dst string) bool {
  // TODO: implemente
  return false
}
`,
      solucao: go`
        package main

        import "fmt"

        func copyObject(store map[string]string, src, dst string) bool {
            if v, ok := store[src]; ok {
                store[dst] = v
                return true
            }
            return false
        }

        func main() {
            store := map[string]string{"a": "hello", "b": "world"}
            fmt.Println(copyObject(store, "a", "c"))
            fmt.Println(copyObject(store, "missing", "d"))
            fmt.Println(store["c"])
        }
      `,
      testes: [{ saida: 'true\nfalse\nhello' }],
    }),
    problema({
      id: 'nuvem-prob-grpc-metadata',
      titulo: 'Metadata em chamada gRPC',
      dificuldade: 'medio',
      enunciado: '<p>Implemente <code>checkAuth(metadata map[string]string)</code> que retorne "authorized" se metadata contiver chave "token" com valor "valid-token", ou "unauthorized" caso contrário.</p>',
      dica: '<p>Acesse o map com comma-ok e compare o valor.</p>',
      inicial: go`
package main

import "fmt"

// Implemente checkAuth aqui

func main() {
    fmt.Println(checkAuth(map[string]string{"token": "valid-token"}))
    fmt.Println(checkAuth(map[string]string{"token": "bad"}))
    fmt.Println(checkAuth(map[string]string{}))
}

func checkAuth(metadata map[string]string) string {
  // TODO: implemente
  return ""
}
`,
      solucao: go`
        package main

        import "fmt"

        func checkAuth(metadata map[string]string) string {
            if token, ok := metadata["token"]; ok && token == "valid-token" {
                return "authorized"
            }
            return "unauthorized"
        }

        func main() {
            fmt.Println(checkAuth(map[string]string{"token": "valid-token"}))
            fmt.Println(checkAuth(map[string]string{"token": "bad"}))
            fmt.Println(checkAuth(map[string]string{}))
        }
      `,
      testes: [{ saida: 'authorized\nunauthorized\nunauthorized' }],
    }),
    problema({
      id: 'nuvem-prob-infra-capacity',
      titulo: 'Calcular capacidade restante',
      dificuldade: 'facil',
      enunciado: '<p>Implemente <code>remainingCapacity(total, used int)</code> que retorne a diferença. Se used > total, retorne 0 (não negativo).</p>',
      dica: '<p>Subtração simples com guarda contra negativo.</p>',
      inicial: go`
package main

import "fmt"

// Implemente remainingCapacity aqui

func main() {
    fmt.Println(remainingCapacity(100, 70))
    fmt.Println(remainingCapacity(50, 80))
}

func remainingCapacity(total, used int) int {
  // TODO: implemente
  return 0
}
`,
      solucao: go`
        package main

        import "fmt"

        func remainingCapacity(total, used int) int {
            if used > total {
                return 0
            }
            return total - used
        }

        func main() {
            fmt.Println(remainingCapacity(100, 70))
            fmt.Println(remainingCapacity(50, 80))
        }
      `,
      testes: [{ saida: '30\n0' }],
    }),
    ...extraNuvem,
  ],
};