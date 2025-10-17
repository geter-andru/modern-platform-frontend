/**
 * PDFGenerator.ts
 *
 * Professional PDF generation service using jsPDF
 * Supports multiple export types: ICP analysis, assessments, business cases, cost calculators
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

interface PDFOptions {
  title?: string;
  subtitle?: string;
  author?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeTOC?: boolean;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  customStyling?: Record<string, any>;
}

interface PDFSection {
  title: string;
  content: string | string[];
  type?: 'text' | 'table' | 'chart' | 'list';
  data?: any;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private primaryColor: [number, number, number];
  private secondaryColor: [number, number, number];

  constructor(options: PDFOptions = {}) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;

    // Brand colors (H&S Platform purple and blue)
    this.primaryColor = options.branding?.primaryColor
      ? this.hexToRGB(options.branding.primaryColor)
      : [139, 92, 246]; // #8B5CF6 purple

    this.secondaryColor = options.branding?.secondaryColor
      ? this.hexToRGB(options.branding.secondaryColor)
      : [59, 130, 246]; // #3B82F6 blue
  }

  /**
   * Generate PDF for ICP Analysis
   */
  static async generateICPAnalysis(data: any, options: PDFOptions = {}): Promise<Blob> {
    const generator = new PDFGenerator(options);

    // Add cover page
    generator.addCoverPage(
      options.title || 'Ideal Customer Profile Analysis',
      options.subtitle || 'Revenue Intelligence Platform'
    );

    // Add executive summary
    generator.addNewPage();
    generator.addHeading('Executive Summary', 1);
    generator.addParagraph(data.executiveSummary || 'This document provides a comprehensive analysis of your Ideal Customer Profile (ICP).');

    // Add ICP sections
    if (data.sections) {
      for (const section of data.sections) {
        generator.checkPageBreak(60);
        generator.addSection(section);
      }
    }

    // Add buyer personas
    if (data.buyerPersonas && data.buyerPersonas.length > 0) {
      generator.addNewPage();
      generator.addHeading('Buyer Personas', 1);

      for (const persona of data.buyerPersonas) {
        generator.checkPageBreak(80);
        generator.addBuyerPersona(persona);
      }
    }

    // Add company ratings
    if (data.companyRatings && data.companyRatings.length > 0) {
      generator.addNewPage();
      generator.addHeading('Company Ratings', 1);
      generator.addCompanyRatingsTable(data.companyRatings);
    }

    // Add footer to all pages
    generator.addFooterToAllPages();

    return generator.getBlob();
  }

  /**
   * Generate PDF for Assessment Results
   */
  static async generateAssessment(data: any, options: PDFOptions = {}): Promise<Blob> {
    const generator = new PDFGenerator(options);

    // Add cover page
    generator.addCoverPage(
      options.title || 'Assessment Results',
      options.subtitle || 'Revenue Intelligence Platform'
    );

    // Add assessment overview
    generator.addNewPage();
    generator.addHeading('Assessment Overview', 1);
    generator.addParagraph(data.overview || 'This assessment provides insights into your revenue intelligence capabilities.');

    // Add scores
    if (data.scores) {
      generator.checkPageBreak(80);
      generator.addHeading('Competency Scores', 2);
      generator.addScoresTable(data.scores);
    }

    // Add recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      generator.checkPageBreak(60);
      generator.addHeading('Recommendations', 2);
      for (const rec of data.recommendations) {
        generator.addBulletPoint(rec);
      }
    }

    generator.addFooterToAllPages();
    return generator.getBlob();
  }

  /**
   * Generate PDF for Business Case
   */
  static async generateBusinessCase(data: any, options: PDFOptions = {}): Promise<Blob> {
    const generator = new PDFGenerator(options);

    // Add cover page
    generator.addCoverPage(
      options.title || 'Business Case',
      options.subtitle || data.companyName || 'Revenue Intelligence Platform'
    );

    // Add executive summary
    generator.addNewPage();
    generator.addHeading('Executive Summary', 1);
    generator.addParagraph(data.executiveSummary || 'This business case outlines the value proposition and ROI for your investment.');

    // Add problem statement
    if (data.problemStatement) {
      generator.checkPageBreak(50);
      generator.addHeading('Problem Statement', 2);
      generator.addParagraph(data.problemStatement);
    }

    // Add solution
    if (data.solution) {
      generator.checkPageBreak(50);
      generator.addHeading('Proposed Solution', 2);
      generator.addParagraph(data.solution);
    }

    // Add financial analysis
    if (data.financialAnalysis) {
      generator.checkPageBreak(80);
      generator.addHeading('Financial Analysis', 2);
      generator.addFinancialAnalysisTable(data.financialAnalysis);
    }

    // Add ROI projections
    if (data.roiProjections) {
      generator.checkPageBreak(60);
      generator.addHeading('ROI Projections', 2);
      generator.addParagraph(data.roiProjections);
    }

    generator.addFooterToAllPages();
    return generator.getBlob();
  }

  /**
   * Generate PDF for Cost Calculator
   */
  static async generateCostCalculator(data: any, options: PDFOptions = {}): Promise<Blob> {
    const generator = new PDFGenerator(options);

    generator.addCoverPage(
      options.title || 'Cost of Inaction Analysis',
      options.subtitle || 'Financial Impact Assessment'
    );

    generator.addNewPage();
    generator.addHeading('Cost Analysis Summary', 1);

    if (data.totalCost) {
      generator.addKeyMetric('Total Cost of Inaction', `$${data.totalCost.toLocaleString()}`);
    }

    if (data.breakdown) {
      generator.checkPageBreak(80);
      generator.addHeading('Cost Breakdown', 2);
      generator.addCostBreakdownTable(data.breakdown);
    }

    if (data.recommendations) {
      generator.checkPageBreak(60);
      generator.addHeading('Recommendations', 2);
      generator.addParagraph(data.recommendations);
    }

    generator.addFooterToAllPages();
    return generator.getBlob();
  }

  /**
   * Generate generic PDF from sections
   */
  static async generateFromSections(sections: PDFSection[], options: PDFOptions = {}): Promise<Blob> {
    const generator = new PDFGenerator(options);

    if (options.title) {
      generator.addCoverPage(options.title, options.subtitle);
      generator.addNewPage();
    }

    for (const section of sections) {
      generator.checkPageBreak(60);
      generator.addSection(section);
    }

    generator.addFooterToAllPages();
    return generator.getBlob();
  }

  // ==========================================
  // PRIVATE METHODS - Page Layout
  // ==========================================

  private addCoverPage(title: string, subtitle?: string): void {
    // Add gradient background (simulated with rectangles)
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight / 3, 'F');

    this.doc.setFillColor(...this.secondaryColor);
    this.doc.rect(0, this.pageHeight / 3, this.pageWidth, this.pageHeight / 3, 'F');

    // Add title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');

    const titleLines = this.doc.splitTextToSize(title, this.pageWidth - 2 * this.margin);
    this.doc.text(titleLines, this.pageWidth / 2, this.pageHeight / 2 - 20, { align: 'center' });

    // Add subtitle
    if (subtitle) {
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.pageWidth / 2, this.pageHeight / 2 + 10, { align: 'center' });
    }

    // Add date
    this.doc.setFontSize(12);
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.doc.text(dateStr, this.pageWidth / 2, this.pageHeight - 30, { align: 'center' });

    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  private addNewPage(): void {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.addNewPage();
    }
  }

  private addFooterToAllPages(): void {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);

      // Add line
      this.doc.setDrawColor(...this.primaryColor);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);

      // Add page number
      this.doc.setFontSize(10);
      this.doc.setTextColor(128, 128, 128);
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );

      // Add branding
      this.doc.text(
        'Generated by Revenue Intelligence Platform',
        this.margin,
        this.pageHeight - 10
      );
    }

    // Reset to last page
    this.doc.setPage(pageCount);
    this.doc.setTextColor(0, 0, 0);
  }

  // ==========================================
  // PRIVATE METHODS - Content
  // ==========================================

  private addHeading(text: string, level: 1 | 2 | 3 = 1): void {
    const fontSize = level === 1 ? 20 : level === 2 ? 16 : 14;
    const spaceBefore = level === 1 ? 10 : level === 2 ? 8 : 6;
    const spaceAfter = level === 1 ? 6 : level === 2 ? 4 : 3;

    this.currentY += spaceBefore;
    this.checkPageBreak(fontSize + spaceAfter);

    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...this.primaryColor);
    this.doc.text(text, this.margin, this.currentY);

    // Add underline
    if (level === 1) {
      this.doc.setDrawColor(...this.primaryColor);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, this.currentY + 2, this.margin + 60, this.currentY + 2);
    }

    this.currentY += spaceAfter;
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
  }

  private addParagraph(text: string): void {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    const lineHeight = 6;

    for (const line of lines) {
      this.checkPageBreak(lineHeight);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += lineHeight;
    }

    this.currentY += 4; // Spacing after paragraph
  }

  private addBulletPoint(text: string): void {
    this.doc.setFontSize(11);
    const bullet = '•';
    const indent = 5;

    this.checkPageBreak(6);
    this.doc.text(bullet, this.margin, this.currentY);

    const lines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin - indent);
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) this.checkPageBreak(6);
      this.doc.text(lines[i], this.margin + indent, this.currentY);
      this.currentY += 6;
    }
  }

  private addKeyMetric(label: string, value: string): void {
    this.checkPageBreak(25);

    // Draw box
    this.doc.setFillColor(245, 247, 250);
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 20, 3, 3, 'F');

    // Add label
    this.doc.setFontSize(10);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(label, this.margin + 5, this.currentY + 7);

    // Add value
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...this.primaryColor);
    this.doc.text(value, this.margin + 5, this.currentY + 16);

    this.currentY += 25;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
  }

  private addSection(section: PDFSection): void {
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
  }

  private addTable(data: TableData): void {
    this.checkPageBreak(40);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [data.headers],
      body: data.rows,
      theme: 'grid',
      headStyles: {
        fillColor: this.primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      margin: { left: this.margin, right: this.margin }
    });

    // Update currentY after table
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addBuyerPersona(persona: any): void {
    this.addHeading(persona.title || persona.role || 'Buyer Persona', 3);

    if (persona.description) {
      this.addParagraph(persona.description);
    }

    const personaData: string[][] = [];
    if (persona.role) personaData.push(['Role', persona.role]);
    if (persona.goals) personaData.push(['Goals', Array.isArray(persona.goals) ? persona.goals.join(', ') : persona.goals]);
    if (persona.painPoints) personaData.push(['Pain Points', Array.isArray(persona.painPoints) ? persona.painPoints.join(', ') : persona.painPoints]);
    if (persona.buyingCriteria) personaData.push(['Buying Criteria', Array.isArray(persona.buyingCriteria) ? persona.buyingCriteria.join(', ') : persona.buyingCriteria]);

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
  // UTILITY METHODS
  // ==========================================

  private hexToRGB(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  }

  private getBlob(): Blob {
    return this.doc.output('blob');
  }

  /**
   * Get PDF as base64 string
   */
  getBase64(): string {
    return this.doc.output('dataurlstring');
  }

  /**
   * Save PDF to file (client-side download)
   */
  save(filename: string = 'export.pdf'): void {
    this.doc.save(filename);
  }
}

export default PDFGenerator;
