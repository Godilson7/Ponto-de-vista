import * as React from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

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

/** Cartão de Autor — estilo perfil profissional (rede de autores). */
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

  return (
    <Card
      className={cn(
        'group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift',
        className,
      )}
    >
      {/* Faixa de capa */}
      <div className="relative h-20 bg-gradient-to-br from-emerald to-emerald-deep">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6">
        <Avatar
          name={name}
          src={imageUrl}
          size={80}
          className="-mt-10 bg-paper-card ring-4 ring-paper-card"
        />

        {area ? <p className="label mt-4 text-muted">{area}</p> : null}
        <h3 className="mt-1 text-h3 font-semibold tracking-tightish text-ink">
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

        <div className="mt-auto pt-6">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={href}>Ver perfil</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
