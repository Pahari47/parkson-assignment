#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment configuration...\n');

const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to overwrite it, delete the existing .env file and run this script again.\n');
  process.exit(0);
}

// Check if env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.example file not found!');
  console.log('   Please make sure env.example exists in the frontend directory.\n');
  process.exit(1);
}

try {
  // Copy env.example to .env
  fs.copyFileSync(envExamplePath, envPath);
  
  console.log('✅ .env file created successfully!');
  console.log('📝 You can now edit the .env file to configure your environment.\n');
  
  console.log('📋 Current configuration:');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(envContent);
  
  console.log('\n🎯 Next steps:');
  console.log('   1. Edit .env file if needed');
  console.log('   2. Start the backend server');
  console.log('   3. Run: npm run dev');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 