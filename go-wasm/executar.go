// Execução de um programa Go do aluno no yaegi. Fica fora do arquivo js/wasm para poder
// ser testado com `go test` (veja executar_test.go) e usado pela linha de comando (nativo.go).
package main

import (
	"bytes"
	"fmt"
	"os"
	"reflect"
	"sort"
	"strings"
	"testing/fstest"

	"github.com/traefik/yaegi/interp"

	simbolos "divergego/go-wasm/simbolos"
)

// limiteSaida evita que um laço infinito com Println esgote a memória da aba.
const limiteSaida = 1 << 20

type saidaLimitada struct {
	buf     bytes.Buffer
	cortada bool
}

func (s *saidaLimitada) Write(p []byte) (int, error) {
	if s.buf.Len()+len(p) > limiteSaida {
		if !s.cortada {
			s.buf.Write(p[:max(0, limiteSaida-s.buf.Len())])
			s.buf.WriteString("\n[saída cortada: passou de 1 MB]\n")
			s.cortada = true
		}
		return len(p), nil
	}
	return s.buf.Write(p)
}

// saidaDoPrograma é o valor do panic usado no lugar de os.Exit, para não encerrar o runtime.
type saidaDoPrograma struct{ codigo int }

const pastaMain = "src/main"

func novoInterpretador(arquivos map[string]string, stdin string, out, errb *saidaLimitada, soCompilar bool) (*interp.Interpreter, []string, error) {
	fsys := fstest.MapFS{}
	var nomes []string
	for nome, conteudo := range arquivos {
		if strings.HasSuffix(nome, ".go") && !strings.HasSuffix(nome, "_test.go") && !strings.Contains(nome, "/") {
			fsys[pastaMain+"/"+nome] = &fstest.MapFile{Data: []byte(reescrever(conteudo))}
			nomes = append(nomes, nome)
		}
	}
	sort.Strings(nomes)
	if len(nomes) == 0 {
		return nil, nil, fmt.Errorf("nenhum arquivo .go para compilar")
	}

	// os.Stdin/os.Stdout do programa são leitores/escritores em memória: sem isto o yaegi
	// só troca os.Stdin se ele for um *os.File (lido em interp.New).
	os.Setenv("YAEGI_SPECIAL_STDIO", "1")
	// O yaegi lê YAEGI_NO_RUN em interp.New: compila sem executar.
	if soCompilar {
		os.Setenv("YAEGI_NO_RUN", "1")
		defer os.Unsetenv("YAEGI_NO_RUN")
	}
	i := interp.New(interp.Options{
		Stdin:                strings.NewReader(stdin),
		Stdout:               out,
		Stderr:               errb,
		GoPath:               "/",
		Args:                 []string{"main"},
		SourcecodeFilesystem: fsys,
	})
	if err := i.Use(simbolos.Symbols); err != nil {
		return nil, nil, err
	}
	sair := func(c int) { panic(saidaDoPrograma{c}) }
	ajustes := interp.Exports{
		"os/os":         {"Exit": reflect.ValueOf(sair)},
		"errors/errors": {"As": reflect.ValueOf(comoErro)},
	}
	if err := i.Use(ajustes); err != nil {
		return nil, nil, err
	}
	return i, nomes, nil
}

// avaliar compila e (se não for só compilação) executa o pacote main.
func avaliar(i *interp.Interpreter, nomes []string) error {
	// Com um arquivo só, avalia o arquivo (o nome aparece nas mensagens de erro);
	// com vários, avalia a pasta como um pacote.
	caminho := pastaMain
	if len(nomes) == 1 {
		caminho += "/" + nomes[0]
	}
	_, err := i.EvalPath(caminho)
	return err
}

// mensagem deixa os erros do yaegi parecidos com os do `go build`.
func mensagem(err error, nomes []string) string {
	m := strings.TrimSpace(err.Error())
	m = strings.ReplaceAll(m, pastaMain+"/", "./")
	if len(nomes) == 1 && !strings.HasPrefix(m, "./") && len(m) > 0 && m[0] >= '0' && m[0] <= '9' {
		m = "./" + nomes[0] + ":" + m
	}
	return m
}

func compilar(arquivos map[string]string) (erros []string) {
	var out, errb saidaLimitada
	defer func() {
		if r := recover(); r != nil {
			erros = append(erros, fmt.Sprint(r))
		}
	}()
	i, nomes, err := novoInterpretador(arquivos, "", &out, &errb, true)
	if err == nil {
		err = avaliar(i, nomes)
	}
	if err != nil {
		return []string{mensagem(err, nomes)}
	}
	return nil
}

func rodar(arquivos map[string]string, stdin string) (stdout, stderr string, codigo int) {
	var out, errb saidaLimitada
	var valorPanic any
	panicou := false
	defer func() {
		if r := recover(); r != nil {
			valorPanic, panicou = r, true
		}
		if panicou {
			codigo = 2
			if s, ok := valorPanic.(saidaDoPrograma); ok {
				codigo = s.codigo
			}
		}
		stdout = out.buf.String()
		stderr = formatarStderr(errb.buf.String(), valorPanic, panicou)
	}()
	i, nomes, err := novoInterpretador(arquivos, stdin, &out, &errb, false)
	if err == nil {
		err = avaliar(i, nomes)
	}
	if p, ok := err.(interp.Panic); ok {
		valorPanic, panicou = p.Value, true
	} else if err != nil {
		fmt.Fprintln(&errb, mensagem(err, nomes))
		codigo = 1
	}
	return
}

// formatarStderr deixa o stderr parecido com o do Go: "panic: ..." primeiro e as linhas
// de chamada do yaegi ("./main.go:9:3: panic: main.f(...)") como pilha. Num os.Exit, a
// pilha some (no Go, os.Exit não imprime nada).
func formatarStderr(texto string, valorPanic any, panicou bool) string {
	texto = strings.ReplaceAll(texto, pastaMain+"/", "./")
	var pilha, resto []string
	for _, linha := range strings.SplitAfter(texto, "\n") {
		if panicou && ehLinhaDePilha(linha) {
			pilha = append(pilha, linha)
		} else if linha != "" {
			resto = append(resto, linha)
		}
	}
	b := strings.Join(resto, "")
	if !panicou {
		return b
	}
	if _, ok := valorPanic.(saidaDoPrograma); ok {
		return b
	}
	b += fmt.Sprintf("panic: %v\n", valorPanic)
	if len(pilha) > 0 {
		b += "\ngoroutine 1 [running]:\n"
		for _, l := range pilha {
			// "./main.go:9:3: panic: main.f(...)" vira "main.f(...)", e embaixo "\t./main.go:9:3".
			pos, chamada, _ := strings.Cut(strings.TrimSpace(l), ": panic: ")
			b += chamada + "\n\t" + pos + "\n"
		}
	}
	return b
}

func ehLinhaDePilha(linha string) bool {
	pos, chamada, ok := strings.Cut(strings.TrimSpace(linha), ": panic: ")
	return ok && strings.HasPrefix(pos, "./") && strings.HasSuffix(chamada, ")")
}
