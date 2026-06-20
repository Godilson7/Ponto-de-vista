import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { savePost } from '../../actions'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export default async function AdminArtigoForm({ params }: Params) {
  const { id } = await params
  const isNew = id === 'novo'
  const supabase = await createClient()

  let p: Record<string, any> = {}
  if (!isNew) {
    const { data } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
    p = data ?? {}
  }
  const { data: categorias } = await supabase
    .from('taxonomies')
    .select('id,nome')
    .eq('tipo', 'categoria-blog')
    .order('nome')

  const publishedDate = p.published_at ? String(p.published_at).slice(0, 10) : ''

  return (
    <div className="max-w-3xl">
      <Link href="/admin/artigos" className="text-label uppercase text-muted hover:text-emerald">
        ← Artigos
      </Link>
      <h1 className="mt-3 text-h2 font-semibold tracking-tightish text-ink">
        {isNew ? 'Novo artigo' : `Editar: ${p.titulo ?? ''}`}
      </h1>

      <form action={savePost} className="mt-8 grid gap-5 sm:grid-cols-2">
        {!isNew ? <input type="hidden" name="id" value={id} /> : null}

        <Field label="Título" htmlFor="titulo" required>
          <Input id="titulo" name="titulo" required defaultValue={p.titulo ?? ''} />
        </Field>
        <Field label="Slug (vazio = automático)" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={p.slug ?? ''} />
        </Field>
        <Field label="Categoria" htmlFor="categoria">
          <Select id="categoria" name="categoria_id" defaultValue={p.categoria_id ?? ''}>
            <option value="">— Selecionar —</option>
            {(categorias ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Autor (nome)" htmlFor="autor">
          <Input id="autor" name="autor_nome" defaultValue={p.autor_nome ?? ''} />
        </Field>
        <Field label="Resumo" htmlFor="resumo" className="sm:col-span-2">
          <Textarea id="resumo" name="resumo" defaultValue={p.resumo ?? ''} />
        </Field>
        <Field label="Corpo (Markdown)" htmlFor="corpo" className="sm:col-span-2">
          <Textarea id="corpo" name="corpo" className="min-h-64" defaultValue={p.corpo ?? ''} />
        </Field>
        <Field label="Capa (URL)" htmlFor="capa">
          <Input id="capa" name="capa_url" defaultValue={p.capa_url ?? ''} />
        </Field>
        <Field label="Data de publicação" htmlFor="pub">
          <Input id="pub" name="published_at" type="date" defaultValue={publishedDate} />
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={p.status ?? 'draft'}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </Select>
        </Field>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
