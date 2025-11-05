'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { getLanguageFromCountry, defaultLanguage, supportedLanguages } from '@/lib/i18n/i18n';

// Import translation messages
import enMessages from '@/lib/i18n/messages/en.json';
import esMessages from '@/lib/i18n/messages/es.json';
import frMessages from '@/lib/i18n/messages/fr.json';
import deMessages from '@/lib/i18n/messages/de.json';
import roMessages from '@/lib/i18n/messages/ro.json';

const messages: Record<string, any> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  ro: roMessages,
};

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  detectLanguageFromCountry: () => Promise<void>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(defaultLanguage);
  const [initialized, setInitialized] = useState(false);
  
  // Force re-render when language changes
  const [, forceUpdate] = useState(0);

  // Load language from cookie or detect from country
  useEffect(() => {
    if (initialized) return;

    // Check if language is stored in cookie
    const savedLanguage = Cookies.get('app-language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      console.log(`🍪 Found saved language in cookie: ${savedLanguage}`);
      setLanguageState(savedLanguage);
      setInitialized(true);
      
      // Still fetch and log location data even if language is saved
      detectLanguageFromCountry();
      return;
    }

    // Detect language from country
    console.log('🔍 No saved language found, detecting from country...');
    detectLanguageFromCountry();
  }, [initialized]);

  const detectLanguageFromCountry = async () => {
    try {
      console.log('🌍 Fetching location data from ipinfo.io...');
      const res = await fetch('https://ipinfo.io/json');
      const locationData = await res.json();
      
      console.log('📍 Full location data:', locationData);
      
      if (locationData.country) {
        const detectedLang = getLanguageFromCountry(locationData.country);
        setLanguageState(detectedLang);
        Cookies.set('app-language', detectedLang, { expires: 365, path: '/' });
        console.log(`🌍 Detected country: ${locationData.country}, Set language: ${detectedLang}`);
        
        if (locationData.city) {
          console.log(`🏙️  City: ${locationData.city}`);
        }
        if (locationData.region) {
          console.log(`🗺️  Region: ${locationData.region}`);
        }
        if (locationData.timezone) {
          console.log(`🕐 Timezone: ${locationData.timezone}`);
        }
      } else {
        console.warn('⚠️  No country found in location data');
      }
    } catch (error) {
      console.error('❌ Failed to detect language from country:', error);
    } finally {
      setInitialized(true);
    }
  };

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      console.log(`🌐 Changing language from ${language} to ${lang}`);
      setLanguageState(lang);
      Cookies.set('app-language', lang, { expires: 365, path: '/' });
      forceUpdate(prev => prev + 1); // Force re-render
    }
  };

  // Translation function
  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      
      // Try to get translation from current language
      let value = messages[language];
      if (value) {
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }
        
        // If found in current language, return it
        if (value !== undefined && typeof value === 'string') {
          return value;
        }
      }
      
      // Fallback to English
      value = messages[defaultLanguage];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key not found: ${key}`);
          return key; // Return the key itself if not found
        }
      }
      
      return value || key;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, detectLanguageFromCountry }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

