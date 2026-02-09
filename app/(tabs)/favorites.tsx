import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import hymnsData from '@/assets/data/hymns.json';
import { Hymn } from '@/types/hymn';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSettings } from '../context/AppProvider';

const hymns = hymnsData as Hymn[];

export default function Favorites() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { favorites } = useAppSettings();

  const list = useMemo(() => {
    return favorites
      .map((n) => hymns.find((h) => h.number === n))
      .filter(Boolean) as Hymn[];
  }, [favorites]);

  const renderItem = ({ item }: { item: Hymn }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: colors.icon + '30' }]}
      onPress={() => router.push(`/hymn/${item.number}`)}
      activeOpacity={0.7}
    >
      <Text style={[styles.itemNumber, { color: colors.tint }]}>{item.number}</Text>
      <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={list}
        keyExtractor={(i) => i.number.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={(
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.icon }]}>You have no favorite hymns yet.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  itemNumber: { fontSize: 18, fontWeight: '700', minWidth: 32 },
  itemTitle: { flex: 1, fontSize: 17 },
  empty: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { fontSize: 16 },
});
