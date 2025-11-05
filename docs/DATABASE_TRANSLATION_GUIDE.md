# Database Content Translation Guide

This guide explains how to translate content that comes from the database (casinos, bonuses, guides, etc.).

## Overview

There are two approaches to translate database content:

1. **Store translations in the database** (Recommended) - Store multilingual content directly in the database
2. **Translate on-the-fly** - Use a translation API to translate content dynamically

We'll use **Approach 1** as it's more reliable, faster, and doesn't require external API calls.

## How It Works

### Database Schema

Store content in a multilingual format:

```typescript
// Instead of:
{
  title: "Welcome Bonus"
}

// Store as:
{
  title: {
    en: "Welcome Bonus",
    es: "Bono de Bienvenida",
    fr: "Bonus de Bienvenue",
    de: "Willkommensbonus",
    ro: "Bonus de bun venit"
  }
}
```

### Translation Utility

Use the `translateText()` function to extract the correct language:

```typescript
import { translateText } from '@/lib/utils/translate-db';
import { useI18n } from '@/context/i18n.context';

function MyComponent() {
  const { language } = useI18n();
  
  // Translate a single field
  const title = translateText(bonus.title, language);
  
  return <h1>{title}</h1>;
}
```

## Implementation Steps

### Step 1: Update Database Schemas

Update your schemas to support multilingual content. For example, in `bonus.schema.ts`:

```typescript
// Before:
@Prop({ required: true })
title: string;

// After:
@Prop({
  type: {
    en: { type: String },
    es: { type: String },
    fr: { type: String },
    de: { type: String },
    ro: { type: String },
  },
  _id: false,
  required: true
})
title: string | Record<string, string>;
```

### Step 2: Update Admin Forms

Update admin forms to allow entering content in multiple languages:

```typescript
// In bonus-form-modal.tsx
const [titleEn, setTitleEn] = useState('');
const [titleEs, setTitleEs] = useState('');
const [titleFr, setTitleFr] = useState('');
// ... etc

// On submit, combine into multilingual object:
const title = {
  en: titleEn,
  es: titleEs,
  fr: titleFr,
  // ... etc
};
```

### Step 3: Use Translation in Components

Use the translation utility in your components:

```typescript
import { translateBonus } from '@/lib/utils/translate-db';
import { useI18n } from '@/context/i18n.context';

function BonusCard({ bonus }: { bonus: any }) {
  const { language } = useI18n();
  const translatedBonus = translateBonus(bonus, language);
  
  return (
    <div>
      <h2>{translatedBonus.title}</h2>
      <p>{translatedBonus.description?.content}</p>
    </div>
  );
}
```

## Translation Functions

### `translateText(content, language)`

Translates a single multilingual field:

```typescript
const title = translateText(bonus.title, 'es');
// Returns: "Bono de Bienvenida" if available, otherwise falls back to English
```

### `translateBonus(bonus, language)`

Translates an entire bonus object:

```typescript
const translated = translateBonus(bonus, 'es');
// Returns: Bonus with all text fields translated
```

### `translateCasino(casino, language)`

Translates an entire casino object:

```typescript
const translated = translateCasino(casino, 'es');
// Returns: Casino with all text fields translated
```

### `translateGuide(guide, language)`

Translates an entire guide object:

```typescript
const translated = translateGuide(guide, 'es');
// Returns: Guide with all text fields translated
```

## Examples

### Example 1: Translate Bonus Title

```typescript
import { translateText } from '@/lib/utils/translate-db';
import { useI18n } from '@/context/i18n.context';

function BonusTitle({ bonus }: { bonus: any }) {
  const { language } = useI18n();
  const title = translateText(bonus.title, language);
  
  return <h1>{title}</h1>;
}
```

### Example 2: Translate Casino Features

```typescript
import { translateCasino } from '@/lib/utils/translate-db';
import { useI18n } from '@/context/i18n.context';

function CasinoFeatures({ casino }: { casino: any }) {
  const { language } = useI18n();
  const translated = translateCasino(casino, language);
  
  return (
    <ul>
      {translated.features?.map((feature, i) => (
        <li key={i}>{feature.text}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Translate Guide Content

```typescript
import { translateGuide } from '@/lib/utils/translate-db';
import { useI18n } from '@/context/i18n.context';

function GuideContent({ guide }: { guide: any }) {
  const { language } = useI18n();
  const translated = translateGuide(guide, language);
  
  return (
    <article>
      <h1>{translated.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: translated.content }} />
    </article>
  );
}
```

## Migration Strategy

### Option 1: Gradual Migration (Recommended)

1. Keep existing string fields as-is (backward compatible)
2. Add new multilingual fields (e.g., `titleMultilingual`)
3. Update components to prefer multilingual fields, fallback to string fields
4. Gradually migrate data to multilingual format

### Option 2: Full Migration

1. Update all schemas to use multilingual format
2. Migrate all existing data to multilingual format (default to English)
3. Update all components to use translation functions

## Admin Form Example

Here's how to update admin forms to support multilingual input:

```typescript
function BonusFormModal() {
  const { language: currentLang } = useI18n();
  const [title, setTitle] = useState({
    en: '',
    es: '',
    fr: '',
    de: '',
    ro: '',
  });
  
  // Load existing data
  useEffect(() => {
    if (initialData?.title) {
      if (typeof initialData.title === 'string') {
        // Old format - convert to multilingual
        setTitle({ en: initialData.title, es: '', fr: '', de: '', ro: '' });
      } else {
        // Already multilingual
        setTitle(initialData.title);
      }
    }
  }, [initialData]);
  
  return (
    <form>
      {supportedLanguages.map(lang => (
        <div key={lang}>
          <Label>{`Title (${lang.toUpperCase()})`}</Label>
          <Input
            value={title[lang] || ''}
            onChange={(e) => setTitle({ ...title, [lang]: e.target.value })}
          />
        </div>
      ))}
    </form>
  );
}
```

## Backward Compatibility

The translation functions support both formats:

1. **New format** (multilingual object):
   ```typescript
   { title: { en: "...", es: "..." } }
   ```

2. **Old format** (simple string):
   ```typescript
   { title: "..." }
   ```

If a field is a simple string, it will be returned as-is (fallback to English).

## Best Practices

1. **Always use translation functions** - Don't access multilingual fields directly
2. **Fallback gracefully** - Always provide English as fallback
3. **Validate multilingual content** - Ensure at least English is provided
4. **Store all languages** - Even if not translated, store empty strings or English
5. **Use translation helpers** - Use `translateBonus()`, `translateCasino()`, etc. instead of manual translation

## Testing

Test your translations:

```typescript
// Test with different languages
const bonus = {
  title: {
    en: "Welcome Bonus",
    es: "Bono de Bienvenida",
    fr: "Bonus de Bienvenue"
  }
};

console.log(translateText(bonus.title, 'en')); // "Welcome Bonus"
console.log(translateText(bonus.title, 'es')); // "Bono de Bienvenida"
console.log(translateText(bonus.title, 'de')); // "Welcome Bonus" (fallback to English)
```

## Next Steps

1. Update database schemas to support multilingual fields
2. Update admin forms to allow multilingual input
3. Update components to use translation functions
4. Migrate existing data to multilingual format
5. Test with different languages

