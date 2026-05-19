import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AppPreferences,
  AppTheme,
  DEFAULT_PREFERENCES,
  FontOptionId,
  PREFERENCES_STORAGE_KEY,
  SizeOptionId,
  buildAppTheme,
  scaleFont,
} from "@/lib/preferences";

type PreferencesContextValue = {
  preferences: AppPreferences;
  theme: AppTheme;
  ready: boolean;
  setDarkMode: (value: boolean) => void;
  setFontId: (id: FontOptionId) => void;
  setSizeId: (id: SizeOptionId) => void;
  scale: (size: number) => number;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(PREFERENCES_STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw) as Partial<AppPreferences>;
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback((next: AppPreferences) => {
    setPreferences(next);
    void AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const theme = useMemo(() => buildAppTheme(preferences), [preferences]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      theme,
      ready,
      setDarkMode: (darkMode) => persist({ ...preferences, darkMode }),
      setFontId: (fontId) => persist({ ...preferences, fontId }),
      setSizeId: (sizeId) => persist({ ...preferences, sizeId }),
      scale: (size) => scaleFont(size, theme.fontScale),
    }),
    [preferences, theme, ready, persist]
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

export function useAppTheme() {
  return usePreferences().theme;
}
