import { ensureSupabase, type Recipe } from '@/lib/supabase';

export const COLLECTIONS = ['All', 'Desserts', 'Lunchbox', 'Midnight snack', 'Diet'] as const;
export const MOODS = ['😊', '😢', '😤'] as const;

export type RecipeInput = {
  name: string;
  photo_url?: string | null;
  ingredients: string[];
  steps: string[];
  collection_tag: string;
  mood_emoji?: string | null;
  cooked_on: string;
  servings: number;
  time_min: number;
};

export async function listRecipes(userId: string) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Recipe[];
}

export async function getRecipeById(id: string, userId: string) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as Recipe;
}

export async function createRecipe(userId: string, input: RecipeInput) {
  const supabase = ensureSupabase();
  const payload = {
    user_id: userId,
    ...input,
  };

  const { data, error } = await supabase.from('recipes').insert(payload).select().single();
  if (error) throw error;
  return data as Recipe;
}

export async function updateRecipe(id: string, userId: string, input: RecipeInput) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from('recipes')
    .update(input)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data as Recipe;
}

export async function listFavoriteIds(userId: string) {
  const supabase = ensureSupabase();
  const { data, error } = await supabase.from('favorites').select('recipe_id').eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.recipe_id as string));
}

export async function setFavorite(userId: string, recipeId: string, favored: boolean) {
  const supabase = ensureSupabase();
  if (favored) {
    const { error } = await supabase.from('favorites').upsert(
      {
        user_id: userId,
        recipe_id: recipeId,
      },
      { onConflict: 'user_id,recipe_id' }
    );
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('recipe_id', recipeId);
  if (error) throw error;
}

