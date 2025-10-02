/**
 * Export Resource API Route
 * 
 * POST /api/resources/[resourceId]/export
 * Exports a resource in the specified format
 */

import { NextRequest, NextResponse } from 'next/server';
import { resourceExportService } from '@/app/lib/services/resourceExportService';
import { 
  ExportResourceRequestSchema,
  ExportResourceResponseSchema 
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

export async function POST(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    console.log(`📤 Exporting resource: ${params.resourceId}`);

    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = ExportResourceRequestSchema.parse({
      ...body,
      resource_id: params.resourceId
    });

    // Export the resource
    const exportRecord = await resourceExportService.exportResource(
      validatedRequest.resource_id,
      validatedRequest.export_format,
      validatedRequest.options
    );

    // Return success response
    const response: ExportResourceResponseSchema = {
      success: true,
      data: exportRecord,
      download_url: exportRecord.download_url
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Resource export failed:', error);

    const response: ExportResourceResponseSchema = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Resource export endpoint - POST only',
    methods: ['POST'],
    schema: 'ExportResourceRequestSchema'
  });
}
