#!/usr/bin/env node

/**
 * Infer Persona from Scenario Text (v2 - More Accurate)
 *
 * Extract persona from the scenario opening which follows pattern:
 * "Name (Job Title, MBTI) at/from..."
 */

const fs = require('fs');
const path = require('path');

const SCENARIOS_PATH = path.join(__dirname, '../data/scenarios.json');

function extractPersonaFromScenario(scenario) {
  // Pattern: "Name (Job Title, MBTI)" or "Name (Job Title & Other Title, MBTI)"
  // Example: "Marcus (VP Engineering, ENTJ)"
  // Example: "Rachel (Co-Founder & CEO, ENTJ)"

  const match = scenario.match(/\(([^,]+),\s*[A-Z]{4}\)/);

  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

function main() {
  console.log('🔍 Loading scenarios.json...\n');

  const scenarios = JSON.parse(fs.readFileSync(SCENARIOS_PATH, 'utf8'));

  let updated = 0;
  let failed = [];
  const updates = [];

  scenarios.forEach((scenario, index) => {
    if (scenario.persona === '') {
      const inferredPersona = extractPersonaFromScenario(scenario.scenario);

      if (inferredPersona) {
        updates.push({
          index: index + 1,
          slug: scenario.slug,
          title: scenario.title,
          oldPersona: '(empty)',
          newPersona: inferredPersona,
          source: 'scenario_text'
        });

        scenario.persona = inferredPersona;
        updated++;
      } else {
        // Fallback: try to extract from title
        failed.push({
          index: index + 1,
          slug: scenario.slug,
          title: scenario.title,
          scenarioStart: scenario.scenario.substring(0, 150)
        });
      }
    }
  });

  // Show preview
  console.log('📋 Inferred Personas (from scenario text):\n');
  console.log('─'.repeat(80));
  updates.slice(0, 15).forEach(u => {
    console.log(`${u.index}. ${u.slug}`);
    console.log(`   Persona: "${u.newPersona}"\n`);
  });

  if (updates.length > 15) {
    console.log(`... and ${updates.length - 15} more\n`);
  }
  console.log('─'.repeat(80));

  console.log(`\n✅ Extracted ${updated} personas from scenario text\n`);

  if (failed.length > 0) {
    console.log(`⚠️  ${failed.length} scenarios couldn't be parsed:\n`);
    failed.forEach(f => {
      console.log(`   ${f.index}. ${f.slug}`);
      console.log(`      Scenario: "${f.scenarioStart}..."\n`);
    });
  }

  // Write outputs
  const outputPath = '/tmp/persona_updates_v2.json';
  fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2));
  console.log(`📄 Full list saved to: ${outputPath}\n`);

  const failedPath = '/tmp/persona_failures.json';
  if (failed.length > 0) {
    fs.writeFileSync(failedPath, JSON.stringify(failed, null, 2));
    console.log(`📄 Failed extractions saved to: ${failedPath}\n`);
  }

  const tempScenariosPath = '/tmp/scenarios_with_personas_v2.json';
  fs.writeFileSync(tempScenariosPath, JSON.stringify(scenarios, null, 2));
  console.log(`📄 Updated scenarios saved to: ${tempScenariosPath}\n`);
}

main();
