import { Colors } from "@/constants/theme";
import { colors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  recipes: "list-outline",
  ideas: "search-outline",
  home: "calendar-outline",
  favorites: "heart-outline",
  profile: "person-outline"
};

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 92,
          borderTopWidth: 0,
          backgroundColor: Colors.light.background,
          position: "absolute"
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
                marginTop: 8
              }}
            >
              <Ionicons
                name={iconMap[route.name] ?? "ellipse-outline"}
                size={24}
                color={isHome ? colors.textPrimary : focused ? colors.primary : colors.tabIcon}
              />
            </View>
          );
        }
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
