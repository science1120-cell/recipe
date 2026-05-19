import { AppProvider } from "@/context/AppContext";
import { PreferencesProvider, useAppTheme } from "@/context/PreferencesContext";
import { AuthProvider } from "@/lib/auth";
import { lightColors } from "@/lib/preferences";
import {
  AlbertSans_400Regular,
  AlbertSans_600SemiBold,
  useFonts as useAlbertFonts,
} from "@expo-google-fonts/albert-sans";
import {
  IMFellDWPicaSC_400Regular,
  useFonts as useFellFonts,
} from "@expo-google-fonts/im-fell-dw-pica-sc";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";

function RootStack() {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="recipe/[id]/edit" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [loadedAlbert] = useAlbertFonts({ AlbertSans_400Regular, AlbertSans_600SemiBold });
  const [loadedFell] = useFellFonts({ IMFellDWPicaSC_400Regular });
  const [loadedInter] = useInterFonts({ Inter_400Regular, Inter_600SemiBold });
  const loaded = loadedAlbert && loadedFell && loadedInter;

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: lightColors.background,
        }}
      >
        <ActivityIndicator color={lightColors.textPrimary} />
      </View>
    );
  }

  return (
    <PreferencesProvider>
      <AuthProvider>
        <AppProvider>
          <RootStack />
        </AppProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}
