import * as React from 'react'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import { Field, Input, Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { saveTaxonomy, deleteTaxonomy } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminTaxonomias() {
  const supabase = await createClient()
  const { data: taxonomias } = await supabase
    .from('taxonomies')
    .select('id,nome,slug,tipo')
    .order('tipo')
    .order('nome')

  return (
    <div>
      <p className="label mb-2 text-emerald">Configuração</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Taxonomias</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-h3 font-semibold tracking-tightish text-ink">Nova</h2>
          <form action={saveTaxonomy} className="mt-5 space-y-4">
            <Field label="Nome" htmlFor="nome" required>
              <Input id="nome" name="nome" required />
            </Field>
            <Field label="Slug (vazio = automático)" htmlFor="slug">
              <Input id="slug" name="slug" />
            </Field>
            <Field label="Tipo" htmlFor="tipo">
              <Select id="tipo" name="tipo" defaultValue="categoria-blog">
                <option value="categoria-blog">Categoria do blog</option>
                <option value="tema">Tema</option>
                <option value="area">Área</option>
              </Select>
            </Field>
            <Button type="submit" size="sm">
              Adicionar
            </Button>
          </form>
        </Card>

        <Card className="divide-y divide-border lg:col-span-2">
          {(taxonomias ?? []).map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-ink">{t.nome}</p>
                <p className="text-small text-muted">{t.slug}</p>
              </div>
              <Tag variant="area">{t.tipo}</Tag>
              <form action={deleteTaxonomy}>
                <input type="hidden" name="id" value={t.id} />
                <button className="text-label uppercase text-muted hover:text-ink">Eliminar</button>
              </form>
            </div>
          ))}
          {(taxonomias ?? []).length === 0 ? (
            <p className="p-6 text-small text-muted">Sem taxonomias.</p>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
