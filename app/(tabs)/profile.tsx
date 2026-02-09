import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function Profile() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.inner}>
        <Text style={[styles.label, { color: colors.text }]}>About</Text>

        <View style={[styles.card, { borderColor: colors.tint, backgroundColor: colors.tint + '08' }]}>
          <Text style={[styles.appName, { color: colors.text }]}>Hymn Book</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            A simple hymn app for worship and devotion.
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.icon + '15', borderColor: colors.icon }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Use the Search and Browse tabs to find hymns quickly, and the Settings tab to adjust the
            font size to your liking.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, gap: 16 },
  label: { fontSize: 24, fontWeight: '700' },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginVertical: 12,
  },
  appName: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
  subtitle: { fontSize: 14 },
  infoBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
  },
  infoText: { fontSize: 14, lineHeight: 20 },
});
