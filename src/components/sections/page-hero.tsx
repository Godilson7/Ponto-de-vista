import * as React from 'react'
import Link from 'next/link'
import {
  Award,
  Book,
  BookOpen,
  Bookmark,
  CalendarDays,
  FileCheck,
  FileText,
  Feather,
  Globe,
  Landmark,
  Library,
  MapPin,
  Mic,
  Newspaper,
  PenLine,
  Quote,
  Send,
  Sparkles,
  Ticket,
  User,
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

// Identidade visual por página: ícones temáticos + tom + cor de acento.
const VARIANTS: Record<
  HeroVariant,
  { icons: LucideIcon[]; tone: 'paper' | 'dark'; accent: 'emerald' | 'gold' }
> = {
  home: { icons: [BookOpen, Users, Feather, Globe, Award], tone: 'dark', accent: 'gold' },
  'a-editora': { icons: [Landmark, Globe, Feather, BookOpen, Users], tone: 'paper', accent: 'emerald' },
  autores: { icons: [Users, Mic, Award, PenLine, User], tone: 'paper', accent: 'emerald' },
  livros: { icons: [BookOpen, Library, Bookmark, Feather, Book], tone: 'paper', accent: 'emerald' },
  blog: { icons: [FileText, PenLine, Newspaper, Quote, BookOpen], tone: 'paper', accent: 'gold' },
  publicar: { icons: [Feather, Send, Sparkles, FileCheck, Award], tone: 'dark', accent: 'gold' },
  eventos: { icons: [CalendarDays, Mic, MapPin, Users, Ticket], tone: 'paper', accent: 'emerald' },
}

export type PageHeroProps = {
  variant: HeroVariant
  kicker?: string
  title: React.ReactNode
  lead?: React.ReactNode
  cta?: Cta
  ctaSecondary?: Cta
}

// "Constelação" de ícones no painel direito — posições/dimensões/atraso.
const SPOTS = [
  { top: '6%', left: '38%', size: 96, delay: '0s' },
  { top: '0%', left: '4%', size: 54, delay: '.9s' },
  { top: '46%', left: '0%', size: 68, delay: '1.7s' },
  { top: '55%', left: '58%', size: 60, delay: '.4s' },
  { top: '18%', left: '78%', size: 46, delay: '1.2s' },
]

/**
 * Cabeçalho de página com CTA e painel de ícones temáticos à direita.
 * Cada `variant` traz a sua identidade (ícones, tom claro/escuro, cor de acento).
 */
export function PageHero({ variant, kicker, title, lead, cta, ctaSecondary }: PageHeroProps) {
  const { icons, tone, accent } = VARIANTS[variant]
  const dark = tone === 'dark'
  const tiles = icons.slice(0, SPOTS.length)

  return (
    <section
      className={cn('relative overflow-hidden border-b border-border', !dark && 'bg-paper-card')}
      style={dark ? { background: DARK_BG, color: LIGHT } : undefined}
    >
      <Container className="grid items-center gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-20">
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

        {/* Painel de ícones temáticos (decorativo) */}
        <div className="relative hidden min-h-[280px] md:block" aria-hidden="true">
          {tiles.map((Icon, i) => {
            const s = SPOTS[i]
            return (
              <span
                key={i}
                className={cn(
                  'absolute flex animate-float items-center justify-center rounded-2xl border shadow-card backdrop-blur-sm motion-reduce:animate-none',
                  dark ? 'border-gold/25' : 'border-border',
                )}
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  animationDelay: s.delay,
                  background: dark ? 'rgba(243,238,228,0.06)' : 'rgb(var(--paper))',
                }}
              >
                <Icon
                  className={accent === 'gold' ? 'text-gold' : 'text-emerald'}
                  style={{ width: s.size * 0.42, height: s.size * 0.42 }}
                  strokeWidth={1.5}
                />
              </span>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
