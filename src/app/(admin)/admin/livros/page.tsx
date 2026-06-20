import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { deleteBook } from '../actions'
import type { AdminBookListRow } from '../types'

export const dynamic = 'force-dynamic'

export default async function AdminLivros() {
  const supabase = await createClient()
  const { data: livros } = await supabase
    .from('books')
    .select('id,titulo,status,destaque,autor:authors(nome)')
    .order('titulo')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label mb-2 text-emerald">Conteúdo</p>
          <h1 className="text-h2 font-semibold tracking-tightish text-ink">Livros</h1>
        </div>
        <Link
          href="/admin/livros/novo"
          className="rounded-sm bg-emerald px-5 py-2.5 text-label uppercase text-paper transition-colors hover:bg-emerald-deep"
        >
          + Novo livro
        </Link>
      </div>

      <Card className="divide-y divide-border">
        {(livros ?? []).map((b: AdminBookListRow) => {
          const autor = Array.isArray(b.autor) ? b.autor[0] : b.autor
          return (
            <div key={b.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{b.titulo}</p>
                <p className="truncate text-small text-muted">{autor?.nome ?? '—'}</p>
              </div>
              <Tag variant={b.status === 'published' ? 'country' : 'gold'}>
                {b.status === 'published' ? 'Publicado' : 'Rascunho'}
              </Tag>
              {b.destaque ? <Tag variant="area">Destaque</Tag> : null}
              <Link
                href={`/admin/livros/${b.id}`}
                className="text-label uppercase text-emerald hover:text-emerald-deep"
              >
                Editar
              </Link>
              <form action={deleteBook}>
                <input type="hidden" name="id" value={b.id} />
                <button className="text-label uppercase text-muted hover:text-ink">Eliminar</button>
              </form>
            </div>
          )
        })}
        {(livros ?? []).length === 0 ? (
          <p className="p-6 text-small text-muted">Ainda não há livros.</p>
        ) : null}
      </Card>
    </div>
  )
}
