import { expect, test, type Browser } from '@playwright/test'

type LocalizedPage = {
  context: Awaited<ReturnType<Browser['newContext']>>
  page: Awaited<ReturnType<Awaited<ReturnType<Browser['newContext']>>['newPage']>>
}

async function createLocalizedPage(
  browser: Browser,
  locale: string
): Promise<{ page: LocalizedPage['page']; cleanup: () => Promise<void> }> {
  const context = await browser.newContext({ locale })
  const page = await context.newPage()
  await page.goto('/')
  await page.waitForSelector('[data-testid="app-shell"]', { timeout: 5000 })

  const cleanup = async (): Promise<void> => {
    await context.close()
  }

  return { page, cleanup }
}

test.describe('localization', () => {
  test('uses Japanese UI for Japanese browser locale', async ({ browser }) => {
    const { page, cleanup } = await createLocalizedPage(browser, 'ja-JP')

    try {
      await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
      await expect(page.getByRole('heading', { level: 2, name: 'キャンバス' })).toBeVisible()
      await expect(page.getByRole('button', { name: '画像を書き出す' })).toBeVisible()
      await expect(page.locator('[data-testid="text-input"]')).toHaveValue('新しい記事')
    } finally {
      await cleanup()
    }
  })

  test('falls back to English for unsupported browser locale', async ({ browser }) => {
    const { page, cleanup } = await createLocalizedPage(browser, 'fr-FR')

    try {
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      await expect(page.getByRole('heading', { level: 2, name: 'Canvas' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Export Image' })).toBeVisible()
      await expect(page.locator('[data-testid="text-input"]')).toHaveValue('New Article')
    } finally {
      await cleanup()
    }
  })
})
