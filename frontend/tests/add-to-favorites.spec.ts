import { test, expect } from '@playwright/test';

test.describe('Favorites', () => {

    test('should add event to favorites and display it on favorites page', async ({ page }) => {
        await page.goto('http://localhost:5173/events-table');

        // click the heart button for the first event
        await page.locator('.heart-button').first().click();

        // navigate via navbar link instead of goto (preserves React state)
        await page.locator('a[href="/favorites-page"]').click();

        // verify the event appears in favorites
        await expect(page.locator('text=Jazz In The Park')).toBeVisible({ timeout: 10000 });
    });

    test('should remove event from favorites when heart is clicked again', async ({ page }) => {
        await page.goto('http://localhost:5173/events-table');

        await page.locator('.heart-button').first().click();
        await page.locator('.heart-button').first().click();

        // navigate via navbar link
        await page.locator('a[href="/favorites-page"]').click();

        await expect(page.locator('text=Jazz In The Park')).not.toBeVisible();
    });

    test('should show empty message when no favorites', async ({ page }) => {
        await page.goto('http://localhost:5173/favorites-page');

        await expect(page.locator('text=No favorite events yet')).toBeVisible();
    });

});