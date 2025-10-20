import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/app/lib/middleware/api-auth';
import { env } from '@/app/lib/config/environment';
import { getBackendUrl } from '@/app/lib/config/api';

/**
 * POST /api/products/save
 *
 * Proxies product save requests to the Express backend
 * Handles authentication and forwards the request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productData, customerId } = body;

    if (!productData) {
      return NextResponse.json(
        { success: false, error: 'Product data is required' },
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

    // Forward request to Express backend
    const backendResponse = await fetch(getBackendUrl('/api/products/save'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        productData,
        customerId
      })
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save product' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in products/save API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
