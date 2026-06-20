import * as React from 'react'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { JsonLd } from '@/components/seo/json-ld'
import { breadcrumbJsonLd } from '@/lib/seo'

export type Crumb = { name: string; path: string }

/** Migalhas de navegação + dados estruturados BreadcrumbList. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <Container className="pt-8">
        <nav aria-label="Migalhas">
          <ol className="flex flex-wrap items-center gap-2 text-small text-muted">
            {items.map((item, i) => {
              const last = i === items.length - 1
              return (
                <li key={item.path} className="flex items-center gap-2">
                  {last ? (
                    <span className="text-ink" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <>
                      <Link href={item.path} className="transition-colors hover:text-emerald">
                        {item.name}
                      </Link>
                      <span aria-hidden="true" className="text-gold">
                        /
                      </span>
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </Container>
    </>
  )
}
