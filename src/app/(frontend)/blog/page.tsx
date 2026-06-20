import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getPosts, getCategories, formatDatePt } from '@/lib/content'
import { PageHeader } from '@/components/sections/page-header'
import { Section } from '@/components/ui/section'
import { PostCard } from '@/components/cards/post-card'

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description:
    'Ideias sobre autoria, escrita, mercado editorial e posicionamento de autoridade — pela Ponto de Vista Editora.',
  path: '/blog',
})

export const revalidate = 60

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()])

  return (
    <>
      <PageHeader
        kicker="Ideias"
        title="Blog"
        lead="Autoria, escrita, mercado editorial e o trabalho de construir autoridade."
      />

      <Section>
        {/* Navegação por categorias */}
        <nav aria-label="Categorias do blog" className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-sm border border-emerald bg-emerald px-3 py-1.5 text-label uppercase text-paper">
            Todas
          </span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/${c.slug}`}
              className="inline-flex items-center rounded-sm border border-border px-3 py-1.5 text-label uppercase text-ink transition-colors hover:border-em hover:text-emerald"
            >
              {c.nome}
            </Link>
          ))}
        </nav>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard
              key={p.slug}
              title={p.titulo}
              excerpt={p.resumo}
              categoryName={p.categoriaNome}
              categorySlug={p.categoria}
              author={p.autorNome}
              date={formatDatePt(p.publishedAt)}
              href={`/blog/${p.slug}`}
            />
          ))}
        </div>
      </Section>
    </>
  )
}
