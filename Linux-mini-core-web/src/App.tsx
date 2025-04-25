import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop/Desktop';
import LoginModal from './components/Auth/LoginModal';
import SignupModal from './components/Auth/SignupModal';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const { checkSession } = useAuthStore();
  const { theme } = useThemeStore();
  
  // Check for existing session on load
  useEffect(() => {
    checkSession();
    
    // Handle unload event to save data
    const handleBeforeUnload = () => {
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        authStore.saveUserData();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Setup periodic auto-save for logged in users
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        authStore.saveUserData();
      }
    }, 60000); // Save every minute
    
    return () => clearInterval(autoSaveInterval);
  }, []);
  
  const getDarkClass = () => {
    return theme === 'dark' ? 'dark' : '';
  };
  
  return (
    <div className={`${getDarkClass()} h-screen flex flex-col`}>
      <Desktop />
      
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      
      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
      />
    </div>
  );
}

export default App;