/**
 * Data Export Utilities - Markdown & CSV
 *
 * Generates Markdown and CSV exports for ICP analysis data.
 * Optimized for Notion (Markdown) and spreadsheet applications (CSV).
 */

import { PersonaForPDF } from './pdf-export';

export interface ICPExportData {
  companyName?: string;
  productName?: string;
  personas: PersonaForPDF[];
  generatedAt?: string;
}

export interface DataExportOptions {
  includeDemoWatermark?: boolean;
}

/**
 * Generate Markdown format optimized for Notion
 *
 * @param data - ICP export data with personas
 * @param options - Export options including demo watermark
 * @returns Markdown string ready for clipboard
 */
export function generateMarkdown(data: ICPExportData, options: DataExportOptions = {}): string {
  const { companyName = 'Your Company', productName = 'Your Product', personas, generatedAt } = data;

  let markdown = '';

  // DEMO WATERMARK - HTML comment at top (visible in raw markdown)
  if (options.includeDemoWatermark) {
    markdown += `<!-- ⚠️ DEMO VERSION - This is a sample export from Andru -->\n`;
    markdown += `<!-- Sign up at https://andru.com to remove watermarks and save your real analysis -->\n`;
    markdown += `<!-- Generated: ${new Date().toISOString()} -->\n\n`;
  }

  markdown += `# Ideal Customer Profile - ${companyName}\n\n`;
  markdown += `**Product:** ${productName}\n`;

  if (generatedAt) {
    const date = new Date(generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    markdown += `**Generated:** ${date}\n`;
  }

  // Add demo notice in visible text if demo watermark
  if (options.includeDemoWatermark) {
    markdown += `\n> **⚠️ DEMO VERSION** - Sign up at [andru.com](https://andru.com) to remove watermarks\n`;
  }

  markdown += `\n---\n\n`;

  // Add personas
  personas.forEach((persona, index) => {
    markdown += `## ${index + 1}. ${persona.name}\n\n`;
    markdown += `**Title:** ${persona.title}\n`;

    if (persona.role) {
      markdown += `**Role:** ${persona.role}\n`;
    }
    if (persona.company) {
      markdown += `**Company:** ${persona.company}\n`;
    }

    markdown += `\n`;

    // Demographics
    if (persona.demographics) {
      markdown += `### Demographics\n\n`;

      const demographics = [
        (persona.demographics.ageRange || persona.demographics.age) &&
          `- **Age:** ${persona.demographics.ageRange || persona.demographics.age}`,
        persona.demographics.experience && `- **Experience:** ${persona.demographics.experience}`,
        persona.demographics.education && `- **Education:** ${persona.demographics.education}`,
        persona.demographics.location && `- **Location:** ${persona.demographics.location}`,
        persona.demographics.industry && `- **Industry:** ${persona.demographics.industry}`,
        persona.demographics.companySize && `- **Company Size:** ${persona.demographics.companySize}`
      ].filter(Boolean);

      markdown += demographics.join('\n') + '\n\n';
    }

    // Goals
    const goals = persona.goals || persona.psychographics?.goals || [];
    if (goals.length > 0) {
      markdown += `### Goals\n\n`;
      goals.forEach(goal => {
        markdown += `- ${goal}\n`;
      });
      markdown += `\n`;
    }

    // Pain Points
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];
    if (painPoints.length > 0) {
      markdown += `### Pain Points\n\n`;
      painPoints.forEach(pain => {
        markdown += `- ${pain}\n`;
      });
      markdown += `\n`;
    }

    // Communication Preferences
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
      markdown += `### Communication Preferences\n\n`;
      if (channels.length > 0) {
        markdown += `- **Channels:** ${channels.join(', ')}\n`;
      }
      if (commStyle) {
        markdown += `- **Style:** ${commStyle}\n`;
      }
      markdown += `\n`;
    }

    // Objections
    const objections = persona.objections || persona.behavior?.objections || [];
    if (objections.length > 0) {
      markdown += `### Common Objections\n\n`;
      objections.forEach(objection => {
        markdown += `- ${objection}\n`;
      });
      markdown += `\n`;
    }

    // Separator between personas
    if (index < personas.length - 1) {
      markdown += `---\n\n`;
    }
  });

  // Footer
  markdown += `\n---\n\n`;
  markdown += `*Generated with [Andru](https://andru.ai) - Ideal Customer Profile Analysis Tool*\n`;

  return markdown;
}

/**
 * Generate CSV format for spreadsheet applications
 *
 * @param data - ICP export data with personas
 * @param options - Export options including demo watermark
 * @returns CSV string ready for download
 */
export function generateCSV(data: ICPExportData, options: DataExportOptions = {}): string {
  const { personas } = data;

  let csv = '';

  // DEMO WATERMARK - Header row with demo notice
  if (options.includeDemoWatermark) {
    csv += `"⚠️ DEMO VERSION - This is a sample export from Andru","Sign up at https://andru.com to remove watermarks"\n`;
    csv += `"Generated","${new Date().toISOString()}"\n`;
    csv += '\n'; // Empty row separator
  }

  // CSV Headers
  const headers = [
    'Persona Name',
    'Title',
    'Role',
    'Company',
    'Age Range',
    'Experience',
    'Education',
    'Location',
    'Industry',
    'Company Size',
    'Goals',
    'Pain Points',
    'Preferred Channels',
    'Communication Style',
    'Common Objections'
  ];

  csv += headers.join(',') + '\n';

  // Add each persona as a row
  personas.forEach(persona => {
    const row: string[] = [];

    // Basic info
    row.push(escapeCSV(persona.name));
    row.push(escapeCSV(persona.title));
    row.push(escapeCSV(persona.role || ''));
    row.push(escapeCSV(persona.company || ''));

    // Demographics
    row.push(escapeCSV((persona.demographics?.ageRange || persona.demographics?.age) || ''));
    row.push(escapeCSV(persona.demographics?.experience || ''));
    row.push(escapeCSV(persona.demographics?.education || ''));
    row.push(escapeCSV(persona.demographics?.location || ''));
    row.push(escapeCSV(persona.demographics?.industry || ''));
    row.push(escapeCSV(persona.demographics?.companySize || ''));

    // Goals
    const goals = persona.goals || persona.psychographics?.goals || [];
    row.push(escapeCSV(goals.join('; ')));

    // Pain Points
    const painPoints = persona.painPoints || persona.psychographics?.painPoints || [];
    row.push(escapeCSV(painPoints.join('; ')));

    // Communication Preferences
    let channels: string[] = [];
    if (persona.communicationPreferences?.preferredChannels) {
      channels = persona.communicationPreferences.preferredChannels;
    } else if (persona.behavior?.preferredChannels) {
      channels = persona.behavior.preferredChannels;
    }
    row.push(escapeCSV(channels.join('; ')));

    let commStyle: string = '';
    if (persona.communicationPreferences?.communicationStyle) {
      commStyle = persona.communicationPreferences.communicationStyle;
    } else if (persona.contactStrategy?.bestApproach) {
      commStyle = persona.contactStrategy.bestApproach;
    }
    row.push(escapeCSV(commStyle));

    // Objections
    const objections = persona.objections || persona.behavior?.objections || [];
    row.push(escapeCSV(objections.join('; ')));

    csv += row.join(',') + '\n';
  });

  return csv;
}

/**
 * Escape CSV values (handle quotes, commas, newlines)
 */
function escapeCSV(value: string): string {
  if (!value) return '""';

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return `"${value}"`;
}

/**
 * Copy text to clipboard
 *
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Download text as file
 *
 * @param text - File content
 * @param filename - Name of file to download
 * @param mimeType - MIME type of file
 */
export function downloadTextFile(
  text: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export ICP data as Markdown (copy to clipboard)
 *
 * @param data - ICP export data
 * @param options - Export options including demo watermark
 * @returns Success/error result
 */
export async function exportToMarkdown(
  data: ICPExportData,
  options: DataExportOptions = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || !data.personas || data.personas.length === 0) {
      return {
        success: false,
        error: 'No persona data available to export'
      };
    }

    const markdown = generateMarkdown(data, options);
    await copyToClipboard(markdown);

    return { success: true };
  } catch (error) {
    console.error('Markdown export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export Markdown'
    };
  }
}

/**
 * Export ICP data as CSV (download file)
 *
 * @param data - ICP export data
 * @param options - Export options including demo watermark
 * @param filename - Optional filename
 * @returns Success/error result
 */
export function exportToCSV(
  data: ICPExportData,
  options: DataExportOptions = {},
  filename?: string
): { success: boolean; error?: string } {
  try {
    if (!data || !data.personas || data.personas.length === 0) {
      return {
        success: false,
        error: 'No persona data available to export'
      };
    }

    const csv = generateCSV(data, options);
    const finalFilename = filename || `ICP-${data.companyName || 'Analysis'}-${new Date().getTime()}.csv`;

    downloadTextFile(csv, finalFilename, 'text/csv');

    return { success: true };
  } catch (error) {
    console.error('CSV export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export CSV'
    };
  }
}
