'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

import { formatEUR } from '@/lib/utils'
import type { Book } from '@/lib/content'
import { Button } from '@/components/ui/button'

// Banner dramático e SEMPRE escuro (independente do tema). Por isso o texto
// usa cores claras FIXAS (não os tokens paper/ink, que invertem no modo escuro).
const BANNER_BG = 'linear-gradient(120deg, #0e1c15 0%, #1b3d2c 52%, #0e1c15 100%)'
const LIGHT = '#F3EEE4'

export function BookCarousel({ books }: { books: Book[] }) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const n = books.length

  React.useEffect(() => {
    if (paused || n <= 1) return
    const t = setInterval(() => setIndex((p) => (p + 1) % n), 6000)
    return () => clearInterval(t)
  }, [paused, n])

  if (n === 0) return null
  const go = (delta: number) => setIndex((p) => (p + delta + n) % n)
  const book = books[index]
  const hasPromo =
    book.precoPromocional != null && book.preco != null && book.precoPromocional < book.preco
  const price = hasPromo ? book.precoPromocional! : book.preco

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Livros em destaque"
      className="relative overflow-hidden border-b border-border"
      style={{ background: BANNER_BG, color: LIGHT }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-content items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20 lg:px-8">
        <div className="order-2 md:order-1">
          <p className="label text-gold">Exclusivo · Ponto de Vista</p>
          <h2
            key={`t-${book.slug}`}
            className="mt-4 animate-fade-up text-h1 font-medium tracking-tightish"
            style={{ color: LIGHT }}
          >
            {book.titulo}
          </h2>
          {book.autorNome ? (
            <p
              key={`a-${book.slug}`}
              className="mt-3 animate-fade-up font-serif text-2xl italic"
              style={{ color: 'rgba(243,238,228,0.85)' }}
            >
              {book.autorNome}
            </p>
          ) : null}
          {book.sinopseCurta ? (
            <p
              className="mt-5 line-clamp-3 max-w-prose"
              style={{ color: 'rgba(243,238,228,0.72)' }}
            >
              {book.sinopseCurta}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Button asChild size="lg">
              <Link href={`/livros/${book.slug}`}>Ver livro</Link>
            </Button>
            {price != null ? (
              <span className="flex items-baseline gap-2">
                {hasPromo ? (
                  <span className="line-through" style={{ color: 'rgba(243,238,228,0.5)' }}>
                    {formatEUR(book.preco!)}
                  </span>
                ) : null}
                <span className="text-2xl font-semibold" style={{ color: LIGHT }}>
                  {formatEUR(price)}
                </span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <Link
            href={`/livros/${book.slug}`}
            key={`c-${book.slug}`}
            className="relative aspect-[3/4] w-44 animate-fade-up overflow-hidden rounded-md shadow-lift ring-1 ring-gold/40 sm:w-52 md:w-64"
          >
            {book.capaUrl ? (
              <Image
                src={book.capaUrl}
                alt={`Capa de ${book.titulo}`}
                fill
                sizes="256px"
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-5 p-6 text-center"
                style={{ background: '#163b2c', color: LIGHT }}
              >
                <BookOpen className="size-9" style={{ color: 'rgba(243,238,228,0.55)' }} aria-hidden />
                <span className="gold-rule" aria-hidden="true" />
                <span
                  className="text-label uppercase tracking-[0.22em]"
                  style={{ color: 'rgba(243,238,228,0.65)' }}
                >
                  Ponto de Vista
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Controlos */}
      {n > 1 ? (
        <>
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
            <CarouselButton label="Anterior" onClick={() => go(-1)}>
              <ChevronLeft className="size-5" />
            </CarouselButton>
            <CarouselButton
              label={paused ? 'Retomar' : 'Pausar'}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </CarouselButton>
            <CarouselButton label="Seguinte" onClick={() => go(1)}>
              <ChevronRight className="size-5" />
            </CarouselButton>
          </div>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {books.map((b, idx) => (
              <button
                key={b.slug}
                type="button"
                onClick={() => setIndex(idx)}
                aria-label={`Ir para o destaque ${idx + 1}`}
                aria-current={idx === index}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: idx === index ? 24 : 6,
                  backgroundColor: idx === index ? LIGHT : 'rgba(243,238,228,0.4)',
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full backdrop-blur transition-colors hover:brightness-125"
      style={{ backgroundColor: 'rgba(243,238,228,0.16)', color: '#F3EEE4' }}
    >
      {children}
    </button>
  )
}
