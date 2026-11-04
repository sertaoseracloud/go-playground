import { go, licao, problema } from './util.js';

export const moduloArquitetura = {
 id: 'arquitetura',
 titulo: 'Arquitetura e Padrões',
 icone: '️',
 descricao: 'Clean Architecture, DDD, CQRS, Event Sourcing, microserviços e padrões de projeto.',
 itens: [
 licao({ id: 'arquitetura-clean-licao', titulo: 'Clean Architecture', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
 problema({ id: 'arquitetura-repositorio', titulo: 'Padrão Repository', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
 licao({ id: 'arquitetura-ddd-licao', titulo: 'Domain-Driven Design', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
 problema({ id: 'arquitetura-cqrs', titulo: 'CQRS Básico', dificuldade: 'dificil', enunciado: '<p>TODO</p>', dica: 'TODO', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
 ],
};