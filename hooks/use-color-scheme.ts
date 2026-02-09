import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '@/app/context/AppProvider';

// App-wide color scheme that respects the user's selected theme, but
// gracefully falls back when used outside the AppProvider.
export function useColorScheme() {
  const system = useSystemColorScheme();
  const ctx = useContext(AppContext);
  const theme = ctx?.theme ?? 'system';

  if (theme === 'system') {
    return system;
  }

  // For custom themes like "sunset" and "ocean", just return the theme key.
  // Components that use Colors[...] will pick up the matching palette.
  return theme;
}
