import React from 'react';
import { ITerminalLine } from '../../types';
import { useThemeStore } from '../../store/useThemeStore';

interface TerminalLineProps {
  line: ITerminalLine;
}

const TerminalLine: React.FC<TerminalLineProps> = ({ line }) => {
  const { fontSize } = useThemeStore();
  
  const getLineClass = () => {
    switch (line.type) {
      case 'input':
        return 'text-white';
      case 'output':
        return 'text-green-300';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };
  
  return (
    <div 
      className={`mb-1 whitespace-pre-wrap font-mono ${getLineClass()}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {line.content}
    </div>
  );
};

export default TerminalLine;