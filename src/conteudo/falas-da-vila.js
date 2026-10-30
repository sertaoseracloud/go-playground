// Falas da Vila: mensagens contextuais que aparecem no terminal durante a trilha.
// Cada chave é um ID de item ou evento; o valor é a fala do NPC.
export const FALAS = {
  'licao-ola-mundo': 'Todo programa Go começa com package main e func main(). Experimente!',
  'licao-variaveis': 'Go infere tipos com := dentro de funções. Fora, use var explícito.',
  'prob-soma': 'Funções em Go têm assinatura explícita: func Nome(param tipo) retorno { ... }',
  'prob-par-impar': 'O operador % retorna o resto da divisão. Use n%2==0 para verificar paridade.',
  'livre': 'Playground livre: escreva qualquer Go. O código fica salvo no navegador.',
};

/** Retorna a fala para um dado ID, ou undefined se não houver. */
export function falar(id) {
  return FALAS[id];
}