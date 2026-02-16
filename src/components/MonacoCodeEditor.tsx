import { useRef, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface MonacoCodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const languageMap: Record<string, string> = {
  c: 'c',
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  html: 'html',
  css: 'css',
};

const MonacoCodeEditor = ({ language, value, onChange, placeholder }: MonacoCodeEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  const handleChange = useCallback((val: string | undefined) => {
    onChange(val ?? '');
  }, [onChange]);

  return (
    <Editor
      height="320px"
      language={languageMap[language] ?? 'plaintext'}
      value={value}
      onChange={handleChange}
      onMount={handleMount}
      theme="vs-dark"
      loading={
        <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
          Loading editor...
        </div>
      }
      options={{
        fontSize: 14,
        fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 4,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
        suggest: { showWords: false },
        placeholder: placeholder,
      }}
    />
  );
};

export default MonacoCodeEditor;
