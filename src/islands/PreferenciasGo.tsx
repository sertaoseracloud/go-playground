// Página de preferências do usuário: tema, idioma e configurações pessoais.
// Substitui o markup estático com controles reativos e persistência local.
import { useState, useEffect } from 'react';

type Tema = 'claro' | 'escuro' | 'auto';
type Idioma = 'pt-BR' | 'en' | 'es';

interface PreferenciasUsuario {
  tema: Tema;
  idioma: Idioma;
  editorFontSize: number;
  autoSave: boolean;
  mostrarDicas: boolean;
  somNotificacoes: boolean;
}

const PADRAO: PreferenciasUsuario = {
  tema: 'auto',
  idioma: 'pt-BR',
  editorFontSize: 14,
  autoSave: true,
  mostrarDicas: true,
  somNotificacoes: false,
};

export default function PreferenciasGo() {
  const [prefs, setPrefs] = useState<PreferenciasUsuario>(PADRAO);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divergego:preferencias');
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', prefs.tema);
    document.documentElement.setAttribute('lang', prefs.idioma);
  }, [prefs.tema, prefs.idioma]);

  const atualizar = <K extends keyof PreferenciasUsuario>(chave: K, valor: PreferenciasUsuario[K]) => {
    setPrefs((prev) => ({ ...prev, [chave]: valor }));
    setSalvo(false);
  };

  const salvar = () => {
    try {
      localStorage.setItem('divergego:preferencias', JSON.stringify(prefs));
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2000);
    } catch {}
  };

  const resetar = () => {
    setPrefs(PADRAO);
    setSalvo(false);
    try {
      localStorage.removeItem('divergego:preferencias');
    } catch {}
  };

  return (
    <section className="preferencias">
      <header className="preferencias-header">
        <h1>⚙️ Preferências</h1>
        <p className="subtitulo">
          Personalize sua experiência no DivergeGo. Todas as configurações ficam salvas no seu navegador.
        </p>
      </header>

      <form className="preferencias-formulario" onSubmit={(e) => { e.preventDefault(); salvar(); }}>
        <fieldset>
          <legend>Aparência</legend>
          <label htmlFor="pref-tema">Tema</label>
          <select
            id="pref-tema"
            value={prefs.tema}
            onChange={(e) => atualizar('tema', e.target.value as Tema)}
          >
            <option value="auto">🌗 Automático (segue o sistema)</option>
            <option value="claro">☀️ Claro</option>
            <option value="escuro">🌙 Escuro</option>
          </select>

          <label htmlFor="pref-fonte">Tamanho da fonte do editor</label>
          <div className="range-grupo">
            <input
              id="pref-fonte"
              type="range"
              min={10}
              max={24}
              step={1}
              value={prefs.editorFontSize}
              onChange={(e) => atualizar('editorFontSize', Number(e.target.value))}
            />
            <span className="range-valor">{prefs.editorFontSize}px</span>
          </div>
        </fieldset>

        <fieldset>
          <legend>Idioma e região</legend>
          <label htmlFor="pref-idioma">Idioma da interface</label>
          <select
            id="pref-idioma"
            value={prefs.idioma}
            onChange={(e) => atualizar('idioma', e.target.value as Idioma)}
          >
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Editor e aprendizado</legend>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={prefs.autoSave}
              onChange={(e) => atualizar('autoSave', e.target.checked)}
            />
            <span className="toggle-label">Salvar rascunhos automaticamente</span>
            <span className="toggle-desc">Seu código no playground livre é salvo a cada 30 segundos.</span>
          </label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={prefs.mostrarDicas}
              onChange={(e) => atualizar('mostrarDicas', e.target.checked)}
            />
            <span className="toggle-label">Mostrar dicas nos exercícios</span>
            <span className="toggle-desc">Exibe sugestões progressivas quando você trava em um exercício.</span>
          </label>
          <label className="toggle-item">
            <input
              type="checkbox"
              checked={prefs.somNotificacoes}
              onChange={(e) => atualizar('somNotificacoes', e.target.checked)}
            />
            <span className="toggle-label">Som nas notificações</span>
            <span className="toggle-desc">Toca um som curto quando um exercício é concluído ou um certificado é emitido.</span>
          </label>
        </fieldset>

        <div className="preferencias-acoes">
          <button type="submit" className="btn btn-verde">💾 Salvar preferências</button>
          <button type="button" className="btn btn-fantasma" onClick={resetar}>Restaurar padrão</button>
          {salvo && <span className="feedback-sucesso" role="status">✅ Preferências salvas!</span>}
        </div>
      </form>
    </section>
  );
}