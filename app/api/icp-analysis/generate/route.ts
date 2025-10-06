import { NextRequest, NextResponse } from 'next/server';
import { icpAnalysisService } from '@/app/lib/services/icpAnalysisService';
import { createClient } from '@supabase/supabase-js';

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

    // Generate ICP analysis using the service
    const result = await icpAnalysisService.generateICPAnalysis(icpInput);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'ICP generation failed' },
        { status: 500 }
      );
    }

    // Save ICP to Supabase customer_assets table
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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
