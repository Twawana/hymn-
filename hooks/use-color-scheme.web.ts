import { useEffect, useState, useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { AppContext } from '@/app/context/AppProvider';

/**
 * Web-specific color scheme hook.
 * - Waits for hydration to avoid mismatches.
 * - Respects the user's selected theme from AppProvider.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const system = useRNColorScheme();
  const ctx = useContext(AppContext);
  const theme = ctx?.theme ?? 'system';

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    // During SSR / first paint, just show light to avoid mismatch.
    return 'light';
  }

  if (theme === 'system') {
    return system;
  }

  // Custom or explicit theme: light, dark, sunset, ocean
  return theme;
}
