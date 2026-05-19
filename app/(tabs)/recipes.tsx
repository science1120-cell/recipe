import { Chip, SoftInput } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { useAppTheme, usePreferences } from "@/context/PreferencesContext";
import { CollectionTag } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const collections: CollectionTag[] = ["All", "Desserts", "Lunchbox", "Midnight snack", "Diet"];

export default function RecipesScreen() {
  const router = useRouter();
  const { recipes } = useAppStore();
  const { colors, fonts } = useAppTheme();
  const { scale } = usePreferences();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        screenRoot: { flex: 1, backgroundColor: colors.background },
        container: {
          flex: 1,
          paddingHorizontal: 24,
        },
        title: {
          fontFamily: fonts.serif,
          fontSize: scale(48),
          color: colors.textPrimary,
          marginTop: 20,
        },
        subtitle: {
          fontFamily: fonts.meta,
          color: colors.textSecondary,
          fontSize: scale(15),
          marginLeft: 5,
        },
        searchWrap: {
          marginTop: 12,
          flexDirection: "row",
          backgroundColor: colors.card,
          borderRadius: 12,
          alignItems: "center",
          paddingLeft: 10,
        },
        search: { paddingLeft: 5, marginRight: 30, backgroundColor: "transparent" },
        grid: {
          paddingVertical: 16,
          gap: 12,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        card: {
          width: "48%",
          backgroundColor: colors.card,
          borderRadius: 20,
          paddingBottom: 10,
          overflow: "hidden",
        },
        photo: { width: "100%", aspectRatio: 1 },
        recipeName: {
          marginTop: 8,
          marginHorizontal: 10,
          fontFamily: fonts.sansBold,
          color: colors.textPrimary,
          fontSize: scale(16),
        },
        meta: {
          marginTop: 4,
          marginHorizontal: 10,
          fontFamily: fonts.meta,
          color: colors.textSecondary,
          fontSize: scale(12),
        },
      }),
    [colors, fonts, scale]
  );
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
    <View style={styles.screenRoot}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <Text style={styles.subtitle}>{recipes.length} recipes</Text>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <SoftInput style={styles.search} placeholder="Search recipes..." value={search} onChangeText={setSearch} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 6, marginTop: 8, marginLeft: 5, marginRight: 5, alignItems: 'flex-start' }}>
        {collections.map((tag) => (
          <Chip key={tag} label={tag} active={active === tag} onPress={() => setActive(tag)} />
        ))}
      </ScrollView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.grid}>
        {filtered.map((r) => (
          <Pressable key={r.id} style={styles.card} onPress={() => router.push(`/recipe/${r.id}`)}>
            <Image source={{ uri: r.photo_url }} style={styles.photo} />
            <Text style={styles.recipeName}>{r.name}</Text>
            <Text style={styles.meta}>{r.time_minutes} mins · {r.servings} srv</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}
