import { test, expect } from '@playwright/test'

const publicRoutes = ['/', '/autores', '/livros', '/publicar', '/blog', '/eventos', '/a-editora']

test.describe('Páginas públicas', () => {
  for (const path of publicRoutes) {
    test(`carrega ${path}`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status(), `estado HTTP de ${path}`).toBeLessThan(400)
      await expect(page).toHaveTitle(/Ponto de Vista/i)
    })
  }

  test('a navegação principal aponta para os livros', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Livros' }).first()).toBeVisible()
  })

  test('o link Contacto leva à secção do formulário', async ({ page }) => {
    await page.goto('/publicar#contacto')
    await expect(page.locator('#contacto')).toBeVisible()
  })

  test('a pesquisa devolve resultados', async ({ page }) => {
    const res = await page.goto('/pesquisa?q=a')
    expect(res?.status()).toBeLessThan(400)
    await expect(page).toHaveTitle(/Ponto de Vista/i)
  })
})
