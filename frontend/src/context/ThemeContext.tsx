import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'light';
type PrimaryColor = '#3b82f6' | '#10b981' | '#8b5cf6' | '#ec4899' | '#f59e0b';

interface ThemeContextType {
  theme: ThemeMode;
  primaryColor: PrimaryColor;
  toggleTheme: () => void;
  setPrimaryColor: (color: PrimaryColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme_mode') as ThemeMode) || 'dark';
  });

  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>(() => {
    return (localStorage.getItem('theme_color') as PrimaryColor) || '#3b82f6';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme_mode', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-primary-glow', `${primaryColor}55`);
    localStorage.setItem('theme_color', primaryColor);
  }, [primaryColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setPrimaryColor = (color: PrimaryColor) => {
    setPrimaryColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, primaryColor, toggleTheme, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
