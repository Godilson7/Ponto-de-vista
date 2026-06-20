import * as React from 'react'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getAuthors, getBooks, distinct } from '@/lib/content'
import { PageHeader } from '@/components/sections/page-header'
import { Section } from '@/components/ui/section'
import { AuthorsExplorer } from '@/components/explorer/authors-explorer'

export const metadata: Metadata = buildMetadata({
  title: 'Autores',
  description:
    'O conselho da Ponto de Vista Editora: autores de Portugal, Brasil e África Lusófona, cada um uma referência na sua área de autoridade.',
  path: '/autores',
})

export const revalidate = 60

export default async function AutoresPage() {
  const [all, books] = await Promise.all([getAuthors(), getBooks()])
  const authors = all.map((a) => {
    const myBooks = books.filter((b) => b.autorSlug === a.slug)
    return {
      slug: a.slug,
      nome: a.nome,
      fraseDePosicionamento: a.fraseDePosicionamento,
      area: a.area,
      pais: a.pais,
      cidade: a.cidade,
      fotoUrl: a.fotoUrl,
      livros: myBooks.map((b) => b.titulo),
      temas: distinct(myBooks.flatMap((b) => b.temas)),
    }
  })
  const areas = distinct(all.map((a) => a.area))
  const countries = distinct(all.map((a) => a.pais))
  const temas = distinct(books.flatMap((b) => b.temas))
  const livros = distinct(books.map((b) => b.titulo))

  return (
    <>
      <PageHeader
        kicker="O conselho"
        title="Autores"
        lead="Cada autor é uma voz com área de autoridade própria. Conheça quem publica connosco."
      />
      <Section>
        <AuthorsExplorer
          authors={authors}
          areas={areas}
          countries={countries}
          temas={temas}
          livros={livros}
        />
      </Section>
    </>
  )
}
