import { PillButton } from "@/components/ui";
import { mockUser, useAppStore } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const COL_GAP = 10;
const ROW_GAP = 10;

export default function HomeScreen() {
  const router = useRouter();
  const { recipes } = useAppStore();
  const now = new Date();
  const today = now.getDate();
  const month = now.toLocaleString("en", { month: "short" });
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const map = new Map<number, { id: string; emoji: string }[]>();
  recipes.forEach((r) => {
    if (!r.date.startsWith(currentYM)) return;
    const day = parseInt(r.date.slice(8, 10), 10);
    const entry = map.get(day) ?? [];
    entry.push({ id: r.id, emoji: r.mood_emoji });
    map.set(day, entry);
  });

  // Build calendar grid for the current month
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const calRows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) calRows.push(cells.slice(i, i + 7));

  return (
    <View style={styles.fullBg}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.dateCard}>
            <Text style={styles.month}>{month}</Text>
            <Text style={styles.day}>{today}</Text>
          </View>
          <View style={styles.greetingCol}>
            <Text style={styles.greetingName}>Hello {mockUser.name} 👋</Text>
            <Text style={styles.greetingQuestion}>What do we have today?</Text>
            <View style={styles.buttonWrap}>
              <PillButton label="Add Recipe" onPress={() => router.push("/recipe/new/edit")} />
            </View>
          </View>
        </View>

        <View style={styles.calendar}>
          {/* Week header */}
          <View style={styles.row}>
            {WEEK.map((d, i) => (
              <View key={i} style={styles.weekCell}>
                <Text style={styles.weekText}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Day rows */}
          {calRows.map((row, ri) => (
            <View key={ri} style={[styles.row, { marginTop: ROW_GAP }]}>
              {row.map((d, ci) =>
                d === null ? (
                  <View key={ci} style={styles.emptyCell} />
                ) : (
                  <Pressable
                    key={ci}
                    onPress={() => {
                      const entries = map.get(d);
                      if (!entries?.length) return;
                      if (entries.length === 1) {
                        router.push(`/recipe/${entries[0].id}`);
                      } else {
                        router.push(`/recipe/${entries[0].id}`);
                      }
                    }}
                    style={[styles.dayCircle, d === today && styles.today]}
                  >
                    <Text style={styles.dayText}>{d}</Text>
                    {!!map.get(d)?.length && <Text style={styles.emoji}>{map.get(d)![0].emoji}</Text>}
                  </Pressable>
                )
              )}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullBg: {
    flex: 1,
    backgroundColor: "#F6F3EE",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 32,
    paddingTop: 30,
    justifyContent: "flex-start",
    marginRight: 5,
    marginLeft: 5,
  },
  headerRow: { flexDirection: "row", gap: 20, alignItems: "center", marginTop: 30},
  dateCard: {
    width: 80,
    height: 92,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  month: { fontFamily: "IMFellDWPicaSC_400Regular", color: colors.textSecondary },
  day: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 38, color: colors.textPrimary, marginTop: -6 },
  greetingCol: { flex: 1 },
  greetingName: { fontFamily: "AlbertSans_400Regular", color: colors.textPrimary, fontSize: 20, lineHeight: 28 },
  greetingQuestion: { fontFamily: "AlbertSans_400Regular", color: colors.textPrimary, fontSize: 20, lineHeight: 28 },
  buttonWrap: { marginTop: 10, alignSelf: "flex-end" },
  calendar: { marginTop: 32, marginLeft: 5, marginRight: 5, backgroundColor: "transparent"},
  row: { flexDirection: "row", gap: COL_GAP },
  weekCell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#E5E1DA",
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCell: { flex: 1, aspectRatio: 1 },
  weekText: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 13, color: colors.textSecondary },
  dayCircle: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#CDDBE6",
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
  },
  today: { backgroundColor: colors.primary },
  dayText: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 18, color: colors.textPrimary },
  emoji: { position: "absolute", top: 2, right: 3, fontSize: 13 },
});
