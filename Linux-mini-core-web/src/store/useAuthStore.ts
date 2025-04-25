import { create } from 'zustand';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut as supabaseSignOut,
  getCurrentUser,
  saveFileSystem,
  loadFileSystem,
  getUserProfile,
  isAdmin
} from '../lib/supabase';
import FileSystemService from '../services/FileSystemService';
import ProcessService from '../services/ProcessService';
import { useTerminalStore } from './useTerminalStore';

interface AuthState {
  user: any | null;
  profile: any | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  saveUserData: () => Promise<void>;
  loadUserData: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  error: null,
  
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        set({ error: error.message, loading: false });
        return;
      }
      
      const user = data.user;
      const profile = await getUserProfile(user.id);
      const adminStatus = await isAdmin(user.id);
      
      set({ 
        user: user,
        profile: profile.data,
        isAdmin: adminStatus,
        loading: false 
      });
      
      // Load user's file system
      await get().loadUserData();
    } catch (error) {
      let message = 'An error occurred during sign in';
      if (error instanceof Error) message = error.message;
      set({ error: message, loading: false });
    }
  },
  
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await signUpWithEmail(email, password);
      
      if (error) {
        set({ error: error.message, loading: false });
        return;
      }
      
      const user = data.user;
      const profile = await getUserProfile(user.id);
      const adminStatus = await isAdmin(user.id);
      
      set({ 
        user: user,
        profile: profile.data,
        isAdmin: adminStatus,
        loading: false 
      });
    } catch (error) {
      let message = 'An error occurred during sign up';
      if (error instanceof Error) message = error.message;
      set({ error: message, loading: false });
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    
    try {
      // First save user data
      await get().saveUserData();
      
      const { error } = await supabaseSignOut();
      
      if (error) {
        set({ error: error.message, loading: false });
        return;
      }
      
      // Reset file system and terminal
      FileSystemService.resetFileSystem();
      ProcessService.clearProcesses();
      useTerminalStore.getState().resetTerminal();
      
      set({ 
        user: null,
        profile: null,
        isAdmin: false,
        loading: false 
      });
    } catch (error) {
      let message = 'An error occurred during sign out';
      if (error instanceof Error) message = error.message;
      set({ error: message, loading: false });
    }
  },
  
  checkSession: async () => {
    set({ loading: true });
    
    try {
      const user = await getCurrentUser();
      
      if (user) {
        const profile = await getUserProfile(user.id);
        const adminStatus = await isAdmin(user.id);
        
        set({ 
          user,
          profile: profile.data,
          isAdmin: adminStatus,
          loading: false 
        });
        
        // Load user data if they're signed in
        await get().loadUserData();
      } else {
        set({ 
          user: null,
          profile: null,
          isAdmin: false,
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        user: null,
        profile: null,
        isAdmin: false,
        loading: false 
      });
    }
  },
  
  saveUserData: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const fsData = FileSystemService.serializeFileSystem();
      await saveFileSystem(user.id, fsData);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },
  
  loadUserData: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const { data, error } = await loadFileSystem(user.id);
      
      if (error || !data) {
        console.error('Error loading file system:', error);
        return;
      }
      
      if (data.data) {
        FileSystemService.loadFileSystem(data.data);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));