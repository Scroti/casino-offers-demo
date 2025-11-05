# Translation Guide

This guide explains how to use the translation system to translate all text in the app based on the user's selected language.

## Overview

The app uses a custom i18n (internationalization) system with:
- **5 supported languages**: English (en), Spanish (es), French (fr), German (de), Romanian (ro)
- **Translation files**: Located in `lib/i18n/messages/`
- **Translation hook**: `useI18n()` from `@/context/i18n.context`
- **Automatic language detection**: Based on user's country

## How to Use Translations

### 1. Import the Translation Hook

```tsx
import { useI18n } from '@/context/i18n.context';
```

### 2. Get the Translation Function

```tsx
function MyComponent() {
  const { t } = useI18n();
  
  return <h1>{t('common.title')}</h1>;
}
```

### 3. Use Translation Keys

Translation keys use dot notation to access nested properties:

```tsx
// Common translations
t('common.home')        // "Home"
t('common.login')       // "Login"
t('common.save')        // "Save"

// Section-specific translations
t('bonuses.title')      // "Bonuses"
t('casinos.visit')      // "Visit Casino"
t('auth.login.title')   // "Login to your account"
```

## Translation File Structure

Translation files are organized by sections:

```json
{
  "common": { ... },      // Common UI elements
  "hero": { ... },        // Hero section
  "bonuses": { ... },     // Bonuses section
  "casinos": { ... },     // Casinos section
  "games": { ... },      // Games section
  "guides": { ... },     // Guides section
  "news": { ... },        // News section
  "auth": { ... },        // Authentication
  "profile": { ... },     // User profile
  "admin": { ... },       // Admin panel
  "forms": { ... },       // Form validation
  "newsletter": { ... },  // Newsletter
  "support": { ... },     // Support
  "footer": { ... },      // Footer
  "errors": { ... },      // Error messages
  "validation": { ... }   // Validation messages
}
```

## Examples

### Example 1: Button with Translation

```tsx
import { useI18n } from '@/context/i18n.context';
import { Button } from '@/components/ui/button';

function MyButton() {
  const { t } = useI18n();
  
  return (
    <Button onClick={handleClick}>
      {t('common.save')}
    </Button>
  );
}
```

### Example 2: Form with Translations

```tsx
import { useI18n } from '@/context/i18n.context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function MyForm() {
  const { t } = useI18n();
  
  return (
    <form>
      <div>
        <Label htmlFor="email">{t('auth.login.email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth.login.email')}
        />
      </div>
      <Button type="submit">
        {t('common.submit')}
      </Button>
    </form>
  );
}
```

### Example 3: Conditional Text

```tsx
import { useI18n } from '@/context/i18n.context';

function StatusMessage({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  
  return (
    <p>
      {isActive ? t('common.yes') : t('common.no')}
    </p>
  );
}
```

### Example 4: Page Title

```tsx
import { useI18n } from '@/context/i18n.context';

function BonusesPage() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('bonuses.title')}</h1>
      <p>{t('bonuses.noBonuses')}</p>
    </div>
  );
}
```

## Adding New Translations

### Step 1: Add to English Translation File

Edit `lib/i18n/messages/en.json` and add your new key:

```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

### Step 2: Add to Other Language Files

Add the same key structure to all other language files:
- `lib/i18n/messages/es.json` (Spanish)
- `lib/i18n/messages/fr.json` (French)
- `lib/i18n/messages/de.json` (German)
- `lib/i18n/messages/ro.json` (Romanian)

### Step 3: Use in Component

```tsx
const { t } = useI18n();
<p>{t('mySection.myKey')}</p>
```

## Language Detection

The app automatically detects the user's language based on their country:
- Spanish-speaking countries → Spanish (es)
- French-speaking countries → French (fr)
- German-speaking countries → German (de)
- Romanian-speaking countries → Romanian (ro)
- Other countries → English (en)

Users can also manually change their language using the language selector in the header.

## Best Practices

1. **Use descriptive keys**: Use clear, hierarchical keys like `bonuses.title` instead of `title1`
2. **Group related translations**: Group translations by feature/section
3. **Keep keys consistent**: Use the same key structure across all language files
4. **Fallback to English**: If a translation is missing, the system falls back to English
5. **Test all languages**: Test your components with different languages selected

## Common Translation Keys

### Navigation
- `common.home` - Home
- `common.casinos` - Online Casinos
- `common.bonuses` - Bonuses
- `common.games` - Games
- `common.guides` - Guides
- `common.news` - News
- `common.support` - Support

### Actions
- `common.save` - Save
- `common.cancel` - Cancel
- `common.delete` - Delete
- `common.edit` - Edit
- `common.add` - Add
- `common.submit` - Submit

### Status
- `common.loading` - Loading...
- `common.error` - Error
- `common.success` - Success

### Forms
- `forms.required` - This field is required
- `forms.invalidEmail` - Please enter a valid email address
- `forms.passwordTooShort` - Password must be at least 8 characters

## Troubleshooting

### Translation Not Showing

1. **Check the key exists**: Make sure the key exists in all language files
2. **Check the key path**: Verify the dot notation path is correct
3. **Check language selection**: Verify the user has selected a language
4. **Check console**: Look for translation errors in the browser console

### Missing Translation

If a translation is missing, the system will:
1. Try to use the English translation
2. Fall back to the key itself if English is also missing

### Adding a New Language

1. Add the language code to `lib/i18n/i18n.ts`:
   ```typescript
   export const supportedLanguages = ['en', 'es', 'fr', 'de', 'ro', 'it'];
   ```

2. Create a new translation file: `lib/i18n/messages/it.json`

3. Import it in `context/i18n.context.tsx`:
   ```typescript
   import itMessages from '@/lib/i18n/messages/it.json';
   const messages: Record<string, any> = {
     // ... existing languages
     it: itMessages,
   };
   ```

4. Add the language name to `components/ui/language-toggle.tsx`:
   ```typescript
   const languageNames: Record<string, string> = {
     // ... existing languages
     it: 'Italiano',
   };
   ```

## Need Help?

If you need help with translations:
1. Check the existing translation files for examples
2. Look at components that already use translations (e.g., `components/app-header.tsx`)
3. Follow the same pattern for consistency

