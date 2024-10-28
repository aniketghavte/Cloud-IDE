"use client"
import React, { useState } from 'react'
import styles from './IDE.module.css'
import { Sidebar, TextEditor, Terminal } from '@/components/IDE'

export default function IDEPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.ideContainer}>
      <Sidebar onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`${styles.mainContent} ${isSidebarCollapsed ? styles.expanded : ''}`}>
        <TextEditor
          initialValue="const hello = 'world';"
          language="typescript"
          theme="vs-dark"
          path="example.ts"
          onChange={(value) => console.log('Content changed:', value)}
          readOnly={false}
        />
        <Terminal />
      </div>
    </div>
  );
}
