// Test endpoint to verify Supabase connection
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic connection test with anon key
    const startTime = Date.now();
    
    // Test auth status
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const authTime = Date.now() - startTime;
    
    // Test 2: Check if we can query a table (should work even without auth if properly configured)
    const queryStart = Date.now();
    const { data: configData, error: configError } = await supabase
      .from('product_configurations')
      .select('id, product_name')
      .limit(1);
    const queryTime = Date.now() - queryStart;
    
    // Test 3: Admin client connection (service role)
    const adminStart = Date.now();
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('customer_profiles')
      .select('id, customer_id')
      .limit(1);
    const adminTime = Date.now() - adminStart;
    
    // Test 4: Check if tables exist by querying information_schema
    const { data: tableData, error: tableError } = await supabaseAdmin
      .rpc('get_table_list');
    
    // If RPC doesn't exist, try direct query (may fail due to permissions)
    let tables = [];
    if (tableError) {
      console.log('RPC not available, trying direct query...');
      const { data: directTables, error: directError } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (!directError) {
        tables = directTables || [];
      }
    } else {
      tables = tableData || [];
    }
    
    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        authentication: {
          status: sessionError ? 'error' : 'success',
          responseTime: `${authTime}ms`,
          hasSession: !!sessionData?.session,
          error: sessionError?.message || null
        },
        publicQuery: {
          status: configError ? 'error' : 'success',
          responseTime: `${queryTime}ms`,
          recordsFound: configData?.length || 0,
          error: configError?.message || null
        },
        adminConnection: {
          status: adminError ? 'error' : 'success',
          responseTime: `${adminTime}ms`,
          recordsFound: adminData?.length || 0,
          error: adminError?.message || null
        },
        database: {
          status: tableError && !tables.length ? 'error' : 'success',
          tablesFound: tables.length,
          tables: tables.slice(0, 10), // First 10 tables
          error: tableError?.message || null
        }
      },
      environment: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    };
    
    console.log('✅ Supabase connection test completed:', results);
    
    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}