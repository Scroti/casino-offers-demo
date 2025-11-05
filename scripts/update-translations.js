#!/usr/bin/env node

/**
 * Script to update translation files with missing keys from English
 * This ensures all translation files have the same structure
 */

const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '../lib/i18n/messages');
const enFile = path.join(translationsDir, 'en.json');
const translationFiles = ['es.json', 'fr.json', 'de.json', 'ro.json'];

// Read English file (master)
const enTranslations = JSON.parse(fs.readFileSync(enFile, 'utf8'));

// Function to merge translations
function mergeTranslations(master, existing) {
  const merged = { ...master };
  
  // Recursively merge
  for (const key in master) {
    if (typeof master[key] === 'object' && master[key] !== null && !Array.isArray(master[key])) {
      merged[key] = mergeTranslations(master[key], existing[key] || {});
    } else if (existing && existing[key]) {
      // Keep existing translation if it exists
      merged[key] = existing[key];
    }
    // Otherwise keep master (English) value
  }
  
  return merged;
}

// Update each translation file
translationFiles.forEach(file => {
  const filePath = path.join(translationsDir, file);
  let existing = {};
  
  // Read existing translations if file exists
  if (fs.existsSync(filePath)) {
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.warn(`Error reading ${file}:`, e.message);
    }
  }
  
  // Merge with English master
  const merged = mergeTranslations(enTranslations, existing);
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated ${file}`);
});

console.log('\n✅ All translation files updated!');
console.log('⚠️  Note: Missing translations will show in English until translated.');

