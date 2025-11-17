#!/usr/bin/env node

/**
 * Scenario Validation Script
 *
 * Purpose: Ensure scenarios.json integrity before deployment
 * Use Case: Validate after adding/editing scenario data to prevent runtime errors
 *
 * Run: node scripts/validate-scenarios.js
 */

const fs = require('fs');
const path = require('path');

const SCENARIOS_PATH = path.join(__dirname, '../data/scenarios.json');
const MODAL_DATA_PATH = path.join(__dirname, '../data/scenario-modal-data.json');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

let errors = [];
let warnings = [];
let validationsPassed = 0;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  errors.push(message);
  log(`❌ ERROR: ${message}`, 'red');
}

function warning(message) {
  warnings.push(message);
  log(`⚠️  WARNING: ${message}`, 'yellow');
}

function success(message) {
  validationsPassed++;
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Validation Rules
const REQUIRED_FIELDS = ['company', 'slug', 'title', 'persona', 'scenario', 'worstCase', 'timestamps'];
const TIMESTAMP_FIELDS = ['time', 'narrative'];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // kebab-case only
const RESERVED_SLUGS = ['demo-v2', 'overview', 'demo', 'test'];

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to parse JSON at ${filePath}: ${err.message}`);
    return null;
  }
}

function validateScenarioStructure(scenario, index) {
  const scenarioLabel = `Scenario #${index + 1} (${scenario.slug || 'unknown'})`;

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!scenario[field]) {
      error(`${scenarioLabel}: Missing required field "${field}"`);
    }
  }

  // Validate slug format
  if (scenario.slug) {
    if (!SLUG_REGEX.test(scenario.slug)) {
      error(`${scenarioLabel}: Invalid slug format. Use kebab-case only (lowercase, hyphens, no special chars)`);
    }

    if (RESERVED_SLUGS.includes(scenario.slug)) {
      error(`${scenarioLabel}: Slug "${scenario.slug}" is reserved and cannot be used`);
    }

    if (scenario.slug.length > 50) {
      warning(`${scenarioLabel}: Slug is very long (${scenario.slug.length} chars). Consider shortening.`);
    }
  }

  // Validate timestamps
  if (Array.isArray(scenario.timestamps)) {
    if (scenario.timestamps.length === 0) {
      error(`${scenarioLabel}: Timestamps array is empty`);
    }

    scenario.timestamps.forEach((timestamp, tIndex) => {
      for (const field of TIMESTAMP_FIELDS) {
        if (!timestamp[field]) {
          error(`${scenarioLabel}, Timestamp #${tIndex + 1}: Missing required field "${field}"`);
        }
      }

      // Check for HTML injection safety
      if (timestamp.narrative && timestamp.narrative.includes('<script')) {
        error(`${scenarioLabel}, Timestamp #${tIndex + 1}: Potentially unsafe <script> tag detected in narrative`);
      }
    });
  } else {
    error(`${scenarioLabel}: "timestamps" must be an array`);
  }

  // Validate string lengths (UX considerations)
  if (scenario.title && scenario.title.length > 100) {
    warning(`${scenarioLabel}: Title is very long (${scenario.title.length} chars). May not display well on mobile.`);
  }

  if (scenario.company && scenario.company.length > 30) {
    warning(`${scenarioLabel}: Company name is very long (${scenario.company.length} chars).`);
  }
}

function validateUniquenesss(scenarios) {
  const slugs = new Map();
  const companies = new Map();

  scenarios.forEach((scenario, index) => {
    // Check duplicate slugs
    if (scenario.slug) {
      if (slugs.has(scenario.slug)) {
        error(`Duplicate slug "${scenario.slug}" found in scenarios #${slugs.get(scenario.slug) + 1} and #${index + 1}`);
      } else {
        slugs.set(scenario.slug, index);
      }
    }

    // Warn about duplicate companies (might be intentional)
    if (scenario.company) {
      if (companies.has(scenario.company)) {
        warning(`Duplicate company "${scenario.company}" found in scenarios #${companies.get(scenario.company) + 1} and #${index + 1}. Is this intentional?`);
      } else {
        companies.set(scenario.company, index);
      }
    }
  });

  success(`Checked ${slugs.size} unique slugs`);
}

function validateModalData(scenarios, modalData) {
  const scenarioSlugs = new Set(scenarios.map(s => s.slug));
  const modalSlugs = new Set(modalData.map(m => m.slug));

  // Check for missing modal data
  scenarioSlugs.forEach(slug => {
    if (!modalSlugs.has(slug)) {
      warning(`Scenario "${slug}" has no corresponding modal data in scenario-modal-data.json`);
    }
  });

  // Check for orphaned modal data
  modalSlugs.forEach(slug => {
    if (!scenarioSlugs.has(slug)) {
      warning(`Modal data for "${slug}" exists but no matching scenario found`);
    }
  });

  // Validate modal data structure
  modalData.forEach((modal, index) => {
    if (!modal.slug) {
      error(`Modal data #${index + 1}: Missing "slug" field`);
    }
    if (!modal.personaRole) {
      error(`Modal data #${index + 1} (${modal.slug || 'unknown'}): Missing "personaRole" field`);
    }
    if (!modal.triggeringMoment) {
      error(`Modal data #${index + 1} (${modal.slug || 'unknown'}): Missing "triggeringMoment" field`);
    }
  });

  success(`Validated modal data integrity`);
}

function generateRoutingPreview(scenarios) {
  info('\n📋 Generated Routes Preview:');
  console.log('─'.repeat(60));
  scenarios.forEach(scenario => {
    console.log(`  /icp/${scenario.slug} → ${scenario.company}`);
  });
  console.log('─'.repeat(60));
  info(`Total: ${scenarios.length} routes\n`);
}

function main() {
  log('\n🔍 Starting ICP Scenario Validation...\n', 'blue');

  // 1. Load and parse scenarios.json
  info('Step 1: Loading scenarios.json...');
  const scenarios = validateJSON(SCENARIOS_PATH);
  if (!scenarios) {
    log('\n❌ Validation FAILED: Cannot proceed without valid scenarios.json\n', 'red');
    process.exit(1);
  }
  success(`Loaded ${scenarios.length} scenarios`);

  // 2. Load and parse modal data
  info('\nStep 2: Loading scenario-modal-data.json...');
  const modalData = validateJSON(MODAL_DATA_PATH);
  if (!modalData) {
    warning('scenario-modal-data.json could not be loaded. Modal validations will be skipped.');
  } else {
    success(`Loaded ${modalData.length} modal entries`);
  }

  // 3. Validate each scenario
  info('\nStep 3: Validating scenario structures...');
  scenarios.forEach((scenario, index) => validateScenarioStructure(scenario, index));

  // 4. Check for duplicates
  info('\nStep 4: Checking for duplicate slugs and companies...');
  validateUniquenesss(scenarios);

  // 5. Validate modal data alignment
  if (modalData) {
    info('\nStep 5: Validating modal data alignment...');
    validateModalData(scenarios, modalData);
  }

  // 6. Generate route preview
  generateRoutingPreview(scenarios);

  // Final Report
  log('\n' + '═'.repeat(60), 'magenta');
  log('  VALIDATION REPORT', 'magenta');
  log('═'.repeat(60), 'magenta');

  if (errors.length === 0 && warnings.length === 0) {
    log(`\n✨ ALL CHECKS PASSED! (${validationsPassed} validations)`, 'green');
    log('\n✅ scenarios.json is ready for deployment\n', 'green');
    process.exit(0);
  } else {
    if (errors.length > 0) {
      log(`\n❌ ${errors.length} ERROR(S) FOUND:`, 'red');
      errors.forEach(err => log(`   • ${err}`, 'red'));
    }

    if (warnings.length > 0) {
      log(`\n⚠️  ${warnings.length} WARNING(S):`, 'yellow');
      warnings.forEach(warn => log(`   • ${warn}`, 'yellow'));
    }

    log(`\n${validationsPassed} validations passed\n`, 'cyan');

    if (errors.length > 0) {
      log('❌ Validation FAILED. Fix errors before deploying.\n', 'red');
      process.exit(1);
    } else {
      log('⚠️  Validation passed with warnings. Review before deploying.\n', 'yellow');
      process.exit(0);
    }
  }
}

// Run validation
main();
