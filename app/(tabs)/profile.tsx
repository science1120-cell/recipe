import { mockUser } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";

function Row({
  label,
  right
}: {
  label: string;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {right}
    </View>
  );
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [icloud, setIcloud] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.avatarWrap}>
        <Text style={styles.avatar}>{mockUser.avatar_emoji}</Text>
      </View>
      <Text style={styles.info}>
        {mockUser.name} · {mockUser.country} · {mockUser.birth_year} · {mockUser.role}
      </Text>
      <Text style={styles.settings}>SETTINGS</Text>
      <Row label="Dark mode" right={<Switch value={darkMode} onValueChange={setDarkMode} thumbColor={colors.primary} />} />
      <Row
        label="Font"
        right={
          <Pressable style={styles.dropdown}>
            <Text style={styles.dropdownText}>Albert Sans</Text>
          </Pressable>
        }
      />
      <Row
        label="Size"
        right={
          <Pressable style={styles.dropdown}>
            <Text style={styles.dropdownText}>Regular</Text>
          </Pressable>
        }
      />
      <Row label="iCloud sync" right={<Switch value={icloud} onValueChange={setIcloud} thumbColor={colors.primary} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F3EE", marginRight: 5, marginLeft: 5},
  title: { fontFamily: "IMFellDWPicaSC_400Regular", fontSize: 48, color: colors.textPrimary, marginTop: 20, paddingLeft: 5},
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16, marginLeft: 5, marginRight: 5
  },
  avatar: { fontSize: 54 },
  info: { textAlign: "center", marginTop: 14, color: colors.textSecondary, fontFamily: "AlbertSans_400Regular", fontSize: 16 },
  settings: { marginTop: 30, color: colors.textSecondary, fontFamily: "AlbertSans_600SemiBold", fontSize: 12, letterSpacing: 1.5, paddingLeft: 5 },
  row: { marginTop: 12, backgroundColor: colors.card, borderRadius: 16, padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  rowLabel: { fontFamily: "AlbertSans_400Regular", color: colors.textPrimary, fontSize: 16 },
  dropdown: { paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.background, borderRadius: 12 },
  dropdownText: { fontFamily: "Inter_400Regular", color: colors.textPrimary }
});
