import { test, expect } from '@playwright/test';

test.describe('Delete Event', () => {

    test('should show delete confirmation modal when delete is clicked', async ({ page }) => {
        await page.goto('http://localhost:5173/events-table');

        await page.locator('.delete-button').first().click();

        await expect(page.locator('.delete-modal')).toBeVisible();
    });

    test('should keep event in list when modal is cancelled', async ({ page }) => {
        await page.goto('http://localhost:5173/events-table');

        await page.locator('.delete-button').first().click();
        await page.locator('button:has-text("No")').click(); // 👈 was "Cancel"

        await expect(page.locator('text=Jazz In The Park')).toBeVisible();
    });

    test('should delete event and remove it from the table', async ({ page }) => {
        await page.goto('http://localhost:5173/events-table');

        await page.locator('.delete-button').first().click();
        await page.locator('button:has-text("Yes")').click(); // 👈 was "Delete"

        await expect(page.locator('text=Jazz In The Park')).not.toBeVisible();
    });

});