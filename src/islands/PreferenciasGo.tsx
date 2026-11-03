// Página de preferências: tema, tamanho de texto, perfil neurodivergente e idioma.
// Substitui o markup estático com controles reativos que persistem no localStorage.
import { useState, useEffect, useCallback } from 'react';

const TEMAS = [
  { id: 'dracula', label: '🌙 Dracula (escuro)' },
  { id: 'claro', label: '☀️ Claro' },
  { id: 'alto-contraste', label: '⚫ Alto contraste' },
  { id: 'suavo', label: '🎨 Suavo (tons pastéis)' },
];

const PERFIS = [
  { id: 'padrao', label: 'Padrão', descricao: 'Sem ajustes especiais.' },
  { id: 'foco', label: '🎯 Foco (TDAH)', descricao: 'Reduz distrações visuais, aumenta espaçamento entre blocos.' },
  { id: 'leitura', label: '📖 Leitura facilitada (dislexia)', descricao: 'Fonte OpenDyslexic, maior espaçamento entre letras e linhas.' },
  { id: 'calmo', label: '🧘 Calmo (autismo)', descricao: 'Cores suaves, sem animações, linguagem direta.' },
  { id: 'sem-pressao', label: '💆 Sem pressão (ansiedade)', descricao: 'Remove timers, contadores e indicadores de desempenho.' },
];

const TAMANHOS = [100, 110, 120, 130, 140, 150, 160, 175];

export default function PreferenciasGo() {
  const [tema, setTema] = useState('dracula');
  const [tamanho, setTamanho] = useState(100);
  const [perfil, setPerfil] = useState('padrao');
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('preferencias') || '{}');
      if (prefs.tema) setTema(prefs.tema);
      if (prefs.tamanho) setTamanho(prefs.tamanho);
      if (prefs.perfil) setPerfil(prefs.perfil);
    } catch {}
  }, []);

  const salvar = useCallback(() => {
    const prefs = { tema, tamanho, perfil };
    localStorage.setItem('preferencias', JSON.stringify(prefs));
    document.documentElement.setAttribute('data-tema', tema);
    document.documentElement.style.setProperty('--font-size-base', `${(tamanho / 100) * 16}px`);
    document.documentElement.setAttribute('data-perfil', perfil);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }, [tema, tamanho, perfil]);

  return (
    <section className="preferencias">
      <h1>⚙️ Preferências</h1>
      <p className="subtitulo">
        Personalize a aparência e o comportamento do DivergeGo. Suas escolhas ficam salvas neste navegador.
      </p>

      <fieldset className="grupo-preferencia">
        <legend>Tema</legend>
        <div className="opcoes-tema">
          {TEMAS.map((t) => (
            <label key={t.id} className={`opcao-tema ${tema === t.id ? 'ativa' : ''}`}>
              <input
                type="radio"
                name="tema"
                value={t.id}
                checked={tema === t.id}
                onChange={() => setTema(t.id)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grupo-preferencia">
        <legend>Tamanho do texto</legend>
        <div className="controle-tamanho">
          <input
            type="range"
            min={100}
            max={175}
            step={5}
            value={tamanho}
            onChange={(e) => setTamanho(Number(e.target.value))}
            aria-label={`Tamanho do texto: ${tamanho}%`}
          />
          <output>{tamanho}%</output>
        </div>
        <div className="amostra-texto" style={{ fontSize: `${(tamanho / 100) * 16}px` }}>
          Exemplo de texto no tamanho selecionado.
        </div>
      </fieldset>

      <fieldset className="grupo-preferencia">
        <legend>Perfil de acessibilidade</legend>
        <div className="opcoes-perfil">
          {PERFIS.map((p) => (
            <label key={p.id} className={`opcao-perfil ${perfil === p.id ? 'ativa' : ''}`}>
              <input
                type="radio"
                name="perfil"
                value={p.id}
                checked={perfil === p.id}
                onChange={() => setPerfil(p.id)}
              />
              <span className="perfil-label">{p.label}</span>
              <span className="perfil-descricao">{p.descricao}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="acoes-preferencias">
        <button type="button" className="btn btn-verde btn-grande" onClick={salvar}>
          💾 Salvar preferências
        </button>
        {salvo && <span className="mensagem-salvo" role="status">✅ Preferências salvas!</span>}
      </div>
    </section>
  );
}