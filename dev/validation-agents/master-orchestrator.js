#!/usr/bin/env node

/**
 * H&S Platform Master Orchestrator Agent
 * Event-based validation orchestrator for git push and Netlify deploy events
 * 
 * Features:
 * - Event-driven architecture with webhook support
 * - Git push event detection and validation
 * - Netlify deploy event integration
 * - Real-time status reporting
 * - Slack/Teams notification integration
 * - Comprehensive logging and monitoring
 * 
 * Business Purpose: Zero-downtime deployments with customer platform protection
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const chalk = require('chalk').default || require('chalk');
const { default: ora } = require('ora');
const EventEmitter = require('events');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

class MasterOrchestratorAgent extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.startTime = Date.now();
    this.projectRoot = this.detectProjectRoot();
    this.hsContext = this.loadHSContext();
    this.config = this.loadConfig(options);
    this.results = {
      security: null,
      compatibility: null, 
      netlifyCore: null,
      chaos: null,
      netlifyProtection: null
    };
    
    // Event tracking
    this.eventHistory = [];
    this.activeValidations = new Set();
    this.validationQueue = [];
    
    // Webhook server for external triggers
    this.webhookServer = null;
    this.webhookSecret = process.env.WEBHOOK_SECRET || 'hs-platform-validation-2025';
    
    console.log(chalk.magenta.bold('🎯 H&S Platform Master Orchestrator Agent Started'));
    console.log(chalk.cyan(`📁 Project Root: ${this.projectRoot}`));
    console.log(chalk.cyan(`🏗️ App Type: ${this.hsContext.appType}`));
  }

  detectProjectRoot() {
    // Look for H_S_VALIDATION_CONTEXT.json in parent directories
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      const contextPath = path.join(currentDir, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
        if (context.appName === 'modern-platform' && fs.existsSync(path.join(currentDir, 'app'))) {
          return currentDir;
        }
      }
      currentDir = path.dirname(currentDir);
    }
    
    // If not found, try specific known paths
    const knownPaths = [
      '/Users/geter/andru/hs-andru-test/modern-platform',
      '../hs-andru-test/modern-platform'
    ];
    
    for (const checkPath of knownPaths) {
      const fullPath = path.resolve(checkPath);
      if (fs.existsSync(path.join(fullPath, 'H_S_VALIDATION_CONTEXT.json'))) {
        return fullPath;
      }
    }
    
    return process.cwd();
  }

  loadHSContext() {
    try {
      const contextPath = path.join(this.projectRoot, 'H_S_VALIDATION_CONTEXT.json');
      if (fs.existsSync(contextPath)) {
        return JSON.parse(fs.readFileSync(contextPath, 'utf8'));
      }
    } catch (error) {
      console.error(chalk.red('❌ BUSINESS CRITICAL: Could not load H&S validation context'));
      process.exit(1);
    }
    
    console.error(chalk.red('❌ BUSINESS CRITICAL: H_S_VALIDATION_CONTEXT.json not found'));
    process.exit(1);
  }

  loadConfig(options) {
    const defaultConfig = {
      port: process.env.ORCHESTRATOR_PORT || 8080,
      webhookPath: '/webhook/validation',
      slackWebhook: process.env.SLACK_WEBHOOK_URL,
      teamsWebhook: process.env.TEAMS_WEBHOOK_URL,
      enableWebhookServer: options.enableWebhookServer !== false,
      enableNotifications: options.enableNotifications !== false,
      parallelValidation: options.parallelValidation !== false,
      maxConcurrentValidations: options.maxConcurrentValidations || 2,
      validationTimeout: options.validationTimeout || 300000, // 5 minutes
      retryAttempts: options.retryAttempts || 3,
      logLevel: process.env.LOG_LEVEL || 'info'
    };

    return { ...defaultConfig, ...options };
  }

  /**
   * Start the master orchestrator with event listeners
   */
  async start() {
    console.log(chalk.blue('🚀 Starting Master Orchestrator Agent...'));
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start webhook server if enabled
    if (this.config.enableWebhookServer) {
      await this.startWebhookServer();
    }
    
    // Set up git hooks if not already installed
    await this.ensureGitHooks();
    
    // Set up file watchers for development
    if (process.env.NODE_ENV === 'development') {
      this.setupFileWatchers();
    }
    
    console.log(chalk.green('✅ Master Orchestrator Agent is running'));
    console.log(chalk.cyan(`🌐 Webhook endpoint: http://localhost:${this.config.port}${this.config.webhookPath}`));
    
    // Emit ready event
    this.emit('ready', {
      projectRoot: this.projectRoot,
      config: this.config,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Set up event listeners for various triggers
   */
  setupEventListeners() {
    // Git push event detection
    this.on('git-push', async (event) => {
      console.log(chalk.yellow('📤 Git push detected, starting validation...'));
      await this.handleGitPushEvent(event);
    });

    // Netlify deploy event
    this.on('netlify-deploy', async (event) => {
      console.log(chalk.yellow('🚀 Netlify deploy detected, starting validation...'));
      await this.handleNetlifyDeployEvent(event);
    });

    // Manual validation trigger
    this.on('manual-validation', async (event) => {
      console.log(chalk.yellow('🔧 Manual validation triggered...'));
      await this.handleManualValidation(event);
    });

    // Webhook validation trigger
    this.on('webhook-validation', async (event) => {
      console.log(chalk.yellow('🔗 Webhook validation triggered...'));
      await this.handleWebhookValidation(event);
    });

    // Validation completion
    this.on('validation-complete', (result) => {
      this.logEvent('validation-complete', result);
      this.sendNotifications(result);
    });

    // Validation failure
    this.on('validation-failed', (error) => {
      this.logEvent('validation-failed', { error: error.message });
      this.sendFailureNotifications(error);
    });
  }

  /**
   * Start webhook server for external triggers
   */
  async startWebhookServer() {
    return new Promise((resolve, reject) => {
      this.webhookServer = http.createServer((req, res) => {
        this.handleWebhookRequest(req, res);
      });

      this.webhookServer.listen(this.config.port, (err) => {
        if (err) {
          console.error(chalk.red('❌ Failed to start webhook server:'), err);
          reject(err);
        } else {
          console.log(chalk.green(`✅ Webhook server listening on port ${this.config.port}`));
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming webhook requests
   */
  handleWebhookRequest(req, res) {
    if (req.method !== 'POST' || req.url !== this.config.webhookPath) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const signature = req.headers['x-hub-signature-256'] || req.headers['x-signature'];
        
        // Verify webhook signature if provided
        if (signature && !this.verifyWebhookSignature(body, signature)) {
          res.writeHead(401);
          res.end('Unauthorized');
          return;
        }

        // Determine event type
        const eventType = this.determineEventType(payload, req.headers);
        
        // Emit appropriate event
        this.emit(eventType, {
          payload,
          headers: req.headers,
          timestamp: new Date().toISOString(),
          source: 'webhook'
        });

        res.writeHead(200);
        res.end('OK');

      } catch (error) {
        console.error(chalk.red('❌ Webhook processing error:'), error);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  }

  /**
   * Determine event type from webhook payload
   */
  determineEventType(payload, headers) {
    // GitHub webhook
    if (headers['x-github-event']) {
      if (headers['x-github-event'] === 'push') {
        return 'git-push';
      }
    }

    // Netlify webhook
    if (headers['x-netlify-event']) {
      if (headers['x-netlify-event'] === 'deploy_building' || 
          headers['x-netlify-event'] === 'deploy_started') {
        return 'netlify-deploy';
      }
    }

    // Generic webhook
    if (payload.event) {
      switch (payload.event) {
        case 'git-push':
        case 'push':
          return 'git-push';
        case 'netlify-deploy':
        case 'deploy':
          return 'netlify-deploy';
        case 'manual-validation':
        case 'validation':
          return 'manual-validation';
        default:
          return 'webhook-validation';
      }
    }

    return 'webhook-validation';
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body, signature) {
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Handle git push events
   */
  async handleGitPushEvent(event) {
    const validationId = this.generateValidationId('git-push');
    
    try {
      this.logEvent('git-push-started', { validationId, event });
      
      // Run full validation pipeline
      const result = await this.runFullValidation(validationId, {
        trigger: 'git-push',
        branch: event.payload?.ref || 'unknown',
        commit: event.payload?.head_commit?.id || 'unknown',
        author: event.payload?.head_commit?.author?.name || 'unknown'
      });

      this.emit('validation-complete', result);
      
    } catch (error) {
      this.emit('validation-failed', error);
      throw error;
    }
  }

  /**
   * Handle Netlify deploy events
   */
  async handleNetlifyDeployEvent(event) {
    const validationId = this.generateValidationId('netlify-deploy');
    
    try {
      this.logEvent('netlify-deploy-started', { validationId, event });
      
      // Run deployment-specific validation
      const result = await this.runDeploymentValidation(validationId, {
        trigger: 'netlify-deploy',
        siteId: event.payload?.site_id || 'unknown',
        deployId: event.payload?.id || 'unknown',
        url: event.payload?.url || 'unknown'
      });

      this.emit('validation-complete', result);
      
    } catch (error) {
      this.emit('validation-failed', error);
      throw error;
    }
  }

  /**
   * Handle manual validation events
   */
  async handleManualValidation(event) {
    const validationId = this.generateValidationId('manual');
    
    try {
      this.logEvent('manual-validation-started', { validationId, event });
      
      const result = await this.runFullValidation(validationId, {
        trigger: 'manual',
        user: event.user || 'unknown',
        reason: event.reason || 'manual trigger'
      });

      this.emit('validation-complete', result);
      
    } catch (error) {
      this.emit('validation-failed', error);
      throw error;
    }
  }

  /**
   * Handle webhook validation events
   */
  async handleWebhookValidation(event) {
    const validationId = this.generateValidationId('webhook');
    
    try {
      this.logEvent('webhook-validation-started', { validationId, event });
      
      const result = await this.runFullValidation(validationId, {
        trigger: 'webhook',
        source: event.source || 'unknown',
        payload: event.payload
      });

      this.emit('validation-complete', result);
      
    } catch (error) {
      this.emit('validation-failed', error);
      throw error;
    }
  }

  /**
   * Run full validation pipeline
   */
  async runFullValidation(validationId, context = {}) {
    const startTime = Date.now();
    console.log(chalk.magenta.bold(`🎯 Starting Full Validation Pipeline (ID: ${validationId})`));
    
    try {
      // Add to active validations
      this.activeValidations.add(validationId);
      
      // Run validation steps
      const results = await this.runValidationSteps(validationId, context);
      
      // Generate report
      const report = this.generateValidationReport(validationId, results, startTime, context);
      
      // Remove from active validations
      this.activeValidations.delete(validationId);
      
      return report;
      
    } catch (error) {
      this.activeValidations.delete(validationId);
      throw error;
    }
  }

  /**
   * Run deployment-specific validation
   */
  async runDeploymentValidation(validationId, context = {}) {
    const startTime = Date.now();
    console.log(chalk.magenta.bold(`🚀 Starting Deployment Validation (ID: ${validationId})`));
    
    try {
      this.activeValidations.add(validationId);
      
      // Run critical validation steps only
      const results = await this.runCriticalValidationSteps(validationId, context);
      
      const report = this.generateValidationReport(validationId, results, startTime, context);
      
      this.activeValidations.delete(validationId);
      
      return report;
      
    } catch (error) {
      this.activeValidations.delete(validationId);
      throw error;
    }
  }

  /**
   * Run all validation steps
   */
  async runValidationSteps(validationId, context) {
    const results = {};
    
    // Step 1: Security (CRITICAL)
    console.log(chalk.cyan('🔒 Step 1: Security Secrets Validation'));
    results.security = await this.runSecurityValidation(validationId);
    
    // Step 2: Compatibility (CRITICAL) 
    console.log(chalk.cyan('\n🔧 Step 2: Integration Compatibility Validation'));
    results.compatibility = await this.runCompatibilityValidation(validationId);
    
    // Step 3: Netlify Core (CRITICAL)
    console.log(chalk.cyan('\n🏗️ Step 3: Build & Deployment Validation'));
    results.netlifyCore = await this.runNetlifyValidation(validationId, ['1', '2']);
    
    // Step 4: Chaos (WARNING ONLY)
    console.log(chalk.cyan('\n🌪️ Step 4: Resilience & Stress Testing'));
    results.chaos = await this.runChaosValidation(validationId);
    
    // Step 5: Git Protection (CRITICAL)
    console.log(chalk.cyan('\n🛡️ Step 5: Git Protection System'));
    results.netlifyProtection = await this.runNetlifyValidation(validationId, ['3']);
    
    return results;
  }

  /**
   * Run critical validation steps only (for deployment events)
   */
  async runCriticalValidationSteps(validationId, context) {
    const results = {};
    
    // Only run critical steps for deployment validation
    console.log(chalk.cyan('🔒 Critical: Security Secrets Validation'));
    results.security = await this.runSecurityValidation(validationId);
    
    console.log(chalk.cyan('\n🔧 Critical: Integration Compatibility Validation'));
    results.compatibility = await this.runCompatibilityValidation(validationId);
    
    console.log(chalk.cyan('\n🏗️ Critical: Build & Deployment Validation'));
    results.netlifyCore = await this.runNetlifyValidation(validationId, ['1', '2']);
    
    return results;
  }

  /**
   * Execute individual validation agent
   */
  async executeAgent(agentPath, args = [], validationId) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Validation timeout after ${this.config.validationTimeout}ms`));
      }, this.config.validationTimeout);

      const child = spawn('node', [agentPath, ...args], {
        cwd: this.projectRoot,
        stdio: ['inherit', 'pipe', 'pipe'],
        env: { ...process.env, VALIDATION_ID: validationId }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        clearTimeout(timeout);
        resolve({
          exitCode: code,
          stdout,
          stderr,
          success: code === 0,
          validationId,
          duration: Date.now() - this.startTime
        });
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Run security validation
   */
  async runSecurityValidation(validationId) {
    const spinner = ora('Running security secrets scan...').start();
    
    try {
      const agentPath = path.join(__dirname, 'security-secrets-prevention-agent/scripts/scan-repository.js');
      const result = await this.executeAgent(agentPath, [], validationId);
      
      if (!result.success) {
        spinner.fail('BUSINESS CRITICAL: Secrets detected - customer data at risk');
        throw new Error('Security validation failed - secrets detected');
      }
      
      spinner.succeed('Security validation passed');
      return result;
      
    } catch (error) {
      spinner.fail('Security validation failed');
      throw error;
    }
  }

  /**
   * Run compatibility validation
   */
  async runCompatibilityValidation(validationId) {
    const spinner = ora(`Running ${this.hsContext.appType} compatibility validation...`).start();
    
    try {
      const agentPath = path.join(__dirname, 'compatibility-agent/src/index.js');
      const result = await this.executeAgent(agentPath, [], validationId);
      
      if (!result.success) {
        spinner.fail('BUSINESS CRITICAL: Integration failure risk - customer platform unstable');
        throw new Error('Compatibility validation failed');
      }
      
      spinner.succeed('Compatibility validation passed');
      return result;
      
    } catch (error) {
      spinner.fail('Compatibility validation failed');
      throw error;
    }
  }

  /**
   * Run Netlify validation
   */
  async runNetlifyValidation(validationId, phases = ['1', '2']) {
    const phaseDesc = phases.join('+');
    const spinner = ora(`Running Netlify Phase ${phaseDesc} validation...`).start();
    
    try {
      const agentPath = path.join(__dirname, 'netlify-test-agent.js');
      const args = phases.length === 1 ? [`--phase${phases[0]}`] : [`--phase1`, `--phase2`];
      const result = await this.executeAgent(agentPath, args, validationId);
      
      if (!result.success) {
        const errorType = phases.includes('3') ? 'Git protection disabled' : 'Build failure';
        spinner.fail(`BUSINESS CRITICAL: ${errorType} - deployment safety compromised`);
        throw new Error(`Netlify Phase ${phaseDesc} validation failed`);
      }
      
      spinner.succeed(`Netlify Phase ${phaseDesc} validation passed`);
      return result;
      
    } catch (error) {
      spinner.fail(`Netlify Phase ${phaseDesc} validation failed`);
      throw error;
    }
  }

  /**
   * Run chaos validation
   */
  async runChaosValidation(validationId) {
    const spinner = ora('Running chaos resilience validation...').start();
    
    try {
      const agentPath = path.join(__dirname, 'chaos-testing-agent/src/index.js');
      const result = await this.executeAgent(agentPath, [], validationId);
      
      // Chaos is non-critical - warn but don't block
      if (!result.success) {
        spinner.warn('BUSINESS WARNING: Platform may degrade under stress');
        console.log(chalk.yellow('⚠️  Resilience score below threshold - customer experience may suffer'));
      } else {
        spinner.succeed('Chaos validation passed');
      }
      
      return result;
      
    } catch (error) {
      spinner.warn('Chaos validation encountered issues');
      console.log(chalk.yellow('⚠️  Could not complete resilience testing'));
      return { success: false, exitCode: 1, validationId };
    }
  }

  /**
   * Generate validation report
   */
  generateValidationReport(validationId, results, startTime, context) {
    const duration = (Date.now() - startTime) / 1000;
    const appName = this.hsContext.appName || 'H&S Platform';
    
    console.log(chalk.blue.bold('\n📊 H&S PLATFORM VALIDATION REPORT'));
    console.log(chalk.blue('='.repeat(60)));
    console.log(chalk.cyan(`Validation ID: ${validationId}`));
    console.log(chalk.cyan(`App: ${appName}`));
    console.log(chalk.cyan(`Type: ${this.hsContext.appType}`));
    console.log(chalk.cyan(`Trigger: ${context.trigger || 'unknown'}`));
    console.log(chalk.cyan(`Duration: ${duration.toFixed(2)}s`));
    console.log(chalk.blue('='.repeat(60)));

    const steps = [
      { name: 'Security Secrets', result: results.security, critical: true },
      { name: 'Compatibility', result: results.compatibility, critical: true },
      { name: 'Netlify Core', result: results.netlifyCore, critical: true },
      { name: 'Chaos Resilience', result: results.chaos, critical: false },
      { name: 'Git Protection', result: results.netlifyProtection, critical: true }
    ];

    let criticalFailures = 0;
    let warnings = 0;

    steps.forEach(step => {
      if (!step.result) {
        console.log(chalk.gray(`⚪ ${step.name}: Not executed`));
        return;
      }

      if (step.result.success) {
        console.log(chalk.green(`✅ ${step.name}: Passed`));
      } else {
        if (step.critical) {
          criticalFailures++;
          console.log(chalk.red(`❌ ${step.name}: FAILED (CRITICAL)`));
        } else {
          warnings++;
          console.log(chalk.yellow(`⚠️  ${step.name}: Warning`));
        }
      }
    });

    console.log(chalk.blue('='.repeat(60)));
    
    const report = {
      validationId,
      success: criticalFailures === 0,
      criticalFailures,
      warnings,
      duration,
      context,
      results,
      timestamp: new Date().toISOString()
    };
    
    if (criticalFailures === 0) {
      console.log(chalk.green.bold('✅ VALIDATION PASSED - SAFE TO DEPLOY'));
      console.log(chalk.green(`Customer platform protection: ACTIVE`));
      if (warnings > 0) {
        console.log(chalk.yellow(`Warnings: ${warnings} (non-blocking)`));
      }
    } else {
      console.log(chalk.red.bold('❌ VALIDATION FAILED - DEPLOYMENT BLOCKED'));
      console.log(chalk.red(`Critical failures: ${criticalFailures}`));
      console.log(chalk.red('🛡️ Customer platform protection: ACTIVATED'));
    }
    
    return report;
  }

  /**
   * Generate unique validation ID
   */
  generateValidationId(trigger) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${trigger}-${timestamp}-${random}`;
  }

  /**
   * Log event for monitoring
   */
  logEvent(eventType, data) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      data,
      activeValidations: Array.from(this.activeValidations),
      queueLength: this.validationQueue.length
    };
    
    this.eventHistory.push(event);
    
    // Keep only last 100 events
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-100);
    }
    
    // Log to console if debug mode
    if (this.config.logLevel === 'debug') {
      console.log(chalk.gray(`📝 Event: ${eventType}`), data);
    }
  }

  /**
   * Send success notifications
   */
  async sendNotifications(report) {
    if (!this.config.enableNotifications) return;
    
    const message = {
      text: `✅ H&S Platform Validation Passed`,
      attachments: [{
        color: 'good',
        fields: [
          { title: 'Validation ID', value: report.validationId, short: true },
          { title: 'Duration', value: `${report.duration.toFixed(2)}s`, short: true },
          { title: 'Trigger', value: report.context.trigger, short: true },
          { title: 'Warnings', value: report.warnings.toString(), short: true }
        ],
        footer: 'H&S Platform Master Orchestrator',
        ts: Math.floor(Date.now() / 1000)
      }]
    };
    
    await this.sendSlackNotification(message);
    await this.sendTeamsNotification(message);
  }

  /**
   * Send failure notifications
   */
  async sendFailureNotifications(error) {
    if (!this.config.enableNotifications) return;
    
    const message = {
      text: `❌ H&S Platform Validation Failed`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'Error', value: error.message, short: false },
          { title: 'Time', value: new Date().toISOString(), short: true }
        ],
        footer: 'H&S Platform Master Orchestrator',
        ts: Math.floor(Date.now() / 1000)
      }]
    };
    
    await this.sendSlackNotification(message);
    await this.sendTeamsNotification(message);
  }

  /**
   * Send Slack notification
   */
  async sendSlackNotification(message) {
    if (!this.config.slackWebhook) return;
    
    try {
      const payload = JSON.stringify(message);
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
      
      const req = https.request(this.config.slackWebhook, options);
      req.write(payload);
      req.end();
    } catch (error) {
      console.error(chalk.red('❌ Failed to send Slack notification:'), error);
    }
  }

  /**
   * Send Teams notification
   */
  async sendTeamsNotification(message) {
    if (!this.config.teamsWebhook) return;
    
    try {
      const payload = JSON.stringify(message);
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
      
      const req = https.request(this.config.teamsWebhook, options);
      req.write(payload);
      req.end();
    } catch (error) {
      console.error(chalk.red('❌ Failed to send Teams notification:'), error);
    }
  }

  /**
   * Ensure git hooks are installed
   */
  async ensureGitHooks() {
    const hooksPath = path.join(this.projectRoot, '.git/hooks/pre-commit');
    
    if (!fs.existsSync(hooksPath)) {
      console.log(chalk.yellow('⚠️  Git hooks not found, installing...'));
      
      try {
        const { installPreCommitHook } = require('./install-hooks.js');
        const success = installPreCommitHook(this.projectRoot);
        
        if (success) {
          console.log(chalk.green('✅ Git hooks installed successfully'));
        } else {
          console.log(chalk.red('❌ Failed to install git hooks'));
        }
      } catch (error) {
        console.error(chalk.red('❌ Error installing git hooks:'), error);
      }
    }
  }

  /**
   * Set up file watchers for development
   */
  setupFileWatchers() {
    console.log(chalk.cyan('👀 Setting up file watchers for development...'));
    
    // Watch for changes in critical files
    const watchPaths = [
      path.join(this.projectRoot, 'app'),
      path.join(this.projectRoot, 'lib'),
      path.join(this.projectRoot, 'src')
    ];
    
    watchPaths.forEach(watchPath => {
      if (fs.existsSync(watchPath)) {
        fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
          if (filename && filename.endsWith('.ts') || filename.endsWith('.tsx')) {
            console.log(chalk.gray(`📁 File changed: ${filename}`));
            // Could trigger incremental validation here
          }
        });
      }
    });
  }

  /**
   * Get orchestrator status
   */
  getStatus() {
    return {
      running: true,
      activeValidations: Array.from(this.activeValidations),
      queueLength: this.validationQueue.length,
      eventHistory: this.eventHistory.slice(-10), // Last 10 events
      uptime: Date.now() - this.startTime,
      config: this.config,
      projectRoot: this.projectRoot
    };
  }

  /**
   * Stop the orchestrator
   */
  async stop() {
    console.log(chalk.yellow('🛑 Stopping Master Orchestrator Agent...'));
    
    if (this.webhookServer) {
      this.webhookServer.close();
    }
    
    // Wait for active validations to complete
    if (this.activeValidations.size > 0) {
      console.log(chalk.yellow(`⏳ Waiting for ${this.activeValidations.size} active validations to complete...`));
      
      // Wait up to 30 seconds
      let attempts = 0;
      while (this.activeValidations.size > 0 && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }
    
    console.log(chalk.green('✅ Master Orchestrator Agent stopped'));
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--port':
        options.port = parseInt(args[++i]);
        break;
      case '--no-webhook':
        options.enableWebhookServer = false;
        break;
      case '--no-notifications':
        options.enableNotifications = false;
        break;
      case '--parallel':
        options.parallelValidation = true;
        break;
      case '--debug':
        options.logLevel = 'debug';
        break;
    }
  }
  
  const orchestrator = new MasterOrchestratorAgent(options);
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await orchestrator.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await orchestrator.stop();
    process.exit(0);
  });
  
  // Start the orchestrator
  await orchestrator.start();
  
  // Keep the process running
  process.stdin.resume();
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Master Orchestrator failed to start:'), error);
    process.exit(1);
  });
}

module.exports = MasterOrchestratorAgent;
