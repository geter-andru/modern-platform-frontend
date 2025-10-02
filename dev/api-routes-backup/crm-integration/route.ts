/** CRM Integration API Route - TypeScript

 * Handles CRM integration requests for HubSpot, Salesforce, and Pipedrive
 * Integrates with CRMIntegrationService for property mappings and data structures
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CRMIntegrationService } from '../../../lib/services/CRMIntegrationService';

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase server client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { 
      platform, 
      icpData, 
      assessmentData 
    } = body;

    // Validate required fields
    if (!platform || !icpData || !assessmentData) {
      return NextResponse.json({ 
        error: 'Missing required fields: platform, icpData, and assessmentData are required' 
      }, { status: 400 });
    }

    // Validate platform
    const crmService = new CRMIntegrationService();
    const supportedPlatforms = crmService.getSupportedPlatforms();
    if (!supportedPlatforms.includes(platform)) {
      return NextResponse.json({ 
        error: `Unsupported CRM platform: ${platform}. Supported platforms: ${supportedPlatforms.join(', ')}` 
      }, { status: 400 });
    }

    // Generate CRM integration data
    let result;
    switch (platform) {
      case 'hubspot':
        result = crmService.generateHubSpotProperties(icpData, assessmentData);
        break;
      case 'salesforce':
        result = crmService.generateSalesforceFields(icpData, assessmentData);
        break;
      case 'pipedrive':
        result = crmService.generatePipedriveData(icpData, assessmentData);
        break;
      default:
        return NextResponse.json({ 
          error: `Unsupported CRM platform: ${platform}` 
        }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ 
        error: 'CRM integration failed', 
        details: result.error 
      }, { status: 500 });
    }

    // Validate generated data
    const validation = crmService.validateCRMData(result.data as any, platform);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Generated CRM data is invalid', 
        details: validation.errors 
      }, { status: 500 });
    }

    // Store CRM integration data in Supabase
    try {
      await crmService.storeCRMIntegrationData(platform, result.data as any, user.id);
    } catch (storageError) {
      console.error('Error storing CRM integration data:', storageError);
      // Continue with response even if storage fails
    }

    // Return CRM integration result
    return NextResponse.json({
      success: true,
      platform,
      data: result.data,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('CRM Integration API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase server client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    // Get CRM integration data for user
    const crmService = new CRMIntegrationService();
    const crmData = await crmService.getCRMIntegrationData(user.id, platform || undefined);

    // Get supported platforms and field types
    const supportedPlatforms = crmService.getSupportedPlatforms();
    const platformFieldTypes = platform ? 
      { [platform]: crmService.getPlatformFieldTypes(platform) } :
      Object.fromEntries(
        supportedPlatforms.map(p => [p, crmService.getPlatformFieldTypes(p)])
      );

    return NextResponse.json({
      success: true,
      crmData,
      supportedPlatforms,
      platformFieldTypes
    });

  } catch (error) {
    console.error('CRM Integration API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
