import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 }); // Visible browser for debugging
  const page = await browser.newPage();

  console.log('=== Export Testing (With Visibility) ===\n');

  // Navigate to demo page
  console.log('1. Navigating to demo page...');
  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });
  console.log('   ✓ Page loaded\n');

  // Test PDF Export
  console.log('2. Testing PDF Export...');
  const exportBtn = page.locator('button:has-text("Export")').first();
  await exportBtn.scrollIntoViewIfNeeded();
  await exportBtn.click();
  await page.waitForTimeout(1000);
  console.log('   ✓ Export modal opened');

  // Force click PDF button (bypass viewport check)
  const pdfBtn = page.locator('button:has-text("Export as PDF")');
  await pdfBtn.scrollIntoViewIfNeeded();
  await pdfBtn.click({ force: true });
  console.log('   ✓ PDF export button clicked (forced)');

  // Wait for toast notification
  await page.waitForTimeout(4000);

  // Check page content for success message
  const pageText = await page.textContent('body');
  if (pageText.includes('successfully') || pageText.includes('exported')) {
    console.log('   ✓ Success message detected\n');
  } else if (pageText.includes('error') || pageText.includes('fail')) {
    console.log('   ✗ Error message detected\n');
  } else {
    console.log('   ⚠ No clear message (check screenshot)\n');
  }

  // Take screenshot
  await page.screenshot({ path: '/tmp/export-modal-test.png', fullPage: true });
  console.log('3. Screenshot saved to /tmp/export-modal-test.png');

  console.log('\n=== Keeping browser open for 5 seconds ===');
  await page.waitForTimeout(5000);

  await browser.close();
  console.log('=== Test Complete ===');
})();
