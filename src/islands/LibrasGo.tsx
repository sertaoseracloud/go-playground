// Widget VLibras: tradução automática para Libras integrada em todas as páginas.
// Substitui o markup estático com carregamento reativo do script externo.
import { useState, useEffect } from 'react';

export default function LibrasGo() {
 const [carregado, setCarregado] = useState(false);
 const [erro, setErro] = useState(false);

 useEffect(() => {
 if (typeof window === 'undefined') return;

 // Evita carregar múltiplas vezes
 if (document.querySelector('script[src*="vlibras"]')) {
 setCarregado(true);
 return;
 }

 const script = document.createElement('script');
 script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
 script.async = true;
 script.onload = () => {
 try {
 // @ts-ignore - VLibras é injetado globalmente
 if (window.VLibras) {
 // @ts-ignore
 new window.VLibras.Widget('https://vlibras.gov.br/app');
 setCarregado(true);
 }
 } catch {
 setErro(true);
 }
 };
 script.onerror = () => setErro(true);
 document.head.appendChild(script);
 }, []);

 return (
 <div className="libras-widget" aria-label="Tradução para Libras">
 {erro && (
 <p className="libras-erro" role="alert">
 ⚠️ Não foi possível carregar o VLibras. Verifique sua conexão.
 </p>
 )}
 {!carregado && !erro && (
 <p className="libras-carregando" aria-live="polite">
 Carregando tradutor de Libras…
 </p>
 )}
 {carregado && (
 <div className="libras-ativo" aria-live="polite">
 ✅ Tradutor de Libras ativo
 </div>
 )}
 </div>
 );
}