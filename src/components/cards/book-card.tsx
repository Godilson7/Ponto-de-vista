'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'

import { cn, formatEUR } from '@/lib/utils'
import type { Book } from '@/lib/content'
import { useCommerce } from '@/components/commerce/commerce-provider'

/**
 * Cartão de livro — versão editorial premium.
 * Capa em destaque que se eleva suavemente no hover, título em serif (Fraunces),
 * categoria como eyebrow e preço tratado com elegância. Mantém cesto/lista.
 */
export function BookCard({ book, className }: { book: Book; className?: string }) {
  const { inWishlist, inCart, toggleWishlist, toggleCart } = useCommerce()
  const href = `/livros/${book.slug}`
  const hasPrice = book.preco != null
  const hasPromo =
    book.precoPromocional != null && book.preco != null && book.precoPromocional < book.preco
  const desconto = hasPromo ? Math.round((1 - book.precoPromocional! / book.preco!) * 100) : 0
  const eyebrow = book.temas?.[0] || (book.portesGratis ? 'Portes grátis' : null)
  const fav = inWishlist(book.id)
  const carted = inCart(book.id)

  return (
    <article className={cn('group relative flex flex-col', className)}>
      {/* Capa — eleva-se no hover (transform, não empurra a grelha) */}
      <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
        <Link
          href={href}
          aria-label={book.titulo}
          className="relative block aspect-[3/4] overflow-hidden rounded-lg border border-border bg-emerald shadow-card transition-shadow duration-500 group-hover:shadow-lift"
        >
          {book.capaUrl ? (
            <Image
              src={book.capaUrl}
              alt={`Capa de ${book.titulo}`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between p-5 text-paper">
              <span className="gold-rule" aria-hidden="true" />
              <span className="font-serif text-xl italic leading-tight">{book.titulo}</span>
              {book.autorNome ? (
                <span className="text-label uppercase tracking-wide text-paper/70">
                  {book.autorNome}
                </span>
              ) : null}
            </div>
          )}
        </Link>

        {hasPromo ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald px-2.5 py-1 text-label font-semibold uppercase tracking-wide text-paper shadow-card">
            −{desconto}%
          </span>
        ) : null}

        {/* Ações — deslizam ao surgir no hover; só funcionam com sessão (provider) */}
        <div className="absolute right-3 top-3 flex translate-y-[-6px] flex-col gap-2 opacity-0 transition-all duration-300 focus-within:translate-y-0 focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleWishlist(book.id)}
            aria-pressed={fav}
            aria-label={fav ? 'Remover da lista' : 'Adicionar à lista'}
            className={cn(
              'flex size-10 items-center justify-center rounded-full bg-paper/95 text-ink shadow-lift transition-colors hover:text-emerald',
              fav && 'text-emerald',
            )}
          >
            <Heart className={cn('size-[1.05rem]', fav && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={() => toggleCart(book.id)}
            aria-pressed={carted}
            aria-label={carted ? 'Remover do cesto' : 'Adicionar ao cesto'}
            className={cn(
              'flex size-10 items-center justify-center rounded-full shadow-lift transition-colors',
              carted ? 'bg-emerald text-paper' : 'bg-paper/95 text-ink hover:text-emerald',
            )}
          >
            <ShoppingBag className="size-[1.05rem]" />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-1 flex-col">
        {eyebrow ? (
          <span className="text-label uppercase tracking-[0.14em] text-emerald">{eyebrow}</span>
        ) : null}
        <h3 className="mt-1.5 line-clamp-2 font-serif text-lg font-medium leading-snug tracking-tightish text-ink">
          <Link href={href} className="transition-colors hover:text-emerald">
            {book.titulo}
          </Link>
        </h3>
        {book.autorNome ? (
          <p className="mt-1 line-clamp-1 text-small text-muted">{book.autorNome}</p>
        ) : null}
        {hasPrice ? (
          <div className="mt-2.5 flex items-baseline gap-2">
            {hasPromo ? (
              <span className="text-small text-muted line-through">{formatEUR(book.preco!)}</span>
            ) : null}
            <span className="font-serif text-lg font-semibold text-emerald">
              {formatEUR(hasPromo ? book.precoPromocional! : book.preco!)}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}
