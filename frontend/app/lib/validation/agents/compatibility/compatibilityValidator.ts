/**
 * Next.js Compatibility Validator
 * TypeScript implementation for modern-platform validation
 */

import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { z } from 'zod';

// Validation schemas
const ValidationResultSchema = z.object({
  score: z.number().min(0).max(100),
  message: z.string(),
  status: z.enum(['PASSED', 'WARNING', 'FAILED', 'ERROR']),
  version: z.string().optional(),
  foundFiles: z.array(z.string()).optional(),
  missingFiles: z.array(z.string()).optional(),
  issues: z.array(z.string()).optional(),
  routes: z.array(z.string()).optional(),
  components: z.array(z.string()).optional(),
  totalComponents: z.number().optional(),
  foundDeps: z.array(z.string()).optional(),
  missingDeps: z.array(z.string()).optional(),
  configPath: z.string().optional()
});

const CompatibilityResultsSchema = z.object({
  nextjsVersion: ValidationResultSchema,
  reactVersion: ValidationResultSchema,
  appRouter: ValidationResultSchema,
  typescript: ValidationResultSchema,
  buildSystem: ValidationResultSchema,
  apiRoutes: ValidationResultSchema,
  components: ValidationResultSchema,
  dependencies: ValidationResultSchema
});

const CompatibilityReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  results: CompatibilityResultsSchema,
  passed: z.boolean()
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type CompatibilityResults = z.infer<typeof CompatibilityResultsSchema>;
export type CompatibilityReport = z.infer<typeof CompatibilityReportSchema>;

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
}

export class NextJSCompatibilityValidator {
  private hsContext: HSContext;
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
    this.hsContext = this.loadHSContext();
  }

  private loadHSContext(): HSContext {
    try {
      const contextPath = path.join(this.projectRoot, 'H_S_VALIDATION_CONTEXT.json');
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
      }
    };
  }

  async runFullValidation(): Promise<CompatibilityReport> {
    console.log(chalk.cyan('🔍 Running Next.js 15 + React 19 Compatibility Validation...\n'));

    const results: CompatibilityResults = {
      nextjsVersion: await this.validateNextJSVersion(),
      reactVersion: await this.validateReactVersion(),
      appRouter: await this.validateAppRouter(),
      typescript: await this.validateTypeScript(),
      buildSystem: await this.validateBuildSystem(),
      apiRoutes: await this.validateAPIRoutes(),
      components: await this.validateComponents(),
      dependencies: await this.validateDependencies()
    };

    // Calculate overall score
    const scores = Object.values(results).map(r => r.score || 0);
    const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

    this.generateNextJSReport(results, overallScore);

    const report: CompatibilityReport = {
      overallScore,
      results,
      passed: overallScore >= 90
    };

    return CompatibilityReportSchema.parse(report);
  }

  private async validateNextJSVersion(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating Next.js Version...'));
    
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next;
      
      if (!nextVersion) {
        return { score: 0, message: 'Next.js not found in dependencies', status: 'FAILED' };
      }

      const version = nextVersion.replace(/[\^~]/, '');
      const majorVersion = parseInt(version.split('.')[0]);
      
      if (majorVersion >= 15) {
        return { 
          score: 100, 
          message: `Next.js ${version} - Compatible`, 
          status: 'PASSED',
          version: version
        };
      } else if (majorVersion >= 14) {
        return { 
          score: 80, 
          message: `Next.js ${version} - Compatible but not latest`, 
          status: 'WARNING',
          version: version
        };
      } else {
        return { 
          score: 0, 
          message: `Next.js ${version} - Incompatible`, 
          status: 'FAILED',
          version: version
        };
      }
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating Next.js: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateReactVersion(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating React Version...'));
    
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const reactVersion = packageJson.dependencies?.react || packageJson.devDependencies?.react;
      
      if (!reactVersion) {
        return { score: 0, message: 'React not found in dependencies', status: 'FAILED' };
      }

      const version = reactVersion.replace(/[\^~]/, '');
      const majorVersion = parseInt(version.split('.')[0]);
      
      if (majorVersion >= 19) {
        return { 
          score: 100, 
          message: `React ${version} - Latest version`, 
          status: 'PASSED',
          version: version
        };
      } else if (majorVersion >= 18) {
        return { 
          score: 85, 
          message: `React ${version} - Compatible but not latest`, 
          status: 'WARNING',
          version: version
        };
      } else {
        return { 
          score: 0, 
          message: `React ${version} - Incompatible`, 
          status: 'FAILED',
          version: version
        };
      }
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating React: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateAppRouter(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating App Router Structure...'));
    
    try {
      const appDir = path.join(this.projectRoot, 'app');
      const pagesDir = path.join(this.projectRoot, 'pages');
      
      if (!fs.existsSync(appDir)) {
        return { score: 0, message: 'App directory not found', status: 'FAILED' };
      }

      // Check for essential App Router files
      const requiredFiles = [
        'app/layout.tsx',
        'app/page.tsx'
      ];

      const optionalFiles = [
        'app/loading.tsx',
        'app/error.tsx',
        'app/not-found.tsx'
      ];

      let score = 0;
      const foundFiles: string[] = [];
      const missingFiles: string[] = [];

      // Check required files
      requiredFiles.forEach(file => {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          foundFiles.push(file);
          score += 50;
        } else {
          missingFiles.push(file);
        }
      });

      // Check optional files
      optionalFiles.forEach(file => {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          foundFiles.push(file);
          score += 10;
        }
      });

      // Check for API routes
      const apiDir = path.join(appDir, 'api');
      if (fs.existsSync(apiDir)) {
        foundFiles.push('app/api/');
        score += 20;
      }

      // Check for legacy pages directory (should not exist)
      if (fs.existsSync(pagesDir)) {
        score -= 20; // Deduct points for having both
      }

      return {
        score: Math.min(100, Math.max(0, score)),
        message: `App Router structure validated`,
        status: score >= 80 ? 'PASSED' : score >= 60 ? 'WARNING' : 'FAILED',
        foundFiles,
        missingFiles
      };
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating App Router: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateTypeScript(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating TypeScript Configuration...'));
    
    try {
      const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
      
      if (!fs.existsSync(tsconfigPath)) {
        return { score: 0, message: 'tsconfig.json not found', status: 'FAILED' };
      }

      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      let score = 50; // Base score for having tsconfig.json
      const issues: string[] = [];

      // Check for Next.js specific configuration
      if (tsconfig.extends?.includes('next')) {
        score += 20;
      } else {
        issues.push('Should extend Next.js TypeScript config');
      }

      // Check for strict mode
      if (tsconfig.compilerOptions?.strict) {
        score += 15;
      } else {
        issues.push('Should enable strict mode');
      }

      // Check for path mapping
      if (tsconfig.compilerOptions?.paths) {
        score += 10;
      }

      // Check for App Router support
      if (tsconfig.include?.includes('app/**/*')) {
        score += 5;
      }

      return {
        score: Math.min(100, score),
        message: `TypeScript configuration validated`,
        status: score >= 80 ? 'PASSED' : score >= 60 ? 'WARNING' : 'FAILED',
        issues
      };
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating TypeScript: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateBuildSystem(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating Build System...'));
    
    try {
      const nextConfigPath = path.join(this.projectRoot, 'next.config.ts');
      const nextConfigJsPath = path.join(this.projectRoot, 'next.config.js');
      
      let score = 0;
      let configPath: string | undefined;

      if (fs.existsSync(nextConfigPath)) {
        configPath = nextConfigPath;
        score += 30;
      } else if (fs.existsSync(nextConfigJsPath)) {
        configPath = nextConfigJsPath;
        score += 20;
      }

      if (configPath) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf8');
          
          // Check for TypeScript config
          if (configPath.endsWith('.ts')) {
            score += 10;
          }

          // Check for common Next.js optimizations
          if (configContent.includes('experimental')) {
            score += 10;
          }

          if (configContent.includes('images')) {
            score += 10;
          }

          if (configContent.includes('trailingSlash')) {
            score += 10;
          }

          // Check for output configuration
          if (configContent.includes('output')) {
            score += 10;
          }

          // Check for environment configuration
          if (configContent.includes('env')) {
            score += 10;
          }

        } catch (error) {
          return { 
            score: 0, 
            message: `Error reading config: ${error instanceof Error ? error.message : 'Unknown error'}`, 
            status: 'ERROR' 
          };
        }
      }

      // Check for package.json scripts
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const scripts = packageJson.scripts || {};

        if (scripts.build) score += 10;
        if (scripts.dev) score += 10;
        if (scripts.start) score += 10;
        if (scripts.lint) score += 10;
      }

      return {
        score: Math.min(100, score),
        message: `Build system validated`,
        status: score >= 80 ? 'PASSED' : score >= 60 ? 'WARNING' : 'FAILED',
        configPath
      };
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating build system: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateAPIRoutes(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating API Routes...'));
    
    try {
      const apiDir = path.join(this.projectRoot, 'app', 'api');
      
      if (!fs.existsSync(apiDir)) {
        return { score: 50, message: 'No API routes found', status: 'WARNING' };
      }

      let score = 60; // Base score for having API directory
      const routes: string[] = [];
      const issues: string[] = [];

      // Scan for API routes
      const scanDirectory = (dir: string, basePath = '') => {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            scanDirectory(itemPath, path.join(basePath, item));
          } else if (item === 'route.ts' || item === 'route.js') {
            const routePath = path.join(basePath, item);
            routes.push(routePath);
            score += 5;
          }
        });
      };

      scanDirectory(apiDir);

      // Check for proper route structure
      routes.forEach(route => {
        const routePath = path.join(apiDir, route);
        try {
          const content = fs.readFileSync(routePath, 'utf8');
          
          // Check for HTTP method exports
          if (content.includes('export async function GET') || 
              content.includes('export async function POST') ||
              content.includes('export async function PUT') ||
              content.includes('export async function DELETE')) {
            score += 2;
          } else {
            issues.push(`${route}: Missing HTTP method exports`);
          }

          // Check for proper imports
          if (content.includes('NextRequest') || content.includes('NextResponse')) {
            score += 2;
          }

        } catch (error) {
          issues.push(`${route}: Error reading file`);
        }
      });

      return {
        score: Math.min(100, score),
        message: `API routes validated`,
        status: score >= 80 ? 'PASSED' : score >= 60 ? 'WARNING' : 'FAILED',
        routes,
        issues
      };
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating API routes: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateComponents(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating Component Structure...'));
    
    try {
      const srcDir = path.join(this.projectRoot, 'src');
      const appDir = path.join(this.projectRoot, 'app');
      
      let score = 0;
      const components: string[] = [];

      // Check for src directory structure
      if (fs.existsSync(srcDir)) {
        score += 20;
        
        const sharedDir = path.join(srcDir, 'shared');
        const featuresDir = path.join(srcDir, 'features');
        
        if (fs.existsSync(sharedDir)) {
          score += 20;
          components.push('src/shared/');
        }
        
        if (fs.existsSync(featuresDir)) {
          score += 20;
          components.push('src/features/');
        }
      }

      // Check for App Router components
      if (fs.existsSync(appDir)) {
        score += 20;
        components.push('app/');
      }

      // Check for component files
      const scanForComponents = (dir: string, basePath = '') => {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            scanForComponents(itemPath, path.join(basePath, item));
          } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
            const componentPath = path.join(basePath, item);
            components.push(componentPath);
            score += 1;
          }
        });
      };

      scanForComponents(srcDir);
      scanForComponents(appDir);

      return {
        score: Math.min(100, score),
        message: `Component structure validated`,
        status: score >= 80 ? 'PASSED' : score >= 60 ? 'WARNING' : 'FAILED',
        components: components.slice(0, 10), // Limit output
        totalComponents: components.length
      };
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating components: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private async validateDependencies(): Promise<ValidationResult> {
    console.log(chalk.magenta('📋 Validating Dependencies...'));
    
    try {
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      let score = 0;
      const foundDeps: string[] = [];
      const missingDeps: string[] = [];

      // Essential Next.js dependencies
      const essentialDeps = [
        'next',
        'react',
        'react-dom',
        'typescript'
      ];

      // Recommended dependencies
      const recommendedDeps = [
        '@types/react',
        '@types/react-dom',
        '@types/node',
        'tailwindcss',
        'eslint',
        'eslint-config-next'
      ];

      // Check essential dependencies
      essentialDeps.forEach(dep => {
        if (dependencies[dep]) {
          foundDeps.push(dep);
          score += 20;
        } else {
          missingDeps.push(dep);
        }
      });

      // Check recommended dependencies
      recommendedDeps.forEach(dep => {
        if (dependencies[dep]) {
          foundDeps.push(dep);
          score += 5;
        }
      });

      // Check for modern dependencies
      if (dependencies['@supabase/supabase-js']) {
        foundDeps.push('@supabase/supabase-js');
        score += 10;
      }

      if (dependencies['@tanstack/react-query']) {
        foundDeps.push('@tanstack/react-query');
        score += 10;
      }

      return {
        score: Math.min(100, score),
        message: `Dependencies validated`,
        status: score >= 80 ? 'PASSED' : score >= 60 ? 'WARNING' : 'FAILED',
        foundDeps,
        missingDeps
      };
    } catch (error) {
      return { 
        score: 0, 
        message: `Error validating dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        status: 'ERROR' 
      };
    }
  }

  private generateNextJSReport(results: CompatibilityResults, overallScore: number): void {
    console.log(chalk.yellow.bold('\n📊 NEXT.JS 15 + REACT 19 COMPATIBILITY REPORT'));
    console.log(chalk.yellow('='.repeat(60)));
    
    Object.entries(results).forEach(([key, result]) => {
      const icon = result.status === 'PASSED' ? '✅' : 
                   result.status === 'WARNING' ? '⚠️' : '❌';
      const color = result.status === 'PASSED' ? chalk.green : 
                   result.status === 'WARNING' ? chalk.yellow : chalk.red;
      
      console.log(color(`${icon} ${key.replace(/([A-Z])/g, ' $1').toUpperCase()}: ${result.score}/100`));
      console.log(color(`   ${result.message}`));
    });
    
    console.log(chalk.yellow('='.repeat(60)));
    console.log(chalk.bold.cyan(`Overall Next.js Compatibility Score: ${overallScore}/100`));

    if (overallScore >= 90) {
      console.log(chalk.green.bold('\n✅ NEXT.JS COMPATIBILITY EXCELLENT'));
      console.log(chalk.green('Ready for production deployment'));
    } else if (overallScore >= 80) {
      console.log(chalk.yellow.bold('\n⚠️  NEXT.JS COMPATIBILITY GOOD'));
      console.log(chalk.yellow('Minor improvements recommended'));
    } else {
      console.log(chalk.red.bold('\n❌ NEXT.JS COMPATIBILITY ISSUES'));
      console.log(chalk.red('Significant improvements required'));
    }
  }
}

// Export singleton instance
export const compatibilityValidator = new NextJSCompatibilityValidator();
export default compatibilityValidator;
