import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('package.json', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  it('has correct name and version', () => {
    expect(pkg.name).toBe('go-playground');
    expect(pkg.version).toBe('1.11.0');
  });
  it('has all required scripts', () => {
    const required = ['dev', 'build', 'preview', 'test', 'test:cobertura', 'lighthouse', 'badges', 'lint', 'conferir-build'];
    for (const s of required) expect(pkg.scripts[s]).toBeDefined();
  });
  it('includes @vitest/coverage-v8 in devDependencies', () => {
    expect(pkg.devDependencies['@vitest/coverage-v8']).toBeDefined();
  });
});