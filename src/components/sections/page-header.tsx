import * as React from 'react'

import { Container } from '@/components/ui/container'

type PageHeaderProps = {
  kicker?: string
  title: React.ReactNode
  lead?: React.ReactNode
}

/** Cabeçalho institucional para páginas interiores. */
export function PageHeader({ kicker, title, lead }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-paper-card">
      <Container className="py-10 md:py-14">
        {kicker ? <p className="label mb-4 text-emerald">{kicker}</p> : null}
        <h1 className="max-w-3xl text-h1 font-medium tracking-tightish text-ink md:text-display">
          {title}
        </h1>
        <span className="gold-rule mt-6" aria-hidden="true" />
        {lead ? (
          <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft">{lead}</p>
        ) : null}
      </Container>
    </section>
  )
}
