// Cenário de mapa de cada módulo na trilha (src/ui/cenarios). Cada site tem o seu mapa.
export const CENARIO_DO_MODULO = {
  basico: 'oficina',
  web: 'porto',
  concorrencia: 'ceu',
  projetos: 'cidade',
  // Os módulos novos reaproveitam as quatro cenas; a semente (o id do módulo) muda o desenho.
  estruturas: 'oficina', // montar estruturas na bancada
  bancos: 'porto', // armazéns guardando a carga
  nuvem: 'ceu', // a nuvem fica no céu
  arquitetura: 'cidade', // planejar a cidade
};