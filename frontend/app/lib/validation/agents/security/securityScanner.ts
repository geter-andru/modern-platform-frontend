/**
 * Next.js Security Scanner
 * TypeScript implementation for modern-platform validation
 */

import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { z } from 'zod';

// Validation schemas
const SecurityVulnerabilitySchema = z.object({
  file: z.string(),
  pattern: z.string(),
  matches: z.number(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
});

const NextJSIssueSchema = z.object({
  file: z.string(),
  issue: z.string(),
  severity: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  recommendation: z.string()
});

const SecurityScanResultSchema = z.object({
  scannedFiles: z.number(),
  secretsFound: z.number(),
  vulnerabilities: z.array(SecurityVulnerabilitySchema),
  safeFiles: z.array(z.string()),
  nextjsSpecificIssues: z.array(NextJSIssueSchema)
});

export type SecurityVulnerability = z.infer<typeof SecurityVulnerabilitySchema>;
export type NextJSIssue = z.infer<typeof NextJSIssueSchema>;
export type SecurityScanResult = z.infer<typeof SecurityScanResultSchema>;

interface HSContext {
  appName: string;
  appType: string;
  architecture: string;
  techStack: {
    framework: string;
    react: string;
    typescript: string;
    buildSystem: string;
    routing: string;
    styling: string;
    database: string;
    testing: string;
  };
  validationRules: {
    security: {
      nextjsSecrets: boolean;
      supabaseKeys: boolean;
      apiKeys: boolean;
    };
  };
}

export class NextJSSecurityScanner {
  private baseDir: string;
  private hsContext: HSContext;
  private dangerousPatterns: RegExp[];

  constructor() {
    this.baseDir = process.cwd();
    this.hsContext = this.loadHSContext();
    this.dangerousPatterns = this.getNextJSDangerousPatterns();
  }

  private loadHSContext(): HSContext {
    try {
      const contextPath = path.join(this.baseDir, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
        return context as HSContext;
      }
    } catch (error) {
      console.warn('Could not load H&S context, using defaults');
    }
    
    return {
      appName: 'modern-platform',
      appType: 'nextjs-platform',
      architecture: 'nextjs-15-app-router',
      techStack: {
        framework: 'Next.js 15.4.6',
        react: '19.1.0',
        typescript: '5.x',
        buildSystem: 'nextjs-turbopack',
        routing: 'app-router',
        styling: 'tailwindcss-4',
        database: 'supabase',
        testing: 'jest-30'
      },
      validationRules: {
        security: {
          nextjsSecrets: true,
          supabaseKeys: true,
          apiKeys: true
        }
      }
    };
  }

  private getNextJSDangerousPatterns(): RegExp[] {
    const basePatterns = [
      // Hardcoded secrets (not environment variable references)
      /NEXT_PUBLIC_[A-Z_]+[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
      // Note: Removed process.env pattern as it was flagging references, not actual secrets
      
      // API keys and tokens
      /API.*KEY.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
      /SECRET.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
      /TOKEN.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
      
      // Private keys
      /-----BEGIN.*PRIVATE.*KEY-----/gi,
      /-----BEGIN.*RSA.*PRIVATE.*KEY-----/gi,
      
      // Database URLs
      /postgres:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/gi,
      /mongodb:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/gi,
      
      // Airtable keys  
      /pat[a-zA-Z0-9]{17}\.[\w]{64}/gi,
      
      // Supabase keys (Next.js specific)
      /SUPABASE.*URL.*[=:]\s*["']?https:\/\/[a-zA-Z0-9-]+\.supabase\.co["']?/gi,
      /SUPABASE.*ANON.*KEY.*[=:]\s*["']?eyJ[a-zA-Z0-9_-]+["']?/gi,
      /SUPABASE.*SERVICE.*ROLE.*KEY.*[=:]\s*["']?eyJ[a-zA-Z0-9_-]+["']?/gi,
      
      // Make.com tokens
      /MAKE.*API.*TOKEN.*[=:]\s*["']?[a-zA-Z0-9-]{20,}["']?/gi,
      
      // Stripe keys
      /STRIPE.*SECRET.*[=:]\s*["']?sk_[a-zA-Z0-9]{20,}["']?/gi,
      /STRIPE.*PUBLISHABLE.*[=:]\s*["']?pk_[a-zA-Z0-9]{20,}["']?/gi,
      
      // Claude AI keys
      /CLAUDE.*API.*KEY.*[=:]\s*["']?sk-ant-[a-zA-Z0-9-]{20,}["']?/gi,
      /ANTHROPIC.*API.*KEY.*[=:]\s*["']?sk-ant-[a-zA-Z0-9-]{20,}["']?/gi,
      
      // GitHub tokens
      /GITHUB.*TOKEN.*[=:]\s*["']?ghp_[a-zA-Z0-9]{36}["']?/gi,
      /GITHUB.*PAT.*[=:]\s*["']?github_pat_[a-zA-Z0-9_]{82}["']?/gi,
      
      // JWT secrets
      /JWT.*SECRET.*[=:]\s*["']?[a-zA-Z0-9]{32,}["']?/gi,
      /NEXTAUTH.*SECRET.*[=:]\s*["']?[a-zA-Z0-9]{32,}["']?/gi,
      
      // OpenAI API Keys
      /OPENAI.*API.*KEY.*[=:]\s*["']?sk-[a-zA-Z0-9]{20,}["']?/gi,
      
      // AWS Credentials
      /AWS.*ACCESS.*KEY.*[=:]\s*["']?AKIA[0-9A-Z]{16}["']?/gi,
      /AWS.*SECRET.*KEY.*[=:]\s*["']?[a-zA-Z0-9/+=]{40}["']?/gi,
      
      // Google API Keys
      /GOOGLE.*API.*KEY.*[=:]\s*["']?AIza[0-9A-Za-z\\-_]{35}["']?/gi,
      
      // Firebase Keys
      /FIREBASE.*KEY.*[=:]\s*["']?[a-zA-Z0-9_-]{40,}["']?/gi,
      
      // SendGrid Keys
      /SENDGRID.*API.*KEY.*[=:]\s*["']?SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}["']?/gi,
      
      // Twilio Keys
      /TWILIO.*API.*KEY.*[=:]\s*["']?[a-zA-Z0-9]{32}["']?/gi,
      
      // Customer Data (PII)
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b.*[=:]\s*["']?[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}["']?/gi,
      
      // Credit Card Numbers
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      
      // SSN Numbers
      /\b\d{3}-\d{2}-\d{4}\b/g
    ];

    // Add Next.js specific patterns based on context
    if (this.hsContext.appType === 'nextjs-platform') {
      basePatterns.push(
        // Next.js environment variables
        /NEXT_PUBLIC_SUPABASE_URL[=:]\s*["']?https:\/\/[a-zA-Z0-9-]+\.supabase\.co["']?/gi,
        /NEXT_PUBLIC_SUPABASE_ANON_KEY[=:]\s*["']?eyJ[a-zA-Z0-9_-]+["']?/gi,
        
        // App Router specific
        /APP_ROUTER.*SECRET.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
        
        // Vercel/Netlify deployment secrets
        /VERCEL.*TOKEN.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi,
        /NETLIFY.*TOKEN.*[=:]\s*["']?[a-zA-Z0-9]{20,}["']?/gi
      );
    }

    return basePatterns;
  }

  async scanRepository(): Promise<SecurityScanResult> {
    console.log(chalk.yellow.bold(`🔍 ${this.hsContext.appName} Next.js Security Scanner\n`));
    
    const results: SecurityScanResult = {
      scannedFiles: 0,
      secretsFound: 0,
      vulnerabilities: [],
      safeFiles: [],
      nextjsSpecificIssues: []
    };

    await this.scanDirectory(this.baseDir, results);
    
    this.generateNextJSSecurityReport(results);
    
    return SecurityScanResultSchema.parse(results);
  }

  private async scanDirectory(dir: string, results: SecurityScanResult): Promise<void> {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      // Skip node_modules, .git, and other ignored directories
      if (this.shouldSkipPath(itemPath)) continue;
      
      if (stat.isDirectory()) {
        await this.scanDirectory(itemPath, results);
      } else if (this.shouldScanNextJSFile(itemPath)) {
        await this.scanFile(itemPath, results);
      }
    }
  }

  private async scanFile(filePath: string, results: SecurityScanResult): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      results.scannedFiles++;
      
      const relativePath = path.relative(this.baseDir, filePath);
      let foundSecrets = false;
      
      // Check for dangerous patterns (actual hardcoded secrets)
      for (const pattern of this.dangerousPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          foundSecrets = true;
          results.secretsFound++;
          
          results.vulnerabilities.push({
            file: relativePath,
            pattern: pattern.toString(),
            matches: matches.length,
            severity: this.getNextJSSecuritySeverity(pattern, relativePath)
          });
        }
      }

      // Next.js specific checks (environment variable usage patterns)
      const nextjsIssues = this.checkNextJSSpecificIssues(content, relativePath);
      if (nextjsIssues.length > 0) {
        results.nextjsSpecificIssues.push(...nextjsIssues);
      }
      
      // Only mark as safe if no actual secrets AND no Next.js issues
      if (!foundSecrets && nextjsIssues.length === 0) {
        results.safeFiles.push(relativePath);
      }
      
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not scan ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  private checkNextJSSpecificIssues(content: string, filePath: string): NextJSIssue[] {
    const issues: NextJSIssue[] = [];
    
    // Check for hardcoded API routes
    if (filePath.includes('app/api/') && content.includes('localhost:3000')) {
      issues.push({
        file: filePath,
        issue: 'Hardcoded localhost URL in API route',
        severity: 'MEDIUM',
        recommendation: 'Use environment variables for API URLs'
      });
    }

    // Check for missing error boundaries in App Router
    if (filePath.includes('app/') && filePath.endsWith('.tsx') && 
        !content.includes('error.tsx') && content.includes('throw new Error')) {
      issues.push({
        file: filePath,
        issue: 'Missing error boundary for App Router',
        severity: 'LOW',
        recommendation: 'Add error.tsx file for proper error handling'
      });
    }

    // Check for client-side secrets (only in actual client components)
    if (this.isClientComponent(filePath, content) && content.includes('process.env.') && 
        !content.includes('NEXT_PUBLIC_')) {
      const envMatches = content.match(/process\.env\.([A-Z_]+)/g);
      if (envMatches) {
        // Filter out safe environment variables
        const unsafeMatches = envMatches.filter(match => {
          const varName = match.replace('process.env.', '');
          return !this.isSafeEnvironmentVariable(varName);
        });
        
        if (unsafeMatches.length > 0) {
          issues.push({
            file: filePath,
            issue: `Server-side environment variables in client component: ${unsafeMatches.join(', ')}`,
            severity: 'HIGH',
            recommendation: 'Use NEXT_PUBLIC_ prefix or move to server component'
          });
        }
      }
    }

    return issues;
  }

  private isClientComponent(filePath: string, content: string): boolean {
    // Must be in app directory and be a client component
    if (!filePath.includes('app/')) return false;
    
    // Exclude server-side files (API routes, lib services, middleware, etc.)
    if (filePath.includes('app/lib/') || 
        filePath.includes('app/api/') || 
        filePath.includes('app/middleware/') ||
        filePath.includes('app/actions/') ||
        filePath.includes('app/auth/') ||
        filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      return false;
    }
    
    // Must be a React component file
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return false;
    
    // Must have 'use client' directive
    return content.includes("'use client'");
  }

  private isSafeEnvironmentVariable(varName: string): boolean {
    // Safe environment variables that can be used in client components
    const safeVars = [
      'NODE_ENV',
      'NEXT_PUBLIC_NODE_ENV',
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_APP_URL',
      'NEXT_PUBLIC_APP_NAME',
      'NEXT_PUBLIC_VERSION'
    ];
    
    return safeVars.includes(varName) || varName.startsWith('NEXT_PUBLIC_');
  }

  private shouldSkipPath(filePath: string): boolean {
    const skipPatterns = [
      'node_modules',
      '.git',
      '.next',
      'out',
      'dist',
      'build',
      '.env.example',
      'validation-agents',
      'coverage',
      '.turbo',
      '.vercel',
      'lib/validation', // Skip our own validation code
      'SECURITY_SCANNER_ANALYSIS.md', // Skip analysis document
      '.env.local', // Skip local environment files
      '.env.local.backup', // Skip backup environment files
      'assets-app', // Skip separate React app
      'mcp-servers' // Skip MCP server directories
    ];
    
    return skipPatterns.some(pattern => filePath.includes(pattern));
  }

  private shouldScanNextJSFile(filePath: string): boolean {
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
      'SUPABASE_SETUP_GUIDE.md',
      'README.md'
    ];
    
    if (skipDocs.includes(fileName)) {
      return false;
    }
    
    const scanExtensions = [
      '.js', '.ts', '.tsx', '.jsx', 
      '.json', '.env', '.md', 
      '.yml', '.yaml', '.toml'
    ];
    
    // Always scan Next.js config files
    if (fileName.startsWith('next.config') || 
        fileName.startsWith('tailwind.config') ||
        fileName.startsWith('tsconfig') ||
        fileName.startsWith('.env')) {
      return true;
    }
    
    return scanExtensions.includes(ext);
  }

  private getNextJSSecuritySeverity(pattern: RegExp, filePath: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    const patternStr = pattern.toString();
    
    // Critical: Private keys, database URLs
    if (patternStr.includes('PRIVATE.*KEY') || patternStr.includes('postgres://')) {
      return 'CRITICAL';
    }
    
    // High: API keys, secrets in client components
    if (patternStr.includes('API.*KEY') || patternStr.includes('SECRET')) {
      if (filePath.includes('app/') && !patternStr.includes('NEXT_PUBLIC_')) {
        return 'CRITICAL'; // Server secrets in client components
      }
      return 'HIGH';
    }
    
    // High: Supabase keys
    if (patternStr.includes('SUPABASE')) {
      return 'HIGH';
    }
    
    // Medium: Other tokens
    if (patternStr.includes('TOKEN') || patternStr.includes('JWT')) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }

  private generateNextJSSecurityReport(results: SecurityScanResult): void {
    console.log(chalk.blue(`📊 Scanned ${results.scannedFiles} files\n`));
    
    if (results.secretsFound === 0 && results.nextjsSpecificIssues.length === 0) {
      console.log(chalk.green.bold('✅ NO SECURITY ISSUES DETECTED'));
      console.log(chalk.green('Next.js repository is secure\n'));
    } else {
      if (results.secretsFound > 0) {
        console.log(chalk.red.bold(`🚨 ${results.secretsFound} POTENTIAL SECRETS DETECTED\n`));
        this.reportSecrets(results.vulnerabilities);
      }
      
      if (results.nextjsSpecificIssues.length > 0) {
        console.log(chalk.yellow.bold(`⚠️  ${results.nextjsSpecificIssues.length} NEXT.JS SPECIFIC ISSUES\n`));
        this.reportNextJSIssues(results.nextjsSpecificIssues);
      }
    }

    // Next.js specific recommendations
    console.log(chalk.cyan.bold('\n💡 NEXT.JS 15 SECURITY BEST PRACTICES:'));
    console.log(chalk.cyan('• Use process.env.VARIABLE_NAME for server-side secrets'));
    console.log(chalk.cyan('• Use NEXT_PUBLIC_VARIABLE_NAME only for client-safe values'));
    console.log(chalk.cyan('• Keep .env.local in .gitignore'));
    console.log(chalk.cyan('• Use App Router error boundaries (error.tsx)'));
    console.log(chalk.cyan('• Validate environment variables at startup'));
    console.log(chalk.cyan('• Use Supabase RLS (Row Level Security) for data protection'));
    console.log(chalk.cyan('• Implement proper API route authentication'));
  }

  private reportSecrets(vulnerabilities: SecurityVulnerability[]): void {
    // Group by severity
    const critical = vulnerabilities.filter(v => v.severity === 'CRITICAL');
    const high = vulnerabilities.filter(v => v.severity === 'HIGH');
    const medium = vulnerabilities.filter(v => v.severity === 'MEDIUM');
    
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
  }

  private reportNextJSIssues(issues: NextJSIssue[]): void {
    issues.forEach(issue => {
      const color = issue.severity === 'HIGH' ? chalk.red : 
                   issue.severity === 'MEDIUM' ? chalk.yellow : chalk.blue;
      console.log(color(`  ${issue.severity}: ${issue.file}`));
      console.log(color(`    Issue: ${issue.issue}`));
      console.log(color(`    Recommendation: ${issue.recommendation}\n`));
    });
  }
}

// Export singleton instance
export const securityScanner = new NextJSSecurityScanner();
export default securityScanner;
