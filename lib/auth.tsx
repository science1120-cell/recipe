import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

// A lightweight stand-in used in demo mode (no Supabase).
const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@recipesjournal.app',
  app_metadata: {},
  user_metadata: { full_name: 'Lily' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User;

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isDemoMode: boolean;
  signInOrSignUpWithEmail: (email: string, password: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  enterDemoMode: () => void;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: isDemoMode ? DEMO_USER : (session?.user ?? null),
      loading,
      isDemoMode,
      async signInOrSignUpWithEmail(_email: string, _password: string) {
        if (!isSupabaseConfigured || !supabase) {
          // No Supabase → enter demo mode so user can browse all screens.
          setIsDemoMode(true);
          return;
        }
        const signIn = await supabase.auth.signInWithPassword({ email: _email, password: _password });
        if (!signIn.error) return;

        const localPart = _email.split("@")[0] ?? "Chef";
        const displayName = localPart.charAt(0).toUpperCase() + localPart.slice(1);
        const signUp = await supabase.auth.signUp({
          email: _email,
          password: _password,
          options: { data: { full_name: displayName } },
        });
        if (signUp.error) throw signUp.error;
      },
      async updateDisplayName(name: string) {
        const trimmed = name.trim();
        if (!trimmed) throw new Error("Nickname cannot be empty.");
        if (isDemoMode) {
          throw new Error("Sign in to save your nickname.");
        }
        if (!isSupabaseConfigured || !supabase) {
          throw new Error("Account is not available.");
        }
        const { data, error } = await supabase.auth.updateUser({
          data: { full_name: trimmed },
        });
        if (error) throw error;
        if (data.user) {
          setSession((prev) =>
            prev ? { ...prev, user: data.user! } : null
          );
        }
      },
      enterDemoMode() {
        setIsDemoMode(true);
      },
      async signOut() {
        if (isDemoMode) {
          setIsDemoMode(false);
          return;
        }
        if (!isSupabaseConfigured || !supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [session, loading, isDemoMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

