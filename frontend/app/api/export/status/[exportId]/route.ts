import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/app/lib/middleware/api-auth';
import { env } from '@/app/lib/config/environment';

/**
 * GET /api/export/status/[exportId]
 *
 * Proxies export status requests to the Express backend
 * Handles authentication and forwards the request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ exportId: string }> }
) {
  try {
    const { exportId } = await params;
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!exportId) {
      return NextResponse.json(
        { success: false, error: 'Export ID is required' },
        { status: 400 }
      );
    }

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get authentication headers for backend call
    const authHeaders = await getAuthHeaders(customerId);

    // Get backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    
    // Forward request to Express backend
    const backendResponse = await fetch(`${backendUrl}/api/export/status/${exportId}?customerId=${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      }
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to get export status' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in export/status API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
