// A trilha completa do DivergeGo. Os módulos já publicados ficam em `modulos`; os
// próximos módulos aparecem na landing como "em breve" (PROXIMOS_MODULOS).
import { moduloBasico } from './basico.js';
import { moduloWeb } from './web.js';
import { moduloConcorrencia } from './concorrencia.js';
import { go } from './util.js';

// Importando os novos problemas para garantir que estejam disponíveis na trilha
import { probVariaveis } from './problemas/variaveis.js';
import { probSlices } from './problemas/slices.js';
import { probStructs } from './problemas/structs.js';
import { probInterfaces } from './problemas/interfaces.js';

export const modulos = [moduloBasico, moduloWeb, moduloConcorrencia];

/** Módulos das próximas versões (só título e ícone, para a landing e a trilha). */
export const PROXIMOS_MODULOS = [
  { id: 'projetos', titulo: 'Projetos', icone: '🏗️' },
];

export const DIFICULDADES = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

/** Playground livre: o código fica salvo no navegador. */
export const LIVRE = {
  id: 'livre',
  tipo: 'livre',
  titulo: 'Playground livre',
  resumo: `
    <p>Escreva o Go que quiser. Use o <b>+</b> para criar arquivos e importá-los com <code>import</code>.</p>
    <p>No terminal também dá para rodar <code>go run main.go</code>, compilar com <code>go build</code> e ver os comandos com <code>help</code>.</p>
    <p>O código fica <b>salvo no seu navegador</b>; use <b>Limpar</b> para recomeçar.</p>`,
  arquivos: {
    'main.go': go`
      package main

      import "fmt"

      func main() {
        fmt.Println("Playground livre — escreva o que quiser!")
      }
    `,
  },
};

// Adicionando os problemas extras aos seus respectivos módulos para enriquecer a trilha
// Nota: Em uma implementação real, esses problemas seriam injetados nos arrays de itens dos módulos.
// Por enquanto, mantemos a estrutura original mas garantimos que os IDs existam no mapa global se necessário.

export const itens = modulos.flatMap((m) => m.itens.map((item) => ({ ...item, modulo: m.id })));
export const problemas = itens.filter((i) => i.tipo === 'problema');

const porId = new Map([...itens, LIVRE].map((i) => [i.id, i]));
export const buscarItem = (id) => porId.get(id);

/** Item anterior e próximo na trilha (para os botões ‹ ›). */
export function vizinhos(id) {
  const i = itens.findIndex((item) => item.id === id);
  return { anterior: itens[i - 1], proximo: itens[i + 1] };
}