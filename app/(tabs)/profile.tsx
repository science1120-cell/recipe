import { SettingPicker } from "@/components/setting-picker";
import { PillButton, SoftInput } from "@/components/ui";
import { useAppTheme, usePreferences } from "@/context/PreferencesContext";
import { useAuth } from "@/lib/auth";
import { FONT_OPTIONS, SIZE_OPTIONS } from "@/lib/preferences";
import {
  formatMemberSince,
  getAvatarEmoji,
  getDisplayName,
  getUserEmail,
} from "@/lib/userDisplay";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isDemoMode, updateDisplayName, signOut } = useAuth();
  const { preferences, setDarkMode, setFontId, setSizeId, scale } = usePreferences();
  const { colors, fonts } = useAppTheme();
  const [nickname, setNickname] = useState("");
  const [savingNickname, setSavingNickname] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = getDisplayName(user);
  const email = getUserEmail(user);
  const memberSince = formatMemberSince(user);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screenRoot: { flex: 1, backgroundColor: colors.background },
        container: { flex: 1 },
        scroll: { paddingBottom: 120 },
        title: {
          fontFamily: fonts.serif,
          fontSize: scale(48),
          color: colors.textPrimary,
          marginTop: 20,
          paddingLeft: 5,
        },
        avatarWrap: {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.card,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 16,
        },
        avatar: { fontSize: scale(54) },
        name: {
          textAlign: "center",
          marginTop: 14,
          color: colors.textPrimary,
          fontFamily: fonts.sansBold,
          fontSize: scale(22),
        },
        email: {
          textAlign: "center",
          marginTop: 6,
          color: colors.textSecondary,
          fontFamily: fonts.sans,
          fontSize: scale(15),
        },
        memberSince: {
          textAlign: "center",
          marginTop: 4,
          color: colors.textSecondary,
          fontFamily: fonts.sans,
          fontSize: scale(13),
        },
        demoBadge: {
          textAlign: "center",
          marginTop: 10,
          marginHorizontal: 24,
          color: colors.textSecondary,
          fontFamily: fonts.sans,
          fontSize: scale(13),
          fontStyle: "italic",
        },
        settings: {
          marginTop: 28,
          color: colors.textSecondary,
          fontFamily: fonts.sansBold,
          fontSize: scale(12),
          letterSpacing: 1.5,
          paddingLeft: 5,
        },
        rowRight: {
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          marginLeft: 12,
        },
        nicknameInput: {
          flexShrink: 1,
          minWidth: 100,
          maxWidth: 160,
          paddingHorizontal: 12,
          paddingVertical: 5,
          backgroundColor: colors.background,
          borderRadius: 12,
          fontSize: scale(16),
          textAlign: "right",
          color: colors.textPrimary,
          fontFamily: fonts.sans,
        },
        saveLink: {
          minHeight: 28,
          justifyContent: "center",
          paddingLeft: 4,
        },
        saveLinkText: {
          fontFamily: fonts.sansBold,
          fontSize: scale(15),
          color: colors.textPrimary,
          textDecorationLine: "underline",
        },
        row: {
          marginTop: 12,
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 14,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        rowLabel: {
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          fontSize: scale(16),
        },
        ctaWrap: {
          marginTop: 32,
          alignSelf: "center",
        },
      }),
    [colors, fonts, scale]
  );

  useEffect(() => {
    setNickname(displayName);
  }, [displayName]);

  async function handleSaveNickname() {
    const trimmed = nickname.trim();
    if (!trimmed) {
      Alert.alert("Nickname", "Please enter a nickname.");
      return;
    }
    if (trimmed === displayName) return;

    try {
      setSavingNickname(true);
      await updateDisplayName(trimmed);
    } catch (e: unknown) {
      Alert.alert(
        "Could not save",
        e instanceof Error ? e.message : "Please try again."
      );
    } finally {
      setSavingNickname(false);
    }
  }

  async function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          try {
            setSigningOut(true);
            await signOut();
            router.replace("/");
          } catch (e: unknown) {
            Alert.alert(
              "Could not sign out",
              e instanceof Error ? e.message : "Please try again."
            );
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  }

  const nicknameDirty = nickname.trim() !== displayName;

  function Row({ label, right }: { label: string; right: React.ReactNode }) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <View style={styles.rowRight}>{right}</View>
      </View>
    );
  }

  return (
    <View style={styles.screenRoot}>
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarWrap}>
          <Text style={styles.avatar}>{getAvatarEmoji(user)}</Text>
        </View>

        <Text style={styles.name}>{displayName}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        {memberSince ? (
          <Text style={styles.memberSince}>Member since {memberSince}</Text>
        ) : null}
        {isDemoMode ? (
          <Text style={styles.demoBadge}>Preview mode — data is not saved</Text>
        ) : null}

        <Text style={styles.settings}>SETTINGS</Text>

        <Row
          label="Nickname"
          right={
            <>
              <SoftInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="Nickname"
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleSaveNickname}
                editable={!savingNickname}
                style={styles.nicknameInput}
              />
              {nicknameDirty ? (
                <Pressable
                  onPress={handleSaveNickname}
                  disabled={savingNickname}
                  style={({ pressed }) => [styles.saveLink, pressed && { opacity: 0.6 }]}
                >
                  {savingNickname ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={styles.saveLinkText}>Save</Text>
                  )}
                </Pressable>
              ) : null}
            </>
          }
        />

        <Row
          label="Dark mode"
          right={
            <Switch
              value={preferences.darkMode}
              onValueChange={setDarkMode}
              thumbColor={colors.primary}
              trackColor={{ false: colors.chip, true: colors.primary }}
            />
          }
        />

        <Row
          label="Font"
          right={
            <SettingPicker
              options={FONT_OPTIONS.map((f) => ({ id: f.id, label: f.label }))}
              value={preferences.fontId}
              onChange={setFontId}
            />
          }
        />

        <Row
          label="Size"
          right={
            <SettingPicker
              options={SIZE_OPTIONS.map((s) => ({ id: s.id, label: s.label }))}
              value={preferences.sizeId}
              onChange={setSizeId}
            />
          }
        />

        <View style={styles.ctaWrap}>
          {signingOut ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <PillButton
              label={isDemoMode ? "Leave preview" : "Sign out"}
              onPress={handleSignOut}
            />
          )}
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}
