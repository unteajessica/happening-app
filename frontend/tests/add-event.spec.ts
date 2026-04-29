import { test, expect } from '@playwright/test';

test.describe('Add Event', () => {

    test('should show validation errors when saving empty form', async ({ page }) => {
        await page.goto('http://localhost:5173/add-event');
        await page.click('button:has-text("Save")');

        await expect(page.locator('text=Title is required')).toBeVisible();
        await expect(page.locator('text=Category is required')).toBeVisible();
        await expect(page.locator('text=Date is required')).toBeVisible();
        await expect(page.locator('text=Location is required')).toBeVisible();
        await expect(page.locator('text=Price is required')).toBeVisible();
        await expect(page.locator('text=Description is required')).toBeVisible();
    });

    test('should successfully add a new event', async ({ page }) => {
        await page.goto('http://localhost:5173/add-event');

        const inputs = page.locator('input.add-event-input');
    
        await inputs.nth(0).fill('Test Concert');
        await inputs.nth(1).fill('Music');
        await inputs.nth(2).fill('01-06-2026');
        await inputs.nth(3).fill('City Park');
        await inputs.nth(4).fill('$15');
        await inputs.nth(5).fill('https://example.com/image.jpg');
        await page.locator('textarea.add-event-textarea').fill('A great concert in the park.');

        await page.click('button:has-text("Save")');

        await expect(page).toHaveURL(/events-table/, { timeout: 10000 });
    
        // navigate to last page where the new event appears
        const lastPageButton = page.locator('.page-number').last();
        await lastPageButton.click();

        await expect(page.locator('text=Test Concert')).toBeVisible({ timeout: 10000 });
    });

    test('should navigate back when cancel is clicked', async ({ page }) => {
        await page.goto('http://localhost:5173/add-event');
        await page.click('button:has-text("Cancel")');
        await expect(page).toHaveURL(/events-table/);
    });

});