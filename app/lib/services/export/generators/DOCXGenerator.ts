/**
 * DOCXGenerator.ts
 *
 * Professional DOCX generation service using docx library
 * Supports multiple export types: ICP analysis, assessments, business cases, cost calculators
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
  PageBreak
} from 'docx';

interface DOCXOptions {
  title?: string;
  subtitle?: string;
  author?: string;
  subject?: string;
  description?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeTOC?: boolean;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

interface DOCXSection {
  title: string;
  content: string | string[];
  type?: 'text' | 'table' | 'list';
  data?: any;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

export class DOCXGenerator {
  private sections: any[] = [];
  private options: DOCXOptions;

  constructor(options: DOCXOptions = {}) {
    this.options = options;
  }

  /**
   * Generate DOCX for ICP Analysis
   */
  static async generateICPAnalysis(data: any, options: DOCXOptions = {}): Promise<Blob> {
    const generator = new DOCXGenerator(options);

    // Add title page
    generator.addTitlePage(
      options.title || 'Ideal Customer Profile Analysis',
      options.subtitle || 'Revenue Intelligence Platform'
    );

    // Add page break
    generator.addPageBreak();

    // Add executive summary
    generator.addHeading('Executive Summary', 1);
    generator.addParagraph(
      data.executiveSummary ||
        'This document provides a comprehensive analysis of your Ideal Customer Profile (ICP), including detailed buyer personas, company ratings, and market insights.'
    );
    generator.addSpacing();

    // Add ICP sections
    if (data.sections && Array.isArray(data.sections)) {
      for (const section of data.sections) {
        generator.addSection(section);
      }
    }

    // Add buyer personas
    if (data.buyerPersonas && data.buyerPersonas.length > 0) {
      generator.addPageBreak();
      generator.addHeading('Buyer Personas', 1);

      for (const persona of data.buyerPersonas) {
        generator.addBuyerPersona(persona);
      }
    }

    // Add company ratings
    if (data.companyRatings && data.companyRatings.length > 0) {
      generator.addPageBreak();
      generator.addHeading('Company Ratings', 1);
      generator.addCompanyRatingsTable(data.companyRatings);
    }

    return generator.generate();
  }

  /**
   * Generate DOCX for Assessment Results
   */
  static async generateAssessment(data: any, options: DOCXOptions = {}): Promise<Blob> {
    const generator = new DOCXGenerator(options);

    generator.addTitlePage(
      options.title || 'Assessment Results',
      options.subtitle || 'Revenue Intelligence Platform'
    );

    generator.addPageBreak();

    // Add assessment overview
    generator.addHeading('Assessment Overview', 1);
    generator.addParagraph(
      data.overview ||
        'This assessment provides insights into your revenue intelligence capabilities and identifies areas for improvement.'
    );
    generator.addSpacing();

    // Add competency scores
    if (data.scores) {
      generator.addHeading('Competency Scores', 2);
      generator.addScoresTable(data.scores);
      generator.addSpacing();
    }

    // Add recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      generator.addHeading('Recommendations', 2);
      for (const rec of data.recommendations) {
        generator.addBulletPoint(rec);
      }
    }

    // Add action items
    if (data.actionItems && data.actionItems.length > 0) {
      generator.addSpacing();
      generator.addHeading('Action Items', 2);
      for (const item of data.actionItems) {
        generator.addBulletPoint(item);
      }
    }

    return generator.generate();
  }

  /**
   * Generate DOCX for Business Case
   */
  static async generateBusinessCase(data: any, options: DOCXOptions = {}): Promise<Blob> {
    const generator = new DOCXGenerator(options);

    generator.addTitlePage(
      options.title || 'Business Case',
      options.subtitle || data.companyName || 'Investment Proposal'
    );

    generator.addPageBreak();

    // Add executive summary
    generator.addHeading('Executive Summary', 1);
    generator.addParagraph(
      data.executiveSummary ||
        'This business case outlines the strategic value proposition, financial justification, and implementation roadmap for the proposed investment.'
    );
    generator.addSpacing();

    // Add problem statement
    if (data.problemStatement) {
      generator.addHeading('Problem Statement', 2);
      generator.addParagraph(data.problemStatement);
      generator.addSpacing();
    }

    // Add proposed solution
    if (data.solution) {
      generator.addHeading('Proposed Solution', 2);
      generator.addParagraph(data.solution);
      generator.addSpacing();
    }

    // Add benefits
    if (data.benefits && data.benefits.length > 0) {
      generator.addHeading('Key Benefits', 2);
      for (const benefit of data.benefits) {
        generator.addBulletPoint(benefit);
      }
      generator.addSpacing();
    }

    // Add financial analysis
    if (data.financialAnalysis) {
      generator.addHeading('Financial Analysis', 2);
      generator.addFinancialAnalysisTable(data.financialAnalysis);
      generator.addSpacing();
    }

    // Add ROI projections
    if (data.roiProjections) {
      generator.addHeading('ROI Projections', 2);
      generator.addParagraph(data.roiProjections);
      generator.addSpacing();
    }

    // Add implementation plan
    if (data.implementationPlan) {
      generator.addHeading('Implementation Plan', 2);
      generator.addParagraph(data.implementationPlan);
      generator.addSpacing();
    }

    // Add risks and mitigation
    if (data.risks && data.risks.length > 0) {
      generator.addHeading('Risks and Mitigation', 2);
      for (const risk of data.risks) {
        generator.addBulletPoint(risk);
      }
    }

    return generator.generate();
  }

  /**
   * Generate DOCX for Cost Calculator
   */
  static async generateCostCalculator(data: any, options: DOCXOptions = {}): Promise<Blob> {
    const generator = new DOCXGenerator(options);

    generator.addTitlePage(
      options.title || 'Cost of Inaction Analysis',
      options.subtitle || 'Financial Impact Assessment'
    );

    generator.addPageBreak();

    // Add summary
    generator.addHeading('Cost Analysis Summary', 1);
    generator.addParagraph(
      'This analysis quantifies the financial impact of maintaining the status quo versus taking action.'
    );
    generator.addSpacing();

    // Add total cost
    if (data.totalCost) {
      generator.addKeyMetric('Total Cost of Inaction (Annual)', `$${data.totalCost.toLocaleString()}`);
      generator.addSpacing();
    }

    // Add cost breakdown
    if (data.breakdown && data.breakdown.length > 0) {
      generator.addHeading('Cost Breakdown', 2);
      generator.addCostBreakdownTable(data.breakdown);
      generator.addSpacing();
    }

    // Add recommendations
    if (data.recommendations) {
      generator.addHeading('Recommendations', 2);
      generator.addParagraph(data.recommendations);
    }

    return generator.generate();
  }

  /**
   * Generate generic DOCX from sections
   */
  static async generateFromSections(sections: DOCXSection[], options: DOCXOptions = {}): Promise<Blob> {
    const generator = new DOCXGenerator(options);

    if (options.title) {
      generator.addTitlePage(options.title, options.subtitle);
      generator.addPageBreak();
    }

    for (const section of sections) {
      generator.addSection(section);
    }

    return generator.generate();
  }

  // ==========================================
  // PRIVATE METHODS - Content Building
  // ==========================================

  private addTitlePage(title: string, subtitle?: string): void {
    // Main title
    this.sections.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: {
          before: convertInchesToTwip(2),
          after: convertInchesToTwip(0.5)
        },
        run: {
          size: 48,
          bold: true,
          color: '8B5CF6' // Purple
        }
      })
    );

    // Subtitle
    if (subtitle) {
      this.sections.push(
        new Paragraph({
          text: subtitle,
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 0,
            after: convertInchesToTwip(1)
          },
          run: {
            size: 28,
            color: '3B82F6' // Blue
          }
        })
      );
    }

    // Date
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.sections.push(
      new Paragraph({
        text: dateStr,
        alignment: AlignmentType.CENTER,
        spacing: {
          before: convertInchesToTwip(3),
          after: 0
        },
        run: {
          size: 20,
          color: '6B7280' // Gray
        }
      })
    );

    // Footer branding
    this.sections.push(
      new Paragraph({
        text: 'Generated by Revenue Intelligence Platform',
        alignment: AlignmentType.CENTER,
        spacing: {
          before: convertInchesToTwip(0.5),
          after: 0
        },
        run: {
          size: 18,
          color: '9CA3AF', // Gray
          italics: true
        }
      })
    );
  }

  private addPageBreak(): void {
    this.sections.push(
      new Paragraph({
        children: [new PageBreak()]
      })
    );
  }

  private addHeading(text: string, level: 1 | 2 | 3 = 1): void {
    const headingLevel = level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
    const fontSize = level === 1 ? 32 : level === 2 ? 28 : 24;

    this.sections.push(
      new Paragraph({
        text: text,
        heading: headingLevel,
        spacing: {
          before: level === 1 ? 400 : 300,
          after: level === 1 ? 200 : 150
        },
        run: {
          size: fontSize,
          bold: true,
          color: '8B5CF6' // Purple
        }
      })
    );
  }

  private addParagraph(text: string): void {
    this.sections.push(
      new Paragraph({
        text: text,
        spacing: {
          before: 100,
          after: 100,
          line: 360
        },
        run: {
          size: 22
        }
      })
    );
  }

  private addBulletPoint(text: string): void {
    this.sections.push(
      new Paragraph({
        text: text,
        bullet: {
          level: 0
        },
        spacing: {
          before: 50,
          after: 50,
          line: 320
        },
        run: {
          size: 22
        }
      })
    );
  }

  private addKeyMetric(label: string, value: string): void {
    // Label paragraph
    this.sections.push(
      new Paragraph({
        text: label,
        spacing: {
          before: 200,
          after: 50
        },
        run: {
          size: 20,
          bold: true,
          color: '6B7280'
        }
      })
    );

    // Value paragraph
    this.sections.push(
      new Paragraph({
        text: value,
        spacing: {
          before: 0,
          after: 200
        },
        run: {
          size: 32,
          bold: true,
          color: '8B5CF6'
        }
      })
    );
  }

  private addSpacing(): void {
    this.sections.push(
      new Paragraph({
        text: '',
        spacing: {
          before: 200,
          after: 200
        }
      })
    );
  }

  private addSection(section: DOCXSection): void {
    this.addHeading(section.title, 2);

    if (typeof section.content === 'string') {
      this.addParagraph(section.content);
    } else if (Array.isArray(section.content)) {
      for (const item of section.content) {
        this.addBulletPoint(item);
      }
    }

    if (section.type === 'table' && section.data) {
      this.addTable(section.data);
    }

    this.addSpacing();
  }

  private addTable(data: TableData): void {
    const tableRows: TableRow[] = [];

    // Header row
    tableRows.push(
      new TableRow({
        children: data.headers.map(
          header =>
            new TableCell({
              children: [
                new Paragraph({
                  text: header,
                  run: {
                    bold: true,
                    size: 20,
                    color: 'FFFFFF'
                  }
                })
              ],
              shading: {
                fill: '8B5CF6',
                type: ShadingType.SOLID,
                color: '8B5CF6'
              }
            })
        ),
        tableHeader: true
      })
    );

    // Data rows
    for (const row of data.rows) {
      tableRows.push(
        new TableRow({
          children: row.map(
            cell =>
              new TableCell({
                children: [
                  new Paragraph({
                    text: cell,
                    run: {
                      size: 20
                    }
                  })
                ]
              })
          )
        })
      );
    }

    this.sections.push(
      new Table({
        rows: tableRows,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }
        }
      })
    );

    this.addSpacing();
  }

  private addBuyerPersona(persona: any): void {
    this.addHeading(persona.title || persona.role || 'Buyer Persona', 3);

    if (persona.description) {
      this.addParagraph(persona.description);
    }

    const personaData: string[][] = [];
    if (persona.role) personaData.push(['Role', persona.role]);
    if (persona.goals) {
      const goals = Array.isArray(persona.goals) ? persona.goals.join(', ') : persona.goals;
      personaData.push(['Goals', goals]);
    }
    if (persona.painPoints) {
      const painPoints = Array.isArray(persona.painPoints) ? persona.painPoints.join(', ') : persona.painPoints;
      personaData.push(['Pain Points', painPoints]);
    }
    if (persona.buyingCriteria) {
      const criteria = Array.isArray(persona.buyingCriteria) ? persona.buyingCriteria.join(', ') : persona.buyingCriteria;
      personaData.push(['Buying Criteria', criteria]);
    }

    if (personaData.length > 0) {
      this.addTable({
        headers: ['Attribute', 'Details'],
        rows: personaData
      });
    }
  }

  private addCompanyRatingsTable(ratings: any[]): void {
    const rows = ratings.map(r => [
      r.companyName || '',
      r.rating?.toString() || '',
      r.fitScore || '',
      r.notes || ''
    ]);

    this.addTable({
      headers: ['Company', 'Rating', 'Fit Score', 'Notes'],
      rows
    });
  }

  private addScoresTable(scores: any): void {
    const rows = Object.entries(scores).map(([key, value]) => [
      key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to Title Case
      value?.toString() || ''
    ]);

    this.addTable({
      headers: ['Category', 'Score'],
      rows
    });
  }

  private addFinancialAnalysisTable(analysis: any): void {
    const rows: string[][] = [];

    if (analysis.investment) rows.push(['Initial Investment', `$${analysis.investment.toLocaleString()}`]);
    if (analysis.annualCost) rows.push(['Annual Cost', `$${analysis.annualCost.toLocaleString()}`]);
    if (analysis.expectedReturn) rows.push(['Expected Annual Return', `$${analysis.expectedReturn.toLocaleString()}`]);
    if (analysis.roi) rows.push(['ROI', `${analysis.roi}%`]);
    if (analysis.paybackPeriod) rows.push(['Payback Period', `${analysis.paybackPeriod} months`]);

    this.addTable({
      headers: ['Metric', 'Value'],
      rows
    });
  }

  private addCostBreakdownTable(breakdown: any[]): void {
    const rows = breakdown.map(item => [
      item.category || '',
      item.description || '',
      `$${item.cost?.toLocaleString() || '0'}`
    ]);

    this.addTable({
      headers: ['Category', 'Description', 'Cost'],
      rows
    });
  }

  // ==========================================
  // GENERATION
  // ==========================================

  private async generate(): Promise<Blob> {
    const doc = new Document({
      creator: this.options.author || 'Revenue Intelligence Platform',
      title: this.options.title || 'Export Document',
      description: this.options.description || 'Generated document',
      sections: [
        {
          properties: {},
          children: this.sections
        }
      ]
    });

    return await Packer.toBlob(doc);
  }

  /**
   * Generate and download DOCX file (client-side)
   */
  static async saveToFile(data: any, filename: string, type: 'icp' | 'assessment' | 'businessCase' | 'cost' = 'icp'): Promise<void> {
    let blob: Blob;

    switch (type) {
      case 'icp':
        blob = await DOCXGenerator.generateICPAnalysis(data);
        break;
      case 'assessment':
        blob = await DOCXGenerator.generateAssessment(data);
        break;
      case 'businessCase':
        blob = await DOCXGenerator.generateBusinessCase(data);
        break;
      case 'cost':
        blob = await DOCXGenerator.generateCostCalculator(data);
        break;
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default DOCXGenerator;
