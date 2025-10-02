import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const testResults: any = {
      success: true,
      tables: {},
      message: 'Database connection tests completed'
    };

    // Test common tables that might exist
    const tablesToTest = [
      'user_profiles', 
      'organizations', 
      'user_roles',
      'customer_profiles',
      'customer_assessments', 
      'ai_resource_generations'
    ];

    for (const tableName of tablesToTest) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        testResults.tables[tableName] = {
          exists: !error,
          error: error?.message,
          count: data?.length || 0,
          hasData: (data?.length || 0) > 0
        };
      } catch (e: any) {
        testResults.tables[tableName] = {
          exists: false,
          error: e.message,
          hasData: false
        };
      }
    }

    // Test auth system access
    try {
      const user = await supabase.auth.getUser();
      testResults.auth = {
        hasSession: !!user.data.user,
        userId: user.data.user?.id || null,
        email: user.data.user?.email || null
      };
    } catch (e: any) {
      testResults.auth = {
        hasSession: false,
        error: e.message
      };
    }

    return NextResponse.json(testResults);

  } catch (error: any) {
    console.error('❌ Test DB API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}