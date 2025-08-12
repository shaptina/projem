import { test, expect } from '@playwright/test'

test('montaj oluşturma akışı', async ({ page }) => {
  await page.goto('/auth/dev')
  await page.goto('/assemblies/new')

  await page.getByLabel(/Toplam Oran/i).fill('3.16')
  await page.getByLabel(/Güç \(kW\)/i).fill('1')
  await page.getByRole('button', { name: /Gönder/i }).click()

  await expect(page).toHaveURL(/\/jobs\/\d+$/)
  await expect(page.getByText(/İş #/i)).toBeVisible()
})


