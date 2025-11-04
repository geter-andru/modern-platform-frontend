// Test script to verify export watermarks
const { generateMarkdown, generateCSV } = require('./app/lib/utils/data-export');

const testData = {
  companyName: 'Demo - TestProduct',
  productName: 'A test product description',
  personas: [{
    name: 'Test Persona',
    title: 'Chief Technology Officer',
    role: 'Engineering Leader',
    company: 'Tech Corp',
    demographics: {
      ageRange: '35-45',
      experience: '10+ years',
      education: 'BS Computer Science'
    },
    goals: ['Improve development velocity', 'Reduce technical debt'],
    painPoints: ['Legacy code maintenance', 'Scalability challenges'],
    communicationPreferences: {
      preferredChannels: ['Email', 'LinkedIn'],
      communicationStyle: 'Direct and technical'
    },
    objections: ['Budget constraints', 'Implementation timeline']
  }],
  generatedAt: new Date().toISOString()
};

console.log('='.repeat(80));
console.log('TESTING MARKDOWN EXPORT WITH WATERMARK');
console.log('='.repeat(80));

const markdownResult = generateMarkdown(testData, { includeDemoWatermark: true });
console.log('\nMarkdown Export (first 500 chars):');
console.log(markdownResult.substring(0, 500));
console.log('\n' + '='.repeat(80));

console.log('\nWatermark Verification:');
console.log('✓ Has HTML comment watermark:', markdownResult.includes('<!-- ⚠️ DEMO VERSION'));
console.log('✓ Has visible watermark:', markdownResult.includes('**⚠️ DEMO VERSION**'));
console.log('✓ Has andru.com link:', markdownResult.includes('andru.com'));
console.log('✓ Total length:', markdownResult.length, 'characters');

console.log('\n' + '='.repeat(80));
console.log('TESTING CSV EXPORT WITH WATERMARK');
console.log('='.repeat(80));

const csvResult = generateCSV(testData, { includeDemoWatermark: true });
console.log('\nCSV Export (first 500 chars):');
console.log(csvResult.substring(0, 500));
console.log('\n' + '='.repeat(80));

console.log('\nWatermark Verification:');
console.log('✓ Has demo warning:', csvResult.includes('⚠️ DEMO VERSION'));
console.log('✓ Has andru.com link:', csvResult.includes('andru.com'));
console.log('✓ Has timestamp:', csvResult.includes('Generated'));
console.log('✓ Total length:', csvResult.length, 'characters');

console.log('\n' + '='.repeat(80));
console.log('ALL TESTS COMPLETED');
console.log('='.repeat(80));
