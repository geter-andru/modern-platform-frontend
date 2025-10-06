#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client with hardcoded values for MVP
const supabaseUrl = 'https://molcqjsqtjbfclasynpg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runConstraintsMigration() {
    try {
        console.log('🔧 Running Unique Constraints Migration...');
        console.log(`📍 Supabase URL: ${supabaseUrl}`);
        console.log('');

        // Read the migration file
        const migrationPath = join(__dirname, '../infra/supabase/migrations/20250127000003_add_unique_constraints_for_seeding.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf8');
        
        console.log('📖 Migration file loaded successfully');
        console.log('');

        // Split the migration into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`🔨 Executing ${statements.length} SQL statements...`);
        console.log('');

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);
                
                const { error } = await supabase.rpc('exec_sql', { sql: statement });
                
                if (error) {
                    console.error(`❌ Error in statement ${i + 1}:`, error);
                    throw error;
                }
                
                console.log(`✅ Statement ${i + 1} executed successfully`);
            }
        }

        console.log('');
        console.log('🎉 UNIQUE CONSTRAINTS MIGRATION COMPLETED SUCCESSFULLY!');
        console.log('');
        console.log('✅ Added unique constraints:');
        console.log('   • resources(customer_id, title)');
        console.log('   • migration_log(migration_name)');
        console.log('');
        console.log('🎯 Database is now ready for idempotent seeding!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Main execution
async function main() {
    console.log('🚀 Unique Constraints Migration Script');
    console.log('=====================================');
    console.log('');
    
    await runConstraintsMigration();
}

main().catch(console.error);
