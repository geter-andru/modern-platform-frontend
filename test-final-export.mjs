import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('=== Final Export Test ===\n');

  // Listen for console logs indicating PDF generation
  let pdfGenerated = false;
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('PDF') || text.includes('jsPDF') || text.includes('export')) {
      console.log(`  📝 ${text}`);
      if (text.toLowerCase().includes('generating') || text.toLowerCase().includes('creating')) {
        pdfGenerated = true;
      }
    }
  });

  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });
  console.log('✓ Page loaded\n');

  // Open export modal
  await page.click('button:has-text("Export")');
  await page.waitForTimeout(500);
  console.log('✓ Export modal opened\n');

  console.log('Triggering PDF export...');

  // Click PDF button via JS and monitor
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('Export as PDF'));
    if (btn) {
      console.log('PDF export button clicked');
      btn.click();
    }
  });

  // Wait for processing
  console.log('Waiting for PDF generation (4 seconds)...\n');
  await page.waitForTimeout(4000);

  // Check if modal is still open or closed
  const modalStillOpen = await page.locator('text=Export Demo ICP').isVisible();
  console.log(`Modal still open: ${modalStillOpen}`);

  if (!modalStillOpen) {
    console.log('✓ Modal closed (export likely completed)\n');
  }

  // Final assessment
  console.log('=== Assessment ===');
  if (pdfGenerated) {
    console.log('✓ PDF generation detected in console');
  } else {
    console.log('⚠ No PDF generation logs detected');
  }

  if (!modalStillOpen) {
    console.log('✓ LIKELY SUCCESS: Modal closed after export');
  } else {
    console.log('⚠ UNCERTAIN: Modal still open');
  }

  await browser.close();
})();
