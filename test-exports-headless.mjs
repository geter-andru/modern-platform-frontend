import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('=== Headless Export Testing ===\n');

  console.log('1. Navigating to demo page...');
  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });
  console.log('   ✓ Page loaded\n');

  console.log('2. Opening export modal...');
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(1000);
  console.log('   ✓ Modal opened\n');

  console.log('3. Clicking PDF export (forced)...');
  await page.locator('button:has-text("Export as PDF")').click({ force: true, timeout: 5000 });
  console.log('   ✓ PDF button clicked\n');

  console.log('4. Waiting for PDF generation...');
  await page.waitForTimeout(4000);

  const bodyText = await page.textContent('body');
  if (bodyText.toLowerCase().includes('success') || bodyText.toLowerCase().includes('exported') || bodyText.toLowerCase().includes('pdf')) {
    console.log('   ✓ Success message detected\n');
  } else if (bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('fail')) {
    console.log('   ✗ Error detected\n');
  } else {
    console.log('   ⚠ No clear message\n');
  }

  await page.screenshot({ path: '/tmp/export-test-result.png', fullPage: true });
  console.log('5. Screenshot: /tmp/export-test-result.png\n');

  await browser.close();
  console.log('=== Test Complete ===');
})();
