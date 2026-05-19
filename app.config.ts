import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Recipes Journal",
  slug: "recipes-journal",
  scheme: "recipesjournal",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "./assets/images/icon.png",
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#F6F3EE",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.recipesjournal.app",
  },
  android: {
    package: "com.recipesjournal.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
  },
  plugins: ["expo-router", "expo-image-picker"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
  },
};

export default config;
