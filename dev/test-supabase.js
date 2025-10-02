#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const projectRef = process.env.SUPABASE_PROJECT_REF || 'molcqjsqtjbfclasynpg';
const supabaseUrl = `https://${projectRef}.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('Testing Supabase connection...');
        console.log(`URL: ${supabaseUrl}`);
        
        // Test basic connection by trying to query an existing table
        const { data, error } = await supabase
            .from('performance_metrics')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('Connection failed:', error);
            return false;
        }
        
        console.log('✅ Connection successful!');
        console.log('Sample data:', data);
        return true;
        
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
}

testConnection();