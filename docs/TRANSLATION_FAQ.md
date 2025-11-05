# Translation FAQ

## Q: Should I translate every text using the API?

**A: No!** Use a hybrid approach:

### ✅ Use i18n JSON Files For:
- Static UI text (buttons, labels, navigation)
- Form labels
- Error messages
- Common phrases

**Why?** 
- Fast (no API calls)
- SEO-friendly
- Free
- Cached

### ✅ Use LibreTranslate API For:
- Database content (casino names, bonus descriptions)
- Dynamic content that changes frequently
- User-generated content

**Why?**
- Too much to store manually
- Automatic translation
- Saves database space

## Q: Should I make a copy of the site for each language?

**A: No!** Use a single site with language switching:

### ❌ Bad: Site Copies
- `/en/` - English site
- `/es/` - Spanish site
- `/fr/` - French site

**Problems:**
- Maintenance nightmare
- Poor SEO
- Expensive
- Slow development

### ✅ Good: Single Site with Language Switching
- `/` - Same site, different language
- Language stored in cookie
- Content translated on-the-fly

**Benefits:**
- One codebase
- Better SEO
- Lower costs
- Faster development

## Q: How do I translate all static text?

### Option 1: Use Translation Script
```bash
# Translate en.json to Spanish
node scripts/translate-json.js en.json es.json es
```

### Option 2: Manual Translation
1. Open `lib/i18n/messages/en.json`
2. Copy structure to `es.json`
3. Translate each value
4. Use Google Translate/DeepL for initial translation
5. Review and edit for accuracy

### Option 3: Use Translation API
1. Use Google Translate API or DeepL API
2. Bulk translate entire JSON files
3. Review and edit

## Q: What if I want better translation quality?

**A:** For critical static text:
1. Use professional translation services
2. Or use premium APIs (Google Translate, DeepL)
3. Review and edit automated translations

For database content:
- LibreTranslate is free but may have quality issues
- Consider upgrading to Google Translate or DeepL for better quality
- Or pre-translate and store in database

## Q: How much does it cost?

### Current Approach (Hybrid)
- Static text: **Free** (JSON files)
- Database content: **Free** (LibreTranslate public API)
- **Total**: Free

### Full API Translation
- All text via API: **Expensive** (thousands of calls per page)
- **Not recommended**

### Premium APIs
- Google Translate: ~$20 per 1M characters
- DeepL: ~$25 per 1M characters
- **Only use for critical content**

## Q: What's the best workflow?

### Phase 1: Current State ✅
- Static text: i18n JSON (fallback to English)
- Database content: LibreTranslate API
- **Working now!**

### Phase 2: Improve Static Translations
1. Use script to bulk translate: `node scripts/translate-json.js en.json es.json es`
2. Review and edit translations
3. Repeat for other languages

### Phase 3: Optional - Pre-translate Database
1. Use LibreTranslate to generate initial translations
2. Store in database: `{ en: "...", es: "...", fr: "..." }`
3. Admin can edit translations
4. Better SEO and performance

## Q: How do I know what needs translation?

### Check Browser Console
- Missing translation warnings: `Translation key not found: ...`
- Language change logs: `🌐 Changing language from en to es`

### Check Translation Files
- Compare `en.json` with other language files
- Missing keys will show in English

### Use Translation Script
```bash
# Shows what needs translation
node scripts/check-translations.js
```

## Summary

✅ **Do**: Hybrid approach (i18n JSON + LibreTranslate API)
✅ **Do**: Fill in missing static translations
✅ **Do**: Use translation script for bulk translation
✅ **Don't**: Make site copies per language
✅ **Don't**: Translate all static text via API

**Current setup is correct!** Just need to fill in missing translations in JSON files.

