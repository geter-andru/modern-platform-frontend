#!/usr/bin/env node

/**
 * H&S Platform Enhanced Git Hooks Installer
 * Installs event-driven validation hooks with master orchestrator integration
 * 
 * Features:
 * - Pre-commit hooks with master orchestrator integration
 * - Pre-push hooks for remote validation
 * - Post-commit hooks for success notifications
 * - Webhook integration for external triggers
 * - Automatic hook updates and maintenance
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

class EnhancedHooksInstaller {
  constructor() {
    this.projectRoot = this.detectProjectRoot();
    this.orchestratorPath = path.join(__dirname, 'master-orchestrator.js');
    this.hooksDir = path.join(this.projectRoot, '.git/hooks');
    this.installedHooks = [];
  }

  detectProjectRoot() {
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, '.git'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    return process.cwd();
  }

  /**
   * Install all enhanced git hooks
   */
  async installAllHooks() {
    console.log(chalk.blue.bold('🔧 Installing H&S Platform Enhanced Git Hooks\n'));
    
    if (!fs.existsSync(this.hooksDir)) {
      console.error(chalk.red('❌ Git hooks directory not found. Make sure you\'re in a git repository.'));
      process.exit(1);
    }

    const hooks = [
      { name: 'pre-commit', handler: this.createPreCommitHook.bind(this) },
      { name: 'pre-push', handler: this.createPrePushHook.bind(this) },
      { name: 'post-commit', handler: this.createPostCommitHook.bind(this) },
      { name: 'commit-msg', handler: this.createCommitMsgHook.bind(this) }
    ];

    let successCount = 0;

    for (const hook of hooks) {
      try {
        const success = await hook.handler();
        if (success) {
          console.log(chalk.green(`✅ ${hook.name}: Installed successfully`));
          this.installedHooks.push(hook.name);
          successCount++;
        } else {
          console.log(chalk.red(`❌ ${hook.name}: Installation failed`));
        }
      } catch (error) {
        console.log(chalk.red(`❌ ${hook.name}: Error - ${error.message}`));
      }
    }

    // Install webhook configuration
    await this.installWebhookConfig();

    console.log('\n' + '='.repeat(60));
    
    if (successCount === hooks.length) {
      console.log(chalk.green.bold('✅ ALL ENHANCED HOOKS INSTALLED SUCCESSFULLY'));
      console.log(chalk.green('🛡️ Customer platform protection: ACTIVE'));
      console.log(chalk.cyan('\n📋 Installed Hooks:'));
      this.installedHooks.forEach(hook => {
        console.log(chalk.cyan(`   • ${hook}`));
      });
      console.log(chalk.cyan('\n🌐 Webhook endpoint available for external triggers'));
    } else {
      console.log(chalk.yellow.bold('⚠️  SOME HOOKS FAILED TO INSTALL'));
      console.log(chalk.yellow('🛡️ Customer platform protection: PARTIAL'));
    }
    
    console.log('='.repeat(60));
    
    return successCount === hooks.length;
  }

  /**
   * Create pre-commit hook
   */
  async createPreCommitHook() {
    const hookContent = `#!/bin/bash
# H&S Platform Enhanced Pre-Commit Hook
# Triggers master orchestrator for comprehensive validation

set -e

echo "🎯 H&S Platform Pre-Commit Validation Starting..."
echo "📅 $(date)"
echo "👤 User: $(whoami)"
echo "🌿 Branch: $(git branch --show-current)"
echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
echo ""

# Check if master orchestrator is available
ORCHESTRATOR_PATH="${this.orchestratorPath}"

if [ ! -f "$ORCHESTRATOR_PATH" ]; then
  echo "❌ Master orchestrator not found at: $ORCHESTRATOR_PATH"
  echo "🛡️ Customer platform protection: DISABLED"
  exit 1
fi

# Run master orchestrator with git-push event
cd "${this.projectRoot}"

# Trigger validation via master orchestrator
node "$ORCHESTRATOR_PATH" --trigger git-push --context pre-commit

VALIDATION_EXIT_CODE=$?

if [ $VALIDATION_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ H&S Platform pre-commit validation passed"
  echo "🛡️ Customer platform protection: ACTIVE"
  echo "📤 Commit approved for push"
  exit 0
else
  echo ""
  echo "❌ H&S Platform pre-commit validation failed"
  echo "🛡️ Customer platform protection: ACTIVATED"
  echo "🚫 Commit blocked to protect customer platform"
  echo ""
  echo "💡 To bypass validation (NOT RECOMMENDED):"
  echo "   git commit --no-verify -m \"your message\""
  echo ""
  exit 1
fi
`;

    return this.writeHook('pre-commit', hookContent);
  }

  /**
   * Create pre-push hook
   */
  async createPrePushHook() {
    const hookContent = `#!/bin/bash
# H&S Platform Enhanced Pre-Push Hook
# Final validation before pushing to remote repository

set -e

echo "🚀 H&S Platform Pre-Push Validation Starting..."
echo "📅 $(date)"
echo "👤 User: $(whoami)"
echo "🌿 Branch: $(git branch --show-current)"
echo "🎯 Remote: $1"
echo "📍 URL: $2"
echo ""

# Check if master orchestrator is available
ORCHESTRATOR_PATH="${this.orchestratorPath}"

if [ ! -f "$ORCHESTRATOR_PATH" ]; then
  echo "❌ Master orchestrator not found at: $ORCHESTRATOR_PATH"
  echo "🛡️ Customer platform protection: DISABLED"
  exit 1
fi

# Run master orchestrator with pre-push event
cd "${this.projectRoot}"

# Trigger validation via master orchestrator
node "$ORCHESTRATOR_PATH" --trigger pre-push --context pre-push

VALIDATION_EXIT_CODE=$?

if [ $VALIDATION_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ H&S Platform pre-push validation passed"
  echo "🛡️ Customer platform protection: ACTIVE"
  echo "📤 Push approved to remote"
  exit 0
else
  echo ""
  echo "❌ H&S Platform pre-push validation failed"
  echo "🛡️ Customer platform protection: ACTIVATED"
  echo "🚫 Push blocked to protect customer platform"
  echo ""
  echo "💡 To bypass validation (NOT RECOMMENDED):"
  echo "   git push --no-verify"
  echo ""
  exit 1
fi
`;

    return this.writeHook('pre-push', hookContent);
  }

  /**
   * Create post-commit hook
   */
  async createPostCommitHook() {
    const hookContent = `#!/bin/bash
# H&S Platform Enhanced Post-Commit Hook
# Sends success notifications and logs commit events

set -e

echo "📝 H&S Platform Post-Commit Processing..."
echo "📅 $(date)"
echo "👤 User: $(whoami)"
echo "🌿 Branch: $(git branch --show-current)"
echo "📝 Commit: $(git log -1 --pretty=format:'%h - %s')"
echo ""

# Check if master orchestrator is available
ORCHESTRATOR_PATH="${this.orchestratorPath}"

if [ -f "$ORCHESTRATOR_PATH" ]; then
  cd "${this.projectRoot}"
  
  # Send post-commit event to orchestrator
  node "$ORCHESTRATOR_PATH" --trigger post-commit --context post-commit &
  
  echo "✅ Post-commit event sent to master orchestrator"
else
  echo "⚠️  Master orchestrator not available for post-commit processing"
fi

echo "📊 Commit successfully processed"
echo "🛡️ Customer platform protection: ACTIVE"
`;

    return this.writeHook('post-commit', hookContent);
  }

  /**
   * Create commit message hook
   */
  async createCommitMsgHook() {
    const hookContent = `#!/bin/bash
# H&S Platform Enhanced Commit Message Hook
# Validates commit messages for consistency and compliance

set -e

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

echo "📝 Validating commit message..."

# Check commit message format
if [ ${#COMMIT_MSG} -lt 10 ]; then
  echo "❌ Commit message too short (minimum 10 characters)"
  echo "💡 Please provide a more descriptive commit message"
  exit 1
fi

# Check for common patterns
if [[ "$COMMIT_MSG" =~ ^(fix|feat|chore|docs|style|refactor|test|perf|ci|build|revert)(\(.+\))?: ]]; then
  echo "✅ Commit message follows conventional format"
else
  echo "⚠️  Commit message doesn't follow conventional format"
  echo "💡 Consider using: type(scope): description"
  echo "   Examples: feat(auth): add login validation"
  echo "             fix(api): resolve timeout issue"
  echo "             chore: update dependencies"
fi

# Check for sensitive information
if [[ "$COMMIT_MSG" =~ (password|secret|key|token|api_key) ]]; then
  echo "❌ Commit message may contain sensitive information"
  echo "🛡️ Customer platform protection: ACTIVATED"
  exit 1
fi

echo "✅ Commit message validation passed"
echo "🛡️ Customer platform protection: ACTIVE"
`;

    return this.writeHook('commit-msg', hookContent);
  }

  /**
   * Write hook file
   */
  async writeHook(hookName, content) {
    try {
      const hookPath = path.join(this.hooksDir, hookName);
      fs.writeFileSync(hookPath, content);
      fs.chmodSync(hookPath, '755');
      return true;
    } catch (error) {
      console.error(chalk.red(`Failed to write ${hookName} hook: ${error.message}`));
      return false;
    }
  }

  /**
   * Install webhook configuration
   */
  async installWebhookConfig() {
    const webhookConfig = {
      name: 'H&S Platform Validation Webhook',
      description: 'Webhook endpoint for triggering validation pipeline',
      endpoint: '/webhook/validation',
      events: ['git-push', 'netlify-deploy', 'manual-validation'],
      secret: process.env.WEBHOOK_SECRET || 'hs-platform-validation-2025',
      port: process.env.ORCHESTRATOR_PORT || 8080,
      notifications: {
        slack: process.env.SLACK_WEBHOOK_URL || null,
        teams: process.env.TEAMS_WEBHOOK_URL || null
      }
    };

    const configPath = path.join(__dirname, 'webhook-config.json');
    
    try {
      fs.writeFileSync(configPath, JSON.stringify(webhookConfig, null, 2));
      console.log(chalk.green('✅ Webhook configuration installed'));
      console.log(chalk.cyan(`   📁 Config: ${configPath}`));
      console.log(chalk.cyan(`   🌐 Endpoint: http://localhost:${webhookConfig.port}${webhookConfig.endpoint}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not install webhook config: ${error.message}`));
    }
  }

  /**
   * Uninstall all hooks
   */
  async uninstallAllHooks() {
    console.log(chalk.yellow('🗑️  Uninstalling H&S Platform Git Hooks...\n'));
    
    const hooks = ['pre-commit', 'pre-push', 'post-commit', 'commit-msg'];
    let removedCount = 0;

    for (const hook of hooks) {
      const hookPath = path.join(this.hooksDir, hook);
      
      if (fs.existsSync(hookPath)) {
        try {
          fs.unlinkSync(hookPath);
          console.log(chalk.green(`✅ ${hook}: Removed`));
          removedCount++;
        } catch (error) {
          console.log(chalk.red(`❌ ${hook}: Failed to remove - ${error.message}`));
        }
      } else {
        console.log(chalk.gray(`⚪ ${hook}: Not installed`));
      }
    }

    // Remove webhook config
    const configPath = path.join(__dirname, 'webhook-config.json');
    if (fs.existsSync(configPath)) {
      try {
        fs.unlinkSync(configPath);
        console.log(chalk.green('✅ Webhook config: Removed'));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Could not remove webhook config: ${error.message}`));
      }
    }

    console.log('\n' + '='.repeat(50));
    
    if (removedCount === hooks.length) {
      console.log(chalk.green.bold('✅ ALL HOOKS REMOVED SUCCESSFULLY'));
      console.log(chalk.yellow('🛡️ Customer platform protection: DISABLED'));
    } else {
      console.log(chalk.yellow.bold('⚠️  SOME HOOKS COULD NOT BE REMOVED'));
      console.log(chalk.yellow('🛡️ Customer platform protection: PARTIAL'));
    }
    
    console.log('='.repeat(50));
    
    return removedCount === hooks.length;
  }

  /**
   * Check hook status
   */
  async checkHookStatus() {
    console.log(chalk.blue.bold('📊 H&S Platform Git Hooks Status\n'));
    
    const hooks = ['pre-commit', 'pre-push', 'post-commit', 'commit-msg'];
    let installedCount = 0;

    hooks.forEach(hook => {
      const hookPath = path.join(this.hooksDir, hook);
      
      if (fs.existsSync(hookPath)) {
        const stats = fs.statSync(hookPath);
        const isExecutable = (stats.mode & parseInt('111', 8)) !== 0;
        
        console.log(chalk.green(`✅ ${hook}: Installed ${isExecutable ? '(executable)' : '(not executable)'}`));
        installedCount++;
      } else {
        console.log(chalk.red(`❌ ${hook}: Not installed`));
      }
    });

    // Check webhook config
    const configPath = path.join(__dirname, 'webhook-config.json');
    if (fs.existsSync(configPath)) {
      console.log(chalk.green('✅ Webhook config: Available'));
    } else {
      console.log(chalk.red('❌ Webhook config: Not available'));
    }

    // Check master orchestrator
    if (fs.existsSync(this.orchestratorPath)) {
      console.log(chalk.green('✅ Master orchestrator: Available'));
    } else {
      console.log(chalk.red('❌ Master orchestrator: Not available'));
    }

    console.log('\n' + '='.repeat(50));
    console.log(chalk.cyan(`📊 Status: ${installedCount}/${hooks.length} hooks installed`));
    
    if (installedCount === hooks.length) {
      console.log(chalk.green('🛡️ Customer platform protection: ACTIVE'));
    } else {
      console.log(chalk.yellow('🛡️ Customer platform protection: INCOMPLETE'));
    }
    
    console.log('='.repeat(50));
    
    return installedCount === hooks.length;
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const installer = new EnhancedHooksInstaller();

  switch (args[0]) {
    case 'install':
      await installer.installAllHooks();
      break;
      
    case 'uninstall':
      await installer.uninstallAllHooks();
      break;
      
    case 'status':
      await installer.checkHookStatus();
      break;
      
    case 'reinstall':
      console.log(chalk.blue('🔄 Reinstalling H&S Platform Git Hooks...\n'));
      await installer.uninstallAllHooks();
      console.log('');
      await installer.installAllHooks();
      break;
      
    default:
      console.log(chalk.blue.bold('🔧 H&S Platform Enhanced Git Hooks Installer\n'));
      console.log(chalk.cyan('Usage:'));
      console.log(chalk.cyan('  node install-enhanced-hooks.js install    - Install all hooks'));
      console.log(chalk.cyan('  node install-enhanced-hooks.js uninstall  - Remove all hooks'));
      console.log(chalk.cyan('  node install-enhanced-hooks.js status     - Check hook status'));
      console.log(chalk.cyan('  node install-enhanced-hooks.js reinstall - Reinstall all hooks'));
      console.log('');
      console.log(chalk.yellow('Features:'));
      console.log(chalk.yellow('  • Pre-commit validation with master orchestrator'));
      console.log(chalk.yellow('  • Pre-push remote validation'));
      console.log(chalk.yellow('  • Post-commit notifications'));
      console.log(chalk.yellow('  • Commit message validation'));
      console.log(chalk.yellow('  • Webhook integration'));
      console.log(chalk.yellow('  • Customer platform protection'));
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('❌ Enhanced hooks installer failed:'), error);
    process.exit(1);
  });
}

module.exports = EnhancedHooksInstaller;
