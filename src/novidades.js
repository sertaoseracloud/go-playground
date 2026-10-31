// Versão do site e resumo das alterações de cada release (página /novidades/ e CHANGELOG.md).
// A versão vem do package.json (injetada no build, astro.config.mjs); o histórico completo vem do git
// (scripts/plugin-historico.mjs).
import historico from 'virtual:historico';

export const VERSAO = typeof __VERSAO__ === 'undefined' ? '0.0.0' : __VERSAO__;
export const HISTORICO = historico;
export const REPOSITORIO = 'https://github.com/sertaoseracloud/go-playground';

/** Releases, da mais nova para a mais antiga. Escritas para quem usa o site, sem jargão. */
export const RELEASES = [
  {
    versao: '1.11.0',
    data: '2026-10-31',
    titulo: 'Concorrência e web no caminho',
    resumo: 'Dois novos módulos na trilha: concorrência com goroutines, channels e mutex, e web com servidor HTTP, API JSON e códigos de status.',
    grupos: [
      {
        titulo: '🔄 Concorrência',
        itens: [
          'Exercícios com goroutines para executar funções em paralelo, channels para comunicação entre elas e mutex para proteger dados compartilhados.',
          'Problemas práticos de sincronização, como produtores e consumidores, pipelines e controle de concorrência.',
        ],
      },
      {
        titulo: '🌐 Web',
        itens: [
          'Servidor HTTP com rotas, handlers e middleware.',
          'API JSON com leitura de corpo, validação e respostas estruturadas.',
          'Códigos de status HTTP e quando usar cada um (200, 201, 400, 404, 500...).',
        ],
      },
      {
        titulo: '🗺️ Trilha',
        itens: [
          'Cenários, falas da vila e glossário compartilhados entre os módulos.',
          'Lugar reservado para os próximos módulos na página inicial.',
        ],
      },
    ],
  },
  {
    versao: '1.10.0',
    data: '2026-10-30',
    titulo: 'O básico da trilha',
    resumo: 'Primeiro módulo da trilha de Go, com variáveis, tipos, funções, estruturas de controle e os primeiros exercícios.',
    grupos: [
      {
        titulo: '📚 Básico',
        itens: [
          'Variáveis, constantes e tipos primitivos (int, float, string, bool).',
          'Funções com múltiplos retornos e funções anônimas.',
          'Estruturas de controle: if, for, switch.',
          'Arrays, slices e maps.',
        ],
      },
      {
        titulo: '🗺️ Infraestrutura da trilha',
        itens: [
          'Estrutura de módulos, itens (lições e problemas) e testes automatizados.',
          'Cenários da vila, falas dos personagens e glossário compartilhados.',
          'Lugar reservado para os próximos módulos na página inicial.',
        ],
      },
    ],
  },
  {
    versao: '1.9.0',
    data: '2026-10-29',
    titulo: 'Certificados e publicação',
    resumo: 'O site agora gera certificados digitais durante a publicação, com chave pública Ed25519 e validação independente.',
    grupos: [
      {
        titulo: '🔒 Certificados',
        itens: [
          'Chave pública Ed25519 publicada junto com o site, para quem verifica fora dele.',
          'Assinatura digital dos certificados com a mesma palavra secreta do selo.',
          'Validação pública e independente do site.',
        ],
      },
      {
        titulo: '🚀 Publicação',
        itens: [
          'Publicação automática no GitHub Pages com testes de fumaça.',
          'Auditoria semanal de acessibilidade e desempenho.',
        ],
      },
    ],
  },
  {
    versao: '1.8.0',
    data: '2026-10-28',
    titulo: 'DivergeGo no ar',
    resumo: 'Primeira versão do playground de Go, com editor, terminal e testes no navegador.',
    grupos: [
      {
        titulo: '🎮 Playground',
        itens: [
          'Editor de código Go com realce de sintaxe e completamento.',
          'Terminal integrado para compilar e executar programas.',
          'Testes automatizados no estilo LeetCode, com casos ocultos ao enviar.',
        ],
      },
      {
        titulo: '♿ Acessibilidade',
        itens: [
          'Temas Dracula, Claro, Alto contraste e Suavo.',
          'Perfis prontos: Foco (TDAH), Leitura facilitada (dislexia), Calmo (autismo) e Sem pressão (ansiedade).',
          'Navegação completa pelo teclado e contraste revisado em todas as telas.',
        ],
      },
      {
        titulo: '🔒 Privacidade',
        itens: [
          'Sem cookies, sem rastreamento e sem cadastro: seus dados ficam só no seu navegador.',
          'Página de privacidade (LGPD), com botões para baixar e apagar seus dados.',
          'Software livre com copyleft: código sob AGPL-3.0 e conteúdo didático sob CC BY-SA 4.0.',
        ],
      },
    ],
  },
];