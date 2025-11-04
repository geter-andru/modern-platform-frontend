/**
 * Playwright Authentication State Capture Script
 *
 * This script opens a browser where you manually log in via Google OAuth.
 * Once logged in, it saves your authentication state (cookies, localStorage, etc.)
 * to dev/playwright-auth-state.json for reuse in automated tests.
 *
 * Usage:
 *   npx tsx dev/playwright-auth-capture.ts
 *
 * What to do:
 *   1. Browser will open automatically
 *   2. Log in using Google OAuth (or Magic Link)
 *   3. Wait for redirect to dashboard/home page
 *   4. Script auto-saves auth state and closes
 */

import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_STATE_PATH = path.join(__dirname, 'playwright-auth-state.json');
const BASE_URL = 'http://localhost:3002';

async function captureAuthState() {
  console.log('\n🎭 Playwright Auth State Capture\n');
  console.log('📋 Instructions:');
  console.log('   1. Browser will open in a moment');
  console.log('   2. Click "Sign in with Google" or use Magic Link');
  console.log('   3. Complete the login flow');
  console.log('   4. Wait on the dashboard/home page');
  console.log('   5. Script will auto-save and close\n');

  // Launch browser in non-headless mode (visible)
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100 // Slight delay to make actions visible
  });

  const context = await browser.newContext();
  context.setDefaultTimeout(300000); // 5 minutes timeout
  const page = await context.newPage();

  // Navigate to home page
  console.log(`🌐 Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL);

  console.log('\n⏳ Waiting for you to log in...');
  console.log('   (Script will wait up to 5 minutes)\n');

  try {
    // Wait for successful authentication
    // We'll detect this by checking for Supabase auth token in localStorage
    await page.waitForFunction(
      () => {
        // Check if we have Supabase auth token in localStorage
        // Try common Supabase auth key patterns
        const keys = Object.keys(localStorage);
        const hasAuthKey = keys.some(key =>
          key.includes('sb-') && key.includes('auth-token')
        );

        return hasAuthKey;
      },
      { timeout: 300000 } // 5 minutes
    );

    console.log('✅ Authentication detected!');

    // Give it a moment for all cookies/storage to settle
    await page.waitForTimeout(2000);

    // Save authentication state
    console.log(`💾 Saving auth state to ${AUTH_STATE_PATH}...`);
    await context.storageState({ path: AUTH_STATE_PATH });

    console.log('✅ Auth state saved successfully!');
    console.log(`\n📁 File location: ${AUTH_STATE_PATH}`);
    console.log('\n🎉 You can now use this state in automated tests!\n');

  } catch (error) {
    console.error('\n❌ Error capturing auth state:');
    console.error(error);
    console.log('\n💡 Tips:');
    console.log('   - Make sure you complete the full login flow');
    console.log('   - Ensure you land on a dashboard/home page after login');
    console.log('   - Check that localStorage has auth tokens\n');
  } finally {
    await browser.close();
  }
}

// Run the capture
captureAuthState().catch(console.error);
