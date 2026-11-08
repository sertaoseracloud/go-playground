// Falas dos moradores dos cenários da trilha (src/ui/cenarios): clicar ou tocar num personagem, ou
// abrir "Conhecer a vila", mostra a definição curta de um conceito do curso, para revisar. Texto
// simples, sem resposta de exercício e sem detalhe de como a correção funciona. Cada site tem as suas.
export const FALAS_DA_VILA = {
  // Oficina do Básico
  'mestre-go': { nome: 'Mestre Go', falas: [
    'Pacote: todo arquivo Go começa com package; o programa executável fica no package main, com a função main.',
    'Variável: um nome que guarda um valor. Dentro de funções, := declara e já infere o tipo.',
    'Função: um bloco com nome, parâmetros com tipo e, se precisar, um ou mais valores de retorno.',
  ] },
  'aprendiz-basico': { nome: 'Aprendiz', falas: [
    'Slice: uma lista que cresce; append acrescenta itens e len diz quantos ela tem.',
    'Map: guarda pares de chave e valor, como um dicionário: idades["Ana"] = 30.',
    'for: o único laço do Go. Com range, ele passa por cada item de um slice ou de um map.',
  ] },
  'gopher-mascote': { nome: 'Gopher mascote', falas: [
    'Struct: junta campos com nome num tipo só, como um cadastro com Nome e Idade.',
    'Ponteiro: guarda o endereço de um valor; com ele, uma função consegue alterar o original.',
  ] },

  // Porto Web
  'capitao-http': { nome: 'Capitão HTTP', falas: [
    'HTTP: o protocolo de pedidos e respostas da web. O pacote net/http traz cliente e servidor.',
    'Handler: a função que recebe o pedido (*http.Request) e escreve a resposta (http.ResponseWriter).',
    'Código de status: o número que resume a resposta, como 200 (deu certo) e 404 (não encontrado).',
  ] },
  'estivador': { nome: 'Estivador', falas: [
    'JSON: texto com dados em chaves e valores. encoding/json converte structs em JSON e de volta.',
    'Rota: o caminho do pedido, como /usuarios, ligado ao handler que cuida dele.',
  ] },
  'gopher-capitao': { nome: 'Gopher capitão', falas: [
    'Middleware: um handler que embrulha outro para fazer algo antes ou depois, como registrar o pedido.',
    'Erro em Go: é um valor comum, devolvido junto com o resultado; confira com if err != nil.',
  ] },

  // Céu da Concorrência
  'piloto-goroutine': { nome: 'Piloto', falas: [
    'Goroutine: uma função que roda ao mesmo tempo que as outras; basta escrever go antes da chamada.',
    'Channel: o cano por onde goroutines trocam valores com segurança, enviando e recebendo com <-.',
  ] },
  'controladora': { nome: 'Controladora de voo', falas: [
    'select: espera em vários channels de uma vez e segue pelo primeiro que ficar pronto.',
    'WaitGroup: conta quantas goroutines ainda estão trabalhando, para o programa esperar todas.',
    'Mutex: uma trava que deixa só uma goroutine por vez mexer num dado compartilhado.',
  ] },
  'gopher-piloto': { nome: 'Gopher piloto', falas: [
    'context: carrega prazo e cancelamento para as goroutines saberem quando parar.',
    'Condição de corrida: duas goroutines mexendo no mesmo dado sem trava; o go test -race ajuda a achar.',
  ] },

  // Cidade dos Projetos
  'arquiteta': { nome: 'Arquiteta', falas: [
    'Interface: um conjunto de métodos. Qualquer tipo que tenha esses métodos já satisfaz a interface.',
    'Módulo: o projeto Go descrito no go.mod, com o nome do módulo e as dependências.',
  ] },
  'dev-senior': { nome: 'Dev sênior', falas: [
    'Teste: uma função TestNome(t *testing.T) num arquivo _test.go, que o go test roda.',
    'Teste de tabela: uma lista de casos com entrada e saída esperada, percorrida num laço só.',
    'defer: agenda uma chamada para o fim da função, como fechar um arquivo depois de usá-lo.',
  ] },
  'gopher-dev': { nome: 'Gopher dev', falas: [
    'gofmt: formata o código no estilo único do Go, para todo mundo ler do mesmo jeito.',
    'Pacote exportado: nomes que começam com letra maiúscula podem ser usados por outros pacotes.',
  ] },
};

/** Emojis das conversas, por cenário (o balão de quem conversa). */
export const EMOJIS_DA_CONVERSA = {
  oficina: ['🔧', '💻', '📦'],
  porto: ['🚢', '📡', '🌊'],
  ceu: ['☁️', '🪂', '⚡'],
  cidade: ['🏗️', '🗄️', '🌙'],
};

// Dicas do terminal durante a trilha, por item (lição ou problema).
export const FALAS = {
  'licao-ola-mundo': 'Todo programa Go começa com package main e func main(). Experimente!',
  'licao-variaveis': 'Go infere tipos com := dentro de funções. Fora, use var explícito.',
  'prob-soma': 'Funções em Go têm assinatura explícita: func Nome(param tipo) retorno { ... }',
  'prob-par-impar': 'O operador % retorna o resto da divisão. Use n%2==0 para verificar paridade.',
  'livre': 'Playground livre: escreva qualquer Go. O código fica salvo no navegador.',
};

/** Retorna a dica do terminal para um dado ID, ou undefined se não houver. */
export function falar(id) {
  return FALAS[id];
}
