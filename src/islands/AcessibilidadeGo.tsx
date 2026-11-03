// Configurações de acessibilidade: preferências visuais e de navegação.
// Substitui o markup estático com controles reativos e persistência local.
import { useState, useEffect } from 'react';

interface Preferencias {
  fonteGrande: boolean;
  altoContraste: boolean;
  reduzirAnimacoes: boolean;
  leitorTela: boolean;
  atalhosTeclado: boolean;
}

const PADRAO: Preferencias = {
  fonteGrande: false,
  altoContraste: false,
  reduzirAnimacoes: false,
  leitorTela: false,
  atalhosTeclado: true,
};

export default function AcessibilidadeGo() {
  const [prefs, setPrefs] = useState<Preferencias>(PADRAO);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divergego-acessibilidade');
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('fonte-grande', prefs.fonteGrande);
    document.documentElement.classList.toggle('alto-contraste', prefs.altoContraste);
    document.documentElement.classList.toggle('reduzir-animacoes', prefs.reduzirAnimacoes);
  }, [prefs]);

  const atualizar = (chave: keyof Preferencias) => {
    setPrefs((prev) => ({ ...prev, [chave]: !prev[chave] }));
    setSalvo(false);
  };

  const salvar = () => {
    try {
      localStorage.setItem('divergego-acessibilidade', JSON.stringify(prefs));
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2000);
    } catch {}
  };

  const resetar = () => {
    setPrefs(PADRAO);
    setSalvo(false);
    try {
      localStorage.removeItem('divergego-acessibilidade');
    } catch {}
  };

  return (
    <section className="acessibilidade">
      <header className="acessibilidade-header">
        <h1>♿ Acessibilidade</h1>
        <p className="subtitulo">
          Ajuste a experiência do DivergeGo para suas necessidades. As preferências ficam salvas no seu navegador.
        </p>
      </header>

      <form className="acessibilidade-formulario" onSubmit={(e) => { e.preventDefault(); salvar(); }}>
        <fieldset>
          <legend>Preferências visuais</legend>
          <label className="toggle-item">
            <input type="checkbox" checked={prefs.fonteGrande} onChange={() => atualizar('fonteGrande')} />
            <span className="toggle-label">Fonte grande</span>
            <span className="toggle-desc">Aumenta o tamanho base do texto em todo o site.</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={prefs.altoContraste} onChange={() => atualizar('altoContraste')} />
            <span className="toggle-label">Alto contraste</span>
            <span className="toggle-desc">Fundo escuro com texto claro para melhor legibilidade.</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={prefs.reduzirAnimacoes} onChange={() => atualizar('reduzirAnimacoes')} />
            <span className="toggle-label">Reduzir animações</span>
            <span className="toggle-desc">Desativa transições e efeitos de movimento.</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Navegação e interação</legend>
          <label className="toggle-item">
            <input type="checkbox" checked={prefs.leitorTela} onChange={() => atualizar('leitorTela')} />
            <span className="toggle-label">Otimizar para leitor de tela</span>
            <span className="toggle-desc">Adiciona landmarks e descrições extras para tecnologias assistivas.</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={prefs.atalhosTeclado} onChange={() => atualizar('atalhosTeclado')} />
            <span className="toggle-label">Atalhos de teclado</span>
            <span className="toggle-desc">Habilita navegação rápida por teclas de atalho.</span>
          </label>
        </fieldset>

        <div className="acessibilidade-acoes">
          <button type="submit" className="btn btn-verde">💾 Salvar preferências</button>
          <button type="button" className="btn btn-fantasma" onClick={resetar}>Restaurar padrão</button>
          {salvo && <span className="feedback-sucesso" role="status">✅ Preferências salvas!</span>}
        </div>
      </form>

      <article className="topico">
        <h2>Compromisso com acessibilidade</h2>
        <p>
          O DivergeGo segue as diretrizes WCAG 2.1 nível AA. Se você encontrar alguma barreira de acesso,
          entre em contato pelo email acessibilidade@divergego.dev. Sua experiência importa.
        </p>
      </article>
    </section>
  );
}