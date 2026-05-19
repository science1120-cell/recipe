import { Chip, PillButton, SoftInput } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { useAppTheme, usePreferences } from "@/context/PreferencesContext";
import { BlurView } from "expo-blur";
import { CollectionTag, IngredientItem, MoodEmoji } from "@/lib/types";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const moods: MoodEmoji[] = ["😊", "😢", "😤"];
const collections: CollectionTag[] = ["All", "Desserts", "Lunchbox", "Midnight snack", "Diet"];

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipe, addOrUpdateRecipe } = useAppStore();
  const existing = useMemo(() => (id === "new" ? undefined : getRecipe(id)), [id, getRecipe]);
  const [photoUrl, setPhotoUrl] = useState(existing?.photo_url ?? "");
  const [mood, setMood] = useState<MoodEmoji>(existing?.mood_emoji ?? "😊");
  const [name, setName] = useState(existing?.name ?? "");
  const [servings, setServings] = useState(String(existing?.servings ?? 2));
  const [time, setTime] = useState(String(existing?.time_minutes ?? 20));
  const [ingredients, setIngredients] = useState<IngredientItem[]>(existing?.ingredients ?? [{ name: "", amount: "" }]);
  const [steps, setSteps] = useState((existing?.steps ?? [""]).join("\n"));
  const [collection, setCollection] = useState<CollectionTag>(existing?.collection_tag ?? "All");
  const [saved, setSaved] = useState(false);
  const dateMonth = new Date().toLocaleString("en", { month: "short" });
  const dateDay = new Date().getDate();
  const { colors, fonts, isDark } = useAppTheme();
  const { scale } = usePreferences();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screenRoot: { flex: 1, backgroundColor: colors.background },
        container: {
          flex: 1,
          paddingHorizontal: 24,
        },
        upload: {
          height: 190,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: colors.textSecondary,
          borderStyle: "dashed",
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        uploaded: { width: "100%", height: "100%" },
        uploadText: { fontFamily: fonts.sans, color: colors.textSecondary, fontSize: scale(15) },
        row: { marginTop: 12, flexDirection: "row", gap: 10, alignItems: "center", marginLeft: 5 },
        dateCard: {
          width: 80,
          height: 92,
          borderRadius: 16,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
        },
        dateMonth: { fontFamily: fonts.serif, color: colors.textSecondary, fontSize: scale(14) },
        dateDay: {
          fontFamily: fonts.serif,
          fontSize: scale(38),
          color: colors.textPrimary,
          marginTop: -6,
        },
        mood: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.card,
          borderColor: "transparent",
        },
        mt: { marginTop: 12, marginLeft: 5 },
        flex: { flex: 1 },
        collections: { marginTop: 8, flexDirection: "row", gap: 8, flexWrap: "wrap", paddingLeft: 5 },
        section: {
          marginTop: 16,
          fontFamily: fonts.sansBold,
          color: colors.textPrimary,
          fontSize: scale(18),
          marginLeft: 5,
        },
        addRow: {
          marginTop: 8,
          alignSelf: "flex-start",
          backgroundColor: colors.card,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 12,
          marginLeft: 5,
        },
        addText: { fontFamily: fonts.meta, color: colors.textPrimary, fontSize: scale(15) },
        bottom: { marginTop: 25, marginBottom: 32, alignSelf: "center" },
        overlayWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
        overlay: {
          width: "60%",
          aspectRatio: 1,
          borderRadius: 20,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        },
        congrats: {
          textAlign: "center",
          fontFamily: fonts.serif,
          color: colors.textPrimary,
          fontSize: scale(22),
          lineHeight: scale(32),
        },
      }),
    [colors, fonts, scale]
  );

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6
    });
    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.screenRoot}>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Pressable style={styles.upload} onPress={pick}>
          {photoUrl ? <Image source={{ uri: photoUrl }} style={styles.uploaded} /> : <Text style={styles.uploadText}>Upload photo</Text>}
        </Pressable>
        <View style={styles.row}>
          <View style={styles.dateCard}>
            <Text style={styles.dateMonth}>{dateMonth}</Text>
            <Text style={styles.dateDay}>{dateDay}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {moods.map((m) => (
              <Pressable
                key={m}
                onPress={() => setMood(m)}
                style={[styles.mood, mood === m && { borderColor: m === "😊" ? colors.green : colors.pink, borderWidth: 2 }]}
              >
                <Text>{m}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <SoftInput placeholder="Recipe name" value={name} onChangeText={setName} style={styles.mt} />
        <View style={styles.row}>
          <SoftInput placeholder="Servings" value={servings} onChangeText={setServings} keyboardType="numeric" style={styles.flex} />
          <SoftInput placeholder="Time (min)" value={time} onChangeText={setTime} keyboardType="numeric" style={styles.flex} />
        </View>
        <Text style={[styles.section, { paddingLeft: 5 }]}>Ingredients</Text>
        {ingredients.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <SoftInput
              placeholder="Ingredient name"
              value={item.name}
              onChangeText={(text) => setIngredients((prev) => prev.map((x, i) => (i === idx ? { ...x, name: text } : x)))}
              style={styles.flex}
            />
            <SoftInput
              placeholder="Amount"
              value={item.amount}
              onChangeText={(text) => setIngredients((prev) => prev.map((x, i) => (i === idx ? { ...x, amount: text } : x)))}
              style={styles.flex}
            />
          </View>
        ))}
        <Pressable style={styles.addRow} onPress={() => setIngredients((p) => [...p, { name: "", amount: "" }])}>
          <Text style={styles.addText}>+ Add more rows</Text>
        </Pressable>
        <Text style={[styles.section, { paddingLeft: 5 }]}>Collection</Text>
        <View style={styles.collections}>
          {collections.map((item) => <Chip key={item} label={item} active={collection === item} onPress={() => setCollection(item)} />)}
        </View>
        <Text style={[styles.section, { paddingLeft: 5 }]}>Steps</Text>
        <SoftInput placeholder={"One step per line"} value={steps} onChangeText={setSteps} multiline style={{ marginTop: 12, minHeight: 120, textAlignVertical: "top"}} />
        <View style={styles.bottom}>
        <PillButton
          label="Save Recipe"
          fullWidth
          onPress={() => {
            addOrUpdateRecipe({
              id: id === "new" ? undefined : id,
              user_id: existing?.user_id ?? "user_1",
              name: name || "Untitled Recipe",
              photo_url: photoUrl || "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=700",
              ingredients: ingredients.filter((i) => i.name.trim() || i.amount.trim()),
              steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
              collection_tag: collection,
              mood_emoji: mood,
              date: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; })(),
              servings: Number(servings) || 1,
              time_minutes: Number(time) || 10
            });
            setSaved(true);
            setTimeout(() => router.replace("/(tabs)/recipes"), 1000);
          }}
        />
        </View>
      </ScrollView>
      {saved && (
        <View style={styles.overlayWrap}>
          <BlurView intensity={60} tint={isDark ? "dark" : "light"} style={styles.overlay}>
            <Text style={styles.congrats}>CONGRATS 🎉{"\n"}YOUR RECIPE{"\n"}HAS BEEN SAVED.</Text>
          </BlurView>
        </View>
      )}
    </SafeAreaView>
    </View>
  );
}
