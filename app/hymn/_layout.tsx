import { Stack } from "expo-router";

export default function HymnLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="[number]" options={{ headerTitle: "Hymn" }} />
    </Stack>
  );
}
