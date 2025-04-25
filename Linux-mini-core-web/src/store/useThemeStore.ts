import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  fontSize: number;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 14,
      
      setTheme: (theme: Theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      increaseFontSize: () => set((state) => ({
        fontSize: Math.min(state.fontSize + 1, 24)
      })),
      
      decreaseFontSize: () => set((state) => ({
        fontSize: Math.max(state.fontSize - 1, 10)
      })),
    }),
    {
      name: 'mini-core-web-theme',
    }
  )
);