// Stub mínimo da trilha de conteúdo Go para os imports funcionarem.
// Será preenchido nas tarefas seguintes com os 10 módulos do spec.

export const DIFICULDADES = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

export const modulos = [
  {
    id: 'basico',
    titulo: 'Go Básico',
    descricao: 'Sintaxe, tipos, funções e pacotes.',
    icone: '🐹',
    itens: [],
    extra: false,
  },
];

export const problemas = [];
export const itens = [];

export function buscarItem(id) {
  for (const m of modulos) {
    const encontrado = m.itens.find((i) => i.id === id);
    if (encontrado) return encontrado;
  }
  return null;
}

export function vizinhos(id) {
  return { anterior: null, proximo: null };
}