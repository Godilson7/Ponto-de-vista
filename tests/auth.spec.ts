import { test, expect } from '@playwright/test'

test.describe('Acesso sem sessão', () => {
  test('/admin redireciona para /entrar', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/entrar/)
  })

  test('/conta mostra a página de conta (sem redirecionar)', async ({ page }) => {
    await page.goto('/conta')
    await expect(page).toHaveURL(/\/conta/)
    await expect(page.getByRole('link', { name: /entrar/i }).first()).toBeVisible()
  })

  test('o cesto exige sessão', async ({ page }) => {
    const res = await page.goto('/carrinho')
    expect(res?.status()).toBeLessThan(400)
  })
})
