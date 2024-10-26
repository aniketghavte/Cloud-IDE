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
        <TextEditor />
        <Terminal />
      </div>
    </div>
  );
}
