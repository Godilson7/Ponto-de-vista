import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/forms/image-upload'
import { saveEvent } from '../../actions'
import type { AdminEventRow } from '../../types'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export default async function AdminEventoForm({ params }: Params) {
  const { id } = await params
  const isNew = id === 'novo'
  const supabase = await createClient()

  let e: AdminEventRow = {}
  if (!isNew) {
    const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle()
    e = data ?? {}
  }
  const { data: autores } = await supabase.from('authors').select('id,nome').order('nome')

  return (
    <div className="max-w-3xl">
      <Link href="/admin/eventos" className="text-label uppercase text-muted hover:text-emerald">
        ← Eventos
      </Link>
      <h1 className="mt-3 text-h2 font-semibold tracking-tightish text-ink">
        {isNew ? 'Novo evento' : `Editar: ${e.titulo ?? ''}`}
      </h1>

      <form action={saveEvent} className="mt-8 grid gap-5 sm:grid-cols-2">
        {!isNew ? <input type="hidden" name="id" value={id} /> : null}

        <Field label="Título" htmlFor="titulo" required className="sm:col-span-2">
          <Input id="titulo" name="titulo" required defaultValue={e.titulo ?? ''} />
        </Field>
        <Field label="Slug (vazio = automático)" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={e.slug ?? ''} />
        </Field>
        <Field label="Tipo" htmlFor="tipo">
          <Select id="tipo" name="tipo" defaultValue={e.tipo ?? 'evento'}>
            <option value="evento">Evento</option>
            <option value="lançamento">Lançamento</option>
            <option value="palestra">Palestra</option>
            <option value="feira">Feira</option>
            <option value="conversa">Conversa</option>
          </Select>
        </Field>
        <Field label="Data" htmlFor="data">
          <Input id="data" name="data_inicio" type="date" defaultValue={e.data_inicio ?? ''} />
        </Field>
        <Field label="Hora" htmlFor="hora">
          <Input id="hora" name="hora" placeholder="18:30" defaultValue={e.hora ?? ''} />
        </Field>
        <Field label="Local" htmlFor="local">
          <Input id="local" name="local" defaultValue={e.local ?? ''} />
        </Field>
        <Field label="Cidade" htmlFor="cidade">
          <Input id="cidade" name="cidade" defaultValue={e.cidade ?? ''} />
        </Field>
        <Field label="País" htmlFor="pais">
          <Input id="pais" name="pais" defaultValue={e.pais ?? ''} />
        </Field>
        <Field label="Autor (opcional)" htmlFor="autor">
          <Select id="autor" name="autor_id" defaultValue={e.autor_id ?? ''}>
            <option value="">— Sem autor —</option>
            {(autores ?? []).map((au) => (
              <option key={au.id} value={au.id}>
                {au.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Link (inscrição/detalhes)" htmlFor="link" className="sm:col-span-2">
          <Input id="link" name="link" defaultValue={e.link ?? ''} />
        </Field>
        <Field label="Descrição" htmlFor="descricao" className="sm:col-span-2">
          <Textarea id="descricao" name="descricao" defaultValue={e.descricao ?? ''} />
        </Field>
        <Field label="Imagem" htmlFor="capa" className="sm:col-span-2">
          <ImageUpload
            name="capa_url"
            folder="eventos"
            defaultValue={e.capa_url ?? ''}
            aspect="aspect-video"
          />
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={e.status ?? 'draft'}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </Select>
        </Field>
        <label className="flex items-center gap-3 self-end pb-3">
          <input
            type="checkbox"
            name="destaque"
            defaultChecked={e.destaque ?? false}
            className="size-4"
          />
          <span className="text-small text-ink">Destacar</span>
        </label>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
