# Translation Setup - LibreTranslate (Free)

This guide explains how the translation system works with LibreTranslate (free, no API key required).

## How It Works

### Two Translation Systems

1. **i18n (Static UI Text)** - For buttons, labels, navigation
   - Stored in `lib/i18n/messages/` JSON files
   - Used for: "Save", "Cancel", "Login", etc.
   - **Keep this for UI text and SEO**

2. **On-the-Fly Translation (Database Content)** - For casinos, bonuses, guides
   - Uses LibreTranslate API (free)
   - Translates content from database automatically
   - Cached in localStorage

## Setup

### No Setup Required! 🎉

LibreTranslate works out of the box - no API key needed.

The translation happens through:
1. Frontend → `/api/translate` endpoint
2. Backend → LibreTranslate public API
3. Result cached in localStorage

## Usage

### For Database Content (Bonuses, Casinos, Guides)

Use `TranslatedBonusCard` or `TranslatedCasinoCard`:

```tsx
import { TranslatedBonusCard } from '@/components/ui/translated-bonus-card';

// Automatically translates bonus content
<TranslatedBonusCard
  title={bonus.title}
  description={bonus.description}
  bonusInstructions={bonus.bonusInstructions}
  // ... other props
/>
```

### For UI Text (Buttons, Labels)

Use `useI18n()` hook:

```tsx
import { useI18n } from '@/context/i18n.context';

const { t } = useI18n();

<Button>{t('common.save')}</Button>
```

## Current Implementation

✅ **Bonuses Page** - Uses `TranslatedBonusCard` (translates automatically)
✅ **Casinos Page** - Uses `TranslatedCasinoCard` (translates automatically)
✅ **UI Text** - Uses i18n system (static translations)

## Testing

1. Change language using the language selector in header
2. Visit `/bonuses` page
3. Bonus titles and descriptions should translate automatically
4. UI buttons and labels use i18n translations

## How It Works

1. User selects language (e.g., Spanish)
2. `TranslatedBonusCard` detects language change
3. Calls LibreTranslate API via `/api/translate`
4. Translates bonus content (title, description, etc.)
5. Caches result in localStorage
6. Displays translated content

## Performance

- **First time**: API call to LibreTranslate (may take 1-2 seconds)
- **Cached**: Instant (from localStorage)
- **Cache expiry**: 7 days

## Limitations

- **LibreTranslate**: Free but rate-limited (public API)
- **Quality**: Good for most content, may not be perfect
- **Speed**: First load may be slower (API call)

## Future Improvements

If LibreTranslate works well:
- ✅ Keep i18n for UI text and SEO (static, fast)
- ✅ Use on-the-fly translation for database content (dynamic, no storage)
- ✅ Consider upgrading to Google Translate/DeepL for better quality (if needed)

## Troubleshooting

### Translations not working?

1. Check browser console for errors
2. Check network tab for `/api/translate` requests
3. Verify LibreTranslate API is accessible
4. Check cache in localStorage (may need to clear)

### Slow translations?

- First translation is slower (API call)
- Subsequent translations are cached (instant)
- Consider pre-translating popular content

### Translation quality issues?

- LibreTranslate is free but may have quality limitations
- Consider upgrading to Google Translate or DeepL for better quality
- Or use database translations for critical content

