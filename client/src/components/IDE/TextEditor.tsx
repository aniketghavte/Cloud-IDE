"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { debounce } from 'lodash';
import { socket } from '@/socket';

interface TextEditorProps {
  path?: string;
  readOnly?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  path,
  readOnly = false,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Fetch file contents when path changes
  const fetchFileContent = useCallback(async () => {
    if (!path) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/files/content?path=${path}`
      );
      if (!response.ok) throw new Error('Failed to fetch file content');
      
      const result = await response.json();
      setContent(result.content);
      setIsSaved(true);
    } catch (error) {
      console.error('Error fetching file content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (path) {
      fetchFileContent();
    } else {
      setContent('');
    }
  }, [path, fetchFileContent]);

  // Debounced save handler
  const debouncedSave = useCallback(
    debounce((newContent: string) => {
      if (!path) return;
      
      socket.emit('file:change', {
        path: path,
        content: newContent,
      });
      setIsSaved(true);
    }, 5000),
    [path]
  );

  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && value !== content) {
      setIsSaved(false);
      debouncedSave(value);
    }
  };

  // Handle manual save (Ctrl+S)
  const handleSave = () => {
    const currentValue = editorRef.current?.getValue();
    if (currentValue !== undefined) {
      debouncedSave.flush();
      debouncedSave(currentValue);
    }
  };

  // Handle editor mounting
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

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

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Get file language from path
  const getFileLanguage = (filePath: string | undefined) => {
    if (!filePath) return 'plaintext';
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'jsx':
        return 'javascript';
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {path && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          right: 10, 
          padding: '5px', 
          color: '#666',
          zIndex: 1 
        }}>
          {path.replaceAll('/', ' > ')} {isSaved ? '(Saved)' : '(Unsaved)'}
        </div>
      )}
      <Editor
        height="100%"
        language={getFileLanguage(path)}
        value={content}
        theme="vs-dark"
        path={path}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: readOnly || isLoading,
          automaticLayout: true,
        }}
        loading={<div>Loading editor...</div>}
      />
    </div>
  );
};

export default TextEditor;
