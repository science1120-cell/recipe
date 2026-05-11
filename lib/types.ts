export type MoodEmoji = "😊" | "😢" | "😤";
export type CollectionTag = "All" | "Desserts" | "Lunchbox" | "Midnight snack" | "Diet";

export type IngredientItem = {
  name: string;
  amount: string;
};

export type Recipe = {
  id: string;
  user_id: string;
  name: string;
  photo_url: string;
  ingredients: IngredientItem[];
  steps: string[];
  collection_tag: CollectionTag;
  mood_emoji: MoodEmoji;
  date: string;
  servings: number;
  time_minutes: number;
  created_at: string;
  updated_at: string;
};

export type AppUser = {
  id: string;
  name: string;
  country: string;
  birth_year: number;
  role: string;
  avatar_emoji: string;
};
