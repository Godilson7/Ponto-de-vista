import * as React from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CalendarDays,
  Feather,
  Landmark,
  Library,
  Newspaper,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

const DARK_BG = 'linear-gradient(120deg, #0e1c15 0%, #1b3d2c 52%, #0e1c15 100%)'
const LIGHT = '#F3EEE4'

type Cta = { label: string; href: string }

export type HeroVariant =
  | 'home'
  | 'a-editora'
  | 'autores'
  | 'livros'
  | 'blog'
  | 'publicar'
  | 'eventos'

// Identidade visual por página: um ícone emblemático + tom + cor de acento.
const VARIANTS: Record<
  HeroVariant,
  { icon: LucideIcon; tone: 'paper' | 'dark'; accent: 'emerald' | 'gold' }
> = {
  home: { icon: BookOpen, tone: 'dark', accent: 'gold' },
  'a-editora': { icon: Landmark, tone: 'paper', accent: 'emerald' },
  autores: { icon: Users, tone: 'paper', accent: 'emerald' },
  livros: { icon: Library, tone: 'paper', accent: 'emerald' },
  blog: { icon: Newspaper, tone: 'paper', accent: 'gold' },
  publicar: { icon: Feather, tone: 'dark', accent: 'gold' },
  eventos: { icon: CalendarDays, tone: 'paper', accent: 'emerald' },
}

export type PageHeroProps = {
  variant: HeroVariant
  kicker?: string
  title: React.ReactNode
  lead?: React.ReactNode
  cta?: Cta
  ctaSecondary?: Cta
}

/**
 * Cabeçalho de página com CTA e um emblema editorial à direita — um único ícone
 * temático numa "chapa" com filete dourado e marca-de-água subtil (sóbrio, imóvel).
 * Cada `variant` traz a sua identidade (ícone, tom claro/escuro, cor de acento).
 */
export function PageHero({ variant, kicker, title, lead, cta, ctaSecondary }: PageHeroProps) {
  const { icon: Icon, tone, accent } = VARIANTS[variant]
  const dark = tone === 'dark'
  const iconColor = accent === 'gold' ? 'text-gold' : 'text-emerald'

  return (
    <section
      className={cn('relative overflow-hidden border-b border-border', !dark && 'bg-paper-card')}
      style={dark ? { background: DARK_BG, color: LIGHT } : undefined}
    >
      <Container className="grid items-center gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:py-20">
        <div>
          {kicker ? (
            <p className={cn('label', dark ? 'text-gold' : 'text-emerald')}>{kicker}</p>
          ) : null}
          <h1
            className="mt-4 animate-fade-up text-h1 font-medium tracking-tightish md:text-display"
            style={dark ? { color: LIGHT } : undefined}
          >
            {title}
          </h1>
          <span className="gold-rule mt-7" aria-hidden="true" />
          {lead ? (
            <p
              className={cn(
                'mt-7 max-w-prose animate-fade-up font-serif text-lg leading-relaxed',
                !dark && 'text-ink-soft',
              )}
              style={dark ? { color: 'rgba(243,238,228,0.74)' } : undefined}
            >
              {lead}
            </p>
          ) : null}
          {cta || ctaSecondary ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {cta ? (
                <Button asChild variant={dark ? 'gold' : 'solid'} size="lg">
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ) : null}
              {ctaSecondary ? (
                dark ? (
                  <Link
                    href={ctaSecondary.href}
                    className="inline-flex h-12 items-center justify-center rounded-sm border px-8 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:brightness-125"
                    style={{ borderColor: 'rgba(243,238,228,0.35)', color: LIGHT }}
                  >
                    {ctaSecondary.label}
                  </Link>
                ) : (
                  <Button asChild variant="outline" size="lg">
                    <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
                  </Button>
                )
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Emblema editorial — ícone único numa "chapa" com filete dourado */}
        <div
          className="relative hidden min-h-[260px] items-center justify-center md:flex"
          aria-hidden="true"
        >
          <div
            className="relative flex aspect-square w-full max-w-[320px] animate-fade-up items-center justify-center overflow-hidden rounded-2xl border shadow-card"
            style={{
              borderColor: dark ? 'rgba(200,171,104,0.30)' : 'rgba(176,147,74,0.32)',
              background: dark ? 'rgba(243,238,228,0.04)' : 'rgb(var(--paper))',
            }}
          >
            {/* filete interno */}
            <span
              className="absolute inset-6 rounded-xl border"
              style={{ borderColor: dark ? 'rgba(200,171,104,0.14)' : 'rgba(21,20,15,0.07)' }}
            />
            {/* marca-de-água (ícone oversized, muito subtil) */}
            <Icon
              className={cn('absolute', iconColor)}
              style={{ width: '98%', height: '98%', opacity: 0.05 }}
              strokeWidth={0.6}
            />
            {/* ícone principal */}
            <Icon
              className={cn('relative', iconColor)}
              style={{ width: '42%', height: '42%' }}
              strokeWidth={1.1}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
