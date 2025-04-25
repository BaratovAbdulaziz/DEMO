import React, { useRef, useEffect } from 'react';
import TerminalLine from './TerminalLine';
import TerminalInput from './TerminalInput';
import { useTerminalStore } from '../../store/useTerminalStore';
import { useThemeStore } from '../../store/useThemeStore';

const Terminal: React.FC = () => {
  const { lines } = useTerminalStore();
  const { theme } = useThemeStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when lines change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);
  
  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  };
  
  const getTextColor = () => {
    return theme === 'dark' ? 'text-green-400' : 'text-gray-800';
  };
  
  return (
    <div 
      className={`flex-1 p-4 font-mono overflow-auto ${getBgColor()} ${getTextColor()} transition-colors duration-200`}
      ref={terminalRef}
    >
      {lines.map(line => (
        <TerminalLine key={line.id} line={line} />
      ))}
      <TerminalInput />
    </div>
  );
};

export default Terminal;