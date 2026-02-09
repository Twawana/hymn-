import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppTheme = 'system' | 'light' | 'dark' | 'sunset' | 'ocean';

type AppContextType = {
  fontScale: number;
  setFontScale: (v: number) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const FONT_SCALE_KEY = 'fontScale'; // single global font scale
const THEME_KEY = 'appTheme'; // theme preference

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScaleState] = useState<number>(1);
  const [theme, setThemeState] = useState<AppTheme>('system');

  // Load saved settings on app start
  useEffect(() => {
    const loadStoredSettings = async () => {
      try {
        const [storedFontScale, storedTheme] = await Promise.all([
          AsyncStorage.getItem(FONT_SCALE_KEY),
          AsyncStorage.getItem(THEME_KEY),
        ]);

        if (storedFontScale) {
          const parsed = parseFloat(storedFontScale);
          if (!Number.isNaN(parsed)) {
            setFontScaleState(parsed);
          }
        }

        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'sunset' || storedTheme === 'ocean' || storedTheme === 'system') {
          setThemeState(storedTheme);
        }
      } catch (err) {
        console.error('Failed to load app settings:', err);
      }
    };

    loadStoredSettings();
  }, []);

  const handleSetFontScale = (v: number) => {
    setFontScaleState(v);
    AsyncStorage.setItem(FONT_SCALE_KEY, v.toString()).catch(err =>
      console.error('Failed to save font scale:', err)
    );
  };

  const handleSetTheme = (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    AsyncStorage.setItem(THEME_KEY, nextTheme).catch(err =>
      console.error('Failed to save theme preference:', err)
    );
  };

  const value = useMemo(
    () => ({ fontScale, setFontScale: handleSetFontScale, theme, setTheme: handleSetTheme }),
    [fontScale, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppProvider');
  return ctx;
}

export default AppProvider;
