import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if Airtable is configured
    const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
    const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    
    if (!apiKey || apiKey.includes('your_') || !baseId) {
      return NextResponse.json({
        success: false,
        error: 'Airtable not configured',
        details: {
          apiKey: apiKey ? 'Set' : 'Missing',
          baseId: baseId ? 'Set' : 'Missing',
          configured: false
        }
      }, { status: 400 });
    }

    // Test Airtable connection
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/Customer%20Assets?maxRecords=1`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Airtable API error',
        details: {
          status: response.status,
          statusText: response.statusText,
          configured: true,
          connected: false
        }
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Airtable connection successful',
      details: {
        configured: true,
        connected: true,
        baseId,
        recordCount: data.records?.length || 0,
        tableName: 'Customer Assets'
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Airtable test failed',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        configured: true,
        connected: false
      }
    }, { status: 500 });
  }
}
