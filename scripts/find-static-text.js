#!/usr/bin/env node

/**
 * Script to find all hardcoded static text in components
 * This helps identify what needs to be translated
 */

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../components');
const appDir = path.join(__dirname, '../app');

const staticTexts = new Set();
const filesToCheck = [];

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function extractText(content) {
  const patterns = [
    />([A-Z][^<]{3,})</g,  // Text in JSX: >Text<
    /"([A-Z][^"]{3,})"/g,  // Strings: "Text"
    /'([A-Z][^']{3,})'/g,  // Strings: 'Text'
    /`([A-Z][^`]{3,})`/g,  // Template strings: `Text`
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      // Filter out common non-translatable patterns
      if (
        text.length > 3 &&
        !text.includes('className') &&
        !text.includes('http') &&
        !text.includes('@') &&
        !text.includes('{') &&
        !text.includes('}') &&
        !text.match(/^[A-Z_]+$/) && // UPPERCASE_CONSTANTS
        !text.match(/^[a-z]+\.[a-z]+$/) // property.access
      ) {
        staticTexts.add(text);
      }
    }
  });
}

// Find all component files
const componentFiles = findFiles(componentsDir);
const appFiles = findFiles(appDir).filter(f => !f.includes('node_modules'));

console.log(`📁 Scanning ${componentFiles.length + appFiles.length} files...\n`);

// Extract text from components
[...componentFiles, ...appFiles].forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Skip if already using i18n
    if (content.includes('useI18n') || content.includes('t(')) {
      return;
    }
    
    extractText(content);
  } catch (error) {
    // Skip files that can't be read
  }
});

// Output results
console.log('📝 Found static text that may need translation:\n');
const sortedTexts = Array.from(staticTexts).sort();

sortedTexts.forEach((text, index) => {
  console.log(`${index + 1}. "${text}"`);
});

console.log(`\n✅ Found ${sortedTexts.length} unique text strings`);
console.log('\n💡 Next steps:');
console.log('1. Review these texts and add to en.json');
console.log('2. Use translation script or manual translation');
console.log('3. Update components to use t() hook');

