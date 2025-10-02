#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * CRITICAL MIGRATION TOOL: Dependency Analysis
 * 
 * This tool MUST be run before any feature migration to identify ALL dependencies
 * that must be preserved during the migration process.
 */

function getAllFilesRecursively(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFilesRecursively(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function analyzeFeatureDependencies(featurePath) {
  console.log(`\n🔍 ANALYZING DEPENDENCIES FOR: ${featurePath}`);
  console.log('=' .repeat(60));
  
  if (!fs.existsSync(featurePath)) {
    console.error(`❌ ERROR: Feature path does not exist: ${featurePath}`);
    return null;
  }
  
  const dependencies = {
    imports: new Set(),
    contexts: new Set(),
    services: new Set(),
    webhooks: new Set(),
    integrations: new Set(),
    hooks: new Set(),
    components: new Set(),
    apis: new Set()
  };
  
  const files = getAllFilesRecursively(featurePath);
  console.log(`📁 Found ${files.length} TypeScript files to analyze\n`);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Extract all imports
    const importMatches = content.match(/import.*from\s+['"\`]([^'"\`]+)['"\`]/g);
    if (importMatches) {
      importMatches.forEach(imp => {
        const importPath = imp.match(/['"\`]([^'"\`]+)['"\`]/)[1];
        dependencies.imports.add(`${importPath} (from ${relativePath})`);
      });
    }
    
    // Extract context usage
    const contextMatches = content.match(/(use\w*Context\(|createContext\(|\w+Context\.Provider|\w+Context)/g);
    if (contextMatches) {
      contextMatches.forEach(ctx => {
        dependencies.contexts.add(`${ctx} (in ${relativePath})`);
      });
    }
    
    // Extract service calls
    const serviceMatches = content.match(/(\w+Service\.|makecom\.|airtable\.|supabase\.|resourceGeneration|webResearch)/gi);
    if (serviceMatches) {
      serviceMatches.forEach(service => {
        dependencies.services.add(`${service} (in ${relativePath})`);
      });
    }
    
    // Extract webhook references
    const webhookMatches = content.match(/(webhook|make\.com|scenario|automation)/gi);
    if (webhookMatches) {
      webhookMatches.forEach(webhook => {
        dependencies.webhooks.add(`${webhook} (in ${relativePath})`);
      });
    }
    
    // Extract API calls
    const apiMatches = content.match(/(fetch\(|axios\.|api\.|client\.|\w+API)/gi);
    if (apiMatches) {
      apiMatches.forEach(api => {
        dependencies.apis.add(`${api} (in ${relativePath})`);
      });
    }
    
    // Extract custom hooks
    const hookMatches = content.match(/use[A-Z]\w+/g);
    if (hookMatches) {
      hookMatches.forEach(hook => {
        dependencies.hooks.add(`${hook} (in ${relativePath})`);
      });
    }
    
    // Extract integrations
    const integrationMatches = content.match(/(MCP|eventBus|eventManager|localStorage|sessionStorage)/gi);
    if (integrationMatches) {
      integrationMatches.forEach(integration => {
        dependencies.integrations.add(`${integration} (in ${relativePath})`);
      });
    }
  });
  
  // Display results
  console.log('🚨 CRITICAL DEPENDENCIES THAT MUST BE PRESERVED:');
  console.log('-'.repeat(50));
  
  console.log(`\n📦 IMPORTS (${dependencies.imports.size} total):`);
  if (dependencies.imports.size > 0) {
    Array.from(dependencies.imports).slice(0, 10).forEach(imp => {
      console.log(`   • ${imp}`);
    });
    if (dependencies.imports.size > 10) {
      console.log(`   ... and ${dependencies.imports.size - 10} more`);
    }
  } else {
    console.log('   ✓ No imports found');
  }
  
  console.log(`\n🔗 CONTEXTS (${dependencies.contexts.size} total):`);
  if (dependencies.contexts.size > 0) {
    Array.from(dependencies.contexts).forEach(ctx => {
      console.log(`   ⚠️  ${ctx}`);
    });
  } else {
    console.log('   ✓ No context usage found');
  }
  
  console.log(`\n⚙️  SERVICES (${dependencies.services.size} total):`);
  if (dependencies.services.size > 0) {
    Array.from(dependencies.services).forEach(service => {
      console.log(`   ⚠️  ${service}`);
    });
  } else {
    console.log('   ✓ No service calls found');
  }
  
  console.log(`\n🔌 WEBHOOKS (${dependencies.webhooks.size} total):`);
  if (dependencies.webhooks.size > 0) {
    Array.from(dependencies.webhooks).forEach(webhook => {
      console.log(`   ⚠️  ${webhook}`);
    });
  } else {
    console.log('   ✓ No webhook usage found');
  }
  
  console.log(`\n🔧 CUSTOM HOOKS (${dependencies.hooks.size} total):`);
  if (dependencies.hooks.size > 0) {
    Array.from(dependencies.hooks).slice(0, 10).forEach(hook => {
      console.log(`   • ${hook}`);
    });
    if (dependencies.hooks.size > 10) {
      console.log(`   ... and ${dependencies.hooks.size - 10} more`);
    }
  } else {
    console.log('   ✓ No custom hooks found');
  }
  
  console.log(`\n🌐 API CALLS (${dependencies.apis.size} total):`);
  if (dependencies.apis.size > 0) {
    Array.from(dependencies.apis).slice(0, 10).forEach(api => {
      console.log(`   • ${api}`);
    });
    if (dependencies.apis.size > 10) {
      console.log(`   ... and ${dependencies.apis.size - 10} more`);
    }
  } else {
    console.log('   ✓ No API calls found');
  }
  
  console.log(`\n🔌 INTEGRATIONS (${dependencies.integrations.size} total):`);
  if (dependencies.integrations.size > 0) {
    Array.from(dependencies.integrations).forEach(integration => {
      console.log(`   ⚠️  ${integration}`);
    });
  } else {
    console.log('   ✓ No integrations found');
  }
  
  const totalDependencies = dependencies.imports.size + dependencies.contexts.size + 
    dependencies.services.size + dependencies.webhooks.size + dependencies.integrations.size;
  
  console.log('\n' + '='.repeat(60));
  console.log(`🚨 TOTAL CRITICAL DEPENDENCIES: ${totalDependencies}`);
  console.log('⚠️  WARNING: ALL of these MUST be preserved during migration');
  console.log('❌ FORBIDDEN: Creating simplified versions or removing any dependencies');
  console.log('✅ REQUIRED: Move code exactly as-is and update import paths only');
  console.log('='.repeat(60));
  
  return dependencies;
}

// Main execution
if (require.main === module) {
  const featureName = process.argv[2];
  
  if (!featureName) {
    console.error('❌ ERROR: Please provide a feature name');
    console.log('\nUsage: node tools/analyzers/dependency-mapper.js <feature-path>');
    console.log('\nExamples:');
    console.log('  node tools/analyzers/dependency-mapper.js app/components/icp');
    console.log('  node tools/analyzers/dependency-mapper.js app/components/resources');
    console.log('  node tools/analyzers/dependency-mapper.js app/components/dashboard');
    process.exit(1);
  }
  
  const analysis = analyzeFeatureDependencies(featureName);
  
  if (analysis) {
    // Save analysis results
    const outputPath = `tools/migration-reports/${featureName.replace(/[/\\]/g, '_')}_dependencies.json`;
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const report = {
      featurePath: featureName,
      analyzedAt: new Date().toISOString(),
      dependencies: {
        imports: Array.from(analysis.imports),
        contexts: Array.from(analysis.contexts),
        services: Array.from(analysis.services),
        webhooks: Array.from(analysis.webhooks),
        integrations: Array.from(analysis.integrations),
        hooks: Array.from(analysis.hooks),
        apis: Array.from(analysis.apis)
      },
      totalDependencies: analysis.imports.size + analysis.contexts.size + 
        analysis.services.size + analysis.webhooks.size + analysis.integrations.size,
      migrationWarnings: [
        'ALL dependencies must be preserved exactly',
        'NO simplification allowed',
        'Update import paths only',
        'Verify functionality remains identical'
      ]
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Analysis saved to: ${outputPath}`);
  }
}

module.exports = { analyzeFeatureDependencies, getAllFilesRecursively };