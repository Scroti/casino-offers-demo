# Translation Strategy Guide

## Best Approach: Hybrid System

You should **NOT** make a copy of the site for each language. Instead, use a **hybrid approach**:

### ✅ **Static UI Text** → i18n JSON Files (Current Approach)
- **What**: Buttons, labels, navigation, form labels, error messages
- **Why**: 
  - ⚡ Fast (no API calls)
  - 🔍 SEO-friendly (search engines can index each language)
  - 💰 Free (no API costs)
  - 📦 Cached in browser
- **Where**: `lib/i18n/messages/en.json`, `es.json`, `fr.json`, etc.
- **Example**: "Bonuses", "Filter", "Sort By", "Login"

### ✅ **Database Content** → LibreTranslate API (Current Approach)
- **What**: Casino names, bonus descriptions, guide content, news articles
- **Why**:
  - 📊 Too much content to store manually
  - 🔄 Dynamic content changes frequently
  - 💾 Saves database space
  - 🚀 Automatic translation
- **Where**: `TranslatedBonusCard`, `TranslatedCasinoCard` components
- **Example**: Bonus titles, casino descriptions, guide content

## Why NOT Make Site Copies?

❌ **Bad Approach**: One site per language (e.g., `/es/`, `/fr/`)
- Maintenance nightmare (update 5+ sites for one change)
- Poor SEO (duplicate content issues)
- Expensive (multiple deployments)
- Slower development

✅ **Good Approach**: Single site with language switching
- One codebase to maintain
- Better SEO (proper hreflang tags)
- Lower costs
- Faster development

## Current Implementation

### Static Text (i18n JSON)
```tsx
import { useI18n } from '@/context/i18n.context';

const { t } = useI18n();
<h1>{t('bonuses.title')}</h1>  // "Bonuses" in English, "Bonificaciones" in Spanish
```

### Database Content (LibreTranslate)
```tsx
import { TranslatedBonusCard } from '@/components/ui/translated-bonus-card';

<TranslatedBonusCard 
  title={bonus.title}  // Automatically translated from English to user's language
  description={bonus.description}
/>
```

## Translation Workflow

### Phase 1: Current State ✅
- Static text: i18n JSON files (partially translated)
- Database content: LibreTranslate API (working)

### Phase 2: Improve Static Translations (Recommended)
1. **Fill in missing translations** in JSON files:
   - Use translation services (Google Translate, DeepL) to translate JSON files
   - Or use our sync script: `node scripts/update-translations.js`
   - Review and edit translations for accuracy

2. **Priority order**:
   - Most visible text first (navigation, buttons, common labels)
   - Then less visible text (error messages, form labels)

### Phase 3: Optional - Pre-translate Database Content
- For better SEO and performance, you could:
  - Store translations in database (multilingual fields)
  - Use LibreTranslate to generate initial translations
  - Store in format: `{ en: "...", es: "...", fr: "..." }`
  - Fallback to API if translation missing

## How to Translate All Static Text

### Option 1: Manual Translation (Best Quality)
1. Open `lib/i18n/messages/en.json`
2. Copy to `es.json`, `fr.json`, etc.
3. Translate each value manually
4. Use translation tools for initial translation, then review

### Option 2: Automated Translation (Faster)
1. Use Google Translate API or DeepL API
2. Translate entire JSON files
3. Review and edit for accuracy
4. Save to respective language files

### Option 3: Use LibreTranslate for Initial Pass
```bash
# Translate en.json to es.json
node scripts/translate-json.js en.json es.json
```

## Recommended Action Plan

### Immediate (What You Have Now) ✅
- ✅ Static text: i18n JSON (fallback to English if missing)
- ✅ Database content: LibreTranslate API
- ✅ Language selector working

### Short Term (Next Steps)
1. **Fill in critical static translations**:
   - Navigation items
   - Common buttons ("Save", "Cancel", "Delete")
   - Form labels
   - Error messages

2. **Use translation API to bulk translate**:
   - Translate entire `en.json` to other languages
   - Review and edit for quality

### Long Term (Optional)
1. **Pre-translate database content**:
   - Store multilingual data in database
   - Use LibreTranslate for initial translation
   - Admin can edit translations

2. **SEO optimization**:
   - Add hreflang tags
   - Generate language-specific sitemaps
   - Optimize meta descriptions per language

## Cost Comparison

### Current Approach (Hybrid)
- Static text: **Free** (JSON files)
- Database content: **Free** (LibreTranslate public API, rate-limited)
- **Total**: Free (with rate limits)

### Full API Translation
- All text via API: **Expensive** (thousands of API calls per page)
- Slow (wait for each translation)
- **Not recommended**

### Pre-translated Database
- Initial translation: **One-time cost** (translate once)
- Storage: **Minimal** (multilingual fields)
- **Best for SEO** but requires more setup

## Summary

✅ **Keep using**: Hybrid approach (i18n JSON + LibreTranslate API)
✅ **Improve**: Fill in missing static translations in JSON files
✅ **Don't do**: Make site copies per language
✅ **Don't do**: Translate all static text via API

The current setup is correct! Just need to:
1. Fill in missing translations in JSON files
2. Keep using LibreTranslate for database content
3. Optionally pre-translate popular database content for better SEO

