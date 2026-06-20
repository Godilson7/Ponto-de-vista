import * as React from 'react'

import { Container } from '@/components/ui/container'
import { CountUp } from '@/components/motion/count-up'

export type Stat = {
  value: string
  label: string
}

/** Faixa de estatísticas — números grandes sobre esmeralda (reforço de autoridade). */
export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-emerald text-paper" aria-label="A editora em números">
      <Container className="py-16 md:py-20">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-sans text-4xl font-medium tracking-tightish text-paper md:text-5xl">
                <CountUp value={stat.value} />
              </dd>
              <span className="mx-auto mt-4 block h-px w-8 bg-gold" aria-hidden="true" />
              <p className="mt-4 text-label uppercase text-paper/70">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
