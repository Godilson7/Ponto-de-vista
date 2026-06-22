'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pause,
  Play,
} from 'lucide-react'

import { formatEUR } from '@/lib/utils'
import type { Highlight } from '@/lib/content'
import { Button } from '@/components/ui/button'

// Banner dramático e SEMPRE escuro (independente do tema) — cores claras fixas.
const BANNER_BG = 'linear-gradient(120deg, #0e1c15 0%, #1b3d2c 52%, #0e1c15 100%)'
const LIGHT = '#F3EEE4'

const ICONS = {
  evento: CalendarDays,
  desconto: BookOpen,
  livro: BookOpen,
  artigo: FileText,
} as const

export function HighlightsCarousel({ items }: { items: Highlight[] }) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const n = items.length

  React.useEffect(() => {
    if (paused || n <= 1) return
    const t = setInterval(() => setIndex((p) => (p + 1) % n), 6000)
    return () => clearInterval(t)
  }, [paused, n])

  if (n === 0) return null
  const go = (delta: number) => setIndex((p) => (p + delta + n) % n)
  const item = items[index]
  const Icon = ICONS[item.kind]
  const hasPromo =
    item.precoPromocional != null && item.preco != null && item.precoPromocional < item.preco
  const price = hasPromo ? item.precoPromocional! : item.preco

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques da editora"
      className="relative overflow-hidden border-b border-border"
      style={{ background: BANNER_BG, color: LIGHT }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-content items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20 lg:px-8">
        <div className="order-2 md:order-1">
          <p className="label text-gold">{item.kicker}</p>
          <h2
            key={`t-${index}`}
            className="mt-4 animate-fade-up text-h1 font-medium tracking-tightish"
            style={{ color: LIGHT }}
          >
            {item.titulo}
          </h2>
          {item.subtitulo ? (
            <p
              key={`s-${index}`}
              className="mt-4 line-clamp-3 max-w-prose animate-fade-up"
              style={{ color: 'rgba(243,238,228,0.74)' }}
            >
              {item.subtitulo}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Button asChild size="lg">
              <Link href={item.href}>{item.cta}</Link>
            </Button>
            {price != null ? (
              <span className="flex items-baseline gap-2">
                {hasPromo ? (
                  <span className="line-through" style={{ color: 'rgba(243,238,228,0.5)' }}>
                    {formatEUR(item.preco!)}
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
            href={item.href}
            key={`c-${index}`}
            className="relative aspect-[3/4] w-44 animate-fade-up overflow-hidden rounded-md shadow-lift ring-1 ring-gold/40 sm:w-52 md:w-64"
          >
            {item.capaUrl ? (
              <Image
                src={item.capaUrl}
                alt={item.titulo}
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
                <Icon className="size-9" style={{ color: 'rgba(243,238,228,0.55)' }} aria-hidden />
                <span className="gold-rule" aria-hidden="true" />
                <span
                  className="text-label uppercase tracking-[0.22em]"
                  style={{ color: 'rgba(243,238,228,0.65)' }}
                >
                  {item.kicker}
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>

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
            {items.map((it, idx) => (
              <button
                key={`${it.kind}-${idx}`}
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
