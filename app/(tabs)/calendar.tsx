import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, PillButton, Screen } from '@/components/recipes-ui';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { listRecipes } from '@/lib/recipes';
import type { Recipe } from '@/lib/supabase';

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarTab() {
  const router = useRouter();
  const { user, isDemoMode } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const today = new Date();

  useEffect(() => {
    if (!user || isDemoMode) return;
    listRecipes(user.id).then(setRecipes).catch(() => {});
  }, [user, isDemoMode]);

  const mapByDate = useMemo(() => {
    const m = new Map<string, Recipe[]>();
    recipes.forEach((r) => m.set(r.cooked_on, [...(m.get(r.cooked_on) ?? []), r]));
    return m;
  }, [recipes]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Screen>
      <View style={styles.top}>
        <View style={styles.dateCard}>
          <Text style={styles.dateCardText}>
            {today.getFullYear()}
            {'\n'}
            {today.toLocaleString('en', { month: 'short' })}
            {'\n'}
            {today.getDate()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Hello Lily 👋</Text>
          <Text style={styles.hello}>What do we have today?</Text>
          <PillButton title="Add recipe" onPress={() => router.push('/recipe/new/edit')} style={{ marginTop: 8, height: 42 }} />
        </View>
      </View>

      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Text key={d} style={styles.weekText}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((d) => {
          const date = new Date(today.getFullYear(), today.getMonth(), d);
          const key = ymd(date);
          const records = mapByDate.get(key) ?? [];
          const mood = records[0]?.mood_emoji;
          return (
            <Pressable key={d} style={[styles.cell, d === today.getDate() && styles.cellToday]}>
              <Text style={styles.cellText}>{d}</Text>
              {mood ? <Text>{mood}</Text> : null}
            </Pressable>
          );
        })}
      </View>
      <Body muted>Tap Add recipe to save with date + mood.</Body>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  dateCard: {
    width: 100,
    borderRadius: 12,
    backgroundColor: '#b7c7db',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dateCardText: { fontFamily: Fonts.serif, fontSize: 24, textAlign: 'center' },
  hello: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 28 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 4 },
  weekText: { width: 38, textAlign: 'center', fontFamily: Fonts.serif, fontSize: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  cell: {
    width: '15%',
    aspectRatio: 1,
    backgroundColor: '#d8e0ea',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellToday: { backgroundColor: '#F3BE53' },
  cellText: { fontFamily: Fonts.serif, fontSize: 18 },
});

