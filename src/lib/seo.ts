import type { Metadata } from 'next'

import { siteConfig } from './site'
import type { Author, Book, BlogPost } from './content'

const baseUrl = siteConfig.url.replace(/\/$/, '')

export function absoluteUrl(path: string): string {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

type BuildMetadataArgs = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

/** Gera metadata consistente por rota (título, descrição, canónical, OG, Twitter). */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  noIndex = false,
}: BuildMetadataArgs = {}): Metadata {
  const url = `${baseUrl}${path}`
  const fullTitle = title ? `${title} · ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: 'pt_PT',
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

/** Dados estruturados da organização (Publisher) — usados no layout global. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Publisher'],
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: baseUrl,
    description: siteConfig.description,
    email: siteConfig.email,
    slogan: siteConfig.tagline,
    sameAs: siteConfig.social.map((s) => s.href),
    address: siteConfig.presence.map((p) => ({
      '@type': 'PostalAddress',
      addressLocality: p.city,
      addressCountry: p.country,
    })),
  }
}

/** Migalhas (BreadcrumbList) a partir de pares [nome, caminho]. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Person + ProfilePage para a página de autoridade do autor. */
export function authorJsonLd(author: Author) {
  const url = absoluteUrl(`/autores/${author.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: author.nome,
      description: author.miniBio,
      jobTitle: author.area,
      knowsAbout: author.areasDeAutoridade,
      address: {
        '@type': 'PostalAddress',
        addressLocality: author.cidade,
        addressCountry: author.pais,
      },
      sameAs: author.redesSociais.map((s) => s.url),
      url,
      worksFor: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
    },
  }
}

/** Book + autor + editora. */
export function bookJsonLd(book: Book, authorName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.titulo,
    ...(book.subtitulo ? { alternativeHeadline: book.subtitulo } : {}),
    description: book.sinopseCurta,
    inLanguage: 'pt',
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.numPaginas ? { numberOfPages: book.numPaginas } : {}),
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    url: absoluteUrl(`/livros/${book.slug}`),
    about: book.temas,
  }
}

/** BlogPosting para os artigos. */
export function blogPostingJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titulo,
    description: post.resumo,
    datePublished: post.publishedAt,
    inLanguage: 'pt',
    author: { '@type': 'Person', name: post.autorNome },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }
}
