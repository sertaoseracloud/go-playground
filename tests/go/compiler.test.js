import { describe, it, expect } from 'vitest';
import { compilarGo, executarGo } from '../../src/go/compiler.js';

describe('compilarGo', () => {
  it('compiles hello world', async () => {
    const codigo = 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, World!") }';
    const { js, erros } = await compilarGo(codigo, { 'main.go': codigo });
    expect(erros).toHaveLength(0);
    expect(js.length).toBeGreaterThan(0);
  });
});

describe('executarGo', () => {
  it('runs compiled hello world', async () => {
    const codigo = 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, World!") }';
    const { js } = await compilarGo(codigo, { 'main.go': codigo });
    const { stdout, exitCode } = await executarGo(js);
    expect(stdout.trim()).toBe('Hello, World!');
    expect(exitCode).toBe(0);
  });
});