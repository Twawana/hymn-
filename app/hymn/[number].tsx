import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import hymnsData from "@/assets/data/hymns.json";
import { Hymn } from "@/types/hymn";
import { Colors, Fonts } from "@/constants/theme";
import { useAppSettings } from "../context/AppProvider";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useColorScheme } from "@/hooks/use-color-scheme";

const hymns = hymnsData as Hymn[];

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
  const { fontScale, toggleFavorite, isFavorite } = useAppSettings();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme as keyof typeof Colors];

  const PAGE = {
    background: colors.background,
    text: colors.text,
    textMuted: colors.icon,
    notation:
      colorScheme === "dark" || colorScheme === "ocean"
        ? colors.icon
        : colors.text,
  };

  const hymn = React.useMemo(
    () => hymns.find((h) => h.number === number),
    [number]
  );

  if (!hymn) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Hymn",
            headerStyle: { backgroundColor: PAGE.background },
            headerTintColor: PAGE.text,
          }}
        />
        <View style={[styles.center, { backgroundColor: PAGE.background }]}>
          <Text style={[styles.notFoundText, { color: PAGE.text }]}>
            Hymn not found.
          </Text>
          <Text
            style={[styles.backHint, { color: PAGE.textMuted }]}
            onPress={() => router.back()}
          >
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
          headerStyle: { backgroundColor: PAGE.background },
          headerTintColor: PAGE.text,
          headerTitleStyle: {
            fontFamily: Fonts.serif,
            fontSize: 17 * fontScale,
          },
        }}
      />
      <ScrollView
        style={[styles.scroll, { backgroundColor: PAGE.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Section title (e.g. "13 Eelku lyAayapuki") */}
        {hymn.sectionTitle ? (
          <Text
            style={[
              styles.sectionTitle,
              { fontSize: 13 * fontScale, color: PAGE.textMuted },
            ]}
          >
            {hymn.sectionTitle}
          </Text>
        ) : null}

        {/* Top row: large hymn number (left), author & year (right) */}
        <View style={styles.topRow}>
          <Text
            style={[
              styles.hymnNumber,
              { fontSize: 42 * fontScale, color: PAGE.text },
            ]}
          >
            {hymn.number}
          </Text>
          <View style={{ alignItems: 'flex-end' }}>
            {authorYear ? (
              <Text
                style={[
                  styles.authorYear,
                  { fontSize: 14 * fontScale, color: PAGE.textMuted },
                ]}
              >
                {authorYear}
              </Text>
            ) : null}

            <TouchableOpacity onPress={() => toggleFavorite(hymn.number)} style={{ marginTop: 8 }}>
              <IconSymbol name={isFavorite(hymn.number) ? 'heart.fill' : 'heart.fill'} size={26} color={isFavorite(hymn.number) ? '#e0245e' : PAGE.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Optional title line below number */}
        {hymn.title ? (
          <Text
            style={[
              styles.hymnTitle,
              { fontSize: 16 * fontScale, color: PAGE.textMuted },
            ]}
          >
            {hymn.title}
          </Text>
        ) : null}

        {/* Musical notation (solfa) */}
        {hymn.notation ? (
          <View style={styles.notationBlock}>
            <Text
              style={[
                styles.notation,
                { fontSize: 14 * fontScale, color: PAGE.notation },
              ]}
            >
              {hymn.notation}
            </Text>
          </View>
        ) : null}

        {/* Numbered verses */}
        {verses.length > 0 ? (
          <View style={styles.versesBlock}>
            {verses.map((line, i) => (
              <View key={i} style={styles.verse}>
                <Text
                  style={[
                    styles.verseNumber,
                    { fontSize: 16 * fontScale, color: PAGE.text },
                  ]}
                >
                  {i + 1}.
                </Text>
                <Text
                  style={[
                    styles.verseText,
                    { fontSize: 17 * fontScale, color: PAGE.text },
                  ]}
                >
                  {line}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Attribution at bottom */}
        {hymn.attribution ? (
          <Text
            style={[
              styles.attribution,
              { fontSize: 12 * fontScale, color: PAGE.textMuted },
            ]}
          >
            {hymn.attribution}
          </Text>
        ) : null}
        {hymn.reference ? (
          <Text
            style={[
              styles.reference,
              { fontSize: 12 * fontScale, color: PAGE.textMuted },
            ]}
          >
            {hymn.reference}
          </Text>
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
    fontFamily: Fonts.sans,
  },
  authorYear: {
    fontSize: 14,
    fontFamily: Fonts.serif,
    marginTop: 8,
  },
  hymnTitle: {
    fontSize: 16,
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
    minWidth: 22,
    fontFamily: Fonts.serif,
  },
  verseText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    fontFamily: Fonts.serif,
  },
  attribution: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: Fonts.serif,
  },
  reference: {
    fontSize: 12,
    fontFamily: Fonts.serif,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 12,
  },
  backHint: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
