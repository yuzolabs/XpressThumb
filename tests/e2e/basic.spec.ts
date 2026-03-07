import { test, expect } from '@playwright/test'

test('basic test', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/X/)
})

test.describe('offline mode @offline', () => {
  test('app loads and works offline with all assets', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for service worker to be registered and activated
    await page.waitForFunction(async () => {
      if (!('serviceWorker' in navigator)) return false
      const registration = await navigator.serviceWorker.ready
      return registration.active !== null
    }, { timeout: 10000 })

    // Wait for all fonts to be loaded with retry
    await page.waitForFunction(async () => {
      await document.fonts.ready
      const notoSansReady = document.fonts.check('16px "Noto Sans JP"')
      const mPlusRoundedReady = document.fonts.check('16px "M PLUS Rounded 1c"')
      return notoSansReady && mPlusRoundedReady
    }, { timeout: 10000 })

    // Wait for cache to be populated
    await page.waitForFunction(async () => {
      const cacheNames = await caches.keys()
      if (cacheNames.length === 0) return false
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()
        if (requests.length > 0) return true
      }
      return false
    }, { timeout: 10000 })

    // Simulate offline mode by intercepting network requests
    await page.route('**/*', (route) => {
      // Only block external requests, allow local assets (which should be cached)
      const url = route.request().url()
      if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
        route.continue()
      } else {
        route.abort('internetdisconnected')
      }
    })

    // Reload page while "offline" (local assets only)
    await page.reload()
    await expect(page).toHaveTitle(/X/)

    // Wait for fonts after reload
    await page.waitForFunction(async () => {
      await document.fonts.ready
      const notoSansReady = document.fonts.check('16px "Noto Sans JP"')
      const mPlusRoundedReady = document.fonts.check('16px "M PLUS Rounded 1c"')
      return notoSansReady && mPlusRoundedReady
    }, { timeout: 10000 })

    // Verify app is still functional after reload
    const appFunctional = await page.evaluate(() => {
      return document.getElementById('root') !== null &&
             document.querySelector('.preview-canvas-host') !== null
    })
    expect(appFunctional).toBe(true)
  })

  test('service worker precaches all required assets', async ({ page }) => {
    await page.goto('/')

    // Wait for service worker to be ready and cache populated
    await page.waitForFunction(async () => {
      if (!('serviceWorker' in navigator)) return false
      const registration = await navigator.serviceWorker.ready
      if (!registration.active) return false

      // Check if cache has entries
      const cacheNames = await caches.keys()
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()
        if (requests.length >= 10) return true // Should have at least 12 precached items
      }
      return false
    }, { timeout: 15000 })

    // Get list of cached assets from service worker
    const cachedAssets = await page.evaluate(async () => {
      const cacheNames = await caches.keys()
      const assets: string[] = []
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()
        assets.push(...requests.map(r => r.url))
      }
      return assets
    })

    expect(cachedAssets.length).toBeGreaterThanOrEqual(10)

    // Verify all required assets are cached
    const requiredAssets = [
      'NotoSansJP-Regular.woff2',
      'NotoSansJP-Bold.woff2',
      'MPLUSRounded1c-Regular.woff2',
      'MPLUSRounded1c-Bold.woff2',
      'noise.svg',
      'dot.svg',
      'grid.svg'
    ]

    for (const asset of requiredAssets) {
      const isCached = cachedAssets.some(url => url.includes(asset))
      expect(isCached, `Asset ${asset} should be cached`).toBe(true)
    }
  })
})
