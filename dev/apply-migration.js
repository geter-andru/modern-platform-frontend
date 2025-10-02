#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const projectRef = process.env.SUPABASE_PROJECT_REF || 'molcqjsqtjbfclasynpg';
const supabaseUrl = `https://${projectRef}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Test if tables exist by trying to create them and checking for conflicts
async function testTableExists(tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
        
        return !error;
    } catch (err) {
        return false;
    }
}

async function createTableIfNotExists(tableName, createSQL) {
    console.log(`\nChecking if table '${tableName}' exists...`);
    
    const exists = await testTableExists(tableName);
    if (exists) {
        console.log(`✅ Table '${tableName}' already exists`);
        return true;
    }
    
    console.log(`Creating table '${tableName}'...`);
    try {
        // Use fetch to send raw SQL to Supabase
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: createSQL })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to create table '${tableName}':`, errorText);
            return false;
        }
        
        console.log(`✅ Table '${tableName}' created successfully`);
        return true;
    } catch (error) {
        console.error(`❌ Exception creating table '${tableName}':`, error.message);
        return false;
    }
}

async function runMigration() {
    console.log('Starting user management system migration...\n');
    
    try {
        console.log('Reading migration file...');
        const migrationPath = join(__dirname, 'supabase/migrations/003_user_management_system.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf8');
        
        console.log('Connecting to Supabase...');
        console.log(`URL: ${supabaseUrl}`);
        
        // Test connection first
        const { data, error } = await supabase.from('performance_metrics').select('*').limit(1);
        if (error && !error.message.includes('permission')) {
            console.error('❌ Connection failed:', error);
            return;
        }
        
        console.log('✅ Connected to Supabase successfully');
        
        // Let's try creating the tables one by one manually
        const tables = [
            {
                name: 'user_roles',
                sql: `CREATE TABLE IF NOT EXISTS user_roles (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                    role_name TEXT NOT NULL CHECK (role_name IN ('super_admin', 'admin', 'manager', 'user', 'guest', 'readonly')),
                    granted_by UUID REFERENCES auth.users(id),
                    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    expires_at TIMESTAMP WITH TIME ZONE,
                    is_active BOOLEAN DEFAULT true,
                    metadata JSONB DEFAULT '{}',
                    
                    CONSTRAINT unique_active_user_role UNIQUE (user_id, role_name, is_active),
                    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UPDATED_AT TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );`
            },
            {
                name: 'role_permissions',
                sql: `CREATE TABLE IF NOT EXISTS role_permissions (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    role_name TEXT NOT NULL CHECK (role_name IN ('super_admin', 'admin', 'manager', 'user', 'guest', 'readonly')),
                    permission TEXT NOT NULL,
                    resource_type TEXT DEFAULT 'general',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    
                    CONSTRAINT unique_role_permission UNIQUE (role_name, permission, resource_type)
                );`
            },
            {
                name: 'organizations',
                sql: `CREATE TABLE IF NOT EXISTS organizations (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    name TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    description TEXT,
                    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
                    plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic', 'professional', 'enterprise')),
                    settings JSONB DEFAULT '{}',
                    max_members INTEGER DEFAULT 5,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );`
            },
            {
                name: 'user_organizations',
                sql: `CREATE TABLE IF NOT EXISTS user_organizations (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
                    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'guest')),
                    permissions TEXT[] DEFAULT '{}',
                    invited_by UUID REFERENCES auth.users(id),
                    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    is_active BOOLEAN DEFAULT true,
                    
                    CONSTRAINT unique_user_org UNIQUE (user_id, organization_id)
                );`
            },
            {
                name: 'user_profiles',
                sql: `CREATE TABLE IF NOT EXISTS user_profiles (
                    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                    email TEXT UNIQUE NOT NULL,
                    full_name TEXT,
                    avatar_url TEXT,
                    company TEXT,
                    job_title TEXT,
                    phone TEXT,
                    timezone TEXT DEFAULT 'UTC',
                    locale TEXT DEFAULT 'en',
                    preferences JSONB DEFAULT '{
                        "email_notifications": true,
                        "marketing_emails": false,
                        "theme": "system",
                        "language": "en"
                    }',
                    onboarding_completed BOOLEAN DEFAULT false,
                    onboarding_step INTEGER DEFAULT 0,
                    last_seen_at TIMESTAMP WITH TIME ZONE,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );`
            }
        ];
        
        let successCount = 0;
        let failureCount = 0;
        
        for (const table of tables) {
            const success = await createTableIfNotExists(table.name, table.sql);
            if (success) {
                successCount++;
            } else {
                failureCount++;
            }
        }
        
        console.log(`\n📊 Migration Summary:`);
        console.log(`✅ Successful tables: ${successCount}`);
        console.log(`❌ Failed tables: ${failureCount}`);
        
        if (failureCount === 0) {
            console.log('\n🎉 Core tables created successfully! Manual intervention may be needed for functions and policies.');
        } else {
            console.log('\n⚠️ Some tables failed to create. Please check the errors above.');
        }
        
        // Check if tables now exist
        console.log('\n🔍 Verifying created tables...');
        for (const table of tables) {
            const exists = await testTableExists(table.name);
            console.log(`${exists ? '✅' : '❌'} ${table.name}: ${exists ? 'exists' : 'not found'}`);
        }
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();