import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

async function countOf(
  table: string,
  filter?: { col: string; val: string },
): Promise<number> {
  try {
    const supabase = await createClient()
    let q = supabase.from(table).select('*', { count: 'exact', head: true })
    if (filter) q = q.eq(filter.col, filter.val)
    const { count } = await q
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function AdminDashboard() {
  const [autores, livros, artigos, rascunhos, pedidos, utilizadores] = await Promise.all([
    countOf('authors'),
    countOf('books'),
    countOf('blog_posts'),
    countOf('authors', { col: 'status', val: 'draft' }),
    countOf('contact_requests', { col: 'status', val: 'novo' }),
    countOf('profiles'),
  ])

  const stats = [
    { label: 'Autores', value: autores, href: '/admin/autores' },
    { label: 'Livros', value: livros, href: '/admin/livros' },
    { label: 'Artigos', value: artigos, href: '/admin/artigos' },
    { label: 'Autores em rascunho', value: rascunhos, href: '/admin/autores' },
    { label: 'Pedidos novos', value: pedidos, href: '/admin/pedidos' },
    { label: 'Utilizadores', value: utilizadores, href: '/admin/utilizadores' },
  ]

  return (
    <div>
      <p className="label mb-2 text-emerald">Painel da editora</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Visão geral</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-6 transition-shadow hover:shadow-lift">
              <p className="font-sans text-4xl font-semibold tracking-tightish text-emerald">
                {s.value}
              </p>
              <p className="mt-2 text-small text-muted">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/autores/novo"
          className="rounded-sm bg-emerald px-5 py-2.5 text-label uppercase text-paper transition-colors hover:bg-emerald-deep"
        >
          + Novo autor
        </Link>
        <Link
          href="/admin/livros/novo"
          className="rounded-sm border border-emerald/40 px-5 py-2.5 text-label uppercase text-emerald transition-colors hover:bg-emerald hover:text-paper"
        >
          + Novo livro
        </Link>
        <Link
          href="/admin/artigos/novo"
          className="rounded-sm border border-emerald/40 px-5 py-2.5 text-label uppercase text-emerald transition-colors hover:bg-emerald hover:text-paper"
        >
          + Novo artigo
        </Link>
      </div>
    </div>
  )
}
