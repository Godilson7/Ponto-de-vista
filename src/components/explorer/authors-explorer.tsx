'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'

import { Input, Select } from '@/components/ui/field'
import { AuthorCard } from '@/components/cards/author-card'

export type ExplorerAuthor = {
  slug: string
  nome: string
  fraseDePosicionamento: string
  area: string
  pais: string
  cidade?: string
  fotoUrl?: string
  livros: string[]
  temas: string[]
}

export function AuthorsExplorer({
  authors,
  areas,
  countries,
  temas,
  livros,
}: {
  authors: ExplorerAuthor[]
  areas: string[]
  countries: string[]
  temas: string[]
  livros: string[]
}) {
  const [query, setQuery] = React.useState('')
  const [area, setArea] = React.useState('')
  const [pais, setPais] = React.useState('')
  const [tema, setTema] = React.useState('')
  const [livro, setLivro] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return authors.filter((a) => {
      const matchesQuery =
        !q ||
        a.nome.toLowerCase().includes(q) ||
        a.fraseDePosicionamento.toLowerCase().includes(q) ||
        a.area.toLowerCase().includes(q)
      return (
        matchesQuery &&
        (!area || a.area === area) &&
        (!pais || a.pais === pais) &&
        (!tema || a.temas.includes(tema)) &&
        (!livro || a.livros.includes(livro))
      )
    })
  }, [authors, query, area, pais, tema, livro])

  const hasFilters = Boolean(query || area || pais || tema || livro)

  return (
    <div>
      <div className="border border-border bg-paper-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            placeholder="Pesquisar por nome, área ou posicionamento…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Pesquisar autores"
            className="pl-10"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Filtrar por área">
            <option value="">Todas as áreas</option>
            {areas.map((a) => (
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
          <Select value={tema} onChange={(e) => setTema(e.target.value)} aria-label="Filtrar por tema">
            <option value="">Todos os temas</option>
            {temas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select value={livro} onChange={(e) => setLivro(e.target.value)} aria-label="Filtrar por livro">
            <option value="">Todos os livros</option>
            {livros.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-small text-muted">
          {filtered.length} {filtered.length === 1 ? 'autor' : 'autores'}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setArea('')
              setPais('')
              setTema('')
              setLivro('')
            }}
            className="inline-flex items-center gap-1.5 text-label uppercase text-emerald hover:text-emerald-deep"
          >
            <X className="size-3.5" /> Limpar filtros
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
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
      ) : (
        <div className="mt-6 border border-dashed border-border bg-paper-card p-12 text-center">
          <p className="text-body text-ink-soft">Nenhum autor corresponde aos filtros.</p>
        </div>
      )}
    </div>
  )
}
