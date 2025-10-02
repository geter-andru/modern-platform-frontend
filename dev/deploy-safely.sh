#!/bin/bash
# H&S Platform Safe Deployment Script
# Comprehensive validation before deployment

set -e

echo "🚀 H&S Platform Deployment Safety Check"
echo "======================================="

# Phase 1: Core Validation
echo "Phase 1: Core Validation..."
node /Users/geter/andru/hs-andru-test/validation-agents/netlify-test-agent.js --phase1

# Phase 2: Build Testing  
echo "Phase 2: Build Testing..."
node /Users/geter/andru/hs-andru-test/validation-agents/netlify-test-agent.js --phase2

# Check git status
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Warning: Uncommitted changes detected"
  git status
  read -p "Continue with deployment? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

# Check branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️  Warning: Deploying from branch '$CURRENT_BRANCH' (not main/master)"
  read -p "Continue with deployment? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

echo "✅ All safety checks passed!"
echo "🚀 Ready for deployment"

# Optional: trigger actual deployment
if [ "$1" = "--deploy" ]; then
  echo "🚀 Triggering deployment..."
  git push origin HEAD
  echo "✅ Deployment triggered!"
fi
