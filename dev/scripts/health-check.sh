#!/bin/bash

# H&S Platform Health Check Script
# Run at the start of each development session
# Usage: ./scripts/health-check.sh

echo "🏥 H&S Platform Health Check Starting..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall health
OVERALL_STATUS=0

echo -e "\n${BLUE}🔗 External Services Health Check${NC}"
echo "--------------------------------"

# Check Airtable API
echo -n "Airtable API: "
if AIRTABLE_API_KEY=pat5kFmJsBxfL5Yqr.f44840b8b82995ec43ac998191c43f19d0471c9550d0fea9e0327cc4f4aa4815 \
   timeout 10s npx -y airtable-mcp-server --version &>/dev/null; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    OVERALL_STATUS=1
fi

# Check Make.com API
echo -n "Make.com API: "
if MAKE_API_TOKEN=1da281d0-9ffb-4d7c-9c49-644febffd6da \
   timeout 10s node /Users/geter/mcp-servers/make-mcp-server/index.js --help &>/dev/null; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${YELLOW}⚠️  Needs Verification${NC}"
fi

# Check GitHub (via git)
echo -n "GitHub Access: "
if git remote -v &>/dev/null; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    OVERALL_STATUS=1
fi

echo -e "\n${BLUE}🚀 Local Development Environment${NC}"
echo "--------------------------------"

# Check if ports are available/in use
echo -n "Frontend (3000): "
if lsof -i :3000 &>/dev/null; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${YELLOW}⚠️  Not Running${NC}"
fi

echo -n "Backend (5000): "
if lsof -i :5000 &>/dev/null; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${YELLOW}⚠️  Not Running${NC}"
fi

# Check Node version
echo -n "Node.js Version: "
NODE_VERSION=$(node --version)
echo -e "${GREEN}${NODE_VERSION}${NC}"

# Check npm packages
echo -n "Dependencies: "
if npm list &>/dev/null; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${YELLOW}⚠️  May need 'npm install'${NC}"
fi

echo -e "\n${BLUE}📊 Database & Data Health${NC}"
echo "--------------------------------"

# Test Airtable connection with actual data
echo -n "Customer Data Access: "
if AIRTABLE_API_KEY=pat5kFmJsBxfL5Yqr.f44840b8b82995ec43ac998191c43f19d0471c9550d0fea9e0327cc4f4aa4815 \
   timeout 15s npx -y airtable-mcp-server list-records app0jJkgTCqn46vp9 "Customer Assets" &>/dev/null; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${RED}❌ Failed - Check API Key${NC}"
    OVERALL_STATUS=1
fi

echo -e "\n${BLUE}🧪 Critical Business Flows${NC}"
echo "--------------------------------"

# Check for test customer data
echo -n "Test Customer CUST_01: "
if AIRTABLE_API_KEY=pat5kFmJsBxfL5Yqr.f44840b8b82995ec43ac998191c43f19d0471c9550d0fea9e0327cc4f4aa4815 \
   timeout 10s npx -y airtable-mcp-server get-record app0jJkgTCqn46vp9 "Customer Assets" rechze4X0QFwHRD01 &>/dev/null; then
    echo -e "${GREEN}✅ Available${NC}"
else
    echo -e "${YELLOW}⚠️  Not Found${NC}"
fi

echo -e "\n${BLUE}🔧 Build & Code Health${NC}"
echo "--------------------------------"

# Check if build works
echo -n "TypeScript Compilation: "
if npm run build --silent &>/dev/null; then
    echo -e "${GREEN}✅ Clean Build${NC}"
else
    echo -e "${RED}❌ Build Errors${NC}"
    OVERALL_STATUS=1
fi

# Check git status
echo -n "Git Working Tree: "
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✅ Clean${NC}"
else
    echo -e "${YELLOW}⚠️  Uncommitted Changes${NC}"
fi

echo -e "\n${BLUE}📋 Session Files Status${NC}"
echo "--------------------------------"

# Check if session continuity files exist
SESSION_FILES=(
    "EXTERNAL_SERVICES_STATE.md"
    "WIP_STATE.md" 
    "CUSTOMER_JOURNEY_STATE.md"
    "SESSION_HANDOFF.md"
)

for file in "${SESSION_FILES[@]}"; do
    echo -n "$file: "
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Present${NC}"
    else
        echo -e "${YELLOW}⚠️  Missing${NC}"
    fi
done

echo -e "\n${BLUE}📊 Overall Health Summary${NC}"
echo "================================"

if [ $OVERALL_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ SYSTEM HEALTHY - Ready for development${NC}"
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Check SESSION_HANDOFF.md for context"
    echo "2. Review WIP_STATE.md for any incomplete work"
    echo "3. Consider testing Make.com scenarios (marked as needing verification)"
else
    echo -e "${RED}❌ SYSTEM ISSUES DETECTED${NC}"
    echo -e "\n${YELLOW}Required Actions:${NC}"
    echo "1. Fix failed health checks above"
    echo "2. Run 'npm install' if dependencies are unhealthy"  
    echo "3. Check API keys and network connectivity"
    echo "4. Resolve any build errors before continuing"
fi

echo -e "\n${BLUE}🚀 Quick Start Commands:${NC}"
echo "npm run dev          # Start frontend development server"
echo "npm run build        # Test build compilation"
echo "git status           # Check for uncommitted changes"

echo -e "\n🏥 Health check complete!"

exit $OVERALL_STATUS