#!/usr/bin/env node

/**
 * H&S Platform Git Hooks Installer
 * Installs centralized validation hooks in both Next.js apps
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const HS_APPS = [
  '/Users/geter/andru/andru-assessment',
  '/Users/geter/andru/hs-andru-test'
];

function installPreCommitHook(appPath) {
  const hooksDir = path.join(appPath, '.git/hooks');
  
  if (!fs.existsSync(hooksDir)) {
    console.log(`❌ Git hooks directory not found: ${appPath}`);
    return false;
  }

  const preCommitHook = `#!/bin/sh
# H&S Platform Centralized Validation Hook
# Prevents customer-facing platform failures

echo "🎯 H&S Platform Validation Pipeline Starting..."

# Run centralized orchestrator
cd "${appPath}"
node /Users/geter/andru/validation-agents/index.js

# Business rule: Any failure blocks commit to protect customer platform
if [ $? -ne 0 ]; then
  echo "❌ BUSINESS CRITICAL: H&S Platform validation failed"
  echo "🛡️ Customer platform protection activated - commit blocked"
  exit 1
fi

echo "✅ H&S Platform validation passed - commit approved"
exit 0
`;

  const preCommitPath = path.join(hooksDir, 'pre-commit');
  try {
    fs.writeFileSync(preCommitPath, preCommitHook);
    fs.chmodSync(preCommitPath, '755');
    return true;
  } catch (error) {
    console.log(`❌ Failed to install pre-commit hook: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🔧 Installing H&S Platform Validation Hooks\n');
  
  let successCount = 0;
  
  HS_APPS.forEach(appPath => {
    const appName = path.basename(appPath);
    console.log(`Installing hooks for: ${appName}`);
    
    if (installPreCommitHook(appPath)) {
      console.log(`✅ ${appName}: Pre-commit hook installed`);
      successCount++;
    } else {
      console.log(`❌ ${appName}: Hook installation failed`);
    }
  });

  console.log('\n' + '='.repeat(50));
  
  if (successCount === HS_APPS.length) {
    console.log('✅ ALL HOOKS INSTALLED SUCCESSFULLY');
    console.log('🛡️ Customer platform protection: ACTIVE');
    console.log('\nNext commits will run centralized validation pipeline');
  } else {
    console.log('❌ SOME HOOKS FAILED TO INSTALL');
    console.log('⚠️  Customer platform protection: INCOMPLETE');
  }
  
  console.log('='.repeat(50));
}

if (require.main === module) {
  main();
}

module.exports = { installPreCommitHook };