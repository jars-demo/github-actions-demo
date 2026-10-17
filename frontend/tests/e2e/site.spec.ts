import { expect, test } from '@playwright/test'

test('home explains the workshop and starts it', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('CI/CD from zero')
  await expect(page.getByRole('figure')).toContainText('The pipeline you build')
  await expect(page.getByText('.github/workflows/ci.yml')).toBeVisible()

  await page.getByRole('link', { name: 'Start the workshop' }).click()
  await expect(page).toHaveURL(/\/workshop\/01-why-ci-cd$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Why CI/CD')
})

test('the workshop lists every chapter and pages through them', async ({ page }) => {
  await page.goto('/workshop')
  const chapters = page.locator('main ol > li')
  await expect(chapters).toHaveCount(12)

  await chapters.nth(4).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Matrix builds')
  await expect(page.getByRole('button', { name: 'Copy' }).first()).toBeVisible()

  await page.getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(/06-caching-and-artifacts$/)
})

test('nothing scrolls sideways', async ({ page }) => {
  for (const path of ['/', '/workshop', '/workshop/10-containers']) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('back to top appears after scrolling and returns to the top', async ({ page }) => {
  await page.goto('/workshop/12-secure-and-fast')
  const button = page.getByRole('button', { name: 'Back to top' })

  await page.evaluate(() => window.scrollTo(0, 3000))
  await expect(button).toBeVisible()
  await button.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
