package main

import (
	"strings"
	"testing"
)

func rodarMain(t *testing.T, src, stdin string) (string, string, int) {
	t.Helper()
	return rodar(map[string]string{"main.go": src}, stdin)
}

func TestAjustesDoYaegi(t *testing.T) {
	casos := []struct {
		nome, src, saida string
	}{
		{"for com init e corpo vazio", `package main
import "fmt"
func main() {
	f := func() { for i := 0; i < 3; i++ {}; fmt.Println("depois do laço") }
	f()
	for i := 0; i < 3; i++ {}
	fmt.Println("fim")
}`, "depois do laço\nfim\n"},
		{"range sobre slice com corpo vazio", `package main
import "fmt"
func main() { s := []int{1, 2}; for range s {}; for _, x := range s {}; fmt.Println("ok") }`, "ok\n"},
		{"return <-canal", `package main
import "fmt"
func f(c chan int) int { return <-c }
func g(c chan error) error { return (<-c) }
func h(c chan int) (int, error) { return <-c, nil }
func main() {
	c := make(chan int, 2); c <- 5; c <- 6
	e := make(chan error, 1); close(e)
	fmt.Println(f(c), g(e))
	fmt.Println(h(c))
}`, "5 <nil>\n6 <nil>\n"},
		{"len, cap e append num resultado que não é o primeiro", `package main
import "fmt"
type Item struct{ ID int }
func inserir(t []Item, novos []Item) ([]Item, int) { t = append(t, novos...); return t, len(novos) }
func f(ys []int) (string, int, int, error) { return "a", len(ys), cap(ys[:1]), nil }
func g(ys []int) ([]int, []int) { return ys, append(ys, 1) }
func main() {
	t, n := inserir([]Item{{1}}, []Item{{2}, {3}})
	fmt.Println(len(t), n)
	fmt.Println(f([]int{2, 3}))
	fmt.Println(g([]int{2, 3}))
}`, "3 2\na 2 2 <nil>\n[2 3] [2 3 1]\n"},
		{"range sobre slice de canais (fan-in)", `package main
import ("fmt"; "sort"; "sync")
func fonte(nome string, n int) <-chan string {
	ch := make(chan string)
	go func() { defer close(ch); for i := 1; i <= n; i++ { ch <- fmt.Sprintf("%s%d", nome, i) } }()
	return ch
}
func juntar(canais ...<-chan string) <-chan string {
	saida := make(chan string)
	var wg sync.WaitGroup
	for _, c := range canais {
		wg.Add(1)
		go func(c <-chan string) { defer wg.Done(); for v := range c { saida <- v } }(c)
	}
	go func() { wg.Wait(); close(saida) }()
	return saida
}
func main() {
	todos := []string{}
	for v := range juntar(fonte("a", 2), fonte("b", 1)) { todos = append(todos, v) }
	sort.Strings(todos)
	fmt.Println(todos)
	feitos := make([]chan int, 2)
	for i := range feitos { feitos[i] = make(chan int, 1); feitos[i] <- i * 10 }
	for i, c := range feitos { fmt.Println(i, <-c) }
	var lista []chan int = feitos
	for _, c := range lista { close(c) }
	canais := map[string]int{"x": 1}
	for k, v := range canais { fmt.Println(k, v) }
}`, "[a1 a2 b1]\n0 0\n1 10\nx 1\n"},
		{"fmt com error e Stringer do programa", `package main
import "fmt"
type E struct{ Campo string }
func (e *E) Error() string { return "campo: " + e.Campo }
type S struct{ N int }
func (s S) String() string { return fmt.Sprint("S#", s.N) }
func main() {
	fmt.Println(&E{"a"}, S{2})
	fmt.Println(fmt.Errorf("x: %w", &E{"b"}))
}`, "campo: a S#2\nx: campo: b\n"},
		{"errors.As com tipo do programa", `package main
import ("errors"; "fmt")
type ErroValidacao struct{ Campo string }
func (e *ErroValidacao) Error() string { return "campo inválido: " + e.Campo }
type Outro struct{}
func (Outro) Error() string { return "outro" }
func main() {
	var err error = fmt.Errorf("buscar: %w", &ErroValidacao{"id"})
	var ev *ErroValidacao
	fmt.Println(errors.As(err, &ev), ev.Campo)
	var o Outro
	fmt.Println(errors.As(err, &o))
	var direto error = &ErroValidacao{"nome"}
	fmt.Println(errors.As(direto, &ev), ev.Campo)
	var junto error = &ErroValidacao{"junto"}
	fmt.Println(errors.As(errors.Join(errors.New("a"), junto), &ev), ev.Campo)
}`, "true id\nfalse\ntrue nome\ntrue junto\n"},
	}
	for _, c := range casos {
		t.Run(c.nome, func(t *testing.T) {
			out, errOut, codigo := rodarMain(t, c.src, "")
			if out != c.saida || codigo != 0 {
				t.Errorf("saída %q (código %d, stderr %q), esperado %q", out, codigo, errOut, c.saida)
			}
		})
	}
}

func TestReescreverPreservaLinhas(t *testing.T) {
	src := "package main\nfunc f(c chan int) int {\n\tfor i := 0; i < 2; i++ {}\n\treturn <-c\n}\nfunc main() {}\n"
	got := reescrever(src)
	if strings.Count(got, "\n") != strings.Count(src, "\n") {
		t.Fatalf("mudou o número de linhas:\n%s", got)
	}
	if reescrever("package main\nfunc main() {") != "package main\nfunc main() {" {
		t.Fatal("código que não compila deve voltar como veio")
	}
}

func TestStdinSaidaEPanic(t *testing.T) {
	out, _, codigo := rodarMain(t, `package main
import ("bufio"; "fmt"; "os")
func main() {
	s := bufio.NewScanner(os.Stdin)
	for s.Scan() { fmt.Println(">", s.Text()) }
	os.Exit(3)
}`, "a\nb\n")
	if out != "> a\n> b\n" || codigo != 3 {
		t.Errorf("stdin/os.Exit: %q, código %d", out, codigo)
	}

	_, errOut, codigo := rodarMain(t, `package main
func main() { var m map[string]int; m["a"] = 1 }`, "")
	if codigo != 2 || !strings.HasPrefix(errOut, "panic: assignment to entry in nil map\n") || !strings.Contains(errOut, "./main.go:2:") {
		t.Errorf("panic: código %d, stderr %q", codigo, errOut)
	}

	if erros := compilar(map[string]string{"main.go": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(y) }"}); len(erros) != 1 || !strings.HasPrefix(erros[0], "./main.go:3:") {
		t.Errorf("erro de compilação: %q", erros)
	}
}
