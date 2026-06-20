import * as React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

export function avatarInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

type AvatarProps = {
  name: string
  src?: string
  size?: number
  className?: string
}

/** Avatar circular: foto ou monograma (iniciais em Cormorant). */
export function Avatar({ name, src, size = 96, className }: AvatarProps) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald/10',
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`Retrato de ${name}`}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span
          style={{ fontSize: Math.round(size * 0.4) }}
          className="font-serif italic leading-none text-emerald/55"
        >
          {avatarInitials(name)}
        </span>
      )}
    </span>
  )
}
