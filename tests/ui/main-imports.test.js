/** @vitest-environment happy-dom */
import { describe, it, expect } from 'vitest';

describe('main.js', () => {
  it('imports without errors', async () => {
    const mod = await import('../../src/main.js');
    expect(mod).toBeDefined();
  });
});