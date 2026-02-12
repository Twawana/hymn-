import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserData = {
  username: string;
  password: string;
};

export type AppTheme = 'system' | 'light' | 'dark' | 'sunset' | 'ocean';

type AppContextType = {
  fontScale: number;
  setFontScale: (v: number) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  user: UserData | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  favorites: number[];
  toggleFavorite: (num: number) => void;
  isFavorite: (num: number) => boolean;
  playlist: number[];
  addToPlaylist: (num: number) => void;
  removeFromPlaylist: (num: number) => void;
  clearPlaylist: () => void;
  isInPlaylist: (num: number) => boolean;
  isLoading: boolean;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const GLOBAL_FONT_SCALE_KEY = 'fontScale'; // fallback/global
const THEME_KEY = 'appTheme';
const USERS_KEY = 'appUsers';
const CURRENT_USER_KEY = 'currentUser';
const FONT_SCALE_PREFIX = 'fontScale_';
const FAVORITES_PREFIX = 'favorites_';
const PLAYLIST_PREFIX = 'playlist_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScaleState] = useState<number>(1);
  const [theme, setThemeState] = useState<AppTheme>('system');
  const [user, setUser] = useState<UserData | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [playlist, setPlaylist] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved settings and current user on app start
  useEffect(() => {
    const loadStored = async () => {
      try {
        const [storedTheme, storedCurrent] = await Promise.all([
          AsyncStorage.getItem(THEME_KEY),
          AsyncStorage.getItem(CURRENT_USER_KEY),
        ]);

        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'sunset' || storedTheme === 'ocean' || storedTheme === 'system') {
          setThemeState(storedTheme);
        }

        if (storedCurrent) {
          const parsed = JSON.parse(storedCurrent) as UserData;
          setUser(parsed);
          // load per-user fontScale, favorites and playlist
          const [userFont, userFavs, userPlaylist] = await Promise.all([
            AsyncStorage.getItem(FONT_SCALE_PREFIX + parsed.username),
            AsyncStorage.getItem(FAVORITES_PREFIX + parsed.username),
            AsyncStorage.getItem(PLAYLIST_PREFIX + parsed.username),
          ]);
          if (userFont) setFontScaleState(parseFloat(userFont));
          if (userFavs) {
            try {
              const favs = JSON.parse(userFavs) as number[];
              setFavorites(favs);
            } catch {
              setFavorites([]);
            }
          }
          if (userPlaylist) {
            try {
              setPlaylist(JSON.parse(userPlaylist));
            } catch {
              setPlaylist([]);
            }
          }
        } else {
          // load global font scale fallback
          const globalFont = await AsyncStorage.getItem(GLOBAL_FONT_SCALE_KEY);
          if (globalFont) setFontScaleState(parseFloat(globalFont));
        }
      } catch (err) {
        console.error('Failed to load stored data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStored();
  }, []);

  const handleSetTheme = (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    AsyncStorage.setItem(THEME_KEY, nextTheme).catch((err) =>
      console.error('Failed to save theme preference:', err)
    );
  };

  const handleSetFontScale = (v: number) => {
    setFontScaleState(v);
    if (user) {
      AsyncStorage.setItem(FONT_SCALE_PREFIX + user.username, v.toString()).catch((err) =>
        console.error('Failed to save user font scale:', err)
      );
    } else {
      AsyncStorage.setItem(GLOBAL_FONT_SCALE_KEY, v.toString()).catch((err) =>
        console.error('Failed to save global font scale:', err)
      );
    }
  };

  const login = async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) return;
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      if (users[username]) {
        if (users[username] !== password) {
          throw new Error('Incorrect password');
        }
      } else {
        users[username] = password;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      const userData: UserData = { username, password };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      setUser(userData);

      // load user-specific settings
      const [userFont, userFavs] = await Promise.all([
        AsyncStorage.getItem(FONT_SCALE_PREFIX + username),
        AsyncStorage.getItem(FAVORITES_PREFIX + username),
      ]);
      setFontScaleState(userFont ? parseFloat(userFont) : 1);
      if (userFavs) {
        try {
          setFavorites(JSON.parse(userFavs));
        } catch {
          setFavorites([]);
        }
      } else setFavorites([]);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await AsyncStorage.setItem(FONT_SCALE_PREFIX + user.username, fontScale.toString());
        await AsyncStorage.setItem(FAVORITES_PREFIX + user.username, JSON.stringify(favorites));
      }
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
      setFavorites([]);
      setFontScaleState(1);
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const toggleFavorite = (num: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(num);
      const next = exists ? prev.filter((n) => n !== num) : [...prev, num];
      if (user) {
        AsyncStorage.setItem(FAVORITES_PREFIX + user.username, JSON.stringify(next)).catch((err) =>
          console.error('Failed to save favorites:', err)
        );
      }
      return next;
    });
  };

  const addToPlaylist = (num: number) => {
    setPlaylist((prev) => {
      if (prev.includes(num)) return prev;
      const next = [...prev, num];
      if (user) AsyncStorage.setItem(PLAYLIST_PREFIX + user.username, JSON.stringify(next)).catch((err) => console.error('Failed to save playlist:', err));
      return next;
    });
  };

  const removeFromPlaylist = (num: number) => {
    setPlaylist((prev) => {
      const next = prev.filter((n) => n !== num);
      if (user) AsyncStorage.setItem(PLAYLIST_PREFIX + user.username, JSON.stringify(next)).catch((err) => console.error('Failed to save playlist:', err));
      return next;
    });
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    if (user) AsyncStorage.setItem(PLAYLIST_PREFIX + user.username, JSON.stringify([])).catch((err) => console.error('Failed to clear playlist:', err));
  };

  const isFavorite = (num: number) => favorites.includes(num);
  const isInPlaylist = (num: number) => playlist.includes(num);

  const value = useMemo(
    () => ({
      fontScale,
      setFontScale: handleSetFontScale,
      theme,
      setTheme: handleSetTheme,
      user,
      login,
      logout,
      favorites,
      toggleFavorite,
      isFavorite,
      playlist,
      addToPlaylist,
      removeFromPlaylist,
      clearPlaylist,
      isInPlaylist,
      isLoading,
    }),
    [fontScale, theme, user, favorites, playlist, isLoading]
  );

  if (isLoading) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppProvider');
  return ctx;
}

export default AppProvider;
