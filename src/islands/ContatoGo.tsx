// Página de contato: canais de comunicação e suporte.
// Substitui o markup estático com formulário reativo via mailto e links diretos.
import { useState } from 'react';

type Assunto = 'suporte' | 'parceria' | 'imprensa' | 'outro';

interface FormContato {
  nome: string;
  email: string;
  assunto: Assunto;
  mensagem: string;
}

const INICIAL: FormContato = {
  nome: '',
  email: '',
  assunto: 'suporte',
  mensagem: '',
};

export default function ContatoGo() {
  const [form, setForm] = useState<FormContato>(INICIAL);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const atualizar = (campo: keyof FormContato, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErro('');
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mensagem.trim()) {
      setErro('Por favor, escreva uma mensagem.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setErro('Informe um email válido para resposta.');
      return;
    }

    const assunto = `[DivergeGo Contato] ${form.assunto.toUpperCase()} — ${form.nome || 'Anônimo'}`;
    const corpo = `Nome: ${form.nome || 'não informado'}\nEmail: ${form.email}\nAssunto: ${form.assunto}\n\nMensagem:\n${form.mensagem}`;
    const mailto = `mailto:contato@divergego.dev?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

    window.open(mailto, '_blank');
    setEnviado(true);
    setForm(INICIAL);
  };

  if (enviado) {
    return (
      <section className="contato">
        <header className="contato-header">
          <h1>📬 Contato</h1>
        </header>
        <div className="contato-sucesso" role="status">
          <h2>✅ Mensagem preparada!</h2>
          <p>Seu cliente de email foi aberto com a mensagem preenchida. Basta revisar e enviar.</p>
          <button type="button" className="btn btn-verde" onClick={() => setEnviado(false)}>
            Enviar outra mensagem
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="contato">
      <header className="contato-header">
        <h1>📬 Contato</h1>
        <p className="subtitulo">
          Dúvidas, parcerias ou sugestões? Escolha o canal mais conveniente para você.
        </p>
      </header>

      <div className="contato-canais">
        <article className="canal-card">
          <h2>📧 Email direto</h2>
          <p>Para questões gerais e suporte técnico.</p>
          <a href="mailto:contato@divergego.dev" className="btn btn-fantasma">contato@divergego.dev</a>
        </article>
        <article className="canal-card">
          <h2>🐛 Bugs e issues</h2>
          <p>Reporte problemas diretamente no GitHub.</p>
          <a href="https://github.com/divergego/go-playground/issues" target="_blank" rel="noopener noreferrer" className="btn btn-fantasma">Abrir issue</a>
        </article>
        <article className="canal-card">
          <h2>💬 Comunidade</h2>
          <p>Junte-se à conversa no Discord.</p>
          <a href="https://discord.gg/divergego" target="_blank" rel="noopener noreferrer" className="btn btn-fantasma">Entrar no Discord</a>
        </article>
      </div>

      <form className="contato-formulario" onSubmit={enviar}>
        <h2>Ou envie uma mensagem</h2>

        <label htmlFor="contato-nome">Nome</label>
        <input
          id="contato-nome"
          type="text"
          value={form.nome}
          onChange={(e) => atualizar('nome', e.target.value)}
          placeholder="Seu nome"
        />

        <label htmlFor="contato-email">Email *</label>
        <input
          id="contato-email"
          type="email"
          value={form.email}
          onChange={(e) => atualizar('email', e.target.value)}
          placeholder="seu@email.com"
          required
        />

        <label htmlFor="contato-assunto">Assunto</label>
        <select
          id="contato-assunto"
          value={form.assunto}
          onChange={(e) => atualizar('assunto', e.target.value as Assunto)}
        >
          <option value="suporte">🔧 Suporte técnico</option>
          <option value="parceria">🤝 Parceria / Colaboração</option>
          <option value="imprensa">📰 Imprensa</option>
          <option value="outro">📝 Outro assunto</option>
        </select>

        <label htmlFor="contato-mensagem">Mensagem *</label>
        <textarea
          id="contato-mensagem"
          rows={6}
          value={form.mensagem}
          onChange={(e) => atualizar('mensagem', e.target.value)}
          placeholder="Como podemos ajudar?"
          required
        />

        {erro && <p className="feedback-erro" role="alert">{erro}</p>}

        <div className="contato-acoes">
          <button type="submit" className="btn btn-verde">📧 Abrir no email</button>
        </div>

        <p className="feedback-nota">
          Nenhum dado é enviado automaticamente. Seu cliente de email será aberto para revisão.
        </p>
      </form>
    </section>
  );
}