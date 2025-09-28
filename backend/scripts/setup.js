#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up TaleWeaver AI Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your actual values.\n');
  } else {
    console.log('❌ env.example file not found. Please create a .env file manually.\n');
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.log('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Prisma client generated successfully.\n');
} catch (error) {
  console.log('❌ Failed to generate Prisma client:', error.message);
  console.log('Please make sure your DATABASE_URL is correct in .env file.\n');
}

console.log('🎉 Setup completed!');
console.log('\nNext steps:');
console.log('1. Update your .env file with actual values');
console.log('2. Set up your PostgreSQL database');
console.log('3. Run: npm run db:push (to create database tables)');
console.log('4. Run: npm run dev (to start the development server)');
console.log('\n📚 For more information, see README.md');
