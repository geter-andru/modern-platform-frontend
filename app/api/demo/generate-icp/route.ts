import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/app/lib/config/api';

/**
 * Demo ICP Generation API Route
 * Proxies requests to backend Express API for demo ICP generation
 *
 * No authentication required - rate limited by IP on backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, productDescription, targetBuyer } = body;

    // Validate required fields
    if (!productName || !productDescription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product name and description are required'
        },
        { status: 400 }
      );
    }

    // Call backend Express API
    const apiUrl = getBackendUrl('/api/demo/generate-icp');
    console.log(`🎯 [Demo API] Calling backend: ${apiUrl}`);

    const backendResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productName,
        productDescription,
        targetBuyer: targetBuyer || null
      })
    });

    // Handle rate limiting (429)
    if (backendResponse.status === 429) {
      const errorData = await backendResponse.json();
      console.warn('⚠️ [Demo API] Rate limit exceeded');
      return NextResponse.json(errorData, { status: 429 });
    }

    // Handle other errors
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        error: 'Backend API error'
      }));
      console.error('❌ [Demo API] Backend error:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || `Backend returned ${backendResponse.status}`
        },
        { status: backendResponse.status }
      );
    }

    // Return successful response
    const result = await backendResponse.json();
    console.log(`✅ [Demo API] Generated ${result.personas?.length || 0} personas`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ [Demo API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
