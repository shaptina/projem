import { test, expect } from '@playwright/test'

test('jobs → detay → modal akışları', async ({ page }) => {
  await page.goto('/auth/dev')
  await page.goto('/jobs')

  await page.getByRole('link', { name: /Detaya git/i }).first().click()
  await expect(page.getByText(/İş #/i)).toBeVisible()

  const camBtn = page.getByRole('button', { name: /CAM Başlat/i })
  if (await camBtn.isVisible().catch(() => false)) {
    await camBtn.click()
    await expect(page.getByText(/Post-Processor/i)).toBeVisible()
    await page.getByRole('button', { name: /İptal/i }).click()
  }
})


