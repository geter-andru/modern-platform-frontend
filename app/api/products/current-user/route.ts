import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/app/lib/middleware/api-auth';
import { env } from '@/app/lib/config/environment';
import { getBackendUrl } from '@/app/lib/config/api';

/**
 * GET /api/products/current-user
 *
 * Proxies current user product requests to the Express backend
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

    // Get authentication headers for backend call
    const authHeaders = await getAuthHeaders(customerId);

    // Forward request to Express backend
    const backendResponse = await fetch(getBackendUrl(`/api/products/current-user?customerId=${customerId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      }
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch current user product' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in products/current-user API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
