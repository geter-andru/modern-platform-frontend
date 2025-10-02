#!/usr/bin/env node

/**
 * HONESTY HEADER GENERATOR
 * Automatically generates mandatory honesty headers for files missing them
 * Analyzes file content to suggest appropriate REAL/FAKE status
 */

const fs = require('fs');
const path = require('path');

class HonestyHeaderGenerator {
  constructor() {
    this.processedFiles = [];
    this.skippedFiles = [];
  }

  scanAndProcess(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (['node_modules', '.git', '.next', 'out', 'dist'].includes(entry.name)) {
          continue;
        }
        this.scanAndProcess(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        this.processFile(fullPath);
      }
    }
  }

  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if already has header or is exempt
      if (this.hasHonestyHeader(content) || this.isExemptFile(filePath, content)) {
        this.skippedFiles.push(filePath);
        return;
      }

      const analysis = this.analyzeFileContent(filePath, content);
      const header = this.generateHeader(analysis);
      const newContent = this.insertHeader(content, header);
      
      fs.writeFileSync(filePath, newContent);
      this.processedFiles.push({
        file: filePath,
        analysis
      });

    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  hasHonestyHeader(content) {
    return content.includes('FUNCTIONALITY STATUS:');
  }

  isExemptFile(filePath, content) {
    const exemptPatterns = [
      /\.d\.ts$/,
      /\.config\./,
      /\.test\./,
      /\.spec\./,
      /layout\.tsx$/,
      /loading\.tsx$/,
      /error\.tsx$/,
      /not-found\.tsx$/
    ];

    for (const pattern of exemptPatterns) {
      if (pattern.test(filePath)) {
        return true;
      }
    }

    // Skip files with minimal business logic
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

    return logicLines.length < 5;
  }

  analyzeFileContent(filePath, content) {
    const analysis = {
      functionalityStatus: 'PARTIAL',
      realImplementations: [],
      fakeImplementations: [],
      missingRequirements: [],
      productionReady: 'NO'
    };

    // Detect real implementations
    if (content.includes('supabase') || content.includes('createClient')) {
      analysis.realImplementations.push('Supabase database integration');
    }
    if (content.includes('airtable') || content.includes('Airtable')) {
      analysis.realImplementations.push('Airtable API integration');
    }
    if (content.includes('fetch(') || content.includes('axios')) {
      analysis.realImplementations.push('HTTP API calls');
    }
    if (content.includes('useState') || content.includes('useEffect')) {
      analysis.realImplementations.push('React state management');
    }

    // Detect fake implementations
    if (content.includes('mock') || content.includes('Mock') || content.includes('MOCK')) {
      analysis.fakeImplementations.push('Mock data usage detected');
    }
    if (content.includes('template') || content.includes('hardcoded') || content.includes('placeholder')) {
      analysis.fakeImplementations.push('Template/hardcoded data usage');
    }
    if (content.includes('console.log') && content.includes('TODO')) {
      analysis.fakeImplementations.push('Placeholder console.log statements');
    }

    // Detect missing requirements
    if (content.includes('TODO') || content.includes('FIXME')) {
      analysis.missingRequirements.push('Implementation TODOs present');
    }
    if (content.includes('claude') || content.includes('Claude')) {
      if (!content.includes('/api/claude') && !content.includes('ANTHROPIC_API_KEY')) {
        analysis.missingRequirements.push('/app/api/claude/route.ts for AI integration');
      }
    }
    if (content.includes('export') || content.includes('pdf') || content.includes('PDF')) {
      if (!content.includes('/api/export')) {
        analysis.missingRequirements.push('/app/api/export/route.ts for server-side exports');
      }
    }

    // Determine status and production readiness
    if (analysis.realImplementations.length > 0 && analysis.fakeImplementations.length === 0) {
      analysis.functionalityStatus = 'REAL';
      if (analysis.missingRequirements.length === 0) {
        analysis.productionReady = 'YES';
      }
    } else if (analysis.fakeImplementations.length > 0) {
      analysis.functionalityStatus = 'FAKE';
      analysis.productionReady = 'NO';
    }

    // Add generic missing requirements if none detected
    if (analysis.missingRequirements.length === 0) {
      if (filePath.includes('service') || filePath.includes('Service')) {
        analysis.missingRequirements.push('Server-side API endpoints may be required');
      }
      if (content.includes('export') && !content.includes('useState')) {
        analysis.missingRequirements.push('Export functionality may need server-side implementation');
      }
    }

    return analysis;
  }

  generateHeader(analysis) {
    const realItems = analysis.realImplementations.length > 0 
      ? analysis.realImplementations.map(item => ` * - ${item}`).join('\n')
      : ' * - None detected - please review and update';

    const fakeItems = analysis.fakeImplementations.length > 0
      ? analysis.fakeImplementations.map(item => ` * - ${item}`).join('\n')
      : ' * - None detected - please review and update';

    const missingItems = analysis.missingRequirements.length > 0
      ? analysis.missingRequirements.map(item => ` * - ${item}`).join('\n')
      : ' * - None identified - please review and update';

    return `/**
 * FUNCTIONALITY STATUS: ${analysis.functionalityStatus}
 * 
 * REAL IMPLEMENTATIONS:
${realItems}
 * 
 * FAKE IMPLEMENTATIONS:
${fakeItems}
 * 
 * MISSING REQUIREMENTS:
${missingItems}
 * 
 * PRODUCTION READINESS: ${analysis.productionReady}
 * - Auto-generated assessment - please review and update as needed
 * - Verify all sections above are accurate for your implementation
 */`;
  }

  insertHeader(content, header) {
    // Find the best place to insert the header
    const lines = content.split('\n');
    let insertIndex = 0;

    // Skip over existing comments and imports
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ') || line.startsWith('//') || line.startsWith('/*') || line === '') {
        insertIndex = i + 1;
      } else {
        break;
      }
    }

    // Insert header with proper spacing
    lines.splice(insertIndex, 0, header, '');
    return lines.join('\n');
  }

  run() {
    console.log('🔧 Generating Mandatory Honesty Headers...\n');
    
    const startDir = process.cwd();
    this.scanAndProcess(startDir);
    
    console.log(`✅ Processed ${this.processedFiles.length} files`);
    console.log(`⏭️  Skipped ${this.skippedFiles.length} files (already compliant or exempt)\n`);

    if (this.processedFiles.length > 0) {
      console.log('📝 Files Updated:');
      for (const file of this.processedFiles) {
        console.log(`   • ${file.file.replace(process.cwd(), '.')}`);
        console.log(`     Status: ${file.analysis.functionalityStatus}, Production Ready: ${file.analysis.productionReady}`);
      }
      console.log('\n⚠️  IMPORTANT: Review and update the auto-generated headers!');
      console.log('   - Verify REAL vs FAKE assessments are accurate');
      console.log('   - Add specific missing requirements');
      console.log('   - Update production readiness assessment\n');
    }

    return true;
  }
}

// Run the generator
const generator = new HonestyHeaderGenerator();
generator.run();