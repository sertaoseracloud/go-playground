// Formulário de feedback: envio de sugestões, bugs e elogios sem backend.
// Substitui o markup estático com formulário reativo e confirmação local.
import { useState } from 'react';

type Categoria = 'bug' | 'sugestao' | 'elogio' | 'acessibilidade' | 'outro';

interface FeedbackForm {
 categoria: Categoria;
 mensagem: string;
 email: string;
 contexto: string;
}

const INICIAL: FeedbackForm = {
 categoria: 'sugestao',
 mensagem: '',
 email: '',
 contexto: '',
};

export default function FeedbackGo() {
 const [form, setForm] = useState<FeedbackForm>(INICIAL);
 const [enviado, setEnviado] = useState(false);
 const [erro, setErro] = useState('');

 const atualizar = (campo: keyof FeedbackForm, valor: string) => {
 setForm((prev) => ({ ...prev, [campo]: valor }));
 setErro('');
 };

 const enviar = (e: React.FormEvent) => {
 e.preventDefault();
 if (!form.mensagem.trim()) {
 setErro('Por favor, escreva uma mensagem antes de enviar.');
 return;
 }
 if (form.mensagem.trim().length < 10) {
 setErro('A mensagem precisa ter pelo menos 10 caracteres.');
 return;
 }

 // Simula envio; em produção usaria mailto: ou API serverless
 const assunto = `[DivergeGo Feedback] ${form.categoria.toUpperCase()}`;
 const corpo = `Categoria: ${form.categoria}\nContexto: ${form.contexto || 'não informado'}\nEmail: ${form.email || 'não informado'}\n\nMensagem:\n${form.mensagem}`;
 const mailto = `mailto:feedback@divergego.dev?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

 window.open(mailto, '_blank');
 setEnviado(true);
 setForm(INICIAL);
 };

 if (enviado) {
 return (
 <section className="feedback">
 <header className="feedback-header">
 <h1>💬 Feedback</h1>
 </header>
 <div className="feedback-sucesso" role="status">
 <h2>✅ Obrigado pelo feedback!</h2>
 <p>Seu cliente de email foi aberto com a mensagem preenchida. Basta enviar.</p>
 <button type="button" className="btn btn-verde" onClick={() => setEnviado(false)}>
 Enviar outro feedback
 </button>
 </div>
 </section>
 );
 }

 return (
 <section className="feedback">
 <header className="feedback-header">
 <h1>💬 Feedback</h1>
 <p className="subtitulo">
 Sugestões, bugs, elogios ou problemas de acessibilidade. Seu feedback melhora o DivergeGo para todos.
 </p>
 </header>

 <form className="feedback-formulario" onSubmit={enviar}>
 <label htmlFor="feedback-categoria">Categoria</label>
 <select
 id="feedback-categoria"
 value={form.categoria}
 onChange={(e) => atualizar('categoria', e.target.value)}
 >
 <option value="sugestao">💡 Sugestão</option>
 <option value="bug">🐛 Bug / Erro</option>
 <option value="elogio">🎉 Elogio</option>
 <option value="acessibilidade">♿ Acessibilidade</option>
 <option value="outro">📝 Outro</option>
 </select>

 <label htmlFor="feedback-mensagem">Mensagem *</label>
 <textarea
 id="feedback-mensagem"
 rows={6}
 value={form.mensagem}
 onChange={(e) => atualizar('mensagem', e.target.value)}
 placeholder="Descreva sua ideia, problema ou experiência…"
 required
 />

 <label htmlFor="feedback-contexto">Contexto (opcional)</label>
 <input
 id="feedback-contexto"
 type="text"
 value={form.contexto}
 onChange={(e) => atualizar('contexto', e.target.value)}
 placeholder="Ex: página Trilha, exercício Fibonacci, navegador Firefox…"
 />

 <label htmlFor="feedback-email">Email para resposta (opcional)</label>
 <input
 id="feedback-email"
 type="email"
 value={form.email}
 onChange={(e) => atualizar('email', e.target.value)}
 placeholder="seu@email.com"
 />

 {erro && <p className="feedback-erro" role="alert">{erro}</p>}

 <div className="feedback-acoes">
 <button type="submit" className="btn btn-verde">📧 Abrir no email</button>
 </div>

 <p className="feedback-nota">
 Nenhum dado é enviado automaticamente. Seu cliente de email será aberto com a mensagem preenchida para você revisar e enviar.
 </p>
 </form>
 </section>
 );
}