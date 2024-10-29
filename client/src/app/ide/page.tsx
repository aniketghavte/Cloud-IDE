"use client"
import React, { useState } from 'react'
import Sidebar from '@/components/IDE/Sidebar'
import TextEditor from '@/components/IDE/TextEditor'
import Terminal from '@/components/IDE/Terminal'

const IDEPage = () => {
  const [selectedFile, setSelectedFile] = useState<string | undefined>()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh' 
    }}>
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden' 
      }}>
        <Sidebar 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onFileSelect={(path) => setSelectedFile(path)}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            height: "55%"
          }}>
            <TextEditor path={selectedFile} />
          </div>
          <Terminal />
        </div>
      </div>
    </div>
  )
}

export default IDEPage
