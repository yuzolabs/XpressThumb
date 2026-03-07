import { chromium } from '@playwright/test'
import path from 'path'

async function captureScreenshot() {
  // Launch browser with no sandbox for container environments
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  })
  
  const page = await context.newPage()
  
  // Navigate to the app
  await page.goto('http://localhost:5173')
  
  // Wait for fonts to load
  await page.waitForFunction(async () => {
    await document.fonts.ready
    const notoSansReady = document.fonts.check('16px "Noto Sans JP"')
    const mPlusRoundedReady = document.fonts.check('16px "M PLUS Rounded 1c"')
    return notoSansReady && mPlusRoundedReady
  }, { timeout: 10000 })
  
  // Enter some text
  await page.getByTestId('text-input').fill('PNG Export Test - Task 12')
  
  // Wait for render
  await page.waitForTimeout(1000)
  
  // Take screenshot
  const screenshotPath = path.join(__dirname, '..', '..', '.sisyphus', 'evidence', 'task-12-png-export.png')
  await page.screenshot({ path: screenshotPath, fullPage: false })
  
  console.log(`Screenshot saved to: ${screenshotPath}`)
  
  await browser.close()
}

captureScreenshot().catch(console.error)
