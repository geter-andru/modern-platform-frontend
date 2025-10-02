#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { analyzeFeatureDependencies, getAllFilesRecursively } = require('../analyzers/dependency-mapper');

/**
 * PRESERVATION-FIRST MIGRATION TOOL
 * 
 * SUCCESS CRITERIA:
 * ✅ Original feature has N imports → Migrated feature has N imports
 * ✅ Original functionality works → Migrated functionality works identically
 * ✅ All services/contexts/integrations preserved exactly
 * 
 * FAILURE CRITERIA:
 * ❌ Any import count reduction
 * ❌ Any service disconnection
 * ❌ Any functional simplification
 * ❌ Any "improvement" that changes behavior
 */

function preservationMigrate(sourcePath, targetPath, featureName) {
  console.log(`\n🔄 Starting PRESERVATION migration of ${featureName}`);
  console.log('=' .repeat(60));
  console.log(`📍 Source: ${sourcePath}`);
  console.log(`📍 Target: ${targetPath}`);
  
  // STEP 1: Dependency Analysis (MANDATORY)
  console.log('\n🔍 STEP 1: Analyzing dependencies...');
  const dependencies = analyzeFeatureDependencies(sourcePath);
  
  if (!dependencies || dependencies.imports.size === 0) {
    console.error('❌ CRITICAL: No dependencies found - analysis failed');
    console.error('🚨 This suggests the feature is not properly analyzed');
    process.exit(1);
  }
  
  const originalImportCount = dependencies.imports.size;
  console.log(`✅ Found ${originalImportCount} dependencies to preserve`);
  
  // STEP 2: Copy Files Exactly (NO MODIFICATIONS)
  console.log('\n📁 STEP 2: Copying files exactly as-is...');
  if (fs.existsSync(targetPath)) {
    console.log('⚠️  Target exists, removing old version...');
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
  
  fs.mkdirSync(targetPath, { recursive: true });
  copyDirectoryPreserveAll(sourcePath, targetPath);
  
  console.log(`✅ Files copied: ${getAllFilesRecursively(targetPath).length} files`);
  
  // STEP 3: Verify Dependencies Are Intact
  console.log('\n🔍 STEP 3: Verifying dependencies are intact...');
  const targetDependencies = analyzeFeatureDependencies(targetPath);
  
  if (!targetDependencies || targetDependencies.imports.size !== originalImportCount) {
    console.error('❌ CRITICAL: Dependencies lost during migration');
    console.error(`📉 Original: ${originalImportCount}, After: ${targetDependencies ? targetDependencies.imports.size : 0}`);
    process.exit(1);
  }
  
  console.log(`✅ Dependencies preserved: ${targetDependencies.imports.size}/${originalImportCount}`);
  
  // STEP 4: Update Import Paths Only (NO OTHER CHANGES)
  console.log('\n🔧 STEP 4: Updating import paths only...');
  const pathUpdateResult = updateImportPathsOnly(targetPath, featureName);
  
  if (!pathUpdateResult.success) {
    console.error('❌ CRITICAL: Import path updates failed');
    console.error('🚨 Errors:', pathUpdateResult.errors);
    process.exit(1);
  }
  
  console.log(`✅ Import paths updated: ${pathUpdateResult.filesUpdated} files`);
  
  // STEP 5: Final Verification
  console.log('\n🧪 STEP 5: Final verification...');
  const finalDependencies = analyzeFeatureDependencies(targetPath);
  
  if (!finalDependencies || finalDependencies.imports.size !== originalImportCount) {
    console.error('❌ CRITICAL: Dependencies lost during path updates');
    console.error(`📉 Expected: ${originalImportCount}, Final: ${finalDependencies ? finalDependencies.imports.size : 0}`);
    process.exit(1);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ PRESERVATION MIGRATION SUCCESSFUL: ${featureName}`);
  console.log(`📊 Preserved ${originalImportCount} dependencies`);
  console.log(`📁 Migrated ${getAllFilesRecursively(targetPath).length} files`);
  console.log(`🎯 Functionality: Preserved (requires manual testing)`);
  console.log('='.repeat(60));
  
  return {
    success: true,
    originalImports: originalImportCount,
    finalImports: finalDependencies.imports.size,
    filesCount: getAllFilesRecursively(targetPath).length
  };
}

function copyDirectoryPreserveAll(source, target) {
  // Copy EVERYTHING exactly as-is
  // No file modifications
  // No content changes
  // No "improvements"
  
  if (!fs.existsSync(source)) {
    throw new Error(`Source path does not exist: ${source}`);
  }
  
  const items = fs.readdirSync(source, { withFileTypes: true });
  
  items.forEach(item => {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);
    
    if (item.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyDirectoryPreserveAll(sourcePath, targetPath); // Recursive
    } else {
      // CRITICAL: Copy file EXACTLY - no modifications
      const content = fs.readFileSync(sourcePath);
      fs.writeFileSync(targetPath, content); // Exact copy
    }
  });
}

function updateImportPathsOnly(targetPath, featureName) {
  // ONLY update import paths - nothing else
  // NO functional changes
  // NO dependency removal  
  // NO simplification
  
  const files = getAllFilesRecursively(targetPath).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  let filesUpdated = 0;
  const errors = [];
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      const originalContent = content; // Backup
      
      // Count original imports
      const originalImports = (originalContent.match(/import.*from\s+['"\`]([^'"\`]+)['"\`]/g) || []).length;
      
      // Update app/ imports to use new structure paths
      content = content.replace(
        /from\s+['"\`]@\/app\/components\/ui\/([^'"\`]+)['"\`]/g,
        `from '@/src/shared/components/ui/$1'`
      );
      
      content = content.replace(
        /from\s+['"\`]@\/app\/components\/layout\/([^'"\`]+)['"\`]/g,
        `from '@/src/shared/components/layout/$1'`
      );
      
      content = content.replace(
        /from\s+['"\`]@\/app\/contexts\/([^'"\`]+)['"\`]/g,
        `from '@/src/shared/contexts/$1'`
      );
      
      // Update relative imports within the feature
      content = content.replace(
        /from\s+['"\`]\.\.\/([^'"\`]+)['"\`]/g,
        `from './$1'`
      );
      
      // Count final imports
      const finalImports = (content.match(/import.*from\s+['"\`]([^'"\`]+)['"\`]/g) || []).length;
      
      // VERIFY: Check that we didn't break anything
      if (originalImports !== finalImports) {
        errors.push(`Import count changed in ${path.relative(process.cwd(), file)}: ${originalImports} → ${finalImports}`);
        return;
      }
      
      // Only write if content actually changed
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        filesUpdated++;
      }
      
    } catch (error) {
      errors.push(`Failed to update ${path.relative(process.cwd(), file)}: ${error.message}`);
    }
  });
  
  return {
    success: errors.length === 0,
    filesUpdated,
    errors
  };
}

// Main execution
if (require.main === module) {
  const [sourcePath, targetPath, featureName] = process.argv.slice(2);
  
  if (!sourcePath || !targetPath || !featureName) {
    console.error('❌ ERROR: Missing required arguments');
    console.log('\nUsage: node tools/migration/preserve-migrate.js <source-path> <target-path> <feature-name>');
    console.log('\nExamples:');
    console.log('  node tools/migration/preserve-migrate.js app/components/icp src/features/icp-analysis icp-analysis');
    console.log('  node tools/migration/preserve-migrate.js app/components/resources src/features/resources-library resources-library');
    process.exit(1);
  }
  
  try {
    const result = preservationMigrate(sourcePath, targetPath, featureName);
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the migrated feature manually');
    console.log('2. Update page imports to use new feature');
    console.log('3. Run build to verify everything works');
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    console.error('\n🔍 This indicates a critical preservation failure');
    process.exit(1);
  }
}

module.exports = { preservationMigrate, copyDirectoryPreserveAll, updateImportPathsOnly };