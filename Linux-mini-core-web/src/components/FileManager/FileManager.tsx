import React, { useState } from 'react';
import { Folder, File, Plus, Trash2 } from 'lucide-react';
import FileSystemService from '../../services/FileSystemService';
import { useThemeStore } from '../../store/useThemeStore';

const FileManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const { theme } = useThemeStore();
  
  const entries = FileSystemService.listDirectory();
  
  const handleNavigate = (name: string) => {
    if (name === '..') {
      FileSystemService.changeDirectory('..');
      setCurrentPath(prev => prev.slice(0, -1));
    } else {
      FileSystemService.changeDirectory(name);
      setCurrentPath(prev => [...prev, name]);
    }
  };
  
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newItemName) {
      if (isCreatingFile) {
        FileSystemService.createFile(newItemName);
      } else if (isCreatingFolder) {
        FileSystemService.createDirectory(newItemName);
      }
      
      setNewItemName('');
      setIsCreatingFile(false);
      setIsCreatingFolder(false);
    }
  };
  
  const handleDelete = (name: string) => {
    FileSystemService.removeEntry(name, true);
  };
  
  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  };
  
  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-800';
  };
  
  return (
    <div className={`h-full ${getBgColor()} ${getTextColor()} p-4`}>
      {/* Path Navigation */}
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-700">
        <button
          onClick={() => handleNavigate('..')}
          className="px-2 py-1 rounded hover:bg-gray-700"
          disabled={currentPath.length === 0}
        >
          ..
        </button>
        <span>/</span>
        {currentPath.map((dir, i) => (
          <React.Fragment key={i}>
            <span>{dir}</span>
            {i < currentPath.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setIsCreatingFile(true)}
          className="flex items-center px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-1" />
          New File
        </button>
        <button
          onClick={() => setIsCreatingFolder(true)}
          className="flex items-center px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus size={16} className="mr-1" />
          New Folder
        </button>
      </div>
      
      {/* New Item Form */}
      {(isCreatingFile || isCreatingFolder) && (
        <form onSubmit={handleCreateItem} className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter ${isCreatingFile ? 'file' : 'folder'} name`}
              className="px-2 py-1 rounded bg-gray-800 text-white"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setNewItemName('');
                setIsCreatingFile(false);
                setIsCreatingFolder(false);
              }}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {/* File List */}
      <div className="grid grid-cols-4 gap-4">
        {entries.map((entry) => (
          <div
            key={entry.name}
            className="p-2 rounded hover:bg-gray-700 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center"
                onClick={() => {
                  if (entry.type === 'directory') {
                    handleNavigate(entry.name);
                  }
                }}
              >
                {entry.type === 'directory' ? (
                  <Folder size={24} className="text-yellow-500 mr-2" />
                ) : (
                  <File size={24} className="text-blue-500 mr-2" />
                )}
                <span className="truncate">{entry.name}</span>
              </div>
              
              <button
                onClick={() => handleDelete(entry.name)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManager;