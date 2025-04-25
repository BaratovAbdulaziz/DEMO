import React, { useState } from 'react';
import Taskbar from './Taskbar';
import Window from './Window';
import { useThemeStore } from '../../store/useThemeStore';
import Terminal from '../Terminal/Terminal';
import FileManager from '../FileManager/FileManager';
import { Maximize2, Terminal as TerminalIcon, FolderOpen } from 'lucide-react';

interface App {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
}

const Desktop: React.FC = () => {
  const { theme } = useThemeStore();
  const [apps, setApps] = useState<App[]>([
    {
      id: 'terminal',
      title: 'Terminal',
      icon: <TerminalIcon size={24} />,
      content: <Terminal />,
      isOpen: true,
      isMinimized: false
    },
    {
      id: 'files',
      title: 'Files',
      icon: <FolderOpen size={24} />,
      content: <FileManager />,
      isOpen: false,
      isMinimized: false
    }
  ]);

  const toggleApp = (id: string) => {
    setApps(apps.map(app => {
      if (app.id === id) {
        if (!app.isOpen) {
          return { ...app, isOpen: true, isMinimized: false };
        }
        return { ...app, isMinimized: !app.isMinimized };
      }
      return app;
    }));
  };

  const closeApp = (id: string) => {
    setApps(apps.map(app => 
      app.id === id ? { ...app, isOpen: false, isMinimized: false } : app
    ));
  };

  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  };

  return (
    <div className={`h-screen flex flex-col ${getBgColor()}`}>
      <div className="flex-1 relative overflow-hidden">
        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-4">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => toggleApp(app.id)}
              className="flex flex-col items-center p-2 rounded hover:bg-white/10"
            >
              {app.icon}
              <span className="text-sm mt-1 text-white">{app.title}</span>
            </button>
          ))}
        </div>

        {/* Windows */}
        {apps.map(app => (
          app.isOpen && !app.isMinimized && (
            <Window
              key={app.id}
              title={app.title}
              onClose={() => closeApp(app.id)}
              onMinimize={() => toggleApp(app.id)}
            >
              {app.content}
            </Window>
          )
        ))}
      </div>

      <Taskbar apps={apps} onAppClick={toggleApp} />
    </div>
  );
};

export default Desktop