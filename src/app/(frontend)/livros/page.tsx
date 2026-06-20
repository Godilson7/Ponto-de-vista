import * as React from 'react'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getBooks, distinct } from '@/lib/content'
import { PageHeader } from '@/components/sections/page-header'
import { Section } from '@/components/ui/section'
import { BooksExplorer } from '@/components/explorer/books-explorer'

export const metadata: Metadata = buildMetadata({
  title: 'Livros',
  description:
    'O catálogo da Ponto de Vista Editora — obras de autores de Portugal, Brasil e África Lusófona.',
  path: '/livros',
})

export const revalidate = 60

export default async function LivrosPage() {
  const books = await getBooks()

  const authors = distinct(books.map((b) => b.autorNome))
  const categories = distinct(books.map((b) => b.categoria))
  const temas = distinct(books.flatMap((b) => b.temas))
  const countries = distinct(books.map((b) => b.pais))

  return (
    <>
      <PageHeader
        kicker="Catálogo"
        title="Livros"
        lead="Obras que cruzam autoria e autoridade, da língua portuguesa para o mundo."
      />
      <Section>
        <BooksExplorer
          books={books}
          authors={authors}
          countries={countries}
          categories={categories}
          temas={temas}
        />
      </Section>
    </>
  )
}
