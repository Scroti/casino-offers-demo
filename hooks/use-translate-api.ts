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
      if (language === sourceLang) {
        return bonus;
      }

      const fields: (keyof typeof bonus)[] = ['title', 'bonusInstructions'];
      const translated = await translateObject(bonus, fields, sourceLang);

      // Translate description object
      if (bonus.description) {
        const descFields: any[] = ['title', 'subtitle', 'content'];
        translated.description = await translateObject(bonus.description, descFields, sourceLang);
      }

      // Translate custom sections
      if (bonus.customSections && Array.isArray(bonus.customSections)) {
        translated.customSections = await Promise.all(
          bonus.customSections.map(async (section: any) => {
            const sectionFields: any[] = ['title', 'content', 'subtitle'];
            return translateObject(section, sectionFields, sourceLang);
          })
        );
      }

      return translated;
    },
    [language, translateObject]
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

