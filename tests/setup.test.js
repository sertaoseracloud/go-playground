import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('Vite build', () => {
  it('completes without errors', () => {
    // Build de produção exige CERTIFICADO_SEGREDO; em dev/CI local sem segredo, pula o teste.
    if (!process.env.CERTIFICADO_SEGREDO) {
      console.log('setup.test.js: CERTIFICADO_SEGREDO ausente — pulando build de produção.');
      return;
    }
    const result = execSync('npm run build', { encoding: 'utf-8' });
    expect(result).toContain('built in');
  });
});