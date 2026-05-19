import { useAppTheme } from "@/context/PreferencesContext";
import { useAuth } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  recipes: "list-outline",
  ideas: "search-outline",
  home: "calendar-outline",
  favorites: "heart-outline",
  profile: "person-outline",
};

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const { colors } = useAppTheme();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneContainerStyle: { backgroundColor: colors.background },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 92,
          borderTopWidth: 0,
          backgroundColor: colors.background,
          position: "absolute",
        },
        tabBarIcon: ({ focused }) => {
          const isHome = route.name === "home";
          return (
            <View
              style={{
                width: 66,
                height: 66,
                borderRadius: 33,
                backgroundColor: isHome ? colors.primary : colors.tabBg,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Ionicons
                name={iconMap[route.name] ?? "ellipse-outline"}
                size={24}
                color={isHome ? colors.textPrimary : focused ? colors.primary : colors.tabIcon}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="recipes" />
      <Tabs.Screen name="ideas" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="calendar" options={{ href: null }} />
    </Tabs>
  );
}
