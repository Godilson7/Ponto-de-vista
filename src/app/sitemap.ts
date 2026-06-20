import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/site'
import { getAuthors, getBooks, getPosts, getCategories } from '@/lib/content'

/**
 * Sitemap com as rotas estáticas + URLs dinâmicos de autores, livros, artigos
 * e categorias do blog (vindos da camada de conteúdo).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, '')
  const now = new Date()

  const [authors, books, posts, categories] = await Promise.all([
    getAuthors(),
    getBooks(),
    getPosts(),
    getCategories(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/a-editora`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/autores`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/livros`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/publicar`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const authorRoutes: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${base}/autores/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const bookRoutes: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${base}/livros/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/blog/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...authorRoutes, ...bookRoutes, ...categoryRoutes, ...postRoutes]
}
