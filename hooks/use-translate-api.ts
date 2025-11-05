/**
 * React hook for translating content on-the-fly using translation APIs
 * 
 * This hook provides easy access to translation functions that translate
 * content dynamically instead of storing translations in the database.
 */

import { useState, useCallback, useMemo } from 'react';
import { useI18n } from '@/context/i18n.context';
import { translateText, translateBatch, type TranslationProvider } from '@/lib/utils/translate-api';

export function useTranslateApi(provider: TranslationProvider = 'libretranslate') {
  const { language } = useI18n();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);

  /**
   * Translate a single text
   */
  const t = useCallback(
    async (text: string, sourceLang: string = 'en'): Promise<string> => {
      if (!text || language === sourceLang) {
        return text;
      }

      setIsTranslating(true);
      setTranslationErrors([]);

      try {
        const translated = await translateText(text, language, sourceLang, provider);
        return translated;
      } catch (error) {
        console.error('Translation error:', error);
        setTranslationErrors(prev => [...prev, text]);
        return text; // Return original on error
      } finally {
        setIsTranslating(false);
      }
    },
    [language, provider]
  );

  /**
   * Translate multiple texts in parallel
   */
  const translateMany = useCallback(
    async (texts: string[], sourceLang: string = 'en'): Promise<string[]> => {
      if (language === sourceLang) {
        return texts;
      }

      setIsTranslating(true);
      setTranslationErrors([]);

      try {
        const translated = await translateBatch(texts, language, sourceLang, provider);
        return translated;
      } catch (error) {
        console.error('Batch translation error:', error);
        return texts; // Return originals on error
      } finally {
        setIsTranslating(false);
      }
    },
    [language, provider]
  );

  /**
   * Translate an object's text fields
   */
  const translateObject = useCallback(
    async <T extends Record<string, any>>(
      obj: T,
      fields: (keyof T)[],
      sourceLang: string = 'en'
    ): Promise<T> => {
      if (language === sourceLang) {
        return obj;
      }

      const translated = { ...obj };
      const textsToTranslate: string[] = [];
      const fieldIndices: number[] = [];

      fields.forEach(field => {
        if (field in obj && typeof obj[field] === 'string' && obj[field]) {
          textsToTranslate.push(obj[field] as string);
          fieldIndices.push(fields.indexOf(field));
        }
      });

      if (textsToTranslate.length === 0) {
        return translated;
      }

      setIsTranslating(true);

      try {
        const translations = await translateBatch(textsToTranslate, language, sourceLang, provider);
        
        let translationIndex = 0;
        fields.forEach((field, index) => {
          if (field in obj && typeof obj[field] === 'string' && obj[field]) {
            translated[field] = translations[translationIndex] as T[keyof T];
            translationIndex++;
          }
        });

        return translated;
      } catch (error) {
        console.error('Object translation error:', error);
        return obj;
      } finally {
        setIsTranslating(false);
      }
    },
    [language, provider]
  );

  /**
   * Translate bonus content
   */
  const translateBonus = useCallback(
    async (bonus: any, sourceLang: string = 'en'): Promise<any> => {
      if (language === sourceLang || language === 'en') {
        return bonus;
      }

      const translated = { ...bonus };

      // Translate title
      if (bonus.title && typeof bonus.title === 'string') {
        translated.title = await t(bonus.title, sourceLang);
      }

      // Translate description object
      if (bonus.description) {
        translated.description = { ...bonus.description };
        if (bonus.description.title) {
          translated.description.title = await t(bonus.description.title, sourceLang);
        }
        if (bonus.description.subtitle) {
          translated.description.subtitle = await t(bonus.description.subtitle, sourceLang);
        }
        if (bonus.description.content) {
          translated.description.content = await t(bonus.description.content, sourceLang);
        }
      }

      // Translate bonus instructions
      if (bonus.bonusInstructions && typeof bonus.bonusInstructions === 'string') {
        translated.bonusInstructions = await t(bonus.bonusInstructions, sourceLang);
      }

      // Translate accordion sections
      const accordionFields = ['wageringRequirement', 'bonusValue', 'maxBet', 'expiration', 'claimSpeed', 'termsConditions'];
      for (const field of accordionFields) {
        if (bonus[field]) {
          translated[field] = { ...bonus[field] };
          if (bonus[field].value) {
            translated[field].value = await t(bonus[field].value, sourceLang);
          }
          if (bonus[field].subtitle) {
            translated[field].subtitle = await t(bonus[field].subtitle, sourceLang);
          }
          if (bonus[field].content) {
            translated[field].content = await t(bonus[field].content, sourceLang);
          }
        }
      }

      // Translate custom sections
      if (bonus.customSections && Array.isArray(bonus.customSections)) {
        translated.customSections = await Promise.all(
          bonus.customSections.map(async (section: any) => {
            const translatedSection = { ...section };
            if (section.title) {
              translatedSection.title = await t(section.title, sourceLang);
            }
            if (section.content) {
              translatedSection.content = await t(section.content, sourceLang);
            }
            if (section.subtitle) {
              translatedSection.subtitle = await t(section.subtitle, sourceLang);
            }
            return translatedSection;
          })
        );
      }

      return translated;
    },
    [language, t]
  );

  /**
   * Translate casino content
   */
  const translateCasino = useCallback(
    async (casino: any, sourceLang: string = 'en'): Promise<any> => {
      if (language === sourceLang) {
        return casino;
      }

      const translated = { ...casino };

      // Translate name
      if (casino.name) {
        translated.name = await t(casino.name, sourceLang);
      }

      // Translate features
      if (casino.features && Array.isArray(casino.features)) {
        translated.features = await Promise.all(
          casino.features.map(async (feature: any) => ({
            ...feature,
            text: await t(feature.text, sourceLang),
          }))
        );
      }

      // Translate advantages
      if (casino.advantages && Array.isArray(casino.advantages)) {
        translated.advantages = await translateMany(casino.advantages, sourceLang);
      }

      return translated;
    },
    [language, t, translateMany]
  );

  /**
   * Translate guide content
   */
  const translateGuide = useCallback(
    async (guide: any, sourceLang: string = 'en'): Promise<any> => {
      if (language === sourceLang) {
        return guide;
      }

      const translated = { ...guide };

      if (guide.title) {
        translated.title = await t(guide.title, sourceLang);
      }

      if (guide.excerpt) {
        translated.excerpt = await t(guide.excerpt, sourceLang);
      }

      if (guide.content) {
        translated.content = await t(guide.content, sourceLang);
      }

      return translated;
    },
    [language, t]
  );

  return {
    t,
    translateMany,
    translateObject,
    translateBonus,
    translateCasino,
    translateGuide,
    isTranslating,
    translationErrors,
    language,
  };
}

