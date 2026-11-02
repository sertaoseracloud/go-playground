import { defineConfig } from 'vite';
import { pluginHistorico, versaoDoPacote } from './scripts/plugin-historico.mjs';

export default defineConfig(({ command }) => {
  return {
    base: './',
    plugins: [pluginHistorico()],
    define: {
      __VERSAO__: JSON.stringify(versaoDoPacote()),
    },
    build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
  };
});