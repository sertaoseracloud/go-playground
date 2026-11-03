// Página de referência da linguagem Go: sintaxe, tipos e conceitos fundamentais.
// Substitui o markup estático com navegação reativa entre seções.
import { useState } from 'react';

const SECOES = [
  {
    id: 'basico',
    titulo: '📦 Básico',
    conteudo: [
      { subtitulo: 'Declaração de variáveis', exemplo: 'var nome string = "Go"\nidade := 30' },
      { subtitulo: 'Funções', exemplo: 'func soma(a, b int) int {\n  return a + b\n}' },
      { subtitulo: 'Estruturas de controle', exemplo: 'if x > 0 {\n  fmt.Println("positivo")\n} else {\n  fmt.Println("não positivo")\n}' },
    ],
  },
  {
    id: 'tipos',
    titulo: '🏷️ Tipos',
    conteudo: [
      { subtitulo: 'Tipos primitivos', exemplo: 'bool, string, int, int8, int16, int32, int64\nuint, uint8, uint16, uint32, uint64\nfloat32, float64, complex64, complex128' },
      { subtitulo: 'Slices', exemplo: 'nums := []int{1, 2, 3}\nnums = append(nums, 4)' },
      { subtitulo: 'Maps', exemplo: 'cores := map[string]string{\n  "vermelho": "#ff0000",\n  "verde": "#00ff00",\n}' },
    ],
  },
  {
    id: 'concorrencia',
    titulo: '⚡ Concorrência',
    conteudo: [
      { subtitulo: 'Goroutines', exemplo: 'go func() {\n  fmt.Println("rodando em paralelo")\n}()' },
      { subtitulo: 'Channels', exemplo: 'ch := make(chan int)\ngo func() { ch <- 42 }()\nvalor := <-ch' },
      { subtitulo: 'Select', exemplo: 'select {\ncase msg := <-ch1:\n  fmt.Println(msg)\ncase ch2 <- 1:\n  fmt.Println("enviado")\ndefault:\n  fmt.Println("nenhum caso pronto")\n}' },
    ],
  },
  {
    id: 'interfaces',
    titulo: '🔌 Interfaces',
    conteudo: [
      { subtitulo: 'Definição', exemplo: 'type Leitor interface {\n  Ler(p []byte) (n int, err error)\n}' },
      { subtitulo: 'Implementação implícita', exemplo: 'type Arquivo struct{}\nfunc (a *Arquivo) Ler(p []byte) (int, error) {\n  // implementação\n  return 0, nil\n}' },
    ],
  },
];

export default function LinguagemGo() {
  const [secaoAtiva, setSecaoAtiva] = useState(SECOES[0].id);

  const secaoAtual = SECOES.find((s) => s.id === secaoAtiva) || SECOES[0];

  return (
    <section className="linguagem-go">
      <header className="linguagem-header">
        <h1>📘 Referência da linguagem Go</h1>
        <p className="subtitulo">
          Sintaxe, tipos e conceitos fundamentais de Go organizados por categoria.
        </p>
      </header>

      <nav className="linguagem-nav">
        {SECOES.map((secao) => (
          <button
            key={secao.id}
            type="button"
            className={`btn-nav ${secaoAtiva === secao.id ? 'ativa' : ''}`}
            onClick={() => setSecaoAtiva(secao.id)}
          >
            {secao.titulo}
          </button>
        ))}
      </nav>

      <article className="linguagem-conteudo">
        <h2>{secaoAtual.titulo}</h2>
        {secaoAtual.conteudo.map((item, idx) => (
          <div key={idx} className="linguagem-item">
            <h3>{item.subtitulo}</h3>
            <pre>
              <code>{item.exemplo}</code>
            </pre>
          </div>
        ))}
      </article>

      <footer className="linguagem-footer">
        <p>
          Para a documentação completa, consulte{' '}
          <a href="https://go.dev/doc/" target="_blank" rel="noopener noreferrer">
            go.dev/doc
          </a>.
        </p>
      </footer>
    </section>
  );
}