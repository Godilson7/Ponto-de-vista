import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CalendarDays, ArrowUpRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo'
import { getEvents } from '@/lib/content'
import { PageHero } from '@/components/sections/page-hero'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = buildMetadata({
  title: 'Eventos',
  description:
    'Agenda da Ponto de Vista Editora — lançamentos, palestras e participações dos nossos autores.',
  path: '/eventos',
})

export const revalidate = 60

export default async function EventosPage() {
  const events = await getEvents()

  return (
    <>
      <PageHero
        variant="eventos"
        kicker="Agenda cultural"
        title="Eventos"
        lead="Lançamentos, palestras e conversas com os autores da casa — em Portugal, no Brasil e em África Lusófona."
        cta={{ label: 'Conhecer os autores', href: '/autores' }}
      />
      <Section>
        {events.length > 0 ? (
          <ul className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
            {events.map((e) => {
              const meta = [e.local, e.cidade].filter(Boolean).join(' · ')
              return (
                <li key={e.id} className="flex items-start gap-5 py-6">
                  <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                    <CalendarDays className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {e.data ? (
                      <p className="label text-emerald">
                        {e.data}
                        {e.hora ? ` · ${e.hora}` : ''}
                      </p>
                    ) : null}
                    <h2 className="mt-1 text-h3 font-medium tracking-tightish text-ink">
                      {e.titulo}
                    </h2>
                    {meta ? <p className="mt-1 text-small text-muted">{meta}</p> : null}
                    {e.autorNome ? (
                      <p className="mt-1 text-small text-muted">
                        com{' '}
                        {e.autorSlug ? (
                          <Link
                            href={`/autores/${e.autorSlug}`}
                            className="text-emerald hover:underline"
                          >
                            {e.autorNome}
                          </Link>
                        ) : (
                          e.autorNome
                        )}
                      </p>
                    ) : null}
                    {e.descricao ? (
                      <p className="mt-2 text-small leading-relaxed text-ink-soft">{e.descricao}</p>
                    ) : null}
                  </div>
                  {e.link ? (
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 self-center text-label uppercase text-emerald hover:text-emerald-deep"
                    >
                      Detalhes <ArrowUpRight className="size-3.5" />
                    </a>
                  ) : null}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mx-auto max-w-2xl rounded-md border border-dashed border-border bg-paper-card p-12 text-center">
            <CalendarDays className="mx-auto size-8 text-emerald" />
            <h2 className="mt-4 text-h3 font-medium tracking-tightish text-ink">
              Sem eventos agendados de momento
            </h2>
            <p className="mt-3 font-serif text-lg leading-relaxed text-ink-soft">
              Estamos a preparar a próxima agenda. Volte em breve ou acompanhe-nos para não perder os
              próximos lançamentos e palestras.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/autores">Conhecer os autores</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/blog">Ler o blogue</Link>
              </Button>
            </div>
          </div>
        )}
      </Section>
    </>
  )
}
