import React, { useState, useRef, useEffect } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';
import { useThemeStore } from '../../store/useThemeStore';
import FileSystemService from '../../services/FileSystemService';

const TerminalInput: React.FC = () => {
  const { 
    currentInput, 
    setCurrentInput, 
    executeCommand, 
    navigateHistory 
  } = useTerminalStore();
  
  const { fontSize } = useThemeStore();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      executeCommand(currentInput.trim());
      setCurrentInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion - just for file/dir names in current directory
      const parts = currentInput.split(' ');
      
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        
        if (lastPart) {
          try {
            const entries = FileSystemService.listDirectory();
            const matches = entries.filter(entry => 
              entry.name.startsWith(lastPart)
            );
            
            if (matches.length === 1) {
              // Exact match, complete with the name
              parts[parts.length - 1] = matches[0].name;
              
              // Add trailing slash for directories
              if (matches[0].type === 'directory') {
                parts[parts.length - 1] += '/';
              }
              
              setCurrentInput(parts.join(' '));
            }
          } catch (error) {
            console.error('Tab completion error:', error);
          }
        }
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <span className="text-green-500 mr-2">
        {FileSystemService.getCurrentPath()} $
      </span>
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none"
        style={{ fontSize: `${fontSize}px` }}
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
    </form>
  );
};

export default TerminalInput;