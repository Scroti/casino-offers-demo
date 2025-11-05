/**
 * React hook for translating database content
 * 
 * This hook provides easy access to translation functions for database content
 * with automatic language detection from the i18n context.
 */

import { useI18n } from '@/context/i18n.context';
import {
  translateText,
  translateBonus,
  translateCasino,
  translateGuide,
  translateObject,
  translateArray,
  type MultilingualString,
} from '@/lib/utils/translate-db';

/**
 * Hook for translating database content
 */
export function useTranslateDb() {
  const { language } = useI18n();
  
  return {
    /**
     * Translate a single multilingual field
     */
    t: (content: MultilingualString) => translateText(content, language),
    
    /**
     * Translate a bonus object
     */
    translateBonus: (bonus: any) => translateBonus(bonus, language),
    
    /**
     * Translate a casino object
     */
    translateCasino: (casino: any) => translateCasino(casino, language),
    
    /**
     * Translate a guide object
     */
    translateGuide: (guide: any) => translateGuide(guide, language),
    
    /**
     * Translate an object with specified fields
     */
    translateObject: <T extends Record<string, any>>(
      obj: T,
      fields: (keyof T)[]
    ) => translateObject(obj, fields, language),
    
    /**
     * Translate an array of objects
     */
    translateArray: <T extends Record<string, any>>(
      items: T[],
      fields: (keyof T)[]
    ) => translateArray(items, fields, language),
    
    /**
     * Current language
     */
    language,
  };
}

