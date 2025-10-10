import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/app/lib/middleware/api-auth';
import { env } from '@/app/lib/config/environment';

/**
 * POST /api/export/icp
 *
 * Proxies ICP export requests to the Express backend
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

    // Get backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    
    // Forward request to Express backend
    const backendResponse = await fetch(`${backendUrl}/api/export/icp`, {
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
        { success: false, error: result.error || 'Failed to export ICP data' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in export/icp API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
