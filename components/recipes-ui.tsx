import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

export function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return <Text style={styles.h1}>{children}</Text>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <Text style={styles.h2}>{children}</Text>;
}

export function Body({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <Text style={[styles.body, muted ? { color: Colors.light.muted } : null]}>{children}</Text>;
}

export function PillButton({
  title,
  onPress,
  style,
}: {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pillButton, style, pressed && { opacity: 0.9 }]}>
      <Text style={styles.pillButtonText}>{title}</Text>
    </Pressable>
  );
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6B6B6B"
      autoCapitalize="none"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  h1: {
    fontFamily: Fonts.serif,
    fontSize: 48,
    lineHeight: 56,
    color: Colors.light.text,
  },
  h2: {
    fontFamily: Fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: Colors.light.text,
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.light.text,
  },
  input: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(229, 225, 218, 0.7)',
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: Colors.light.text,
  },
  pillButton: {
    height: 56,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButtonText: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    color: '#000',
  },
});

