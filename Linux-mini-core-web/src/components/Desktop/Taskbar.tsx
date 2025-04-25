import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { User, LogOut } from 'lucide-react';

interface App {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
}

interface TaskbarProps {
  apps: App[];
  onAppClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ apps, onAppClick }) => {
  const { theme } = useThemeStore();
  const { user, isAdmin, signOut } = useAuthStore();

  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  };

  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className={`${getBgColor()} ${getTextColor()} h-12 flex items-center justify-between px-4`}>
      <div className="flex items-center space-x-2">
        {apps.map(app => (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className={`flex items-center px-3 py-1 rounded ${
              app.isOpen ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            {app.icon}
            <span className="ml-2">{app.title}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <User size={18} className="mr-2" />
          <span>
            {user?.email}
            {isAdmin && ' (Admin)'}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center hover:bg-white/10 p-2 rounded"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Taskbar;