import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/admin/delete-button'
import { deletePost } from '../actions'
import type { AdminPostListRow } from '../types'

export const dynamic = 'force-dynamic'

export default async function AdminArtigos() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id,titulo,status,categoria:taxonomies(nome)')
    .order('published_at', { ascending: false })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label mb-2 text-emerald">Conteúdo</p>
          <h1 className="text-h2 font-semibold tracking-tightish text-ink">Artigos</h1>
        </div>
        <Link
          href="/admin/artigos/novo"
          className="rounded-sm bg-emerald px-5 py-2.5 text-label uppercase text-paper transition-colors hover:bg-emerald-deep"
        >
          + Novo artigo
        </Link>
      </div>

      <Card className="divide-y divide-border">
        {(posts ?? []).map((p: AdminPostListRow) => {
          const cat = Array.isArray(p.categoria) ? p.categoria[0] : p.categoria
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{p.titulo}</p>
                <p className="truncate text-small text-muted">{cat?.nome ?? '—'}</p>
              </div>
              <Tag variant={p.status === 'published' ? 'country' : 'gold'}>
                {p.status === 'published' ? 'Publicado' : 'Rascunho'}
              </Tag>
              <div className="flex items-center gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/artigos/${p.id}`}>Editar</Link>
                </Button>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={p.id} />
                  <DeleteButton confirmText={`Eliminar "${p.titulo}"?`} />
                </form>
              </div>
            </div>
          )
        })}
        {(posts ?? []).length === 0 ? (
          <p className="p-6 text-small text-muted">Ainda não há artigos.</p>
        ) : null}
      </Card>
    </div>
  )
}
