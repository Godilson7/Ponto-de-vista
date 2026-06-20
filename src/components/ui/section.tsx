import * as React from 'react'

import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div'
  muted?: boolean
  bare?: boolean
}

/** Secção com ritmo vertical generoso (96–120px) da Direção 4. */
export function Section({
  as: Comp = 'section',
  muted = false,
  bare = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn(
        'py-section-sm md:py-section',
        muted && 'bg-paper-card',
        className,
      )}
      {...props}
    >
      {bare ? children : <Container>{children}</Container>}
    </Comp>
  )
}

type SectionHeadingProps = {
  kicker?: string
  title: React.ReactNode
  lead?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Cabeçalho de secção: label (kicker) + título justo + lead opcional. */
export function SectionHeading({
  kicker,
  title,
  lead,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {kicker ? <p className="label mb-4 text-emerald">{kicker}</p> : null}
      <h2 className="text-h2 font-medium tracking-tightish text-ink">{title}</h2>
      <span
        className={cn('gold-rule mt-6', align === 'center' && 'mx-auto')}
        aria-hidden="true"
      />
      {lead ? (
        <p className="mt-6 font-serif text-lg leading-relaxed text-ink-soft">{lead}</p>
      ) : null}
    </div>
  )
}
