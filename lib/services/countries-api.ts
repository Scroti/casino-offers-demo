// Country type from REST Countries API
export type Country = {
  name: {
    common: string;
    official: string;
  };
  cca2: string; // ISO 3166-1 alpha-2 code (e.g., 'US', 'GB')
  languages?: Record<string, string>; // ISO 639 language codes
};

// Simplified country type for our use
export type SimpleCountry = {
  code: string; // ISO 3166-1 alpha-2 code
  name: string; // Common name
};

/**
 * Fetch all countries from REST Countries API
 * Free, no API key required
 * https://restcountries.com
 */
export async function fetchAllCountries(): Promise<SimpleCountry[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    
    const countries: Country[] = await response.json();
    
    // Transform to our format and sort alphabetically
    const simpleCountries: SimpleCountry[] = countries
      .map((country) => ({
        code: country.cca2,
        name: country.name.common,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return simpleCountries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return a fallback list of major countries
    return getFallbackCountries();
  }
}

/**
 * Fallback countries list in case API fails
 */
function getFallbackCountries(): SimpleCountry[] {
  return [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'RO', name: 'Romania' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
  ].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Cache countries in localStorage to avoid repeated API calls
 */
const COUNTRIES_CACHE_KEY = 'countries_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedCountries(): Promise<SimpleCountry[]> {
  // Check cache first
  const cached = localStorage.getItem(COUNTRIES_CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Return cached data if less than 24 hours old
      if (now - timestamp < CACHE_EXPIRY) {
        return data;
      }
    } catch (error) {
      console.error('Error reading cached countries:', error);
    }
  }
  
  // Fetch fresh data
  const countries = await fetchAllCountries();
  
  // Cache the data
  try {
    localStorage.setItem(
      COUNTRIES_CACHE_KEY,
      JSON.stringify({ data: countries, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Error caching countries:', error);
  }
  
  return countries;
}

