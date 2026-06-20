import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/forms/image-upload'
import { saveAuthor } from '../../actions'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export default async function AdminAutorForm({ params }: Params) {
  const { id } = await params
  const isNew = id === 'novo'

  let a: Record<string, any> = {}
  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('authors').select('*').eq('id', id).maybeSingle()
    a = data ?? {}
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/autores" className="text-label uppercase text-muted hover:text-emerald">
        ← Autores
      </Link>
      <h1 className="mt-3 text-h2 font-semibold tracking-tightish text-ink">
        {isNew ? 'Novo autor' : `Editar: ${a.nome ?? ''}`}
      </h1>

      <form action={saveAuthor} className="mt-8 grid gap-5 sm:grid-cols-2">
        {!isNew ? <input type="hidden" name="id" value={id} /> : null}

        <Field label="Nome" htmlFor="nome" required>
          <Input id="nome" name="nome" required defaultValue={a.nome ?? ''} />
        </Field>
        <Field label="Slug (vazio = automático)" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={a.slug ?? ''} />
        </Field>
        <Field label="País" htmlFor="pais">
          <Input id="pais" name="pais" defaultValue={a.pais ?? ''} />
        </Field>
        <Field label="Cidade" htmlFor="cidade">
          <Input id="cidade" name="cidade" defaultValue={a.cidade ?? ''} />
        </Field>
        <Field label="Área (principal)" htmlFor="area">
          <Input id="area" name="area" defaultValue={a.area ?? ''} />
        </Field>
        <Field label="Áreas de autoridade (separadas por vírgula)" htmlFor="areas">
          <Input
            id="areas"
            name="areas_de_autoridade"
            defaultValue={(a.areas_de_autoridade ?? []).join(', ')}
          />
        </Field>
        <Field label="Frase de posicionamento" htmlFor="frase" className="sm:col-span-2">
          <Input id="frase" name="frase_posicionamento" defaultValue={a.frase_posicionamento ?? ''} />
        </Field>
        <Field label="Mini-biografia" htmlFor="mini" className="sm:col-span-2">
          <Textarea id="mini" name="mini_bio" defaultValue={a.mini_bio ?? ''} />
        </Field>
        <Field label="Biografia completa (Markdown)" htmlFor="bio" className="sm:col-span-2">
          <Textarea id="bio" name="bio_completa" className="min-h-48" defaultValue={a.bio_completa ?? ''} />
        </Field>
        <Field label="Foto" htmlFor="foto" className="sm:col-span-2">
          <ImageUpload name="foto_url" folder="autores" defaultValue={a.foto_url ?? ''} aspect="aspect-square" />
        </Field>
        <Field label="Vídeo (URL)" htmlFor="video">
          <Input id="video" name="video_url" defaultValue={a.video_url ?? ''} />
        </Field>
        <Field label="Galeria (URLs separados por vírgula)" htmlFor="galeria" className="sm:col-span-2">
          <Input id="galeria" name="galeria" defaultValue={(a.galeria ?? []).join(', ')} />
        </Field>
        <Field label="Redes sociais (JSON)" htmlFor="redes" className="sm:col-span-2" hint='Ex.: [{"plataforma":"LinkedIn","url":"https://…"}]'>
          <Textarea id="redes" name="redes" defaultValue={JSON.stringify(a.redes ?? [], null, 2)} />
        </Field>
        <Field label="Participações (JSON)" htmlFor="part" className="sm:col-span-2" hint='Ex.: [{"tipo":"evento","titulo":"…","data":"2025","link":"#"}]'>
          <Textarea
            id="part"
            name="participacoes"
            defaultValue={JSON.stringify(a.participacoes ?? [], null, 2)}
          />
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={a.status ?? 'draft'}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </Select>
        </Field>
        <label className="flex items-center gap-3 self-end pb-3">
          <input type="checkbox" name="destaque" defaultChecked={a.destaque ?? false} className="size-4" />
          <span className="text-small text-ink">Destacar na homepage</span>
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
