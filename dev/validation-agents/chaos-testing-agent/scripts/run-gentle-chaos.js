#!/usr/bin/env node

const NextJSChaosTestingAgent = require('../src/index');

async function runGentleChaosTest() {
  const agent = new NextJSChaosTestingAgent();
  
  try {
    console.log('Starting Gentle Chaos Testing for Next.js Platform...\n');
    
    const result = await agent.runGentleChaosTest();
    
    console.log('\n' + '='.repeat(60));
    console.log('GENTLE CHAOS TESTING COMPLETE');
    console.log('='.repeat(60));
    
    process.exit(0);
    
  } catch (error) {
    console.error('Gentle chaos testing failed:', error.message);
    process.exit(1);
  }
}

runGentleChaosTest();