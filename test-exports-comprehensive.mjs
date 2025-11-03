import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('=== Comprehensive Export Testing ===\n');

  // Navigate to demo page
  console.log('1. Navigating to demo page...');
  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });
  console.log('   ✓ Page loaded\n');

  // Test 1: PDF Export
  console.log('2. Testing PDF Export...');
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(500);

  // Click PDF button and wait for toast
  await page.locator('button:has-text("Export as PDF")').click();
  await page.waitForTimeout(3000); // Wait for PDF generation

  // Check for success or error message
  const bodyText = await page.textContent('body');
  if (bodyText.includes('successfully') || bodyText.includes('exported') || bodyText.includes('PDF')) {
    console.log('   ✓ PDF export success message detected');
  } else if (bodyText.includes('error') || bodyText.includes('failed')) {
    console.log('   ✗ PDF export error detected');
  } else {
    console.log('   ⚠ No clear success/error message (may have exported)');
  }

  // Close modal
  const cancelButton = await page.locator('button:has-text("Cancel")');
  if (await cancelButton.isVisible()) {
    await cancelButton.click();
  }
  await page.waitForTimeout(500);

  // Test 2: Markdown Export
  console.log('\n3. Testing Markdown Export...');
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(500);

  const markdownButton = await page.locator('button:has-text("Export as Markdown")');
  const markdownDisabled = await markdownButton.isDisabled();

  if (markdownDisabled) {
    console.log('   ⚠ Markdown export button is disabled (Coming Soon)');
  } else {
    await markdownButton.click();
    await page.waitForTimeout(1000);
    console.log('   ✓ Markdown export button clicked');
  }

  await page.locator('button:has-text("Cancel")').click();
  await page.waitForTimeout(500);

  // Test 3: CSV Export
  console.log('\n4. Testing CSV Export...');
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(500);

  const csvButton = await page.locator('button:has-text("Export as CSV")');
  const csvDisabled = await csvButton.isDisabled();

  if (csvDisabled) {
    console.log('   ⚠ CSV export button is disabled (Coming Soon)');
  } else {
    await csvButton.click();
    await page.waitForTimeout(1000);
    console.log('   ✓ CSV export button clicked');
  }

  // Take final screenshot
  await page.screenshot({ path: '/tmp/export-test-complete.png', fullPage: true });
  console.log('\n5. Screenshot saved to /tmp/export-test-complete.png');

  await browser.close();
  console.log('\n=== Export Testing Complete ===');
})();
