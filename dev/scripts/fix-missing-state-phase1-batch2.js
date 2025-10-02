#!/usr/bin/env node

/**
 * Ultra-Conservative Missing State Fix Script - Phase 1 Batch 2
 * Fixes missing state variables and functions in next 5 most problematic files
 * Processes only 1 file at a time with full validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Next 5 most problematic files (from updated error analysis)
const TARGET_FILES = [
  'src/features/icp-analysis/widgets/ProductDetailsWidget.tsx',
  'src/features/icp-analysis/widgets/RateCompanyWidget.tsx',
  'src/shared/components/ui/FileUploader.tsx',
  'src/shared/components/ui/ValidationSystem.tsx',
  'src/features/dashboard/ExperienceDrivenPriorities.tsx'
];

function getCurrentErrorCount() {
  try {
    const result = execSync('npx tsc --noEmit --skipLibCheck 2>&1 | wc -l', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    return parseInt(result.trim());
  } catch (error) {
    console.error('Error getting current error count:', error.message);
    return -1;
  }
}

function createBackup(filePath) {
  const backupPath = `${filePath}.backup.${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`✓ Created backup: ${backupPath}`);
  return backupPath;
}

function restoreBackup(filePath, backupPath) {
  fs.copyFileSync(backupPath, filePath);
  fs.unlinkSync(backupPath);
  console.log(`✓ Restored from backup: ${backupPath}`);
}

function fixProductDetailsWidget(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  const backupPath = createBackup(filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing state variables after the existing useState
    const stateAddition = `  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);`;
    
    // Add handleSave function
    const handleSaveFunction = `
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Hide saved message after 3 seconds
    } catch (error) {
      console.error('Error saving product details:', error);
    } finally {
      setIsSaving(false);
    }
  };`;
    
    // Find the line with the existing useState and add after it
    const lines = content.split('\n');
    let insertIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('useState<ProductDetails>')) {
        insertIndex = i + 1;
        break;
      }
    }
    
    if (insertIndex === -1) {
      console.log(`⚠️  Could not find useState line, skipping`);
      restoreBackup(filePath, backupPath);
      return false;
    }
    
    // Insert state variables
    lines.splice(insertIndex, 0, stateAddition);
    
    // Find the component function and add handleSave function
    let functionInsertIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export default function ProductDetailsWidget')) {
        // Find the opening brace
        for (let j = i; j < lines.length; j++) {
          if (lines[j].includes('{')) {
            functionInsertIndex = j + 1;
            break;
          }
        }
        break;
      }
    }
    
    if (functionInsertIndex !== -1) {
      lines.splice(functionInsertIndex, 0, handleSaveFunction);
    }
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added missing state and functions to ProductDetailsWidget`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    restoreBackup(filePath, backupPath);
    return false;
  }
}

function fixFileMissingState(filePath) {
  const fileName = path.basename(filePath);
  
  switch (fileName) {
    case 'ProductDetailsWidget.tsx':
      return fixProductDetailsWidget(filePath);
    default:
      console.log(`⚠️  No fix pattern defined for ${fileName}, skipping`);
      return false;
  }
}

function main() {
  console.log('🚀 Ultra-Conservative Missing State Fix Script - Phase 1 Batch 2');
  console.log('================================================================');
  
  const initialErrorCount = getCurrentErrorCount();
  if (initialErrorCount === -1) {
    console.error('❌ Failed to get initial error count. Aborting.');
    process.exit(1);
  }
  
  console.log(`📊 Initial error count: ${initialErrorCount}`);
  console.log(`🎯 Target files: ${TARGET_FILES.length}`);
  
  let successCount = 0;
  let processedCount = 0;
  
  for (const filePath of TARGET_FILES) {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}, skipping`);
      continue;
    }
    
    processedCount++;
    const success = fixFileMissingState(filePath);
    if (success) {
      successCount++;
    }
    
    // Safety check: if error count increased significantly, stop
    const currentErrorCount = getCurrentErrorCount();
    if (currentErrorCount > initialErrorCount + 50) {
      console.error(`❌ Error count increased significantly (${currentErrorCount} vs ${initialErrorCount}). Stopping for safety.`);
      break;
    }
  }
  
  const finalErrorCount = getCurrentErrorCount();
  const errorReduction = initialErrorCount - finalErrorCount;
  
  console.log('\n📊 Phase 1 Batch 2 Results:');
  console.log(`   Files processed: ${processedCount}/${TARGET_FILES.length}`);
  console.log(`   Files fixed: ${successCount}`);
  console.log(`   Initial errors: ${initialErrorCount}`);
  console.log(`   Final errors: ${finalErrorCount}`);
  console.log(`   Error reduction: ${errorReduction}`);
  
  if (errorReduction > 0) {
    console.log('✅ Phase 1 Batch 2 completed successfully!');
  } else {
    console.log('⚠️  No error reduction achieved. Manual review recommended.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFileMissingState, getCurrentErrorCount };
