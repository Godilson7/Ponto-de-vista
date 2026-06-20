import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/forms/image-upload'
import { saveBook } from '../../actions'
import type { AdminBookRow } from '../../types'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export default async function AdminLivroForm({ params }: Params) {
  const { id } = await params
  const isNew = id === 'novo'
  const supabase = await createClient()

  let b: AdminBookRow = {}
  if (!isNew) {
    const { data } = await supabase.from('books').select('*').eq('id', id).maybeSingle()
    b = data ?? {}
  }
  const { data: autores } = await supabase.from('authors').select('id,nome').order('nome')

  return (
    <div className="max-w-3xl">
      <Link href="/admin/livros" className="text-label uppercase text-muted hover:text-emerald">
        ← Livros
      </Link>
      <h1 className="mt-3 text-h2 font-semibold tracking-tightish text-ink">
        {isNew ? 'Novo livro' : `Editar: ${b.titulo ?? ''}`}
      </h1>

      <form action={saveBook} className="mt-8 grid gap-5 sm:grid-cols-2">
        {!isNew ? <input type="hidden" name="id" value={id} /> : null}

        <Field label="Título" htmlFor="titulo" required>
          <Input id="titulo" name="titulo" required defaultValue={b.titulo ?? ''} />
        </Field>
        <Field label="Slug (vazio = automático)" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={b.slug ?? ''} />
        </Field>
        <Field label="Subtítulo" htmlFor="subtitulo" className="sm:col-span-2">
          <Input id="subtitulo" name="subtitulo" defaultValue={b.subtitulo ?? ''} />
        </Field>
        <Field label="Autor" htmlFor="autor">
          <Select id="autor" name="autor_id" defaultValue={b.autor_id ?? ''}>
            <option value="">— Selecionar —</option>
            {(autores ?? []).map((au) => (
              <option key={au.id} value={au.id}>
                {au.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Categoria" htmlFor="categoria">
          <Input id="categoria" name="categoria" defaultValue={b.categoria ?? ''} />
        </Field>
        <Field label="Sinopse curta" htmlFor="sc" className="sm:col-span-2">
          <Textarea id="sc" name="sinopse_curta" defaultValue={b.sinopse_curta ?? ''} />
        </Field>
        <Field label="Sinopse completa (Markdown)" htmlFor="scomp" className="sm:col-span-2">
          <Textarea id="scomp" name="sinopse_completa" className="min-h-40" defaultValue={b.sinopse_completa ?? ''} />
        </Field>
        <Field label="Temas (vírgula)" htmlFor="temas">
          <Input id="temas" name="temas" defaultValue={(b.temas ?? []).join(', ')} />
        </Field>
        <Field label="País" htmlFor="pais">
          <Input id="pais" name="pais" defaultValue={b.pais ?? ''} />
        </Field>
        <Field label="Público indicado" htmlFor="publico" className="sm:col-span-2">
          <Input id="publico" name="publico_indicado" defaultValue={b.publico_indicado ?? ''} />
        </Field>
        <Field label="ISBN" htmlFor="isbn">
          <Input id="isbn" name="isbn" defaultValue={b.isbn ?? ''} />
        </Field>
        <Field label="Nº de páginas" htmlFor="np">
          <Input id="np" name="num_paginas" type="number" defaultValue={b.num_paginas ?? ''} />
        </Field>
        <Field label="Formato" htmlFor="formato">
          <Select id="formato" name="formato" defaultValue={b.formato ?? 'Ambos'}>
            <option value="Físico">Físico</option>
            <option value="Digital">Digital</option>
            <option value="Ambos">Ambos</option>
          </Select>
        </Field>
        <Field label="Preço (€)" htmlFor="preco">
          <Input id="preco" name="preco" type="number" step="0.01" defaultValue={b.preco ?? ''} />
        </Field>
        <Field label="Preço promocional (€)" htmlFor="precop">
          <Input
            id="precop"
            name="preco_promocional"
            type="number"
            step="0.01"
            defaultValue={b.preco_promocional ?? ''}
          />
        </Field>
        <Field label="Link de compra" htmlFor="lc">
          <Input id="lc" name="link_compra" defaultValue={b.link_compra ?? ''} />
        </Field>
        <Field label="Capa" htmlFor="capa" className="sm:col-span-2">
          <ImageUpload name="capa_url" folder="livros" defaultValue={b.capa_url ?? ''} />
        </Field>
        <Field label="Relacionados (slugs, vírgula)" htmlFor="rel">
          <Input id="rel" name="relacionados" defaultValue={(b.relacionados ?? []).join(', ')} />
        </Field>
        <Field label="Fotos de lançamento (URLs, vírgula)" htmlFor="fl" className="sm:col-span-2">
          <Input id="fl" name="fotos_lancamento" defaultValue={(b.fotos_lancamento ?? []).join(', ')} />
        </Field>
        <Field label="Depoimentos (JSON)" htmlFor="dep" className="sm:col-span-2" hint='Ex.: [{"texto":"…","autor":"…"}]'>
          <Textarea id="dep" name="depoimentos" defaultValue={JSON.stringify(b.depoimentos ?? [], null, 2)} />
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={b.status ?? 'draft'}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </Select>
        </Field>
        <label className="flex items-center gap-3 self-end pb-3">
          <input type="checkbox" name="destaque" defaultChecked={b.destaque ?? false} className="size-4" />
          <span className="text-small text-ink">Destacar na homepage</span>
        </label>
        <label className="flex items-center gap-3 self-end pb-3">
          <input
            type="checkbox"
            name="portes_gratis"
            defaultChecked={b.portes_gratis ?? true}
            className="size-4"
          />
          <span className="text-small text-ink">Portes grátis</span>
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
