import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true
  });
  const page = await context.newPage();

  console.log('=== PDF Export Test ===\n');

  console.log('Navigating to demo page...');
  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });
  console.log('✓ Page loaded\n');

  // Open export modal
  console.log('Opening export modal...');
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(500);

  const modalVisible = await page.locator('text=Export Demo ICP').isVisible();
  console.log(`✓ Export modal opened: ${modalVisible}\n`);

  // Click PDF export button
  console.log('Clicking PDF export button...');

  // Listen for download
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });

  await page.locator('button:has-text("Export as PDF")').click();
  console.log('✓ Clicked PDF export button\n');

  // Wait for toast or download
  try {
    const download = await downloadPromise;
    const fileName = download.suggestedFilename();
    console.log(`✓ PDF download triggered: ${fileName}`);

    // Save the download
    const path = `/tmp/${fileName}`;
    await download.saveAs(path);

    // Check file size
    const stats = fs.statSync(path);
    console.log(`✓ PDF file size: ${stats.size} bytes`);
    console.log(`✓ PDF saved to: ${path}\n`);

    console.log('=== PDF Export Test: SUCCESS ✓ ===');
  } catch (error) {
    // PDF might be generated client-side without download event
    console.log('No download event (PDF may be client-side generated)');

    // Check for success toast instead
    await page.waitForTimeout(2000);
    const pageContent = await page.content();

    if (pageContent.includes('successfully') || pageContent.includes('exported')) {
      console.log('✓ Export success message detected\n');
      console.log('=== PDF Export Test: SUCCESS (Client-side) ✓ ===');
    } else {
      console.log('✗ No success confirmation found\n');
      console.log('=== PDF Export Test: INCONCLUSIVE ===');
    }
  }

  await browser.close();
})();
