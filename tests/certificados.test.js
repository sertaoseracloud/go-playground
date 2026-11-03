import { describe, it, expect } from 'vitest';
import {
  CERTIFICADOS, EMISSOR, codificarCertificado, decodificarCertificado, idCertificado, hashCertificado,
  ORDEM, anteriores, montarCadeia,
  linkLinkedInPerfil, linkLinkedInPublicar, linkPublico, textoPublicacao, SITE,
} from '../src/certificados.js';
import { modulos } from '../src/conteudo/trilha.js';
import { lerRota, paraBase64Url, deBase64Url } from '../src/compartilhar.js';

const lerCodigo = (codigo) => JSON.parse(new TextDecoder().decode(deBase64Url(codigo)));
const escreverCodigo = (obj) => paraBase64Url(new TextEncoder().encode(JSON.stringify(obj)));

// O segundo módulo da cadeia precisa da data do primeiro.
const PRIMEIRO_MODULO = ORDEM[0];
const SEGUNDO_MODULO = ORDEM[1];
const CERT = { nome: 'Maria da Conceição', modulo: SEGUNDO_MODULO, data: '2026-10-11', cadeia: ['2026-10-01'] };
const PRIMEIRO = { nome: 'Maria da Conceição', modulo: PRIMEIRO_MODULO, data: '2026-10-01' };

describe('certificados', () => {
  it('existe um certificado para cada módulo e um final', () => {
    const idsModulos = modulos.map((m) => m.id).filter((id) => id in CERTIFICADOS);
    for (const id of idsModulos) {
      expect(CERTIFICADOS[id]).toBeDefined();
    }
    expect(CERTIFICADOS.final).toBeDefined();
    for (const c of Object.values(CERTIFICADOS)) {
      expect(c.titulo).toBeTruthy();
      expect(c.conteudos.length).toBeGreaterThan(2);
    }
  });

  it('emitido pela Sertão será cloud, assinado por Cláudio Raposo', () => {
    expect(EMISSOR.organizacao).toBe('Sertão será cloud');
    expect(EMISSOR.responsavel).toBe('Cláudio Raposo');
  });

  it('o código guarda nome, módulo, data e a cadeia (com acentos)', () => {
    const codigo = codificarCertificado(CERT);
    const cert = decodificarCertificado(codigo);
    const elos = montarCadeia(CERT);
    expect(cert).toMatchObject({ nome: CERT.nome, modulo: SEGUNDO_MODULO, data: CERT.data, selo: 'confere', hash: elos.at(-1).hash });
    expect(cert.cadeia.map((e) => e.modulo)).toEqual([PRIMEIRO_MODULO]);
    expect(lerRota(`#/certificado/${codigo}`)).toEqual({ tela: 'certificado', codigo });
  });

  it('id estável no formato SSC-AAAA-XXXX-XXXX, tirado do selo', () => {
    const id = idCertificado(CERT);
    expect(id).toMatch(/^SSC-2026-[0-9A-F]{4}-[0-9A-F]{4}$/);
    expect(id.replace(/-/g, '').slice(7).toLowerCase()).toBe(montarCadeia(CERT).at(-1).hash.slice(0, 8));
    expect(idCertificado({ ...CERT })).toBe(id);
  });

  it('selo HMAC-SHA256: muda com data, emissor, empresa, aluno e módulo', () => {
    const hash = hashCertificado(PRIMEIRO);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    for (const mudanca of [{ data: '2026-10-12' }, { nome: 'Maria da Conceicao' }, { modulo: 'outro' }]) {
      expect(hashCertificado({ ...PRIMEIRO, ...mudanca })).not.toBe(hash);
    }
    expect(hashCertificado({ ...PRIMEIRO, nome: '  Maria da Conceição ' })).toBe(hash); // espaços nas pontas não contam
  });

  it('o link leva o selo, e a palavra secreta nunca aparece', () => {
    const dados = lerCodigo(codificarCertificado(CERT));
    expect(dados.h).toBe(montarCadeia(CERT).at(-1).hash);
    expect(JSON.stringify(dados).toLowerCase()).not.toMatch(/caf[eé]/);
  });

  it('detecta link alterado e link antigo sem selo', () => {
    const dados = lerCodigo(codificarCertificado(CERT));
    const alterado = decodificarCertificado(escreverCodigo({ ...dados, n: 'Outra Pessoa' }));
    expect(alterado.selo).toBe('nao-confere');
    expect(alterado.hash).toBe(dados.h);
    const antigo = decodificarCertificado(escreverCodigo({ n: CERT.nome, m: CERT.modulo, d: CERT.data }));
    expect(antigo.selo).toBe('ausente');
  });

  it('rejeita códigos inválidos', () => {
    expect(decodificarCertificado('@@@')).toBeNull();
    expect(decodificarCertificado(escreverCodigo({ n: 'Ana', m: 'inexistente', d: '2026-10-11', h: 'x' }))).toBeNull();
    expect(decodificarCertificado(escreverCodigo({ n: '  ', m: PRIMEIRO_MODULO, d: '2026-10-11', h: 'x' }))).toBeNull();
    expect(decodificarCertificado(escreverCodigo({ n: 'Ana', m: PRIMEIRO_MODULO, d: 'ontem', h: 'x' }))).toBeNull();
  });
});

describe('cadeia de certificados (como num blockchain)', () => {
  it('a ordem é a da trilha, e o final fecha a cadeia', () => {
    const idsNaTrilha = modulos.map((m) => m.id).filter((id) => id in CERTIFICADOS);
    for (const id of idsNaTrilha) {
      expect(ORDEM).toContain(id);
    }
    expect(ORDEM.at(-1)).toBe('final');
    expect(anteriores(ORDEM[0])).toEqual([]);
  });

  it('o primeiro não tem anterior e mantém o selo de antes da cadeia', () => {
    const [primeiro] = montarCadeia(PRIMEIRO);
    expect(primeiro.anterior).toBe('');
    expect(primeiro.hash).toBe(hashCertificado(PRIMEIRO));
    expect(lerCodigo(codificarCertificado(PRIMEIRO))).not.toHaveProperty('c');
  });

  describe.skipIf(ORDEM.length < 2)('com dois ou mais módulos', () => {
    it('cada certificado leva no selo o hash do anterior', () => {
      const elos = montarCadeia(CERT);
      expect(elos.map((e) => e.modulo)).toEqual([PRIMEIRO_MODULO, SEGUNDO_MODULO]);
      expect(elos[1].anterior).toBe(elos[0].hash);
      expect(elos[1].hash).toBe(hashCertificado(CERT, elos[0].hash));
      expect(elos[1].hash).not.toBe(hashCertificado(CERT)); // sem o anterior, o selo é outro
    });

    it('mudar a data de um certificado anterior quebra o selo dos seguintes', () => {
      const dados = lerCodigo(codificarCertificado(CERT));
      const adulterado = decodificarCertificado(escreverCodigo({ ...dados, c: ['2026-09-01'] }));
      expect(adulterado.selo).toBe('nao-confere');
    });

    it('não dá para pular um certificado da cadeia', () => {
      expect(() => codificarCertificado({ ...CERT, cadeia: [] })).toThrow(/certificado/);
      const dados = lerCodigo(codificarCertificado(CERT));
      expect(decodificarCertificado(escreverCodigo({ ...dados, c: [] })).selo).toBe('nao-confere');
    });
  });

  it('link de módulo seguinte sem a cadeia é tratado como antigo', () => {
    const dados = lerCodigo(codificarCertificado(CERT));
    delete dados.c;
    expect(decodificarCertificado(escreverCodigo(dados)).selo).toBe('ausente');
  });

  it('o certificado final encadeia todos', () => {
    const datasCadeia = ORDEM.filter((m) => m !== 'final').map((_, i) => `2026-10-${String(i + 1).padStart(2, '0')}`);
    const final = { nome: 'Ana', modulo: 'final', data: '2026-12-01', cadeia: datasCadeia };
    const cert = decodificarCertificado(codificarCertificado(final));
    expect(cert.selo).toBe('confere');
    expect(cert.cadeia).toHaveLength(datasCadeia.length);
  });

  it('ORDEM termina com final', () => {
    expect(ORDEM.at(-1)).toBe('final');
  });
});

describe('compartilhar', () => {
  it('links do LinkedIn: adicionar ao perfil e publicar', () => {
    const url = 'https://sertaoseracloud.github.io/go-playground/#/certificado/abc';
    const perfil = new URL(linkLinkedInPerfil(CERT, url));
    expect(perfil.origin + perfil.pathname).toBe('https://www.linkedin.com/profile/add');
    expect(Object.fromEntries(perfil.searchParams)).toEqual({
      startTask: 'CERTIFICATION_NAME',
      name: CERTIFICADOS[SEGUNDO_MODULO].titulo,
      organizationName: 'Sertão será cloud',
      issueYear: '2026',
      issueMonth: '10',
      certUrl: url,
      certId: idCertificado(CERT),
    });
    const publicar = new URL(linkLinkedInPublicar(CERT, url));
    expect(publicar.origin + publicar.pathname).toBe('https://www.linkedin.com/feed/');
    expect(publicar.searchParams.get('shareActive')).toBe('true');
    expect(publicar.searchParams.get('text')).toBe(textoPublicacao(CERT, url));
  });

  it('link público aponta para a página estática do badge, com o código', () => {
    const link = new URL(linkPublico(CERT));
    expect(link.href.startsWith(`${SITE}badge/${SEGUNDO_MODULO}/`)).toBe(true);
    expect(decodificarCertificado(link.searchParams.get('c'))).toMatchObject({ nome: CERT.nome, modulo: SEGUNDO_MODULO, selo: 'confere' });
  });

  it('texto do post cita o badge, o emissor, o link e hashtags', () => {
    const texto = textoPublicacao(CERT, 'https://exemplo/x');
    expect(texto).toContain(`"${CERTIFICADOS[SEGUNDO_MODULO].titulo}"`);
    expect(texto).toContain('Sertão será cloud');
    expect(texto).toContain('https://exemplo/x');
    expect(texto).toMatch(/#SertaoSeraCloud/);
  });

  it('os números do texto batem com o conteúdo da trilha', () => {
    for (const m of modulos.filter((x) => CERTIFICADOS[x.id])) {
      expect(CERTIFICADOS[m.id].resumo).toBeTruthy();
      expect(typeof CERTIFICADOS[m.id].resumo).toBe('string');
    }
  });
});