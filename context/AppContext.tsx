import { mockRecipes, mockUser } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { Recipe } from "@/lib/types";
import React, { createContext, useContext, useMemo, useState } from "react";

type RecipeInput = Omit<Recipe, "id" | "created_at" | "updated_at"> & { id?: string };

type AppContextType = {
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  recipes: Recipe[];
  favorites: string[];
  addOrUpdateRecipe: (recipe: RecipeInput) => void;
  toggleFavorite: (recipeId: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [favorites, setFavorites] = useState<string[]>(["r1", "r2", "r3"]);

  const addOrUpdateRecipe = (recipe: RecipeInput) => {
    const now = new Date().toISOString();
    const id = recipe.id ?? `r_${Date.now()}`;
    const next: Recipe = {
      ...recipe,
      id,
      created_at: recipe.id ? recipes.find((r) => r.id === recipe.id)?.created_at ?? now : now,
      updated_at: now
    };
    setRecipes((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === id);
      if (existingIndex === -1) {
        return [next, ...prev];
      }
      const clone = [...prev];
      clone[existingIndex] = next;
      return clone;
    });

    if (supabase) {
      void supabase.from("recipes").upsert(next);
    }
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId);
      }
      return [...prev, recipeId];
    });
  };

  const getRecipe = (id: string) => recipes.find((r) => r.id === id);

  const value = useMemo(
    () => ({
      userEmail,
      setUserEmail,
      recipes,
      favorites,
      addOrUpdateRecipe,
      toggleFavorite,
      getRecipe
    }),
    [userEmail, recipes, favorites]
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

export { mockUser };
