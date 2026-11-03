// Glossário: cada termo técnico com uma explicação simples, uma analogia do dia a
// dia e um exemplo curto. A descrição de cada desafio mostra os termos que aparecem
// no texto dele (até MAX_TERMOS, na ordem em que aparecem), para não sobrecarregar.
//
// `padroes` são regex (sem flags; usamos 'iu'), testadas no texto visível do desafio.
// Bordas de palavra são tratadas em `termosDoTexto`, porque \b não entende acentos.

export const MAX_TERMOS = 6;

export const GLOSSARIO = [
  // ---------- Básico ----------
  {
    id: 'package', termo: 'package', padroes: ['package'],
    definicao: 'Declaração que define a qual pacote um arquivo pertence. Todo programa executável usa package main.',
    analogia: 'Como o nome da pasta onde você guarda seus arquivos: diz a qual grupo aquele código pertence.',
    exemplo: 'package main\n\nimport "fmt"',
  },
  {
    id: 'func', termo: 'func', padroes: ['func'],
    definicao: 'Palavra-chave para declarar funções. func main() é o ponto de entrada de programas executáveis.',
    analogia: 'Como uma receita de bolo: você dá um nome, lista os ingredientes (parâmetros) e descreve o preparo.',
    exemplo: 'func soma(a, b int) int {\n  return a + b\n}',
  },
  {
    id: 'import', termo: 'import', padroes: ['import'],
    definicao: 'Importa pacotes da biblioteca padrão ou de terceiros. Ex: import "fmt".',
    analogia: 'Como pedir emprestado um livro da biblioteca: você traz ferramentas prontas para usar no seu código.',
    exemplo: 'import (\n  "fmt"\n  "math"\n)',
  },
  {
    id: 'var', termo: 'var', padroes: ['var'],
    definicao: 'Declara uma variável com tipo explícito. Pode ser usada fora de funções.',
    analogia: 'Uma caixa com etiqueta: a etiqueta é o nome, o tipo diz o que cabe dentro (número, texto, etc.).',
    exemplo: 'var nome string\nvar idade int = 17',
  },
  {
    id: 'declaracao-curta', termo: ':=', padroes: [':='],
    definicao: 'Operador de declaração curta. Declara e inicializa uma variável dentro de funções, inferindo o tipo.',
    analogia: 'Como anotar um recado rápido: você escreve o valor e o Go já sabe que tipo é pela caneta que você usou.',
    exemplo: 'nome := "Ana"\nidade := 17',
  },
  {
    id: 'const', termo: 'const', padroes: ['const'],
    definicao: 'Declara uma constante. O valor não pode mudar após a declaração.',
    analogia: 'Como a data do seu aniversário: todo mundo sabe, ninguém muda.',
    exemplo: 'const pi = 3.14159\nconst maxTentativas = 3',
  },

  // ---------- Tipos compostos ----------
  {
    id: 'struct', termo: 'struct', padroes: ['struct'],
    definicao: 'Tipo composto que agrupa campos nomeados. Similar a classes em outras linguagens, mas sem herança.',
    analogia: 'Uma ficha de cadastro: cada campo (nome, idade, email) tem seu lugar e seu tipo.',
    exemplo: 'type Aluno struct {\n  Nome  string\n  Idade int\n}',
  },
  {
    id: 'interface', termo: 'interface', padroes: ['interface'],
    definicao: 'Tipo que define um conjunto de métodos. Qualquer tipo que implemente esses métodos satisfaz a interface.',
    analogia: 'Como um contrato: se você cumpre todas as cláusulas (métodos), o contrato vale, não importa quem você é.',
    exemplo: 'type Leitor interface {\n  Ler(p []byte) (int, error)\n}',
  },
  {
    id: 'slice', termo: 'slice', padroes: ['slices?', '\\[\\][a-z]'],
    definicao: 'Visão dinâmica sobre um array. Mais usado que arrays fixos. Suporta append, len, cap.',
    analogia: 'Uma fila de banco: cresce quando chega gente nova, encolhe quando alguém é atendido.',
    exemplo: 'nums := []int{1, 2, 3}\nnums = append(nums, 4)',
  },
  {
    id: 'map', termo: 'map', padroes: ['maps?', 'map\\['],
    definicao: 'Coleção de pares chave-valor. Não ordenada. Criada com make(map[K]V) ou literal map[K]V{...}.',
    analogia: 'Uma agenda de contatos: você procura pelo nome (chave) e encontra o telefone (valor).',
    exemplo: 'idades := map[string]int{\n  "Ana": 17,\n  "Beto": 16,\n}',
  },
  {
    id: 'range', termo: 'range', padroes: ['range'],
    definicao: 'Itera sobre slices, maps, strings e channels. Retorna índice/chave e valor.',
    analogia: 'Como passar as páginas de um livro: a cada página (item), você vê o número dela e o conteúdo.',
    exemplo: 'for i, v := range nums {\n  fmt.Println(i, v)\n}',
  },

  // ---------- Concorrência ----------
  {
    id: 'goroutine', termo: 'goroutine', padroes: ['goroutines?', '\\bgo\\s+func'],
    definicao: 'Thread leve gerenciada pelo runtime do Go. Criada com go func(). Milhares podem rodar simultaneamente.',
    analogia: 'Como vários cozinheiros numa cozinha: cada um faz sua parte ao mesmo tempo, sem precisar esperar o outro terminar.',
    exemplo: 'go func() {\n  fmt.Println("rodando em paralelo")\n}()',
  },
  {
    id: 'channel', termo: 'channel', padroes: ['channels?', '<-'],
    definicao: 'Canal tipado para comunicação entre goroutines. Usa <- para enviar e receber valores.',
    analogia: 'Um tubo entre duas pessoas: uma coloca uma mensagem de um lado, a outra pega do outro.',
    exemplo: 'ch := make(chan int)\ngo func() { ch <- 42 }()\nval := <-ch',
  },

  // ---------- Controle e erros ----------
  {
    id: 'defer', termo: 'defer', padroes: ['defer'],
    definicao: 'Adia a execução de uma função até o retorno da função atual. Usado para cleanup (fechar arquivos, liberar recursos).',
    analogia: 'Como deixar a porta aberta antes de entrar: você garante que ela vai ser fechada quando sair, mesmo se algo der errado.',
    exemplo: 'f, _ := os.Open("arquivo.txt")\ndefer f.Close()',
  },
  {
    id: 'error', termo: 'error', padroes: ['error', '\\bnil\\b'],
    definicao: 'Interface built-in para representar erros. Funções retornam error como último valor; nil significa sucesso.',
    analogia: 'Como um sinal de trânsito quebrado: se está verde (nil), tudo bem; se está vermelho (erro), pare e verifique.',
    exemplo: 'if err != nil {\n  log.Fatal(err)\n}',
  },

  // ---------- Módulos ----------
  {
    id: 'go-mod', termo: 'go.mod', padroes: ['go\\.mod', 'go mod'],
    definicao: 'Arquivo que define o módulo Go, suas dependências e versões. Criado com go mod init.',
    analogia: 'Como a lista de ingredientes de uma receita: diz exatamente o que você precisa e em qual quantidade.',
    exemplo: 'module exemplo.com/meuprojeto\n\ngo 1.21',
  },
];

// Letras (com acento), dígitos, _ e $ contam como parte de uma palavra.
const LETRA = '[\\p{L}\\p{N}_$]';
const REGEX = new Map(GLOSSARIO.map((t) => [
  t.id,
  new RegExp(`(?<!${LETRA})(?:${t.padroes.join('|')})(?!${LETRA})`, 'iu'),
]));

// Nível de cada termo: o módulo em que ele aparece primeiro (a ordem do glossário).
const ORDEM_MODULOS = ['basico', 'tipos', 'concorrencia', 'projetos'];
const INICIO_DO_NIVEL = { basico: 'package', tipos: 'struct', concorrencia: 'goroutine', projetos: 'go-mod' };
const NIVEL = new Map();
{
  let nivel = 0;
  for (const t of GLOSSARIO) {
    const novo = Object.entries(INICIO_DO_NIVEL).find(([, id]) => id === t.id);
    if (novo) nivel = ORDEM_MODULOS.indexOf(novo[0]);
    NIVEL.set(t.id, nivel);
  }
}

/**
 * Termos do glossário que aparecem no texto, na ordem em que aparecem.
 * Se passarem de `max`, ficam os do nível do módulo (ou o mais próximo dele):
 * num projeto, channel e goroutine importam mais do que "package", já visto no começo.
 */
export function termosDoTexto(texto, { max = MAX_TERMOS, modulo } = {}) {
  const nivelItem = modulo ? ORDEM_MODULOS.indexOf(modulo) : Infinity;
  const prioridade = (t) => Math.min(NIVEL.get(t.id), nivelItem);
  return GLOSSARIO
    .map((t) => ({ termo: t, posicao: texto.search(REGEX.get(t.id)) }))
    .filter((x) => x.posicao >= 0)
    .sort((a, b) => prioridade(b.termo) - prioridade(a.termo) || a.posicao - b.posicao)
    .slice(0, max)
    .sort((a, b) => a.posicao - b.posicao)
    .map((x) => x.termo);
}

/** Busca um termo no glossário (case-insensitive). */
export function buscarTermo(termo) {
  const t = termo.toLowerCase();
  return GLOSSARIO.find((g) => g.termo.toLowerCase() === t);
}