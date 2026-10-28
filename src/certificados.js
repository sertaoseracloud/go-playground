// Stub mínimo dos certificados para os imports funcionarem.

export const EMISSOR = {
  organizacao: 'Sertão será cloud',
  curso: 'DivergeGo',
  logo: '',
};

export const CERTIFICADOS = {
  basico: { titulo: 'Go Básico', cargaHoraria: 10 },
  final: { titulo: 'Go Completo', cargaHoraria: 40 },
};

export const ORDEM = ['basico', 'final'];

export function linkCertificado({ nome, modulo, data }) {
  return `#/certificado/${nome}/${modulo}/${data}`;
}