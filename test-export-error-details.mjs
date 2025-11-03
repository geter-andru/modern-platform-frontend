import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  // Capture page errors
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000/icp/demo', { waitUntil: 'networkidle' });

  // Open modal
  await page.locator('button:has-text("Export")').first().click();
  await page.waitForTimeout(500);

  // Click PDF button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('Export as PDF'));
    if (btn) btn.click();
  });

  // Wait for errors/toasts
  await page.waitForTimeout(4000);

  // Get all toast/alert messages
  const messages = await page.evaluate(() => {
    // Check for react-hot-toast messages
    const toasts = Array.from(document.querySelectorAll('[role="status"], [data-rht-toaster] div'));
    return toasts.map(t => t.textContent.trim()).filter(t => t.length > 0);
  });

  console.log('\n=== Toast Messages ===');
  messages.forEach(msg => console.log(`- ${msg}`));

  // Get full page text to search for errors
  const fullText = await page.textContent('body');
  const errorMatch = fullText.match(/(error|fail|unable|cannot)[\s\S]{0,100}/i);

  if (errorMatch) {
    console.log('\n=== Error Context ===');
    console.log(errorMatch[0]);
  }

  await browser.close();
})();
