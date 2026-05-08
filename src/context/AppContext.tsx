import React, { createContext, useContext, useState, ReactNode } from 'react';
import authService from '../services/authService';

interface AppContextType {
  user: any;
  setUser: (u: any) => void;
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  themeMode: 'dark',
  toggleTheme: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () =>
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <AppContext.Provider value={{ user, setUser, themeMode, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
