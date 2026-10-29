import { describe, it, expect } from 'vitest';
import { traduzirFrameGrpcWeb } from '../../src/go/grpc-web-shim.js';

describe('traduzirFrameGrpcWeb', () => {
  it('extracts message from gRPC-Web frame', () => {
    // Simplified frame: compression-flag (1 byte) + length (4 bytes) + message
    const frame = new Uint8Array([0, 0, 0, 0, 5, 72, 101, 108, 108, 111]); // "Hello"
    const msg = traduzirFrameGrpcWeb(frame);
    expect(new TextDecoder().decode(msg)).toBe('Hello');
  });
});