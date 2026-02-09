import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import hymnsData from "@/assets/data/hymns.json";
import { Hymn } from "@/types/hymn";
import { Fonts } from "@/constants/theme";

const hymns = hymnsData as Hymn[];

// Book-like colors: cream page, black text (matches physical hymn book)
const BOOK = {
  page: "#f5f0e6",
  text: "#1a1a1a",
  textMuted: "#444",
  notation: "#333",
};

function getVerses(hymn: Hymn): string[] {
  if (hymn.verses && hymn.verses.length > 0) return hymn.verses;
  if (hymn.lyrics) {
    return hymn.lyrics.split(/\n\n+/).filter((s) => s.trim().length > 0);
  }
  return [];
}

export default function HymnScreen() {
  const { number: numberParam } = useLocalSearchParams<{ number: string }>();
  const number = numberParam ? parseInt(numberParam, 10) : NaN;
  const router = useRouter();

  const hymn = React.useMemo(
    () => hymns.find((h) => h.number === number),
    [number]
  );

  if (!hymn) {
    return (
      <>
        <Stack.Screen options={{ title: "Hymn" }} />
        <View style={[styles.center, styles.notFoundPage]}>
          <Text style={styles.notFoundText}>Hymn not found.</Text>
          <Text style={styles.backHint} onPress={() => router.back()}>
            Go back
          </Text>
        </View>
      </>
    );
  }

  const verses = getVerses(hymn);
  const authorYear =
    [hymn.author, hymn.year].filter(Boolean).join(" ") || null;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${hymn.number}. ${hymn.title}`,
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: BOOK.page },
          headerTintColor: BOOK.text,
          headerTitleStyle: {
            fontFamily: Fonts.serif,
            fontSize: 17,
          },
        }}
      />
      <ScrollView
        style={[styles.scroll, { backgroundColor: BOOK.page }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Section title (e.g. "13 Eelku lyAayapuki") */}
        {hymn.sectionTitle ? (
          <Text style={styles.sectionTitle}>{hymn.sectionTitle}</Text>
        ) : null}

        {/* Top row: large hymn number (left), author & year (right) */}
        <View style={styles.topRow}>
          <Text style={styles.hymnNumber}>{hymn.number}</Text>
          {authorYear ? (
            <Text style={styles.authorYear}>{authorYear}</Text>
          ) : null}
        </View>

        {/* Optional title line below number */}
        {hymn.title ? (
          <Text style={styles.hymnTitle}>{hymn.title}</Text>
        ) : null}

        {/* Musical notation (solfa) */}
        {hymn.notation ? (
          <View style={styles.notationBlock}>
            <Text style={styles.notation}>{hymn.notation}</Text>
          </View>
        ) : null}

        {/* Numbered verses */}
        {verses.length > 0 ? (
          <View style={styles.versesBlock}>
            {verses.map((line, i) => (
              <View key={i} style={styles.verse}>
                <Text style={styles.verseNumber}>{i + 1}.</Text>
                <Text style={styles.verseText}>{line}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Attribution at bottom */}
        {hymn.attribution ? (
          <Text style={styles.attribution}>{hymn.attribution}</Text>
        ) : null}
        {hymn.reference ? (
          <Text style={styles.reference}>{hymn.reference}</Text>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 13,
    color: BOOK.textMuted,
    marginBottom: 6,
    fontFamily: Fonts.serif,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  hymnNumber: {
    fontSize: 42,
    fontWeight: "700",
    color: BOOK.text,
    fontFamily: Fonts.sans,
  },
  authorYear: {
    fontSize: 14,
    color: BOOK.textMuted,
    fontFamily: Fonts.serif,
    marginTop: 8,
  },
  hymnTitle: {
    fontSize: 16,
    color: BOOK.textMuted,
    marginBottom: 16,
    fontFamily: Fonts.serif,
  },
  notationBlock: {
    marginBottom: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.12)",
  },
  notation: {
    fontSize: 14,
    color: BOOK.notation,
    fontFamily: Fonts.mono,
    lineHeight: 22,
  },
  versesBlock: {
    marginBottom: 24,
  },
  verse: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: BOOK.text,
    minWidth: 22,
    fontFamily: Fonts.serif,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    color: BOOK.text,
    fontFamily: Fonts.serif,
  },
  attribution: {
    fontSize: 12,
    color: BOOK.textMuted,
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: Fonts.serif,
  },
  reference: {
    fontSize: 12,
    color: BOOK.textMuted,
    fontFamily: Fonts.serif,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundPage: {
    backgroundColor: BOOK.page,
  },
  notFoundText: {
    fontSize: 18,
    color: BOOK.text,
    marginBottom: 12,
  },
  backHint: {
    fontSize: 16,
    color: BOOK.textMuted,
    textDecorationLine: "underline",
  },
});
