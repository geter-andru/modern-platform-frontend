import { NextRequest, NextResponse } from 'next/server';
// REMOVED: icpAnalysisService - now calls backend Express API directly for real Claude AI
// import { icpAnalysisService } from '@/app/lib/services/icpAnalysisService';
import { createClient } from '@/app/lib/supabase/server';

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

    // Prepare ICP analysis input
    const icpInput = {
      productName: productData.productName,
      productDescription: productData.productDescription,
      businessModel: productData.businessModel,
      keyFeatures: productData.distinguishingFeature,
      targetMarket: productData.targetMarket || '',
      customerId: customerId
    };

    // Call backend Express API for real Claude AI generation
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    console.log(`🎯 Calling backend API: ${backendUrl}/api/customer/${customerId}/generate-icp`);

    const backendResponse = await fetch(`${backendUrl}/api/customer/${customerId}/generate-icp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.BACKEND_API_KEY || ''
      },
      body: JSON.stringify({
        productData: icpInput,
        triggerAutomation: false // Direct AI generation, no Make.com
      })
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ error: 'Backend API error' }));
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.error || `Backend returned ${backendResponse.status}` },
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'ICP generation failed' },
        { status: 500 }
      );
    }

    // Save ICP to Supabase customer_assets table
    const supabase = await createClient();

    const { error: saveError } = await supabase
      .from('customer_assets')
      .upsert({
        customer_id: customerId,
        icp_content: result.data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'customer_id'
      });

    if (saveError) {
      console.error('❌ Failed to save ICP to database:', saveError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('❌ ICP generation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
