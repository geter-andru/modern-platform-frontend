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

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    try {
        console.log('Reading migration file...');
        const migrationPath = join(__dirname, 'supabase/migrations/003_user_management_system.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf8');
        
        console.log('Connecting to Supabase...');
        console.log(`URL: ${supabaseUrl}`);
        
        // Split the migration into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`Found ${statements.length} SQL statements to execute`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';
            
            // Skip comments and empty lines
            if (statement.trim().startsWith('--') || statement.trim() === ';') {
                continue;
            }
            
            try {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
                console.log(`Statement preview: ${statement.substring(0, 100)}...`);
                
                const { data, error } = await supabase.rpc('exec_sql', {
                    sql: statement
                });
                
                if (error) {
                    console.error(`Error in statement ${i + 1}:`, error);
                    errorCount++;
                } else {
                    console.log(`Statement ${i + 1} executed successfully`);
                    successCount++;
                }
                
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (err) {
                console.error(`Exception in statement ${i + 1}:`, err.message);
                errorCount++;
            }
        }
        
        console.log(`\nMigration completed:`);
        console.log(`- Successful statements: ${successCount}`);
        console.log(`- Failed statements: ${errorCount}`);
        
        if (errorCount === 0) {
            console.log('✅ Migration applied successfully!');
        } else {
            console.log('⚠️ Migration completed with some errors. Please review the output above.');
        }
        
    } catch (error) {
        console.error('Failed to run migration:', error);
        process.exit(1);
    }
}

runMigration();