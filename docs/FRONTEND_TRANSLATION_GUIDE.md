# Frontend Translation Guide (On-the-Fly Translation)

This guide explains how to translate database content on-the-fly using translation APIs instead of storing translations in the database.

## Overview

Instead of storing translations in the database, you can translate content dynamically using translation APIs. This approach:

✅ **Advantages:**
- No need to store translations in database
- Supports unlimited languages
- Automatic translation
- Less database storage

❌ **Disadvantages:**
- Requires API calls (can be slow)
- Translation quality may vary
- API costs (some providers are free)
- Requires internet connection

## Setup

### Option 1: LibreTranslate (Free, No API Key Required)

LibreTranslate is an open-source translation service that works without an API key (rate limited).

```typescript
// Already configured by default
const { t } = useTranslateApi('libretranslate');
```

### Option 2: Google Translate API (Requires API Key)

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `.env.local`:
   ```bash
   GOOGLE_TRANSLATE_API_KEY=your-api-key
   ```

### Option 3: DeepL API (Requires API Key, Better Quality)

1. Get API key from [DeepL](https://www.deepl.com/pro-api)
2. Add to `.env.local`:
   ```bash
   DEEPL_API_KEY=your-api-key
   ```

## Usage

### Basic Example

```tsx
import { useTranslateApi } from '@/hooks/use-translate-api';

function BonusCard({ bonus }: { bonus: any }) {
  const { t, isTranslating } = useTranslateApi();
  const [translatedTitle, setTranslatedTitle] = useState('');
  
  useEffect(() => {
    const translate = async () => {
      const translated = await t(bonus.title);
      setTranslatedTitle(translated);
    };
    translate();
  }, [bonus.title, t]);
  
  return (
    <div>
      {isTranslating ? (
        <Skeleton className="h-6 w-48" />
      ) : (
        <h2>{translatedTitle || bonus.title}</h2>
      )}
    </div>
  );
}
```

### Translate Entire Object

```tsx
import { useTranslateApi } from '@/hooks/use-translate-api';

function BonusCard({ bonus }: { bonus: any }) {
  const { translateBonus, isTranslating } = useTranslateApi();
  const [translated, setTranslated] = useState(bonus);
  
  useEffect(() => {
    const translate = async () => {
      const result = await translateBonus(bonus);
      setTranslated(result);
    };
    translate();
  }, [bonus, translateBonus]);
  
  return (
    <div>
      {isTranslating ? (
        <div>Translating...</div>
      ) : (
        <>
          <h2>{translated.title}</h2>
          <p>{translated.description?.content}</p>
        </>
      )}
    </div>
  );
}
```

### Translate Array of Items

```tsx
import { useTranslateApi } from '@/hooks/use-translate-api';

function BonusesList({ bonuses }: { bonuses: any[] }) {
  const { translateMany, isTranslating } = useTranslateApi();
  const [translatedTitles, setTranslatedTitles] = useState<string[]>([]);
  
  useEffect(() => {
    const translate = async () => {
      const titles = bonuses.map(b => b.title);
      const translated = await translateMany(titles);
      setTranslatedTitles(translated);
    };
    translate();
  }, [bonuses, translateMany]);
  
  return (
    <div>
      {isTranslating && <div>Translating...</div>}
      {bonuses.map((bonus, i) => (
        <div key={bonus._id}>
          <h3>{translatedTitles[i] || bonus.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

## Caching

Translations are automatically cached to:
- Avoid repeated API calls
- Improve performance
- Reduce costs

Cache is stored in:
- Memory (for current session)
- localStorage (persists across sessions, 7 days expiry)

Cache is keyed by: `sourceLang:targetLang:text`

## Performance Tips

1. **Use loading states** - Show skeleton/loading while translating
2. **Cache translations** - Already handled automatically
3. **Batch translations** - Use `translateMany()` for multiple texts
4. **Translate on demand** - Only translate when needed
5. **Use SSR/SSG** - Pre-translate on server for better performance

## Error Handling

The hook automatically handles errors:
- Returns original text on error
- Logs errors to console
- Tracks errors in `translationErrors` array

```tsx
const { t, translationErrors } = useTranslateApi();

if (translationErrors.length > 0) {
  console.warn('Some translations failed:', translationErrors);
}
```

## Providers Comparison

| Provider | Cost | Quality | Speed | API Key Required |
|----------|------|---------|-------|------------------|
| LibreTranslate | Free | Good | Medium | No |
| Google Translate | Paid | Excellent | Fast | Yes |
| DeepL | Paid | Excellent | Fast | Yes |

**Recommendation:**
- Start with LibreTranslate (free, no setup)
- Upgrade to Google/DeepL for better quality if needed

## Example: Complete Component

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslateApi } from '@/hooks/use-translate-api';
import { Skeleton } from '@/components/ui/skeleton';

export function BonusCard({ bonus }: { bonus: any }) {
  const { translateBonus, isTranslating } = useTranslateApi();
  const [translated, setTranslated] = useState(bonus);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const translate = async () => {
      setInitialized(true);
      const result = await translateBonus(bonus);
      setTranslated(result);
    };
    
    if (!initialized) {
      translate();
    }
  }, [bonus, translateBonus, initialized]);
  
  if (isTranslating && !initialized) {
    return (
      <div className="bonus-card">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }
  
  return (
    <div className="bonus-card">
      <h2>{translated.title}</h2>
      <p>{translated.description?.content}</p>
      {translated.bonusInstructions && (
        <p>{translated.bonusInstructions}</p>
      )}
    </div>
  );
}
```

## Best Practices

1. **Show loading states** - Users should know content is being translated
2. **Fallback to original** - Always show original text if translation fails
3. **Cache translations** - Already handled, but be aware of cache size
4. **Batch requests** - Use `translateMany()` instead of multiple `t()` calls
5. **Translate on demand** - Only translate when user changes language
6. **Handle errors gracefully** - Show original text on error

## Migration from Database Translations

If you're migrating from database translations:

1. Keep existing translation system as fallback
2. Use frontend translation for new content
3. Gradually migrate old content
4. Compare translation quality

## Troubleshooting

### Translations not working

- Check API key is set (if using Google/DeepL)
- Check network connection
- Check browser console for errors
- Verify language code is correct

### Slow translations

- Use caching (already enabled)
- Batch translations
- Consider pre-translating on server
- Use faster provider (Google/DeepL)

### High API costs

- Use LibreTranslate (free)
- Implement better caching
- Limit translation requests
- Consider hybrid approach (store common translations)

