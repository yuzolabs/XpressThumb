import { expect, test, type Browser } from '@playwright/test'

type LocalizedPage = {
  context: Awaited<ReturnType<Browser['newContext']>>
  page: Awaited<ReturnType<Awaited<ReturnType<Browser['newContext']>>['newPage']>>
}

async function createLocalizedPage(browser: Browser, locale: string): Promise<LocalizedPage> {
  const context = await browser.newContext({ locale })
  const page = await context.newPage()
  await page.goto('/')
  await page.waitForSelector('[data-testid="app-shell"]', { timeout: 5000 })
  return { context, page }
}

test.describe('localization', () => {
  test('uses Japanese UI for Japanese browser locale', async ({ browser }) => {
    const { context, page } = await createLocalizedPage(browser, 'ja-JP')

    await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
    await expect(page.getByRole('heading', { level: 2, name: 'キャンバス' })).toBeVisible()
    await expect(page.getByRole('button', { name: '画像を書き出す' })).toBeVisible()
    await expect(page.locator('[data-testid="text-input"]')).toHaveValue('新しい記事')

    await context.close()
  })

  test('falls back to English for unsupported browser locale', async ({ browser }) => {
    const { context, page } = await createLocalizedPage(browser, 'fr-FR')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 2, name: 'Canvas' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Export Image' })).toBeVisible()
    await expect(page.locator('[data-testid="text-input"]')).toHaveValue('New Article')

    await context.close()
  })
})
