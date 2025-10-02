#!/usr/bin/env node

/**
 * Ultra-Conservative Import Fix Script - Phase 1
 * Fixes missing React imports in top 5 most problematic files
 * Processes only 1 file at a time with full validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Top 5 most problematic files (from error analysis)
const TARGET_FILES = [
  'src/shared/components/ui/Select.tsx',
  'src/shared/components/layout/ModernSidebarLayout.tsx', 
  'src/features/icp-analysis/widgets/ProductDetailsWidget.tsx',
  'src/features/icp-analysis/widgets/RateCompanyWidget.tsx',
  'src/shared/components/ui/ExportControls.tsx'
];

// Common import patterns to add
const IMPORT_PATTERNS = {
  'Select.tsx': `import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, Search } from 'lucide-react';`,

  'ModernSidebarLayout.tsx': `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';`,

  'ProductDetailsWidget.tsx': `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Edit, 
  Save, 
  RefreshCw, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Award,
  BarChart3,
  Building2,
  MapPin,
  Calendar,
  Zap,
  Brain
} from 'lucide-react';`,

  'RateCompanyWidget.tsx': `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Award
} from 'lucide-react';`,

  'ExportControls.tsx': `import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';`
};

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

function fixFileImports(filePath) {
  const fileName = path.basename(filePath);
  const importPattern = IMPORT_PATTERNS[fileName];
  
  if (!importPattern) {
    console.log(`⚠️  No import pattern defined for ${fileName}, skipping`);
    return false;
  }

  console.log(`\n🔧 Processing: ${filePath}`);
  
  // Create backup
  const backupPath = createBackup(filePath);
  
  try {
    // Read current file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if imports already exist
    if (content.includes('import React')) {
      console.log(`⚠️  File already has React imports, skipping`);
      restoreBackup(filePath, backupPath);
      return false;
    }
    
    // Add imports at the beginning (after any existing empty lines)
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find first non-empty line
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    
    // Insert imports
    lines.splice(insertIndex, 0, importPattern);
    const newContent = lines.join('\n');
    
    // Write file
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added imports to ${fileName}`);
    
    // Validate TypeScript
    const newErrorCount = getCurrentErrorCount();
    if (newErrorCount === -1) {
      throw new Error('Failed to get error count after fix');
    }
    
    console.log(`✓ TypeScript validation completed. Current error count: ${newErrorCount}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    restoreBackup(filePath, backupPath);
    return false;
  }
}

function main() {
  console.log('🚀 Ultra-Conservative Import Fix Script - Phase 1');
  console.log('================================================');
  
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
    const success = fixFileImports(filePath);
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
  
  console.log('\n📊 Phase 1 Results:');
  console.log(`   Files processed: ${processedCount}/${TARGET_FILES.length}`);
  console.log(`   Files fixed: ${successCount}`);
  console.log(`   Initial errors: ${initialErrorCount}`);
  console.log(`   Final errors: ${finalErrorCount}`);
  console.log(`   Error reduction: ${errorReduction}`);
  
  if (errorReduction > 0) {
    console.log('✅ Phase 1 completed successfully!');
  } else {
    console.log('⚠️  No error reduction achieved. Manual review recommended.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFileImports, getCurrentErrorCount };
