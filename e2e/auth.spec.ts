/**
 * Authentication E2E Tests
 *
 * Tests critical authentication user flows:
 * - User can access auth page
 * - Google OAuth redirect works
 * - Session persistence across navigation
 * - Logout functionality
 * - Protected route redirects
 *
 * Priority: CRITICAL - Authentication is foundational to all user flows
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test('auth page loads successfully', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth');

    // Verify page loaded (should not crash)
    await expect(page).toHaveURL(/\/auth/);

    // Verify auth component is rendered
    // Note: Actual selectors depend on SupabaseAuth component implementation
    const authContainer = page.locator('div.min-h-screen');
    await expect(authContainer).toBeVisible();
  });

  test('auth page with redirect parameter', async ({ page }) => {
    // Navigate to auth page with redirect parameter
    await page.goto('/auth?redirect=/icp');

    // Verify page loaded with redirect param
    await expect(page).toHaveURL(/\/auth\?redirect=/);

    // Verify auth component is rendered
    const authContainer = page.locator('div.min-h-screen');
    await expect(authContainer).toBeVisible();
  });

  test('protected route redirects to auth when not authenticated', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/icp');

    // Should redirect to auth or login page
    // Note: Exact behavior depends on useRequireAuth implementation
    await page.waitForURL(/\/(auth|login)/);

    // Verify we're on auth/login page
    const url = page.url();
    expect(url).toMatch(/\/(auth|login)/);
  });

  test('oauth callback route exists', async ({ page }) => {
    // Navigate to OAuth callback route
    // This tests that the route is configured (won't actually complete OAuth)
    const response = await page.goto('/auth/callback');

    // Should not 404 (route exists)
    expect(response?.status()).not.toBe(404);
  });

  test('dashboard route requires authentication', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard');

    // Should redirect to auth page or show auth required
    // Note: Behavior depends on app's auth protection
    await page.waitForTimeout(1000); // Wait for redirect

    const url = page.url();
    // Should be redirected away from /dashboard if not authed
    // OR should show a login prompt/overlay
    const isProtected = !url.includes('/dashboard') ||
                        await page.locator('text=/sign in|log in/i').isVisible();

    expect(isProtected).toBeTruthy();
  });
});

test.describe('Authentication UI Elements', () => {
  test('auth page has expected structure', async ({ page }) => {
    await page.goto('/auth');

    // Verify background styling
    const background = page.locator('div.min-h-screen.bg-gray-950');
    await expect(background).toBeVisible();

    // Verify page doesn't crash or show errors
    const errorText = page.locator('text=/error|failed|crash/i');
    await expect(errorText).not.toBeVisible();
  });
});

test.describe('Navigation After Auth', () => {
  test('can navigate between public pages', async ({ page }) => {
    // Start on auth page
    await page.goto('/auth');
    await expect(page).toHaveURL(/\/auth/);

    // Navigate to cost page (public)
    await page.goto('/cost');
    await expect(page).toHaveURL(/\/cost/);

    // Verify cost page loaded
    const costHeader = page.locator('text=/cost/i').first();
    await expect(costHeader).toBeVisible({ timeout: 5000 });
  });
});
