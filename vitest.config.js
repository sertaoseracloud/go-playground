import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __HOMOLOGACAO__: 'false',
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/conteudo/**'],
      reporter: ['text-summary', 'json-summary', 'html'],
      thresholds: { statements: 72, branches: 65, functions: 65, lines: 74 },
    },
  },
});