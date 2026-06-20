import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadata, blogPostingJsonLd } from '@/lib/seo'
import {
  getPosts,
  getCategories,
  getCategoryBySlug,
  getPostBySlug,
  getPostsByCategory,
  formatDatePt,
} from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { PageHeader } from '@/components/sections/page-header'
import { Breadcrumbs } from '@/components/sections/breadcrumbs'
import { PostCard } from '@/components/cards/post-card'
import { JsonLd } from '@/components/seo/json-ld'
import { Button } from '@/components/ui/button'
import { RichText } from '@/components/rich-text'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 60

/**
 * Um único segmento dinâmico serve as duas formas do plano (/blog/[categoria]
 * e /blog/[slug]): primeiro tenta categoria, depois artigo.
 */
export async function generateStaticParams() {
  const [categories, posts] = await Promise.all([getCategories(), getPosts()])
  return [
    ...categories.map((c) => ({ slug: c.slug })),
    ...posts.map((p) => ({ slug: p.slug })),
  ]
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (category) {
    return buildMetadata({
      title: `${category.nome} · Blog`,
      description: `Artigos sobre ${category.nome.toLowerCase()} — Ponto de Vista Editora.`,
      path: `/blog/${slug}`,
    })
  }
  const post = await getPostBySlug(slug)
  if (post) {
    return buildMetadata({ title: post.titulo, description: post.resumo, path: `/blog/${slug}` })
  }
  return buildMetadata({ title: 'Não encontrado', noIndex: true })
}

function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: { slug: string; nome: string }[]
  activeSlug?: string
}) {
  const base =
    'inline-flex items-center rounded-sm border px-3 py-1.5 text-label uppercase transition-colors'
  const inactive = 'border-border text-ink hover:border-em hover:text-emerald'
  const active = 'border-emerald bg-emerald text-paper'
  return (
    <nav aria-label="Categorias do blog" className="flex flex-wrap gap-2">
      <Link href="/blog" className={`${base} ${inactive}`}>
        Todas
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/${c.slug}`}
          aria-current={c.slug === activeSlug ? 'page' : undefined}
          className={`${base} ${c.slug === activeSlug ? active : inactive}`}
        >
          {c.nome}
        </Link>
      ))}
    </nav>
  )
}

export default async function BlogSlugPage({ params }: Params) {
  const { slug } = await params

  // 1) Categoria
  const category = await getCategoryBySlug(slug)
  if (category) {
    const [posts, categories] = await Promise.all([
      getPostsByCategory(category.slug),
      getCategories(),
    ])
    return (
      <>
        <PageHeader kicker="Blog" title={category.nome} />
        <Section>
          <CategoryNav categories={categories} activeSlug={category.slug} />

          {posts.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard
                  key={p.slug}
                  title={p.titulo}
                  excerpt={p.resumo}
                  categoryName={category.nome}
                  categorySlug={category.slug}
                  author={p.autorNome}
                  date={formatDatePt(p.publishedAt)}
                  href={`/blog/${p.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 border border-dashed border-border bg-paper-card p-12 text-center">
              <p className="text-body text-ink-soft">Ainda não há artigos nesta categoria.</p>
            </div>
          )}
        </Section>
      </>
    )
  }

  // 2) Artigo
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post)} />
      <Breadcrumbs
        items={[
          { name: 'Início', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.titulo, path: `/blog/${post.slug}` },
        ]}
      />

      <Section>
        <Container className="max-w-prose px-0">
          {post.categoria ? (
            <Link
              href={`/blog/${post.categoria}`}
              className="label text-emerald transition-colors hover:text-emerald-deep"
            >
              {post.categoriaNome}
            </Link>
          ) : null}
          <h1 className="mt-4 text-h1 font-medium tracking-tightish text-ink">{post.titulo}</h1>
          <p className="mt-4 text-small text-muted">
            {post.autorNome} · {formatDatePt(post.publishedAt)}
          </p>
          <span className="gold-rule mt-8" aria-hidden="true" />

          <p className="mt-8 font-serif text-2xl italic leading-snug text-ink-soft">
            {post.resumo}
          </p>
          <RichText content={post.corpo} className="mt-5" />

          <div className="mt-12">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Voltar ao blog</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
