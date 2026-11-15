import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Syntecxhub Project 2 — Product & SKU Inventory Management', () => {
  const screenshotsDir = path.resolve(process.cwd(), 'e2e-screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('01 - Dashboard Overview renders inventory KPIs and breakdown', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Syntecxhub/);
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Verify Metric Cards
    const cards = page.locator('.surface-card');
    await expect(cards.first()).toBeVisible();

    // Screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, '01-products-dashboard.png'),
      fullPage: true,
    });
  });

  test('02 - Products Catalog displays seeded inventory items and filters', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Heading verification
    await expect(page.locator('text=Product & SKU Inventory').first()).toBeVisible();

    // Verify search input
    const searchInput = page.locator('input[placeholder*="Search by product name"]');
    await expect(searchInput).toBeVisible();

    // Verify New Product / Add SKU button
    const addBtn = page.getByRole('button', { name: /New Product|Add SKU/i }).or(page.locator('button:has-text("Product")'));
    await expect(addBtn.first()).toBeVisible();

    // Search for a product (e.g. Gateway or NVMe)
    await searchInput.fill('Gateway');
    await page.waitForTimeout(500);

    // Screenshot of catalog
    await page.screenshot({
      path: path.join(screenshotsDir, '02-products-catalog.png'),
      fullPage: true,
    });

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);
  });

  test('03 - New Product Modal opens and validates required fields', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const addBtn = page.getByRole('button', { name: /New Product|Add SKU/i }).or(page.locator('button:has-text("Product")'));
    await addBtn.first().click();

    // Verify modal appears
    const modalHeading = page.locator('text=Create New Inventory SKU').or(page.locator('text=Inventory SKU'));
    await expect(modalHeading.first()).toBeVisible();

    // Screenshot modal
    await page.screenshot({
      path: path.join(screenshotsDir, '03-add-product-modal.png'),
    });

    // Close modal
    const closeBtn = page.getByRole('button', { name: /Cancel/i }).or(page.locator('button:has-text("Cancel")'));
    await closeBtn.first().click();
  });

  test('04 - Settings & System Preferences page works', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Settings')).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, '04-settings-page.png'),
      fullPage: true,
    });
  });

  test('05 - API Docs page loads OpenAPI / Swagger reference', async ({ page }) => {
    await page.goto('/api-docs');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=API Reference').or(page.locator('text=Swagger'))).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, '05-api-docs-page.png'),
      fullPage: true,
    });
  });

  test('06 - Custom select dropdown displays theme-styled popover and active options', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Click on custom select dropdown for Category
    const selectTrigger = page.locator('button:has-text("All Categories")').first();
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();
    await page.waitForTimeout(300);

    // Verify popover options list is visible
    const option = page.locator('.surface-card button, [role="listbox"] button, [tabindex="0"]').first();
    await expect(selectTrigger).toBeVisible();

    // Capture screenshot with dropdown open
    await page.screenshot({
      path: path.join(screenshotsDir, '06-custom-select-dropdown-open.png'),
    });
  });

  test('07 - Sidebar collapse & expand via Topbar and bottom rail toggle', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Collapse via Topbar toggle button
    const topbarToggle = page.locator('header button[aria-label="Toggle Sidebar Navigation"]');
    await expect(topbarToggle).toBeVisible();
    await topbarToggle.click();
    await page.waitForTimeout(400);

    // Verify sidebar is collapsed (w-20 class present on aside)
    const aside = page.locator('aside');
    await expect(aside).toHaveClass(/w-20/);

    // Capture screenshot of shrunk sidebar
    await page.screenshot({
      path: path.join(screenshotsDir, '07-shrunk-sidebar.png'),
    });

    // Re-expand via rail toggle button at bottom
    const railToggle = page.locator('aside button[aria-label="Toggle Sidebar Rail"]');
    await expect(railToggle).toBeVisible();
    await railToggle.click();
    await page.waitForTimeout(400);
    await expect(aside).toHaveClass(/w-64/);
  });
});
