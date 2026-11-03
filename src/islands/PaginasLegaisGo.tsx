// Página de páginas legais: índice com links para privacidade, termos, licenças e acessibilidade.
// Substitui o markup estático com navegação reativa.
import { url } from '../lib/rotas';

const PAGINAS = [
  { titulo: '🔒 Privacidade', descricao: 'Política de dados, LGPD e controle do usuário.', rota: '/privacidade/' },
  { titulo: '📜 Termos de uso', descricao: 'Condições de uso do DivergeGo.', rota: '/termos/' },
  { titulo: '⚖️ Licenças', descricao: 'AGPL-3.0 para código e CC BY-SA 4.0 para conteúdo.', rota: '/licenca/' },
  { titulo: '♿ Acessibilidade', descricao: 'Declaração WCAG 2.2 AA e recursos disponíveis.', rota: '/acessibilidade/' },
  { titulo: '💚 Apoie o projeto', descricao: 'Como contribuir com código, issues e divulgação.', rota: '/apoio/' },
];

export default function PaginasLegaisGo() {
  return (
    <section className="paginas-legais">
      <h1>📋 Páginas legais e institucionais</h1>
      <p className="subtitulo">
        Transparência total: privacidade, termos, licenças, acessibilidade e como apoiar o projeto.
      </p>

      <nav className="lista-paginas-legais">
        {PAGINAS.map((pagina) => (
          <a key={pagina.rota} href={`${import.meta.env.BASE_URL}${pagina.rota.replace(/^\//, '')}`} className="card-pagina-legal">
            <h2>{pagina.titulo}</h2>
            <p>{pagina.descricao}</p>
          </a>
        ))}
      </nav>
    </section>
  );
}