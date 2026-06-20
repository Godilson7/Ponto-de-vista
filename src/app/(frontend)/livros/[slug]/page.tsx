import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import { buildMetadata, bookJsonLd } from '@/lib/seo'
import {
  getBooks,
  getBookBySlug,
  getAuthorBySlug,
  getRelatedBooks,
  getBuyUrl,
} from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { BookCard } from '@/components/cards/book-card'
import { Breadcrumbs } from '@/components/sections/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { RichText } from '@/components/rich-text'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const books = await getBooks()
  return books.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return buildMetadata({ title: 'Livro não encontrado', noIndex: true })
  return buildMetadata({
    title: book.titulo,
    description: book.sinopseCurta,
    path: `/livros/${slug}`,
  })
}

function MetaRow({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
      <dt className="label text-muted">{label}</dt>
      <dd className="text-small text-ink">{value}</dd>
    </div>
  )
}

export default async function LivroPage({ params }: Params) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  const author = book.autorSlug ? await getAuthorBySlug(book.autorSlug) : null
  const related = await getRelatedBooks(book)
  const buyUrl = getBuyUrl(book)

  return (
    <>
      <JsonLd data={bookJsonLd(book, author?.nome ?? '')} />
      <Breadcrumbs
        items={[
          { name: 'Início', path: '/' },
          { name: 'Livros', path: '/livros' },
          { name: book.titulo, path: `/livros/${book.slug}` },
        ]}
      />

      {/* Cabeçalho do livro */}
      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="relative aspect-[3/4] overflow-hidden border border-border bg-emerald">
              {book.capaUrl ? (
                <Image
                  src={book.capaUrl}
                  alt={`Capa de ${book.titulo}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-between p-8 text-paper">
                  <span className="gold-rule" aria-hidden="true" />
                  <span className="font-serif text-3xl italic leading-tight">{book.titulo}</span>
                  {author ? (
                    <span className="text-label uppercase text-paper/70">{author.nome}</span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="label mb-4 text-emerald">{book.categoria}</p>
            <h1 className="text-h1 font-medium tracking-tightish text-ink md:text-display">
              {book.titulo}
            </h1>
            {book.subtitulo ? (
              <p className="mt-3 font-serif text-2xl italic text-ink-soft">{book.subtitulo}</p>
            ) : null}
            {author ? (
              <p className="mt-4 text-body text-ink-soft">
                de{' '}
                <Link
                  href={`/autores/${author.slug}`}
                  className="text-emerald underline-offset-4 hover:underline"
                >
                  {author.nome}
                </Link>
              </p>
            ) : null}

            <span className="gold-rule mt-6" aria-hidden="true" />
            <p className="mt-6 max-w-2xl text-body text-ink-soft">{book.sinopseCurta}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Tag variant="country">{book.pais}</Tag>
              {book.temas.map((t) => (
                <Tag key={t} variant="area">
                  {t}
                </Tag>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {buyUrl ? (
                <Button asChild size="lg">
                  <a href={buyUrl} target="_blank" rel="noopener noreferrer">
                    Comprar
                  </a>
                </Button>
              ) : null}
              {author ? (
                <Button asChild size="lg" variant="outline">
                  <Link href={`/autores/${author.slug}`}>Ver perfil do autor</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Section>

      {/* Sinopse + ficha técnica */}
      <Section muted>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <SectionHeading kicker="Sobre o livro" title="Sinopse" />
            <RichText content={book.sinopseCompleta} className="mt-6" />
          </div>
          <div className="md:col-span-4">
            <p className="label mb-4 text-emerald">Ficha técnica</p>
            <dl>
              <MetaRow label="Autor" value={author?.nome} />
              <MetaRow label="ISBN" value={book.isbn} />
              <MetaRow label="Páginas" value={book.numPaginas} />
              <MetaRow label="Formato" value={book.formato} />
              <MetaRow label="Categoria" value={book.categoria} />
              <MetaRow label="País" value={book.pais} />
            </dl>
            {book.publicoIndicado ? (
              <div className="mt-6">
                <p className="label mb-2 text-muted">Público indicado</p>
                <p className="text-small text-ink-soft">{book.publicoIndicado}</p>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Sobre o autor */}
      {author ? (
        <Section>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionHeading kicker="O autor" title={author.nome} />
            </div>
            <div className="md:col-span-8">
              <p className="font-serif text-2xl italic leading-snug text-ink-soft">
                {author.fraseDePosicionamento}
              </p>
              <p className="prose-editorial mt-6 max-w-none">{author.miniBio}</p>
              <Button asChild variant="link" className="mt-6">
                <Link href={`/autores/${author.slug}`}>
                  Ver página de autoridade <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Depoimentos */}
      {book.depoimentos.length > 0 ? (
        <Section muted>
          <SectionHeading kicker="Críticas" title="Depoimentos" />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {book.depoimentos.map((d, i) => (
              <figure key={i} className="border-l-2 border-gold pl-6">
                <blockquote className="font-serif text-xl italic leading-relaxed text-ink-soft">
                  “{d.texto}”
                </blockquote>
                <figcaption className="label mt-4 text-muted">{d.autor}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Fotos do lançamento */}
      {book.fotosLancamento.length > 0 ? (
        <Section>
          <SectionHeading kicker="Evento" title="Fotos do lançamento" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {book.fotosLancamento.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden border border-border bg-emerald/5"
              >
                <Image
                  src={src}
                  alt={`Lançamento de ${book.titulo} — imagem ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Relacionados */}
      {related.length > 0 ? (
        <Section>
          <SectionHeading kicker="Continuar a ler" title="Livros relacionados" />
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  )
}
