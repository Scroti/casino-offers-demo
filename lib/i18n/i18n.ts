// Country code to language mapping
export const countryToLanguage: Record<string, string> = {
  // Spanish-speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
  'VE': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
  'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es',
  'UY': 'es', 'PR': 'es',
  
  // French-speaking countries
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr', 'LU': 'fr', 'MC': 'fr',
  
  // German-speaking countries
  'DE': 'de', 'AT': 'de', 'LI': 'de',
  
  // Romanian-speaking countries
  'RO': 'ro', 'MD': 'ro',
  
  // Default to English for other countries
};

export const defaultLanguage = 'en';
export const supportedLanguages = ['en', 'es', 'fr', 'de', 'ro'];

export function getLanguageFromCountry(countryCode: string | undefined): string {
  if (!countryCode) return defaultLanguage;
  return countryToLanguage[countryCode.toUpperCase()] || defaultLanguage;
}

