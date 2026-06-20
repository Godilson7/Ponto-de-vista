'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'

import { Field, Input, Textarea } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

export type EditableAuthor = {
  nome?: string | null
  foto_url?: string | null
  area?: string | null
  frase_posicionamento?: string | null
  areas_de_autoridade?: string[] | null
  mini_bio?: string | null
  bio_completa?: string | null
  video_url?: string | null
  redes?: unknown
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? 'A guardar…' : 'Guardar alterações'}
    </Button>
  )
}

export function AuthorProfileForm({
  author,
  action,
}: {
  author: EditableAuthor
  action: (formData: FormData) => void | Promise<void>
}) {
  return (
    <form action={action} className="mt-6 grid gap-5 sm:grid-cols-2">
      <Field label="Nome" htmlFor="nome" required>
        <Input id="nome" name="nome" required defaultValue={author.nome ?? ''} />
      </Field>
      <Field label="Área principal" htmlFor="area">
        <Input id="area" name="area" defaultValue={author.area ?? ''} />
      </Field>
      <Field label="Foto (URL)" htmlFor="foto_url" className="sm:col-span-2">
        <Input id="foto_url" name="foto_url" defaultValue={author.foto_url ?? ''} />
      </Field>
      <Field label="Frase de posicionamento" htmlFor="frase" className="sm:col-span-2">
        <Input
          id="frase"
          name="frase_posicionamento"
          defaultValue={author.frase_posicionamento ?? ''}
        />
      </Field>
      <Field
        label="Áreas de autoridade (separadas por vírgula)"
        htmlFor="areas"
        className="sm:col-span-2"
      >
        <Input
          id="areas"
          name="areas_de_autoridade"
          defaultValue={(author.areas_de_autoridade ?? []).join(', ')}
        />
      </Field>
      <Field label="Mini-biografia" htmlFor="mini" className="sm:col-span-2">
        <Textarea id="mini" name="mini_bio" defaultValue={author.mini_bio ?? ''} />
      </Field>
      <Field label="Biografia completa (Markdown)" htmlFor="bio" className="sm:col-span-2">
        <Textarea
          id="bio"
          name="bio_completa"
          className="min-h-40"
          defaultValue={author.bio_completa ?? ''}
        />
      </Field>
      <Field label="Vídeo (URL)" htmlFor="video">
        <Input id="video" name="video_url" defaultValue={author.video_url ?? ''} />
      </Field>
      <Field
        label="Redes sociais (JSON)"
        htmlFor="redes"
        className="sm:col-span-2"
        hint='Ex.: [{"plataforma":"LinkedIn","url":"https://…"}]'
      >
        <Textarea id="redes" name="redes" defaultValue={JSON.stringify(author.redes ?? [], null, 2)} />
      </Field>

      <div className="sm:col-span-2 flex items-center gap-4">
        <SubmitButton />
        <p className="text-small text-muted">
          As alterações ficam <strong>em rascunho</strong> até a editora aprovar.
        </p>
      </div>
    </form>
  )
}
