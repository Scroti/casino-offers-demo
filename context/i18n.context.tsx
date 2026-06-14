'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { getLanguageFromCountry, defaultLanguage, supportedLanguages } from '@/lib/i18n/i18n';

import enMessages from '@/lib/i18n/messages/en.json';
import esMessages from '@/lib/i18n/messages/es.json';
import frMessages from '@/lib/i18n/messages/fr.json';
import deMessages from '@/lib/i18n/messages/de.json';
import roMessages from '@/lib/i18n/messages/ro.json';

const messages: Record<string, Record<string, unknown>> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  ro: roMessages,
};

const LANGUAGE_COOKIE = 'app-language';
const COOKIE_EXPIRES_DAYS = 365;

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  detectLanguageFromCountry: () => Promise<void>;
}

const I18nContext = createContext<I18nContextType | null>(null);

async function fetchCountryLanguage(): Promise<string> {
  const res = await fetch('https://ipinfo.io/json');
  const data = await res.json();
  return data.country ? getLanguageFromCountry(data.country) : defaultLanguage;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(defaultLanguage);
  const [initialized, setInitialized] = useState(false);

  const detectLanguageFromCountry = useCallback(async () => {
    try {
      const lang = await fetchCountryLanguage();
      setLanguageState(lang);
      Cookies.set(LANGUAGE_COOKIE, lang, { expires: COOKIE_EXPIRES_DAYS, path: '/' });
    } catch {
      // silently fall back to default language
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized) return;

    const saved = Cookies.get(LANGUAGE_COOKIE);
    if (saved && supportedLanguages.includes(saved)) {
      setLanguageState(saved);
      setInitialized(true);
      return;
    }

    detectLanguageFromCountry();
  }, [initialized, detectLanguageFromCountry]);

  const setLanguage = useCallback((lang: string) => {
    if (!supportedLanguages.includes(lang)) return;
    setLanguageState(lang);
    Cookies.set(LANGUAGE_COOKIE, lang, { expires: COOKIE_EXPIRES_DAYS, path: '/' });
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');

    const resolve = (dict: Record<string, unknown>): string | undefined => {
      let value: unknown = dict;
      for (const k of keys) {
        if (typeof value !== 'object' || value === null) return undefined;
        value = (value as Record<string, unknown>)[k];
      }
      return typeof value === 'string' ? value : undefined;
    };

    return (
      resolve(messages[language]) ??
      resolve(messages[defaultLanguage]) ??
      key
    );
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, detectLanguageFromCountry }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
