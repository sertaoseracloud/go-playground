// Exercises in this module use mock adapters from ./mocks/index.js
// so they run fully in the browser without real databases.
import { go, licao, problema } from './util.js';

export const moduloBancos = {
 id: 'bancos',
 titulo: 'Bancos e Cache',
 icone: '🗄️',
 descricao: 'SQL/database, PostgreSQL, SQLite, MongoDB, Redis/cache e migrations.',
 itens: [
 licao({ id: 'bancos-sql-basico-licao', titulo: 'database/sql Básico', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
 problema({ id: 'bancos-sql-insert', titulo: 'INSERT com database/sql', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'Use o FakeDB do playground.', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
 licao({ id: 'bancos-mongo-crud-licao', titulo: 'MongoDB CRUD', resumo: '<p>TODO</p>', codigo: go`package main\n\nfunc main() {}` }),
 problema({ id: 'bancos-redis-cache', titulo: 'Cache com Redis', dificuldade: 'medio', enunciado: '<p>TODO</p>', dica: 'Use o FakeRedis do playground.', inicial: go`package main\n\nfunc main() {}`, solucao: go`package main\n\nfunc main() {}`, testes: [] }),
 ],
};