import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test.describe('PNG export @export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for fonts to be loaded
    await page.waitForFunction(async () => {
      await document.fonts.ready
      const notoSansReady = document.fonts.check('16px "Noto Sans JP"')
      const mPlusRoundedReady = document.fonts.check('16px "M PLUS Rounded 1c"')
      return notoSansReady && mPlusRoundedReady
    }, { timeout: 5000 })
  })

  test('download button generates correct PNG for 16:9 ratio', async ({ page }) => {
    // Set ratio to 16:9
    await page.getByTestId('ratio-select').getByText('16:9').click()
    
    // Set some text
    await page.getByTestId('text-input').fill('Test Export 16:9')
    
    // Wait for any overflow warning to clear
    await page.waitForTimeout(500)
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download')
    
    // Click download button
    await page.getByTestId('download-button').click()
    
    // Wait for download
    const download = await downloadPromise
    
    // Verify filename format: thumbnail-{width}x{height}.png
    const suggestedFilename = download.suggestedFilename()
    expect(suggestedFilename).toMatch(/^thumbnail-1600x900\.png$/)
    
    // Save and verify the file
    const downloadPath = path.join(__dirname, '..', '..', 'test-downloads')
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true })
    }
    const filePath = path.join(downloadPath, suggestedFilename)
    await download.saveAs(filePath)
    
    // Verify file exists and has content
    expect(fs.existsSync(filePath)).toBe(true)
    const stats = fs.statSync(filePath)
    expect(stats.size).toBeGreaterThan(0)
    
    // Clean up
    fs.unlinkSync(filePath)
  })

  test('download button generates correct PNG for 5:2 ratio', async ({ page }) => {
    // Set ratio to 5:2
    await page.getByTestId('ratio-select').getByText('5:2').click()
    
    // Set some text
    await page.getByTestId('text-input').fill('Test Export 5:2')
    
    // Wait for any overflow warning to clear
    await page.waitForTimeout(500)
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download')
    
    // Click download button
    await page.getByTestId('download-button').click()
    
    // Wait for download
    const download = await downloadPromise
    
    // Verify filename format: thumbnail-{width}x{height}.png
    const suggestedFilename = download.suggestedFilename()
    expect(suggestedFilename).toMatch(/^thumbnail-1500x600\.png$/)
    
    // Save and verify the file
    const downloadPath = path.join(__dirname, '..', '..', 'test-downloads')
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true })
    }
    const filePath = path.join(downloadPath, suggestedFilename)
    await download.saveAs(filePath)
    
    // Verify file exists and has content
    expect(fs.existsSync(filePath)).toBe(true)
    const stats = fs.statSync(filePath)
    expect(stats.size).toBeGreaterThan(0)
    
    // Clean up
    fs.unlinkSync(filePath)
  })

  test('download button generates correct PNG for 1:1 ratio', async ({ page }) => {
    // Set ratio to 1:1
    await page.getByTestId('ratio-select').getByText('1:1').click()
    
    // Set some text
    await page.getByTestId('text-input').fill('Test Export 1:1')
    
    // Wait for any overflow warning to clear
    await page.waitForTimeout(500)
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download')
    
    // Click download button
    await page.getByTestId('download-button').click()
    
    // Wait for download
    const download = await downloadPromise
    
    // Verify filename format: thumbnail-{width}x{height}.png
    const suggestedFilename = download.suggestedFilename()
    expect(suggestedFilename).toMatch(/^thumbnail-1200x1200\.png$/)
    
    // Save and verify the file
    const downloadPath = path.join(__dirname, '..', '..', 'test-downloads')
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true })
    }
    const filePath = path.join(downloadPath, suggestedFilename)
    await download.saveAs(filePath)
    
    // Verify file exists and has content
    expect(fs.existsSync(filePath)).toBe(true)
    const stats = fs.statSync(filePath)
    expect(stats.size).toBeGreaterThan(0)
    
    // Clean up
    fs.unlinkSync(filePath)
  })

  test('export is disabled when text overflows', async ({ page }) => {
    // Set a very long text that will overflow
    await page.getByTestId('text-input').fill('A'.repeat(500))

    // Wait for overflow warning to appear
    await page.waitForSelector('[data-testid="overflow-warning"]', { timeout: 5000 })

    // Check that download button is disabled
    const downloadButton = page.getByTestId('download-button')
    await expect(downloadButton).toBeDisabled()
  })

  test('export is enabled when text does not overflow', async ({ page }) => {
    // Set normal text
    await page.getByTestId('text-input').fill('Normal text')

    // Wait for canvas to be ready and check button is enabled
    await page.waitForSelector('[data-testid="download-button"]:enabled', { timeout: 5000 })

    // Check that download button is enabled
    const downloadButton = page.getByTestId('download-button')
    await expect(downloadButton).toBeEnabled()
  })
})
