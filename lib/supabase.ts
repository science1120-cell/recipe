import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);
export const isSupabaseConfigured = hasSupabase;

export const supabase = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: AsyncStorage,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export function ensureSupabase() {
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export type { Recipe } from "@/lib/types";
