const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to demo page...');
  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });

  console.log('Page loaded successfully ✓');

  // Check if Export button exists
  const exportButton = await page.locator('button:has-text("Export")').first();
  const exportExists = await exportButton.isVisible();
  console.log(`Export button visible: ${exportExists ? '✓' : '✗'}`);

  if (exportExists) {
    // Click export button to open modal
    console.log('Clicking Export button...');
    await exportButton.click();
    await page.waitForTimeout(1000);

    // Check for export modal
    const modalVisible = await page.locator('text=Export Demo ICP').isVisible();
    console.log(`Export modal opened: ${modalVisible ? '✓' : '✗'}`);

    if (modalVisible) {
      // Check for PDF export button
      const pdfButton = await page.locator('button:has-text("Export as PDF")').isVisible();
      console.log(`PDF export button visible: ${pdfButton ? '✓' : '✗'}`);

      // Check for Markdown export button
      const markdownButton = await page.locator('button:has-text("Export as Markdown")').isVisible();
      console.log(`Markdown export button visible: ${markdownButton ? '✓' : '✗'}`);

      // Check for CSV export button
      const csvButton = await page.locator('button:has-text("Export as CSV")').isVisible();
      console.log(`CSV export button visible: ${csvButton ? '✓' : '✗'}`);
    }
  }

  // Take screenshot
  await page.screenshot({ path: '/tmp/demo-page.png', fullPage: true });
  console.log('Screenshot saved to /tmp/demo-page.png');

  await browser.close();
  console.log('Browser test complete ✓');
})();
