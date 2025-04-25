import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { X } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error, clearError } = useAuthStore();
  const { theme } = useThemeStore();
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(username, password);
    if (!error) {
      onClose();
    }
  };
  
  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  };
  
  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-800';
  };
  
  const getInputBgColor = () => {
    return theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${getBgColor()} ${getTextColor()} p-6 rounded-lg shadow-lg w-full max-w-md relative`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6">Login to Mini Core Web</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-500 bg-opacity-20 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError();
              }}
              className={`w-full p-2 rounded ${getInputBgColor()} ${getTextColor()} border border-gray-400`}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className={`w-full p-2 rounded ${getInputBgColor()} ${getTextColor()} border border-gray-400`}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded bg-green-600 text-white font-medium
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;