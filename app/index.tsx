import { useAppStore } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import { PillButton, SoftInput } from "@/components/ui";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUserEmail } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.brand}>Recipes Journal</Text>
        <Text style={styles.body}>
          Hello there,{"\n\n"}Cooking takes effort. You did it great.{"\n\n"}Take a breath, relax, and write down the recipe{"\n"}
          you just made - so you can recreate the delicious moment anytime.
        </Text>
      </View>
      <View style={styles.form}>
        <SoftInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.compactInput} />
        <SoftInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.compactInput} />
        <PillButton
          label="Get Started"
          style={styles.ctaButton}
          onPress={() => {
            setUserEmail(email.trim());
            router.replace("/(tabs)/home");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE1CC",
    paddingHorizontal: 24,
    paddingTop: 48
  },
  brand: {
    textAlign: "center",
    marginTop: 60,
    fontFamily: "IMFellDWPicaSC_400Regular",
    color: colors.textPrimary,
    fontSize: 47,
    textTransform: "capitalize"
  },
  body: {
    marginTop: 60,
    paddingHorizontal: 24,
    fontFamily: "AlbertSans_400Regular",
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 27
  },
  form: {
    marginTop: "80",
    marginBottom: 2,
    width: "90%",
    alignSelf:"center",
    gap: 11
  },
  compactInput: {
    paddingVertical: 12
  },
  ctaButton: {
    marginTop: 70,
    width: "85%",
    alignSelf: "center",
    paddingVertical: 12
  }
});
