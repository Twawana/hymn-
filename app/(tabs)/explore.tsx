import hymnsData from "@/assets/data/hymns.json";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Hymn } from "@/types/hymn";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "../context/AppProvider";

const hymns = hymnsData as Hymn[];

export default function BrowseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme as keyof typeof Colors];
  const router = useRouter();
  const { addToPlaylist, removeFromPlaylist, isInPlaylist } = useAppSettings();

  // Get filtered hymns based on search
  let filteredHymns: Hymn[] = [];
  
  if (searchQuery.trim() === "") {
    filteredHymns = hymns;
  } else {
    const query = searchQuery.trim().toLowerCase();
    
    // Try exact number match first
    const byNumber = hymns.find((h) => h.number.toString() === query);
    if (byNumber) {
      filteredHymns = [byNumber];
    } else {
      // Then try title match and return only the first match
      const byTitle = hymns.find((h) => h.title.toLowerCase().includes(query));
      if (byTitle) {
        filteredHymns = [byTitle];
      } else {
        filteredHymns = [];
      }
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Browse all hymns</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {searchQuery ? `${filteredHymns.length} result${filteredHymns.length === 1 ? "" : "s"}` : `${hymns.length} hymns · Tap to open`}
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.icon + "15",
              color: colors.text,
              borderColor: colors.icon + "30",
            },
          ]}
          placeholder="Search by number or title..."
          placeholderTextColor={colors.icon + "70"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType="default"
        />
      </View>

      {filteredHymns.length === 0 && searchQuery ? (
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.icon }]}>
            No hymns found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          key={searchQuery}
          data={filteredHymns}
          keyExtractor={(item, index) => `${item.number}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );

  function renderItem({ item }: { item: Hymn }) {
    return (
      <TouchableOpacity
        style={[styles.item, { borderBottomColor: colors.icon + "30" }]}
        onPress={() => router.push(`/hymn/${item.number}`)}
        activeOpacity={0.7}
      >
        <Text style={[styles.itemNumber, { color: colors.tint }]}>{item.number}</Text>
        <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <TouchableOpacity
          style={styles.playlistButton}
          onPress={() => {
            if (isInPlaylist(item.number)) removeFromPlaylist(item.number);
            else addToPlaylist(item.number);
          }}
        >
          <Ionicons name={isInPlaylist(item.number) ? 'checkmark' : 'add'} size={20} color={colors.tint} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
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
  playlistButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontSize: 16,
    textAlign: "center",
  },
});
