# H&S Platform Master Orchestrator Agent

**Business Purpose:** Event-driven validation orchestrator that prevents customer-facing failures through comprehensive validation pipeline orchestration across H&S Platform ecosystem.

## 🚀 **Master Orchestrator Features**

### **Event-Driven Architecture**
- **Git Push Events**: Automatic validation on every commit
- **Netlify Deploy Events**: Real-time deployment validation
- **Webhook Integration**: External trigger support
- **Manual Triggers**: On-demand validation execution

### **Comprehensive Validation Pipeline**
1. **Security Secrets** (CRITICAL) - Prevents customer data exposure
2. **Compatibility** (CRITICAL) - Ensures integrations work  
3. **Netlify Core** (CRITICAL) - Validates builds and deployment
4. **Chaos Testing** (WARNING) - Tests resilience under stress
5. **Git Protection** (CRITICAL) - Activates deployment safety

### **Advanced Capabilities**
- **Real-time Status Reporting**: Live validation progress
- **Slack/Teams Notifications**: Instant success/failure alerts
- **Webhook Server**: External system integration
- **Event History**: Comprehensive audit trail
- **Parallel Processing**: Optimized validation performance

## 🏗️ **Architecture**

**Centralized validation for 2 Next.js apps:**
- **Assessment App** (`andru-assessment`): Stripe payments, assessment completion
- **Platform App** (`hs-andru-test`): Supabase auth, business tools, Airtable integration

## 📦 **Installation**

```bash
cd /Users/geter/andru/hs-andru-test/modern-platform/validation-agents
npm install
```

## 🚀 **Quick Start**

### **1. Install Enhanced Git Hooks**
```bash
npm run hooks:install
```

### **2. Start Master Orchestrator**
```bash
npm start
# or
npm run orchestrator
```

### **3. Start Netlify Webhook Integration**
```bash
npm run start:netlify
```

## 📋 **Usage**

### **Automatic Validation (Git Hooks)**
```bash
git commit -m "your changes"  # Triggers validation automatically
git push origin main          # Pre-push validation
```

### **Manual Validation**
```bash
# Full validation pipeline
npm run validate

# Master orchestrator with options
npm run orchestrator -- --port 8080 --debug
```

### **Webhook Triggers**
```bash
# Trigger validation via webhook
curl -X POST http://localhost:8080/webhook/validation \
  -H "Content-Type: application/json" \
  -d '{"event": "manual-validation", "reason": "testing"}'
```

### **Netlify Integration**
```bash
# Start Netlify webhook server
npm run start:netlify

# Webhook URL: http://localhost:8081/netlify-webhook
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Master Orchestrator
ORCHESTRATOR_PORT=8080
WEBHOOK_SECRET=hs-platform-validation-2025
LOG_LEVEL=info

# Netlify Integration
NETLIFY_WEBHOOK_PORT=8081
NETLIFY_WEBHOOK_SECRET=hs-platform-netlify-2025

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
```

### **Command Line Options**
```bash
# Master Orchestrator
node master-orchestrator.js --port 8080 --no-webhook --debug

# Enhanced Hooks
node install-enhanced-hooks.js install    # Install all hooks
node install-enhanced-hooks.js uninstall  # Remove all hooks
node install-enhanced-hooks.js status     # Check hook status
node install-enhanced-hooks.js reinstall # Reinstall all hooks

# Netlify Webhook
node netlify-webhook-integration.js --port 8081 --no-notifications
```

## 📊 **Event Types**

### **Git Events**
- `git-push`: Triggered on git push
- `pre-commit`: Triggered before commit
- `pre-push`: Triggered before push
- `post-commit`: Triggered after commit

### **Netlify Events**
- `deploy_building`: Deploy started building
- `deploy_started`: Deploy process started
- `deploy_succeeded`: Deploy completed successfully
- `deploy_failed`: Deploy failed

### **Manual Events**
- `manual-validation`: Manual trigger
- `webhook-validation`: External webhook trigger

## 🛡️ **Business Rules**

- **Critical failures** (Security, Compatibility, Netlify Core, Git Protection) block commits completely
- **Chaos failures** warn but allow commits
- **Validation time** <5 minutes for developer productivity
- **Zero false positives** for developer trust
- **Real-time notifications** for immediate feedback

## 📁 **File Structure**

```
validation-agents/
├── master-orchestrator.js           # Main orchestrator agent
├── install-enhanced-hooks.js        # Enhanced git hooks installer
├── netlify-webhook-integration.js   # Netlify webhook handler
├── index.js                         # Legacy orchestrator
├── install-hooks.js                 # Legacy hooks installer
├── security-secrets-prevention-agent/
├── compatibility-agent/
├── chaos-testing-agent/
└── netlify-test-agent.js
```

## 🔗 **Integration Points**

### **Webhook Endpoints**
- **Master Orchestrator**: `http://localhost:8080/webhook/validation`
- **Netlify Integration**: `http://localhost:8081/netlify-webhook`

### **Notification Channels**
- **Slack**: Real-time validation status
- **Microsoft Teams**: Deployment notifications
- **Console**: Detailed validation logs

## 📈 **Monitoring & Analytics**

### **Event History**
- Last 100 validation events
- Deploy history tracking
- Performance metrics
- Error rate monitoring

### **Status Endpoints**
```bash
# Get orchestrator status
curl http://localhost:8080/status

# Get Netlify integration status  
curl http://localhost:8081/status
```

## 🚨 **Troubleshooting**

### **Common Issues**
1. **Hooks not working**: Run `npm run hooks:reinstall`
2. **Webhook not responding**: Check port availability
3. **Validation failing**: Check agent dependencies
4. **Notifications not sending**: Verify webhook URLs

### **Debug Mode**
```bash
npm run orchestrator -- --debug
npm run start:netlify -- --debug
```

**Business Impact:** Prevents revenue loss from platform downtime, maintains customer trust through zero-failure deployments, provides real-time visibility into platform health.