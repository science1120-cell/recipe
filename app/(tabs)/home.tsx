import { PillButton } from "@/components/ui";
import { useAppStore, mockUser } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const week = ["S", "M", "T", "W", "T", "F", "S"];
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function HomeScreen() {
  const router = useRouter();
  const { recipes } = useAppStore();
  const now = new Date();
  const today = now.getDate();
  const month = now.toLocaleString("en", { month: "short" });
  const map = new Map(recipes.map((r) => [new Date(r.date).getDate(), { id: r.id, emoji: r.mood_emoji }]));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.dateCard}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{today}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hello {mockUser.name} 👋 What do we have today?</Text>
          <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
            <PillButton label="Add Recipe" onPress={() => router.push("/recipe/new/edit")} />
          </View>
        </View>
      </View>
      <View style={styles.calendar}>
        <View style={styles.weekRow}>
          {week.map((d) => (
            <Text key={d} style={styles.weekText}>
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {days.map((d) => {
            const matched = map.get(d);
            return (
              <Pressable
                key={d}
                onPress={() => matched && router.push(`/recipe/${matched.id}`)}
                style={[styles.dayCircle, d === today && styles.today]}
              >
                <Text style={styles.dayText}>{d}</Text>
                {!!matched && <Text style={styles.emoji}>{matched.emoji}</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDE1CC", paddingHorizontal: 24 },
  headerRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  dateCard: {
    width: 80,
    height: 92,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center"
  },
  month: { fontFamily: "Inter_600SemiBold", color: colors.textSecondary },
  day: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 38, color: colors.textPrimary, marginTop: -6 },
  greeting: { fontFamily: "AlbertSans_400Regular", color: colors.textPrimary, fontSize: 20, lineHeight: 28 },
  calendar: { marginTop: 20, backgroundColor: colors.card, borderRadius: 20, padding: 16 },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  weekText: { width: "14.2%", textAlign: "center", fontFamily: "Inter_600SemiBold", color: colors.textSecondary },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 10 },
  dayCircle: { width: "14.2%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 20 },
  today: { backgroundColor: colors.primary },
  dayText: { fontFamily: "Inter_400Regular", color: colors.textPrimary },
  emoji: { position: "absolute", bottom: 2, right: 2, fontSize: 12 }
});
