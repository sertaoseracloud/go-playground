// Pós-build: verifica se os assets de certificado foram gerados corretamente.
// O astro.config.mjs deriva as chaves do CERTIFICADO_SEGREDO; este script confirma
// que o build produziu os arquivos esperados em dist/.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dist = join(__dirname, '..', 'dist');

const esperados = [
  'chave-publica-ed25519.txt',
  'chave-publica-ed25519.json',
];

const faltando = esperados.filter((arquivo) => !existsSync(join(dist, arquivo)));

if (faltando.length > 0) {
  console.error(`❌ Build incompleto: arquivos de certificado não encontrados em dist/:`);
  faltando.forEach((f) => console.error(`   - ${f}`));
  process.exit(1);
}

console.log('✅ Certificados: todos os arquivos de chave pública estão em dist/');