//go:build !(js && wasm)

// Linha de comando para depurar o runtime fora do navegador, com o mesmo interpretador,
// os mesmos pacotes e os mesmos ajustes:
//
//	go run . main.go [outro.go ...] < entrada.txt
package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "uso: go run . main.go [outros.go] < entrada")
		os.Exit(2)
	}
	arquivos := map[string]string{}
	for _, caminho := range os.Args[1:] {
		b, err := os.ReadFile(caminho)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		arquivos[filepath.Base(caminho)] = string(b)
	}
	stdin, _ := io.ReadAll(os.Stdin)
	for _, e := range compilar(arquivos) {
		fmt.Fprintln(os.Stderr, e)
		os.Exit(1)
	}
	out, errOut, codigo := rodar(arquivos, string(stdin))
	fmt.Print(out)
	fmt.Fprint(os.Stderr, errOut)
	os.Exit(codigo)
}
