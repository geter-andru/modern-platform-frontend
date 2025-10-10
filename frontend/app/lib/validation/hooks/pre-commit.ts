#!/usr/bin/env ts-node

/**
 * H&S Platform Internal Validation Hook
 * TypeScript implementation for modern-platform
 * Prevents customer-facing platform failures
 */

import { spawn } from 'node:child_process';
import chalk from 'chalk';
import path from 'node:path';

class PreCommitHook {
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  async runValidation(): Promise<boolean> {
    console.log(chalk.magenta.bold('🎯 H&S Platform Validation Pipeline Starting...'));
    console.log(chalk.cyan('📱 Target: modern-platform (Next.js 15 + React 19 + App Router)'));

    try {
      // Run the internal orchestrator
      const orchestratorPath = path.join(this.projectRoot, 'lib/validation/orchestrator.ts');
      
      const result = await this.executeOrchestrator(orchestratorPath);
      
      if (result.success) {
        console.log(chalk.green.bold('✅ H&S Platform validation passed - commit approved'));
        console.log(chalk.green('🚀 Next.js 15 + React 19 + App Router: VALIDATED'));
        return true;
      } else {
        console.log(chalk.red.bold('❌ BUSINESS CRITICAL: H&S Platform validation failed'));
        console.log(chalk.red('🛡️ Customer platform protection activated - commit blocked'));
        console.log(chalk.red('🔧 Next.js 15 + React 19 compatibility issues detected'));
        return false;
      }

    } catch (error) {
      console.error(chalk.red.bold('❌ Validation pipeline error:'));
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
      return false;
    }
  }

  private async executeOrchestrator(orchestratorPath: string): Promise<{ success: boolean; exitCode: number }> {
    return new Promise((resolve) => {
      const child = spawn('npx', ['ts-node', orchestratorPath], {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          exitCode: code || 0
        });
      });

      child.on('error', (error) => {
        console.error('Failed to start orchestrator:', error);
        resolve({
          success: false,
          exitCode: 1
        });
      });
    });
  }
}

// Main execution
async function main() {
  const hook = new PreCommitHook();
  const success = await hook.runValidation();
  process.exit(success ? 0 : 1);
}

// ES module entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default PreCommitHook;
