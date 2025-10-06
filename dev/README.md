# H&S Platform - Development Tools

This directory contains development utilities and protocols for the H&S Platform.

## 🧹 Server Cleanup Protocol

### Overview
The cleanup protocol ensures all background processes and servers are killed completely before starting new deployment processes. This prevents port conflicts and ensures a clean environment.

### Files
- **`cleanup-servers.js`** - Node.js version with advanced features
- **`cleanup-servers.sh`** - Shell script version for quick execution

### Usage

#### Node.js Version (Recommended)
```bash
# Full cleanup
node dev/cleanup-servers.js

# Show help
node dev/cleanup-servers.js --help

# Show system status only
node dev/cleanup-servers.js --status

# Clean specific components
node dev/cleanup-servers.js --ports
node dev/cleanup-servers.js --processes
node dev/cleanup-servers.js --files
```

#### Shell Version
```bash
# Full cleanup
./dev/cleanup-servers.sh

# Show help
./dev/cleanup-servers.sh --help

# Show system status only
./dev/cleanup-servers.sh --status

# Clean specific components
./dev/cleanup-servers.sh --ports
./dev/cleanup-servers.sh --processes
./dev/cleanup-servers.sh --files
```

### What It Cleans Up

#### 🔌 Ports
- 3000, 3001, 3002, 3003, 3004 (Development servers)
- 5000, 5001 (API servers)
- 8000, 8080, 9000 (Additional services)

#### ⚙️ Processes
- `node` - Node.js processes
- `npm` - NPM processes
- `yarn` - Yarn processes
- `pnpm` - PNPM processes
- `next` - Next.js development servers
- `nodemon` - Nodemon processes

#### 🗑️ Temporary Files
- `.next` - Next.js build cache
- `out` - Static export output
- `build` - Build directories
- `dist` - Distribution directories
- `logs` - Log directories
- `*.log` - Log files
- `*.pid` - Process ID files
- `.env.local` - Local environment files
- `.env.production` - Production environment files

#### 🔓 Lock Files
- `package-lock.json` - NPM lock files
- `yarn.lock` - Yarn lock files
- `pnpm-lock.yaml` - PNPM lock files
- `.next/cache` - Next.js cache

### Integration with Deployment

#### Before Deployment
```bash
# Clean up before starting deployment
node dev/cleanup-servers.js

# Then proceed with deployment
npm run deploy
```

#### In CI/CD Pipeline
```bash
# Add to deployment scripts
./dev/cleanup-servers.sh --ports --processes
```

#### Manual Cleanup
```bash
# When you have port conflicts or stuck processes
node dev/cleanup-servers.js
```

### Safety Features

- **Non-destructive**: Only kills development processes, not system processes
- **Port-specific**: Only targets known development ports
- **Process-specific**: Only targets known development processes
- **File-safe**: Only removes temporary and cache files
- **Error handling**: Continues even if some operations fail
- **Status reporting**: Shows what was cleaned up

### Troubleshooting

#### Port Still Occupied
```bash
# Check what's using the port
lsof -i:3000

# Force kill if needed
kill -9 $(lsof -ti:3000)
```

#### Process Won't Die
```bash
# Check process details
ps aux | grep node

# Force kill if needed
kill -9 <PID>
```

#### Permission Issues
```bash
# Make script executable
chmod +x dev/cleanup-servers.sh

# Run with sudo if needed (be careful!)
sudo ./dev/cleanup-servers.sh
```

### Best Practices

1. **Always run cleanup before deployment**
2. **Use the Node.js version for better error handling**
3. **Check status after cleanup to verify success**
4. **Run cleanup when switching between projects**
5. **Use specific flags for targeted cleanup**

### Integration Examples

#### Package.json Scripts
```json
{
  "scripts": {
    "cleanup": "node dev/cleanup-servers.js",
    "deploy": "npm run cleanup && npm run build && npm run deploy:netlify",
    "dev:clean": "npm run cleanup && npm run dev"
  }
}
```

#### Pre-deployment Hook
```bash
#!/bin/bash
# pre-deploy.sh
echo "🧹 Cleaning up before deployment..."
node dev/cleanup-servers.js
echo "✅ Cleanup complete, starting deployment..."
```

### Support

If you encounter issues with the cleanup protocol:

1. Check the console output for specific error messages
2. Verify you have the necessary permissions
3. Try running with `--status` to see current system state
4. Use specific flags to isolate the problem
5. Check the troubleshooting section above

---

**Note**: This cleanup protocol is designed for development environments. Use caution in production environments and always test in development first.