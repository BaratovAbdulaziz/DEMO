import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
}

const Window: React.FC<WindowProps> = ({ title, children, onClose, onMinimize }) => {
  const { theme } = useThemeStore();
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  };

  const getTitleBarColor = () => {
    return theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  };

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-lg shadow-lg overflow-hidden ${getBgColor()}`}
      style={{
        left: position.x,
        top: position.y,
        width: '800px',
        height: '500px'
      }}
    >
      <div
        className={`${getTitleBarColor()} h-8 flex items-center justify-between px-2 cursor-move`}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-gray-600 rounded"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500 rounded"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-2rem)] overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Window;