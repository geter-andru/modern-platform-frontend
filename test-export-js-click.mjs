import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('=== Export Test (JavaScript Click) ===\n');

  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });
  console.log('✓ Page loaded\n');

  // Open modal
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(1000);
  console.log('✓ Export modal opened\n');

  // Use JavaScript to click PDF button
  console.log('Clicking PDF export via JavaScript...');
  const result = await page.evaluate(() => {
    const pdfButton = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Export as PDF'));

    if (pdfButton) {
      pdfButton.click();
      return { clicked: true, buttonFound: true };
    }
    return { clicked: false, buttonFound: false };
  });

  console.log(`Button found: ${result.buttonFound}`);
  console.log(`Button clicked: ${result.clicked}\n`);

  // Wait for PDF generation
  await page.waitForTimeout(4000);

  // Check for toast messages
  const bodyText = await page.textContent('body');
  const hasSuccess = bodyText.toLowerCase().includes('success') || bodyText.toLowerCase().includes('exported');
  const hasError = bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('fail');

  if (hasSuccess) {
    console.log('✓ PDF Export SUCCESS - Success message detected\n');
  } else if (hasError) {
    console.log('✗ PDF Export FAILED - Error message detected\n');
  } else {
    console.log('⚠ PDF Export UNCERTAIN - No clear success/error message\n');
  }

  await page.screenshot({ path: '/tmp/pdf-export-result.png', fullPage: true });
  console.log('Screenshot saved: /tmp/pdf-export-result.png\n');

  await browser.close();
  console.log('=== Test Complete ===');
})();
