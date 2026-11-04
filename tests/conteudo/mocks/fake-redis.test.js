import { describe, it, expect } from 'vitest';
import { createFakeRedis } from '../../../src/conteudo/mocks/fake-redis.js';

describe('FakeRedis', () => {
  it('supports SET and GET', () => {
    const redis = createFakeRedis();
    redis.SET('key', 'value');
    expect(redis.GET('key')).toBe('value');
  });

  it('returns null for missing keys', () => {
    const redis = createFakeRedis();
    expect(redis.GET('missing')).toBeNull();
  });

  it('supports DEL', () => {
    const redis = createFakeRedis();
    redis.SET('k', 'v');
    redis.DEL('k');
    expect(redis.GET('k')).toBeNull();
  });

  it('supports INCR', () => {
    const redis = createFakeRedis();
    redis.SET('counter', '10');
    redis.INCR('counter');
    expect(redis.GET('counter')).toBe('11');
  });

  it('supports EXPIRE and TTL', () => {
    const redis = createFakeRedis();
    redis.SET('k', 'v');
    redis.EXPIRE('k', 60);
    expect(redis.TTL('k')).toBe(60);
  });

  it('provides fresh instance per call', () => {
    const r1 = createFakeRedis();
    const r2 = createFakeRedis();
    r1.SET('k', 'v');
    expect(r2.GET('k')).toBeNull();
  });
});