import { AppUser, Recipe } from "@/lib/types";

const now = new Date().toISOString();

export const mockUser: AppUser = {
  id: "user_1",
  name: "Lily",
  country: "Taiwan",
  birth_year: 1990,
  role: "Home cook",
  avatar_emoji: "🐱"
};

export const mockRecipes: Recipe[] = [
  {
    id: "r1",
    user_id: "user_1",
    name: "Corn Lettuce Bowl",
    photo_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700",
    ingredients: [
      { name: "玉米", amount: "1 cup" },
      { name: "生菜", amount: "2 cups" }
    ],
    steps: ["Boil corn for 8 minutes.", "Mix with lettuce and dressing."],
    collection_tag: "Diet",
    mood_emoji: "😊",
    date: "2026-05-06",
    servings: 2,
    time_minutes: 20,
    created_at: now,
    updated_at: now
  },
  {
    id: "r2",
    user_id: "user_1",
    name: "Midnight Fried Rice",
    photo_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=700",
    ingredients: [
      { name: "白飯", amount: "2 bowls" },
      { name: "牛肉", amount: "120g" }
    ],
    steps: ["Pan fry beef until browned.", "Add rice and season, toss for 5 minutes."],
    collection_tag: "Midnight snack",
    mood_emoji: "😤",
    date: "2026-05-05",
    servings: 2,
    time_minutes: 25,
    created_at: now,
    updated_at: now
  },
  {
    id: "r3",
    user_id: "user_1",
    name: "Lunchbox Tomato Beef",
    photo_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700",
    ingredients: [
      { name: "番茄", amount: "2 pcs" },
      { name: "牛肉", amount: "200g" }
    ],
    steps: ["Saute tomato to sauce.", "Simmer with beef for 15 minutes."],
    collection_tag: "Lunchbox",
    mood_emoji: "😢",
    date: "2026-05-01",
    servings: 2,
    time_minutes: 35,
    created_at: now,
    updated_at: now
  }
];
