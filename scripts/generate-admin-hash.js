#!/usr/bin/env node

const bcrypt = require('bcryptjs');

console.log('Admin Password Hash Generator');
console.log('============================\n');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/generate-admin-hash.js <password>');
  console.log('Example: node scripts/generate-admin-hash.js mySecurePassword123');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('Your password hash:');
console.log(hash);
console.log('\nAdd this to your .env.local file:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
