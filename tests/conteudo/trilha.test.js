import { describe, it, expect } from 'vitest';
import { itens } from '../../src/conteudo/trilha.js';

describe('trilha', () => {
  it('all exercise IDs are unique', () => {
    const ids = itens.map((i) => i.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });
});