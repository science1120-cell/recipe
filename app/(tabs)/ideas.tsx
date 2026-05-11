import { Chip, PillButton } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const timeChips = ["Under 20 mins", "20-50 mins", "50 mins+"];
const ingredients = ["生菜", "番茄", "牛肉", "白飯", "玉米"];

export default function IdeasScreen() {
  const router = useRouter();
  const { recipes } = useAppStore();
  const [time, setTime] = useState<string | null>(null);
  const [ings, setIngs] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  const results = useMemo(() => {
    return recipes.filter((r) => {
      const passTime =
        !time ||
        (time === "Under 20 mins" && r.time_minutes < 20) ||
        (time === "20-50 mins" && r.time_minutes >= 20 && r.time_minutes <= 50) ||
        (time === "50 mins+" && r.time_minutes > 50);
      const names = r.ingredients.map((i) => i.name);
      const passIng = ings.length === 0 || ings.every((i) => names.includes(i));
      return passTime && passIng;
    });
  }, [recipes, time, ings]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Searching Ideas?</Text>
        <Text style={styles.subtitle}>Pick some ingredients and time, let&apos;s see what we can do today!</Text>
        <Text style={styles.section}>Time available</Text>
        <View style={styles.chips}>
          {timeChips.map((item) => (
            <Chip key={item} label={item} active={time === item} onPress={() => setTime(item)} />
          ))}
        </View>
        <Text style={styles.section}>Ingredients</Text>
        <View style={styles.chips}>
          {ingredients.map((item) => (
            <Chip
              key={item}
              label={item}
              active={ings.includes(item)}
              onPress={() => setIngs((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))}
            />
          ))}
        </View>
        <View style={{ marginTop: 18 }}>
          <PillButton label="Inspire me" fullWidth onPress={() => setShow(true)} />
        </View>
        {show && (
          <View style={{ marginTop: 20, gap: 10 }}>
            {results.map((r) => (
              <Pressable key={r.id} onPress={() => router.push(`/recipe/${r.id}`)} style={styles.result}>
                <Image source={{ uri: r.photo_url }} style={styles.thumb} />
                <View>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text style={styles.resultMeta}>{r.time_minutes} mins</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDE1CC", paddingHorizontal: 24 },
  title: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 44, color: colors.textPrimary },
  subtitle: { marginTop: 8, fontFamily: "AlbertSans_400Regular", color: colors.textSecondary, fontSize: 16 },
  section: { marginTop: 16, fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary, fontSize: 18 },
  chips: { marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  result: { flexDirection: "row", gap: 12, backgroundColor: colors.card, borderRadius: 16, padding: 10, alignItems: "center" },
  thumb: { width: 62, height: 62, borderRadius: 12 },
  resultName: { fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary, fontSize: 16 },
  resultMeta: { marginTop: 4, fontFamily: "Inter_400Regular", color: colors.textSecondary }
});
