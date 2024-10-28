/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from 'react';
import { FaFolder, FaFolderOpen, FaFile, FaChevronRight, FaChevronDown, FaBars } from 'react-icons/fa';
import styles from './Sidebar.module.css';
import {socket} from '@/socket';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileSystemItem[];
  path: string;
}

interface SidebarProps {
  onToggle: () => void;
  onFileSelect: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle, onFileSelect }) => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFileSystem();
    // Listen for file system changes
    socket.on('file:refresh', fetchFileSystem);
    return () => {
      socket.off('file:refresh', fetchFileSystem);
    };
  }, []);

  const fetchFileSystem = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files`);
      if (!response.ok) {
        throw new Error('Failed to fetch file system');
      }
      const result = await response.json();
      
      // Updated conversion function to handle null values
      const convertToFileSystemItem = (
        tree: Record<string, any>, 
        parentPath: string = ''
      ): FileSystemItem[] => {
        return Object.entries(tree).map(([name, value], index) => {
          const path = parentPath ? `${parentPath}/${name}` : name;
          const id = `${index}-${path}`;
          
          // If value is null, it's a file
          if (value === null) {
            return {
              id,
              name,
              type: 'file',
              path
            };
          }
          
          // If value is an object, it's a folder
          return {
            id,
            name,
            type: 'folder',
            path,
            children: convertToFileSystemItem(value, path)
          };
        });
      };

      const convertedTree = convertToFileSystemItem(result.tree);
      console.log('Converted tree:', convertedTree); // Debug log
      setFileSystem(convertedTree);
    } catch (error) {
      console.error('Error fetching file system:', error);
      setError(error instanceof Error ? error.message : 'Failed to load file system');
    } finally {
      setIsLoading(false);
    }
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

  const handleItemClick = (item: FileSystemItem) => {
    setSelectedItem(item.id);
    if (item.type === 'file') {
      onFileSelect(item.path);
    }
  };

  const renderFileSystemItem = (item: FileSystemItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem === item.id;

    return (
      <div key={item.id} className={styles.item} style={{ paddingLeft: `${depth * 16}px` }}>
        <div
          className={`${styles.itemContent} ${isSelected ? styles.selected : ''}`}
          onClick={() => handleItemClick(item)}
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
        {isLoading && <div className={styles.message}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!isLoading && !error && fileSystem.length === 0 && (
          <div className={styles.message}>No files found</div>
        )}
        {!isLoading && !error && fileSystem.map((item) => renderFileSystemItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;
