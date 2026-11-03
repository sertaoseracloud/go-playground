// Glossário de termos Go: definições e exemplos rápidos.
// Substitui o markup estático com busca reativa e navegação por letra.
import { useState, useMemo } from 'react';

const TERMOS = [
  { termo: 'Array', definicao: 'Coleção de tamanho fixo de elementos do mesmo tipo.', exemplo: 'var nums [5]int' },
  { termo: 'Channel', definicao: 'Canal de comunicação entre goroutines para envio e recebimento de valores.', exemplo: 'ch := make(chan int)' },
  { termo: 'Closure', definicao: 'Função que captura variáveis do escopo onde foi definida.', exemplo: 'func() int { return x + 1 }' },
  { termo: 'Defer', definicao: 'Adia a execução de uma função até que a função atual retorne.', exemplo: 'defer file.Close()' },
  { termo: 'Goroutine', definicao: 'Thread leve gerenciada pelo runtime do Go; concorrencia barata.', exemplo: 'go func() { ... }()' },
  { termo: 'Interface', definicao: 'Conjunto de métodos que um tipo deve implementar; tipagem estrutural.', exemplo: 'type Reader interface { Read([]byte) (int, error) }' },
  { termo: 'Map', definicao: 'Estrutura chave-valor sem ordem garantida.', exemplo: 'm := map[string]int{"a": 1}' },
  { termo: 'Package', definicao: 'Unidade de organização e reutilização de código em Go.', exemplo: 'package main' },
  { termo: 'Pointer', definicao: 'Referência ao endereço de memória de uma variável.', exemplo: 'p := &x' },
  { termo: 'Range', definicao: 'Iterador sobre arrays, slices, maps, strings e channels.', exemplo: 'for i, v := range slice { ... }' },
  { termo: 'Slice', definicao: 'Visão dinâmica e redimensionável sobre um array subjacente.', exemplo: 's := []int{1, 2, 3}' },
  { termo: 'Struct', definicao: 'Tipo composto que agrupa campos nomeados.', exemplo: 'type Pessoa struct { Nome string; Idade int }' },
];

export default function GlossarioGo() {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return TERMOS;
    return TERMOS.filter(
      (t) => t.termo.toLowerCase().includes(q) || t.definicao.toLowerCase().includes(q),
    );
  }, [busca]);

  const letras = useMemo(() => {
    const conjunto = new Set(filtrados.map((t) => t.termo[0].toUpperCase()));
    return Array.from(conjunto).sort();
  }, [filtrados]);

  return (
    <section className="glossario">
      <header className="glossario-header">
        <h1>📖 Glossário Go</h1>
        <p className="subtitulo">Termos essenciais da linguagem com definições curtas e exemplos.</p>
      </header>

      <div className="glossario-busca">
        <input
          type="search"
          placeholder="Buscar termo ou definição…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar no glossário"
        />
      </div>

      {letras.length > 0 && (
        <nav className="glossario-letras" aria-label="Índice alfabético">
          {letras.map((l) => (
            <a key={l} href={`#letra-${l}`} className="letra-link">
              {l}
            </a>
          ))}
        </nav>
      )}

      <div className="glossario-lista">
        {filtrados.length === 0 && <p className="glossario-vazio">Nenhum termo encontrado.</p>}
        {letras.map((l) => (
          <div key={l} id={`letra-${l}`} className="glossario-grupo">
            <h2>{l}</h2>
            <dl>
              {filtrados
                .filter((t) => t.termo[0].toUpperCase() === l)
                .map((t) => (
                  <div key={t.termo} className="glossario-item">
                    <dt>{t.termo}</dt>
                    <dd>
                      <p>{t.definicao}</p>
                      <pre><code>{t.exemplo}</code></pre>
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}