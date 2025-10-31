import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import { env } from '@/app/lib/config/environment';
import { getBackendUrl } from '@/app/lib/config/api';

/**
 * GET /api/products/history
 *
 * Proxies product history requests to the Express backend
 * Handles authentication and forwards the request
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get server-side Supabase session for authentication
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build authentication headers with Supabase JWT
    const authHeaders = {
      'Authorization': `Bearer ${session.access_token}`
    };

    // Forward request to Express backend
    const backendResponse = await fetch(getBackendUrl(`/api/products/history?customerId=${customerId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      }
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch product history' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in products/history API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
