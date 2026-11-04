import { describe, it, expect } from 'vitest';
import { createFakeDB } from '../../../src/conteudo/mocks/fake-db.js';

describe('FakeDB', () => {
  it('supports Exec and Query with simple INSERT/SELECT', () => {
    const db = createFakeDB();
    db.Exec('CREATE TABLE users (id INT, name TEXT)');
    db.Exec("INSERT INTO users VALUES (1, 'Alice')");
    const rows = db.Query('SELECT * FROM users WHERE id = ?', [1]);
    expect(rows).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('provides fresh instance per call', () => {
    const db1 = createFakeDB();
    const db2 = createFakeDB();
    db1.Exec('CREATE TABLE t (v INT)');
    db1.Exec('INSERT INTO t VALUES (1)');
    expect(db2.Query('SELECT * FROM t').length).toBe(0);
  });

  it('supports Begin transaction with Commit', () => {
    const db = createFakeDB();
    db.Exec('CREATE TABLE items (id INT)');
    const tx = db.Begin();
    tx.Exec('INSERT INTO items VALUES (10)');
    tx.Commit();
    const rows = db.Query('SELECT * FROM items');
    expect(rows).toEqual([{ id: 10 }]);
  });

  it('supports Close without error', () => {
    const db = createFakeDB();
    expect(() => db.Close()).not.toThrow();
  });
});