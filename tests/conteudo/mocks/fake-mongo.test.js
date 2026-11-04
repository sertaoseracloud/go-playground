import { describe, it, expect } from 'vitest';
import { createFakeMongo } from '../../../src/conteudo/mocks/fake-mongo.js';

describe('FakeMongo', () => {
  it('supports InsertOne and Find', () => {
    const mongo = createFakeMongo();
    mongo.InsertOne('users', { name: 'Alice', age: 30 });
    const docs = mongo.Find('users', {});
    expect(docs).toHaveLength(1);
    expect(docs[0]).toMatchObject({ name: 'Alice', age: 30 });
  });

  it('supports Find with field equality filter', () => {
    const mongo = createFakeMongo();
    mongo.InsertOne('users', { name: 'Alice', role: 'admin' });
    mongo.InsertOne('users', { name: 'Bob', role: 'user' });
    const admins = mongo.Find('users', { role: 'admin' });
    expect(admins).toHaveLength(1);
    expect(admins[0].name).toBe('Alice');
  });

  it('supports UpdateOne', () => {
    const mongo = createFakeMongo();
    mongo.InsertOne('items', { id: 1, status: 'pending' });
    mongo.UpdateOne('items', { id: 1 }, { status: 'done' });
    const docs = mongo.Find('items', { id: 1 });
    expect(docs[0].status).toBe('done');
  });

  it('supports DeleteOne', () => {
    const mongo = createFakeMongo();
    mongo.InsertOne('items', { id: 1 });
    mongo.DeleteOne('items', { id: 1 });
    expect(mongo.Find('items', {})).toHaveLength(0);
  });

  it('provides fresh instance per call', () => {
    const m1 = createFakeMongo();
    const m2 = createFakeMongo();
    m1.InsertOne('col', { x: 1 });
    expect(m2.Find('col', {})).toHaveLength(0);
  });
});