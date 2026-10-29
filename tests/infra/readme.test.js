import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('README.md', () => {
  const readme = readFileSync('README.md', 'utf8');
  it('mentions DivergeGo', () => expect(readme).toContain('DivergeGo'));
  it('mentions 300 exercícios', () => expect(readme).toContain('300'));
  it('mentions acessibilidade', () => expect(readme.toLowerCase()).toContain('acessibilidade'));
});