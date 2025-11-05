/**
 * Frontend translation API utilities
 * 
 * This module provides functions to translate content on-the-fly using a translation API
 * instead of storing translations in the database.
 * 
 * Supports multiple translation providers:
 * - Google Translate API
 * - DeepL API
 * - LibreTranslate (open source)
 * - Azure Translator
 */

import { defaultLanguage } from '@/lib/i18n/i18n';

export type TranslationProvider = 'google' | 'deepl' | 'libretranslate' | 'azure';

interface TranslationCache {
  [key: string]: string;
}

// Cache for translations (in-memory + localStorage)
const translationCache: TranslationCache = {};
const CACHE_KEY = 'translation-cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Load cache from localStorage
function loadCache(): void {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = Date.now();
      // Only keep non-expired entries
      Object.keys(parsed).forEach(key => {
        const entry = parsed[key];
        if (entry.timestamp && (now - entry.timestamp) < CACHE_EXPIRY) {
          translationCache[key] = entry.text;
        }
      });
    }
  } catch (error) {
    console.warn('Failed to load translation cache:', error);
  }
}

// Save cache to localStorage
function saveCache(): void {
  try {
    const cache: Record<string, { text: string; timestamp: number }> = {};
    Object.keys(translationCache).forEach(key => {
      cache[key] = {
        text: translationCache[key],
        timestamp: Date.now(),
      };
    });
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save translation cache:', error);
  }
}

// Generate cache key
function getCacheKey(text: string, targetLang: string, sourceLang: string = 'en'): string {
  return `${sourceLang}:${targetLang}:${text}`;
}

// Initialize cache on module load
if (typeof window !== 'undefined') {
  loadCache();
}

/**
 * Translate text using Google Translate API (via your backend)
 */
async function translateWithGoogle(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  const cacheKey = getCacheKey(text, targetLang, sourceLang);
  
  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang,
        provider: 'google',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    const translated = data.translatedText || text;
    
    // Cache the translation
    translationCache[cacheKey] = translated;
    saveCache();
    
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate text using DeepL API (via your backend)
 */
async function translateWithDeepL(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  const cacheKey = getCacheKey(text, targetLang, sourceLang);
  
  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang,
        provider: 'deepl',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    const translated = data.translatedText || text;
    
    // Cache the translation
    translationCache[cacheKey] = translated;
    saveCache();
    
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

/**
 * Translate text using LibreTranslate (open source, free)
 */
async function translateWithLibreTranslate(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<string> {
  const cacheKey = getCacheKey(text, targetLang, sourceLang);
  
  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  try {
    // LibreTranslate public API (rate limited)
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    const translated = data.translatedText || text;
    
    // Cache the translation
    translationCache[cacheKey] = translated;
    saveCache();
    
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

/**
 * Main translation function
 * @param text - Text to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (default: 'en')
 * @param provider - Translation provider (default: 'libretranslate')
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'en',
  provider: TranslationProvider = 'libretranslate'
): Promise<string> {
  // Don't translate if same language
  if (targetLang === sourceLang || targetLang === defaultLanguage) {
    return text;
  }
  
  // Don't translate empty strings
  if (!text || text.trim() === '') {
    return text;
  }
  
  // Check cache first
  const cacheKey = getCacheKey(text, targetLang, sourceLang);
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  // Translate based on provider
  switch (provider) {
    case 'google':
      return translateWithGoogle(text, targetLang, sourceLang);
    case 'deepl':
      return translateWithDeepL(text, targetLang, sourceLang);
    case 'libretranslate':
      return translateWithLibreTranslate(text, targetLang, sourceLang);
    default:
      return text;
  }
}

/**
 * Translate multiple texts in parallel
 */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'en',
  provider: TranslationProvider = 'libretranslate'
): Promise<string[]> {
  const translations = await Promise.all(
    texts.map(text => translateText(text, targetLang, sourceLang, provider))
  );
  return translations;
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  Object.keys(translationCache).forEach(key => {
    delete translationCache[key];
  });
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Get cache size (for debugging)
 */
export function getCacheSize(): number {
  return Object.keys(translationCache).length;
}

