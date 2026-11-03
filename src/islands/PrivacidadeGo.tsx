// Página de privacidade: explica coleta zero, localStorage e direitos LGPD.
// Substitui o markup estático com conteúdo reativo e ações de exportar/apagar dados.
import { useState, useCallback } from 'react';

export default function PrivacidadeGo() {
 const [mensagem, setMensagem] = useState('');

 const exportarDados = useCallback(() => {
 try {
 const dados: Record<string, string> = {};
 for (let i = 0; i < localStorage.length; i++) {
 const chave = localStorage.key(i);
 if (chave) dados[chave] = localStorage.getItem(chave) ?? '';
 }
 const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `divergego-dados-${new Date().toISOString().slice(0, 10)}.json`;
 a.click();
 URL.revokeObjectURL(url);
 setMensagem('✅ Dados exportados com sucesso.');
 } catch {
 setMensagem('❌ Não foi possível exportar os dados.');
 }
 }, []);

 const apagarDados = useCallback(() => {
 if (!confirm('Tem certeza? Isso apaga todo o seu progresso e preferências deste navegador.')) return;
 localStorage.clear();
 setMensagem('🗑️ Todos os dados locais foram apagados.');
 }, []);

 return (
 <section className="privacidade">
 <h1>🔒 Privacidade e cookies</h1>
 <p className="subtitulo">
 O DivergeGo não coleta, não rastreia e não envia nada para nenhum servidor.
 </p>

 <article className="topico">
 <h2>Sem cookies, sem rastreamento</h2>
 <p>
 Não usamos Google Analytics, Facebook Pixel, Hotjar ou qualquer outro script de terceiros.
 Não há cadastro, login ou conta de usuário. Seu progresso fica exclusivamente no
 <code>localStorage</code> do seu navegador.
 </p>
 </article>

 <article className="topico">
 <h2>O que guardamos no seu navegador</h2>
 <ul>
 <li><b>Progresso da trilha:</b> quais exercícios você completou, XP e badges.</li>
 <li><b>Preferências:</b> tema, tamanho de texto, perfil de acessibilidade.</li>
 <li><b>Rascunhos:</b> código não salvo nos exercícios e no playground livre.</li>
 </ul>
 <p>Nada disso sai do seu computador. Se você limpar o cache do navegador, esses dados somem.</p>
 </article>

 <article className="topico">
 <h2>Seus direitos (LGPD)</h2>
 <p>Como não coletamos dados pessoais, não há base legal a invocar. Mesmo assim, você tem controle total:</p>
 <div className="acoes-privacidade">
 <button type="button" className="btn btn-verde" onClick={exportarDados}>
 ⬇️ Exportar meus dados
 </button>
 <button type="button" className="btn btn-vermelho" onClick={apagarDados}>
 🗑️ Apagar todos os dados
 </button>
 </div>
 {mensagem && <p className="mensagem-privacidade" role="status">{mensagem}</p>}
 </article>

 <article className="topico">
 <h2>Código aberto</h2>
 <p>
 O DivergeGo é software livre sob <a href="licenca/">AGPL-3.0</a> e o conteúdo didático está sob
 <a href="licenca/">CC BY-SA 4.0</a>. Você pode auditar, modificar e redistribuir tudo.
 </p>
 </article>
 </section>
 );
}