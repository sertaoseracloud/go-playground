// Stub do tema do editor CodeMirror: usa o tema padrão do Dracula ou fallback neutro.
// O tema real será migrado do Vite SPA; por ora, exporta uma extensão vazia para não quebrar o build.
import { EditorView } from '@codemirror/view';

/**
 * Extensão de tema para o editor CodeMirror.
 * Retorna uma configuração mínima com cores básicas compatíveis com o tema escuro do DivergeGo.
 */
export const temaEditor = EditorView.theme({
  '&': {
    color: '#f8f8f2',
    backgroundColor: '#282a36',
  },
  '.cm-content': {
    caretColor: '#f8f8f2',
    fontFamily: 'var(--fonte-codigo, "Fira Code", monospace)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#f8f8f2' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#44475a',
  },
  '.cm-activeLine': { backgroundColor: '#44475a33' },
  '.cm-gutters': {
    backgroundColor: '#282a36',
    color: '#6272a4',
    border: 'none',
  },
  '.cm-activeLineGutter': { backgroundColor: '#44475a33' },
});