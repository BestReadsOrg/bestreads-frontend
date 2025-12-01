'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import settingsService from '@/services/settingsService';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Initialize theme on mount
  useEffect(() => {
    const initTheme = async () => {
      if (isAuthenticated && user) {
        // For logged-in users, fetch from API
        try {
          const settings = await settingsService.getSettings();
          setIsDarkMode(settings.darkMode);
        } catch (error) {
          console.error('Failed to fetch theme preference:', error);
          // Fall back to session storage for logged-in users too
          const sessionTheme = sessionStorage.getItem('theme');
          setIsDarkMode(sessionTheme === 'dark');
        }
      } else {
        // For non-logged-in users, use session storage only
        const sessionTheme = sessionStorage.getItem('theme');
        setIsDarkMode(sessionTheme === 'dark');
      }
      setLoading(false);
    };

    initTheme();
  }, [isAuthenticated, user]);

  // Apply theme class to document
  useEffect(() => {
    if (!loading) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, loading]);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);

    if (isAuthenticated && user) {
      // For logged-in users, save to database
      try {
        await settingsService.updateDarkMode(newValue);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
        // Still update session storage as fallback
        sessionStorage.setItem('theme', newValue ? 'dark' : 'light');
      }
    } else {
      // For non-logged-in users, save to session storage only
      sessionStorage.setItem('theme', newValue ? 'dark' : 'light');
    }
  };

  const setDarkModeValue = async (value: boolean) => {
    setIsDarkMode(value);

    if (isAuthenticated && user) {
      try {
        await settingsService.updateDarkMode(value);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
        sessionStorage.setItem('theme', value ? 'dark' : 'light');
      }
    } else {
      sessionStorage.setItem('theme', value ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode: setDarkModeValue,
    loading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
