import { describe, it, expect } from 'vitest';
import { createFakeS3 } from '../../../src/conteudo/mocks/fake-s3.js';

describe('FakeS3', () => {
  it('supports PutObject and GetObject', () => {
    const s3 = createFakeS3();
    s3.PutObject('my-bucket', 'key.txt', 'hello world');
    const result = s3.GetObject('my-bucket', 'key.txt');
    expect(result).toEqual({ Body: 'hello world', Key: 'key.txt' });
  });

  it('supports DeleteObject', () => {
    const s3 = createFakeS3();
    s3.PutObject('b', 'k', 'data');
    s3.DeleteObject('b', 'k');
    expect(() => s3.GetObject('b', 'k')).toThrow();
  });

  it('supports ListObjects', () => {
    const s3 = createFakeS3();
    s3.PutObject('b', 'a.txt', '1');
    s3.PutObject('b', 'b.txt', '2');
    const list = s3.ListObjects('b');
    expect(list.map((o) => o.Key).sort()).toEqual(['a.txt', 'b.txt']);
  });

  it('provides fresh instance per call', () => {
    const s1 = createFakeS3();
    const s2 = createFakeS3();
    s1.PutObject('b', 'k', 'v');
    expect(s2.ListObjects('b')).toEqual([]);
  });
});