import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSettings } from '../context/AppProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const THEME_OPTIONS = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'sunset', label: 'Sunset Vibes' },
  { key: 'ocean', label: 'Ocean Vibes' },
] as const;

export default function Settings() {
  const { fontScale, setFontScale, theme, setTheme } = useAppSettings();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme as keyof typeof Colors];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.inner}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Theme</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map(option => {
            const isActive = theme === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.themeChip,
                  {
                    borderColor: isActive ? colors.tint : colors.icon,
                    backgroundColor: isActive ? colors.tint + '20' : 'transparent',
                  },
                ]}
                onPress={() => setTheme(option.key as any)}
              >
                <Text
                  style={{
                    color: isActive ? colors.tint : colors.text,
                    fontWeight: isActive ? '700' : '400',
                    fontSize: 13,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Font Size</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, { borderColor: colors.icon }]}
            onPress={() => setFontScale(Math.max(0.75, fontScale - 0.1))}
          >
            <Text style={{ color: colors.text }}>Smaller</Text>
          </TouchableOpacity>
          <Text style={[styles.value, { color: colors.icon }]}>{fontScale.toFixed(2)}x</Text>
          <TouchableOpacity
            style={[styles.btn, { borderColor: colors.icon }]}
            onPress={() => setFontScale(Math.min(2, fontScale + 0.1))}
          >
            <Text style={{ color: colors.text }}>Larger</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.reset, { borderColor: colors.icon }]}
          onPress={() => setFontScale(1)}
        >
          <Text style={{ color: colors.text }}>Reset to default</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, gap: 16 },
  sectionLabel: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  themeChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    opacity: 0.2,
    marginVertical: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btn: { padding: 10, borderRadius: 8, borderWidth: 1 },
  value: { fontSize: 16, minWidth: 56, textAlign: 'center' },
  reset: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});
