import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";
import { PillButton, SoftInput } from "@/components/ui";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const { signInOrSignUpWithEmail, enterDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.brand}>Recipes Journal</Text>
            <Text style={styles.body}>
              Hello there,{"\n\n"}Cooking takes effort. You did it great.{"\n\n"}Take a breath, relax, and write down the recipe{"\n"}
              you just made - so you can recreate the delicious moment anytime.
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
            <Text style={styles.demoLink} onPress={handleDemo}>
              Try demo mode →
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F3EE",
    marginLeft: 5,
    marginRight: 5,
  },
  kav: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  hero: {},
  brand: {
    textAlign: "center",
    marginTop: 60,
    fontFamily: "IMFellDWPicaSC_400Regular",
    color: colors.textPrimary,
    fontSize: 47,
    textTransform: "capitalize",
  },
  body: {
    marginTop: 60,
    paddingHorizontal: 24,
    fontFamily: "AlbertSans_400Regular",
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 27,
  },
  form: {
    marginTop: 48,
    width: "90%",
    alignSelf: "center",
    gap: 11,
  },
  compactInput: {
    paddingVertical: 12,
  },
  error: {
    color: "red",
    fontFamily: "AlbertSans_400Regular",
    fontSize: 13,
    textAlign: "center",
  },
  ctaButton: {
    marginTop: 24,
    width: "85%",
    alignSelf: "center",
    paddingVertical: 12,
  },
  demoLink: {
    textAlign: "center",
    marginTop: 16,
    fontFamily: "AlbertSans_400Regular",
    color: colors.textSecondary,
    fontSize: 14,
  },
});
