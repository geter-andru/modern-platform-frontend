#!/usr/bin/env node

/**
 * H&S Platform - Server Cleanup Protocol
 * 
 * Ensures all background processes and servers are killed completely
 * before starting new deployment processes.
 * 
 * Usage:
 *   node dev/cleanup-servers.js
 *   npm run cleanup
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  ports: [3000, 3001, 3002, 3003, 3004, 5000, 5001, 8000, 8080, 9000],
  processNames: ['node', 'npm', 'yarn', 'pnpm', 'next', 'nodemon'],
  tempFiles: [
    '.next',
    'out',
    'build',
    'dist',
    'logs',
    '*.log',
    '*.pid',
    '.env.local',
    '.env.production'
  ],
  lockFiles: [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.next/cache'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function killProcessesOnPort(port) {
  try {
    // Find processes using the port
    const { stdout } = await execPromise(`lsof -ti:${port}`);
    
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      log(`🔍 Found processes on port ${port}: ${pids.join(', ')}`, 'yellow');
      
      // Kill each process
      for (const pid of pids) {
        try {
          await execPromise(`kill -9 ${pid}`);
          log(`✅ Killed process ${pid} on port ${port}`, 'green');
        } catch (error) {
          log(`⚠️  Could not kill process ${pid}: ${error.message}`, 'yellow');
        }
      }
    } else {
      log(`✅ Port ${port} is free`, 'green');
    }
  } catch (error) {
    log(`⚠️  Error checking port ${port}: ${error.message}`, 'yellow');
  }
}

async function killProcessesByName(processName) {
  try {
    // Find processes by name
    const { stdout } = await execPromise(`pgrep -f ${processName}`);
    
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n');
      log(`🔍 Found ${processName} processes: ${pids.join(', ')}`, 'yellow');
      
      // Kill each process
      for (const pid of pids) {
        try {
          await execPromise(`kill -9 ${pid}`);
          log(`✅ Killed ${processName} process ${pid}`, 'green');
        } catch (error) {
          log(`⚠️  Could not kill ${processName} process ${pid}: ${error.message}`, 'yellow');
        }
      }
    } else {
      log(`✅ No ${processName} processes found`, 'green');
    }
  } catch (error) {
    log(`⚠️  Error checking ${processName} processes: ${error.message}`, 'yellow');
  }
}

async function cleanupTempFiles() {
  const projectRoot = path.resolve(__dirname, '..');
  
  for (const pattern of CONFIG.tempFiles) {
    try {
      if (pattern.includes('*')) {
        // Handle glob patterns
        const { stdout } = await execPromise(`find ${projectRoot} -name "${pattern}" -type f -delete 2>/dev/null || true`);
        if (stdout.trim()) {
          log(`🗑️  Cleaned up files matching ${pattern}`, 'cyan');
        }
      } else {
        // Handle specific files/directories
        const fullPath = path.join(projectRoot, pattern);
        if (fs.existsSync(fullPath)) {
          if (fs.statSync(fullPath).isDirectory()) {
            await execPromise(`rm -rf "${fullPath}"`);
            log(`🗑️  Removed directory: ${pattern}`, 'cyan');
          } else {
            fs.unlinkSync(fullPath);
            log(`🗑️  Removed file: ${pattern}`, 'cyan');
          }
        }
      }
    } catch (error) {
      log(`⚠️  Error cleaning ${pattern}: ${error.message}`, 'yellow');
    }
  }
}

async function cleanupLockFiles() {
  const projectRoot = path.resolve(__dirname, '..');
  
  for (const lockFile of CONFIG.lockFiles) {
    try {
      const fullPath = path.join(projectRoot, lockFile);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          await execPromise(`rm -rf "${fullPath}"`);
          log(`🔓 Removed lock directory: ${lockFile}`, 'cyan');
        } else {
          fs.unlinkSync(fullPath);
          log(`🔓 Removed lock file: ${lockFile}`, 'cyan');
        }
      }
    } catch (error) {
      log(`⚠️  Error removing lock file ${lockFile}: ${error.message}`, 'yellow');
    }
  }
}

async function showSystemStatus() {
  log('\n📊 System Status After Cleanup:', 'bold');
  
  // Check ports
  log('\n🔌 Port Status:', 'blue');
  for (const port of CONFIG.ports) {
    try {
      const { stdout } = await execPromise(`lsof -ti:${port}`);
      if (stdout.trim()) {
        log(`  Port ${port}: ${colors.red}OCCUPIED${colors.reset}`, 'red');
      } else {
        log(`  Port ${port}: ${colors.green}FREE${colors.reset}`, 'green');
      }
    } catch (error) {
      log(`  Port ${port}: ${colors.green}FREE${colors.reset}`, 'green');
    }
  }
  
  // Check processes
  log('\n⚙️  Process Status:', 'blue');
  for (const processName of CONFIG.processNames) {
    try {
      const { stdout } = await execPromise(`pgrep -f ${processName}`);
      if (stdout.trim()) {
        const count = stdout.trim().split('\n').length;
        log(`  ${processName}: ${colors.yellow}${count} running${colors.reset}`, 'yellow');
      } else {
        log(`  ${processName}: ${colors.green}none running${colors.reset}`, 'green');
      }
    } catch (error) {
      log(`  ${processName}: ${colors.green}none running${colors.reset}`, 'green');
    }
  }
}

async function main() {
  log('🧹 H&S Platform - Server Cleanup Protocol', 'bold');
  log('==========================================', 'bold');
  
  // Step 1: Kill processes on specific ports
  log('\n🔌 Step 1: Cleaning up ports...', 'blue');
  for (const port of CONFIG.ports) {
    await killProcessesOnPort(port);
  }
  
  // Step 2: Kill processes by name
  log('\n⚙️  Step 2: Cleaning up processes...', 'blue');
  for (const processName of CONFIG.processNames) {
    await killProcessesByName(processName);
  }
  
  // Step 3: Clean up temporary files
  log('\n🗑️  Step 3: Cleaning up temporary files...', 'blue');
  await cleanupTempFiles();
  
  // Step 4: Clean up lock files (optional)
  log('\n🔓 Step 4: Cleaning up lock files...', 'blue');
  await cleanupLockFiles();
  
  // Step 5: Show final status
  await showSystemStatus();
  
  log('\n✅ Cleanup complete! System is ready for deployment.', 'green');
  log('💡 You can now safely start new servers.', 'cyan');
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    log('H&S Platform - Server Cleanup Protocol', 'bold');
    log('Usage: node dev/cleanup-servers.js [options]', 'cyan');
    log('Options:', 'blue');
    log('  --help, -h     Show this help message', 'reset');
    log('  --status       Show system status only', 'reset');
    log('  --ports        Clean ports only', 'reset');
    log('  --processes    Clean processes only', 'reset');
    log('  --files        Clean files only', 'reset');
    process.exit(0);
  }
  
  if (args.includes('--status')) {
    showSystemStatus().then(() => process.exit(0));
  } else {
    main().catch(error => {
      log(`❌ Cleanup failed: ${error.message}`, 'red');
      process.exit(1);
    });
  }
}

module.exports = {
  cleanupServers: main,
  killProcessesOnPort,
  killProcessesByName,
  cleanupTempFiles,
  showSystemStatus
};




