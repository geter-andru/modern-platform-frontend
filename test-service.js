// Simple test to verify service import works
const service = require('./src/lib/services/TechnicalTranslationService.ts');

console.log('✅ Service imported successfully');
console.log('Service object:', Object.keys(service));
console.log('Default export:', service.default);
console.log('Has getAvailableFrameworks:', typeof service.default?.getAvailableFrameworks);

if (service.default?.getAvailableFrameworks) {
  const frameworks = service.default.getAvailableFrameworks();
  console.log('✅ Frameworks loaded:', frameworks.length);
} else {
  console.error('❌ getAvailableFrameworks not found!');
}
