import { Chip, SoftInput } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { CollectionTag } from "@/lib/types";
import { colors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const collections: CollectionTag[] = ["All", "Desserts", "Lunchbox", "Midnight snack", "Diet"];

export default function RecipesScreen() {
  const router = useRouter();
  const { recipes } = useAppStore();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<CollectionTag>("All");
  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) =>
          (active === "All" || r.collection_tag === active) &&
          r.name.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [recipes, search, active]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>{recipes.length} recipes</Text>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <SoftInput style={styles.search} placeholder="Search recipes..." value={search} onChangeText={setSearch} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 14 }}>
        {collections.map((tag) => (
          <Chip key={tag} label={tag} active={active === tag} onPress={() => setActive(tag)} />
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.grid}>
        {filtered.map((r) => (
          <Pressable key={r.id} style={styles.card} onPress={() => router.push(`/recipe/${r.id}`)}>
            <Image source={{ uri: r.photo_url }} style={styles.photo} />
            <Text style={styles.recipeName}>{r.name}</Text>
            <Text style={styles.meta}>{r.time_minutes} mins · {r.servings} srv</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDE1CC", paddingHorizontal: 24 },
  title: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 48, color: colors.textPrimary },
  subtitle: { fontFamily: "Inter_400Regular", color: colors.textSecondary, fontSize: 16, marginTop: -6 },
  searchWrap: { marginTop: 12, flexDirection: "row", backgroundColor: colors.card, borderRadius: 12, alignItems: "center", paddingLeft: 12 },
  search: { flex: 1, backgroundColor: "transparent" },
  grid: { paddingVertical: 16, gap: 12, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: colors.card, borderRadius: 20, paddingBottom: 12, overflow: "hidden" },
  photo: { width: "100%", aspectRatio: 1 },
  recipeName: { marginTop: 8, marginHorizontal: 10, fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary },
  meta: { marginTop: 4, marginHorizontal: 10, fontFamily: "Inter_400Regular", color: colors.textSecondary, fontSize: 12 }
});
