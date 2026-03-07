import { test, expect } from '@playwright/test'

test('basic test', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/X/)
})

test('offline mode @offline', async ({ page }) => {
  await page.goto('/')
  // Test passes in offline mode
})
