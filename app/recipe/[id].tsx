import { Chip, PillButton } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { useAppTheme, usePreferences } from "@/context/PreferencesContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe, favorites, toggleFavorite } = useAppStore();
  const { colors, fonts } = useAppTheme();
  const { scale } = usePreferences();
  const recipe = getRecipe(id);
  const isFavorite = recipe ? favorites.includes(recipe.id) : false;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screenRoot: { flex: 1, backgroundColor: colors.background },
        container: { flex: 1 },
        top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        back: { fontFamily: fonts.sansBold, color: colors.textPrimary, fontSize: scale(14) },
        photo: { width: "100%", height: 250, borderRadius: 20, marginTop: 12 },
        title: {
          marginTop: 12,
          fontFamily: fonts.serif,
          fontSize: scale(44),
          color: colors.textPrimary,
        },
        chips: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 },
        section: {
          marginTop: 16,
          fontFamily: fonts.sansBold,
          color: colors.textPrimary,
          fontSize: scale(19),
        },
        serving: { marginTop: 10, flexDirection: "row", justifyContent: "space-between" },
        servingText: { fontFamily: fonts.sans, color: colors.textPrimary, fontSize: scale(16) },
        ingredientRow: {
          marginTop: 8,
          paddingBottom: 8,
          borderBottomColor: colors.chip,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        ing: { fontFamily: fonts.sans, color: colors.textPrimary, fontSize: scale(16) },
        stepRow: { marginTop: 10, flexDirection: "row", gap: 10, alignItems: "flex-start" },
        marker: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.stepMarker,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        },
        markerText: { color: colors.white, fontFamily: fonts.sansBold, fontSize: scale(12) },
        stepText: {
          flex: 1,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          lineHeight: scale(22),
          fontSize: scale(16),
        },
        edited: {
          marginTop: 12,
          fontFamily: fonts.meta,
          color: colors.textSecondary,
          fontStyle: "italic",
          fontSize: scale(14),
        },
        bottom: { marginTop: 25, marginBottom: 32, alignSelf: "center" },
      }),
    [colors, fonts, scale]
  );

  if (!recipe) {
    return (
      <View style={styles.screenRoot}>
        <SafeAreaView style={styles.container}>
          <Text style={{ fontFamily: fonts.sans, color: colors.textPrimary }}>Recipe not found.</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screenRoot}>
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
        <View style={styles.bottom}>
          <PillButton label="Edit" fullWidth onPress={() => router.push(`/recipe/${recipe.id}/edit`)} />
        </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}
