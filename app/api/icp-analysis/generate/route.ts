import { NextRequest, NextResponse } from 'next/server';
import { icpAnalysisService } from '@/app/lib/services/icpAnalysisService';

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
