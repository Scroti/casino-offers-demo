#!/usr/bin/env node

/**
 * Script to automatically translate all static text using LibreTranslate
 * Detects language from user's country and translates en.json to that language
 * 
 * Usage:
 *   node scripts/auto-translate-all-static-text.js [target-language]
 *   node scripts/auto-translate-all-static-text.js es  # Translate to Spanish
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const translationsDir = path.join(__dirname, '../lib/i18n/messages');
const enFile = path.join(translationsDir, 'en.json');
const targetLang = process.argv[2] || 'es'; // Default to Spanish

const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      q: text,
      source: 'en',
      target: targetLang,
      format: 'text',
    });

    const options = {
      hostname: 'libretranslate.com',
      path: '/translate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(responseData);
            resolve(result.translatedText || text);
          } catch (e) {
            console.warn(`Failed to parse response for "${text}":`, e.message);
            resolve(text);
          }
        } else if (res.statusCode === 429) {
          console.warn(`Rate limited for "${text}", waiting...`);
          setTimeout(() => resolve(text), 2000); // Wait and return original
        } else {
          console.warn(`Translation failed for "${text}" (${res.statusCode})`);
          resolve(text); // Return original on error
        }
      });
    });

    req.on('error', (error) => {
      console.warn(`Translation error for "${text}":`, error.message);
      resolve(text); // Return original on error
    });

    req.write(data);
    req.end();
  });
}

async function translateObject(obj, targetLang, path = '') {
  const translated = {};
  
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof obj[key] === 'string') {
      // Translate string value
      console.log(`🔄 Translating: ${currentPath}...`);
      translated[key] = await translateText(obj[key], targetLang);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursively translate nested objects
      translated[key] = await translateObject(obj[key], targetLang, currentPath);
    } else {
      // Keep non-string values as-is
      translated[key] = obj[key];
    }
  }
  
  return translated;
}

async function main() {
  console.log(`🌐 Auto-translating all static text to ${targetLang}...`);
  console.log(`📄 Source: ${enFile}`);
  console.log('');

  // Read English file
  const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  
  // Read existing target file if it exists
  const targetFile = path.join(translationsDir, `${targetLang}.json`);
  let targetData = {};
  
  if (fs.existsSync(targetFile)) {
    try {
      targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
      console.log('✅ Found existing translations, will preserve them');
    } catch (e) {
      console.warn('⚠️  Could not read existing file, starting fresh');
    }
  }

  // Merge: keep existing translations, translate missing ones
  const merged = JSON.parse(JSON.stringify(enData));
  
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
          merged[key] = await translateText(source[key], targetLang);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        // Recursively handle nested objects
        if (!merged[key]) merged[key] = {};
        if (!target[key]) target[key] = {};
        await mergeTranslations(source[key], target[key], currentPath);
      }
    }
  }
  
  await mergeTranslations(enData, targetData);
  
  // Write translated file
  fs.writeFileSync(targetFile, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  
  console.log('');
  console.log(`✅ Translation complete!`);
  console.log(`📄 Saved to: ${targetFile}`);
  console.log('');
  console.log('⚠️  Note: Please review translations for accuracy. Automated translations may need editing.');
  console.log('💡 Tip: Run this script for each language: es, fr, de, ro');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

