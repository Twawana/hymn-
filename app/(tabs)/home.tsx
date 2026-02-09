import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSettings } from '../context/AppProvider';

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { fontScale } = useAppSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.text, fontSize: 28 * fontScale }]}>Welcome</Text>
        <Text style={[styles.subtitle, { color: colors.icon, fontSize: 16 * fontScale }]}>A simple hymn book for worship</Text>

        <View style={styles.sample}>
          <Text style={{ color: colors.text, fontSize: 18 * fontScale }}>Sample text to preview font size.</Text>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.tint }]} onPress={() => router.push('/(tabs)/index')}>
          <Text style={styles.buttonText}>Search Hymns</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.tint }]} onPress={() => router.push('/(tabs)/explore')}>
          <Text style={styles.buttonText}>Browse</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, gap: 12 },
  title: { fontWeight: '700' },
  subtitle: { marginBottom: 8 },
  sample: { paddingVertical: 12 },
  button: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '700' },
});
