import * as React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Section } from '@/components/ui/section'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/forms/image-upload'
import { submitMyEvent } from '../../actions'

export const metadata: Metadata = buildMetadata({ title: 'Evento', path: '/conta', noIndex: true })
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }
type MyEvent = {
  titulo?: string
  descricao?: string
  data_inicio?: string
  hora?: string
  local?: string
  cidade?: string
  pais?: string
  tipo?: string
  link?: string
  capa_url?: string
  status?: string
}

export default async function MyEventForm({ params }: Params) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'author') redirect('/conta')

  const { id } = await params
  const isNew = id === 'novo'
  const supabase = await createClient()

  let ev: MyEvent = {}
  if (!isNew) {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('owner', user.id)
      .maybeSingle()
    if (!data) redirect('/conta')
    ev = data as MyEvent
  }

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <Link href="/conta" className="text-label uppercase text-muted hover:text-emerald">
          ← A minha conta
        </Link>
        <h1 className="mt-3 text-h2 font-semibold tracking-tightish text-ink">
          {isNew ? 'Novo evento' : 'Editar evento'}
        </h1>
        <p className="mt-2 text-small text-muted">
          O evento fica <strong>em rascunho</strong> até a editora aprovar e publicar.
        </p>

        <form action={submitMyEvent} className="mt-8 grid gap-5 sm:grid-cols-2">
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}

          <Field label="Título" htmlFor="titulo" required className="sm:col-span-2">
            <Input id="titulo" name="titulo" required defaultValue={ev.titulo ?? ''} />
          </Field>
          <Field label="Tipo" htmlFor="tipo">
            <Select id="tipo" name="tipo" defaultValue={ev.tipo ?? 'evento'}>
              <option value="evento">Evento</option>
              <option value="lançamento">Lançamento</option>
              <option value="palestra">Palestra</option>
              <option value="feira">Feira</option>
              <option value="conversa">Conversa</option>
            </Select>
          </Field>
          <Field label="Data" htmlFor="data">
            <Input id="data" name="data_inicio" type="date" defaultValue={ev.data_inicio ?? ''} />
          </Field>
          <Field label="Hora" htmlFor="hora">
            <Input id="hora" name="hora" placeholder="18:30" defaultValue={ev.hora ?? ''} />
          </Field>
          <Field label="Local" htmlFor="local">
            <Input id="local" name="local" defaultValue={ev.local ?? ''} />
          </Field>
          <Field label="Cidade" htmlFor="cidade">
            <Input id="cidade" name="cidade" defaultValue={ev.cidade ?? ''} />
          </Field>
          <Field label="País" htmlFor="pais">
            <Input id="pais" name="pais" defaultValue={ev.pais ?? ''} />
          </Field>
          <Field label="Link (inscrição/detalhes)" htmlFor="link" className="sm:col-span-2">
            <Input id="link" name="link" defaultValue={ev.link ?? ''} />
          </Field>
          <Field label="Descrição" htmlFor="descricao" className="sm:col-span-2">
            <Textarea id="descricao" name="descricao" defaultValue={ev.descricao ?? ''} />
          </Field>
          <Field label="Imagem" htmlFor="capa" className="sm:col-span-2">
            <ImageUpload name="capa_url" folder="eventos" defaultValue={ev.capa_url ?? ''} aspect="aspect-video" />
          </Field>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg">
              {isNew ? 'Submeter para aprovação' : 'Guardar alterações'}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  )
}
