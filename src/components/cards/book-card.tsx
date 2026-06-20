'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'

import { cn, formatEUR } from '@/lib/utils'
import type { Book } from '@/lib/content'
import { useCommerce } from '@/components/commerce/commerce-provider'

/** Cartão de livro compacto, estilo livraria (capa, preço, ações). */
export function BookCard({ book, className }: { book: Book; className?: string }) {
  const { inWishlist, inCart, toggleWishlist, toggleCart } = useCommerce()
  const href = `/livros/${book.slug}`
  const hasPrice = book.preco != null
  const hasPromo =
    book.precoPromocional != null && book.preco != null && book.precoPromocional < book.preco
  const desconto = hasPromo ? Math.round((1 - book.precoPromocional! / book.preco!) * 100) : 0
  const fav = inWishlist(book.id)
  const carted = inCart(book.id)

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative">
        <Link
          href={href}
          aria-label={book.titulo}
          className="block overflow-hidden rounded-md border border-border bg-emerald shadow-card transition-shadow duration-300 group-hover:shadow-lift"
        >
          <div className="relative aspect-[3/4]">
            {book.capaUrl ? (
              <Image
                src={book.capaUrl}
                alt={`Capa de ${book.titulo}`}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full flex-col justify-between p-4 text-paper">
                <span className="gold-rule" aria-hidden="true" />
                <span className="font-serif text-lg italic leading-tight">{book.titulo}</span>
                {book.autorNome ? (
                  <span className="text-label uppercase text-paper/70">{book.autorNome}</span>
                ) : null}
              </div>
            )}
          </div>
        </Link>

        {hasPromo ? (
          <span className="absolute bottom-2 left-2 flex size-11 items-center justify-center rounded-full bg-emerald text-small font-semibold text-paper shadow-card">
            -{desconto}%
          </span>
        ) : null}

        {/* Ações — aparecem no hover; só funcionam com sessão (gerido no provider) */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleWishlist(book.id)}
            aria-pressed={fav}
            aria-label={fav ? 'Remover da lista' : 'Adicionar à lista'}
            className={cn(
              'flex size-9 items-center justify-center rounded-full bg-paper/95 text-ink shadow-card transition-colors hover:text-emerald',
              fav && 'text-emerald',
            )}
          >
            <Heart className={cn('size-4', fav && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={() => toggleCart(book.id)}
            aria-pressed={carted}
            aria-label={carted ? 'Remover do cesto' : 'Adicionar ao cesto'}
            className={cn(
              'flex size-9 items-center justify-center rounded-full shadow-card transition-colors',
              carted ? 'bg-emerald text-paper' : 'bg-paper/95 text-ink hover:text-emerald',
            )}
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        {book.portesGratis ? (
          <span className="text-label uppercase text-emerald">Portes grátis</span>
        ) : null}
        <h3 className="mt-1 line-clamp-2 font-sans text-small font-medium leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-emerald">
            {book.titulo}
          </Link>
        </h3>
        {book.autorNome ? (
          <p className="mt-0.5 line-clamp-1 text-small text-muted">{book.autorNome}</p>
        ) : null}
        {hasPrice ? (
          <div className="mt-2 flex items-baseline gap-2">
            {hasPromo ? (
              <span className="text-small text-muted line-through">{formatEUR(book.preco!)}</span>
            ) : null}
            <span className="text-base font-semibold text-emerald">
              {formatEUR(hasPromo ? book.precoPromocional! : book.preco!)}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}
