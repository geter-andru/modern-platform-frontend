import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!;
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!;

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json() as { action: string; email: string; password: string };
    
    // Create a new Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (action === 'signup') {
      // Sign up a new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User',
            company: 'Test Company'
          }
        }
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: data.user,
        session: data.session
      });
    }

    if (action === 'login') {
      // Sign in existing user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: data.user,
        session: data.session,
        access_token: data.session?.access_token
      });
    }

    if (action === 'check') {
      // Check current session
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json({ 
          authenticated: false,
          error: error?.message || 'No user session'
        });
      }

      // Check if profile exists
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      // Check organizations
      const { data: orgs } = await supabase
        .from('user_organizations')
        .select(`
          *,
          organizations (
            id,
            name,
            slug
          )
        `)
        .eq('user_id', user.id);

      return NextResponse.json({
        authenticated: true,
        user,
        profile,
        roles: roles || [],
        organizations: orgs || []
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Auth test error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Auth test endpoint',
    usage: {
      signup: 'POST with {action: "signup", email: "...", password: "..."}',
      login: 'POST with {action: "login", email: "...", password: "..."}',
      check: 'POST with {action: "check"} and Authorization header'
    }
  });
}