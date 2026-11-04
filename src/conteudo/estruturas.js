import { go, licao, problema } from './util.js';

export const moduloEstruturas = {
  id: 'estruturas',
  titulo: 'Estrutura de Dados',
  icone: '📦',
  descricao: 'Arrays, slices, maps, structs, métodos, interfaces, generics e ponteiros.',
  itens: [
    licao({ id: 'estruturas-arrays-licao', titulo: 'Arrays e Slices', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    licao({ id: 'estruturas-maps-licao', titulo: 'Maps', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
    problema({ id: 'estruturas-slices-append', titulo: 'Append em Slices', dificuldade: 'facil', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
    problema({ id: 'estruturas-maps-contagem', titulo: 'Contagem com Maps', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
    problema({ id: 'estruturas-structs-pessoa', titulo: 'Struct Pessoa', dificuldade: 'facil', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
  ],
};