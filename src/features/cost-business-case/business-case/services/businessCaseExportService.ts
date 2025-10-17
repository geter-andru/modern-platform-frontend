/**
 * businessCaseExportService.ts
 *
 * Export service for Business Case Builder
 * Generates professional one-page business cases in PDF, DOCX, and HTML formats
 * Integrates with Phase 2.1 export infrastructure (PDFGenerator, DOCXGenerator)
 */

import { BusinessCaseData } from '../BusinessCaseTypes';
import { PDFGenerator } from '@/app/lib/services/export/generators/PDFGenerator';
import { DOCXGenerator } from '@/app/lib/services/export/generators/DOCXGenerator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html';
  filename?: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    companyName?: string;
  };
  includeConfidenceIndicators?: boolean;
  includeMetadata?: boolean;
}

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  html?: string;
  error?: string;
  filename: string;
}

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

/**
 * Transform BusinessCaseData to format expected by existing PDF/DOCX generators
 */
function transformBusinessCaseForExport(businessCase: BusinessCaseData): any {
  const {
    header,
    executiveSummary,
    businessChallenge,
    approachDifferentiation,
    businessImpactROI,
    investmentImplementation,
    strategyNextSteps
  } = businessCase;

  return {
    // Cover page
    companyName: header.companyName,
    title: header.priorityHeadline || 'Strategic Business Case',
    championName: header.championName,
    championTitle: header.championTitle,
    partnerName: header.partnerName,
    partnerCompany: header.partnerCompany,

    // Executive Summary Section
    executiveSummary: executiveSummary.fullSummary || `
${executiveSummary.businessChange ? `Business Change: ${executiveSummary.businessChange}` : ''}

${executiveSummary.recommendedSolution ? `Solution: ${executiveSummary.recommendedSolution}` : ''}

${executiveSummary.strategicOutcome ? `Strategic Outcome: ${executiveSummary.strategicOutcome}` : ''}

${executiveSummary.implementationTimeline ? `Timeline: ${executiveSummary.implementationTimeline}` : ''}

${executiveSummary.currentCostPain ? `Current Cost: ${executiveSummary.currentCostPain}` : ''}

${executiveSummary.executiveGoal ? `Executive Goal: ${executiveSummary.executiveGoal}` : ''}
    `.trim(),

    // Problem Statement (Section 2)
    problemStatement: businessChallenge.currentRealityDescription ? `
${businessChallenge.currentRealityDescription}

${businessChallenge.specificProblem ? `Specific Issue: ${businessChallenge.specificProblem}` : ''}

${businessChallenge.frequency ? `Frequency: ${businessChallenge.frequency}` : ''}

${businessChallenge.affectedStakeholders ? `Affected Stakeholders: ${businessChallenge.affectedStakeholders}` : ''}

${businessChallenge.affectedCount ? `Impact: ${businessChallenge.affectedCount} people affected` : ''}

${businessChallenge.dollarCost ? `Financial Impact: $${businessChallenge.dollarCost.toLocaleString()}` : ''}

${businessChallenge.consequence ? `Consequences: ${businessChallenge.consequence}` : ''}

${businessChallenge.consequenceTimeline ? `Timeline: ${businessChallenge.consequenceTimeline}` : ''}
    `.trim() : undefined,

    // Proposed Solution (Section 3)
    solution: approachDifferentiation.fullRecommendedSolution || (() => {
      const capabilities = [
        approachDifferentiation.capability1,
        approachDifferentiation.capability2,
        approachDifferentiation.capability3,
        approachDifferentiation.capability4
      ].filter(c => c && c.title);

      return `
${approachDifferentiation.discoveryStakeholders && approachDifferentiation.discoveryStakeholders.length > 0 ?
        `Discovery Stakeholders: ${approachDifferentiation.discoveryStakeholders.join(', ')}\n` : ''}

${capabilities.length > 0 ? `Key Capabilities:\n${capabilities.map((c, i: number) =>
        `${i + 1}. ${c.title}: ${c.problemSolved} → ${c.businessOutcome}`).join('\n')}` : ''}

${approachDifferentiation.phaseFramework && approachDifferentiation.phaseFramework.phase1 ?
        `\nImplementation Phases:\n1. ${approachDifferentiation.phaseFramework.phase1}\n2. ${approachDifferentiation.phaseFramework.phase2}\n3. ${approachDifferentiation.phaseFramework.phase3}` : ''}
      `.trim();
    })(),

    // Key Benefits (Section 4)
    benefits: [
      businessImpactROI.visionFrom && businessImpactROI.visionTo ?
        `Transform from "${businessImpactROI.visionFrom}" to "${businessImpactROI.visionTo}"` : null,
      businessImpactROI.executiveKPI.strategicValue ?
        `Strategic Value: ${businessImpactROI.executiveKPI.strategicValue}` : null,
      businessImpactROI.executiveKPI.targetByDate ?
        `Target: ${businessImpactROI.executiveKPI.targetByDate}` : null,
    ].filter(Boolean),

    // Financial Analysis (Section 5)
    financialAnalysis: {
      investment: investmentImplementation.totalInvestment,
      roi: businessImpactROI.financialROI || investmentImplementation.roiRatio,
      expectedReturn: businessChallenge.dollarCost, // Cost of inaction
      paybackPeriod: investmentImplementation.roiTimeframe,
    },

    // ROI Projections
    roiProjections: `
${businessImpactROI.financialROI ? `Expected ROI: ${businessImpactROI.financialROI}` : ''}

${businessImpactROI.executiveKPI.currentState && businessImpactROI.executiveKPI.targetByDate ?
      `Current State: ${businessImpactROI.executiveKPI.currentState}\nTarget State: ${businessImpactROI.executiveKPI.targetByDate}` : ''}

${businessImpactROI.executiveKPI.impactArea ? `Impact Area: ${businessImpactROI.executiveKPI.impactArea}` : ''}
    `.trim(),

    // Implementation Plan (Section 6)
    implementationPlan: `
${investmentImplementation.totalInvestment ? `Total Investment: $${investmentImplementation.totalInvestment.toLocaleString()}` : ''}

${investmentImplementation.milestones && investmentImplementation.milestones.length > 0 ?
      `Implementation Milestones:\n${investmentImplementation.milestones.map((m, i: number) =>
        `${i + 1}. ${m.period}: ${m.description}`).join('\n')}` : ''}

${investmentImplementation.fullTimelineDescription ? `\nTimeline: ${investmentImplementation.fullTimelineDescription}` : ''}
    `.trim(),

    // Risks and Strategic Rationale (Section 7)
    risks: [
      strategyNextSteps.valueAlignment1 ? `Value Alignment: ${strategyNextSteps.valueAlignment1}` : null,
      strategyNextSteps.valueAlignment2 ? `Value Alignment: ${strategyNextSteps.valueAlignment2}` : null,
      strategyNextSteps.valueAlignment3 ? `Value Alignment: ${strategyNextSteps.valueAlignment3}` : null,
      strategyNextSteps.alternativesConsidered && strategyNextSteps.alternativesConsidered.length > 0 ?
        `Alternatives Considered: ${strategyNextSteps.alternativesConsidered.join(', ')}` : null,
      strategyNextSteps.uniqueDeliverable ? `Unique Deliverable: ${strategyNextSteps.uniqueDeliverable}` : null,
      strategyNextSteps.immediateActions && strategyNextSteps.immediateActions.length > 0 ?
        `Next Steps: ${strategyNextSteps.immediateActions.map(a => a.actionDescription).join('; ')}` : null,
    ].filter(Boolean)
  };
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export business case to PDF format
 */
export async function exportToPDF(
  businessCase: BusinessCaseData,
  options: ExportOptions = { format: 'pdf' }
): Promise<ExportResult> {
  try {
    const transformedData = transformBusinessCaseForExport(businessCase);
    const filename = options.filename || `business-case-${Date.now()}.pdf`;

    const blob = await PDFGenerator.generateBusinessCase(transformedData, {
      title: businessCase.header.priorityHeadline || 'Business Case',
      subtitle: businessCase.header.companyName || 'Strategic Investment Proposal',
      author: businessCase.header.partnerName || 'Revenue Intelligence Platform',
      branding: options.branding
    });

    return {
      success: true,
      blob,
      filename
    };
  } catch (error) {
    console.error('PDF export failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF generation failed',
      filename: ''
    };
  }
}

/**
 * Export business case to DOCX format
 */
export async function exportToDOCX(
  businessCase: BusinessCaseData,
  options: ExportOptions = { format: 'docx' }
): Promise<ExportResult> {
  try {
    const transformedData = transformBusinessCaseForExport(businessCase);
    const filename = options.filename || `business-case-${Date.now()}.docx`;

    const blob = await DOCXGenerator.generateBusinessCase(transformedData, {
      title: businessCase.header.priorityHeadline || 'Business Case',
      subtitle: businessCase.header.companyName || 'Strategic Investment Proposal',
      author: businessCase.header.partnerName || 'Revenue Intelligence Platform',
      branding: options.branding
    });

    return {
      success: true,
      blob,
      filename
    };
  } catch (error) {
    console.error('DOCX export failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'DOCX generation failed',
      filename: ''
    };
  }
}

/**
 * Export business case to HTML format (email-friendly)
 */
export async function exportToHTML(
  businessCase: BusinessCaseData,
  options: ExportOptions = { format: 'html' }
): Promise<ExportResult> {
  try {
    const filename = options.filename || `business-case-${Date.now()}.html`;
    const html = generateHTMLBusinessCase(businessCase, options);

    // Convert HTML to blob for download
    const blob = new Blob([html], { type: 'text/html' });

    return {
      success: true,
      blob,
      html,
      filename
    };
  } catch (error) {
    console.error('HTML export failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'HTML generation failed',
      filename: ''
    };
  }
}

/**
 * Generate HTML business case (email-friendly format)
 */
function generateHTMLBusinessCase(businessCase: BusinessCaseData, options: ExportOptions): string {
  const { header, executiveSummary, businessChallenge, approachDifferentiation, businessImpactROI, investmentImplementation, strategyNextSteps } = businessCase;

  const primaryColor = options.branding?.primaryColor || '#8B5CF6';
  const secondaryColor = options.branding?.secondaryColor || '#3B82F6';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${header.priorityHeadline || 'Business Case'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 3px solid ${primaryColor};
            margin-bottom: 30px;
        }
        .header h1 {
            color: ${primaryColor};
            font-size: 32px;
            margin: 0 0 10px 0;
            font-weight: 700;
        }
        .header .company {
            color: ${secondaryColor};
            font-size: 24px;
            font-weight: 600;
            margin: 10px 0;
        }
        .header .meta {
            color: #6b7280;
            font-size: 14px;
            margin-top: 15px;
        }
        .section {
            margin: 30px 0;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child {
            border-bottom: none;
        }
        .section h2 {
            color: ${primaryColor};
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid ${primaryColor};
        }
        .section h3 {
            color: ${secondaryColor};
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0 10px 0;
        }
        .section p {
            margin: 10px 0;
            color: #4b5563;
        }
        .metric-box {
            background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid ${primaryColor};
        }
        .metric-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: ${primaryColor};
        }
        .bullet-list {
            list-style: none;
            padding: 0;
        }
        .bullet-list li {
            padding: 8px 0 8px 25px;
            position: relative;
        }
        .bullet-list li:before {
            content: "→";
            color: ${primaryColor};
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .key-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 30px 0 0 0;
            margin-top: 40px;
            border-top: 2px solid #e5e7eb;
            color: #9ca3af;
            font-size: 12px;
        }
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <h1>${header.priorityHeadline || 'Strategic Business Case'}</h1>
            <div class="company">${header.companyName || 'Business Case'}</div>
            <div class="meta">
                ${header.championName && header.championTitle ? `Prepared for: ${header.championName}, ${header.championTitle}` : ''}
                ${header.partnerName && header.partnerCompany ? `<br>Prepared by: ${header.partnerName}, ${header.partnerCompany}` : ''}
                <br>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="section">
            <h2>Executive Summary</h2>
            ${executiveSummary.fullSummary ? `<p>${executiveSummary.fullSummary}</p>` : ''}

            <div class="key-metrics">
                ${businessChallenge.dollarCost ? `
                <div class="metric-box">
                    <div class="metric-label">Cost of Inaction</div>
                    <div class="metric-value">$${businessChallenge.dollarCost.toLocaleString()}</div>
                </div>
                ` : ''}

                ${investmentImplementation.totalInvestment ? `
                <div class="metric-box">
                    <div class="metric-label">Total Investment</div>
                    <div class="metric-value">$${investmentImplementation.totalInvestment.toLocaleString()}</div>
                </div>
                ` : ''}

                ${businessImpactROI.financialROI || investmentImplementation.roiRatio ? `
                <div class="metric-box">
                    <div class="metric-label">Expected ROI</div>
                    <div class="metric-value">${businessImpactROI.financialROI || investmentImplementation.roiRatio}</div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- BUSINESS CHALLENGE -->
        ${businessChallenge.currentRealityDescription ? `
        <div class="section">
            <h2>Business Challenge</h2>
            <p><strong>${businessChallenge.currentRealityDescription}</strong></p>
            ${businessChallenge.specificProblem ? `<p>${businessChallenge.specificProblem}</p>` : ''}

            ${businessChallenge.dollarCost || businessChallenge.affectedCount || businessChallenge.frequency ? `
            <h3>Impact Analysis</h3>
            <ul class="bullet-list">
                ${businessChallenge.dollarCost ? `<li>Financial Impact: $${businessChallenge.dollarCost.toLocaleString()}</li>` : ''}
                ${businessChallenge.affectedCount ? `<li>Affected: ${businessChallenge.affectedCount} people</li>` : ''}
                ${businessChallenge.frequency ? `<li>Frequency: ${businessChallenge.frequency}</li>` : ''}
                ${businessChallenge.affectedStakeholders ? `<li>Stakeholders: ${businessChallenge.affectedStakeholders}</li>` : ''}
            </ul>
            ` : ''}
        </div>
        ` : ''}

        <!-- APPROACH & DIFFERENTIATION -->
        ${approachDifferentiation.fullRecommendedSolution || approachDifferentiation.capability1 ? `
        <div class="section">
            <h2>Approach & Differentiation</h2>
            ${approachDifferentiation.fullRecommendedSolution ? `<p>${approachDifferentiation.fullRecommendedSolution}</p>` : ''}

            ${[approachDifferentiation.capability1, approachDifferentiation.capability2, approachDifferentiation.capability3, approachDifferentiation.capability4].filter(c => c && c.title).length > 0 ? `
            <h3>Key Capabilities</h3>
            <ul class="bullet-list">
                ${[approachDifferentiation.capability1, approachDifferentiation.capability2, approachDifferentiation.capability3, approachDifferentiation.capability4]
                  .filter(c => c && c.title)
                  .map(c => `<li><strong>${c.title}:</strong> ${c.problemSolved} → ${c.businessOutcome}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        ` : ''}

        <!-- BUSINESS IMPACT & ROI -->
        <div class="section">
            <h2>Business Impact & ROI</h2>

            ${businessImpactROI.visionFrom && businessImpactROI.visionTo ? `
            <div class="metric-box">
                <p><strong>From:</strong> ${businessImpactROI.visionFrom}</p>
                <p><strong>To:</strong> ${businessImpactROI.visionTo}</p>
            </div>
            ` : ''}

            ${businessImpactROI.executiveKPI.impactArea ? `
            <h3>Executive KPI</h3>
            <ul class="bullet-list">
                <li><strong>Impact Area:</strong> ${businessImpactROI.executiveKPI.impactArea}</li>
                ${businessImpactROI.executiveKPI.currentState ? `<li><strong>Current State:</strong> ${businessImpactROI.executiveKPI.currentState}</li>` : ''}
                ${businessImpactROI.executiveKPI.targetByDate ? `<li><strong>Target:</strong> ${businessImpactROI.executiveKPI.targetByDate}</li>` : ''}
                ${businessImpactROI.executiveKPI.strategicValue ? `<li><strong>Strategic Value:</strong> ${businessImpactROI.executiveKPI.strategicValue}</li>` : ''}
            </ul>
            ` : ''}
        </div>

        <!-- INVESTMENT & IMPLEMENTATION -->
        <div class="section">
            <h2>Investment & Implementation</h2>

            ${investmentImplementation.totalInvestment ? `
            <div class="metric-box">
                <div class="metric-label">Total Investment</div>
                <div class="metric-value">$${investmentImplementation.totalInvestment.toLocaleString()}</div>
                ${investmentImplementation.roiTimeframe ? `<p style="margin-top: 10px; color: #6b7280;">Payback: ${investmentImplementation.roiTimeframe}</p>` : ''}
            </div>
            ` : ''}

            ${investmentImplementation.milestones && investmentImplementation.milestones.length > 0 ? `
            <h3>Implementation Milestones</h3>
            <ul class="bullet-list">
                ${investmentImplementation.milestones.map(m => `<li><strong>${m.period}:</strong> ${m.description}</li>`).join('')}
            </ul>
            ` : ''}
        </div>

        <!-- STRATEGIC RATIONALE & NEXT STEPS -->
        <div class="section">
            <h2>Strategic Rationale & Next Steps</h2>

            ${strategyNextSteps.valueAlignment1 || strategyNextSteps.valueAlignment2 || strategyNextSteps.valueAlignment3 ? `
            <h3>Value Alignment</h3>
            <ul class="bullet-list">
                ${strategyNextSteps.valueAlignment1 ? `<li>${strategyNextSteps.valueAlignment1}</li>` : ''}
                ${strategyNextSteps.valueAlignment2 ? `<li>${strategyNextSteps.valueAlignment2}</li>` : ''}
                ${strategyNextSteps.valueAlignment3 ? `<li>${strategyNextSteps.valueAlignment3}</li>` : ''}
            </ul>
            ` : ''}

            ${strategyNextSteps.alternativesConsidered && strategyNextSteps.alternativesConsidered.length > 0 ? `
            <h3>Alternatives Considered</h3>
            <ul class="bullet-list">
                ${strategyNextSteps.alternativesConsidered.map((alt: string) => `<li>${alt}</li>`).join('')}
            </ul>
            ` : ''}

            ${strategyNextSteps.uniqueDeliverable ? `
            <h3>Unique Deliverable</h3>
            <p>${strategyNextSteps.uniqueDeliverable}</p>
            ` : ''}

            ${strategyNextSteps.immediateActions && strategyNextSteps.immediateActions.length > 0 ? `
            <h3>Immediate Next Steps</h3>
            <ul class="bullet-list">
                ${strategyNextSteps.immediateActions.map(a => `<li><strong>${a.actionType}:</strong> ${a.actionDescription}${a.targetDate ? ` (${a.targetDate})` : ''}</li>`).join('')}
            </ul>
            ` : ''}
        </div>

        <!-- FOOTER -->
        <div class="footer">
            Generated by Revenue Intelligence Platform | ${new Date().toLocaleDateString()}
            ${options.includeMetadata ? '<br>Powered by Business Case Builder' : ''}
        </div>
    </div>
</body>
</html>
  `.trim();
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Main export function - handles all formats
 */
export async function exportBusinessCase(
  businessCase: BusinessCaseData,
  options: ExportOptions
): Promise<ExportResult> {
  switch (options.format) {
    case 'pdf':
      return exportToPDF(businessCase, options);
    case 'docx':
      return exportToDOCX(businessCase, options);
    case 'html':
      return exportToHTML(businessCase, options);
    default:
      return {
        success: false,
        error: `Unsupported format: ${options.format}`,
        filename: ''
      };
  }
}

/**
 * Download exported business case
 */
export function downloadExport(result: ExportResult): void {
  if (!result.success || !result.blob) {
    console.error('Cannot download - export failed:', result.error);
    return;
  }

  const url = window.URL.createObjectURL(result.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default {
  exportBusinessCase,
  exportToPDF,
  exportToDOCX,
  exportToHTML,
  downloadExport
};
