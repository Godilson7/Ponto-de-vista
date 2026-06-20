import * as React from 'react'

import { cn } from '@/lib/utils'

const variants = {
  country: 'border-emerald/40 text-emerald',
  area: 'border-border text-muted',
  gold: 'border-gold/50 text-gold',
} as const

type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants
}

/** Etiqueta de credencial (país / área de autoridade) — estética modernista. */
export function Tag({ variant = 'country', className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2.5 py-1 text-label uppercase',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
