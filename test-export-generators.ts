/**
 * Test Export Generators
 *
 * Simple test script to verify PDF and DOCX generation with sample data.
 * Run with: npx tsx test-export-generators.ts
 */

import PDFGenerator from './app/lib/services/export/generators/PDFGenerator';
import DOCXGenerator from './app/lib/services/export/generators/DOCXGenerator';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample ICP data
const sampleICPData = {
  companyName: 'Test Company Inc.',
  industry: 'Enterprise Software',
  targetMarket: 'Mid-market B2B SaaS',
  idealCustomerProfile: {
    companySize: '100-500 employees',
    revenue: '$10M-$50M ARR',
    industry: ['Technology', 'Financial Services', 'Healthcare'],
    geography: ['North America', 'Western Europe']
  },
  buyerPersonas: [
    {
      title: 'VP of Sales',
      role: 'Economic Buyer',
      responsibilities: 'Revenue growth, team performance',
      painPoints: ['Inefficient sales processes', 'Lack of visibility into pipeline'],
      goals: ['Increase win rates by 20%', 'Reduce sales cycle time']
    },
    {
      title: 'Sales Operations Manager',
      role: 'Technical Buyer',
      responsibilities: 'Sales tools, data analytics, reporting',
      painPoints: ['Manual reporting', 'Disconnected tools', 'Poor data quality'],
      goals: ['Automate reporting', 'Improve forecast accuracy']
    }
  ],
  valueProposition: {
    primary: 'Drive predictable revenue growth through AI-powered sales intelligence',
    differentiation: ['Real-time buyer insights', 'Automated action recommendations', 'Native CRM integration'],
    roi: {
      timeToValue: '30 days',
      expectedROI: '250%',
      paybackPeriod: '6 months'
    }
  }
};

// Sample assessment data
const sampleAssessmentData = {
  assessmentType: 'Sales Readiness Assessment',
  companyName: 'Test Company Inc.',
  completedDate: new Date().toISOString(),
  overallScore: 72,
  categories: [
    {
      name: 'Process Maturity',
      score: 75,
      maxScore: 100,
      findings: [
        'Strong lead qualification process',
        'Opportunity management needs improvement',
        'Forecasting lacks consistency'
      ],
      recommendations: [
        'Implement standardized opportunity stages',
        'Adopt weekly forecast review cadence',
        'Create deal review playbook'
      ]
    },
    {
      name: 'Technology Enablement',
      score: 68,
      maxScore: 100,
      findings: [
        'CRM adoption is high (85%)',
        'Limited sales intelligence tools',
        'Manual data entry slows reps down'
      ],
      recommendations: [
        'Integrate sales intelligence platform',
        'Automate data capture from emails/calls',
        'Deploy mobile-first tools for field reps'
      ]
    }
  ]
};

// Sample business case data
const sampleBusinessCaseData = {
  title: 'Revenue Intelligence Platform Implementation',
  executiveSummary: 'This business case outlines the strategic rationale and financial justification for implementing a Revenue Intelligence Platform to drive predictable revenue growth.',
  problem: {
    description: 'Current sales operations face inefficiencies, limited visibility, and inconsistent execution',
    impact: '$2.5M in lost revenue annually due to:',
    metrics: [
      'Long sales cycles (avg 6 months)',
      'Low win rates (18% vs industry avg 25%)',
      'High customer churn (22% annually)'
    ]
  },
  solution: {
    description: 'Implement AI-powered Revenue Intelligence Platform',
    benefits: [
      'Real-time deal insights and coaching',
      'Automated pipeline management',
      'Predictive analytics for forecasting',
      'Customer health monitoring'
    ]
  },
  financials: {
    investment: {
      year1: 150000,
      year2: 180000,
      year3: 200000,
      total: 530000
    },
    returns: {
      year1: 300000,
      year2: 750000,
      year3: 1200000,
      total: 2250000
    },
    roi: '325%',
    paybackPeriod: '8 months',
    npv: '$1,720,000'
  },
  implementation: {
    timeline: '90 days',
    phases: [
      { name: 'Planning & Setup', duration: '2 weeks' },
      { name: 'Data Integration', duration: '3 weeks' },
      { name: 'User Training', duration: '2 weeks' },
      { name: 'Rollout & Adoption', duration: '5 weeks' }
    ]
  }
};

async function testPDFGeneration() {
  console.log('\n🧪 Testing PDF Generation...\n');

  try {
    // Test ICP Analysis PDF
    console.log('  📄 Generating ICP Analysis PDF...');
    const icpPDF = await PDFGenerator.generateICPAnalysis(sampleICPData, {
      title: 'ICP Analysis Report',
      subtitle: 'Test Company Inc.',
      author: 'Revenue Intelligence Platform'
    });
    const icpPath = path.join(__dirname, 'test-output-icp.pdf');
    fs.writeFileSync(icpPath, Buffer.from(await icpPDF.arrayBuffer()));
    console.log(`  ✅ ICP PDF generated: ${icpPath} (${(icpPDF.size / 1024).toFixed(2)} KB)`);

    // Test Assessment PDF
    console.log('\n  📄 Generating Assessment PDF...');
    const assessmentPDF = await PDFGenerator.generateAssessment(sampleAssessmentData, {
      title: 'Sales Readiness Assessment',
      subtitle: 'Comprehensive Analysis'
    });
    const assessmentPath = path.join(__dirname, 'test-output-assessment.pdf');
    fs.writeFileSync(assessmentPath, Buffer.from(await assessmentPDF.arrayBuffer()));
    console.log(`  ✅ Assessment PDF generated: ${assessmentPath} (${(assessmentPDF.size / 1024).toFixed(2)} KB)`);

    // Test Business Case PDF
    console.log('\n  📄 Generating Business Case PDF...');
    const businessCasePDF = await PDFGenerator.generateBusinessCase(sampleBusinessCaseData, {
      title: 'Business Case Document',
      subtitle: 'Revenue Intelligence Platform'
    });
    const businessCasePath = path.join(__dirname, 'test-output-business-case.pdf');
    fs.writeFileSync(businessCasePath, Buffer.from(await businessCasePDF.arrayBuffer()));
    console.log(`  ✅ Business Case PDF generated: ${businessCasePath} (${(businessCasePDF.size / 1024).toFixed(2)} KB)`);

    console.log('\n✅ All PDF tests passed!\n');
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

async function testDOCXGeneration() {
  console.log('\n🧪 Testing DOCX Generation...\n');

  try {
    // Test ICP Analysis DOCX
    console.log('  📄 Generating ICP Analysis DOCX...');
    const icpDOCX = await DOCXGenerator.generateICPAnalysis(sampleICPData, {
      title: 'ICP Analysis Report',
      subtitle: 'Test Company Inc.',
      author: 'Revenue Intelligence Platform'
    });
    const icpPath = path.join(__dirname, 'test-output-icp.docx');
    fs.writeFileSync(icpPath, Buffer.from(await icpDOCX.arrayBuffer()));
    console.log(`  ✅ ICP DOCX generated: ${icpPath} (${(icpDOCX.size / 1024).toFixed(2)} KB)`);

    // Test Assessment DOCX
    console.log('\n  📄 Generating Assessment DOCX...');
    const assessmentDOCX = await DOCXGenerator.generateAssessment(sampleAssessmentData, {
      title: 'Sales Readiness Assessment',
      subtitle: 'Comprehensive Analysis'
    });
    const assessmentPath = path.join(__dirname, 'test-output-assessment.docx');
    fs.writeFileSync(assessmentPath, Buffer.from(await assessmentDOCX.arrayBuffer()));
    console.log(`  ✅ Assessment DOCX generated: ${assessmentPath} (${(assessmentDOCX.size / 1024).toFixed(2)} KB)`);

    // Test Business Case DOCX
    console.log('\n  📄 Generating Business Case DOCX...');
    const businessCaseDOCX = await DOCXGenerator.generateBusinessCase(sampleBusinessCaseData, {
      title: 'Business Case Document',
      subtitle: 'Revenue Intelligence Platform'
    });
    const businessCasePath = path.join(__dirname, 'test-output-business-case.docx');
    fs.writeFileSync(businessCasePath, Buffer.from(await businessCaseDOCX.arrayBuffer()));
    console.log(`  ✅ Business Case DOCX generated: ${businessCasePath} (${(businessCaseDOCX.size / 1024).toFixed(2)} KB)`);

    console.log('\n✅ All DOCX tests passed!\n');
  } catch (error) {
    console.error('❌ DOCX generation failed:', error);
    throw error;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  Export Generators Test Suite');
  console.log('='.repeat(60));

  try {
    await testPDFGeneration();
    await testDOCXGeneration();

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n  Generated test files:');
    console.log('    - test-output-icp.pdf');
    console.log('    - test-output-assessment.pdf');
    console.log('    - test-output-business-case.pdf');
    console.log('    - test-output-icp.docx');
    console.log('    - test-output-assessment.docx');
    console.log('    - test-output-business-case.docx');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();
