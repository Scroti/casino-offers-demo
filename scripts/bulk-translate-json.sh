#!/bin/bash

# Bulk translate JSON files using Google Translate API or DeepL
# This script handles rate limiting better than LibreTranslate

echo "🌐 Bulk Translation Script"
echo "=========================="
echo ""
echo "This script will translate en.json to all other languages"
echo "Using a more reliable translation service (Google Translate/DeepL)"
echo ""
echo "⚠️  Note: LibreTranslate public API is rate-limited"
echo "💡 For production, consider using Google Translate API or DeepL"
echo ""

# Check if translation API key is set
if [ -z "$GOOGLE_TRANSLATE_API_KEY" ] && [ -z "$DEEPL_API_KEY" ]; then
  echo "❌ No translation API key found!"
  echo ""
  echo "Options:"
  echo "1. Use Google Translate API (free tier: 500k chars/month)"
  echo "   Set: export GOOGLE_TRANSLATE_API_KEY='your-key'"
  echo ""
  echo "2. Use DeepL API (free tier: 500k chars/month)"
  echo "   Set: export DEEPL_API_KEY='your-key'"
  echo ""
  echo "3. Manual translation (recommended for best quality)"
  echo "   - Copy en.json structure"
  echo "   - Translate using Google Translate website"
  echo "   - Review and edit for accuracy"
  exit 1
fi

# Languages to translate
languages=("es" "fr" "de" "ro")

for lang in "${languages[@]}"; do
  echo "📝 Translating to ${lang}..."
  node scripts/translate-json.js en.json ${lang}.json ${lang}
  echo ""
done

echo "✅ All translations complete!"
echo ""
echo "⚠️  Please review translations for accuracy"
echo "📝 Edit files in lib/i18n/messages/ if needed"

