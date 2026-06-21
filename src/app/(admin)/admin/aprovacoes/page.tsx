import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { Button } from '@/components/ui/button'
import { approveSubmission } from '../actions'

export const dynamic = 'force-dynamic'

type Pending = {
  id: string
  label: string
  table: 'authors' | 'blog_posts' | 'events'
  tipo: string
  editBase: string
}

export default async function AdminAprovacoes() {
  const supabase = await createClient()
  const [{ data: authors }, { data: posts }, { data: events }] = await Promise.all([
    supabase.from('authors').select('id,nome').eq('status', 'draft').not('owner', 'is', null),
    supabase.from('blog_posts').select('id,titulo').eq('status', 'draft').not('owner', 'is', null),
    supabase.from('events').select('id,titulo').eq('status', 'draft').not('owner', 'is', null),
  ])

  const items: Pending[] = [
    ...(authors ?? []).map((a) => ({
      id: a.id as string,
      label: (a.nome as string) || '(sem nome)',
      table: 'authors' as const,
      tipo: 'Perfil de autor',
      editBase: '/admin/autores',
    })),
    ...(posts ?? []).map((p) => ({
      id: p.id as string,
      label: (p.titulo as string) || '(sem título)',
      table: 'blog_posts' as const,
      tipo: 'Artigo',
      editBase: '/admin/artigos',
    })),
    ...(events ?? []).map((e) => ({
      id: e.id as string,
      label: (e.titulo as string) || '(sem título)',
      table: 'events' as const,
      tipo: 'Evento',
      editBase: '/admin/eventos',
    })),
  ]

  return (
    <div>
      <p className="label mb-2 text-emerald">Fluxo editorial</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Aprovações</h1>
      <p className="mt-3 max-w-prose text-small text-muted">
        Submissões dos autores a aguardar publicação. <strong>Rever</strong> abre o editor (onde
        pode ajustar antes de publicar); <strong>Aprovar</strong> publica de imediato.
      </p>

      <Card className="mt-8 divide-y divide-border">
        {items.map((it) => (
          <div key={`${it.table}-${it.id}`} className="flex flex-wrap items-center gap-3 p-4">
            <Tag variant="gold">{it.tipo}</Tag>
            <span className="min-w-0 flex-1 truncate font-medium text-ink">{it.label}</span>
            <div className="flex items-center gap-1">
              <Button asChild variant="outline" size="sm">
                <Link href={`${it.editBase}/${it.id}`}>Rever</Link>
              </Button>
              <form action={approveSubmission}>
                <input type="hidden" name="table" value={it.table} />
                <input type="hidden" name="id" value={it.id} />
                <Button type="submit" size="sm">
                  Aprovar
                </Button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="p-6 text-small text-muted">Nada a aguardar aprovação — tudo em dia.</p>
        ) : null}
      </Card>
    </div>
  )
}
