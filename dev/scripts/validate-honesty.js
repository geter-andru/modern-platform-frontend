#!/usr/bin/env node

/**
 * MANDATORY HONESTY ENFORCEMENT VALIDATOR
 * Scans all TypeScript/TSX files for required honesty headers
 * Blocks builds if files lack proper functionality documentation
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_HEADER_PATTERNS = [
  'FUNCTIONALITY STATUS:',
  'REAL IMPLEMENTATIONS:',
  'FAKE IMPLEMENTATIONS:',
  'MISSING REQUIREMENTS:',
  'PRODUCTION READINESS:'
];

const VALID_STATUS_VALUES = ['REAL', 'FAKE', 'PARTIAL'];
const VALID_READINESS_VALUES = ['YES', 'NO'];

class HonestyValidator {
  constructor() {
    this.violations = [];
    this.scannedFiles = 0;
    this.validFiles = 0;
  }

  scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, .git, .next, etc.
        if (['node_modules', '.git', '.next', 'out', 'dist'].includes(entry.name)) {
          continue;
        }
        this.scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        this.validateFile(fullPath);
      }
    }
  }

  validateFile(filePath) {
    this.scannedFiles++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const violations = this.checkFileHonesty(filePath, content);
      
      if (violations.length > 0) {
        this.violations.push({
          file: filePath,
          violations
        });
      } else {
        this.validFiles++;
      }
    } catch (error) {
      this.violations.push({
        file: filePath,
        violations: [`Error reading file: ${error.message}`]
      });
    }
  }

  checkFileHonesty(filePath, content) {
    const violations = [];
    
    // Skip config files, types-only files, and certain system files
    if (this.isExemptFile(filePath, content)) {
      return violations;
    }

    // Check for mandatory header comment
    const headerComment = this.extractHeaderComment(content);
    
    if (!headerComment) {
      violations.push('MISSING: Mandatory honesty header comment');
      return violations; // Can't check further without header
    }

    // Check for required patterns
    for (const pattern of REQUIRED_HEADER_PATTERNS) {
      if (!headerComment.includes(pattern)) {
        violations.push(`MISSING: Required field "${pattern}"`);
      }
    }

    // Validate FUNCTIONALITY STATUS
    const statusMatch = headerComment.match(/FUNCTIONALITY STATUS:\s*(\w+)/);
    if (statusMatch) {
      const status = statusMatch[1];
      if (!VALID_STATUS_VALUES.includes(status)) {
        violations.push(`INVALID: FUNCTIONALITY STATUS must be one of: ${VALID_STATUS_VALUES.join(', ')}`);
      }
    }

    // Validate PRODUCTION READINESS
    const readinessMatch = headerComment.match(/PRODUCTION READINESS:\s*(\w+)/);
    if (readinessMatch) {
      const readiness = readinessMatch[1];
      if (!VALID_READINESS_VALUES.includes(readiness)) {
        violations.push(`INVALID: PRODUCTION READINESS must be YES or NO, not "${readiness}"`);
      }
    }

    // Check for vague or dishonest descriptions
    violations.push(...this.checkForVagueDescriptions(headerComment));
    
    return violations;
  }

  extractHeaderComment(content) {
    // Look for /** ... */ comment at the start of the file (after imports)
    const commentMatch = content.match(/\/\*\*\s*([\s\S]*?)\s*\*\//);
    return commentMatch ? commentMatch[1] : null;
  }

  isExemptFile(filePath, content) {
    // Skip certain file types
    const exemptPatterns = [
      /\.d\.ts$/,           // Type definition files
      /\.config\./,         // Config files
      /\.test\./,           // Test files
      /\.spec\./,           // Spec files
      /layout\.tsx$/,       // Layout files
      /page\.tsx$/,         // Simple page files without business logic
      /loading\.tsx$/,      // Loading components
      /error\.tsx$/,        // Error components
      /not-found\.tsx$/     // Not found pages
    ];

    for (const pattern of exemptPatterns) {
      if (pattern.test(filePath)) {
        return true;
      }
    }

    // Skip files that are purely types or interfaces
    if (content.includes('export interface') && !content.includes('export const') && !content.includes('export function')) {
      return true;
    }

    // Skip files with only imports/exports and no business logic
    const lines = content.split('\n').filter(line => line.trim());
    const logicLines = lines.filter(line => {
      const trimmed = line.trim();
      return !trimmed.startsWith('import ') && 
             !trimmed.startsWith('export ') && 
             !trimmed.startsWith('//') && 
             !trimmed.startsWith('/*') && 
             !trimmed.startsWith('*') && 
             !trimmed.startsWith('*/') && 
             trimmed !== '';
    });

    return logicLines.length < 5; // Minimal logic = exempt
  }

  checkForVagueDescriptions(headerComment) {
    const violations = [];
    const vagueTerms = [
      'TODO', 'TBD', 'Coming soon', 'Will implement',
      'Maybe', 'Possibly', 'Should work', 'Might work',
      'Probably', 'Eventually', 'Soon'
    ];

    for (const term of vagueTerms) {
      if (headerComment.toLowerCase().includes(term.toLowerCase())) {
        violations.push(`VAGUE: Avoid uncertain language like "${term}" - be specific about implementation status`);
      }
    }

    // Check for suspiciously empty sections
    if (headerComment.includes('REAL IMPLEMENTATIONS:\n * - None') && 
        headerComment.includes('FAKE IMPLEMENTATIONS:\n * - None')) {
      violations.push('SUSPICIOUS: Both REAL and FAKE implementations are "None" - this is likely incorrect');
    }

    return violations;
  }

  generateReport() {
    console.log('\n🚨 MANDATORY HONESTY ENFORCEMENT REPORT 🚨\n');
    console.log(`Scanned Files: ${this.scannedFiles}`);
    console.log(`Valid Files: ${this.validFiles}`);
    console.log(`Files with Violations: ${this.violations.length}\n`);

    if (this.violations.length === 0) {
      console.log('✅ ALL FILES PASS HONESTY VALIDATION\n');
      return true;
    }

    console.log('❌ HONESTY VIOLATIONS DETECTED:\n');
    
    for (const fileViolation of this.violations) {
      console.log(`📄 ${fileViolation.file.replace(process.cwd(), '.')}`);
      for (const violation of fileViolation.violations) {
        console.log(`   • ${violation}`);
      }
      console.log('');
    }

    console.log('🚫 BUILD BLOCKED: Fix honesty violations before continuing\n');
    console.log('💡 To fix violations:');
    console.log('   1. Add mandatory header comments to files');
    console.log('   2. Be honest about REAL vs FAKE functionality');
    console.log('   3. Set PRODUCTION READINESS to YES or NO');
    console.log('   4. List actual MISSING REQUIREMENTS\n');

    return false;
  }

  run() {
    console.log('🔍 Running Mandatory Honesty Enforcement Validation...\n');
    
    const startDir = process.cwd();
    this.scanDirectory(startDir);
    
    return this.generateReport();
  }
}

// Run the validator
const validator = new HonestyValidator();
const success = validator.run();

process.exit(success ? 0 : 1);