import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteAuthor } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminAutores() {
  const supabase = await createClient()
  const { data: autores } = await supabase
    .from('authors')
    .select('id,nome,area,pais,status,destaque,slug')
    .order('nome')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label mb-2 text-emerald">Conteúdo</p>
          <h1 className="text-h2 font-semibold tracking-tightish text-ink">Autores</h1>
        </div>
        <Link
          href="/admin/autores/novo"
          className="rounded-sm bg-emerald px-5 py-2.5 text-label uppercase text-paper transition-colors hover:bg-emerald-deep"
        >
          + Novo autor
        </Link>
      </div>

      <Card className="divide-y divide-border">
        {(autores ?? []).map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{a.nome}</p>
              <p className="truncate text-small text-muted">
                {[a.area, a.pais].filter(Boolean).join(' · ')}
              </p>
            </div>
            <Tag variant={a.status === 'published' ? 'country' : 'gold'}>
              {a.status === 'published' ? 'Publicado' : 'Rascunho'}
            </Tag>
            {a.destaque ? <Tag variant="area">Destaque</Tag> : null}
            <div className="flex items-center gap-1">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/autores/${a.id}`}>Editar</Link>
              </Button>
              <form action={deleteAuthor}>
                <input type="hidden" name="id" value={a.id} />
                <DeleteButton confirmText={`Eliminar "${a.nome}"?`} />
              </form>
            </div>
          </div>
        ))}
        {(autores ?? []).length === 0 ? (
          <p className="p-6 text-small text-muted">
            Ainda não há autores. Corre o <code>schema.sql</code>/<code>seed.sql</code> no Supabase ou
            cria um novo.
          </p>
        ) : null}
      </Card>
    </div>
  )
}
