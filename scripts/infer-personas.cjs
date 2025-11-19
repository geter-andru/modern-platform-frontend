#!/usr/bin/env node

/**
 * Infer Persona from Title
 *
 * Systematically extract persona from title for scenarios with empty persona field
 * Pattern: "Persona Title Doing Action" → Extract "Persona Title"
 */

const fs = require('fs');
const path = require('path');

const SCENARIOS_PATH = path.join(__dirname, '../data/scenarios.json');

// Common action verbs that typically start the second part of titles
const ACTION_VERBS = [
  'Preventing', 'Avoiding', 'Eliminating', 'Building', 'Shipping', 'Implementing',
  'Debugging', 'Deploying', 'Triaging', 'Managing', 'Handling', 'Optimizing',
  'Accelerating', 'Accessing', 'Preparing', 'Unlocking', 'Maintaining',
  'Enforcing', 'Responding', 'Achieving', 'Reducing', 'Automating',
  'Validating', 'Serving', 'Running', 'Generating', 'Monitoring',
  'Adding', 'Closing'  // Additional verbs found in edge cases
];

function extractPersonaFromTitle(title) {
  // Try to find the first action verb
  for (const verb of ACTION_VERBS) {
    const index = title.indexOf(verb);
    if (index > 0) {
      // Extract everything before the verb and trim
      return title.substring(0, index).trim();
    }
  }

  // Fallback: If no verb found, return first 3-4 words
  const words = title.split(' ');
  if (words.length >= 3) {
    // Check if last word before verb looks like a title (capitalized)
    return words.slice(0, 3).join(' ');
  }

  return title; // Last resort
}

function main() {
  console.log('🔍 Loading scenarios.json...\n');

  const scenarios = JSON.parse(fs.readFileSync(SCENARIOS_PATH, 'utf8'));

  let updated = 0;
  const updates = [];

  scenarios.forEach((scenario, index) => {
    if (scenario.persona === '') {
      const inferredPersona = extractPersonaFromTitle(scenario.title);

      updates.push({
        index: index + 1,
        slug: scenario.slug,
        title: scenario.title,
        oldPersona: '(empty)',
        newPersona: inferredPersona
      });

      scenario.persona = inferredPersona;
      updated++;
    }
  });

  // Show preview
  console.log('📋 Inferred Personas:\n');
  console.log('─'.repeat(80));
  updates.slice(0, 10).forEach(u => {
    console.log(`${u.index}. ${u.slug}`);
    console.log(`   Title: "${u.title}"`);
    console.log(`   Persona: "${u.newPersona}"\n`);
  });

  if (updates.length > 10) {
    console.log(`... and ${updates.length - 10} more\n`);
  }
  console.log('─'.repeat(80));

  console.log(`\n✅ Updated ${updated} personas\n`);

  // Ask for confirmation
  console.log('⚠️  Review the personas above. If they look correct, run:');
  console.log('   node scripts/apply-persona-updates.cjs\n');

  // Write to temp file for review
  const outputPath = '/tmp/persona_updates.json';
  fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2));
  console.log(`📄 Full list saved to: ${outputPath}\n`);

  // Write updated scenarios to temp file (not overwriting original yet)
  const tempScenariosPath = '/tmp/scenarios_with_personas.json';
  fs.writeFileSync(tempScenariosPath, JSON.stringify(scenarios, null, 2));
  console.log(`📄 Updated scenarios saved to: ${tempScenariosPath}`);
  console.log('   Review this file before applying!\n');
}

main();
