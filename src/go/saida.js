/**
 * Formata a saida de um comando Go em linhas com timing comprimido.
 * @param {string} comando - O comando executado (ex: 'go build').
 * @param {{ stdout: string, stderr: string, exitCode: number }} resultado - Resultado da execucao.
 * @param {{ comprimir?: boolean, reduzirAnimacoes?: boolean }} opcoes - Opcoes de formatacao.
 * @returns {Array<{ texto: string, delay: number, tipo: string }>}
 */
export function formatarSaida(comando, resultado, opcoes = {}) {
  const { comprimir = false, reduzirAnimacoes = false } = opcoes;
  const linhas = [];

  // Se reduzirAnimacoes estiver ativo, todos os delays sao 0
  const delayBase = reduzirAnimacoes ? 0 : (comprimir ? 200 : 500);
  const delayFinal = reduzirAnimacoes ? 0 : (comprimir ? 1000 : 3000);

  // Linha do comando digitado
  linhas.push({
    texto: `$ ${comando}`,
    delay: 0,
    tipo: 'comando',
  });

  // Se houver erro de compilacao ou stderr
  if (resultado.stderr) {
    const erros = resultado.stderr.split('\n');
    for (const erro of erros) {
      if (erro.trim()) {
        linhas.push({
          texto: erro,
          delay: delayBase,
          tipo: 'erro',
        });
      }
    }
    return linhas;
  }

  // Saidas padrao por comando
  if (comando.startsWith('go version')) {
    linhas.push({
      texto: 'go version go1.21.0 linux/amd64',
      delay: delayBase,
      tipo: 'sucesso',
    });
  } else if (comando.startsWith('go mod init')) {
    linhas.push({
      texto: `go: creating new go.mod: module ${comando.split(' ')[2] || 'projeto'}`,
      delay: delayBase,
      tipo: 'info',
    });
  } else if (comando.startsWith('go fmt')) {
    // go fmt nao produz saida em caso de sucesso sem arquivos alterados
    if (resultado.stdout) {
      linhas.push({
        texto: resultado.stdout,
        delay: delayBase,
        tipo: 'info',
      });
    }
  } else if (comando.startsWith('go vet')) {
    // go vet nao produz saida se nao ha problemas
    if (resultado.stdout) {
      linhas.push({
        texto: resultado.stdout,
        delay: delayBase,
        tipo: 'aviso',
      });
    }
  } else if (comando.startsWith('go build')) {
    linhas.push({
      texto: 'Compilando...',
      delay: delayBase,
      tipo: 'info',
    });
    if (resultado.exitCode === 0) {
      linhas.push({
        texto: 'Build concluido com sucesso.',
        delay: delayBase,
        tipo: 'sucesso',
      });
    }
  } else if (comando.startsWith('go run')) {
    linhas.push({
      texto: 'Executando...',
      delay: delayBase,
      tipo: 'info',
    });
    if (resultado.stdout) {
      const saidas = resultado.stdout.split('\n');
      for (const s of saidas) {
        if (s.trim()) {
          linhas.push({
            texto: s,
            delay: delayBase,
            tipo: 'saida',
          });
        }
      }
    }
    if (resultado.exitCode === 0) {
      linhas.push({
        texto: 'Programa finalizado.',
        delay: delayBase,
        tipo: 'sucesso',
      });
    }
  } else if (comando.startsWith('go test')) {
    linhas.push({
      texto: 'Executando testes...',
      delay: delayBase,
      tipo: 'info',
    });
    if (resultado.stdout) {
      const saidas = resultado.stdout.split('\n');
      for (const s of saidas) {
        if (s.trim()) {
          linhas.push({
            texto: s,
            delay: delayBase,
            tipo: 'teste',
          });
        }
      }
    }
    if (resultado.exitCode === 0) {
      linhas.push({
        texto: 'PASS',
        delay: delayBase,
        tipo: 'sucesso',
      });
    } else {
      linhas.push({
        texto: 'FAIL',
        delay: delayBase,
        tipo: 'erro',
      });
    }
  } else if (comando === 'help') {
    const ajuda = [
      'Comandos suportados:',
      '  go run <arquivo.go>   - Executa um programa Go',
      '  go build              - Compila o projeto atual',
      '  go test               - Executa os testes',
      '  go mod init <modulo>  - Inicializa um novo modulo',
      '  go fmt                - Formata o codigo',
      '  go vet                - Analisa codigo suspeito',
      '  go version            - Mostra a versao do Go',
      '  help                  - Mostra esta ajuda',
      '  clear                 - Limpa o terminal',
      '  ls                    - Lista arquivos',
      '  cat <arquivo>         - Mostra o conteudo de um arquivo',
    ];
    for (const linha of ajuda) {
      linhas.push({
        texto: linha,
        delay: delayBase,
        tipo: 'info',
      });
    }
  } else if (comando === 'ls') {
    linhas.push({
      texto: 'main.go  go.mod  README.md',
      delay: delayBase,
      tipo: 'info',
    });
  } else if (comando.startsWith('cat')) {
    const arquivo = comando.split(' ')[1];
    if (arquivo) {
      linhas.push({
        texto: `Conteudo de ${arquivo}:`,
        delay: delayBase,
        tipo: 'info',
      });
      if (resultado.stdout) {
        linhas.push({
          texto: resultado.stdout,
          delay: delayBase,
          tipo: 'saida',
        });
      }
    } else {
      linhas.push({
        texto: 'Uso: cat <arquivo>',
        delay: delayBase,
        tipo: 'erro',
      });
    }
  } else if (comando === 'clear') {
    // clear nao produz saida, apenas limpa
    return [];
  }

  // Delay final para indicar fim do comando
  if (linhas.length > 1) {
    linhas[linhas.length - 1].delay = delayFinal;
  }

  return linhas;
}