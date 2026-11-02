import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('Vite build', () => {
  it('completes without errors', () => {
    const result = execSync('npm run build', { encoding: 'utf-8' });
    expect(result).toContain('built in');
  });
});