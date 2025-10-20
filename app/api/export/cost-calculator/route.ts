import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/app/lib/middleware/api-auth';
import { env } from '@/app/lib/config/environment';
import { getBackendUrl } from '@/app/lib/config/api';

/**
 * POST /api/export/cost-calculator
 *
 * Proxies cost calculator export requests to the Express backend
 * Handles authentication and forwards the request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, format = 'pdf', includeData } = body;

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get authentication headers for backend call
    const authHeaders = await getAuthHeaders(customerId);

    // Forward request to Express backend
    const backendResponse = await fetch(getBackendUrl('/api/export/cost-calculator'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        customerId,
        format,
        includeData
      })
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to export cost calculator data' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in export/cost-calculator API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
