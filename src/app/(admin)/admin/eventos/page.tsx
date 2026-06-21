import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteEvent } from '../actions'
import type { AdminEventListRow } from '../types'

export const dynamic = 'force-dynamic'

export default async function AdminEventos() {
  const supabase = await createClient()
  const { data: eventos } = await supabase
    .from('events')
    .select('id,titulo,status,destaque,data_inicio')
    .order('data_inicio', { ascending: false, nullsFirst: false })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="label mb-2 text-emerald">Conteúdo</p>
          <h1 className="text-h2 font-semibold tracking-tightish text-ink">Eventos</h1>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="rounded-sm bg-emerald px-5 py-2.5 text-label uppercase text-paper transition-colors hover:bg-emerald-deep"
        >
          + Novo evento
        </Link>
      </div>

      <Card className="divide-y divide-border">
        {(eventos ?? []).map((e: AdminEventListRow) => (
          <div key={e.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{e.titulo}</p>
              <p className="truncate text-small text-muted">{e.data_inicio ?? 'Sem data'}</p>
            </div>
            <Tag variant={e.status === 'published' ? 'country' : 'gold'}>
              {e.status === 'published' ? 'Publicado' : 'Rascunho'}
            </Tag>
            {e.destaque ? <Tag variant="area">Destaque</Tag> : null}
            <div className="flex items-center gap-1">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/eventos/${e.id}`}>Editar</Link>
              </Button>
              <form action={deleteEvent}>
                <input type="hidden" name="id" value={e.id} />
                <DeleteButton confirmText={`Eliminar "${e.titulo}"?`} />
              </form>
            </div>
          </div>
        ))}
        {(eventos ?? []).length === 0 ? (
          <p className="p-6 text-small text-muted">Ainda não há eventos.</p>
        ) : null}
      </Card>
    </div>
  )
}
