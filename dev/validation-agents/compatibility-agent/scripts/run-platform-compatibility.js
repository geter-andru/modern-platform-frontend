#!/usr/bin/env node

require('dotenv').config({ path: '../../../.env.local' });

const NextJSCompatibilityAgent = require('../src/index');

async function runCompatibilityValidation() {
  const agent = new NextJSCompatibilityAgent();
  
  try {
    console.log('Starting Next.js Platform Compatibility Validation...\n');
    
    const result = await agent.runFullCompatibilityValidation();
    
    console.log('\n' + '='.repeat(60));
    console.log('COMPATIBILITY VALIDATION COMPLETE');
    console.log('='.repeat(60));
    
    process.exit(result.overallScore >= 90 ? 0 : 1);
    
  } catch (error) {
    console.error('Compatibility validation failed:', error.message);
    process.exit(1);
  }
}

runCompatibilityValidation();