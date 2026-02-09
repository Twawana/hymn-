import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import hymnsData from "@/assets/data/hymns.json";
import { Hymn } from "@/types/hymn";
import { Colors } from "@/constants/theme";

const hymns = hymnsData as Hymn[];

export default function BrowseScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

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
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Browse all hymns</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {hymns.length} hymns · Tap to open
        </Text>
      </View>
      <FlatList
        data={hymns}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
