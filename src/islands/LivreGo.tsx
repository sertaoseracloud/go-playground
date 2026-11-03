// Playground livre: editor Go sem exercício, com terminal e execução direta.
// Substitui o markup estático de livre/index.astro com integração reativa.
import { useState, useCallback } from 'react';
import EditorGo from './EditorGo';
import TerminalGo from './TerminalGo';
import { compilarGo } from '../go/compiler-browser.js';

const CODIGO_PADRAO = `package main

import "fmt"

func main() {
\tfmt.Println("Olá, playground livre!")
}`;

export default function LivreGo() {
 const [codigo, setCodigo] = useState(CODIGO_PADRAO);
 const [saida, setSaida] = useState('');
 const [executando, setExecutando] = useState(false);

 const executar = useCallback(async () => {
 setExecutando(true);
 setSaida('');
 try {
 const resultado = await compilarGo(codigo, []);
 setSaida(resultado.saida || resultado.erro || '(sem saída)');
 } catch (e: any) {
 setSaida(`Erro: ${e?.message ?? 'falha desconhecida'}`);
 } finally {
 setExecutando(false);
 }
 }, [codigo]);

 return (
 <section className="livre">
 <header className="livre-header">
 <h1>🛝 Playground livre</h1>
 <p className="subtitulo">
 Escreva qualquer código Go e execute no navegador. Sem testes, sem exercício — só você e o compilador.
 </p>
 </header>

 <div className="livre-layout">
 <div className="livre-editor">
 <EditorGo
 codigo={codigo}
 onChange={setCodigo}
 aria-label="Editor de código Go livre"
 />
 </div>
 <div className="livre-terminal">
 <TerminalGo saida={saida} executando={executando} />
 </div>
 </div>

 <div className="livre-acoes">
 <button
 type="button"
 className="btn btn-verde btn-grande"
 onClick={executar}
 disabled={executando || !codigo.trim()}
 >
 {executando ? 'Executando…' : '▶ Executar'}
 </button>
 <button
 type="button"
 className="btn btn-fantasma"
 onClick={() => setCodigo(CODIGO_PADRAO)}
 >
 Restaurar exemplo
 </button>
 </div>
 </section>
 );
}