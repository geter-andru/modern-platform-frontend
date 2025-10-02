#!/usr/bin/env node

/**
 * Ultra-Conservative Type Assertion Fix Script - Phase 2
 * Fixes missing type definitions and imports in next 5 most problematic files
 * Processes only 1 file at a time with full validation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Next 5 most problematic files (from updated error analysis)
const TARGET_FILES = [
  'src/features/dashboard/DealMomentumAnalyzer.tsx',
  'src/shared/components/ui/DataTable.tsx',
  'src/shared/components/ui/Accordion.tsx',
  'src/features/dashboard/ProfessionalLevelProgression.tsx'
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

function fixDealMomentumAnalyzer(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  const backupPath = createBackup(filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing imports and type definitions
    const importsAndTypes = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface MomentumAlert {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  message: string;
  impact: string;
  timestamp: string;
  dealId: string;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  daysInStage: number;
  momentum: 'positive' | 'negative' | 'neutral';
  lastActivity: string;
  owner: string;
}

interface DealMomentumAnalyzerProps {
  deals?: Deal[];
  onDealUpdate?: (deal: Deal) => void;
  className?: string;
}`;
    
    // Check if imports already exist
    if (content.includes('import React')) {
      console.log(`⚠️  File already has React imports, skipping`);
      restoreBackup(filePath, backupPath);
      return false;
    }
    
    // Add imports and types at the beginning
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find first non-empty line
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    
    // Insert imports and types
    lines.splice(insertIndex, 0, importsAndTypes);
    const newContent = lines.join('\n');
    
    // Write file
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added missing imports and type definitions to DealMomentumAnalyzer`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    restoreBackup(filePath, backupPath);
    return false;
  }
}

function fixDataTable(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  const backupPath = createBackup(filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing imports
    const imports = `import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';`;
    
    // Check if imports already exist
    if (content.includes('import React')) {
      console.log(`⚠️  File already has React imports, skipping`);
      restoreBackup(filePath, backupPath);
      return false;
    }
    
    // Add imports at the beginning
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find first non-empty line
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    
    // Insert imports
    lines.splice(insertIndex, 0, imports);
    const newContent = lines.join('\n');
    
    // Write file
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added missing imports to DataTable`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    restoreBackup(filePath, backupPath);
    return false;
  }
}

function fixAccordion(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  const backupPath = createBackup(filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing imports
    const imports = `import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus
} from 'lucide-react';`;
    
    // Check if imports already exist
    if (content.includes('import React')) {
      console.log(`⚠️  File already has React imports, skipping`);
      restoreBackup(filePath, backupPath);
      return false;
    }
    
    // Add imports at the beginning
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find first non-empty line
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    
    // Insert imports
    lines.splice(insertIndex, 0, imports);
    const newContent = lines.join('\n');
    
    // Write file
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added missing imports to Accordion`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    restoreBackup(filePath, backupPath);
    return false;
  }
}

function fixProfessionalLevelProgression(filePath) {
  console.log(`\n🔧 Processing: ${filePath}`);
  
  const backupPath = createBackup(filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add missing imports and type definitions
    const importsAndTypes = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Users, 
  DollarSign, 
  BarChart3,
  CheckCircle,
  Lock,
  Star,
  Trophy,
  ArrowRight,
  Zap
} from 'lucide-react';

interface Level {
  id: string;
  name: string;
  description: string;
  requiredPoints: number;
  currentPoints: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  benefits: string[];
  nextLevel?: string;
}

interface ProfessionalLevelProgressionProps {
  currentLevel?: Level;
  levels?: Level[];
  onLevelUp?: (level: Level) => void;
  className?: string;
}`;
    
    // Check if imports already exist
    if (content.includes('import React')) {
      console.log(`⚠️  File already has React imports, skipping`);
      restoreBackup(filePath, backupPath);
      return false;
    }
    
    // Add imports and types at the beginning
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find first non-empty line
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    
    // Insert imports and types
    lines.splice(insertIndex, 0, importsAndTypes);
    const newContent = lines.join('\n');
    
    // Write file
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added missing imports and type definitions to ProfessionalLevelProgression`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    restoreBackup(filePath, backupPath);
    return false;
  }
}

function fixFileTypeAssertions(filePath) {
  const fileName = path.basename(filePath);
  
  switch (fileName) {
    case 'DealMomentumAnalyzer.tsx':
      return fixDealMomentumAnalyzer(filePath);
    case 'DataTable.tsx':
      return fixDataTable(filePath);
    case 'Accordion.tsx':
      return fixAccordion(filePath);
    case 'ProfessionalLevelProgression.tsx':
      return fixProfessionalLevelProgression(filePath);
    default:
      console.log(`⚠️  No fix pattern defined for ${fileName}, skipping`);
      return false;
  }
}

function main() {
  console.log('🚀 Ultra-Conservative Type Assertion Fix Script - Phase 2');
  console.log('========================================================');
  
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
    const success = fixFileTypeAssertions(filePath);
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
  
  console.log('\n📊 Phase 2 Results:');
  console.log(`   Files processed: ${processedCount}/${TARGET_FILES.length}`);
  console.log(`   Files fixed: ${successCount}`);
  console.log(`   Initial errors: ${initialErrorCount}`);
  console.log(`   Final errors: ${finalErrorCount}`);
  console.log(`   Error reduction: ${errorReduction}`);
  
  if (errorReduction > 0) {
    console.log('✅ Phase 2 completed successfully!');
  } else {
    console.log('⚠️  No error reduction achieved. Manual review recommended.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixFileTypeAssertions, getCurrentErrorCount };
