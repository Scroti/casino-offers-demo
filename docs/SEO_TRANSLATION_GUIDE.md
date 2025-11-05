# SEO Translation Guide - Complete Static Text Translation

## Goal: Best SEO with All Static Text Translated

For optimal SEO, **all static text** should be:
1. ✅ Stored in JSON translation files (not hardcoded)
2. ✅ Translated to all supported languages
3. ✅ Used in components via `t()` hook

## Current Status

### ✅ What's Already Translated
- Navigation items
- Common buttons (Save, Cancel, Delete)
- Form labels
- Error messages
- Bonus/Casino page text

### ⚠️ What Still Needs Translation
- Hardcoded text in components
- Dynamic content (via LibreTranslate API - working)
- Some component-specific text

## Step-by-Step Process

### Step 1: Find All Static Text

Run the finder script:
```bash
node scripts/find-static-text.js
```

This will list all hardcoded text that needs translation.

### Step 2: Add Missing Keys to en.json

For each hardcoded text found:
1. Add to `lib/i18n/messages/en.json`
2. Use logical key structure: `section.subsection.key`
3. Example:
```json
{
  "hero": {
    "cta": "Get Started",
    "learnMore": "Learn More"
  },
  "features": {
    "title": "Why Choose Us",
    "description": "Trusted by millions..."
  }
}
```

### Step 3: Translate to All Languages

#### Option A: Automated Translation (Faster)

**Using Google Translate API** (Recommended):
```bash
# Set API key
export GOOGLE_TRANSLATE_API_KEY='your-key'

# Translate all files
node scripts/translate-json-google.js en.json es.json es
node scripts/translate-json-google.js en.json fr.json fr
node scripts/translate-json-google.js en.json de.json de
node scripts/translate-json-google.js en.json ro.json ro
```

**Using DeepL API**:
```bash
export DEEPL_API_KEY='your-key'
node scripts/translate-json-deepl.js en.json es.json es
```

**Using LibreTranslate** (Rate-limited, slow):
```bash
node scripts/translate-json.js en.json es.json es
# Wait for rate limit, repeat for other languages
```

#### Option B: Manual Translation (Best Quality)

1. Open `lib/i18n/messages/en.json`
2. Copy structure to `es.json`, `fr.json`, etc.
3. Use Google Translate website for initial translation
4. Review and edit for accuracy
5. Save to respective language files

### Step 4: Update Components

Replace hardcoded text with `t()` calls:

**Before:**
```tsx
<h1>Welcome to Our Casino</h1>
<Button>Get Started</Button>
```

**After:**
```tsx
import { useI18n } from '@/context/i18n.context';

const { t } = useI18n();

<h1>{t('hero.title')}</h1>
<Button>{t('hero.cta')}</Button>
```

### Step 5: Verify SEO

1. **Check HTML source** - Text should be in target language
2. **Check meta tags** - Should be translated
3. **Test with Google Search Console** - Verify language detection
4. **Check hreflang tags** - Add if needed

## Quick Checklist

### For Each Component:
- [ ] Find all hardcoded text
- [ ] Add to en.json with proper key
- [ ] Replace hardcoded text with `t('key')`
- [ ] Import `useI18n` hook
- [ ] Test in different languages

### For Translation Files:
- [ ] All keys from en.json exist in other languages
- [ ] Translations are accurate (review automated translations)
- [ ] No missing keys (check console warnings)

## SEO Best Practices

### 1. Server-Side Rendering (SSR)
- ✅ Next.js already does SSR
- ✅ Translations work on server-side
- ✅ Search engines see translated content

### 2. Meta Tags
- ✅ Update meta tags per language
- ✅ Use translated titles and descriptions
- ✅ Add language-specific meta tags

### 3. URLs
- ✅ Consider language-specific URLs: `/es/bonuses`, `/fr/bonuses`
- ✅ Or use cookie-based language (current approach)
- ✅ Add hreflang tags for both approaches

### 4. Content Structure
- ✅ All visible text should be translated
- ✅ Alt text for images should be translated
- ✅ Form labels should be translated
- ✅ Error messages should be translated

## Common Patterns

### Navigation
```tsx
// Before
<Link href="/bonuses">Bonuses</Link>

// After
<Link href="/bonuses">{t('common.bonuses')}</Link>
```

### Buttons
```tsx
// Before
<Button>Save</Button>

// After
<Button>{t('common.save')}</Button>
```

### Form Labels
```tsx
// Before
<label>Email</label>

// After
<label>{t('auth.login.email')}</label>
```

### Error Messages
```tsx
// Before
<p>Invalid email address</p>

// After
<p>{t('validation.email')}</p>
```

## Tools & Scripts

1. **Find Static Text**: `node scripts/find-static-text.js`
2. **Sync Translation Files**: `node scripts/update-translations.js`
3. **Translate JSON**: `node scripts/translate-json.js en.json es.json es`
4. **Bulk Translate**: `bash scripts/bulk-translate-json.sh`

## Next Steps

1. ✅ Run `find-static-text.js` to find all hardcoded text
2. ✅ Add missing keys to `en.json`
3. ✅ Translate to all languages (automated or manual)
4. ✅ Update components to use `t()` hook
5. ✅ Test in all languages
6. ✅ Verify SEO with Google Search Console

## Cost Considerations

- **Google Translate API**: Free tier 500k chars/month, then $20/1M chars
- **DeepL API**: Free tier 500k chars/month, then $25/1M chars
- **LibreTranslate**: Free but rate-limited
- **Manual Translation**: Free but time-consuming

**Recommendation**: Use Google Translate API for bulk translation, then review and edit.

