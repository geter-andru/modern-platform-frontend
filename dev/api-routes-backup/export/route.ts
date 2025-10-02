/** Export API Route - TypeScript

 * Handles multi-format export requests for ICP analysis, financial impact, and business case data
 * Integrates with ExportEngineService for AI, CRM, and sales automation exports
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import exportEngineService from '../../../lib/services/ExportEngineService';
import { 
  validateRequestBody,
  validateQueryParams,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  ExportRequestSchema,
  ExportHistoryRequestSchema,
  ExportResponseSchema,
  ExportHistoryResponseSchema,
  type ExportRequest,
  type ExportHistoryRequest,
  type ExportResponse,
  type ExportHistoryResponse
} from '@/lib/validation';

export const dynamic = 'force-dynamic';

export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate request body
    const bodyValidation = await validateRequestBody(request, ExportRequestSchema, validationConfig);
    
    if (!bodyValidation.success) {
      console.error('❌ Request body validation failed:', bodyValidation.errors);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request data',
          details: bodyValidation.errors 
        },
        { status: 400 }
      );
    }

    const validatedBody = bodyValidation.data as ExportRequest;
    console.log('🔍 Processing export request for user:', auth.user.id, 'with format:', validatedBody.format);

    // Validate export options using the service
    const exportOptions = {
      format: validatedBody.format,
      contentType: validatedBody.contentType,
      userTools: validatedBody.userTools,
      includeMetadata: validatedBody.includeMetadata,
      includeTemplates: validatedBody.includeTemplates,
      customFields: validatedBody.customFields
    };

    const validation = exportEngineService.validateExportOptions(exportOptions);
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid export options', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Generate export data
    const exportResult = await exportEngineService.exportData(exportOptions);

    if (!exportResult.success) {
      return NextResponse.json({ 
        success: false,
        error: 'Export failed', 
        details: exportResult.error 
      }, { status: 500 });
    }

    // Store export history in Supabase
    try {
      const { error: historyError } = await supabase
        .from('export_history')
        .insert({
          user_id: auth.user.id,
          format: validatedBody.format,
          content_type: validatedBody.contentType,
          user_tools: validatedBody.userTools,
          success: true,
          metadata: exportResult.metadata,
          timestamp: new Date().toISOString()
        });

      if (historyError) {
        console.error('Error storing export history:', historyError);
      }
    } catch (historyError) {
      console.error('Error storing export history:', historyError);
    }

    // Prepare response data
    const responseData: ExportResponse = {
      success: true,
      data: exportResult.data,
      metadata: exportResult.metadata,
      downloadUrl: exportResult.downloadUrl,
      filename: exportResult.filename,
      message: 'Export completed successfully'
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      ExportResponseSchema,
      validationContext,
      validationConfig
    );

    if (!responseValidation.success) {
      console.error('❌ Response validation failed:', responseValidation.errors);
      // In production, you might want to return a sanitized response
      // For now, we'll log the warning but return the original response
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Unexpected error in export API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing export request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});

export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate query parameters
    const queryParams = new URL(request.url).searchParams;
    const queryValidation = validateQueryParams(queryParams, ExportHistoryRequestSchema, validationConfig);
    
    if (!queryValidation.success) {
      console.error('❌ Query parameter validation failed:', queryValidation.errors);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.errors 
        },
        { status: 400 }
      );
    }

    const validatedParams = queryValidation.data as ExportHistoryRequest;
    console.log('🔍 Fetching export history for user:', auth.user.id, 'with params:', validatedParams);

    // Get export history for user
    const exportHistory = await exportEngineService.getExportHistory(auth.user.id);

    // Get available export formats
    const availableFormats = exportEngineService.getAvailableFormats();

    // Prepare response data
    const responseData: ExportHistoryResponse = {
      success: true,
      exportHistory,
      availableFormats,
      pagination: {
        total: exportHistory.length,
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        hasMore: exportHistory.length > validatedParams.offset + validatedParams.limit
      },
      message: 'Export history retrieved successfully'
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      ExportHistoryResponseSchema,
      validationContext,
      validationConfig
    );

    if (!responseValidation.success) {
      console.error('❌ Response validation failed:', responseValidation.errors);
      // In production, you might want to return a sanitized response
      // For now, we'll log the warning but return the original response
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Unexpected error in export API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while retrieving export data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
