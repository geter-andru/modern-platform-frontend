#!/usr/bin/env node

/**
 * REALITY CHECK PROMPT SYSTEM
 * Interactive script that forces developers to answer reality check questions
 * before allowing code to be written or committed
 */

const readline = require('readline');

class RealityCheckPrompt {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.answers = {};
    this.questions = [
      {
        key: 'functionality',
        question: '1. Is this real functionality or a demo?\n   REAL: Connects to actual external services\n   FAKE: Uses templates, mocks, or hardcoded data\n\n   Answer (REAL/FAKE): ',
        validate: (answer) => ['REAL', 'FAKE'].includes(answer.toUpperCase()),
        transform: (answer) => answer.toUpperCase()
      },
      {
        key: 'serverSide',
        question: '\n2. Does this require server-side implementation?\n   YES: Must create proper /app/api/ routes\n   NO: Can be implemented client-side\n\n   Answer (YES/NO): ',
        validate: (answer) => ['YES', 'NO'].includes(answer.toUpperCase()),
        transform: (answer) => answer.toUpperCase()
      },
      {
        key: 'externalServices',
        question: '\n3. What external services does this actually need?\n   List specific APIs, databases, services, Node.js packages\n   (Enter each on a new line, empty line to finish):\n\n   Services: ',
        multiline: true
      },
      {
        key: 'facadeOrReal',
        question: '\n4. Am I building a facade or real functionality?\n   FACADE: Professional-looking UI with fake backend\n   REAL: Working integration with actual data sources\n\n   Answer (FACADE/REAL): ',
        validate: (answer) => ['FACADE', 'REAL'].includes(answer.toUpperCase()),
        transform: (answer) => answer.toUpperCase()
      },
      {
        key: 'productionBreaks',
        question: '\n5. What would break if deployed to production?\n   List all fake/mock components, missing server infrastructure, unimplemented integrations\n   (Enter each on a new line, empty line to finish):\n\n   Issues: ',
        multiline: true
      }
    ];
  }

  async askQuestion(questionObj) {
    return new Promise((resolve) => {
      if (questionObj.multiline) {
        this.askMultilineQuestion(questionObj.question, resolve);
      } else {
        this.rl.question(questionObj.question, (answer) => {
          if (questionObj.validate && !questionObj.validate(answer)) {
            console.log('❌ Invalid answer. Please try again.');
            this.askQuestion(questionObj).then(resolve);
          } else {
            const finalAnswer = questionObj.transform ? questionObj.transform(answer) : answer;
            resolve(finalAnswer);
          }
        });
      }
    });
  }

  askMultilineQuestion(prompt, resolve) {
    console.log(prompt);
    const answers = [];
    
    const collectAnswer = () => {
      this.rl.question('   ', (line) => {
        if (line.trim() === '') {
          resolve(answers);
        } else {
          answers.push(line.trim());
          collectAnswer();
        }
      });
    };
    
    collectAnswer();
  }

  async runPrompt() {
    console.log('🚨 MANDATORY REALITY CHECK QUESTIONS 🚨\n');
    console.log('Before writing ANY code, you must honestly answer these questions:\n');

    for (const questionObj of this.questions) {
      const answer = await this.askQuestion(questionObj);
      this.answers[questionObj.key] = answer;
    }

    this.rl.close();
    return this.answers;
  }

  generateHonestyHeader(answers) {
    const externalServices = Array.isArray(answers.externalServices) 
      ? answers.externalServices 
      : [answers.externalServices || 'None specified'];

    const productionIssues = Array.isArray(answers.productionBreaks)
      ? answers.productionBreaks
      : [answers.productionBreaks || 'None specified'];

    // Determine functionality status
    let status = 'PARTIAL';
    if (answers.functionality === 'REAL' && answers.facadeOrReal === 'REAL') {
      status = 'REAL';
    } else if (answers.functionality === 'FAKE' || answers.facadeOrReal === 'FACADE') {
      status = 'FAKE';
    }

    // Determine production readiness
    const productionReady = (productionIssues.length === 1 && productionIssues[0] === 'None specified') 
      ? 'YES' : 'NO';

    return `/**
 * FUNCTIONALITY STATUS: ${status}
 * 
 * REALITY CHECK RESPONSES:
 * - Functionality Type: ${answers.functionality}
 * - Requires Server-Side: ${answers.serverSide}
 * - Implementation Type: ${answers.facadeOrReal}
 * 
 * EXTERNAL SERVICES NEEDED:
${externalServices.map(service => ` * - ${service}`).join('\n')}
 * 
 * PRODUCTION DEPLOYMENT ISSUES:
${productionIssues.map(issue => ` * - ${issue}`).join('\n')}
 * 
 * PRODUCTION READINESS: ${productionReady}
 * - Based on reality check assessment
 * - Review and update as implementation progresses
 */`;
  }

  displaySummary(answers) {
    console.log('\n📋 REALITY CHECK SUMMARY\n');
    console.log('━'.repeat(50));
    console.log(`Functionality: ${answers.functionality}`);
    console.log(`Server-Side Required: ${answers.serverSide}`);
    console.log(`Implementation Type: ${answers.facadeOrReal}`);
    
    console.log('\nExternal Services:');
    const services = Array.isArray(answers.externalServices) ? answers.externalServices : [answers.externalServices];
    services.forEach(service => console.log(`  • ${service}`));
    
    console.log('\nProduction Issues:');
    const issues = Array.isArray(answers.productionBreaks) ? answers.productionBreaks : [answers.productionBreaks];
    issues.forEach(issue => console.log(`  • ${issue}`));
    
    console.log('\n━'.repeat(50));

    // Warning messages
    if (answers.functionality === 'FAKE' || answers.facadeOrReal === 'FACADE') {
      console.log('\n⚠️  WARNING: You are building FAKE/FACADE functionality!');
      console.log('   - Users will receive non-functional or template responses');
      console.log('   - This should be temporary for prototyping only');
      console.log('   - Plan real implementation before production deployment\n');
    }

    if (answers.serverSide === 'YES') {
      console.log('\n📝 REMINDER: Server-side implementation required');
      console.log('   - Create /app/api/ routes for backend functionality');
      console.log('   - Implement proper error handling and validation');
      console.log('   - Configure environment variables for external services\n');
    }

    const header = this.generateHonestyHeader(answers);
    console.log('📄 GENERATED HONESTY HEADER:\n');
    console.log(header);
    console.log('\n💡 Copy this header to your new files to ensure honesty compliance.\n');
  }

  async run() {
    try {
      const answers = await this.runPrompt();
      this.displaySummary(answers);
      
      return true;
    } catch (error) {
      console.error('Error running reality check:', error);
      return false;
    }
  }
}

// Run the reality check prompt
async function main() {
  const prompt = new RealityCheckPrompt();
  await prompt.run();
}

// Only run if called directly (not imported)
if (require.main === module) {
  main();
}

module.exports = RealityCheckPrompt;