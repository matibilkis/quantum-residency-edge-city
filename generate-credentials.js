#!/usr/bin/env node

/**
 * Credential Generator for Quredge Landing Page
 * 
 * This script helps you generate secure credentials for deployment
 */

const crypto = require('crypto');

console.log('\n🔐 CREDENTIAL GENERATOR FOR QUREDGE DEPLOYMENT\n');
console.log('=' .repeat(60));

// Generate session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('\n📝 COPY THESE TO YOUR HOSTING PLATFORM:\n');
console.log('Environment Variables to Set:');
console.log('-'.repeat(60));

console.log('\n# Required Environment Variables');
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log('NODE_ENV=production');
console.log('\n# Admin Credentials (CHANGE THESE!)');
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=CHANGE_THIS_TO_SECURE_PASSWORD');
console.log('\n# Viewer Credentials (Optional - for co-organizers)');
console.log('VIEWER_USERNAME=coorganizer');
console.log('VIEWER_PASSWORD=CHANGE_THIS_TO_VIEWER_PASSWORD');

console.log('\n' + '-'.repeat(60));
console.log('\n⚠️  IMPORTANT NOTES:\n');
console.log('1. SESSION_SECRET has been randomly generated ✅');
console.log('2. You MUST change the ADMIN_PASSWORD and VIEWER_PASSWORD');
console.log('3. Use strong passwords:');
console.log('   - Admin: 16+ characters, mixed case, numbers, symbols');
console.log('   - Viewer: 12+ characters, mixed case, numbers, symbols');
console.log('\n4. Example strong passwords:');
console.log('   - Admin: Qr$7mK9#nP2wXz5L!aB8vD4');
console.log('   - Viewer: V!ew3r#2026$QurEdge\n');

console.log('5. NEVER commit these to Git!');
console.log('6. Set them in your hosting platform dashboard\n');

console.log('=' .repeat(60));
console.log('\n✅ Copy the environment variables above to your deployment platform\n');

// Also generate example strong passwords
console.log('💡 BONUS: Here are some randomly generated strong passwords:\n');

function generateStrongPassword(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  const array = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

console.log(`Suggested Admin Password: ${generateStrongPassword(20)}`);
console.log(`Suggested Viewer Password: ${generateStrongPassword(16)}`);

console.log('\n' + '='.repeat(60) + '\n');
console.log('📋 Next Steps:');
console.log('1. Copy SESSION_SECRET above');
console.log('2. Use one of the generated passwords or create your own');
console.log('3. Set all variables in your hosting platform');
console.log('4. Deploy!');
console.log('\n🚀 See DEPLOYMENT_CHECKLIST.md for complete deployment guide\n');

