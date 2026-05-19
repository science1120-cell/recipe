export type FontOptionId = "albert" | "inter" | "fell";
export type SizeOptionId = "small" | "regular" | "large" | "xlarge";

export type FontOption = {
  id: FontOptionId;
  label: string;
  sans: string;
  sansBold: string;
  serif: string;
  meta: string;
};

export type SizeOption = {
  id: SizeOptionId;
  label: string;
  scale: number;
};

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "albert",
    label: "Albert Sans",
    sans: "AlbertSans_400Regular",
    sansBold: "AlbertSans_600SemiBold",
    serif: "IMFellDWPicaSC_400Regular",
    meta: "Inter_400Regular",
  },
  {
    id: "inter",
    label: "Inter",
    sans: "Inter_400Regular",
    sansBold: "Inter_600SemiBold",
    serif: "IMFellDWPicaSC_400Regular",
    meta: "Inter_400Regular",
  },
  {
    id: "fell",
    label: "IM Fell DW Pica",
    sans: "AlbertSans_400Regular",
    sansBold: "AlbertSans_600SemiBold",
    serif: "IMFellDWPicaSC_400Regular",
    meta: "IMFellDWPicaSC_400Regular",
  },
];

export const SIZE_OPTIONS: SizeOption[] = [
  { id: "small", label: "Small", scale: 0.9 },
  { id: "regular", label: "Regular", scale: 1 },
  { id: "large", label: "Large", scale: 1.12 },
  { id: "xlarge", label: "Extra Large", scale: 1.24 },
];

export type AppPreferences = {
  darkMode: boolean;
  fontId: FontOptionId;
  sizeId: SizeOptionId;
};

export const DEFAULT_PREFERENCES: AppPreferences = {
  darkMode: false,
  fontId: "albert",
  sizeId: "regular",
};

export const PREFERENCES_STORAGE_KEY = "@recipes_journal_preferences";

export const radii = {
  card: 20,
  button: 30,
  input: 12,
  chip: 12,
};

export type AppColors = {
  background: string;
  card: string;
  primary: string;
  tabBg: string;
  tabIcon: string;
  textPrimary: string;
  textSecondary: string;
  chip: string;
  stepMarker: string;
  pink: string;
  green: string;
  white: string;
  heart: string;
  inputFill: string;
  calendarDay: string;
};

export const lightColors: AppColors = {
  background: "#F6F3EE",
  card: "#E5E1DA",
  primary: "#F3BE53",
  tabBg: "#E5E1DA",
  tabIcon: "#6F8FAF",
  textPrimary: "#2C2416",
  textSecondary: "#9E8E7E",
  chip: "#E5E1DA",
  stepMarker: "#E07850",
  pink: "#FF4DB3",
  green: "#54B66B",
  white: "#FFFFFF",
  heart: "#DB4A59",
  inputFill: "#E5E1DA",
  calendarDay: "#CDDBE6",
};

export const darkColors: AppColors = {
  background: "#141210",
  card: "#252119",
  primary: "#F3BE53",
  tabBg: "#2A241C",
  tabIcon: "#8FA8C4",
  textPrimary: "#F4EFE6",
  textSecondary: "#A89B8C",
  chip: "#302A22",
  stepMarker: "#E07850",
  pink: "#FF4DB3",
  green: "#54B66B",
  white: "#FFFFFF",
  heart: "#DB4A59",
  inputFill: "#302A22",
  calendarDay: "#3A4A58",
};

export type AppFonts = {
  sans: string;
  sansBold: string;
  serif: string;
  meta: string;
};

export type AppTheme = {
  colors: AppColors;
  fonts: AppFonts;
  fontScale: number;
  isDark: boolean;
  preferences: AppPreferences;
};

export function buildAppTheme(preferences: AppPreferences): AppTheme {
  const font =
    FONT_OPTIONS.find((f) => f.id === preferences.fontId) ?? FONT_OPTIONS[0];
  const size =
    SIZE_OPTIONS.find((s) => s.id === preferences.sizeId) ?? SIZE_OPTIONS[1];

  return {
    colors: preferences.darkMode ? darkColors : lightColors,
    fonts: {
      sans: font.sans,
      sansBold: font.sansBold,
      serif: font.serif,
      meta: font.meta,
    },
    fontScale: size.scale,
    isDark: preferences.darkMode,
    preferences,
  };
}

export function scaleFont(size: number, scale: number) {
  return Math.round(size * scale);
}
