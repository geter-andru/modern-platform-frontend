#!/bin/bash

# MVP Database Seeding Script
# This script uses Supabase CLI to run the seed file

set -e  # Exit on any error

echo "🎯 MVP Database Seeding Script"
echo "================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "Please install it: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if we're in the right directory
if [ ! -f "infra/supabase/seeds/01_mvp_seed.sql" ]; then
    echo "❌ Seed file not found at infra/supabase/seeds/01_mvp_seed.sql"
    echo "Please run this script from the modern-platform root directory"
    exit 1
fi

echo "✅ Seed file found"

# Check if .env.local exists
if [ ! -f "dev/.env.local" ]; then
    echo "❌ Environment file not found at dev/.env.local"
    echo "Please ensure your environment variables are set"
    exit 1
fi

echo "✅ Environment file found"

# Load environment variables
echo "🔧 Loading environment variables..."
export $(grep -v '^#' dev/.env.local | xargs)

# Check required environment variables
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY not found in environment"
    exit 1
fi

echo "✅ Environment variables loaded"

# Navigate to infra directory
cd infra

echo ""
echo "🚀 Starting MVP database seeding..."
echo ""

# Run the seed file using Supabase CLI
echo "📂 Running seed file: seeds/01_mvp_seed.sql"
echo ""

# Use supabase db reset to apply migrations and seeds
echo "🔄 Resetting database with migrations and seeds..."
supabase db reset --linked

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 MVP DATABASE SEEDING COMPLETED SUCCESSFULLY!"
    echo ""
    echo "📊 What was created:"
    echo "   • 4 resources (Tier 1 Core)"
    echo "   • 2 customer records (Brandon & Dotun)"
    echo ""
    echo "🎯 Ready for testing:"
    echo "   • ICP Tool - Product Details widgets pre-populated"
    echo "   • Resources Library - 4 viewable/exportable resources"
    echo "   • Assessment - Mock results display"
    echo "   • Cost Calculator - One-page business case generation"
    echo ""
    echo "✅ All verification checks should have passed!"
    echo ""
    echo "🔗 Next steps:"
    echo "   1. Start the frontend: cd ../frontend && npm run dev"
    echo "   2. Start the backend: cd ../backend && npm start"
    echo "   3. Test the features with Brandon or Dotun login"
else
    echo ""
    echo "❌ MVP SEEDING FAILED"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check SUPABASE_SERVICE_ROLE_KEY is set correctly"
    echo "   2. Verify Supabase project is linked: supabase link"
    echo "   3. Ensure database schema is up to date"
    echo "   4. Check migration_log table exists"
    exit 1
fi





