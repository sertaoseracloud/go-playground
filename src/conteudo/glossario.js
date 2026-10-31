// Glossário de termos Go usados na trilha. Cada entrada tem `termo`, `definicao` e opcionalmente `veja` (link para outro termo).
export const GLOSSARIO = [
 { termo: 'package', definicao: 'Declaração que define a qual pacote um arquivo pertence. Todo programa executável usa package main.' },
 { termo: 'func', definicao: 'Palavra-chave para declarar funções. func main() é o ponto de entrada de programas executáveis.' },
 { termo: 'import', definicao: 'Importa pacotes da biblioteca padrão ou de terceiros. Ex: import "fmt".' },
 { termo: 'var', definicao: 'Declara uma variável com tipo explícito. Pode ser usada fora de funções.' },
 { termo: ':=', definicao: 'Operador de declaração curta. Declara e inicializa uma variável dentro de funções, inferindo o tipo.' },
 { termo: 'const', definicao: 'Declara uma constante. O valor não pode mudar após a declaração.' },
 { termo: 'struct', definicao: 'Tipo composto que agrupa campos nomeados. Similar a classes em outras linguagens, mas sem herança.' },
 { termo: 'interface', definicao: 'Tipo que define um conjunto de métodos. Qualquer tipo que implemente esses métodos satisfaz a interface.' },
 { termo: 'goroutine', definicao: 'Thread leve gerenciada pelo runtime do Go. Criada com go func(). Milhares podem rodar simultaneamente.' },
 { termo: 'channel', definicao: 'Canal tipado para comunicação entre goroutines. Usa <- para enviar e receber valores.' },
 { termo: 'defer', definicao: 'Adia a execução de uma função até o retorno da função atual. Usado para cleanup (fechar arquivos, liberar recursos).' },
 { termo: 'error', definicao: 'Interface built-in para representar erros. Funções retornam error como último valor; nil significa sucesso.' },
 { termo: 'slice', definicao: 'Visão dinâmica sobre um array. Mais usado que arrays fixos. Suporta append, len, cap.' },
 { termo: 'map', definicao: 'Coleção de pares chave-valor. Não ordenada. Criada com make(map[K]V) ou literal map[K]V{...}.' },
 { termo: 'range', definicao: 'Itera sobre slices, maps, strings e channels. Retorna índice/chave e valor.' },
 { termo: 'go.mod', definicao: 'Arquivo que define o módulo Go, suas dependências e versões. Criado com go mod init.' },
];

/** Busca um termo no glossário (case-insensitive). */
export function buscarTermo(termo) {
 const t = termo.toLowerCase();
 return GLOSSARIO.find((g) => g.termo.toLowerCase() === t);
}