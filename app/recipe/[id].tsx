import { Chip, PillButton } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe, favorites, toggleFavorite } = useAppStore();
  const recipe = getRecipe(id);
  const isFavorite = recipe ? favorites.includes(recipe.id) : false;

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ fontFamily: "AlbertSans_400Regular", color: colors.textPrimary }}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.top}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>BACK</Text>
          </Pressable>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textPrimary} />
            <Pressable onPress={() => toggleFavorite(recipe.id)}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? colors.heart : colors.textPrimary} />
            </Pressable>
          </View>
        </View>
        <Image source={{ uri: recipe.photo_url }} style={styles.photo} />
        <Text style={styles.title}>{recipe.name}</Text>
        <View style={styles.chips}>
          <Chip label={recipe.time_minutes < 20 ? "Under 20 mins" : `${recipe.time_minutes} mins`} />
          {recipe.ingredients.slice(0, 2).map((i) => <Chip key={i.name} label={i.name} />)}
        </View>
        <Text style={styles.section}>Ingredients</Text>
        <View style={styles.serving}><Text style={styles.servingText}>{recipe.servings} serving</Text><Text style={styles.servingText}>-   +</Text></View>
        {recipe.ingredients.map((i) => (
          <View key={i.name + i.amount} style={styles.ingredientRow}>
            <Text style={styles.ing}>{i.name}</Text>
            <Text style={styles.ing}>{i.amount}</Text>
          </View>
        ))}
        <Text style={styles.section}>Steps</Text>
        {recipe.steps.map((step, idx) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.marker}><Text style={styles.markerText}>{idx + 1}</Text></View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        <Text style={styles.edited}>Edited {new Date(recipe.updated_at).toLocaleDateString("en", { month: "short", day: "numeric" })}</Text>
      </ScrollView>
      <View style={styles.bottom}>
        <PillButton label="Edit" fullWidth onPress={() => router.push(`/recipe/${recipe.id}/edit`)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDE1CC", paddingHorizontal: 24 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  back: { fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary },
  photo: { width: "100%", height: 250, borderRadius: 20, marginTop: 12 },
  title: { marginTop: 12, fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 44, color: colors.textPrimary },
  chips: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 },
  section: { marginTop: 16, fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary, fontSize: 19 },
  serving: { marginTop: 10, flexDirection: "row", justifyContent: "space-between" },
  servingText: { fontFamily: "AlbertSans_400Regular", color: colors.textPrimary },
  ingredientRow: { marginTop: 8, paddingBottom: 8, borderBottomColor: "#d5d0c7", borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between" },
  ing: { fontFamily: "AlbertSans_400Regular", color: colors.textPrimary },
  stepRow: { marginTop: 10, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  marker: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.stepMarker, alignItems: "center", justifyContent: "center", marginTop: 2 },
  markerText: { color: colors.white, fontFamily: "Inter_600SemiBold" },
  stepText: { flex: 1, fontFamily: "AlbertSans_400Regular", color: colors.textPrimary, lineHeight: 22 },
  edited: { marginTop: 12, fontFamily: "Inter_400Regular", color: colors.textSecondary, fontStyle: "italic" },
  bottom: { position: "absolute", left: 24, right: 24, bottom: 18 }
});
