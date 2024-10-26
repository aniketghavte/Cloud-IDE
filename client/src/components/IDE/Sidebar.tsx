"use client"
import React, { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaChevronRight, FaChevronDown, FaBars } from 'react-icons/fa';
import styles from './Sidebar.module.css';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemItem[];
}

interface SidebarProps {
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchFileSystem();
  }, []);

  const fetchFileSystem = async () => {
    const mockFileSystem: FileSystemItem[] = [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        children: [
          { id: '2', name: 'components', type: 'folder', children: [] },
          { id: '3', name: 'utils', type: 'folder', children: [] },
          { id: '4', name: 'App.tsx', type: 'file' },
          { id: '5', name: 'index.tsx', type: 'file' },
        ],
      },
      {
        id: '6',
        name: 'public',
        type: 'folder',
        children: [
          { id: '7', name: 'index.html', type: 'file' },
          { id: '8', name: 'favicon.ico', type: 'file' },
        ],
      },
      { id: '9', name: 'package.json', type: 'file' },
      { id: '10', name: 'tsconfig.json', type: 'file' },
    ];

    setFileSystem(mockFileSystem);
  };

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
  };

  const renderFileSystemItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem === item.id;

    return (
      <div key={item.id} className={styles.item} style={{ paddingLeft: `${depth * 16}px` }}>
        <div
          className={`${styles.itemContent} ${isSelected ? styles.selected : ''}`}
          onClick={() => handleItemClick(item.id)}
        >
          {item.type === 'folder' && (
            <div 
              className={`${styles.icon} ${styles.folderIcon}`}
              onClick={(e) => toggleFolder(item.id, e)}
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </div>
          )}
          {item.type === 'folder' && (
            <div className={`${styles.icon} ${styles.folderIcon}`}>
              {isExpanded ? <FaFolderOpen /> : <FaFolder />}
            </div>
          )}
          {item.type === 'file' && (
            <div className={`${styles.icon} ${styles.fileIcon}`}>
              <FaFile />
            </div>
          )}
          <span className={styles.itemName}>{item.name}</span>
        </div>
        {item.type === 'folder' && isExpanded && item.children && (
          <div className={styles.children}>
            {item.children.map((child) => renderFileSystemItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.title}>Project Explorer</h2>
        <button className={styles.toggleButton} onClick={() => { setIsCollapsed(!isCollapsed); onToggle(); }}>
          <FaBars />
        </button>
      </div>
      <div className={styles.fileSystem}>
        {fileSystem.map((item) => renderFileSystemItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;
