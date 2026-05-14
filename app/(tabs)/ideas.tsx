import { Chip, PillButton } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const timeChips = ["Under 20 mins", "20-50 mins", "50 mins+"];
const MAX_INGREDIENTS = 8;

export default function IdeasScreen() {
  const router = useRouter();
  const { recipes } = useAppStore();
  const [time, setTime] = useState<string | null>(null);
  const [ings, setIngs] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  // 從所有食譜中取出不重複的食材，最多 8 個
  const allIngredients = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        const name = ing.name.trim();
        if (name && !seen.has(name)) {
          seen.add(name);
          list.push(name);
          if (list.length >= MAX_INGREDIENTS) return list;
        }
      }
    }
    return list;
  }, [recipes]);

  const results = useMemo(() => {
    return recipes.filter((r) => {
      const passTime =
        !time ||
        (time === "Under 20 mins" && r.time_minutes < 20) ||
        (time === "20-50 mins" && r.time_minutes >= 20 && r.time_minutes <= 50) ||
        (time === "50 mins+" && r.time_minutes > 50);
      const names = r.ingredients.map((i) => i.name.trim());
      const passIng = ings.length === 0 || ings.some((i) => names.includes(i));
      return passTime && passIng;
    });
  }, [recipes, time, ings]);

  const toggleIng = (name: string) =>
    setIngs((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Searching Ideas?</Text>
        <Text style={styles.subtitle}>Pick some ingredients and time, let&apos;s see what we can do today!</Text>

        <Text style={styles.section}>Time available</Text>
        <View style={styles.chips}>
          {timeChips.map((item) => (
            <Chip
              key={item}
              label={item}
              active={time === item}
              onPress={() => setTime((prev) => (prev === item ? null : item))}
            />
          ))}
        </View>

        <Text style={styles.section}>Ingredients</Text>
        {allIngredients.length === 0 ? (
          <Text style={styles.empty}>Add recipes with ingredients to see suggestions here.</Text>
        ) : (
          <View style={styles.chips}>
            {allIngredients.map((item) => (
              <Chip
                key={item}
                label={item}
                active={ings.includes(item)}
                onPress={() => toggleIng(item)}
              />
            ))}
          </View>
        )}

        <View style={{ marginTop: 25, alignSelf: "center" }}>
          <PillButton label="Inspire me" fullWidth onPress={() => setShow(true)} />
        </View>

        {show && (
          <View style={{ marginTop: 25, gap: 10 }}>
            {results.length === 0 ? (
              <Text style={styles.empty}>No matching recipes found. Try different filters!</Text>
            ) : (
              results.map((r) => (
                <Pressable key={r.id} onPress={() => router.push(`/recipe/${r.id}`)} style={styles.result}>
                  {r.photo_url ? (
                    <Image source={{ uri: r.photo_url }} style={styles.thumb} />
                  ) : (
                    <View style={[styles.thumb, styles.thumbPlaceholder]} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName}>{r.name}</Text>
                    <Text style={styles.resultMeta}>{r.time_minutes} mins</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F3EE", marginRight: 5, marginLeft: 5 },
  title: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 44, color: colors.textPrimary, marginTop: 20 },
  subtitle: { marginTop: 8, fontFamily: "AlbertSans_400Regular", color: colors.textSecondary, fontSize: 15 },
  section: { marginTop: 25, fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary, fontSize: 18 },
  chips: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  empty: { marginTop: 8, fontFamily: "AlbertSans_400Regular", color: colors.textSecondary, fontSize: 14 },
  result: { flexDirection: "row", gap: 12, backgroundColor: colors.card, borderRadius: 16, alignItems: "center", overflow: "hidden" },
  thumb: { width: 64, height: 64 },
  thumbPlaceholder: { backgroundColor: colors.card },
  resultName: { fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary, fontSize: 16 },
  resultMeta: { marginTop: 4, fontFamily: "Inter_400Regular", color: colors.textSecondary },
});
