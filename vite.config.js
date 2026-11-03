import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { pluginHistorico, versaoDoPacote } from './scripts/plugin-historico.mjs';

/**
 * Chaves dos certificados. A palavra secreta vem da variável de ambiente
 * CERTIFICADO_SEGREDO (no CI, do secret do GitHub) e nunca entra no código nem no
 * site: o bundle recebe só valores derivados dela (SHA-256 com rótulos diferentes).
 * A homologação usa outra variável, sem compartilhar chaves com produção.
 * Sem a variável correspondente, o build falha; o modo dev usa um valor próprio.
 */
const HOMOLOGACAO = process.env.HOMOLOGACAO === '1';

function segredo(command) {
  const valor = HOMOLOGACAO
    ? process.env.CERTIFICADO_SEGREDO_HOMOLOGACAO
    : process.env.CERTIFICADO_SEGREDO;
  if (valor) return valor;
  if (command === 'serve') return HOMOLOGACAO ? 'segredo-de-homologacao' : 'segredo-de-desenvolvimento';
  if (HOMOLOGACAO) throw new Error('Defina CERTIFICADO_SEGREDO_HOMOLOGACAO para gerar o build de homologação.');
  throw new Error('Defina CERTIFICADO_SEGREDO para gerar o build (veja o README, seção Certificados).');
}
const derivar = (rotulo, valor) => createHash('sha256').update(`go-playground:${rotulo}:${valor}`, 'utf8').digest('hex');

export default defineConfig(({ command }) => {
  const valor = segredo(command);
  return {
    base: './',
    plugins: [pluginHistorico()],
    define: {
      __HOMOLOGACAO__: JSON.stringify(HOMOLOGACAO),
      __CHAVE_CERTIFICADO__: JSON.stringify(derivar('certificado', valor)),
      __VERSAO__: JSON.stringify(versaoDoPacote()),
    },
    build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
  };
});