#!/usr/bin/env node

/**
 * H&S Platform Netlify Webhook Integration
 * Handles Netlify deploy events and triggers validation pipeline
 * 
 * Features:
 * - Netlify webhook event processing
 * - Deploy status monitoring
 * - Automatic validation triggering
 * - Build failure detection
 * - Deployment success notifications
 */

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');

class NetlifyWebhookIntegration {
  constructor(options = {}) {
    this.config = {
      port: process.env.NETLIFY_WEBHOOK_PORT || 8081,
      netlifySecret: process.env.NETLIFY_WEBHOOK_SECRET || 'hs-platform-netlify-2025',
      orchestratorPath: path.join(__dirname, 'master-orchestrator.js'),
      enableNotifications: options.enableNotifications !== false,
      slackWebhook: process.env.SLACK_WEBHOOK_URL,
      teamsWebhook: process.env.TEAMS_WEBHOOK_URL,
      ...options
    };
    
    this.server = null;
    this.deployHistory = [];
    this.activeDeploys = new Map();
  }

  /**
   * Start the Netlify webhook server
   */
  async start() {
    console.log(chalk.blue.bold('🚀 Starting Netlify Webhook Integration...'));
    
    this.server = http.createServer((req, res) => {
      this.handleWebhookRequest(req, res);
    });

    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, (err) => {
        if (err) {
          console.error(chalk.red('❌ Failed to start Netlify webhook server:'), err);
          reject(err);
        } else {
          console.log(chalk.green(`✅ Netlify webhook server listening on port ${this.config.port}`));
          console.log(chalk.cyan(`🌐 Webhook URL: http://localhost:${this.config.port}/netlify-webhook`));
          console.log(chalk.cyan(`🔑 Secret: ${this.config.netlifySecret}`));
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming webhook requests
   */
  handleWebhookRequest(req, res) {
    if (req.method !== 'POST' || req.url !== '/netlify-webhook') {
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
        const signature = req.headers['x-netlify-signature'];
        
        // Verify Netlify signature
        if (signature && !this.verifyNetlifySignature(body, signature)) {
          console.log(chalk.red('❌ Invalid Netlify webhook signature'));
          res.writeHead(401);
          res.end('Unauthorized');
          return;
        }

        // Process Netlify event
        await this.processNetlifyEvent(payload, req.headers);

        res.writeHead(200);
        res.end('OK');

      } catch (error) {
        console.error(chalk.red('❌ Netlify webhook processing error:'), error);
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  }

  /**
   * Verify Netlify webhook signature
   */
  verifyNetlifySignature(body, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', this.config.netlifySecret)
      .update(body)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Process Netlify webhook event
   */
  async processNetlifyEvent(payload, headers) {
    const eventType = headers['x-netlify-event'] || 'unknown';
    const deployId = payload.id || 'unknown';
    const siteId = payload.site_id || 'unknown';
    const siteName = payload.name || 'unknown';
    
    console.log(chalk.yellow(`📡 Netlify Event: ${eventType}`));
    console.log(chalk.cyan(`🏗️ Site: ${siteName} (${siteId})`));
    console.log(chalk.cyan(`🚀 Deploy: ${deployId}`));

    // Track deploy
    this.trackDeploy(deployId, {
      eventType,
      siteId,
      siteName,
      payload,
      timestamp: new Date().toISOString()
    });

    switch (eventType) {
      case 'deploy_building':
        await this.handleDeployBuilding(payload);
        break;
        
      case 'deploy_started':
        await this.handleDeployStarted(payload);
        break;
        
      case 'deploy_created':
        await this.handleDeployCreated(payload);
        break;
        
      case 'deploy_succeeded':
        await this.handleDeploySucceeded(payload);
        break;
        
      case 'deploy_failed':
        await this.handleDeployFailed(payload);
        break;
        
      case 'deploy_locked':
        await this.handleDeployLocked(payload);
        break;
        
      case 'deploy_unlocked':
        await this.handleDeployUnlocked(payload);
        break;
        
      default:
        console.log(chalk.gray(`ℹ️  Unhandled event type: ${eventType}`));
    }
  }

  /**
   * Handle deploy building event
   */
  async handleDeployBuilding(payload) {
    console.log(chalk.blue('🏗️ Deploy building started...'));
    
    // Trigger validation pipeline
    await this.triggerValidation('netlify-deploy', {
      trigger: 'netlify-deploy',
      event: 'deploy_building',
      siteId: payload.site_id,
      deployId: payload.id,
      url: payload.url,
      branch: payload.branch,
      commitRef: payload.commit_ref
    });
  }

  /**
   * Handle deploy started event
   */
  async handleDeployStarted(payload) {
    console.log(chalk.blue('🚀 Deploy started...'));
    
    // Update deploy status
    this.updateDeployStatus(payload.id, 'started');
  }

  /**
   * Handle deploy created event
   */
  async handleDeployCreated(payload) {
    console.log(chalk.green('✅ Deploy created successfully'));
    
    // Update deploy status
    this.updateDeployStatus(payload.id, 'created');
    
    // Send success notification
    await this.sendDeployNotification('success', payload);
  }

  /**
   * Handle deploy succeeded event
   */
  async handleDeploySucceeded(payload) {
    console.log(chalk.green('🎉 Deploy succeeded!'));
    
    // Update deploy status
    this.updateDeployStatus(payload.id, 'succeeded');
    
    // Send success notification
    await this.sendDeployNotification('success', payload);
    
    // Log deploy success
    this.logDeployEvent('succeeded', payload);
  }

  /**
   * Handle deploy failed event
   */
  async handleDeployFailed(payload) {
    console.log(chalk.red('❌ Deploy failed!'));
    
    // Update deploy status
    this.updateDeployStatus(payload.id, 'failed');
    
    // Send failure notification
    await this.sendDeployNotification('failure', payload);
    
    // Log deploy failure
    this.logDeployEvent('failed', payload);
    
    // Trigger additional validation if needed
    await this.triggerValidation('deploy-failure', {
      trigger: 'deploy-failure',
      event: 'deploy_failed',
      siteId: payload.site_id,
      deployId: payload.id,
      error: payload.error_message || 'Unknown error'
    });
  }

  /**
   * Handle deploy locked event
   */
  async handleDeployLocked(payload) {
    console.log(chalk.yellow('🔒 Deploy locked'));
    
    // Update deploy status
    this.updateDeployStatus(payload.id, 'locked');
  }

  /**
   * Handle deploy unlocked event
   */
  async handleDeployUnlocked(payload) {
    console.log(chalk.green('🔓 Deploy unlocked'));
    
    // Update deploy status
    this.updateDeployStatus(payload.id, 'unlocked');
  }

  /**
   * Trigger validation pipeline
   */
  async triggerValidation(triggerType, context) {
    console.log(chalk.cyan(`🔧 Triggering validation: ${triggerType}`));
    
    try {
      // Check if master orchestrator is available
      if (!require('fs').existsSync(this.config.orchestratorPath)) {
        console.log(chalk.red('❌ Master orchestrator not found'));
        return;
      }

      // Spawn master orchestrator process
      const child = spawn('node', [
        this.config.orchestratorPath,
        '--trigger', triggerType,
        '--context', JSON.stringify(context)
      ], {
        stdio: ['inherit', 'pipe', 'pipe']
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
        if (code === 0) {
          console.log(chalk.green('✅ Validation completed successfully'));
        } else {
          console.log(chalk.red(`❌ Validation failed with exit code: ${code}`));
        }
      });

      child.on('error', (error) => {
        console.error(chalk.red('❌ Validation process error:'), error);
      });

    } catch (error) {
      console.error(chalk.red('❌ Failed to trigger validation:'), error);
    }
  }

  /**
   * Track deploy information
   */
  trackDeploy(deployId, info) {
    this.activeDeploys.set(deployId, info);
    
    // Keep only last 50 deploys
    if (this.activeDeploys.size > 50) {
      const firstKey = this.activeDeploys.keys().next().value;
      this.activeDeploys.delete(firstKey);
    }
  }

  /**
   * Update deploy status
   */
  updateDeployStatus(deployId, status) {
    const deploy = this.activeDeploys.get(deployId);
    if (deploy) {
      deploy.status = status;
      deploy.lastUpdated = new Date().toISOString();
      this.activeDeploys.set(deployId, deploy);
    }
  }

  /**
   * Log deploy event
   */
  logDeployEvent(event, payload) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      deployId: payload.id,
      siteId: payload.site_id,
      siteName: payload.name,
      url: payload.url,
      branch: payload.branch,
      commitRef: payload.commit_ref,
      error: payload.error_message || null
    };
    
    this.deployHistory.push(logEntry);
    
    // Keep only last 100 events
    if (this.deployHistory.length > 100) {
      this.deployHistory = this.deployHistory.slice(-100);
    }
  }

  /**
   * Send deploy notification
   */
  async sendDeployNotification(type, payload) {
    if (!this.config.enableNotifications) return;
    
    const siteName = payload.name || 'Unknown Site';
    const deployId = payload.id || 'unknown';
    const url = payload.url || 'unknown';
    const branch = payload.branch || 'unknown';
    
    let message;
    
    if (type === 'success') {
      message = {
        text: `✅ Netlify Deploy Succeeded`,
        attachments: [{
          color: 'good',
          fields: [
            { title: 'Site', value: siteName, short: true },
            { title: 'Deploy ID', value: deployId, short: true },
            { title: 'Branch', value: branch, short: true },
            { title: 'URL', value: url, short: false }
          ],
          footer: 'H&S Platform Netlify Integration',
          ts: Math.floor(Date.now() / 1000)
        }]
      };
    } else {
      const error = payload.error_message || 'Unknown error';
      message = {
        text: `❌ Netlify Deploy Failed`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Site', value: siteName, short: true },
            { title: 'Deploy ID', value: deployId, short: true },
            { title: 'Branch', value: branch, short: true },
            { title: 'Error', value: error, short: false }
          ],
          footer: 'H&S Platform Netlify Integration',
          ts: Math.floor(Date.now() / 1000)
        }]
      };
    }
    
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
   * Get deploy status
   */
  getDeployStatus(deployId) {
    return this.activeDeploys.get(deployId) || null;
  }

  /**
   * Get deploy history
   */
  getDeployHistory(limit = 10) {
    return this.deployHistory.slice(-limit);
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      running: this.server !== null,
      port: this.config.port,
      activeDeploys: this.activeDeploys.size,
      deployHistory: this.deployHistory.length,
      notifications: {
        slack: !!this.config.slackWebhook,
        teams: !!this.config.teamsWebhook
      }
    };
  }

  /**
   * Stop the webhook server
   */
  async stop() {
    console.log(chalk.yellow('🛑 Stopping Netlify webhook server...'));
    
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    
    console.log(chalk.green('✅ Netlify webhook server stopped'));
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
      case '--no-notifications':
        options.enableNotifications = false;
        break;
      case '--debug':
        options.logLevel = 'debug';
        break;
    }
  }
  
  const integration = new NetlifyWebhookIntegration(options);
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await integration.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await integration.stop();
    process.exit(0);
  });
  
  // Start the integration
  await integration.start();
  
  // Keep the process running
  process.stdin.resume();
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Netlify webhook integration failed to start:'), error);
    process.exit(1);
  });
}

module.exports = NetlifyWebhookIntegration;
