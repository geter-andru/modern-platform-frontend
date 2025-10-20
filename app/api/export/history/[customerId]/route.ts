import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders} from '@/app/lib/middleware/api-auth';
import { env } from '@/app/lib/config/environment';
import { getBackendUrl } from '@/app/lib/config/api';

/**
 * GET /api/export/history/[customerId]
 *
 * Proxies export history requests to the Express backend
 * Handles authentication and forwards the request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get authentication headers for backend call
    const authHeaders = await getAuthHeaders(customerId);

    // Forward request to Express backend
    const backendResponse = await fetch(getBackendUrl(`/api/export/history/${customerId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      }
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to get export history' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in export/history API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
