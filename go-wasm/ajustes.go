// Contornos para bugs do yaegi v0.16.3 que um aluno encontra com código Go comum.
// Cada um tem um teste em executar_test.go; quando o yaegi corrigir, o teste
// "sem o ajuste" passa a mostrar isso e o contorno pode sair.
package main

import (
	"errors"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"reflect"
	"sort"
	"strings"

	simbolos "divergego/go-wasm/simbolos"
)

// reescrever ajusta o código-fonte antes de entregá-lo ao yaegi, sem mudar o que o
// programa faz e sem mudar linhas (as mensagens de erro continuam apontando a linha certa):
//
//   - um laço `for` ou `range` com corpo vazio (`for i := 0; i < n; i++ {}`) faz o yaegi
//     pular tudo o que vem depois na função: o corpo ganha um `_ = 0`;
//   - `return <-ch` falha com "reflect.Value.Set using unaddressable value": a recepção
//     vai para uma variável antes (`{ _dg1 := <-ch; return _dg1 }`);
//   - `return a, len(x)` grava o len no resultado errado ("SetInt on slice Value"), e
//     `return a, append(a, 1)` devolve o slice sem o elemento novo: len, cap e append
//     escritos direto num resultado que não é o primeiro também vão para uma variável antes;
//   - `for _, c := range canais` sobre um slice de canais dá "reflect: call of
//     reflect.Value.Len on int Value": quando o tipo `[]chan T` / `...<-chan T` está escrito
//     na declaração de `canais`, o laço passa a usar o índice (`for i := range canais
//     { c := canais[i]; ... }`).
//
// Código que não compila volta como veio, para o yaegi dar a mensagem de erro.
func reescrever(src string) string {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, "main.go", src, parser.SkipObjectResolution)
	if err != nil {
		return src
	}
	type edicao struct {
		ini, fim int
		texto    string
	}
	var edicoes []edicao
	pos := func(p token.Pos) int { return fset.Position(p).Offset }
	corpoVazio := func(b *ast.BlockStmt) {
		if b != nil && len(b.List) == 0 && b.Lbrace.IsValid() {
			edicoes = append(edicoes, edicao{pos(b.Lbrace) + 1, pos(b.Lbrace) + 1, " _ = 0 "})
		}
	}
	// precisaTemporaria diz se o resultado i de um return cai num dos bugs do yaegi.
	precisaTemporaria := func(r ast.Expr, i int) bool {
		e := ast.Unparen(r)
		if u, ok := e.(*ast.UnaryExpr); ok && u.Op == token.ARROW {
			return true
		}
		chamada, ok := e.(*ast.CallExpr)
		if !ok || i == 0 {
			return false
		}
		nome, ok := chamada.Fun.(*ast.Ident)
		if !ok {
			return false
		}
		switch nome.Name {
		case "append":
			return true
		case "len", "cap":
			// len("abc") é uma constante sem tipo; numa variável viraria int.
			if len(chamada.Args) != 1 {
				return false
			}
			_, constante := ast.Unparen(chamada.Args[0]).(*ast.BasicLit)
			return !constante
		}
		return false
	}
	pais := mapaDePais(f)
	temporarias := 0
	ast.Inspect(f, func(n ast.Node) bool {
		switch x := n.(type) {
		case *ast.ForStmt:
			corpoVazio(x.Body)
		case *ast.RangeStmt:
			corpoVazio(x.Body)
			if valor, ok := x.Value.(*ast.Ident); ok && valor.Name != "_" && x.Tok == token.DEFINE {
				if lista, ok := x.X.(*ast.Ident); ok && sliceDeCanais(lista, x, pais) {
					temporarias++
					indice := fmt.Sprintf("_dg%d", temporarias)
					edicoes = append(edicoes, edicao{pos(x.Key.Pos()), pos(x.X.End()), indice + " := range " + lista.Name})
					inicio := " " + valor.Name + " := " + lista.Name + "[" + indice + "];"
					if chave, ok := x.Key.(*ast.Ident); ok && chave.Name != "_" {
						inicio += " " + chave.Name + " := " + indice + ";"
					}
					edicoes = append(edicoes, edicao{pos(x.Body.Lbrace) + 1, pos(x.Body.Lbrace) + 1, inicio})
				}
			}
		case *ast.ReturnStmt:
			var antes []string
			resultados := make([]string, len(x.Results))
			for i, r := range x.Results {
				resultados[i] = src[pos(r.Pos()):pos(r.End())]
				if precisaTemporaria(r, i) {
					temporarias++
					nome := fmt.Sprintf("_dg%d", temporarias)
					antes = append(antes, nome+" := "+resultados[i])
					resultados[i] = nome
				}
			}
			if len(antes) > 0 {
				edicoes = append(edicoes, edicao{pos(x.Pos()), pos(x.End()),
					"{ " + strings.Join(antes, "; ") + "; return " + strings.Join(resultados, ", ") + " }"})
			}
		}
		return true
	})
	if len(edicoes) == 0 {
		return src
	}
	// Aplica do fim para o começo; uma edição que se sobrepõe a outra já aplicada é ignorada.
	sort.Slice(edicoes, func(a, b int) bool { return edicoes[a].ini > edicoes[b].ini })
	limite := len(src) + 1
	for _, e := range edicoes {
		if e.fim > limite {
			continue
		}
		src = src[:e.ini] + e.texto + src[e.fim:]
		limite = e.ini
	}
	return src
}

// comoErro substitui errors.As. O errors.As da biblioteca padrão não reconhece um tipo
// do programa do aluno (`var ev *ErroValidacao; errors.As(err, &ev)` entra em panic com
// "*target must be interface or implement error"), porque os métodos de tipos
// interpretados não aparecem para o reflect. Aqui a cadeia de Unwrap é percorrida e cada
// erro é comparado pelo tipo, inclusive o valor que o yaegi guarda dentro do embrulho.
func comoErro(err error, alvo any) bool {
	if alvo == nil {
		panic("errors: target cannot be nil")
	}
	v := reflect.ValueOf(alvo)
	if v.Kind() != reflect.Pointer || v.IsNil() {
		panic("errors: target must be a non-nil pointer")
	}
	tipo := v.Type().Elem()
	if tipo.Kind() == reflect.Interface {
		return errors.As(err, alvo)
	}
	for err != nil {
		for _, c := range candidatos(err) {
			if c.Type().AssignableTo(tipo) {
				v.Elem().Set(c)
				return true
			}
		}
		if x, ok := err.(interface{ As(any) bool }); ok && x.As(alvo) {
			return true
		}
		switch u := err.(type) {
		case interface{ Unwrap() error }:
			err = u.Unwrap()
		case interface{ Unwrap() []error }:
			for _, e := range u.Unwrap() {
				if comoErro(e, alvo) {
					return true
				}
			}
			return false
		default:
			return false
		}
	}
	return false
}

// candidatos devolve o erro e, se ele for um embrulho do yaegi (struct com o campo
// IValue), também o valor do programa que está dentro.
func candidatos(err error) []reflect.Value {
	v := reflect.ValueOf(err)
	c := []reflect.Value{v}
	s := v
	if s.Kind() == reflect.Pointer && !s.IsNil() {
		s = s.Elem()
	}
	if s.Kind() == reflect.Struct {
		if f := s.FieldByName("IValue"); f.IsValid() && f.CanInterface() {
			if dentro := reflect.ValueOf(f.Interface()); dentro.IsValid() {
				c = append(c, dentro)
			}
		}
	}
	return c
}

// Ao passar um valor do programa para fmt.Println, fmt.Errorf e afins, o yaegi só preserva
// os métodos das interfaces listadas em MapTypes (Formatter e Stringer). Sem `error` na
// lista, fmt.Errorf("...: %w", &MeuErro{}) não embrulha o erro (sai "%!w(...)") e
// fmt.Println(&MeuErro{}) não chama Error(). A ordem segue a do fmt: Formatter, error, Stringer.
func init() {
	formatter := reflect.TypeOf((*fmt.Formatter)(nil)).Elem()
	erro := reflect.TypeOf((*error)(nil)).Elem()
	for chave, tipos := range simbolos.MapTypes {
		if len(tipos) > 0 && tipos[0] == formatter {
			simbolos.MapTypes[chave] = append([]reflect.Type{formatter, erro}, tipos[1:]...)
		}
	}
}

// mapaDePais liga cada nó da árvore ao nó que o contém.
func mapaDePais(f *ast.File) map[ast.Node]ast.Node {
	pais := map[ast.Node]ast.Node{}
	var pilha []ast.Node
	ast.Inspect(f, func(n ast.Node) bool {
		if n == nil {
			pilha = pilha[:len(pilha)-1]
			return true
		}
		if len(pilha) > 0 {
			pais[n] = pilha[len(pilha)-1]
		}
		pilha = append(pilha, n)
		return true
	})
	return pais
}

// sliceDeCanais diz se `nome`, no ponto `onde`, foi declarado com um tipo slice de canais
// escrito na declaração: parâmetro `cs []chan T` ou `cs ...<-chan T`, `var cs []chan T`,
// `cs := make([]chan T, n)` ou `cs := []chan T{...}`. Procura da declaração mais próxima
// para fora; se não achar ou o tipo não estiver escrito, responde false.
func sliceDeCanais(nome *ast.Ident, onde ast.Node, pais map[ast.Node]ast.Node) bool {
	ehSliceDeCanal := func(t ast.Expr) bool {
		switch t := t.(type) {
		case *ast.ArrayType:
			_, ok := t.Elt.(*ast.ChanType)
			return t.Len == nil && ok
		case *ast.Ellipsis:
			_, ok := t.Elt.(*ast.ChanType)
			return ok
		}
		return false
	}
	// declaradoEm procura `nome` nas declarações de um comando; achou indica se ele está lá.
	declaradoEm := func(s ast.Node) (achou, slice bool) {
		switch s := s.(type) {
		case *ast.DeclStmt:
			if g, ok := s.Decl.(*ast.GenDecl); ok {
				for _, spec := range g.Specs {
					if v, ok := spec.(*ast.ValueSpec); ok {
						for _, n := range v.Names {
							if n.Name == nome.Name {
								return true, v.Type != nil && ehSliceDeCanal(v.Type)
							}
						}
					}
				}
			}
		case *ast.AssignStmt:
			if s.Tok != token.DEFINE {
				return false, false
			}
			for i, lhs := range s.Lhs {
				if id, ok := lhs.(*ast.Ident); ok && id.Name == nome.Name {
					if len(s.Rhs) != len(s.Lhs) {
						return true, false
					}
					switch r := s.Rhs[i].(type) {
					case *ast.CallExpr:
						if f, ok := r.Fun.(*ast.Ident); ok && f.Name == "make" && len(r.Args) > 0 {
							return true, ehSliceDeCanal(r.Args[0])
						}
					case *ast.CompositeLit:
						return true, ehSliceDeCanal(r.Type)
					}
					return true, false
				}
			}
		}
		return false, false
	}
	filho := onde
	for no := pais[onde]; no != nil; filho, no = no, pais[no] {
		switch no := no.(type) {
		case *ast.BlockStmt:
			for _, s := range no.List {
				if s == filho {
					break
				}
				if achou, slice := declaradoEm(s); achou {
					return slice
				}
			}
		case *ast.FuncDecl, *ast.FuncLit:
			var tipo *ast.FuncType
			if d, ok := no.(*ast.FuncDecl); ok {
				tipo = d.Type
			} else {
				tipo = no.(*ast.FuncLit).Type
			}
			if tipo.Params != nil {
				for _, campo := range tipo.Params.List {
					for _, n := range campo.Names {
						if n.Name == nome.Name {
							return ehSliceDeCanal(campo.Type)
						}
					}
				}
			}
		case *ast.File:
			for _, d := range no.Decls {
				if g, ok := d.(*ast.GenDecl); ok {
					if achou, slice := declaradoEm(&ast.DeclStmt{Decl: g}); achou {
						return slice
					}
				}
			}
		}
	}
	return false
}
