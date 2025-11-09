#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking SignEX for common errors...\n');

const errors = [];
const warnings = [];

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  errors.push('❌ package.json not found - run this in the project root');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  warnings.push('⚠️  node_modules not found - run: npm install');
}

// Check if .env.local exists (optional)
if (!fs.existsSync('.env.local')) {
  warnings.push('⚠️  .env.local not found - create it for environment variables');
}

// Check for missing icon files
const iconPath = 'public/icons';
if (fs.existsSync(iconPath)) {
  const icons = fs.readdirSync(iconPath);
  const requiredIcons = ['logo.svg', 'signex_logo.png'];
  
  requiredIcons.forEach(icon => {
    if (!icons.includes(icon)) {
      warnings.push(`⚠️  Missing icon: ${icon}`);
    }
  });
} else {
  errors.push('❌ public/icons directory not found');
}

// Check Next.js config
if (!fs.existsSync('next.config.mjs')) {
  errors.push('❌ next.config.mjs not found');
}

// Check app directory structure
const appDir = 'app';
if (!fs.existsSync(appDir)) {
  errors.push('❌ app directory not found');
} else {
  const requiredFiles = ['layout.tsx', 'globals.css'];
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(appDir, file))) {
      errors.push(`❌ Missing required file: app/${file}`);
    }
  });
}

// Check for TypeScript errors
console.log('📝 Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  console.log('✅ TypeScript config found');
} else {
  warnings.push('⚠️  tsconfig.json not found');
}

// Display results
console.log('📊 Error Check Results:');
console.log('========================\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ No errors found! Your project looks good.');
} else {
  if (errors.length > 0) {
    console.log('🚨 ERRORS (must fix):');
    errors.forEach(error => console.log(`   ${error}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (should fix):');
    warnings.forEach(warning => console.log(`   ${warning}`));
    console.log('');
  }
}

// Provide solutions
if (errors.length > 0) {
  console.log('🔧 Quick Fixes:');
  console.log('   1. Make sure you\'re in the project root directory');
  console.log('   2. Run: npm install');
  console.log('   3. Check if all files are present');
  console.log('   4. Try: npm run dev (local first)');
} else {
  console.log('🚀 Ready to start server!');
  console.log('   Run: npm run server');
  console.log('   Or: npm run dev:network');
}

console.log('\n📱 Network Access:');
console.log('   After starting server, access from other devices using:');
console.log('   http://YOUR_IP_ADDRESS:3000');
console.log('   (Run "npm run ip" to find your IP address)');
