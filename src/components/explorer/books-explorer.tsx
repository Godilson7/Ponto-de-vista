'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'

import type { Book } from '@/lib/content'
import { Input, Select } from '@/components/ui/field'
import { BookCard } from '@/components/cards/book-card'

export function BooksExplorer({
  books,
  authors,
  countries,
  categories,
  temas,
}: {
  books: Book[]
  authors: string[]
  countries: string[]
  categories: string[]
  temas: string[]
}) {
  const [query, setQuery] = React.useState('')
  const [autor, setAutor] = React.useState('')
  const [pais, setPais] = React.useState('')
  const [categoria, setCategoria] = React.useState('')
  const [tema, setTema] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter((b) => {
      const matchesQuery =
        !q ||
        b.titulo.toLowerCase().includes(q) ||
        (b.subtitulo?.toLowerCase().includes(q) ?? false) ||
        b.autorNome.toLowerCase().includes(q)
      return (
        matchesQuery &&
        (!autor || b.autorNome === autor) &&
        (!pais || b.pais === pais) &&
        (!categoria || b.categoria === categoria) &&
        (!tema || b.temas.includes(tema))
      )
    })
  }, [books, query, autor, pais, categoria, tema])

  const hasFilters = Boolean(query || autor || pais || categoria || tema)

  return (
    <div>
      <div className="border border-border bg-paper-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            placeholder="Pesquisar por título ou autor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Pesquisar livros"
            className="pl-10"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Select value={autor} onChange={(e) => setAutor(e.target.value)} aria-label="Filtrar por autor">
            <option value="">Todos os autores</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Select value={pais} onChange={(e) => setPais(e.target.value)} aria-label="Filtrar por país">
            <option value="">Todos os países</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoria"
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={tema} onChange={(e) => setTema(e.target.value)} aria-label="Filtrar por tema">
            <option value="">Todos os temas</option>
            {temas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-small text-muted">
          {filtered.length} {filtered.length === 1 ? 'livro' : 'livros'}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setAutor('')
              setPais('')
              setCategoria('')
              setTema('')
            }}
            className="inline-flex items-center gap-1.5 text-label uppercase text-emerald hover:text-emerald-deep"
          >
            <X className="size-3.5" /> Limpar filtros
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-border bg-paper-card p-12 text-center">
          <p className="text-body text-ink-soft">Nenhum livro corresponde aos filtros.</p>
        </div>
      )}
    </div>
  )
}
