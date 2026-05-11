import { colors, radii } from "@/lib/theme";
import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

export function PillButton({
  label,
  onPress,
  fullWidth = false,
  style
}: {
  label: string;
  onPress?: () => void;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, fullWidth && { width: "100%" }, style]}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export function SoftInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput placeholderTextColor={colors.textSecondary} {...props} style={[styles.input, props.style]} />;
}

export function Chip({
  label,
  active = false,
  onPress
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.button,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonLabel: {
    color: colors.textPrimary,
    fontFamily: "IMFellDWPicaSC_400Regular",
    fontWeight: "700",
    fontSize: 24
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.input,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "AlbertSans_400Regular",
    color: colors.textPrimary
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.chip,
    backgroundColor: colors.chip
  },
  chipActive: {
    backgroundColor: colors.primary
  },
  chipText: {
    fontFamily: "AlbertSans_400Regular",
    color: colors.textPrimary
  },
  chipTextActive: {
    fontWeight: "700"
  }
});
