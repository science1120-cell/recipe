import { SoftInput } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const router = useRouter();
  const { recipes, favorites } = useAppStore();
  const [search, setSearch] = useState("");
  const list = useMemo(
    () =>
      recipes.filter((r) => favorites.includes(r.id) && r.name.toLowerCase().includes(search.toLowerCase().trim())),
    [recipes, favorites, search]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <Text style={styles.subtitle}>{list.length} saved</Text>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <SoftInput style={styles.search} placeholder="Search favorites..." value={search} onChangeText={setSearch} />
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {list.map((r) => (
          <Pressable key={r.id} style={styles.card} onPress={() => router.push(`/recipe/${r.id}`)}>
            <View>
              <Image source={{ uri: r.photo_url }} style={styles.photo} />
              <Ionicons style={styles.heart} name="heart" size={20} color={colors.heart} />
            </View>
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
  heart: { position: "absolute", top: 8, right: 8 },
  recipeName: { marginTop: 8, marginHorizontal: 10, fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary },
  meta: { marginTop: 4, marginHorizontal: 10, fontFamily: "Inter_400Regular", color: colors.textSecondary, fontSize: 12 }
});
