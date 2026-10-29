import { describe, it, expect } from 'vitest';
import { parsearComando } from '../../src/go/comandos.js';

describe('parsearComando', () => {
  it('parses go run main.go', () => {
    const cmd = parsearComando('go run main.go');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['run', 'main.go']);
    expect(cmd.valido).toBe(true);
  });

  it('parses go build', () => {
    const cmd = parsearComando('go build');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['build']);
    expect(cmd.valido).toBe(true);
  });

  it('parses go test', () => {
    const cmd = parsearComando('go test');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['test']);
    expect(cmd.valido).toBe(true);
  });

  it('parses go mod init mymodule', () => {
    const cmd = parsearComando('go mod init mymodule');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['mod', 'init', 'mymodule']);
    expect(cmd.valido).toBe(true);
  });

  it('parses go fmt', () => {
    const cmd = parsearComando('go fmt');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['fmt']);
    expect(cmd.valido).toBe(true);
  });

  it('parses go vet', () => {
    const cmd = parsearComando('go vet');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['vet']);
    expect(cmd.valido).toBe(true);
  });

  it('parses go version', () => {
    const cmd = parsearComando('go version');
    expect(cmd.nome).toBe('go');
    expect(cmd.args).toEqual(['version']);
    expect(cmd.valido).toBe(true);
  });

  it('parses help command', () => {
    const cmd = parsearComando('help');
    expect(cmd.nome).toBe('help');
    expect(cmd.args).toEqual([]);
    expect(cmd.valido).toBe(true);
  });

  it('parses clear command', () => {
    const cmd = parsearComando('clear');
    expect(cmd.nome).toBe('clear');
    expect(cmd.args).toEqual([]);
    expect(cmd.valido).toBe(true);
  });

  it('parses ls command', () => {
    const cmd = parsearComando('ls');
    expect(cmd.nome).toBe('ls');
    expect(cmd.args).toEqual([]);
    expect(cmd.valido).toBe(true);
  });

  it('parses cat command', () => {
    const cmd = parsearComando('cat main.go');
    expect(cmd.nome).toBe('cat');
    expect(cmd.args).toEqual(['main.go']);
    expect(cmd.valido).toBe(true);
  });

  it('rejects unknown commands', () => {
    expect(parsearComando('python main.py').valido).toBe(false);
  });

  it('rejects invalid go subcommands', () => {
    expect(parsearComando('go invalidcmd').valido).toBe(false);
  });

  it('rejects empty input', () => {
    expect(parsearComando('').valido).toBe(false);
  });

  it('rejects whitespace-only input', () => {
    expect(parsearComando('   ').valido).toBe(false);
  });
});