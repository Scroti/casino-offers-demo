/**
 * Translation utilities for database content
 * 
 * This module provides functions to translate database content based on the user's selected language.
 * Database content should be stored in a multilingual format like:
 * 
 * {
 *   title: { en: "English Title", es: "Título Español", fr: "Titre Français" }
 * }
 * 
 * Or as a simple string (fallback to English):
 * {
 *   title: "English Title"
 * }
 */

import { supportedLanguages, defaultLanguage } from '@/lib/i18n/i18n';

export type MultilingualString = string | Record<string, string> | undefined;

/**
 * Get translated text from multilingual content
 * @param content - Multilingual content (object with language codes as keys) or simple string
 * @param language - Target language code (default: 'en')
 * @returns Translated text or fallback to English/default
 */
export function translateText(
  content: MultilingualString,
  language: string = defaultLanguage
): string {
  if (!content) return '';
  
  // If it's already a string, return as is (fallback for old data)
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's an object with translations
  if (typeof content === 'object') {
    // Try to get the requested language
    if (content[language]) {
      return content[language];
    }
    
    // Fallback to English
    if (content[defaultLanguage]) {
      return content[defaultLanguage];
    }
    
    // Fallback to first available language
    const firstKey = Object.keys(content)[0];
    if (firstKey && content[firstKey]) {
      return content[firstKey];
    }
  }
  
  return '';
}

/**
 * Translate an object with multilingual fields
 * @param obj - Object with multilingual fields
 * @param fields - List of field names to translate
 * @param language - Target language code
 * @returns Object with translated fields
 */
export function translateObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  language: string = defaultLanguage
): T {
  const translated = { ...obj };
  
  for (const field of fields) {
    if (field in translated && translated[field]) {
      translated[field] = translateText(translated[field] as MultilingualString, language) as T[keyof T];
    }
  }
  
  return translated;
}

/**
 * Translate an array of objects with multilingual fields
 * @param items - Array of objects with multilingual fields
 * @param fields - List of field names to translate
 * @param language - Target language code
 * @returns Array of objects with translated fields
 */
export function translateArray<T extends Record<string, any>>(
  items: T[],
  fields: (keyof T)[],
  language: string = defaultLanguage
): T[] {
  return items.map(item => translateObject(item, fields, language));
}

/**
 * Translate casino content
 */
export function translateCasino(casino: any, language: string = defaultLanguage): any {
  const translated = { ...casino };
  
  // Translate main fields
  if (casino.name) {
    translated.name = translateText(casino.name, language);
  }
  
  // Translate features
  if (casino.features && Array.isArray(casino.features)) {
    translated.features = casino.features.map((feature: any) => ({
      ...feature,
      text: translateText(feature.text, language),
    }));
  }
  
  // Translate advantages
  if (casino.advantages && Array.isArray(casino.advantages)) {
    translated.advantages = casino.advantages.map((advantage: any) => 
      translateText(advantage, language)
    );
  }
  
  return translated;
}

/**
 * Translate bonus content
 */
export function translateBonus(bonus: any, language: string = defaultLanguage): any {
  const translated = { ...bonus };
  
  // Translate main fields
  if (bonus.title) {
    translated.title = translateText(bonus.title, language);
  }
  
  // Translate description
  if (bonus.description) {
    translated.description = {
      title: translateText(bonus.description.title, language),
      subtitle: translateText(bonus.description.subtitle, language),
      content: translateText(bonus.description.content, language),
    };
  }
  
  // Translate bonus instructions
  if (bonus.bonusInstructions) {
    translated.bonusInstructions = translateText(bonus.bonusInstructions, language);
  }
  
  // Translate custom sections
  if (bonus.customSections && Array.isArray(bonus.customSections)) {
    translated.customSections = bonus.customSections.map((section: any) => ({
      ...section,
      title: translateText(section.title, language),
      content: translateText(section.content, language),
      subtitle: translateText(section.subtitle, language),
    }));
  }
  
  // Translate accordion sections
  const accordionFields = ['wageringRequirement', 'bonusValue', 'maxBet', 'expiration', 'claimSpeed', 'termsConditions'];
  for (const field of accordionFields) {
    if (bonus[field]) {
      translated[field] = {
        value: translateText(bonus[field].value, language),
        subtitle: translateText(bonus[field].subtitle, language),
        content: translateText(bonus[field].content, language),
      };
    }
  }
  
  return translated;
}

/**
 * Translate guide content
 */
export function translateGuide(guide: any, language: string = defaultLanguage): any {
  const translated = { ...guide };
  
  if (guide.title) {
    translated.title = translateText(guide.title, language);
  }
  
  if (guide.excerpt) {
    translated.excerpt = translateText(guide.excerpt, language);
  }
  
  if (guide.content) {
    translated.content = translateText(guide.content, language);
  }
  
  return translated;
}

