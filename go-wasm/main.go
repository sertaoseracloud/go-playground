//go:build js && wasm

// Runtime Go do DivergeGo no navegador.
//
// Este programa é compilado com GOOS=js GOARCH=wasm (veja scripts/construir-go-wasm.mjs)
// e embute o interpretador yaegi (github.com/traefik/yaegi) com uma parte da biblioteca
// padrão. O código do aluno é Go de verdade: maps, goroutines, canais, genéricos,
// encoding/json, sort, net/http e httptest rodam com as implementações reais do Go.
//
// Expõe duas funções para o JavaScript (src/go/go-worker.js):
//
//	__divergeGoCompilar(arquivos)        -> Promise<{ erros: string[] }>
//	__divergeGoRodar(arquivos, stdin)    -> Promise<{ stdout, stderr, exitCode }>
//
// `arquivos` é um objeto { "main.go": "..." }; só os arquivos .go entram no programa.
package main

import (
	"context"
	"net"
	"net/http"
	"syscall/js"
)

func lerArquivos(v js.Value) map[string]string {
	arquivos := map[string]string{}
	if v.Type() != js.TypeObject {
		return arquivos
	}
	chaves := js.Global().Get("Object").Call("keys", v)
	for k := 0; k < chaves.Length(); k++ {
		nome := chaves.Index(k).String()
		if c := v.Get(nome); c.Type() == js.TypeString {
			arquivos[nome] = c.String()
		}
	}
	return arquivos
}

// promessa roda fn numa goroutine e devolve uma Promise: o callback de js.FuncOf
// não pode bloquear (time.Sleep e canais dependem do laço de eventos do JS).
func promessa(fn func() any) js.Value {
	return js.Global().Get("Promise").New(js.FuncOf(func(_ js.Value, pr []js.Value) any {
		go func() { pr[0].Invoke(fn()) }()
		return nil
	}))
}

func main() {
	// No navegador não há sockets: o pacote net do Go para js/wasm usa uma rede em memória.
	// Por padrão o cliente HTTP chamaria fetch(); discando direto, httptest.NewServer + http.Get
	// conversam por essa rede em memória, sem sair da aba.
	var d net.Dialer
	if t, ok := http.DefaultTransport.(*http.Transport); ok {
		t.DialContext = func(ctx context.Context, network, addr string) (net.Conn, error) {
			return d.DialContext(ctx, network, addr)
		}
	}

	js.Global().Set("__divergeGoCompilar", js.FuncOf(func(_ js.Value, args []js.Value) any {
		arquivos := lerArquivos(args[0])
		return promessa(func() any {
			lista := []any{}
			for _, e := range compilar(arquivos) {
				lista = append(lista, e)
			}
			return map[string]any{"erros": lista}
		})
	}))
	js.Global().Set("__divergeGoRodar", js.FuncOf(func(_ js.Value, args []js.Value) any {
		arquivos := lerArquivos(args[0])
		stdin := ""
		if len(args) > 1 && args[1].Type() == js.TypeString {
			stdin = args[1].String()
		}
		return promessa(func() any {
			o, e, c := rodar(arquivos, stdin)
			return map[string]any{"stdout": o, "stderr": e, "exitCode": c}
		})
	}))
	if f := js.Global().Get("__divergeGoPronto"); f.Type() == js.TypeFunction {
		f.Invoke()
	}
	select {}
}
