import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AppProvider from './context/AppProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Treat "ocean" as a dark-style nav theme, everything else as default.
  const navTheme =
    colorScheme === 'dark' || colorScheme === 'ocean' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navTheme}>
      <AppProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="hymn" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </ThemeProvider>
  );
}
