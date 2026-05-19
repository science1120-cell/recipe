import { useAppTheme } from "@/context/PreferencesContext";
import { radii, scaleFont } from "@/lib/preferences";
import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, TextInput, ViewStyle } from "react-native";

export function PillButton({
  label,
  onPress,
  fullWidth = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, fonts, fontScale } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: colors.primary,
          borderRadius: radii.button,
          paddingVertical: 14,
          paddingHorizontal: 22,
          alignItems: "center",
          justifyContent: "center",
        },
        fullWidth && { width: "100%" },
        style,
      ]}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontFamily: fonts.serif,
          fontWeight: "700",
          fontSize: scaleFont(24, fontScale),
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SoftInput(props: React.ComponentProps<typeof TextInput>) {
  const { colors, fonts, fontScale } = useAppTheme();
  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      {...props}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radii.input,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontFamily: fonts.sans,
          fontSize: scaleFont(16, fontScale),
          color: colors.textPrimary,
        },
        props.style,
      ]}
    />
  );
}

export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const { colors, fonts, fontScale } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: radii.chip,
        backgroundColor: active ? colors.primary : colors.chip,
      }}
    >
      <Text
        style={{
          fontFamily: active ? fonts.sansBold : fonts.sans,
          fontSize: scaleFont(15, fontScale),
          color: colors.textPrimary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
