// Aviso de armazenamento: banner exibido quando localStorage está cheio ou indisponível.
// Substitui o markup estático com detecção reativa e ações de limpar dados.
import { useState, useEffect, useCallback } from 'react';

export default function AvisoArmazenamentoGo() {
 const [visivel, setVisivel] = useState(false);
 const [mensagem, setMensagem] = useState('');

 useEffect(() => {
 try {
 const teste = '__storage_test__';
 localStorage.setItem(teste, teste);
 localStorage.removeItem(teste);
 } catch {
 setVisivel(true);
 setMensagem('Seu navegador bloqueou o armazenamento local. Seu progresso não será salvo.');
 return;
 }

 const usado = Object.keys(localStorage).reduce((acc, chave) => {
 return acc + (localStorage.getItem(chave)?.length || 0);
 }, 0);
 const limite = 5 * 1024 * 1024; // ~5MB
 if (usado > limite * 0.9) {
 setVisivel(true);
 setMensagem(`Armazenamento quase cheio (${Math.round((usado / limite) * 100)}%). Considere apagar dados antigos.`);
 }
 }, []);

 const limparDados = useCallback(() => {
 if (!confirm('Isso apaga todo o progresso e preferências. Tem certeza?')) return;
 localStorage.clear();
 setVisivel(false);
 window.location.reload();
 }, []);

 const dispensar = useCallback(() => {
 setVisivel(false);
 sessionStorage.setItem('aviso-armazenamento-dismissed', '1');
 }, []);

 useEffect(() => {
 if (sessionStorage.getItem('aviso-armazenamento-dismissed') === '1') {
 setVisivel(false);
 }
 }, []);

 if (!visivel) return null;

 return (
 <div className="aviso-armazenamento" role="alert">
 <div className="aviso-conteudo">
 <span className="aviso-icone">⚠️</span>
 <p>{mensagem}</p>
 </div>
 <div className="aviso-acoes">
 <button type="button" className="btn btn-pequeno btn-vermelho" onClick={limparDados}>
 🗑️ Limpar dados
 </button>
 <button type="button" className="btn btn-pequeno btn-fantasma" onClick={dispensar}>
 ✕ Dispensar
 </button>
 </div>
 </div>
 );
}