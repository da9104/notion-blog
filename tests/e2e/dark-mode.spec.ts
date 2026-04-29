import { test, expect } from '@playwright/test';

const DARK_BG = 'rgb(26, 26, 26)';   // #1A1A1A
const LIGHT_BG = 'rgb(251, 249, 245)'; // #fbf9f5

test.describe('Dark mode toggle', () => {

  test.beforeEach(async ({ page }) => {
    // Force light mode by clearing stored preference
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('theme'));
    // Navigate fresh so next-themes picks up the cleared state
    await page.goto('/');
    // Override color scheme to light so system default is predictable
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
  });

  test('1 — page loads in light mode', async ({ page }) => {
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).not.toContain('dark');

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    );
    expect(bg).toBe('#fbf9f5');
  });

  test('2 — clicking toggle applies html.dark and dark background', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Switch to dark mode' });
    await expect(toggle).toBeVisible();

    await toggle.click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(true);

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    );
    expect(bg).toBe('#1A1A1A');

    // Phone frame background visually changed
    const frame = page.locator('div.max-w-\\[430px\\]').first();
    await expect(frame).toHaveCSS('background-color', DARK_BG);
  });

  test('3 — clicking toggle again reverts to light', async ({ page }) => {
    // Go dark first
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();

    // Now go back to light
    await page.getByRole('button', { name: 'Switch to light mode' }).click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(false);

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
    );
    expect(bg).toBe('#fbf9f5');
  });

  test('4 — dark theme persists across page reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();

    await page.reload();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(true);
  });

  test('5 — toggle icon swaps Sun → Moon → Sun', async ({ page }) => {
    // Light mode: aria-label says "Switch to dark mode" (Sun icon visible)
    const toDark = page.getByRole('button', { name: 'Switch to dark mode' });
    await expect(toDark).toBeVisible();

    await toDark.click();

    // Dark mode: aria-label says "Switch to light mode" (Moon icon visible)
    const toLight = page.getByRole('button', { name: 'Switch to light mode' });
    await expect(toLight).toBeVisible();

    await toLight.click();

    // Back to Sun
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  });

});
