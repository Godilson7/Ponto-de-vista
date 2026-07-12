import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AuthorCardProps = {
  name: string
  positioning?: string
  area?: string
  country?: string
  city?: string
  href: string
  imageUrl?: string
  className?: string
}

/**
 * Cartão de Autor — versão editorial premium.
 * Retrato em destaque (media suave) que se eleva no hover, nome em serif
 * (Fraunces) e a frase de posicionamento como pull-quote. Degrada com elegância
 * quando não há foto (bloco esmeralda com iniciais).
 */
export function AuthorCard({
  name,
  positioning,
  area,
  country,
  city,
  href,
  imageUrl,
  className,
}: AuthorCardProps) {
  const location = [city, country].filter(Boolean).join(', ')
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <article className={cn('group flex flex-col', className)}>
      {/* Retrato — media suave, eleva no hover (transform, não empurra a grelha) */}
      <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
        <Link
          href={href}
          aria-label={name}
          className="relative block aspect-[4/5] overflow-hidden rounded-lg border border-border bg-emerald shadow-card transition-shadow duration-500 group-hover:shadow-lift"
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-start justify-between p-5 text-paper">
              <span className="gold-rule" aria-hidden="true" />
              <span className="font-serif text-4xl italic leading-none">{initials}</span>
              <span className="text-label uppercase tracking-wide text-paper/70">
                {area || 'Autor'}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-1 flex-col">
        {area ? (
          <p className="text-label uppercase tracking-[0.14em] text-emerald">{area}</p>
        ) : null}
        <h3 className="mt-1.5 font-serif text-h3 font-medium tracking-tightish text-ink">
          <Link href={href} className="transition-colors hover:text-emerald">
            {name}
          </Link>
        </h3>
        {positioning ? (
          <p className="mt-2 font-serif text-lg italic leading-snug text-ink-soft">{positioning}</p>
        ) : null}
        {location ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-small text-muted">
            <MapPin className="size-3.5 text-emerald" />
            {location}
          </p>
        ) : null}
      </div>
    </article>
  )
}
