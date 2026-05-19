import { useAppTheme } from "@/context/PreferencesContext";
import React from "react";
import { ActionSheetIOS, Alert, Platform, Pressable, StyleSheet, Text } from "react-native";

type Option<T extends string> = {
  id: T;
  label: string;
};

type SettingPickerProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SettingPicker<T extends string>({
  options,
  value,
  onChange,
}: SettingPickerProps<T>) {
  const { colors, fonts } = useAppTheme();
  const current = options.find((o) => o.id === value)?.label ?? value;

  function openPicker() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options.map((o) => o.label), "Cancel"],
          cancelButtonIndex: options.length,
          title: "Choose an option",
        },
        (index) => {
          if (index === undefined || index >= options.length) return;
          onChange(options[index].id);
        }
      );
      return;
    }

    Alert.alert(
      "Choose an option",
      undefined,
      [
        ...options.map((o) => ({
          text: o.label,
          onPress: () => onChange(o.id),
        })),
        { text: "Cancel", style: "cancel" as const },
      ],
      { cancelable: true }
    );
  }

  return (
    <Pressable
      onPress={openPicker}
      style={[styles.dropdown, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.dropdownText, { color: colors.textPrimary, fontFamily: fonts.meta }]}>
        {current}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    maxWidth: 160,
  },
  dropdownText: {
    fontSize: 15,
    textAlign: "right",
  },
});
