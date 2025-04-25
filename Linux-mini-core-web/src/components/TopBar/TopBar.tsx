import React from 'react';
import { Monitor, Moon, Sun, User, UserPlus, LogOut, Plus, Minus } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';

interface TopBarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLoginClick, onSignupClick }) => {
  const { theme, toggleTheme, increaseFontSize, decreaseFontSize } = useThemeStore();
  const { user, signOut } = useAuthStore();
  
  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  };
  
  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-800';
  };
  
  const getIconColor = () => {
    return theme === 'dark' ? 'stroke-green-400' : 'stroke-gray-800';
  };
  
  return (
    <div className={`px-4 py-2 ${getBgColor()} ${getTextColor()} flex justify-between items-center`}>
      <div className="flex items-center">
        <Monitor className={`mr-2 ${getIconColor()}`} size={20} />
        <span className="font-bold">Mini Core Web</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={decreaseFontSize}
          className="p-1 rounded hover:bg-gray-700 hover:bg-opacity-30"
          aria-label="Decrease font size"
        >
          <Minus className={getIconColor()} size={16} />
        </button>
        
        <button 
          onClick={increaseFontSize}
          className="p-1 rounded hover:bg-gray-700 hover:bg-opacity-30"
          aria-label="Increase font size"
        >
          <Plus className={getIconColor()} size={16} />
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-1 rounded hover:bg-gray-700 hover:bg-opacity-30"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className={getIconColor()} size={18} />
          ) : (
            <Moon className={getIconColor()} size={18} />
          )}
        </button>
        
        {user ? (
          <button 
            onClick={() => signOut()}
            className="flex items-center space-x-1 p-1 rounded hover:bg-gray-700 hover:bg-opacity-30"
          >
            <LogOut className={getIconColor()} size={18} />
            <span className="text-sm">Logout</span>
          </button>
        ) : (
          <>
            <button 
              onClick={onLoginClick}
              className="flex items-center space-x-1 p-1 rounded hover:bg-gray-700 hover:bg-opacity-30"
            >
              <User className={getIconColor()} size={18} />
              <span className="text-sm">Login</span>
            </button>
            
            <button 
              onClick={onSignupClick}
              className="flex items-center space-x-1 p-1 rounded hover:bg-gray-700 hover:bg-opacity-30"
            >
              <UserPlus className={getIconColor()} size={18} />
              <span className="text-sm">Signup</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;