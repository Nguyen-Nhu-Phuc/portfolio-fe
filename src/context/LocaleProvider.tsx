"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { Locale } from "@/types/localized";

const STORAGE_KEY = "portfolio-locale";
const COOKIE_KEY = "portfolio-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const localeListeners = new Set<() => void>();

function subscribeLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => localeListeners.delete(listener);
}

function notifyLocaleChange() {
  localeListeners.forEach((listener) => listener());
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "vi" ? "vi" : "en";
}

function persistLocale(locale: Locale) {
  localStorage.setItem(STORAGE_KEY, locale);
  document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
  document.documentElement.lang = locale;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    subscribeLocale,
    readStoredLocale,
    () => "en"
  );

  useEffect(() => {
    persistLocale(readStoredLocale());
  }, []);

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
    notifyLocaleChange();
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
