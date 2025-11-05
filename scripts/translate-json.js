#!/usr/bin/env node

/**
 * Script to translate a JSON translation file using LibreTranslate API
 * 
 * Usage:
 *   node scripts/translate-json.js en.json es.json
 *   node scripts/translate-json.js en.json fr.json fr
 */

const fs = require('fs');
const path = require('path');

const sourceFile = process.argv[2];
const targetFile = process.argv[3];
const targetLang = process.argv[4] || extractLanguageFromFilename(targetFile);

if (!sourceFile || !targetFile) {
  console.error('Usage: node scripts/translate-json.js <source.json> <target.json> [target-language]');
  console.error('Example: node scripts/translate-json.js en.json es.json es');
  process.exit(1);
}

function extractLanguageFromFilename(filename) {
  const match = filename.match(/([a-z]{2})\.json$/i);
  return match ? match[1] : 'es';
}

const languageMap = {
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'ro': 'ro',
  'en': 'en'
};

const targetLangCode = languageMap[targetLang.toLowerCase()] || 'es';

// Read source file
const sourcePath = path.join(__dirname, '../lib/i18n/messages', sourceFile);
const targetPath = path.join(__dirname, '../lib/i18n/messages', targetFile);

if (!fs.existsSync(sourcePath)) {
  console.error(`Source file not found: ${sourcePath}`);
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// LibreTranslate API endpoint
const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text; // No translation needed
  
  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.warn(`Translation error for "${text}":`, error.message);
    return text; // Return original on error
  }
}

async function translateObject(obj, targetLang) {
  const translated = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Translate string value
      console.log(`Translating: ${key}...`);
      translated[key] = await translateText(obj[key], targetLang);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively translate nested objects
      translated[key] = await translateObject(obj[key], targetLang);
    } else {
      // Keep non-string values as-is
      translated[key] = obj[key];
    }
  }
  
  return translated;
}

async function main() {
  console.log(`📝 Translating ${sourceFile} to ${targetLangCode}...`);
  console.log(`📄 Source: ${sourcePath}`);
  console.log(`📄 Target: ${targetPath}`);
  console.log('');
  
  // Read existing target file if it exists (to preserve existing translations)
  let targetData = {};
  if (fs.existsSync(targetPath)) {
    try {
      targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      console.log('✅ Found existing translations, will preserve them');
    } catch (e) {
      console.warn('⚠️  Could not read existing file, starting fresh');
    }
  }
  
  // Merge: keep existing translations, translate missing ones
  const merged = JSON.parse(JSON.stringify(sourceData));
  
  async function mergeTranslations(source, target, path = '') {
    for (const key in source) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof source[key] === 'string') {
        // If translation exists and is not just English, keep it
        if (target[key] && target[key] !== source[key]) {
          merged[key] = target[key];
          console.log(`✓ Keeping existing: ${currentPath}`);
        } else {
          // Translate missing value
          console.log(`🔄 Translating: ${currentPath}...`);
          merged[key] = await translateText(source[key], targetLangCode);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else if (typeof source[key] === 'object' && source[key] !== null) {
        // Recursively handle nested objects
        if (!merged[key]) merged[key] = {};
        if (!target[key]) target[key] = {};
        await mergeTranslations(source[key], target[key], currentPath);
      }
    }
  }
  
  await mergeTranslations(sourceData, targetData);
  
  // Write translated file
  fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  
  console.log('');
  console.log(`✅ Translation complete!`);
  console.log(`📄 Saved to: ${targetPath}`);
  console.log('');
  console.log('⚠️  Note: Please review translations for accuracy. Automated translations may need editing.');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

