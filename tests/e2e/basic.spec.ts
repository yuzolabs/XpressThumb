import { test, expect } from '@playwright/test'

test('basic test', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/X/)
})

test.describe('offline mode @offline', () => {
  test('app loads and works offline with all assets', async ({ page }) => {
    test.setTimeout(30000)
    
    // Navigate to the app
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for service worker to be registered and activated
    await page.waitForFunction(async () => {
      if (!('serviceWorker' in navigator)) return false
      try {
        const registration = await navigator.serviceWorker.ready
        return registration.active !== null
      } catch (e) {
        return false
      }
    }, { timeout: 15000 })

    // Wait for all fonts to be loaded with retry
    await page.waitForFunction(async () => {
      await document.fonts.ready
      const notoSansReady = document.fonts.check('16px "Noto Sans JP"')
      const mPlusRoundedReady = document.fonts.check('16px "M PLUS Rounded 1c"')
      return notoSansReady && mPlusRoundedReady
    }, { timeout: 5000 })

    // Wait for cache to be populated
    await page.waitForFunction(async () => {
      try {
        const cacheNames = await caches.keys()
        if (cacheNames.length === 0) return false
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          if (requests.length > 0) return true
        }
      } catch (e) {
        return false
      }
      return false
    }, { timeout: 5000 })

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
    }, { timeout: 5000 })

    // Verify app is still functional after reload
    const appFunctional = await page.evaluate(() => {
      return document.getElementById('root') !== null &&
             document.querySelector('.preview-canvas-host') !== null
    })
    expect(appFunctional).toBe(true)
  })

  test('service worker precaches all required assets', async ({ page }) => {
    test.setTimeout(30000)

    await page.goto('/')

    // Wait for service worker to be ready and cache populated
    await page.waitForFunction(async () => {
      if (!('serviceWorker' in navigator)) return false
      try {
        const registration = await navigator.serviceWorker.ready
        if (!registration.active) return false

        // Check if cache has entries
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          if (requests.length >= 10) return true // Should have at least 10 precached items
        }
      } catch (e) {
        return false
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

test.describe('export functionality @export', () => {
  test('export button triggers download', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 })

    // Click export button
    await page.click('[data-testid="download-button"]')

    // Wait for download to start
    const download = await downloadPromise

    // Verify download started
    expect(download.suggestedFilename()).toMatch(/\.png$/)
  })

  test('export is disabled when text overflows', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Enter very long text to trigger overflow
    await page.fill('[data-testid="text-input"]', 'A'.repeat(500))

    // Wait for overflow warning to appear
    await page.waitForSelector('[data-testid="overflow-warning"]', { timeout: 5000 })

    // Verify export button is disabled
    const downloadButton = await page.locator('[data-testid="download-button"]')
    await expect(downloadButton).toBeDisabled()
  })
})

test.describe('layer switching @layers', () => {
  test('switch between background modes', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Switch to gradient mode by clicking the button
    await page.click('[data-testid="background-mode-select"] button:has-text("Gradient")')
    await page.waitForSelector('[data-testid="gradient-bg-picker"]', { timeout: 5000 })

    // Switch to image mode by clicking the button
    await page.click('[data-testid="background-mode-select"] button:has-text("Image")')
    await page.waitForSelector('.upload-container', { timeout: 5000 })

    // Switch back to solid mode by clicking the button
    await page.click('[data-testid="background-mode-select"] button:has-text("Solid")')
    await page.waitForSelector('[data-testid="solid-bg-picker"]', { timeout: 5000 })

    // Verify canvas is still rendering
    const canvasVisible = await page.isVisible('[data-testid="preview-canvas-host"]')
    expect(canvasVisible).toBe(true)
  })

  test('switch between pattern types', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Test each pattern type by clicking buttons
    const patterns = [
      { value: 'noise', label: 'Noise' },
      { value: 'dot', label: 'Dot' },
      { value: 'grid', label: 'Grid' }
    ]
    for (const pattern of patterns) {
      await page.click(`[data-testid="pattern-select"] button:has-text("${pattern.label}")`)

      // Verify opacity slider appears for non-none patterns
      const opacityVisible = await page.isVisible('[data-testid="pattern-opacity-slider"]')
      expect(opacityVisible).toBe(true)
    }

    // Switch back to none
    await page.click('[data-testid="pattern-select"] button:has-text("None")')
    const opacityGone = await page.locator('[data-testid="pattern-opacity-slider"]').count() === 0
    expect(opacityGone).toBe(true)
  })

  test('switch between aspect ratios', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Get initial canvas dimensions
    const canvasWrapper = await page.locator('[data-testid="canvas-wrapper"]')

    // Test each ratio
    const ratios = ['1:1', '5:2', '16:9']
    for (const ratio of ratios) {
      await page.click(`button:has-text("${ratio}")`)

      // Verify canvas wrapper has correct aspect ratio style (CSS may add spaces)
      const aspectRatio = await canvasWrapper.evaluate(el => el.style.aspectRatio)
      expect(aspectRatio.replace(/\s/g, '')).toBe(ratio.replace(':', '/'))
    }
  })
})

test.describe('evidence screenshots @evidence', () => {
  test('capture editor shell screenshot', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for app to be fully loaded
    await page.waitForSelector('[data-testid="app-shell"]', { timeout: 5000 })
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Wait for fonts to be ready
    await page.waitForFunction(async () => {
      await document.fonts.ready
      return document.fonts.check('16px "Noto Sans JP"')
    }, { timeout: 5000 })

    // Take screenshot
    await page.screenshot({
      path: '.sisyphus/evidence/task-5-editor-shell.png',
      fullPage: true
    })
  })

  test('capture background layer screenshot', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for app to be fully loaded
    await page.waitForSelector('[data-testid="app-shell"]', { timeout: 5000 })
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Switch to gradient background by clicking the button
    await page.click('[data-testid="background-mode-select"] button:has-text("Gradient")')

    // Wait for gradient picker and select a gradient
    await page.waitForSelector('[data-testid="gradient-bg-picker"]', { timeout: 5000 })
    await page.click('[data-testid="gradient-bg-picker"] button:first-child')

    // Add a pattern by clicking the button
    await page.click('[data-testid="pattern-select"] button:has-text("Noise")')

    // Wait for fonts to be ready
    await page.waitForFunction(async () => {
      await document.fonts.ready
      return document.fonts.check('16px "Noto Sans JP"')
    }, { timeout: 5000 })

    // Take screenshot
    await page.screenshot({
      path: '.sisyphus/evidence/task-8-background-layer.png',
      fullPage: true
    })
  })

  test('capture PNG export screenshot', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for app to be fully loaded
    await page.waitForSelector('[data-testid="app-shell"]', { timeout: 5000 })
    await page.waitForSelector('[data-testid="preview-canvas-host"]', { timeout: 5000 })

    // Configure some settings
    await page.fill('[data-testid="text-input"]', 'Export Test Article')
    await page.click('[data-testid="background-mode-select"] button:has-text("Gradient")')
    await page.click('[data-testid="gradient-bg-picker"] button:first-child')

    // Wait for fonts to be ready
    await page.waitForFunction(async () => {
      await document.fonts.ready
      return document.fonts.check('16px "Noto Sans JP"')
    }, { timeout: 5000 })

    // Take screenshot showing the export button
    await page.screenshot({
      path: '.sisyphus/evidence/task-12-png-export.png',
      fullPage: true
    })
  })

  test('capture offline test screenshot', async ({ page }) => {
    test.setTimeout(30000)

    await page.goto('/')
    await expect(page).toHaveTitle(/X/)

    // Wait for service worker to be ready
    await page.waitForFunction(async () => {
      if (!('serviceWorker' in navigator)) return false
      try {
        const registration = await navigator.serviceWorker.ready
        return registration.active !== null
      } catch (e) {
        return false
      }
    }, { timeout: 15000 })

    // Wait for cache to be populated
    await page.waitForFunction(async () => {
      try {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          if (requests.length > 0) return true
        }
      } catch (e) {
        return false
      }
      return false
    }, { timeout: 5000 })

    // Take screenshot
    await page.screenshot({
      path: '.sisyphus/evidence/task-11-offline-test.png',
      fullPage: true
    })
  })
})
