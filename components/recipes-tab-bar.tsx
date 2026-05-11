import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { CalendarStickerIcon, HeartIcon, ListIcon, PersonIcon, SearchIcon } from '@/components/recipes-icons';

const PILL = 66;
const ICON = 24;

function TabPill({
  selected,
  onPress,
  children,
  isCenter,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  isCenter?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        isCenter ? styles.centerPill : styles.normalPill,
        selected && !isCenter ? styles.selectedPill : null,
        pressed ? { opacity: 0.85 } : null,
      ]}>
      {children}
    </Pressable>
  );
}

export function RecipesTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isCenter = route.name === 'calendar';
          const iconColor = Colors.light.icon;

          let icon = <ListIcon color={iconColor} size={ICON} />;
          if (route.name === 'ideas') icon = <SearchIcon color={iconColor} size={ICON} />;
          if (route.name === 'calendar') icon = <CalendarStickerIcon color={iconColor} size={35} />;
          if (route.name === 'favorites') icon = <HeartIcon color={iconColor} size={ICON} />;
          if (route.name === 'profile') icon = <PersonIcon color={iconColor} size={ICON} />;

          return (
            <TabPill key={route.key} selected={isFocused} onPress={onPress} isCenter={isCenter}>
              {icon}
            </TabPill>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    paddingTop: 14,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    width: PILL,
    height: PILL,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalPill: {
    backgroundColor: 'rgba(229, 225, 218, 0.7)',
  },
  centerPill: {
    backgroundColor: Colors.light.accent,
  },
  selectedPill: {
    transform: [{ translateY: -1 }],
  },
});

