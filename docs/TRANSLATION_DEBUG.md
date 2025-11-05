# Translation Debugging Guide

## Issue: Translations not showing

If translations are not working, check:

1. **I18nProvider is wrapping the app** ✅
   - Check `app/app-wrapper.component.tsx` - I18nProvider should wrap the app

2. **Translation files exist** ✅
   - Check `lib/i18n/messages/` - should have en.json, es.json, fr.json, de.json, ro.json

3. **Translation files have all keys** ⚠️
   - Spanish, French, German, Romanian files only have partial translations
   - Missing keys will fallback to English
   - Check browser console for warnings: `Translation key not found: ...`

4. **Language selector is working** ✅
   - Check `components/ui/language-toggle.tsx`
   - Language should be saved in cookie: `app-language`

5. **Translation function is working** ✅
   - Check `context/i18n.context.tsx` - `t()` function should:
     - Try current language first
     - Fallback to English if key not found
     - Return key itself if not found in English

## How to test:

1. Open browser console
2. Check for console logs:
   - `🍪 Found saved language in cookie: ...`
   - `🌍 Detected country: ..., Set language: ...`
   - `Translation key not found: ...` (warnings)

3. Change language using language toggle in header
4. Check if text changes (may need page refresh)
5. Check cookie: `document.cookie` should show `app-language=es` (or other language)

## Common Issues:

1. **Translation files missing keys**
   - Solution: Add missing keys to translation files
   - Or: Ensure fallback to English works

2. **Language not persisting**
   - Solution: Check cookie is being set correctly
   - Check `Cookies.set('app-language', lang, { expires: 365, path: '/' })`

3. **Components not using translations**
   - Solution: Import `useI18n()` hook
   - Use `t('key.path')` instead of hardcoded text

## Quick Fix:

If translations are not working, check browser console for errors and ensure:
- I18nProvider is wrapping the app
- Translation files exist
- Components are using `useI18n().t()` hook
- Language is being set correctly (check cookie)

