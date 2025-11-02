/**
 * PDF Export Utility
 *
 * Generates professional PDF reports for ICP analysis data.
 * Supports free tier watermarking and comprehensive persona formatting.
 *
 * Uses jsPDF for PDF generation (already installed in package.json)
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Flexible persona type that handles multiple schema versions
export interface PersonaForPDF {
  id: string;
  name: string;
  title: string;
  role?: string;  // Optional for backward compatibility
  company?: string;  // From cache schema

  // Demographics - supports both old and new schemas
  demographics?: {
    ageRange?: string;
    age?: string;  // Alternative field name
    experience?: string;
    education?: string;
    location?: string;
    industry?: string;
    companySize?: string;
  };

  // Psychographics - supports both schemas
  psychographics?: {
    values?: string;
    motivations?: string | string[];  // Can be string or array
    fears?: string;
    goals?: string[];
    challenges?: string[];
    painPoints?: string[];
  };

  // Top-level fields (from widget schema)
  goals?: string[];
  painPoints?: string[];

  // Buying behavior - supports both schemas
  buyingBehavior?: {
    decisionProcess?: string;
  };
  behavior?: {  // Alternative schema name
    preferredChannels?: string[];
    decisionMakingProcess?: string;
    buyingTriggers?: string[];
    objections?: string[];
  };

  // Decision influence
  decisionInfluence?: {
    timeline?: string;
    budgetAuthority?: string;
  };

  // Communication preferences
  communicationPreferences?: {
    preferredChannels?: string[];
    communicationStyle?: string;
  };
  contactStrategy?: {  // Alternative schema name
    bestApproach?: string;
    messaging?: string[];
    timing?: string;
    followUp?: string;
  };

  // Objections - can be top-level or nested
  objections?: string[];

  // Information sources
  informationSources?: string[];

  // Metadata
  confidence?: number;
  generatedAt?: string;
}

export interface ICPExportData {
  companyName?: string;
  productName?: string;
  personas: PersonaForPDF[];
  generatedAt?: string;
}

export interface PDFExportOptions {
  includeFreeWatermark?: boolean;
  companyName?: string;
  productName?: string;
}

/**
 * Generate a professional PDF from ICP data
 */
export function generateICPPDF(
  data: ICPExportData,
  options: PDFExportOptions = {}
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Color scheme
  const primaryColor = '#3B82F6'; // Blue
  const secondaryColor = '#6B7280'; // Gray
  const accentColor = '#10B981'; // Green

  // Helper function to add page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // HEADER
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Ideal Customer Profile', margin, yPosition);
  yPosition += 12;

  // Subheader
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor);
  doc.setFont('helvetica', 'normal');
  const companyText = options.companyName || data.companyName || 'Your Company';
  const productText = options.productName || data.productName || 'Your Product';
  doc.text(`${companyText} - ${productText}`, margin, yPosition);
  yPosition += 6;

  // Generation date
  doc.setFontSize(10);
  const generatedDate = data.generatedAt
    ? new Date(data.generatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  doc.text(`Generated on ${generatedDate}`, margin, yPosition);
  yPosition += 15;

  // FREE TIER WATERMARK (if applicable)
  if (options.includeFreeWatermark) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated with Andru - Free Tier', pageWidth / 2, yPosition, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
  }

  // PERSONAS SECTION
  if (!data.personas || data.personas.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text('No buyer personas available.', margin, yPosition);
    return doc;
  }

  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Buyer Personas (${data.personas.length})`, margin, yPosition);
  yPosition += 10;

  // Iterate through each persona
  data.personas.forEach((persona, index) => {
    checkPageBreak(40);

    // Persona header
    doc.setFillColor(primaryColor);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${persona.name}`, margin + 3, yPosition + 7);
    yPosition += 12;

    // Title & Role/Company
    doc.setFontSize(11);
    doc.setTextColor(secondaryColor);
    doc.setFont('helvetica', 'italic');
    const subtitle = persona.role
      ? `${persona.title} • ${persona.role}`
      : persona.company
      ? `${persona.title} • ${persona.company}`
      : persona.title;
    doc.text(subtitle, margin, yPosition);
    yPosition += 8;

    // Demographics
    if (persona.demographics) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setTextColor(primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Demographics', margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      const demographics = [
        (persona.demographics.ageRange || persona.demographics.age) &&
          `Age: ${persona.demographics.ageRange || persona.demographics.age}`,
        persona.demographics.experience && `Experience: ${persona.demographics.experience}`,
        persona.demographics.education && `Education: ${persona.demographics.education}`,
        persona.demographics.location && `Location: ${persona.demographics.location}`,
        persona.demographics.industry && `Industry: ${persona.demographics.industry}`,
        persona.demographics.companySize && `Company Size: ${persona.demographics.companySize}`
      ].filter(Boolean);

      demographics.forEach(demo => {
        checkPageBreak(5);
        doc.text(`• ${demo}`, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    }

    // Goals - check both top-level and psychographics
    const goals = persona.goals || persona.psychographics?.goals || [];
    if (goals.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setTextColor(accentColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Goals', margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      goals.slice(0, 5).forEach(goal => {
        checkPageBreak(5);
        const wrappedGoal = doc.splitTextToSize(`• ${goal}`, pageWidth - 2 * margin - 10);
        doc.text(wrappedGoal, margin + 5, yPosition);
        yPosition += wrappedGoal.length * 5;
      });
      yPosition += 3;
    }

    // Pain Points - check both top-level and psychographics
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];
    if (painPoints.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setTextColor('#EF4444'); // Red
      doc.setFont('helvetica', 'bold');
      doc.text('Pain Points', margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      painPoints.slice(0, 5).forEach(pain => {
        checkPageBreak(5);
        const wrappedPain = doc.splitTextToSize(`• ${pain}`, pageWidth - 2 * margin - 10);
        doc.text(wrappedPain, margin + 5, yPosition);
        yPosition += wrappedPain.length * 5;
      });
      yPosition += 3;
    }

    // Communication Preferences - check both schemas
    let channels: string[] = [];
    if (persona.communicationPreferences?.preferredChannels) {
      channels = persona.communicationPreferences.preferredChannels;
    } else if (persona.behavior?.preferredChannels) {
      channels = persona.behavior.preferredChannels;
    }

    let commStyle: string | undefined;
    if (persona.communicationPreferences?.communicationStyle) {
      commStyle = persona.communicationPreferences.communicationStyle;
    } else if (persona.contactStrategy?.bestApproach) {
      commStyle = persona.contactStrategy.bestApproach;
    }

    if (channels.length > 0 || commStyle) {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.setTextColor(primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text('Communication Preferences', margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      if (channels.length > 0) {
        checkPageBreak(5);
        doc.text(`Channels: ${channels.join(', ')}`, margin + 5, yPosition);
        yPosition += 5;
      }

      if (commStyle) {
        checkPageBreak(5);
        const wrappedStyle = doc.splitTextToSize(`Style: ${commStyle}`, pageWidth - 2 * margin - 10);
        doc.text(wrappedStyle, margin + 5, yPosition);
        yPosition += wrappedStyle.length * 5;
      }
      yPosition += 3;
    }

    // Objections - check both top-level and behavior
    const objections = persona.objections || persona.behavior?.objections || [];
    if (objections.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(11);
      doc.setTextColor('#F59E0B'); // Orange
      doc.setFont('helvetica', 'bold');
      doc.text('Common Objections', margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      objections.slice(0, 3).forEach(objection => {
        checkPageBreak(5);
        const wrappedObjection = doc.splitTextToSize(`• ${objection}`, pageWidth - 2 * margin - 10);
        doc.text(wrappedObjection, margin + 5, yPosition);
        yPosition += wrappedObjection.length * 5;
      });
      yPosition += 3;
    }

    // Add spacing between personas
    yPosition += 10;
  });

  // FOOTER on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');

    // Page number
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Powered by Andru
    doc.text(
      'Powered by Andru',
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  return doc;
}

/**
 * Download PDF file to user's device
 */
export function downloadPDF(doc: jsPDF, filename: string = 'ICP-Analysis.pdf'): void {
  doc.save(filename);
}

/**
 * All-in-one function: Generate and download PDF with error handling
 */
export function exportICPToPDF(
  data: ICPExportData,
  options: PDFExportOptions = {},
  filename?: string
): {success: boolean; error?: string} {
  try {
    // Validation
    if (!data || !data.personas || data.personas.length === 0) {
      return {
        success: false,
        error: 'No persona data available to export'
      };
    }

    // Generate PDF
    const pdf = generateICPPDF(data, options);

    // Generate filename
    const finalFilename = filename || `ICP-${data.companyName || 'Analysis'}-${new Date().getTime()}.pdf`;

    // Download
    downloadPDF(pdf, finalFilename);

    return {success: true};
  } catch (error) {
    console.error('PDF export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF'
    };
  }
}
