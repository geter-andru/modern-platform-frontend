#!/usr/bin/env node

/**
 * TARGET BUYER VALUE CHECK SCRIPT
 * Prevents building "cool but useless" features by validating alignment with target buyer pain points
 * Target: Series A Technical Founders ($2M ARR → $10M ARR scaling challenge)
 */

const fs = require('fs');
const readline = require('readline');

const TARGET_BUYER_PROFILE = {
  name: "Dr. Sarah Chen (and founders like her)",
  stage: "Series A Technical Founder",
  challenge: "$2M ARR → $10M ARR scaling",
  timeline: "2-4 weeks implementation (not 3-6 months)",
  preference: "Founder control vs. outsourcing/dependency"
};

const BUYER_PAIN_POINTS = {
  customerTargeting: {
    description: "Finding actual target customers (and who to avoid)",
    weight: 25,
    examples: [
      "Over-indexing on technical fit vs. business need",
      "Qualification framework gaps", 
      "Market scatter and lack of ICP focus"
    ]
  },
  valueTranslation: {
    description: "Translating product capabilities into business value",
    weight: 30,
    examples: [
      "Technical-business language barrier",
      "ROI quantification gaps",
      "Competitive differentiation blindness"
    ]
  },
  buyerLanguage: {
    description: "Speaking the buyer's language for problems and solutions", 
    weight: 25,
    examples: [
      "Technical jargon overload",
      "Stakeholder communication differences",
      "Industry language gaps"
    ]
  },
  outcomeDelivery: {
    description: "Delivering on customer desired outcomes",
    weight: 20,
    examples: [
      "Success metrics misalignment",
      "Implementation support gaps",
      "Value proof documentation"
    ]
  }
};

const AUTO_FAIL_PATTERNS = [
  // Technical coolness without business value
  { pattern: /AI.*optimization|machine.*learning.*enhancement|advanced.*analytics/i, reason: "Technical coolness without clear buyer value" },
  { pattern: /logo.*generator|design.*tool|creative.*assistant/i, reason: "Creative tools don't address revenue scaling" },
  { pattern: /deep.*integration|extensive.*configuration|advanced.*setup/i, reason: "Complex implementation violates 2-4 week requirement" },
  { pattern: /CRM.*enhancement|general.*productivity|workflow.*optimization/i, reason: "Generic business tools, not revenue scaling specific" },
  { pattern: /developer.*experience|engineering.*efficiency|technical.*documentation/i, reason: "Appeals to wrong persona (engineers vs. business stakeholders)" },
  { pattern: /dashboard|reporting|analytics.*visualization/i, reason: "Reporting tools don't directly help close deals" },
  { pattern: /automation.*workflow|process.*optimization|efficiency.*improvement/i, reason: "Internal efficiency vs. revenue acceleration" }
];

const FEATURE_FLAGS = {
  HIGH_BUYER_VALUE: {
    description: "Directly addresses core buyer pain points with systematic approach",
    priority: "P0 - Build First",
    criteria: "Addresses 3+ core pain points, systematic, fast implementation, clear revenue impact"
  },
  REVENUE_ACCELERATOR: {
    description: "Clear path to help scale $2M → $10M ARR",
    priority: "P0 - Build First", 
    criteria: "Direct connection to deal velocity, win rates, or sales process efficiency"
  },
  STAKEHOLDER_VALUE: {
    description: "Appeals to business stakeholders (CFO, COO, procurement)",
    priority: "P1 - High Priority",
    criteria: "Provides value beyond technical team, speaks business language"
  },
  SYSTEMATIC_FRAMEWORK: {
    description: "Provides systematic approach vs ad-hoc solution",
    priority: "P1 - High Priority",
    criteria: "Reusable processes, templates, or methodologies"
  },
  FOUNDER_CONTROL: {
    description: "Maintains founder autonomy vs creating dependencies",
    priority: "P2 - Medium Priority", 
    criteria: "Target buyer learns the system rather than outsourcing"
  },
  FAST_IMPLEMENTATION: {
    description: "Can be implemented in 2-4 weeks",
    priority: "P2 - Medium Priority",
    criteria: "Quick time-to-value vs months-long implementations"
  },
  // Warning flags
  TECHNICAL_COOLNESS: {
    description: "Impressive to engineers but unclear buyer value",
    priority: "P4 - Deprioritize",
    criteria: "Advanced tech features without clear business connection"
  },
  DEPENDENCY_RISK: {
    description: "Requires ongoing external support or creates vendor lock-in",
    priority: "P4 - Deprioritize", 
    criteria: "Complex integrations or external service dependencies"
  },
  NO_REVENUE_IMPACT: {
    description: "Unclear connection to ARR scaling",
    priority: "P4 - Deprioritize",
    criteria: "No obvious path to improved sales outcomes"
  },
  WRONG_PERSONA: {
    description: "Appeals to technical users, not business stakeholders", 
    priority: "P4 - Deprioritize",
    criteria: "Developer tools, technical optimizations, engineering efficiency"
  }
};

class BuyerValueChecker {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async checkAntiPatterns(featureName, featureDescription) {
    console.log('\n🔍 ANTI-PATTERN CHECK\n');
    
    const violations = AUTO_FAIL_PATTERNS.filter(({ pattern }) => 
      pattern.test(featureDescription) || pattern.test(featureName)
    );
    
    if (violations.length > 0) {
      console.log('⚠️  WARNING: Feature matches anti-patterns\n');
      violations.forEach(({ pattern, reason }) => {
        console.log(`   🏷️  ${reason}`);
      });
      console.log('\n🚨 This suggests technical coolness over buyer value');
      console.log('🎯 Will likely receive P4 (Deprioritize) classification');
      console.log('📝 Continuing with assessment to document the analysis...\n');
      return violations; // Return violations for flagging, don't block
    }
    
    console.log('✅ No anti-patterns detected - good buyer value potential\n');
    return [];
  }

  async askQuestion(question, options = null, required = true) {
    return new Promise((resolve) => {
      const prompt = options 
        ? `${question}\n   Options: ${options.join(', ')}\n   Answer: `
        : `${question}\n   Answer: `;
      
      this.rl.question(prompt, (answer) => {
        if (required && !answer.trim()) {
          console.log('❌ This question is required. Please provide an answer.');
          this.askQuestion(question, options, required).then(resolve);
        } else {
          resolve(answer.trim());
        }
      });
    });
  }

  async runValueAssessment(featureName, featureDescription, antiPatternViolations = []) {
    console.log(`\n🎯 TARGET BUYER VALUE CHECK: ${featureName}`);
    console.log(`📝 Description: ${featureDescription}\n`);
    console.log('━'.repeat(60));
    console.log(`🎯 Target Buyer: ${TARGET_BUYER_PROFILE.name}`);
    console.log(`📈 Challenge: ${TARGET_BUYER_PROFILE.challenge}`);
    console.log(`⏱️  Implementation: ${TARGET_BUYER_PROFILE.timeline}`);
    console.log(`🎮 Preference: ${TARGET_BUYER_PROFILE.preference}`);
    console.log('━'.repeat(60));

    const responses = {
      antiPatternViolations: antiPatternViolations
    };

    // Core pain point assessment
    console.log('\n1️⃣ CORE PAIN POINT ALIGNMENT');
    responses.painPoints = await this.askQuestion(
      'Which of Sarah\'s 4 core pain points does this feature directly solve?',
      Object.keys(BUYER_PAIN_POINTS).concat(['none']),
      true
    );

    // Don't auto-fail, continue assessment for documentation
    if (responses.painPoints === 'none') {
      console.log('\n⚠️  WARNING: Feature addresses no core buyer pain points');
      console.log('🏷️  This will likely result in P4 (Deprioritize) classification');
      console.log('📝 Continuing assessment for complete analysis...\n');
    }

    // Systematic approach check
    console.log('\n2️⃣ SYSTEMATIC APPROACH');
    responses.systematic = await this.askQuestion(
      'Does this provide a SYSTEMATIC approach (not ad-hoc solution)?',
      ['yes', 'no'],
      true
    );

    // Implementation speed
    console.log('\n3️⃣ IMPLEMENTATION SPEED');
    responses.implementationSpeed = await this.askQuestion(
      'Can Sarah implement this in 2-4 weeks (not 3-6 months)?',
      ['yes', 'no'],
      true
    );

    // Founder control
    console.log('\n4️⃣ FOUNDER CONTROL');
    responses.founderControl = await this.askQuestion(
      'Does this let Sarah maintain control vs. outsourcing/dependency?',
      ['yes', 'no'],
      true
    );

    // Revenue impact
    console.log('\n5️⃣ REVENUE IMPACT');
    responses.revenueImpact = await this.askQuestion(
      'How does this directly help scale from $2M → $10M ARR? (Be specific)',
      null,
      true
    );

    if (responses.revenueImpact.length < 50) {
      console.log('\n⚠️  WARNING: Revenue impact explanation is too brief');
      console.log('   Please provide more detail about the scaling connection');
      responses.revenueImpact = await this.askQuestion(
        'Expand on the revenue scaling impact (minimum 50 characters):',
        null,
        true
      );
    }

    // Stakeholder value
    console.log('\n6️⃣ BUSINESS STAKEHOLDER VALUE');
    responses.stakeholders = await this.askQuestion(
      'Which business stakeholders (not technical) benefit from this?',
      ['CFO', 'COO', 'Procurement', 'Board/Investors', 'Sales Team', 'Customer Success', 'None'],
      true
    );

    // Alternative check
    console.log('\n7️⃣ COMPETITIVE ALTERNATIVE');
    responses.alternative = await this.askQuestion(
      'Why wouldn\'t Sarah just hire a VP of Sales or consultant instead? (What makes this better)',
      null,
      true
    );

    return this.assessResponses(featureName, featureDescription, responses);
  }

  assessResponses(featureName, featureDescription, responses) {
    const assessment = {
      feature: featureName,
      description: featureDescription,
      responses: responses,
      flags: [],
      score: 0,
      priority: 'P4',
      recommendation: '',
      passed: false
    };

    let score = 0;
    const flags = [];

    // Add anti-pattern flags first
    if (responses.antiPatternViolations && responses.antiPatternViolations.length > 0) {
      flags.push('TECHNICAL_COOLNESS');
      // Penalty for anti-patterns but don't zero out score
      score -= 20;
    }

    // Pain point alignment (30 points)
    if (responses.painPoints && responses.painPoints !== 'none') {
      score += 30;
      if (['valueTranslation', 'buyerLanguage'].includes(responses.painPoints)) {
        score += 10; // Bonus for highest-weight pain points
        flags.push('HIGH_BUYER_VALUE');
      }
    } else {
      flags.push('NO_BUYER_VALUE');
    }

    // Revenue impact assessment (25 points)
    const revenueKeywords = ['deal', 'close', 'sales', 'revenue', 'ARR', 'pipeline', 'conversion', 'win rate'];
    const hasRevenueKeywords = revenueKeywords.some(keyword => 
      responses.revenueImpact.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasRevenueKeywords && responses.revenueImpact.length > 50) {
      score += 25;
      flags.push('REVENUE_ACCELERATOR');
    } else if (responses.revenueImpact.length > 30) {
      score += 10;
    } else {
      flags.push('NO_REVENUE_IMPACT');
    }

    // Systematic approach (15 points)
    if (responses.systematic?.toLowerCase() === 'yes') {
      score += 15;
      flags.push('SYSTEMATIC_FRAMEWORK');
    }

    // Implementation speed (10 points)
    if (responses.implementationSpeed?.toLowerCase() === 'yes') {
      score += 10;
      flags.push('FAST_IMPLEMENTATION');
    } else {
      flags.push('SLOW_IMPLEMENTATION');
    }

    // Founder control (10 points)
    if (responses.founderControl?.toLowerCase() === 'yes') {
      score += 10;
      flags.push('FOUNDER_CONTROL');
    } else {
      flags.push('DEPENDENCY_RISK');
    }

    // Stakeholder value (10 points)
    if (responses.stakeholders && responses.stakeholders !== 'None') {
      score += 10;
      flags.push('STAKEHOLDER_VALUE');
    } else {
      flags.push('WRONG_PERSONA');
    }

    assessment.score = score;
    assessment.flags = flags;
    assessment.priority = this.determinePriority(flags, score);
    assessment.passed = score >= 60 && !flags.includes('NO_REVENUE_IMPACT');
    assessment.recommendation = this.generateRecommendation(assessment);

    return assessment;
  }

  determinePriority(flags, score) {
    // P0: High buyer value + revenue accelerator
    if (flags.includes('HIGH_BUYER_VALUE') && flags.includes('REVENUE_ACCELERATOR')) {
      return 'P0 - Build First';
    }
    
    // P1: Strong alignment with buyer needs
    if (flags.includes('REVENUE_ACCELERATOR') || 
        (flags.includes('HIGH_BUYER_VALUE') && flags.includes('STAKEHOLDER_VALUE'))) {
      return 'P1 - High Priority';
    }
    
    // P2: Some buyer value but missing key elements
    if (score >= 60 && !flags.includes('NO_REVENUE_IMPACT') && !flags.includes('WRONG_PERSONA')) {
      return 'P2 - Medium Priority';
    }
    
    // P3: Questionable value
    if (score >= 40) {
      return 'P3 - Low Priority';
    }
    
    // P4: Clear misalignment
    return 'P4 - Deprioritize';
  }

  generateRecommendation(assessment) {
    const { score, flags, passed } = assessment;

    if (passed && flags.includes('HIGH_BUYER_VALUE') && flags.includes('REVENUE_ACCELERATOR')) {
      return 'BUILD IMMEDIATELY - Perfect alignment with target buyer needs and revenue scaling';
    }
    
    if (passed) {
      return 'BUILD - Good alignment with buyer value, proceed with development';
    }

    if (flags.includes('NO_REVENUE_IMPACT')) {
      return 'DO NOT BUILD - No clear connection to revenue scaling challenge';
    }

    if (flags.includes('WRONG_PERSONA')) {
      return 'DO NOT BUILD - Appeals to wrong audience (technical vs. business stakeholders)';
    }

    if (score < 40) {
      return 'DO NOT BUILD - Insufficient buyer value alignment';
    }

    return 'REVISE BEFORE BUILDING - Address key gaps in buyer value proposition';
  }

  generateFailedAssessment(featureName, featureDescription, reason) {
    return {
      feature: featureName,
      description: featureDescription,
      flags: ['NO_BUYER_VALUE'],
      score: 0,
      priority: 'P4 - Deprioritize',
      recommendation: `DO NOT BUILD - ${reason}`,
      passed: false,
      reason: reason
    };
  }

  displayResults(assessment) {
    console.log('\n' + '═'.repeat(80));
    console.log('📊 BUYER VALUE ASSESSMENT RESULTS');
    console.log('═'.repeat(80));
    
    console.log(`\n📋 Feature: ${assessment.feature}`);
    console.log(`📝 Description: ${assessment.description}`);
    console.log(`📊 Score: ${assessment.score}/100`);
    console.log(`🏷️  Priority: ${assessment.priority}`);
    console.log(`✅ Passed: ${assessment.passed ? 'YES' : 'NO'}`);
    
    console.log('\n🏷️  Feature Flags:');
    if (assessment.flags.length > 0) {
      assessment.flags.forEach(flag => {
        const flagInfo = FEATURE_FLAGS[flag];
        if (flagInfo) {
          console.log(`   • ${flag}: ${flagInfo.description}`);
        } else {
          console.log(`   • ${flag}`);
        }
      });
    } else {
      console.log('   • No flags assigned');
    }

    console.log(`\n💡 Recommendation: ${assessment.recommendation}`);

    if (!assessment.passed) {
      console.log('\n⚠️  KEY ISSUES:');
      if (assessment.flags.includes('NO_REVENUE_IMPACT')) {
        console.log('   • Feature doesn\'t clearly help scale $2M → $10M ARR');
      }
      if (assessment.flags.includes('WRONG_PERSONA')) {
        console.log('   • Appeals to technical users, not business stakeholders');
      }
      if (assessment.flags.includes('SLOW_IMPLEMENTATION')) {
        console.log('   • Takes too long to implement (violates 2-4 week requirement)');
      }
      if (assessment.flags.includes('DEPENDENCY_RISK')) {
        console.log('   • Creates dependencies vs. founder control');
      }
      
      console.log('\n🎯 Focus instead on:');
      console.log('   • Features that help Sarah close more enterprise deals');
      console.log('   • Tools that translate technical capabilities to business value'); 
      console.log('   • Systematic approaches to customer targeting and qualification');
      console.log('   • Frameworks that speak CFO/COO language');
    }

    console.log('\n' + '═'.repeat(80));
  }

  async run() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('Usage: npm run validate:buyer-value [feature-name] [feature-description]');
      console.log('Example: npm run validate:buyer-value "stakeholder-language-framework" "Converts technical capabilities into CFO/COO language with ROI calculations"');
      process.exit(1);
    }

    const featureName = args[0];
    const featureDescription = args.slice(1).join(' ');

    console.log('🎯 H&S REVENUE INTELLIGENCE PLATFORM');
    console.log('Target Buyer Value Check System');
    console.log('━'.repeat(60));

    // Check anti-patterns (flags, doesn't block)
    const antiPatternViolations = await this.checkAntiPatterns(featureName, featureDescription);

    // Run full assessment with anti-pattern info
    const assessment = await this.runValueAssessment(featureName, featureDescription, antiPatternViolations);
    this.displayResults(assessment);
    
    this.rl.close();
    
    // Always exit with success - system flags but doesn't block
    process.exit(0);
  }
}

// Run the buyer value checker
const checker = new BuyerValueChecker();
checker.run().catch(console.error);