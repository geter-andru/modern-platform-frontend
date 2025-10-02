#!/usr/bin/env node

/**
 * Security Audit Script for H&S Revenue Intelligence Platform
 * Checks for common security vulnerabilities and misconfigurations
 */

const fs = require('fs');
const path = require('path');

// Security checks configuration
const securityChecks = {
  // Environment variables
  envVars: {
    required: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'ANTHROPIC_API_KEY'
    ],
    sensitive: [
      'SUPABASE_SERVICE_ROLE_KEY',
      'ANTHROPIC_API_KEY',
      'AIRTABLE_API_KEY',
      'RENDER_API_KEY',
      'NETLIFY_API_KEY',
      'STRIPE_SECRET_KEY',
      'GOOGLE_OAUTH_CLIENT_SECRET'
    ]
  },
  
  // File patterns to check
  files: {
    dangerous: [
      '*.pem',
      '*.key',
      '*.p12',
      '*.pfx',
      'id_rsa',
      'id_dsa'
    ],
    sensitive: [
      '.env',
      '.env.local',
      '.env.production',
      '*.log'
    ],
    required: [
      '.gitignore',
      'package.json',
      'next.config.ts',
      'middleware.ts'
    ]
  },
  
  // Content patterns to check
  content: {
    secrets: [
      /api[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/gi,
      /secret[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/gi,
      /password\s*[:=]\s*['"][^'"]{8,}['"]/gi,
      /token\s*[:=]\s*['"][^'"]{20,}['"]/gi,
      /private[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/gi
    ],
    dangerous: [
      /eval\s*\(/gi,
      /innerHTML\s*=/gi,
      /document\.write/gi,
      /setTimeout\s*\(\s*['"][^'"]*['"]/gi,
      /setInterval\s*\(\s*['"][^'"]*['"]/gi
    ]
  }
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? `${colors.red}❌` : 
                   type === 'warning' ? `${colors.yellow}⚠️` : 
                   type === 'success' ? `${colors.green}✅` : 
                   `${colors.blue}ℹ️`;
    
    console.log(`${prefix} [${timestamp}] ${message}${colors.reset}`);
  }

  checkEnvironmentVariables() {
    this.log('Checking environment variables...');
    
    const envFile = path.join(process.cwd(), '.env.example');
    if (!fs.existsSync(envFile)) {
      this.issues.push('Missing .env.example file');
      this.log('Missing .env.example file', 'error');
    } else {
      this.passed.push('Environment example file exists');
      this.log('Environment example file exists', 'success');
    }

    // Check if sensitive files are in .gitignore
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      const sensitiveFiles = ['.env', '.env.local', '.env.production'];
      
      sensitiveFiles.forEach(file => {
        if (gitignore.includes(file)) {
          this.passed.push(`${file} is in .gitignore`);
          this.log(`${file} is in .gitignore`, 'success');
        } else {
          this.issues.push(`${file} should be in .gitignore`);
          this.log(`${file} should be in .gitignore`, 'error');
        }
      });
    }
  }

  checkFileSecurity() {
    this.log('Checking file security...');
    
    const rootDir = process.cwd();
    
    // Check for dangerous files
    securityChecks.files.dangerous.forEach(pattern => {
      const files = this.findFiles(rootDir, pattern);
      files.forEach(file => {
        if (!file.includes('node_modules') && !file.includes('.git')) {
          this.issues.push(`Dangerous file found: ${file}`);
          this.log(`Dangerous file found: ${file}`, 'error');
        }
      });
    });

    // Check for sensitive files (warnings, not errors)
    securityChecks.files.sensitive.forEach(pattern => {
      const files = this.findFiles(rootDir, pattern);
      files.forEach(file => {
        if (!file.includes('node_modules') && !file.includes('.git') && 
            !file.includes('.example') && !file.includes('.template')) {
          this.warnings.push(`Sensitive file found: ${file}`);
          this.log(`Sensitive file found: ${file}`, 'warning');
        }
      });
    });

    // Check for required files
    securityChecks.files.required.forEach(file => {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        this.passed.push(`Required file exists: ${file}`);
        this.log(`Required file exists: ${file}`, 'success');
      } else {
        this.issues.push(`Required file missing: ${file}`);
        this.log(`Required file missing: ${file}`, 'error');
      }
    });
  }

  checkCodeSecurity() {
    this.log('Checking code for security issues...');
    
    const rootDir = process.cwd();
    const sourceFiles = this.findFiles(rootDir, '*.{ts,tsx,js,jsx}');
    
    sourceFiles.forEach(file => {
      if (file.includes('node_modules') || file.includes('.git')) return;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for secrets in code
        securityChecks.content.secrets.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              this.issues.push(`Potential secret in ${file}: ${match.substring(0, 50)}...`);
              this.log(`Potential secret in ${file}`, 'error');
            });
          }
        });

        // Check for dangerous patterns
        securityChecks.content.dangerous.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              this.warnings.push(`Potentially dangerous code in ${file}: ${match.substring(0, 50)}...`);
              this.log(`Potentially dangerous code in ${file}`, 'warning');
            });
          }
        });

        // Check for proper error handling
        if (content.includes('console.log') && !file.includes('test')) {
          this.warnings.push(`Console.log found in ${file} - should be removed in production`);
          this.log(`Console.log found in ${file}`, 'warning');
        }

      } catch (error) {
        this.warnings.push(`Could not read file ${file}: ${error.message}`);
        this.log(`Could not read file ${file}`, 'warning');
      }
    });
  }

  checkPackageSecurity() {
    this.log('Checking package.json security...');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.issues.push('package.json not found');
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check for dangerous scripts
      if (packageJson.scripts) {
        Object.entries(packageJson.scripts).forEach(([name, script]) => {
          if (typeof script === 'string' && script.includes('rm -rf')) {
            this.warnings.push(`Dangerous script in package.json: ${name}`);
            this.log(`Dangerous script in package.json: ${name}`, 'warning');
          }
        });
      }

      // Check for known vulnerable packages (basic check)
      const vulnerablePackages = ['lodash@4.17.0', 'moment@2.24.0'];
      if (packageJson.dependencies) {
        Object.entries(packageJson.dependencies).forEach(([name, version]) => {
          const packageVersion = `${name}@${version}`;
          if (vulnerablePackages.includes(packageVersion)) {
            this.issues.push(`Potentially vulnerable package: ${packageVersion}`);
            this.log(`Potentially vulnerable package: ${packageVersion}`, 'error');
          }
        });
      }

      this.passed.push('Package.json security check completed');
      this.log('Package.json security check completed', 'success');

    } catch (error) {
      this.issues.push(`Could not parse package.json: ${error.message}`);
      this.log(`Could not parse package.json: ${error.message}`, 'error');
    }
  }

  checkNextJSConfiguration() {
    this.log('Checking Next.js configuration...');
    
    const configPath = path.join(process.cwd(), 'next.config.ts');
    if (!fs.existsSync(configPath)) {
      this.issues.push('next.config.ts not found');
      return;
    }

    try {
      const config = fs.readFileSync(configPath, 'utf8');
      
      // Check for security headers
      if (config.includes('headers')) {
        this.passed.push('Security headers configured');
        this.log('Security headers configured', 'success');
      } else {
        this.warnings.push('Security headers not configured');
        this.log('Security headers not configured', 'warning');
      }

      // Check for HTTPS redirect
      if (config.includes('https') || config.includes('secure')) {
        this.passed.push('HTTPS configuration found');
        this.log('HTTPS configuration found', 'success');
      } else {
        this.warnings.push('HTTPS configuration not found');
        this.log('HTTPS configuration not found', 'warning');
      }

    } catch (error) {
      this.issues.push(`Could not read next.config.ts: ${error.message}`);
      this.log(`Could not read next.config.ts: ${error.message}`, 'error');
    }
  }

  findFiles(dir, pattern) {
    const files = [];
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    function traverse(currentDir) {
      try {
        const items = fs.readdirSync(currentDir);
        
        items.forEach(item => {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            traverse(fullPath);
          } else if (stat.isFile() && regex.test(item)) {
            files.push(fullPath);
          }
        });
      } catch (error) {
        // Ignore permission errors
      }
    }
    
    traverse(dir);
    return files;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.bold}SECURITY AUDIT REPORT${colors.reset}`);
    console.log('='.repeat(60));
    
    console.log(`\n${colors.green}✅ PASSED (${this.passed.length}):${colors.reset}`);
    this.passed.forEach(item => console.log(`  • ${item}`));
    
    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}⚠️  WARNINGS (${this.warnings.length}):${colors.reset}`);
      this.warnings.forEach(item => console.log(`  • ${item}`));
    }
    
    if (this.issues.length > 0) {
      console.log(`\n${colors.red}❌ ISSUES (${this.issues.length}):${colors.reset}`);
      this.issues.forEach(item => console.log(`  • ${item}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    const score = Math.round(((this.passed.length) / (this.passed.length + this.issues.length + this.warnings.length)) * 100);
    const status = score >= 90 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : score >= 50 ? 'FAIR' : 'POOR';
    const color = score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red;
    
    console.log(`${color}Security Score: ${score}% (${status})${colors.reset}`);
    console.log('='.repeat(60) + '\n');
    
    return {
      score,
      status,
      passed: this.passed.length,
      warnings: this.warnings.length,
      issues: this.issues.length
    };
  }

  async run() {
    console.log(`${colors.bold}🔒 Starting Security Audit...${colors.reset}\n`);
    
    this.checkEnvironmentVariables();
    this.checkFileSecurity();
    this.checkCodeSecurity();
    this.checkPackageSecurity();
    this.checkNextJSConfiguration();
    
    const report = this.generateReport();
    
    // Exit with error code if there are critical issues
    if (this.issues.length > 0) {
      process.exit(1);
    }
    
    return report;
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.run().catch(console.error);
}

module.exports = SecurityAuditor;
