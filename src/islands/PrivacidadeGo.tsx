// Página de privacidade: política de dados e controle do usuário.
// Substitui o markup estático com seções expansíveis e ações de gestão de dados.
import { useState } from 'react';

interface Secao {
  id: string;
  titulo: string;
  conteudo: string;
}

const SECOES: Secao[] = [
  {
    id: 'coleta',
    titulo: '📋 Quais dados coletamos?',
    conteudo:
      'O DivergeGo não coleta dados pessoais. Todo o progresso, preferências e rascunhos ficam salvos apenas no localStorage do seu navegador. Nenhum cookie de rastreamento é usado.',
  },
  {
    id: 'uso',
    titulo: '🔒 Como usamos seus dados?',
    conteudo:
      'Os dados locais servem exclusivamente para manter seu progresso na trilha, preferências de acessibilidade e rascunhos do editor. Eles nunca são enviados para servidores externos.',
  },
  {
    id: 'terceiros',
    titulo: '🤝 Compartilhamento com terceiros',
    conteudo:
      'Não compartilhamos dados com terceiros. O widget VLibras carrega um script externo do governo federal para tradução em Libras, mas nenhum dado do usuário é transmitido por ele.',
  },
  {
    id: 'controle',
    titulo: '⚙️ Seu controle sobre os dados',
    conteudo:
      'Você pode limpar todos os dados locais a qualquer momento pelas Preferências ou pelo aviso de armazenamento. Isso apaga progresso, certificados e preferências permanentemente.',
  },
  {
    id: 'seguranca',
    titulo: '🛡️ Segurança',
    conteudo:
      'Como tudo roda no navegador, a segurança depende das configurações do seu dispositivo. Recomendamos manter o navegador atualizado e usar bloqueadores de scripts maliciosos.',
  },
];

export default function PrivacidadeGo() {
  const [aberta, setAberta] = useState<string | null>(null);

  const toggle = (id: string) => setAberta((prev) => (prev === id ? null : id));

  const limparDados = () => {
    if (!confirm('Isso apaga todo o progresso, certificados e preferências. Tem certeza?')) return;
    localStorage.clear();
    sessionStorage.clear();
    alert('Dados limpos com sucesso.');
    window.location.reload();
  };

  return (
    <section className="privacidade">
      <header className="privacidade-header">
        <h1>🔐 Privacidade</h1>
        <p className="subtitulo">
          Transparência total sobre como o DivergeGo trata seus dados. Resumindo: tudo fica no seu navegador.
        </p>
      </header>

      <div className="privacidade-secoes">
        {SECOES.map((secao) => (
          <article key={secao.id} className={`privacidade-card ${aberta === secao.id ? 'aberta' : ''}`}>
            <button
              type="button"
              className="privacidade-toggle"
              onClick={() => toggle(secao.id)}
              aria-expanded={aberta === secao.id}
            >
              <span>{secao.titulo}</span>
              <span className="toggle-icone" aria-hidden="true">
                {aberta === secao.id ? '−' : '+'}
              </span>
            </button>
            {aberta === secao.id && <p className="privacidade-conteudo">{secao.conteudo}</p>}
          </article>
        ))}
      </div>

      <div className="privacidade-acoes">
        <h2>Gestão de dados</h2>
        <p>Você tem controle total. Limpe todos os dados locais quando quiser.</p>
        <button type="button" className="btn btn-vermelho" onClick={limparDados}>
          🗑️ Limpar todos os dados locais
        </button>
      </div>

      <article className="topico">
        <h2>Dúvidas?</h2>
        <p>
          Entre em contato pelo email{' '}
          <a href="mailto:privacidade@divergego.dev">privacidade@divergego.dev</a>. Respondemos em até 48 horas úteis.
        </p>
      </article>
    </section>
  );
}