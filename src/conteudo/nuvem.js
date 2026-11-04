import { go, licao, problema } from './util.js';

export const moduloNuvem = {
 id: 'nuvem',
 titulo: 'Nuvem e gRPC',
 icone: '☁️',
 descricao: 'gRPC, protobuf, AWS SDK, Azure SDK, configuração e secrets.',
 itens: [
 licao({ id: 'nuvem-grpc-conceitos-licao', titulo: 'Conceitos de gRPC', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
 problema({ id: 'nuvem-grpc-cliente', titulo: 'Cliente gRPC', dificuldade: 'dificil', enunciado: '<p>TODO</p>', dica: 'Use os arquivos .pb.go fornecidos como código inicial.', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
 licao({ id: 'nuvem-aws-sdk-licao', titulo: 'AWS SDK para Go', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
 ],
};