import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import type { Recipe } from '@/lib/supabase';

export function RecipeCard({
  recipe,
  favorite,
  onPress,
}: {
  recipe: Recipe;
  favorite?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Text style={styles.emoji}>{recipe.photo_url ?? '🍽️'}</Text>
        {favorite ? <Text style={styles.heart}>❤️</Text> : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {recipe.name}
      </Text>
      <Text style={styles.meta}>
        {recipe.time_min} mins · {recipe.servings} srv
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'rgba(229,225,218,0.7)',
    borderRadius: 14,
    paddingBottom: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 86,
    backgroundColor: '#d9d4cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 42 },
  heart: { position: 'absolute', right: 8, top: 6, fontSize: 16 },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    color: '#1D1B20',
    marginTop: 8,
    marginHorizontal: 8,
  },
  meta: {
    fontFamily: Fonts.sans,
    color: '#6B6B6B',
    marginHorizontal: 8,
    marginTop: 2,
    fontSize: 13,
  },
});

