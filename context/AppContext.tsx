import { mockRecipes, mockUser } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Recipe } from "@/lib/types";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type RecipeInput = Omit<Recipe, "id" | "created_at" | "updated_at"> & { id?: string };

type AppContextType = {
  userEmail: string | null;
  recipes: Recipe[];
  favorites: string[];
  loading: boolean;
  addOrUpdateRecipe: (recipe: RecipeInput) => void;
  toggleFavorite: (recipeId: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: React.PropsWithChildren) {
  const { user, isDemoMode } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setRecipes(mockRecipes);
      setFavorites(["r1", "r2", "r3"]);
      return;
    }

    if (!user || !supabase) {
      console.log("[AppContext] no user or supabase, clearing recipes. user:", user?.id, "supabase:", !!supabase);
      setRecipes([]);
      setFavorites([]);
      return;
    }

    console.log("[AppContext] loading recipes for user:", user.id);
    setLoading(true);
    Promise.all([
      supabase.from("recipes").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
      supabase.from("favorites").select("recipe_id").eq("user_id", user.id),
    ])
      .then(([recipesRes, favsRes]) => {
        console.log("[AppContext] recipes loaded:", recipesRes.data?.length, "error:", recipesRes.error?.message);
        console.log("[AppContext] favs loaded:", favsRes.data?.length, "error:", favsRes.error?.message);
        setRecipes((recipesRes.data ?? []) as Recipe[]);
        setFavorites((favsRes.data ?? []).map((f: { recipe_id: string }) => f.recipe_id));
      })
      .finally(() => setLoading(false));
  }, [user?.id, isDemoMode]);

  const addOrUpdateRecipe = useCallback(
    (recipe: RecipeInput) => {
      const now = new Date().toISOString();

      if (isDemoMode || !supabase || !user) {
        const id = recipe.id ?? `r_${Date.now()}`;
        const next: Recipe = {
          ...recipe,
          id,
          created_at: recipe.id ? recipes.find((r) => r.id === recipe.id)?.created_at ?? now : now,
          updated_at: now,
        };
        setRecipes((prev) => {
          const idx = prev.findIndex((r) => r.id === id);
          if (idx === -1) return [next, ...prev];
          const clone = [...prev];
          clone[idx] = next;
          return clone;
        });
        return;
      }

      const payload = {
        ...recipe,
        user_id: user.id,
        updated_at: now,
      };

      const save = async () => {
        const { data, error } = recipe.id
          ? await supabase.from("recipes").update(payload).eq("id", recipe.id).eq("user_id", user.id).select().single()
          : await supabase.from("recipes").insert({ ...payload, created_at: now }).select().single();

        console.log("[AppContext] save recipe result:", data?.id, "error:", error?.message);
        if (data) {
          setRecipes((prev) => {
            const idx = prev.findIndex((r) => r.id === (data as Recipe).id);
            if (idx === -1) return [data as Recipe, ...prev];
            const clone = [...prev];
            clone[idx] = data as Recipe;
            return clone;
          });
        }
      };

      void save();
    },
    [user, isDemoMode, recipes]
  );

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      setFavorites((prev) => {
        const isFav = prev.includes(recipeId);
        if (!isDemoMode && supabase && user) {
          if (isFav) {
            void supabase.from("favorites").delete().eq("user_id", user.id).eq("recipe_id", recipeId);
          } else {
            void supabase.from("favorites").upsert({ user_id: user.id, recipe_id: recipeId });
          }
        }
        return isFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId];
      });
    },
    [user, isDemoMode]
  );

  const getRecipe = useCallback((id: string) => recipes.find((r) => r.id === id), [recipes]);

  const value = useMemo(
    () => ({
      userEmail: user?.email ?? null,
      recipes,
      favorites,
      loading,
      addOrUpdateRecipe,
      toggleFavorite,
      getRecipe,
    }),
    [user, recipes, favorites, loading, addOrUpdateRecipe, toggleFavorite, getRecipe]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppProvider");
  }
  return context;
}

