#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class NextJSSecurityScanner {
  constructor() {
    this.baseDir = process.cwd();
    this.hsContext = this.loadHSContext();
    this.dangerousPatterns = this.getDangerousPatterns();
  }

  loadHSContext() {
    try {
      const contextPath = path.join(this.baseDir, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        return JSON.parse(fs.readFileSync(contextPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load H&S context, using defaults');
    }
    
    return { appType: 'unknown', validationRules: { security: {} } };
  }

  getDangerousPatterns() {
    const basePatterns = [
      // API keys
      /API.*KEY.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
      // Private keys
      /-----BEGIN.*PRIVATE.*KEY-----/gi,
      // Airtable keys  
      /pat[a-zA-Z0-9]{17}\.[\w]{64}/gi
    ];

    // Add app-specific patterns based on context
    if (this.hsContext.appType === 'platform') {
      basePatterns.push(/SUPABASE.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi);
      basePatterns.push(/MAKE.*API.*TOKEN.*[=:]\s*["']?[a-zA-Z0-9-]{20,}["']?/gi);
    } else if (this.hsContext.appType === 'assessment') {
      basePatterns.push(/STRIPE.*SECRET.*[=:]\s*["']?sk_[a-zA-Z0-9]{20,}["']?/gi);
      basePatterns.push(/CLAUDE.*API.*KEY.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi);
    }

    return basePatterns;
  }

  async scanRepository() {
    const appName = this.hsContext.appName || 'H&S Platform';
    console.log(chalk.yellow.bold(`🔍 ${appName} Security Secrets Scanner\n`));
    
    const results = {
      scannedFiles: 0,
      secretsFound: 0,
      vulnerabilities: [],
      safeFiles: []
    };

    await this.scanDirectory(this.baseDir, results);
    
    this.generateSecurityReport(results);
    
    return results;
  }

  async scanDirectory(dir, results) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      // Skip node_modules, .git, and other ignored directories
      if (this.shouldSkipPath(itemPath)) continue;
      
      if (stat.isDirectory()) {
        await this.scanDirectory(itemPath, results);
      } else if (this.shouldScanFile(itemPath)) {
        await this.scanFile(itemPath, results);
      }
    }
  }

  async scanFile(filePath, results) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      results.scannedFiles++;
      
      const relativePath = path.relative(this.baseDir, filePath);
      let foundSecrets = false;
      
      for (const pattern of this.dangerousPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          foundSecrets = true;
          results.secretsFound++;
          
          results.vulnerabilities.push({
            file: relativePath,
            pattern: pattern.source,
            matches: matches.length,
            severity: this.getSecuritySeverity(pattern)
          });
        }
      }
      
      if (!foundSecrets) {
        results.safeFiles.push(relativePath);
      }
      
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not scan ${filePath}: ${error.message}`));
    }
  }

  shouldSkipPath(filePath) {
    const skipPatterns = [
      'node_modules',
      '.git',
      '.next',
      'out',
      'dist',
      '.env.example',
      'validation-agents'
    ];
    
    return skipPatterns.some(pattern => filePath.includes(pattern));
  }

  shouldScanFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    
    // Skip documentation files that commonly contain examples
    const skipDocs = [
      'PROJECT_STATUS.md',
      'EXTERNAL_SERVICES_STATE.md', 
      'SESSION_HANDOFF.md',
      'CUSTOMER_JOURNEY_STATE.md',
      'TESTING_GUIDE.md',
      'STARTUP_VERIFICATION.md',
      'SUPABASE_SETUP_GUIDE.md'
    ];
    
    if (skipDocs.includes(fileName)) {
      return false;
    }
    
    const scanExtensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.env', '.md', '.yml', '.yaml'];
    
    return scanExtensions.includes(ext) || path.basename(filePath).startsWith('.env');
  }

  getSecuritySeverity(pattern) {
    if (pattern.source.includes('PRIVATE.*KEY')) return 'CRITICAL';
    if (pattern.source.includes('postgres://')) return 'CRITICAL';
    if (pattern.source.includes('JWT.*SECRET')) return 'HIGH';
    if (pattern.source.includes('API.*KEY')) return 'HIGH';
    if (pattern.source.includes('SUPABASE')) return 'HIGH';
    return 'MEDIUM';
  }

  generateSecurityReport(results) {
    console.log(chalk.blue(`📊 Scanned ${results.scannedFiles} files\n`));
    
    if (results.secretsFound === 0) {
      console.log(chalk.green.bold('✅ NO SECRETS DETECTED'));
      console.log(chalk.green('Repository is safe from secrets exposure\n'));
    } else {
      console.log(chalk.red.bold(`🚨 ${results.secretsFound} POTENTIAL SECRETS DETECTED\n`));
      
      // Group by severity
      const critical = results.vulnerabilities.filter(v => v.severity === 'CRITICAL');
      const high = results.vulnerabilities.filter(v => v.severity === 'HIGH');
      const medium = results.vulnerabilities.filter(v => v.severity === 'MEDIUM');
      
      if (critical.length > 0) {
        console.log(chalk.red.bold('💀 CRITICAL VULNERABILITIES:'));
        critical.forEach(v => {
          console.log(chalk.red(`  ❌ ${v.file}: ${v.matches} matches`));
        });
        console.log('');
      }
      
      if (high.length > 0) {
        console.log(chalk.yellow.bold('⚠️  HIGH SEVERITY:'));
        high.forEach(v => {
          console.log(chalk.yellow(`  ⚠️  ${v.file}: ${v.matches} matches`));
        });
        console.log('');
      }
      
      if (medium.length > 0) {
        console.log(chalk.blue.bold('ℹ️  MEDIUM SEVERITY:'));
        medium.forEach(v => {
          console.log(chalk.blue(`  ℹ️  ${v.file}: ${v.matches} matches`));
        });
        console.log('');
      }
      
      console.log(chalk.red.bold('🔒 IMMEDIATE ACTION REQUIRED:'));
      console.log(chalk.red('1. Move all secrets to .env.local'));
      console.log(chalk.red('2. Add .env.local to .gitignore'));
      console.log(chalk.red('3. Use NEXT_PUBLIC_ prefix only for public variables'));
      console.log(chalk.red('4. Never commit API keys or database URLs'));
    }

    // Next.js specific recommendations
    console.log(chalk.cyan.bold('\n💡 NEXT.JS SECURITY BEST PRACTICES:'));
    console.log(chalk.cyan('• Use process.env.VARIABLE_NAME for server-side secrets'));
    console.log(chalk.cyan('• Use NEXT_PUBLIC_VARIABLE_NAME only for client-safe values'));
    console.log(chalk.cyan('• Keep .env.local in .gitignore'));
    console.log(chalk.cyan('• Use Supabase RLS (Row Level Security) for data protection'));
    console.log(chalk.cyan('• Validate environment variables at startup'));
  }
}

// Run if called directly
if (require.main === module) {
  const scanner = new NextJSSecurityScanner();
  scanner.scanRepository()
    .then(results => {
      process.exit(results.secretsFound > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Security scan failed:', error.message);
      process.exit(1);
    });
}

module.exports = NextJSSecurityScanner;