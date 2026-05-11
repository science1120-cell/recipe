import { Chip, PillButton, SoftInput } from "@/components/ui";
import { useAppStore } from "@/context/AppContext";
import { CollectionTag, IngredientItem, MoodEmoji } from "@/lib/types";
import { colors } from "@/lib/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
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
  const dateLabel = new Date().toLocaleDateString("en", { month: "short", day: "numeric" });

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Pressable style={styles.upload} onPress={pick}>
          {photoUrl ? <Image source={{ uri: photoUrl }} style={styles.uploaded} /> : <Text style={styles.uploadText}>Upload photo</Text>}
        </Pressable>
        <View style={styles.row}>
          <View style={styles.date}><Text style={styles.dateText}>📅 {dateLabel}</Text></View>
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
        <Text style={styles.section}>Ingredients</Text>
        {ingredients.map((item, idx) => (
          <View key={`${idx}_${item.name}`} style={styles.row}>
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
        <Text style={styles.section}>Collection</Text>
        <View style={styles.collections}>
          {collections.map((item) => <Chip key={item} label={item} active={collection === item} onPress={() => setCollection(item)} />)}
        </View>
        <Text style={styles.section}>Steps</Text>
        <SoftInput placeholder={"One step per line"} value={steps} onChangeText={setSteps} multiline style={{ minHeight: 120, textAlignVertical: "top" }} />
      </ScrollView>
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
              date: new Date().toISOString().slice(0, 10),
              servings: Number(servings) || 1,
              time_minutes: Number(time) || 10
            });
            setSaved(true);
            setTimeout(() => router.replace("/(tabs)/recipes"), 1000);
          }}
        />
      </View>
      {saved && (
        <View style={styles.overlay}>
          <Text style={styles.congrats}>CONGRATS 🎉{"\n"}YOUR RECIPE HAS BEEN SAVED.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EDE1CC", paddingHorizontal: 24 },
  upload: { height: 190, borderRadius: 20, borderWidth: 1.5, borderColor: "#c8bfb3", borderStyle: "dashed", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  uploadText: { fontFamily: "AlbertSans_400Regular", color: colors.textSecondary },
  uploaded: { width: "100%", height: "100%" },
  row: { marginTop: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  date: { backgroundColor: colors.card, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
  dateText: { fontFamily: "Inter_400Regular", color: colors.textPrimary },
  mood: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.card, borderColor: "transparent" },
  mt: { marginTop: 12 },
  flex: { flex: 1 },
  section: { marginTop: 16, fontFamily: "AlbertSans_600SemiBold", color: colors.textPrimary, fontSize: 18 },
  addRow: { marginTop: 8, alignSelf: "flex-start", backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
  addText: { fontFamily: "Inter_400Regular", color: colors.textPrimary },
  collections: { marginTop: 8, flexDirection: "row", gap: 8, flexWrap: "wrap" },
  bottom: { position: "absolute", left: 24, right: 24, bottom: 18 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(246,243,238,0.95)", alignItems: "center", justifyContent: "center" },
  congrats: { textAlign: "center", fontFamily: "IMFellDWPicaSC_400Regular", color: colors.textPrimary, fontSize: 38 }
});
