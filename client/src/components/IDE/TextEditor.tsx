"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { debounce } from 'lodash';

interface TextEditorProps {
  initialValue?: string;
  language?: string;
  theme?: 'vs-dark' | 'light';
  path?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialValue = '',
  language = 'typescript',
  theme = 'vs-dark',
  path,
  onChange,
  readOnly = false,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [editorValue, setEditorValue] = useState(initialValue);

  // Handle editor mounting
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      readOnly,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  // Debounced save handler
  const debouncedSave = useCallback(
    debounce((value: string) => {
      onChange?.(value);
    }, 500),
    [onChange]
  );

  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    setEditorValue(value ?? '');
    debouncedSave(value ?? '');
  };

  // Handle manual save
  const handleSave = () => {
    const currentValue = editorRef.current?.getValue();
    onChange?.(currentValue);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Update editor value when initialValue changes
  useEffect(() => {
    if (editorRef.current && initialValue !== editorValue) {
      editorRef.current.setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={initialValue}
        theme={theme}
        path={path}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          automaticLayout: true,
        }}
        loading={<div>Loading editor...</div>}
      />
    </div>
  );
};

export default TextEditor;
