#!/usr/bin/env node

/**
 * Generate Admin Password Hash
 * 
 * This script generates a bcrypt hash for your admin password
 * to use in the ADMIN_PASSWORD_HASH environment variable
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=================================');
console.log('Admin Password Hash Generator');
console.log('=================================\n');

rl.question('Enter your desired admin password: ', (password) => {
  if (!password || password.length < 6) {
    console.error('\n❌ Password must be at least 6 characters long\n');
    rl.close();
    process.exit(1);
  }

  const hash = bcrypt.hashSync(password, 10);
  
  console.log('\n✅ Password hash generated successfully!\n');
  console.log('Add this to your .env.local file:');
  console.log('----------------------------------------');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('----------------------------------------');
  
  console.log('\nAnd add to Vercel environment variables:');
  console.log('----------------------------------------');
  console.log('Variable Name: ADMIN_PASSWORD_HASH');
  console.log(`Value: ${hash}`);
  console.log('----------------------------------------');
  
  console.log('\nAdmin Login Details:');
  console.log('Username: admin (default)');
  console.log('Password: [the password you just entered]');
  console.log('');
  
  rl.close();
});
