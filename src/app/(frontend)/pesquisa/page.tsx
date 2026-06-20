import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { searchBooks, searchAuthors } from '@/lib/content'
import { BookCard } from '@/components/cards/book-card'
import { AuthorCard } from '@/components/cards/author-card'

export const metadata: Metadata = buildMetadata({ title: 'Pesquisa', noIndex: true })
export const dynamic = 'force-dynamic'

export default async function PesquisaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const term = (q ?? '').trim()
  const [books, authors] = term
    ? await Promise.all([searchBooks(term), searchAuthors(term)])
    : [[], []]
  const total = books.length + authors.length

  return (
    <div className="mx-auto max-w-content px-6 py-12 lg:px-8">
      <p className="label mb-2 text-emerald">Pesquisa</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">
        {term ? <>Resultados para “{term}”</> : 'O que procura?'}
      </h1>
      {term ? (
        <p className="mt-2 text-muted">
          {total} {total === 1 ? 'resultado' : 'resultados'}
        </p>
      ) : (
        <p className="mt-2 text-muted">Use a barra de pesquisa para encontrar livros e autores.</p>
      )}

      {term && total === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-border bg-paper-card p-12 text-center">
          <p className="text-body text-ink-soft">
            Nada encontrado. Tente outro termo ou{' '}
            <Link href="/livros" className="text-emerald underline underline-offset-4">
              veja o catálogo
            </Link>
            .
          </p>
        </div>
      ) : null}

      {books.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-h3 font-semibold tracking-tightish text-ink">Livros</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {books.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>
        </section>
      ) : null}

      {authors.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-h3 font-semibold tracking-tightish text-ink">Autores</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((a) => (
              <AuthorCard
                key={a.slug}
                name={a.nome}
                positioning={a.fraseDePosicionamento}
                area={a.area}
                country={a.pais}
                city={a.cidade}
                imageUrl={a.fotoUrl}
                href={`/autores/${a.slug}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
