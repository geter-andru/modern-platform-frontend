#!/usr/bin/env node

/**
 * Fix Duplicate Slugs
 * - crustdata (appears twice - both identical, remove one)
 * - thoropass (appears twice - different scenarios, rename second one)
 */

const fs = require('fs');
const path = require('path');

const SCENARIOS_PATH = path.join(__dirname, '../data/scenarios.json');

function main() {
  console.log('🔍 Loading scenarios.json...\n');

  const scenarios = JSON.parse(fs.readFileSync(SCENARIOS_PATH, 'utf8'));

  let crustdataCount = 0;
  let thoropassCount = 0;
  let removedCrustdata = false;

  const fixed = scenarios.filter((scenario, index) => {
    // Handle crustdata duplicates (both are identical, keep only first)
    if (scenario.slug === 'crustdata') {
      crustdataCount++;
      if (crustdataCount === 2) {
        console.log(`❌ Removing duplicate crustdata at index ${index + 1}`);
        removedCrustdata = true;
        return false; // Remove the duplicate
      }
    }

    // Handle thoropass duplicates (different scenarios, rename second)
    if (scenario.slug === 'thoropass') {
      thoropassCount++;
      if (thoropassCount === 2) {
        console.log(`🔧 Renaming second thoropass to "thoropass-yc" at index ${index + 1}`);
        console.log(`   Title: "${scenario.title}"`);
        console.log(`   Persona: "${scenario.persona}"\n`);
        scenario.slug = 'thoropass-yc';
      }
    }

    return true; // Keep this scenario
  });

  console.log(`\n✅ Fixed ${removedCrustdata ? '1' : '0'} duplicate + ${thoropassCount > 1 ? '1' : '0'} renamed\n`);
  console.log(`Total scenarios: ${scenarios.length} → ${fixed.length}\n`);

  // Write fixed scenarios
  fs.writeFileSync(SCENARIOS_PATH, JSON.stringify(fixed, null, 2));
  console.log(`📄 Updated scenarios.json\n`);
}

main();
