import { describe, it, expect } from 'vitest';
import { formatarSaida } from '../../src/go/saida.js';

describe('formatarSaida', () => {
  it('compresses build timing', () => {
    const linhas = formatarSaida('go build', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true });
    const delays = linhas.map(l => l.delay).filter(d => d > 0);
    expect(delays.every(d => d <= 2000)).toBe(true); // max 2s compressed
  });

  it('skips delays when reduzirAnimacoes is true', () => {
    const linhas = formatarSaida('go build', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true, reduzirAnimacoes: true });
    expect(linhas.every(l => l.delay === 0)).toBe(true);
  });

  it('formats go version output', () => {
    const linhas = formatarSaida('go version', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto.includes('go version'))).toBe(true);
  });

  it('formats go mod init output', () => {
    const linhas = formatarSaida('go mod init mymodule', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto.includes('go.mod'))).toBe(true);
  });

  it('formats error output', () => {
    const linhas = formatarSaida('go build', { stdout: '', stderr: 'compile error', exitCode: 1 }, { comprimir: true });
    expect(linhas.some(l => l.tipo === 'erro')).toBe(true);
  });

  it('formats help output', () => {
    const linhas = formatarSaida('help', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto.includes('Comandos suportados'))).toBe(true);
  });

  it('formats ls output', () => {
    const linhas = formatarSaida('ls', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto.includes('main.go'))).toBe(true);
  });

  it('formats cat output', () => {
    const linhas = formatarSaida('cat main.go', { stdout: 'package main', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto.includes('Conteudo de main.go'))).toBe(true);
  });

  it('formats go test output with PASS', () => {
    const linhas = formatarSaida('go test', { stdout: 'ok\tmymodule\t0.001s', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto === 'PASS')).toBe(true);
  });

  it('formats go test output with FAIL', () => {
    const linhas = formatarSaida('go test', { stdout: 'FAIL\tmymodule', stderr: '', exitCode: 1 }, { comprimir: true });
    expect(linhas.some(l => l.texto === 'FAIL')).toBe(true);
  });

  it('formats go run output', () => {
    const linhas = formatarSaida('go run main.go', { stdout: 'Hello, World!', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.some(l => l.texto === 'Hello, World!')).toBe(true);
  });

  it('returns empty array for clear command', () => {
    const linhas = formatarSaida('clear', { stdout: '', stderr: '', exitCode: 0 }, { comprimir: true });
    expect(linhas.length).toBe(0);
  });
});