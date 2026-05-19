import { useAppTheme, usePreferences } from "@/context/PreferencesContext";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PillButton, SoftInput } from "@/components/ui";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, loading: authLoading, isDemoMode, signInOrSignUpWithEmail, enterDemoMode } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors, fonts } = useAppTheme();
  const { scale } = usePreferences();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safe: {
          flex: 1,
          backgroundColor: colors.background,
        },
        kav: { flex: 1 },
        page: {
          flex: 1,
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingBottom: 24,
        },
        hero: { paddingTop: scale(33) },
        brand: {
          textAlign: "center",
          fontFamily: fonts.serif,
          color: colors.textPrimary,
          fontSize: scale(47),
          textTransform: "capitalize",
        },
        body: {
          marginTop: scale(60),
          paddingHorizontal: 24,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          fontSize: scale(18),
          lineHeight: scale(27),
        },
        form: {
          width: "90%",
          alignSelf: "center",
          gap: 11,
          paddingBottom: 8,
        },
        compactInput: { paddingVertical: 12, alignSelf: "stretch" },
        error: {
          color: "red",
          fontFamily: fonts.sans,
          fontSize: scale(13),
          textAlign: "center",
        },
        ctaButton: { marginTop: 24, alignSelf: "center", paddingVertical: 12 },
        demoLink: {
          textAlign: "center",
          marginTop: 16,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          fontSize: scale(14),
        },
      }),
    [colors, fonts, scale]
  );

  useEffect(() => {
    if (authLoading) return;
    if (user && !isDemoMode) {
      router.replace("/(tabs)/home");
    }
  }, [authLoading, user, isDemoMode, router]);

  const handleGetStarted = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signInOrSignUpWithEmail(email.trim(), password.trim());
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    enterDemoMode();
    router.replace("/(tabs)/home");
  };

  return (
    <View style={styles.safe}>
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.page}>
          <View style={styles.hero}>
            <Text style={styles.brand}>Recipes Journal</Text>
            <Text style={styles.body}>
              Hello there,{"\n\n"}Cooking takes effort. You did it great.{"\n\n"}Take a breath, relax, and write down the recipe you just made, so you can recreate the delicious moment anytime.
            </Text>
          </View>

          <View style={styles.form}>
            <SoftInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.compactInput}
            />
            <SoftInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.compactInput}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
            ) : (
              <PillButton label="Get Started" style={styles.ctaButton} onPress={handleGetStarted} />
            )}
            {__DEV__ && !isSupabaseConfigured ? (
              <Text style={styles.demoLink} onPress={handleDemo}>
                Try demo mode →
              </Text>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
}
