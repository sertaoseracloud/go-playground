// Stub mínimo da linguagem Go para o CodeMirror.
// Usa a gramática Lezer genérica com destaque de palavras-chave do Go.
import { LanguageSupport, StreamLanguage } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const keywords = new Set([
  'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else',
  'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface',
  'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var',
]);

const types = new Set([
  'bool', 'byte', 'complex128', 'complex64', 'error', 'float32', 'float64',
  'int', 'int16', 'int32', 'int64', 'int8', 'rune', 'string', 'uint', 'uint16',
  'uint32', 'uint64', 'uint8', 'uintptr',
]);

const builtins = new Set([
  'append', 'cap', 'close', 'complex', 'copy', 'delete', 'imag', 'len', 'make',
  'new', 'panic', 'print', 'println', 'real', 'recover',
]);

function tokenBase(stream, state) {
  // Comentários
  if (stream.match('//')) {
    stream.skipToEnd();
    return 'comment';
  }
  if (stream.match('/*')) {
    while (!stream.match('*/')) {
      if (stream.eol()) break;
      stream.next();
    }
    return 'comment';
  }

  // Strings
  if (stream.match('"')) {
    while (!stream.eol() && !stream.match('"', false)) {
      stream.next();
    }
    stream.match('"');
    return 'string';
  }
  if (stream.match('`')) {
    while (!stream.eol() && !stream.match('`', false)) {
      stream.next();
    }
    stream.match('`');
    return 'string';
  }

  // Números
  if (stream.match(/^\d+/)) {
    return 'number';
  }

  // Identificadores e palavras-chave
  const ch = stream.next();
  if (/[a-zA-Z_]/.test(ch)) {
    stream.eatWhile(/[a-zA-Z0-9_]/);
    const word = stream.current();
    if (keywords.has(word)) return 'keyword';
    if (types.has(word)) return 'atom';
    if (builtins.has(word)) return 'builtin';
    return 'variable';
  }

  return null;
}

export function goLanguage() {
  return StreamLanguage.define({
    token: tokenBase,
    lineComment: '//',
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
  });
}

export const linguagemGo = goLanguage;