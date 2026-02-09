import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import hymnsData from "@/assets/data/hymns.json";
import { Hymn } from "@/types/hymn";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppSettings } from '../context/AppProvider';

const hymns = hymnsData as Hymn[];

function filterHymns(query: string, list: Hymn[]): Hymn[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  const asNumber = parseInt(q, 10);
  if (!Number.isNaN(asNumber)) {
    return list.filter(
      (h) => h.number === asNumber || h.number.toString().startsWith(q)
    );
  }

  return list.filter((h) => {
    const titleMatch = h.title.toLowerCase().includes(q);
    const lyricsMatch = h.lyrics && h.lyrics.toLowerCase().includes(q);
    const versesMatch =
      h.verses && h.verses.some((v) => v.toLowerCase().includes(q));
    return titleMatch || lyricsMatch || versesMatch;
  });
}

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme as keyof typeof Colors];
  const router = useRouter();
  const { fontScale } = useAppSettings();

  const filtered = useMemo(
    () => filterHymns(query, hymns),
    [query]
  );

  const renderItem = ({ item }: { item: Hymn }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: colors.icon + "30" }]}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text, fontSize: 28 * fontScale }]}>Hymn Book</Text>
          <Text style={[styles.subtitle, { color: colors.icon, fontSize: 14 * fontScale }]}>
            Search by number or first words
          </Text>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor:
                  colorScheme === "dark" || colorScheme === "ocean"
                    ? "#252525"
                    : "#f0f0f0",
                color: colors.text,
                borderColor: colors.icon + "40",
                fontSize: 16 * fontScale,
              },
            ]}
            placeholder="e.g. 1 Omukriste nyanyukwa"
            placeholderTextColor={colors.icon}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.number.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.icon, fontSize: 16 * fontScale }]}> 
                  {query.trim() ? "No hymns match your search." : "Type a number or words to search."}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  itemNumber: {
    fontSize: 18,
    fontWeight: "700",
    minWidth: 32,
  },
  itemTitle: {
    flex: 1,
    fontSize: 17,
  },
  empty: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});
