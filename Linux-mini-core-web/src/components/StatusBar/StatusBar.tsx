import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import ProcessService from '../../services/ProcessService';
import { useThemeStore } from '../../store/useThemeStore';

const StatusBar: React.FC = () => {
  const { user, isAdmin } = useAuthStore();
  const { theme } = useThemeStore();
  const [processes, setProcesses] = React.useState<number>(0);
  
  React.useEffect(() => {
    // Update process count every second
    const interval = setInterval(() => {
      const runningProcesses = ProcessService.getRunningProcesses();
      setProcesses(runningProcesses.length);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getBgColor = () => {
    return theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  };
  
  const getTextColor = () => {
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  };
  
  return (
    <div className={`px-4 py-1 text-xs ${getBgColor()} ${getTextColor()} flex justify-between items-center`}>
      <div>
        Processes: {processes}
      </div>
      <div>
        {user ? (
          <span>
            Logged in as: {user.email}
            {isAdmin && ' (Admin)'}
          </span>
        ) : (
          <span>Not logged in - session data will be cleared when you leave</span>
        )}
      </div>
    </div>
  );
};

export default StatusBar;