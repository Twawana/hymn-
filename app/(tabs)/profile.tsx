import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAppSettings } from '../context/AppProvider';

type StoredUser = {
  username: string;
  phone: string;
  password: string;
};

export default function Profile() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { fontScale } = useAppSettings();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('hymnbook_user');
        if (!raw) return;
        const parsed = JSON.parse(raw) as StoredUser;
        setUser(parsed);
      } catch {
        // ignore
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('hymnbook_user');
      setUser(null);
    } catch {
      // ignore
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.inner}>
          <Text style={[styles.label, { color: colors.text, fontSize: 24 * fontScale }]}>Profile</Text>
          <View style={[styles.card, { borderColor: colors.icon + '40', backgroundColor: colors.icon + '10' }]}>
            <Text style={[styles.infoText, { color: colors.text, fontSize: 16 * fontScale }]}>
              No account found. Please register or log in from the Search tab.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.inner}>
        <Text style={[styles.label, { color: colors.text, fontSize: 24 * fontScale }]}>Account Details</Text>

        <View style={[styles.accountCard, { borderColor: colors.tint + '40', backgroundColor: colors.tint + '08' }]}>
          <View style={styles.accountHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[styles.username, { color: colors.text, fontSize: 22 * fontScale }]}>
              {user.username}
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.icon, fontSize: 14 * fontScale }]}>
                Username
              </Text>
              <Text style={[styles.detailValue, { color: colors.text, fontSize: 16 * fontScale }]}>
                {user.username}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.icon + '20' }]} />

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.icon, fontSize: 14 * fontScale }]}>
                Phone Number
              </Text>
              <Text style={[styles.detailValue, { color: colors.text, fontSize: 16 * fontScale }]}>
                {user.phone}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.tint }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={[styles.infoBox, { backgroundColor: colors.icon + '10', borderColor: colors.icon + '30' }]}>
          <Text style={[styles.infoText, { color: colors.text, fontSize: 14 * fontScale }]}>
            Your account information is stored locally on this device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  inner: { padding: 20, gap: 16 },
  label: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  accountCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  username: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
  },
  detailsSection: {
    gap: 0,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
