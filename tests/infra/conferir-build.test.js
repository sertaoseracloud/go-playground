import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';

describe('conferir-build', () => {
  it('exits with error on missing dist', () => {
    expect(() => execSync('node scripts/conferir-build.mjs ./nonexistent principal', { encoding: 'utf8' })).toThrow();
  });
});