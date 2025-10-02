import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';

// Surgical type definitions based on actual usage in this file
interface AssessmentSessionData {
  company_name?: string;
  created_at: string;
  session_id: string;
  overall_score: number;
  buyer_score: number;
};
interface AssessmentDataResults {
  results?: {
    techScore?: number;
    qualification?: string;
  };
  productInfo?: Record<string, string>;
  challenges: Array<{
    name: string;
    evidence: string;
    pattern: string;
    revenueImpact: string;
    severity: string;
  }>;
  recommendations: Array<{
    name: string;
    whyRecommended: string;
    expectedImprovement: string;
    description: string;
  }>;
  insights: Array<{
    type: string;
    title: string;
    description: string;
  }>;
};
export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const body = await request.json() as { 
      format: 'pdf' | 'docx' | 'csv' | 'json';
      includeProductInfo?: boolean;
      includeChallenges?: boolean;
      includeRecommendations?: boolean;
      includeInsights?: boolean;
    };

    const { 
      format, 
      includeProductInfo = true, 
      includeChallenges = true, 
      includeRecommendations = true, 
      includeInsights = true 
    } = body;

    console.log('🔍 Exporting assessment data for user:', auth.user.id, 'format:', format);

    // Fetch assessment data from Supabase
    const { data: assessmentSessions, error: assessmentError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (assessmentError) {
      console.error('❌ Error fetching assessment data:', assessmentError);
      return NextResponse.json(
        { error: 'Failed to fetch assessment data' },
        { status: 500 }
      );
    }
    if (!assessmentSessions || assessmentSessions.length === 0) {
      return NextResponse.json(
        { error: 'No assessment data found to export' },
        { status: 404 }
      );
    }
    const latestAssessment = assessmentSessions[0];

    // Parse assessment data
    let assessmentData;
    try {
      assessmentData = typeof latestAssessment.assessment_data === 'string' 
        ? JSON.parse(latestAssessment.assessment_data)
        : latestAssessment.assessment_data;
    } catch (parseError) {
      console.error('❌ Error parsing assessment data:', parseError);
      return NextResponse.json(
        { error: 'Invalid assessment data format' },
        { status: 500 }
      );
    }
    // Generate export based on format
    let exportData: Buffer | string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'pdf':
        exportData = await generateAssessmentPDF(latestAssessment, assessmentData, includeProductInfo, includeChallenges, includeRecommendations, includeInsights);
        contentType = 'application/pdf';
        filename = `assessment-results-${auth.user.id}-${new Date().toISOString().split('T')[0]}.pdf`;
        break;
      
      case 'docx':
        exportData = await generateAssessmentDOCX(latestAssessment, assessmentData, includeProductInfo, includeChallenges, includeRecommendations, includeInsights);
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = `assessment-results-${auth.user.id}-${new Date().toISOString().split('T')[0]}.docx`;
        break;
      
      case 'csv':
        exportData = generateAssessmentCSV(latestAssessment, assessmentData, includeProductInfo, includeChallenges, includeRecommendations, includeInsights);
        contentType = 'text/csv';
        filename = `assessment-results-${auth.user.id}-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      
      case 'json':
        exportData = generateAssessmentJSON(latestAssessment, assessmentData, includeProductInfo, includeChallenges, includeRecommendations, includeInsights);
        contentType = 'application/json';
        filename = `assessment-results-${auth.user.id}-${new Date().toISOString().split('T')[0]}.json`;
        break;
      
      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        );
    }
    console.log('✅ Assessment export generated successfully:', format);

    // Return the export data
    return new NextResponse(exportData as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error in assessment export API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
// PDF Generation for Assessment
async function generateAssessmentPDF(assessmentSession: AssessmentSessionData, assessmentData: AssessmentDataResults, includeProductInfo: boolean, includeChallenges: boolean, includeRecommendations: boolean, includeInsights: boolean): Promise<Buffer> {
  const jsPDF = await import('jspdf');
  
  const doc = new (jsPDF as any)();
  
  // Header
  doc.setFontSize(20);
  doc.text('Revenue Readiness Assessment Report', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Company: ${assessmentSession.company_name || 'N/A'}`, 20, 50);
  doc.text(`Date: ${new Date(assessmentSession.created_at).toLocaleDateString()}`, 20, 60);
  doc.text(`Session ID: ${assessmentSession.session_id}`, 20, 70);
  
  // Assessment Scores
  doc.setFontSize(16);
  doc.text('Assessment Scores', 20, 90);
  doc.setFontSize(12);
  doc.text(`Overall Revenue Readiness: ${assessmentSession.overall_score}%`, 20, 110);
  doc.text(`Customer Understanding: ${assessmentSession.buyer_score}%`, 20, 120);
  doc.text(`Technical Value Translation: ${assessmentData.results?.techScore || 'N/A'}%`, 20, 130);
  doc.text(`Qualification Level: ${assessmentData.results?.qualification || 'N/A'}`, 20, 140);
  
  // Professional Level
  const professionalLevel = getProfessionalLevel(assessmentSession.overall_score);
  doc.text(`Professional Level: ${professionalLevel}`, 20, 150);
  
  // Product Information (if included)
  if (includeProductInfo && assessmentData.productInfo) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Product Information', 20, 30);
    doc.setFontSize(12);
    
    let yPosition = 50;
    const productFields = [
      { key: 'productName', label: 'Product Name' },
      { key: 'productDescription', label: 'Description' },
      { key: 'keyFeatures', label: 'Key Features' },
      { key: 'idealCustomerDescription', label: 'Ideal Customer' },
      { key: 'businessModel', label: 'Business Model' },
      { key: 'customerCount', label: 'Customer Count' },
      { key: 'distinguishingFeature', label: 'Distinguishing Feature' }
    ];
    
    productFields.forEach(field => {
      if ((assessmentData.productInfo as any)?.[field.key]) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        doc.setFontSize(14);
        doc.text(`${field.label}:`, 20, yPosition);
        doc.setFontSize(10);
        
        const text = (assessmentData.productInfo as any)?.[field.key];
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, 30, yPosition + 10);
        yPosition += 10 + (lines.length * 5) + 5;
      }
    });
  }
  // Challenges (if included)
  if (includeChallenges && assessmentData.challenges) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Identified Challenges', 20, 30);
    doc.setFontSize(12);
    
    let yPosition = 50;
    assessmentData.challenges.forEach((challenge, index: number) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${challenge.name}`, 20, yPosition);
      doc.setFontSize(10);
      
      doc.text(`Severity: ${challenge.severity}`, 30, yPosition + 10);
      doc.text(`Evidence: ${challenge.evidence}`, 30, yPosition + 20);
      doc.text(`Pattern: ${challenge.pattern}`, 30, yPosition + 30);
      doc.text(`Revenue Impact: ${challenge.revenueImpact}`, 30, yPosition + 40);
      
      yPosition += 60;
    });
  }
  // Recommendations (if included)
  if (includeRecommendations && assessmentData.recommendations) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Tool Recommendations', 20, 30);
    doc.setFontSize(12);
    
    let yPosition = 50;
    assessmentData.recommendations.forEach((rec, index: number) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${rec.name}`, 20, yPosition);
      doc.setFontSize(10);
      
      doc.text(`Description: ${rec.description}`, 30, yPosition + 10);
      doc.text(`Why Recommended: ${rec.whyRecommended}`, 30, yPosition + 20);
      doc.text(`Expected Improvement: ${rec.expectedImprovement}`, 30, yPosition + 30);
      
      yPosition += 50;
    });
  }
  // Insights (if included)
  if (includeInsights && assessmentData.insights) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Hidden Insights', 20, 30);
    doc.setFontSize(12);
    
    let yPosition = 50;
    assessmentData.insights.forEach((insight, index: number) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${insight.title}`, 20, yPosition);
      doc.setFontSize(10);
      
      const lines = doc.splitTextToSize(insight.description, 170);
      doc.text(lines, 30, yPosition + 10);
      yPosition += 10 + (lines.length * 5) + 10;
    });
  }
  return Buffer.from(doc.output('arraybuffer'));
};
// DOCX Generation for Assessment (placeholder)
async function generateAssessmentDOCX(assessmentSession: AssessmentSessionData, assessmentData: AssessmentDataResults, includeProductInfo: boolean, includeChallenges: boolean, includeRecommendations: boolean, includeInsights: boolean): Promise<Buffer> {
  const content = generateAssessmentTextContent(assessmentSession, assessmentData, includeProductInfo, includeChallenges, includeRecommendations, includeInsights);
  return Buffer.from(content, 'utf-8');
};
// CSV Generation for Assessment
function generateAssessmentCSV(assessmentSession: AssessmentSessionData, assessmentData: AssessmentDataResults, includeProductInfo: boolean, includeChallenges: boolean, includeRecommendations: boolean, includeInsights: boolean): string {
  const rows: string[] = [];
  
  // Header row
  rows.push('Section,Category,Value');
  
  // Assessment Scores
  rows.push(`Scores,Overall Score,${assessmentSession.overall_score}`);
  rows.push(`Scores,Buyer Score,${assessmentSession.buyer_score}`);
  rows.push(`Scores,Tech Score,${assessmentData.results?.techScore || 'N/A'}`);
  rows.push(`Scores,Qualification,${assessmentData.results?.qualification || 'N/A'}`);
  rows.push(`Scores,Company,"${assessmentSession.company_name || 'N/A'}"`);
  rows.push(`Scores,Date,"${new Date(assessmentSession.created_at).toLocaleDateString()}"`);
  
  // Product Information (if included)
  if (includeProductInfo && assessmentData.productInfo) {
    Object.entries(assessmentData.productInfo).forEach(([key, value]) => {
      const category = key.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, l => l.toUpperCase());
      rows.push(`Product,${category},"${String(value).replace(/"/g, '""')}"`);
    });
  }
  // Challenges (if included)
  if (includeChallenges && assessmentData.challenges) {
    assessmentData.challenges.forEach((challenge, index: number) => {
      rows.push(`Challenge ${index + 1},Name,"${challenge.name.replace(/"/g, '""')}"`);
      rows.push(`Challenge ${index + 1},Severity,${challenge.severity}`);
      rows.push(`Challenge ${index + 1},Evidence,"${challenge.evidence.replace(/"/g, '""')}"`);
      rows.push(`Challenge ${index + 1},Pattern,"${challenge.pattern.replace(/"/g, '""')}"`);
      rows.push(`Challenge ${index + 1},Revenue Impact,"${challenge.revenueImpact.replace(/"/g, '""')}"`);
    });
  }
  // Recommendations (if included)
  if (includeRecommendations && assessmentData.recommendations) {
    assessmentData.recommendations.forEach((rec, index: number) => {
      rows.push(`Recommendation ${index + 1},Name,"${rec.name.replace(/"/g, '""')}"`);
      rows.push(`Recommendation ${index + 1},Description,"${rec.description.replace(/"/g, '""')}"`);
      rows.push(`Recommendation ${index + 1},Why Recommended,"${rec.whyRecommended.replace(/"/g, '""')}"`);
      rows.push(`Recommendation ${index + 1},Expected Improvement,"${rec.expectedImprovement.replace(/"/g, '""')}"`);
    });
  }
  // Insights (if included)
  if (includeInsights && assessmentData.insights) {
    assessmentData.insights.forEach((insight, index: number) => {
      rows.push(`Insight ${index + 1},Title,"${insight.title.replace(/"/g, '""')}"`);
      rows.push(`Insight ${index + 1},Type,${insight.type}`);
      rows.push(`Insight ${index + 1},Description,"${insight.description.replace(/"/g, '""')}"`);
    });
  }
  return rows.join('\n');
};
// JSON Generation for Assessment
function generateAssessmentJSON(assessmentSession: AssessmentSessionData, assessmentData: AssessmentDataResults, includeProductInfo: boolean, includeChallenges: boolean, includeRecommendations: boolean, includeInsights: boolean): string {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      format: 'json',
      version: '1.0'
    },
    assessment: {
      sessionId: assessmentSession.session_id,
      companyName: assessmentSession.company_name,
      assessmentDate: assessmentSession.created_at,
      scores: {
        overallScore: assessmentSession.overall_score,
        buyerScore: assessmentSession.buyer_score,
        techScore: assessmentData.results?.techScore,
        qualification: assessmentData.results?.qualification
      }
    },
    productInfo: includeProductInfo ? assessmentData.productInfo : null,
    challenges: includeChallenges ? assessmentData.challenges : null,
    recommendations: includeRecommendations ? assessmentData.recommendations : null,
    insights: includeInsights ? assessmentData.insights : null
  };
  
  return JSON.stringify(exportData, null, 2);
};
// Text Content Generation for Assessment
function generateAssessmentTextContent(assessmentSession: AssessmentSessionData, assessmentData: AssessmentDataResults, includeProductInfo: boolean, includeChallenges: boolean, includeRecommendations: boolean, includeInsights: boolean): string {
  let content = 'Revenue Readiness Assessment Report\n';
  content += '===================================\n\n';
  content += `Company: ${assessmentSession.company_name || 'N/A'}\n`;
  content += `Date: ${new Date(assessmentSession.created_at).toLocaleDateString()}\n`;
  content += `Session ID: ${assessmentSession.session_id}\n\n`;
  
  content += 'Assessment Scores\n';
  content += '----------------\n';
  content += `Overall Revenue Readiness: ${assessmentSession.overall_score}%\n`;
  content += `Customer Understanding: ${assessmentSession.buyer_score}%\n`;
  content += `Technical Value Translation: ${assessmentData.results?.techScore || 'N/A'}%\n`;
  content += `Qualification Level: ${assessmentData.results?.qualification || 'N/A'}\n`;
  content += `Professional Level: ${getProfessionalLevel(assessmentSession.overall_score)}\n\n`;
  
  if (includeProductInfo && assessmentData.productInfo) {
    content += 'Product Information\n';
    content += '------------------\n';
    Object.entries(assessmentData.productInfo).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/\b\w/g, l => l.toUpperCase());
      content += `${label}: ${value}\n`;
    });
    content += '\n';
  }
  if (includeChallenges && assessmentData.challenges) {
    content += 'Identified Challenges\n';
    content += '--------------------\n';
    assessmentData.challenges.forEach((challenge, index: number) => {
      content += `${index + 1}. ${challenge.name}\n`;
      content += `   Severity: ${challenge.severity}\n`;
      content += `   Evidence: ${challenge.evidence}\n`;
      content += `   Pattern: ${challenge.pattern}\n`;
      content += `   Revenue Impact: ${challenge.revenueImpact}\n\n`;
    });
  }
  if (includeRecommendations && assessmentData.recommendations) {
    content += 'Tool Recommendations\n';
    content += '--------------------\n';
    assessmentData.recommendations.forEach((rec, index: number) => {
      content += `${index + 1}. ${rec.name}\n`;
      content += `   Description: ${rec.description}\n`;
      content += `   Why Recommended: ${rec.whyRecommended}\n`;
      content += `   Expected Improvement: ${rec.expectedImprovement}\n\n`;
    });
  }
  if (includeInsights && assessmentData.insights) {
    content += 'Hidden Insights\n';
    content += '---------------\n';
    assessmentData.insights.forEach((insight, index: number) => {
      content += `${index + 1}. ${insight.title}\n`;
      content += `   Type: ${insight.type}\n`;
      content += `   Description: ${insight.description}\n\n`;
    });
  }
  return content;
};
// Helper function
function getProfessionalLevel(score: number): string {
  if (score >= 80) return 'Revenue Intelligence Master';
  if (score >= 70) return 'Strategic Revenue Leader';
  if (score >= 60) return 'Revenue Competent';
  if (score >= 50) return 'Revenue Developing';
  return 'Revenue Foundation';
};