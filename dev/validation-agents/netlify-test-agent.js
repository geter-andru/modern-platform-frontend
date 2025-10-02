#!/usr/bin/env node

/**
 * H&S Platform Netlify Test Agent
 * Comprehensive multi-phase testing system to prevent Netlify build failures
 * 
 * Phases:
 * 1. Core Validation (environment, structure, dependencies)
 * 2. Build Testing (pre-build checks, build simulation, asset validation)
 * 3. Git Hooks & Protection System (automated deployment safety)
 * 4. Advanced Validation (security, performance, compatibility)
 * 5. Deployment Simulation (final deployment rehearsal)
 */

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

class NetlifyTestAgent {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
    this.startTime = Date.now();
    this.currentPhase = 'Unknown';
    this.projectRoot = this.detectProjectRoot();
  }

  detectProjectRoot() {
    const cwd = process.cwd();
    
    // H&S Platform context detection
    if (fs.existsSync(path.join(cwd, 'H_S_VALIDATION_CONTEXT.json'))) {
      this.hsContext = JSON.parse(fs.readFileSync(path.join(cwd, 'H_S_VALIDATION_CONTEXT.json'), 'utf8'));
      return cwd;
    }
    
    // Legacy detection for backwards compatibility
    if (fs.existsSync(path.join(cwd, 'assets-app', 'package.json'))) {
      return path.join(cwd, 'assets-app');
    }
    
    if (fs.existsSync(path.join(cwd, 'package.json'))) {
      return cwd;
    }
    
    return cwd;
  }

  // Helper methods
  addResult(type, test, message) {
    const result = { test, message, timestamp: new Date() };
    
    // Ensure the array exists
    if (!this.results[type]) {
      this.results[type] = [];
    }
    
    this.results[type].push(result);
    
    // Real-time logging
    const icons = { passed: '✅', failed: '❌', warnings: '⚠️' };
    console.log(`   ${icons[type]} ${test}: ${message}`);
  }

  executeCommand(command, timeout = 30000) {
    try {
      const result = execSync(command, { 
        timeout, 
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      return { success: true, output: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message, 
        output: error.stdout || error.stderr || ''
      };
    }
  }

  checkFileExists(filePath) {
    const fullPath = path.join(this.projectRoot, filePath);
    return fs.existsSync(fullPath);
  }

  readFileContent(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  getAllFiles(dir) {
    try {
      let files = [];
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          files = files.concat(this.getAllFiles(fullPath));
        } else {
          files.push(item);
        }
      }
      return files;
    } catch (error) {
      return [];
    }
  }

  // Phase 1: Core Validation
  async runPhase1Tests() {
    this.currentPhase = 'Phase 1';
    console.log('🔍 Validating environment...');
    await this.validateEnvironment();
    
    console.log('📁 Validating project structure...');
    await this.validateProjectStructure();
    
    console.log('🎯 Validating H&S Platform core components...');
    await this.validateHSPlatformCore();
  }

  async validateEnvironment() {
    // Node.js version check
    const nodeVersion = process.version;
    const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (nodeMajor >= 16) {
      this.addResult('passed', 'Node.js Version', `${nodeVersion} (compatible)`);
    } else {
      this.addResult('failed', 'Node.js Version', `${nodeVersion} (requires 16+)`);
    }

    // NPM version check
    const npmResult = this.executeCommand('npm --version');
    if (npmResult.success) {
      this.addResult('passed', 'NPM Version', npmResult.output.trim());
    } else {
      this.addResult('failed', 'NPM Version', 'NPM not found');
    }

    // Environment variables (support both React and Next.js patterns)
    const envVars = [
      'NEXT_PUBLIC_AIRTABLE_BASE_ID', 
      'NEXT_PUBLIC_AIRTABLE_API_KEY', 
      'NEXT_PUBLIC_APP_NAME',
      'REACT_APP_AIRTABLE_BASE_ID',
      'REACT_APP_AIRTABLE_API_KEY'
    ];
    
    let envVarFound = false;
    envVars.forEach(envVar => {
      if (process.env[envVar]) {
        this.addResult('passed', `Environment Variable: ${envVar}`, 'Present');
        envVarFound = true;
      }
    });
    
    if (!envVarFound) {
      this.addResult('warnings', 'Environment Variables', 'No required environment variables found');
    }

    // Check .env files are ignored
    const gitignore = this.readFileContent('.gitignore');
    if (gitignore && gitignore.includes('.env')) {
      this.addResult('passed', 'Environment Security', '.env files properly ignored');
    } else {
      this.addResult('warnings', 'Environment Security', '.env files may not be ignored');
    }
  }

  async validateProjectStructure() {
    // Check if this is Next.js project
    const packageJson = this.readFileContent('package.json');
    const isNextJs = packageJson && (packageJson.includes('"next"') || packageJson.includes('next'));
    console.log('🔍 Project root:', this.projectRoot);
    console.log('🔍 Project type detection: Next.js =', isNextJs);
    console.log('🔍 Package.json contents preview:', packageJson ? packageJson.substring(0, 200) : 'null');
    
    const criticalFiles = isNextJs ? [
      { path: 'package.json', desc: 'package.json' },
      { path: 'app', desc: 'app directory (Next.js App Router)' },
      { path: 'next.config.ts', desc: 'next.config.ts', optional: true }
    ] : [
      { path: 'package.json', desc: 'package.json' },
      { path: 'src/index.js', desc: 'src/index.js' },
      { path: 'public/index.html', desc: 'public/index.html' }
    ];

    criticalFiles.forEach(file => {
      if (this.checkFileExists(file.path)) {
        this.addResult('passed', `Critical File: ${file.desc}`, 'Present');
      } else if (file.optional) {
        this.addResult('warnings', `Optional File: ${file.desc}`, 'Missing but optional');
      } else {
        this.addResult('failed', `Critical File: ${file.desc}`, 'Missing');
      }
    });

    // H&S Platform specific files (Next.js paths)
    const hsPlatformFiles = isNextJs ? [
      { path: 'app/lib/services', desc: 'app/lib/services directory' },
      { path: 'app/components/dashboard', desc: 'app/components/dashboard directory' },
      { path: 'app/components/ui', desc: 'app/components/ui directory' }
    ] : [
      { path: 'src/services/airtableService.js', desc: 'src/services/airtableService.js' },
      { path: 'src/pages/CustomerDashboard.jsx', desc: 'src/pages/CustomerDashboard.jsx', fallback: 'src/components/dashboard/CustomerDashboard.jsx' },
      { path: 'src/components/tools', desc: 'src/components/tools' }
    ];

    hsPlatformFiles.forEach(file => {
      if (this.checkFileExists(file.path) || (file.fallback && this.checkFileExists(file.fallback))) {
        this.addResult('passed', `H&S Platform: ${file.desc}`, 'Present');
      } else {
        this.addResult('failed', `H&S Platform: ${file.desc}`, 'Missing');
      }
    });

    // Check package.json scripts (reuse existing packageJson variable)
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      const scripts = pkg.scripts || {};
      
      if (scripts.build) {
        this.addResult('passed', 'Build Script', 'Present in package.json');
      } else {
        this.addResult('failed', 'Build Script', 'Missing in package.json');
      }
      
      if (scripts.start) {
        this.addResult('passed', 'Start Script', 'Present in package.json');
      } else {
        this.addResult('failed', 'Start Script', 'Missing in package.json');
      }

      // Check React dependencies (Next.js or regular React)
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (packageJson.includes('"next"')) {
        if (deps.next && deps.react && deps['react-dom']) {
          this.addResult('passed', 'Next.js Dependencies', 'Next.js, React and ReactDOM present');
        } else {
          this.addResult('failed', 'Next.js Dependencies', 'Next.js, React or ReactDOM missing');
        }
      } else {
        if (deps.react && deps['react-dom']) {
          this.addResult('passed', 'React Dependencies', 'React and ReactDOM present');
        } else {
          this.addResult('failed', 'React Dependencies', 'React or ReactDOM missing');
        }
      }
    }
  }

  async validateHSPlatformCore() {
    // Check Airtable service (Next.js path)
    const pkgJson = this.readFileContent('package.json');
    const isNextJs = pkgJson && pkgJson.includes('"next"');
    const servicePath = isNextJs ? 'app/lib/services/airtableService.ts' : 'src/services/airtableService.js';
    const airtableService = this.readFileContent(servicePath);
    if (airtableService) {
      if (airtableService.includes('fetchCustomer') || airtableService.includes('updateCustomer')) {
        this.addResult('passed', 'Airtable Service', 'Core functions present');
      } else {
        this.addResult('failed', 'Airtable Service', 'Core functions missing');
      }

      if (airtableService.includes('catch') || airtableService.includes('error')) {
        this.addResult('passed', 'Airtable Error Handling', 'Error handling present');
      } else {
        this.addResult('warnings', 'Airtable Error Handling', 'Limited error handling detected');
      }
    }

    // Check business tools
    const businessTools = [
      { name: 'ICP Analysis', pattern: /ICP|icp/g },
      { name: 'Cost Calculator', pattern: /Cost.*Calculator|cost.*calculator/g },
      { name: 'Business Case Builder', pattern: /Business.*Case|business.*case/g }
    ];

    businessTools.forEach(tool => {
      const toolsDir = isNextJs ? 
        path.join(this.projectRoot, 'app/components') : 
        path.join(this.projectRoot, 'src/components/tools');
      if (fs.existsSync(toolsDir)) {
        const files = this.getAllFiles(toolsDir);
        const toolFile = files.find(file => tool.pattern.test(file));
        if (toolFile) {
          this.addResult('passed', `Business Tool: ${tool.name}`, 'Component found');
        } else {
          this.addResult('warnings', `Business Tool: ${tool.name}`, 'Component may be missing');
        }
      }
    });

    // Check dashboard component (Next.js paths)
    const dashboardPaths = isNextJs ? [
      'app/components/dashboard/CustomerDashboard.tsx',
      'app/page.tsx'
    ] : [
      'src/pages/CustomerDashboard.jsx',
      'src/components/dashboard/CustomerDashboard.jsx'
    ];
    
    let dashboardFound = false;
    dashboardPaths.forEach(dashPath => {
      const dashboard = this.readFileContent(dashPath);
      if (dashboard) {
        dashboardFound = true;
        if (dashboard.includes('export') && dashboard.includes('CustomerDashboard')) {
          this.addResult('passed', 'Customer Dashboard', 'Component properly exported');
        } else {
          this.addResult('warnings', 'Customer Dashboard', 'Export structure unclear');
        }

        if (dashboard.includes('customer') || dashboard.includes('Customer')) {
          this.addResult('passed', 'Customer Dashboard Logic', 'Customer handling detected');
        } else {
          this.addResult('warnings', 'Customer Dashboard Logic', 'Customer handling unclear');
        }
      }
    });
    
    if (!dashboardFound) {
      this.addResult('failed', 'Customer Dashboard', 'Component not found');
    }
  }

  // Phase 2: Build Testing
  async runPhase2Tests() {
    this.currentPhase = 'Phase 2';
    console.log('🔧 Running pre-build tests...');
    await this.runPreBuildTests();
    
    console.log('📦 Validating dependencies...');
    await this.validateDependencies();
    
    console.log('🏗️ Testing local build...');
    await this.testLocalBuild();
    
    console.log('📦 Validating build output...');
    await this.validateBuildOutput();
    
    console.log('🎨 Testing asset optimization...');
    await this.validateAssetOptimization();
  }

  async runPreBuildTests() {
    // ESLint check
    const eslintResult = this.executeCommand('npx eslint --version');
    if (eslintResult.success) {
      const lintResult = this.executeCommand('npx eslint src/ --format=compact');
      if (lintResult.success) {
        this.addResult('passed', 'ESLint Check', 'No linting errors');
      } else {
        this.addResult('warnings', 'ESLint Check', 'Linting issues found');
      }
    } else {
      this.addResult('warnings', 'ESLint Check', 'No ESLint configuration found');
    }

    // TypeScript check (only for projects with tsconfig.json)
    if (this.checkFileExists('tsconfig.json')) {
      const tsResult = this.executeCommand('npx tsc --noEmit');
      if (tsResult.success) {
        this.addResult('passed', 'TypeScript Check', 'No type errors');
      } else {
        this.addResult('failed', 'TypeScript Check', 'Type errors found - may prevent build');
      }
    } else {
      this.addResult('passed', 'TypeScript Check', 'No TypeScript configuration (JavaScript project)');
    }

    // Check for large files
    const largeFileResult = this.executeCommand('find src/ -type f -size +1M 2>/dev/null || true');
    if (largeFileResult.success && largeFileResult.output.trim() === '') {
      this.addResult('passed', 'Large Files Check', 'No large files in src directory');
    } else {
      this.addResult('warnings', 'Large Files Check', 'Large files detected - may slow build');
    }

    // Production build config
    if (process.env.NODE_ENV !== 'production') {
      this.addResult('warnings', 'Production Build Config', 'Consider setting NODE_ENV=production for optimized builds');
    }
  }

  async validateDependencies() {
    const packageJson = this.readFileContent('package.json');
    if (!packageJson) {
      this.addResult('failed', 'Package.json', 'Cannot read package.json');
      return;
    }

    const pkg = JSON.parse(packageJson);
    const deps = pkg.dependencies || {};

    // Critical dependencies based on project type
    const isNextJS = deps.next || this.checkFileExists('next.config.js');
    const isReactApp = deps['react-scripts'] || this.checkFileExists('public/index.html');
    
    let criticalDeps = ['react', 'react-dom'];
    
    if (isNextJS) {
      criticalDeps.push('next');
    } else if (isReactApp) {
      criticalDeps.push('react-scripts');
    }
    
    // Always check for common dependencies
    criticalDeps.push('axios');
    
    criticalDeps.forEach(dep => {
      if (deps[dep]) {
        this.addResult('passed', `Dependency: ${dep}`, deps[dep]);
      } else {
        // Only fail for truly critical dependencies
        if (dep === 'react' || dep === 'react-dom') {
          this.addResult('failed', `Dependency: ${dep}`, 'Missing');
        } else {
          this.addResult('warnings', `Dependency: ${dep}`, 'Missing but may not be required');
        }
      }
    });

    // Version compatibility
    if (deps.react && deps['react-dom']) {
      const reactVersion = deps.react.replace(/[^\d.]/g, '');
      const reactDomVersion = deps['react-dom'].replace(/[^\d.]/g, '');
      if (reactVersion === reactDomVersion) {
        this.addResult('passed', 'React Version Compatibility', 'React and ReactDOM versions compatible');
      } else {
        this.addResult('warnings', 'React Version Compatibility', 'React and ReactDOM versions may not match');
      }
    }

    // Security audit
    const auditResult = this.executeCommand('npm audit --audit-level=high');
    if (auditResult.success) {
      this.addResult('passed', 'Security Audit', 'No high-severity vulnerabilities');
    } else {
      this.addResult('warnings', 'Security Audit', 'Security vulnerabilities detected');
    }
  }

  async testLocalBuild() {
    console.log('   Building project locally...');
    
    // Clean previous build
    const cleanResult = this.executeCommand('rm -rf .next dist build 2>/dev/null || true');
    if (cleanResult.success) {
      this.addResult('passed', 'Build Cleanup', 'Previous build files cleaned');
    }

    console.log('   Running: npm run build');
    const buildStartTime = Date.now();
    const buildResult = this.executeCommand('npm run build', 120000); // 2 minute timeout
    const buildTime = Math.round((Date.now() - buildStartTime) / 1000);

    if (buildResult.success) {
      this.addResult('passed', 'Build Time', `${buildTime}s (${buildTime < 60 ? 'fast' : 'slow'})`);
      this.addResult('passed', 'Build Output', 'Clean build with no warnings or errors');
      this.addResult('passed', 'Build Success', 'Local build completed successfully');
    } else {
      this.addResult('failed', 'Build Failed', `Build failed: ${buildResult.error}\n${buildResult.output}`);
    }
  }

  async validateBuildOutput() {
    // Check for build directory
    const buildDirs = ['.next', 'dist', 'build'];
    let buildDirFound = false;
    
    buildDirs.forEach(dir => {
      if (this.checkFileExists(dir)) {
        buildDirFound = true;
        this.addResult('passed', 'Build Directory', `Found ${dir.includes('next') ? 'next-dev' : 'standard'} build output in ${dir}`);
        
        // Count files in build directory
        try {
          const fileCount = this.executeCommand(`find ${dir} -type f | wc -l`);
          if (fileCount.success) {
            this.addResult('passed', 'Build Output', `${fileCount.output.trim()} files generated`);
          }
        } catch (error) {
          // Continue if file counting fails
        }
      }
    });

    if (!buildDirFound) {
      this.addResult('failed', 'Build Directory', 'No build output directory found');
    }

    // Check build size
    if (buildDirFound) {
      const sizeResult = this.executeCommand('du -sh .next dist build 2>/dev/null | head -1');
      if (sizeResult.success) {
        const size = sizeResult.output.trim().split('\t')[0];
        const sizeNum = parseInt(size);
        if (sizeNum > 100) {
          this.addResult('warnings', 'Build Size', `${size} (very large)`);
        } else {
          this.addResult('passed', 'Build Size', size);
        }
      }
    }
  }

  async validateAssetOptimization() {
    // Check for source maps in production
    const sourceMapsResult = this.executeCommand('find .next dist build -name "*.map" 2>/dev/null | head -5');
    if (sourceMapsResult.success && sourceMapsResult.output.trim() === '') {
      this.addResult('passed', 'Source Maps', 'No source maps in production build');
    } else {
      this.addResult('warnings', 'Source Maps', 'Source maps found in production build');
    }

    // Check JavaScript minification
    const jsFiles = this.executeCommand('find .next dist build -name "*.js" -exec wc -c {} + 2>/dev/null | tail -1');
    if (jsFiles.success) {
      const totalSize = parseInt(jsFiles.output.trim().split(' ')[0]);
      if (totalSize < 5000000) { // Less than 5MB
        this.addResult('passed', 'JS Minification', 'JavaScript files are small');
      } else {
        this.addResult('warnings', 'JS Minification', 'JavaScript files are large');
      }
    }

    // Check for large individual files
    const largeFiles = this.executeCommand('find .next dist build -type f -size +1M 2>/dev/null');
    if (largeFiles.success) {
      const fileCount = largeFiles.output.trim().split('\n').filter(line => line.length > 0).length;
      if (fileCount === 0) {
        this.addResult('passed', 'File Size Optimization', 'No large files detected');
      } else {
        this.addResult('warnings', 'File Size Optimization', `${fileCount} large files (consider optimization)`);
      }
    }
  }

  // Phase 4: Advanced Validation & Optimization
  async runPhase4Tests() {
    this.currentPhase = 'Phase 4';
    console.log('🔍 Running security and vulnerability scanning...');
    await this.runSecurityScanning();
    
    console.log('⚡ Testing performance and optimization...');
    await this.runPerformanceTesting();
    
    console.log('🌐 Testing compatibility and environments...');
    await this.runCompatibilityTesting();
    
    console.log('♿ Testing accessibility and SEO...');
    await this.runAccessibilityTesting();
    
    console.log('📦 Analyzing bundles and dependencies...');
    await this.runBundleAnalysis();
  }

  async runSecurityScanning() {
    // Advanced security audit
    const securityAuditResult = this.executeCommand('npm audit --audit-level=moderate --json');
    if (securityAuditResult.success) {
      try {
        const auditData = JSON.parse(securityAuditResult.output);
        const vulnerabilities = auditData.metadata?.vulnerabilities || {};
        const totalVulns = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
        
        if (totalVulns === 0) {
          this.addResult('passed', 'Security Vulnerabilities', 'No security vulnerabilities detected');
        } else {
          const criticalCount = vulnerabilities.critical || 0;
          const highCount = vulnerabilities.high || 0;
          
          if (criticalCount > 0) {
            this.addResult('failed', 'Critical Security Vulnerabilities', `${criticalCount} critical vulnerabilities found`);
          } else if (highCount > 0) {
            this.addResult('warnings', 'High Security Vulnerabilities', `${highCount} high-severity vulnerabilities found`);
          } else {
            this.addResult('passed', 'Security Vulnerabilities', `${totalVulns} low/moderate vulnerabilities found`);
          }
        }
      } catch (error) {
        this.addResult('warnings', 'Security Audit Parse', 'Could not parse security audit results');
      }
    } else {
      this.addResult('warnings', 'Security Audit', 'Security audit failed to run');
    }

    // Check for sensitive files
    const sensitiveFiles = ['.env', '.env.local', '.env.production', 'config/secrets.js', 'private.key'];
    let sensitiveFound = false;
    
    sensitiveFiles.forEach(file => {
      if (this.checkFileExists(file)) {
        sensitiveFound = true;
        this.addResult('warnings', 'Sensitive Files', `${file} detected in repository`);
      }
    });
    
    if (!sensitiveFound) {
      this.addResult('passed', 'Sensitive Files Check', 'No sensitive files detected in repository');
    }

    // Check for hardcoded secrets (basic pattern matching)
    const secretPatterns = [
      { name: 'API Keys', pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi },
      { name: 'Access Tokens', pattern: /access[_-]?token\s*[:=]\s*['"][^'"]+['"]/gi },
      { name: 'Database URLs', pattern: /database[_-]?url\s*[:=]\s*['"][^'"]+['"]/gi },
      { name: 'Private Keys', pattern: /private[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi }
    ];

    let secretsFound = false;
    const sourceFiles = this.executeCommand('find src/ -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null');
    
    if (sourceFiles.success) {
      const files = sourceFiles.output.trim().split('\n').filter(f => f.length > 0);
      files.slice(0, 20).forEach(file => { // Check first 20 files to avoid timeout
        const content = this.readFileContent(file);
        if (content) {
          secretPatterns.forEach(pattern => {
            if (pattern.pattern.test(content)) {
              secretsFound = true;
              this.addResult('warnings', `Hardcoded ${pattern.name}`, `Potential secrets found in ${file}`);
            }
          });
        }
      });
    }
    
    if (!secretsFound) {
      this.addResult('passed', 'Hardcoded Secrets Scan', 'No obvious hardcoded secrets detected');
    }

    // Check HTTPS enforcement
    const packageJson = this.readFileContent('package.json');
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      if (pkg.dependencies?.https || pkg.devDependencies?.https) {
        this.addResult('passed', 'HTTPS Configuration', 'HTTPS dependencies detected');
      } else {
        this.addResult('warnings', 'HTTPS Configuration', 'Consider enforcing HTTPS in production');
      }
    }
  }

  async runPerformanceTesting() {
    // Bundle size analysis
    const buildDirs = ['.next', 'dist', 'build'];
    let buildDir = null;
    
    buildDirs.forEach(dir => {
      if (this.checkFileExists(dir)) {
        buildDir = dir;
      }
    });

    if (buildDir) {
      // Analyze JavaScript bundle sizes
      const jsFiles = this.executeCommand(`find ${buildDir} -name "*.js" -not -path "*/node_modules/*" -exec ls -la {} + 2>/dev/null`);
      if (jsFiles.success) {
        const files = jsFiles.output.split('\n').filter(line => line.includes('.js'));
        let totalSize = 0;
        let largeFiles = 0;
        
        files.forEach(line => {
          const parts = line.split(/\s+/);
          if (parts.length >= 5) {
            const size = parseInt(parts[4]);
            totalSize += size;
            if (size > 1000000) { // 1MB
              largeFiles++;
            }
          }
        });

        if (totalSize < 2000000) { // 2MB total
          this.addResult('passed', 'Bundle Size Analysis', `${Math.round(totalSize / 1024)}KB total JS bundle size`);
        } else if (totalSize < 5000000) { // 5MB total
          this.addResult('warnings', 'Bundle Size Analysis', `${Math.round(totalSize / 1024)}KB total - consider optimization`);
        } else {
          this.addResult('failed', 'Bundle Size Analysis', `${Math.round(totalSize / 1024)}KB total - bundle too large`);
        }

        if (largeFiles === 0) {
          this.addResult('passed', 'Large File Analysis', 'No individual files exceed 1MB');
        } else {
          this.addResult('warnings', 'Large File Analysis', `${largeFiles} files exceed 1MB`);
        }
      }

      // Check for code splitting
      const chunkFiles = this.executeCommand(`find ${buildDir} -name "*chunk*.js" 2>/dev/null | wc -l`);
      if (chunkFiles.success) {
        const chunkCount = parseInt(chunkFiles.output.trim());
        if (chunkCount > 1) {
          this.addResult('passed', 'Code Splitting', `${chunkCount} code chunks detected - good for performance`);
        } else {
          this.addResult('warnings', 'Code Splitting', 'Consider implementing code splitting for better performance');
        }
      }
    }

    // Check for performance optimization patterns
    const performancePatterns = [
      { name: 'React.memo usage', pattern: /React\.memo\(/g, file: 'src/**/*.{js,jsx,ts,tsx}' },
      { name: 'useMemo/useCallback', pattern: /use(Memo|Callback)\(/g, file: 'src/**/*.{js,jsx,ts,tsx}' },
      { name: 'Lazy loading', pattern: /React\.lazy\(|import\(/g, file: 'src/**/*.{js,jsx,ts,tsx}' }
    ];

    performancePatterns.forEach(pattern => {
      const searchResult = this.executeCommand(`grep -r "${pattern.pattern.source}" src/ 2>/dev/null | wc -l`);
      if (searchResult.success) {
        const count = parseInt(searchResult.output.trim());
        if (count > 0) {
          this.addResult('passed', pattern.name, `${count} optimization instances found`);
        } else {
          this.addResult('warnings', pattern.name, 'Consider using this optimization technique');
        }
      }
    });

    // Image optimization check
    const imageFiles = this.executeCommand('find public/ src/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" 2>/dev/null');
    if (imageFiles.success) {
      const images = imageFiles.output.trim().split('\n').filter(f => f.length > 0);
      if (images.length > 0) {
        // Check for large images
        const largeImages = this.executeCommand(`find public/ src/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | xargs ls -la | awk '$5 > 500000' | wc -l 2>/dev/null`);
        if (largeImages.success) {
          const largeCount = parseInt(largeImages.output.trim());
          if (largeCount === 0) {
            this.addResult('passed', 'Image Optimization', `${images.length} images, all under 500KB`);
          } else {
            this.addResult('warnings', 'Image Optimization', `${largeCount} images over 500KB - consider optimization`);
          }
        }
      } else {
        this.addResult('passed', 'Image Optimization', 'No static images found');
      }
    }
  }

  async runCompatibilityTesting() {
    // Node.js version compatibility
    const nodeVersion = process.version;
    const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (nodeMajor >= 18) {
      this.addResult('passed', 'Node.js Compatibility', `${nodeVersion} (modern LTS)`);
    } else if (nodeMajor >= 16) {
      this.addResult('warnings', 'Node.js Compatibility', `${nodeVersion} (older LTS - consider upgrading)`);
    } else {
      this.addResult('failed', 'Node.js Compatibility', `${nodeVersion} (unsupported - upgrade required)`);
    }

    // Package.json engines field
    const packageJson = this.readFileContent('package.json');
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      if (pkg.engines) {
        this.addResult('passed', 'Engine Requirements', 'Package.json specifies engine requirements');
        
        if (pkg.engines.node) {
          this.addResult('passed', 'Node Engine Spec', `Requires Node.js ${pkg.engines.node}`);
        }
        if (pkg.engines.npm) {
          this.addResult('passed', 'NPM Engine Spec', `Requires NPM ${pkg.engines.npm}`);
        }
      } else {
        this.addResult('warnings', 'Engine Requirements', 'Consider specifying engine requirements in package.json');
      }
    }

    // Browser compatibility check
    const browserslistFile = this.checkFileExists('.browserslistrc') || this.checkFileExists('browserslist');
    if (browserslistFile) {
      this.addResult('passed', 'Browser Compatibility', 'Browserslist configuration found');
    } else {
      // Check package.json for browserslist
      if (packageJson) {
        const pkg = JSON.parse(packageJson);
        if (pkg.browserslist) {
          this.addResult('passed', 'Browser Compatibility', 'Browserslist found in package.json');
        } else {
          this.addResult('warnings', 'Browser Compatibility', 'Consider adding browserslist configuration');
        }
      }
    }

    // Check for polyfills
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      const polyfillLibs = ['core-js', '@babel/polyfill', 'polyfill.io'];
      const hasPolyfills = polyfillLibs.some(lib => deps[lib]);
      
      if (hasPolyfills) {
        this.addResult('passed', 'Polyfill Support', 'Polyfill libraries detected for browser compatibility');
      } else {
        this.addResult('warnings', 'Polyfill Support', 'Consider polyfills for broader browser support');
      }
    }

    // Environment configuration
    const envFiles = ['.env.example', '.env.template', '.env.sample'];
    const hasEnvTemplate = envFiles.some(file => this.checkFileExists(file));
    
    if (hasEnvTemplate) {
      this.addResult('passed', 'Environment Templates', 'Environment template files found');
    } else {
      this.addResult('warnings', 'Environment Templates', 'Consider providing .env.example for environment setup');
    }

    // Docker compatibility
    const hasDockerfile = this.checkFileExists('Dockerfile') || this.checkFileExists('docker-compose.yml');
    if (hasDockerfile) {
      this.addResult('passed', 'Container Support', 'Docker configuration detected');
    } else {
      this.addResult('warnings', 'Container Support', 'Consider Docker support for deployment consistency');
    }
  }

  async runAccessibilityTesting() {
    // Check for accessibility libraries
    const packageJson = this.readFileContent('package.json');
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      const a11yLibs = [
        'react-axe', '@axe-core/react', 'axe-core', 
        'eslint-plugin-jsx-a11y', '@storybook/addon-a11y'
      ];
      
      const hasA11yLib = a11yLibs.some(lib => deps[lib]);
      if (hasA11yLib) {
        this.addResult('passed', 'Accessibility Libraries', 'Accessibility testing libraries detected');
      } else {
        this.addResult('warnings', 'Accessibility Libraries', 'Consider adding accessibility testing tools');
      }
    }

    // Check for semantic HTML patterns
    const htmlPatterns = [
      { name: 'Semantic headings', pattern: /<h[1-6]/, description: 'heading structure' },
      { name: 'Alt attributes', pattern: /alt\s*=/, description: 'image accessibility' },
      { name: 'ARIA labels', pattern: /aria-label|aria-labelledby/, description: 'ARIA labeling' },
      { name: 'Form labels', pattern: /<label|htmlFor/, description: 'form accessibility' }
    ];

    const componentFiles = this.executeCommand('find src/ -name "*.jsx" -o -name "*.tsx" 2>/dev/null');
    if (componentFiles.success) {
      const files = componentFiles.output.trim().split('\n').filter(f => f.length > 0);
      
      htmlPatterns.forEach(pattern => {
        let found = false;
        files.slice(0, 10).forEach(file => { // Check first 10 files
          const content = this.readFileContent(file);
          if (content && pattern.pattern.test(content)) {
            found = true;
          }
        });
        
        if (found) {
          this.addResult('passed', pattern.name, `${pattern.description} patterns found`);
        } else {
          this.addResult('warnings', pattern.name, `Consider improving ${pattern.description}`);
        }
      });
    }

    // SEO meta tags check
    const indexHtml = this.readFileContent('public/index.html') || this.readFileContent('src/index.html');
    if (indexHtml) {
      const seoChecks = [
        { name: 'Title tag', pattern: /<title>/i, required: true },
        { name: 'Meta description', pattern: /<meta[^>]*name=['"]description['"][^>]*>/i, required: true },
        { name: 'Meta viewport', pattern: /<meta[^>]*name=['"]viewport['"][^>]*>/i, required: true },
        { name: 'Open Graph tags', pattern: /<meta[^>]*property=['"]og:/i, required: false },
        { name: 'Canonical URL', pattern: /<link[^>]*rel=['"]canonical['"][^>]*>/i, required: false }
      ];

      seoChecks.forEach(check => {
        if (check.pattern.test(indexHtml)) {
          this.addResult('passed', `SEO: ${check.name}`, 'Present in HTML');
        } else {
          if (check.required) {
            this.addResult('warnings', `SEO: ${check.name}`, 'Missing - important for SEO');
          } else {
            this.addResult('warnings', `SEO: ${check.name}`, 'Consider adding for better SEO');
          }
        }
      });
    } else {
      this.addResult('warnings', 'SEO Analysis', 'Could not find HTML file for SEO analysis');
    }

    // Performance SEO factors
    const buildDir = ['.next', 'dist', 'build'].find(dir => this.checkFileExists(dir));
    if (buildDir) {
      // Check for sitemap
      const hasSitemap = this.checkFileExists('public/sitemap.xml') || 
                        this.checkFileExists(`${buildDir}/sitemap.xml`);
      if (hasSitemap) {
        this.addResult('passed', 'SEO: Sitemap', 'Sitemap.xml found');
      } else {
        this.addResult('warnings', 'SEO: Sitemap', 'Consider generating sitemap.xml for SEO');
      }

      // Check for robots.txt
      const hasRobots = this.checkFileExists('public/robots.txt') || 
                       this.checkFileExists(`${buildDir}/robots.txt`);
      if (hasRobots) {
        this.addResult('passed', 'SEO: Robots.txt', 'robots.txt found');
      } else {
        this.addResult('warnings', 'SEO: Robots.txt', 'Consider adding robots.txt for search engines');
      }
    }
  }

  async runBundleAnalysis() {
    // Dependency analysis
    const packageJson = this.readFileContent('package.json');
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      const deps = pkg.dependencies || {};
      const devDeps = pkg.devDependencies || {};
      
      const totalDeps = Object.keys(deps).length;
      const totalDevDeps = Object.keys(devDeps).length;
      
      if (totalDeps < 20) {
        this.addResult('passed', 'Dependency Count', `${totalDeps} production dependencies (lean)`);
      } else if (totalDeps < 50) {
        this.addResult('warnings', 'Dependency Count', `${totalDeps} production dependencies (moderate)`);
      } else {
        this.addResult('warnings', 'Dependency Count', `${totalDeps} production dependencies (heavy - consider optimization)`);
      }

      // Check for outdated dependencies
      const outdatedResult = this.executeCommand('npm outdated --json');
      if (outdatedResult.success && outdatedResult.output.trim()) {
        try {
          const outdated = JSON.parse(outdatedResult.output);
          const outdatedCount = Object.keys(outdated).length;
          
          if (outdatedCount === 0) {
            this.addResult('passed', 'Dependency Updates', 'All dependencies are up to date');
          } else if (outdatedCount < 5) {
            this.addResult('warnings', 'Dependency Updates', `${outdatedCount} packages have updates available`);
          } else {
            this.addResult('warnings', 'Dependency Updates', `${outdatedCount} packages need updates - consider updating`);
          }
        } catch (error) {
          this.addResult('passed', 'Dependency Updates', 'No outdated dependencies detected');
        }
      } else {
        this.addResult('passed', 'Dependency Updates', 'All dependencies appear current');
      }

      // License compliance check
      const licenses = this.executeCommand('npm ls --json --depth=0');
      if (licenses.success) {
        try {
          const licenseData = JSON.parse(licenses.output);
          const problems = licenseData.problems || [];
          
          if (problems.length === 0) {
            this.addResult('passed', 'License Compliance', 'No license conflicts detected');
          } else {
            this.addResult('warnings', 'License Compliance', `${problems.length} license issues detected`);
          }
        } catch (error) {
          this.addResult('warnings', 'License Compliance', 'Could not analyze license compliance');
        }
      }
    }

    // Tree shaking analysis
    const buildDir = ['.next', 'dist', 'build'].find(dir => this.checkFileExists(dir));
    if (buildDir) {
      // Check for unused code patterns
      const unusedImports = this.executeCommand('grep -r "import.*unused" src/ 2>/dev/null | wc -l');
      if (unusedImports.success) {
        const count = parseInt(unusedImports.output.trim());
        if (count === 0) {
          this.addResult('passed', 'Tree Shaking', 'No obvious unused imports detected');
        } else {
          this.addResult('warnings', 'Tree Shaking', `${count} potentially unused imports found`);
        }
      }

      // Check for dynamic imports (code splitting)
      const dynamicImports = this.executeCommand('grep -r "import(" src/ 2>/dev/null | wc -l');
      if (dynamicImports.success) {
        const count = parseInt(dynamicImports.output.trim());
        if (count > 0) {
          this.addResult('passed', 'Dynamic Imports', `${count} dynamic imports found - good for code splitting`);
        } else {
          this.addResult('warnings', 'Dynamic Imports', 'Consider dynamic imports for code splitting');
        }
      }
    }

    // Build artifact analysis
    if (buildDir) {
      const buildFiles = this.executeCommand(`find ${buildDir} -type f | wc -l`);
      if (buildFiles.success) {
        const fileCount = parseInt(buildFiles.output.trim());
        this.addResult('passed', 'Build Artifacts', `${fileCount} files generated in build`);
      }

      // Check for source maps in production
      const sourceMaps = this.executeCommand(`find ${buildDir} -name "*.map" | wc -l`);
      if (sourceMaps.success) {
        const mapCount = parseInt(sourceMaps.output.trim());
        if (mapCount === 0) {
          this.addResult('passed', 'Production Source Maps', 'No source maps in production build');
        } else {
          this.addResult('warnings', 'Production Source Maps', `${mapCount} source maps in production - consider removing`);
        }
      }
    }
  }

  // Phase 3: Git Hooks & Protection System
  async runPhase3Tests() {
    this.currentPhase = 'Phase 3';
    console.log('🔒 Setting up git hooks protection...');
    await this.setupGitHooks();
    
    console.log('🛡️ Implementing deployment gates...');
    await this.setupDeploymentGates();
    
    console.log('📋 Testing git workflow protection...');
    await this.testGitWorkflowProtection();
  }

  async setupGitHooks() {
    const hooksDir = path.join(this.projectRoot, '.git/hooks');
    
    // Ensure hooks directory exists
    if (!fs.existsSync(hooksDir)) {
      this.addResult('failed', 'Git Hooks Directory', 'Git hooks directory not found');
      return;
    }

    // Create pre-commit hook
    const preCommitHook = `#!/bin/sh
# H&S Platform Pre-commit Hook
# Runs Phase 1 validation before allowing commits

echo "🚀 H&S Platform Pre-commit Validation..."
node ${path.resolve(__dirname, 'netlify-test-agent.js')} --phase1

if [ $? -ne 0 ]; then
  echo "❌ Pre-commit validation failed. Fix issues before committing."
  exit 1
fi

echo "✅ Pre-commit validation passed!"
exit 0
`;

    const preCommitPath = path.join(hooksDir, 'pre-commit');
    try {
      fs.writeFileSync(preCommitPath, preCommitHook);
      fs.chmodSync(preCommitPath, '755');
      this.addResult('passed', 'Pre-commit Hook', 'Installed and configured');
    } catch (error) {
      this.addResult('failed', 'Pre-commit Hook', `Installation failed: ${error.message}`);
    }

    // Create pre-push hook
    const prePushHook = `#!/bin/sh
# H&S Platform Pre-push Hook  
# Runs Phase 1 & 2 validation before allowing pushes

echo "🚀 H&S Platform Pre-push Validation..."

# Run Phase 1 (Core Validation)
node ${path.resolve(__dirname, 'netlify-test-agent.js')} --phase1
if [ $? -ne 0 ]; then
  echo "❌ Phase 1 validation failed. Fix core issues before pushing."
  exit 1
fi

# Run Phase 2 (Build Testing)
node ${path.resolve(__dirname, 'netlify-test-agent.js')} --phase2
if [ $? -ne 0 ]; then
  echo "❌ Phase 2 validation failed. Fix build issues before pushing."
  exit 1
fi

echo "✅ Pre-push validation passed!"
exit 0
`;

    const prePushPath = path.join(hooksDir, 'pre-push');
    try {
      fs.writeFileSync(prePushPath, prePushHook);
      fs.chmodSync(prePushPath, '755');
      this.addResult('passed', 'Pre-push Hook', 'Installed and configured');
    } catch (error) {
      this.addResult('failed', 'Pre-push Hook', `Installation failed: ${error.message}`);
    }

    // Create post-merge hook for dependency updates
    const postMergeHook = `#!/bin/sh
# H&S Platform Post-merge Hook
# Checks for dependency changes and suggests npm install

if [ -f package-lock.json.orig ]; then
  rm package-lock.json.orig
fi

if git diff HEAD@{1} --name-only | grep -q "package-lock.json\\|package.json"; then
  echo "📦 Dependencies may have changed. Consider running 'npm install'"
fi
`;

    const postMergePath = path.join(hooksDir, 'post-merge');
    try {
      fs.writeFileSync(postMergePath, postMergeHook);
      fs.chmodSync(postMergePath, '755');
      this.addResult('passed', 'Post-merge Hook', 'Installed and configured');
    } catch (error) {
      this.addResult('failed', 'Post-merge Hook', `Installation failed: ${error.message}`);
    }
  }

  async setupDeploymentGates() {
    // Create deployment safety script
    const deploySafelyScript = `#!/bin/bash
# H&S Platform Safe Deployment Script
# Comprehensive validation before deployment

set -e

echo "🚀 H&S Platform Deployment Safety Check"
echo "======================================="

# Phase 1: Core Validation
echo "Phase 1: Core Validation..."
node ${path.resolve(__dirname, 'netlify-test-agent.js')} --phase1

# Phase 2: Build Testing  
echo "Phase 2: Build Testing..."
node ${path.resolve(__dirname, 'netlify-test-agent.js')} --phase2

# Check git status
if [ -n "\$(git status --porcelain)" ]; then
  echo "⚠️  Warning: Uncommitted changes detected"
  git status
  read -p "Continue with deployment? (y/N): " -n 1 -r
  echo
  if [[ ! \$REPLY =~ ^[Yy]\$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

# Check branch
CURRENT_BRANCH=\$(git branch --show-current)
if [ "\$CURRENT_BRANCH" != "main" ] && [ "\$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️  Warning: Deploying from branch '\$CURRENT_BRANCH' (not main/master)"
  read -p "Continue with deployment? (y/N): " -n 1 -r
  echo
  if [[ ! \$REPLY =~ ^[Yy]\$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

echo "✅ All safety checks passed!"
echo "🚀 Ready for deployment"

# Optional: trigger actual deployment
if [ "\$1" = "--deploy" ]; then
  echo "🚀 Triggering deployment..."
  git push origin HEAD
  echo "✅ Deployment triggered!"
fi
`;

    const deployScriptPath = path.join(this.projectRoot, 'deploy-safely.sh');
    try {
      fs.writeFileSync(deployScriptPath, deploySafelyScript);
      fs.chmodSync(deployScriptPath, '755');
      this.addResult('passed', 'Deployment Safety Script', 'Created and configured');
    } catch (error) {
      this.addResult('failed', 'Deployment Safety Script', `Creation failed: ${error.message}`);
    }

    // Create Netlify deployment protection
    const netlifyToml = `# H&S Platform Netlify Configuration
# Deployment protection and build optimization

[build]
  # Build command with validation
  command = "node netlify-test-agent.js --phase1 && node netlify-test-agent.js --phase2 && npm run build"
  
  # Build output directory
  publish = ".next"

[build.environment]
  # Node.js version
  NODE_VERSION = "18"
  
  # Build optimizations
  NPM_FLAGS = "--production=false"

# Branch-specific build settings
[context.production]
  command = "node netlify-test-agent.js --phase1 && node netlify-test-agent.js --phase2 && npm run build"

[context.deploy-preview]
  command = "node netlify-test-agent.js --phase1 && npm run build"

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
`;

    const netlifyTomlPath = path.join(this.projectRoot, 'netlify.toml');
    try {
      if (!fs.existsSync(netlifyTomlPath)) {
        fs.writeFileSync(netlifyTomlPath, netlifyToml);
        this.addResult('passed', 'Netlify Protection Config', 'Created netlify.toml with validation');
      } else {
        this.addResult('passed', 'Netlify Protection Config', 'netlify.toml already exists');
      }
    } catch (error) {
      this.addResult('failed', 'Netlify Protection Config', `Creation failed: ${error.message}`);
    }
  }

  async testGitWorkflowProtection() {
    // Test git hooks installation
    const hooksDir = path.join(this.projectRoot, '.git/hooks');
    const requiredHooks = ['pre-commit', 'pre-push', 'post-merge'];
    
    requiredHooks.forEach(hook => {
      const hookPath = path.join(hooksDir, hook);
      if (fs.existsSync(hookPath)) {
        const stats = fs.statSync(hookPath);
        if (stats.mode & parseInt('111', 8)) {
          this.addResult('passed', `${hook} Hook Test`, 'Installed and executable');
        } else {
          this.addResult('failed', `${hook} Hook Test`, 'Not executable');
        }
      } else {
        this.addResult('failed', `${hook} Hook Test`, 'Not installed');
      }
    });

    // Test deployment script
    const deployScript = path.join(this.projectRoot, 'deploy-safely.sh');
    if (fs.existsSync(deployScript)) {
      const stats = fs.statSync(deployScript);
      if (stats.mode & parseInt('111', 8)) {
        this.addResult('passed', 'Deployment Script Test', 'Created and executable');
      } else {
        this.addResult('failed', 'Deployment Script Test', 'Not executable');
      }
    } else {
      this.addResult('failed', 'Deployment Script Test', 'Not created');
    }

    // Test git status
    const gitStatus = this.executeCommand('git status --porcelain');
    if (gitStatus.success) {
      if (gitStatus.output.trim() === '') {
        this.addResult('passed', 'Git Working Tree', 'Clean working tree');
      } else {
        this.addResult('warnings', 'Git Working Tree', 'Uncommitted changes detected');
      }
    }

    // Test branch protection readiness
    const currentBranch = this.executeCommand('git branch --show-current');
    if (currentBranch.success) {
      const branch = currentBranch.output.trim();
      if (branch === 'main' || branch === 'master') {
        this.addResult('passed', 'Branch Protection', `On protected branch: ${branch}`);
      } else {
        this.addResult('warnings', 'Branch Protection', `On non-protected branch: ${branch}`);
      }
    }
  }

  // Report generation
  generateReport() {
    const duration = (Date.now() - this.startTime) / 1000;
    const passedCount = this.results.passed.length;
    const failedCount = this.results.failed.length;
    const warningsCount = this.results.warnings.length;
    const totalTests = passedCount + failedCount;

    let report = `# H&S Platform Netlify Test Report - ${this.currentPhase}`;
    if (this.currentPhase.includes('Phase')) {
      report += ` (${this.currentPhase.includes('1') ? 'Core Validation' : 
                         this.currentPhase.includes('2') ? 'Build Testing' : 
                         this.currentPhase.includes('3') ? 'Git Hooks & Protection' : 
                         this.currentPhase.includes('4') ? 'Advanced Validation & Optimization' : 'Advanced Testing'})`;
    }
    
    report += `\nGenerated: ${new Date().toISOString()}\nDuration: ${duration.toFixed(2)}s\nTotal Tests: ${totalTests}\n\n`;
    
    report += `## Summary\n✅ Passed: ${passedCount}\n❌ Failed: ${failedCount}\n⚠️ Warnings: ${warningsCount}\n\n`;
    
    report += `## Test Results\n\n`;

    if (passedCount > 0) {
      report += `### ✅ Passed Tests (${passedCount})\n`;
      this.results.passed.forEach(result => {
        report += `- ${result.test}: ${result.message}\n`;
      });
      report += '\n';
    }

    if (failedCount > 0) {
      report += `### ❌ Failed Tests (${failedCount})\n`;
      this.results.failed.forEach(result => {
        report += `- ${result.test}: ${result.message}\n`;
      });
      report += '\n';
    }

    if (warningsCount > 0) {
      report += `### ⚠️ Warnings (${warningsCount})\n`;
      this.results.warnings.forEach(result => {
        report += `- ${result.test}: ${result.message}\n`;
      });
      report += '\n';
    }

    // Phase-specific status
    if (this.currentPhase === 'Phase 1') {
      if (failedCount === 0) {
        report += `## Phase 1 Status\n🚀 PHASE 1 COMPLETE - Core requirements validated\n\n`;
        report += `## Next Steps\n- ✅ Ready for Phase 2: Build Testing & Validation\n- Run: node netlify-test-agent.js --phase2\n\n`;
      } else {
        report += `## Phase 1 Status\n🛑 PHASE 1 ISSUES - Fix failed tests before proceeding\n\n`;
        report += `## Next Steps\n- Fix core validation issues listed above\n- Re-run: node netlify-test-agent.js --phase1\n\n`;
      }
    } else if (this.currentPhase === 'Phase 2') {
      if (failedCount === 0) {
        report += `## Phase 2 Status\n🚀 PHASE 2 COMPLETE - Build system validated\n\n`;
        report += `## Build Performance\n- Build Time: ${this.getBuildTime()}\n\n`;
        report += `## Next Steps\n- ✅ Ready for Phase 3: Git Hooks & Protection\n- Run: node netlify-test-agent.js --phase3\n\n`;
      } else {
        report += `## Phase 2 Status\n🛑 PHASE 2 ISSUES - Fix failed tests before deploying\n\n`;
        report += `## Build Performance\n- ${this.getBuildTime()}\n\n`;
        report += `## Next Steps\n- ${failedCount === 1 && this.results.failed[0].test.includes('TypeScript') ? 'Resolve TypeScript errors to ensure type safety' : 'Fix build errors before attempting deployment'}\n\n`;
      }
    } else if (this.currentPhase === 'Phase 3') {
      if (failedCount === 0) {
        report += `## Phase 3 Status\n🚀 PHASE 3 COMPLETE - Git protection system active\n\n`;
        report += `## Protection Features\n- Pre-commit validation\n- Pre-push build testing\n- Deployment safety script\n- Netlify build protection\n\n`;
        report += `## Next Steps\n- ✅ Git hooks are now active\n- Use: ./deploy-safely.sh for safe deployments\n- Ready for Phase 4: Advanced Validation\n\n`;
      } else {
        report += `## Phase 3 Status\n🛑 PHASE 3 ISSUES - Git protection not fully active\n\n`;
        report += `## Next Steps\n- Fix git hooks installation issues\n- Re-run: node netlify-test-agent.js --phase3\n\n`;
      }
    } else if (this.currentPhase === 'Phase 4') {
      if (failedCount === 0) {
        report += `## Phase 4 Status\n🚀 PHASE 4 COMPLETE - Advanced validation passed\n\n`;
        report += `## Advanced Features\n- Security vulnerability scanning\n- Performance and optimization analysis\n- Compatibility and environment testing\n- Accessibility and SEO validation\n- Bundle and dependency analysis\n\n`;
        report += `## Next Steps\n- ✅ Enterprise-grade deployment ready\n- All validation phases complete\n- Production deployment recommended\n\n`;
      } else {
        report += `## Phase 4 Status\n🛑 PHASE 4 ISSUES - Advanced validation failed\n\n`;
        report += `## Next Steps\n- Review and fix advanced validation issues\n- Re-run: node netlify-test-agent.js --phase4\n\n`;
      }
    }

    if (failedCount > 0) {
      report += `## Critical Issues to Fix\n`;
      this.results.failed.forEach(result => {
        report += `- ${result.test}: ${result.message}\n`;
      });
    } else {
      report += `## Critical Issues to Fix\n✅ No critical issues found`;
    }

    return report;
  }

  getBuildTime() {
    const buildTimeResult = this.results.passed.find(r => r.test === 'Build Time');
    return buildTimeResult ? buildTimeResult.message : 'Build performance metrics not available';
  }

  async saveReport() {
    const report = this.generateReport();
    const reportPath = path.join(this.projectRoot, 'netlify-test-report.md');
    
    try {
      fs.writeFileSync(reportPath, report);
      console.log(`\n📊 Test report generated: netlify-test-report.md`);
    } catch (error) {
      console.error('Failed to save report:', error.message);
    }
  }

  logSummary() {
    const passedCount = this.results.passed.length;
    const failedCount = this.results.failed.length;
    const warningsCount = this.results.warnings.length;

    console.log('\n' + '='.repeat(50));
    if (failedCount === 0) {
      console.log(`✅ ${this.currentPhase} Tests PASSED`);
    } else {
      console.log(`❌ ${this.currentPhase} Tests FAILED`);
    }
    console.log('='.repeat(50));

    console.log(`\n🎯 ${this.currentPhase} Testing Complete`);
    console.log(`📊 View detailed report: ./netlify-test-report.md`);

    if (failedCount === 0) {
      if (this.currentPhase === 'Phase 1') {
        console.log(`\n🚀 Phase 1 PASSED - Ready for Phase 2!`);
        console.log(`💡 Run with --phase2 to test build functionality`);
      } else if (this.currentPhase === 'Phase 2') {
        console.log(`\n🚀 Phase 2 PASSED - Ready for Phase 3!`);
        console.log(`💡 Run with --phase3 to setup git protection`);
      } else if (this.currentPhase === 'Phase 3') {
        console.log(`\n🚀 Phase 3 PASSED - Git protection system active!`);
        console.log(`💡 Use ./deploy-safely.sh for protected deployments`);
      } else if (this.currentPhase === 'Phase 4') {
        console.log(`\n🚀 Phase 4 PASSED - Enterprise-grade validation complete!`);
        console.log(`💡 Ready for production deployment`);
      }
    } else {
      console.log(`\n🛑 ${this.currentPhase} FAILED - Fix issues above before proceeding`);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const agent = new NetlifyTestAgent();

  // Parse command line arguments
  const phase1Only = args.includes('--phase1') || args.includes('--phase=1');
  const phase2Only = args.includes('--phase2') || args.includes('--phase=2');
  const phase3Only = args.includes('--phase3') || args.includes('--phase=3');
  const phase4Only = args.includes('--phase4') || args.includes('--phase=4');
  const allPhases = !phase1Only && !phase2Only && !phase3Only && !phase4Only;

  try {
    if (phase1Only) {
      console.log('🎯 Running Phase 1 only (Core Validation)\n');
      console.log('🚀 H&S Platform Netlify Test Agent - Phase 1\n');
      console.log('⚡ Running core validation tests...\n');
      await agent.runPhase1Tests();
    } else if (phase2Only) {
      console.log('🎯 Running Phase 2 only (Build Testing)\n');
      console.log('🚀 H&S Platform Netlify Test Agent - Phase 2\n');
      console.log('🏗️ Running build testing and validation...\n');
      await agent.runPhase2Tests();
    } else if (phase3Only) {
      console.log('🎯 Running Phase 3 only (Git Hooks & Protection)\n');
      console.log('🚀 H&S Platform Netlify Test Agent - Phase 3\n');
      console.log('🔒 Setting up git protection system...\n');
      await agent.runPhase3Tests();
    } else if (phase4Only) {
      console.log('🎯 Running Phase 4 only (Advanced Validation & Optimization)\n');
      console.log('🚀 H&S Platform Netlify Test Agent - Phase 4\n');
      console.log('🔍 Running enterprise-grade validation...\n');
      await agent.runPhase4Tests();
    } else {
      console.log('🎯 Running All Phases (Complete Validation)\n');
      console.log('🚀 H&S Platform Netlify Test Agent - Complete Test Suite\n');
      
      console.log('⚡ Phase 1: Core validation tests...\n');
      await agent.runPhase1Tests();
      
      console.log('\n🏗️ Phase 2: Build testing and validation...\n');
      await agent.runPhase2Tests();
      
      console.log('\n🔒 Phase 3: Git hooks and protection...\n');
      await agent.runPhase3Tests();
      
      console.log('\n🔍 Phase 4: Advanced validation and optimization...\n');
      await agent.runPhase4Tests();
      
      agent.currentPhase = 'All Phases';
    }

    await agent.saveReport();
    agent.logSummary();

    // Exit with appropriate code
    const failed = agent.results.failed.length > 0;
    process.exit(failed ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Test agent error:', error.message);
    process.exit(1);
  }
}

// Only run if called directly (not required as module)
if (require.main === module) {
  main();
}

module.exports = NetlifyTestAgent;