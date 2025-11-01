/**
 * Environment variables configuration
 * Centralized access to all environment variables with fallbacks
 */

export const ENV = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1',
  
  // Feature Flags
  USE_MOCK_CASINOS: process.env.NEXT_PUBLIC_USE_MOCK_CASINOS === 'true',
  
  // App Configuration
  APP_NAME: 'Playwise Guru',
  
  // Cookie Configuration
  COOKIE_CONFIG: {
    ACCESS_TOKEN_EXPIRES: 1 / 24, // 1 hour
    REFRESH_TOKEN_EXPIRES: 7, // 7 days
    SAME_SITE: 'strict' as const,
    SECURE: false, // Set to true in production with HTTPS
    PATH: '/',
  },
} as const;

