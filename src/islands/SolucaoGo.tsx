// Página de solução: visualizador de soluções de exercícios com código e explicações.
// Substitui o markup estático com navegação reativa entre soluções.
import { useState, useEffect } from 'react';

const SOLUCOES = [
  {
    id: 'ola-mundo',
    titulo: 'Olá, Mundo!',
    modulo: 'Básico',
    dificuldade: 'Fácil',
    codigo: `package main

import "fmt"

func main() {
    fmt.Println("Olá, Mundo!")
}`,
    explicacao: 'O programa mais simples em Go usa fmt.Println para imprimir uma linha no terminal. A função main é o ponto de entrada de todo programa Go.',
  },
  {
    id: 'soma-dois-numeros',
    titulo: 'Soma de dois números',
    modulo: 'Básico',
    dificuldade: 'Fácil',
    codigo: `package main

import "fmt"

func soma(a, b int) int {
    return a + b
}

func main() {
    resultado := soma(3, 5)
    fmt.Println(resultado)
}`,
    explicacao: 'Funções em Go podem receber múltiplos parâmetros do mesmo tipo usando sintaxe abreviada (a, b int). O retorno é declarado após os parênteses.',
  },
  {
    id: 'fibonacci',
    titulo: 'Sequência de Fibonacci',
    modulo: 'Básico',
    dificuldade: 'Médio',
    codigo: `package main

import "fmt"

func fibonacci(n int) []int {
    if n <= 0 {
        return []int{}
    }
    fib := make([]int, n)
    fib[0] = 0
    if n > 1 {
        fib[1] = 1
    }
    for i := 2; i < n; i++ {
        fib[i] = fib[i-1] + fib[i-2]
    }
    return fib
}

func main() {
    seq := fibonacci(10)
    fmt.Println(seq)
}`,
    explicacao: 'Slices são criados com make(tipo, tamanho). Cada elemento da sequência é a soma dos dois anteriores. O loop começa em 2 porque os primeiros dois valores já foram definidos.',
  },
];

export default function SolucaoGo() {
  const [solucaoId, setSolucaoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id && SOLUCOES.find((s) => s.id === id)) {
        setSolucaoId(id);
      }
    } catch {}
    setCarregando(false);
  }, []);

  const solucaoAtual = solucaoId ? SOLUCOES.find((s) => s.id === solucaoId) : null;

  if (carregando) {
    return (
      <section className="solucao">
        <p>Carregando solução…</p>
      </section>
    );
  }

  if (!solucaoAtual) {
    return (
      <section className="solucao solucao-indice">
        <h1>💡 Soluções de exercícios</h1>
        <p className="subtitulo">
          Consulte soluções comentadas para os exercícios da trilha. Use como referência depois de tentar resolver por conta própria.
        </p>

        <nav className="solucao-lista">
          {SOLUCOES.map((sol) => (
            <a
              key={sol.id}
              href={`${import.meta.env.BASE_URL}solucao/?id=${sol.id}`}
              className="card-solucao"
            >
              <span className="solucao-modulo">{sol.modulo}</span>
              <h2>{sol.titulo}</h2>
              <span className={`solucao-dificuldade dif-${sol.dificuldade.toLowerCase()}`}>
                {sol.dificuldade}
              </span>
            </a>
          ))}
        </nav>
      </section>
    );
  }

  return (
    <section className="solucao solucao-detalhe">
      <header className="solucao-header">
        <a href={`${import.meta.env.BASE_URL}solucao/`} className="btn btn-fantasma btn-pequeno">
          ← Voltar ao índice
        </a>
        <h1>{solucaoAtual.titulo}</h1>
        <div className="solucao-meta">
          <span className="solucao-modulo">{solucaoAtual.modulo}</span>
          <span className={`solucao-dificuldade dif-${solucaoAtual.dificuldade.toLowerCase()}`}>
            {solucaoAtual.dificuldade}
          </span>
        </div>
      </header>

      <article className="solucao-codigo">
        <h2>Código</h2>
        <pre>
          <code>{solucaoAtual.codigo}</code>
        </pre>
      </article>

      <article className="solucao-explicacao">
        <h2>Explicação</h2>
        <p>{solucaoAtual.explicacao}</p>
      </article>

      <div className="solucao-acoes">
        <a
          href={`${import.meta.env.BASE_URL}livre/?codigo=${encodeURIComponent(solucaoAtual.codigo)}`}
          className="btn btn-verde"
        >
          ▶️ Executar no playground livre
        </a>
      </div>
    </section>
  );
}