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
import { submitMyArticle } from '../../actions'

export const metadata: Metadata = buildMetadata({ title: 'Artigo', path: '/conta', noIndex: true })
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }
type MyPost = {
  titulo?: string
  resumo?: string
  categoria_id?: string
  corpo?: string
  capa_url?: string
  status?: string
}

export default async function MyArticleForm({ params }: Params) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'author') redirect('/conta')

  const { id } = await params
  const isNew = id === 'novo'
  const supabase = await createClient()

  let post: MyPost = {}
  if (!isNew) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('owner', user.id)
      .maybeSingle()
    if (!data) redirect('/conta')
    post = data as MyPost
  }

  const { data: categorias } = await supabase
    .from('taxonomies')
    .select('id,nome')
    .eq('tipo', 'categoria-blog')
    .order('nome')

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <Link href="/conta" className="text-label uppercase text-muted hover:text-emerald">
          ← A minha conta
        </Link>
        <h1 className="mt-3 text-h2 font-semibold tracking-tightish text-ink">
          {isNew ? 'Novo artigo' : 'Editar artigo'}
        </h1>
        <p className="mt-2 text-small text-muted">
          O artigo fica <strong>em rascunho</strong> até a editora aprovar e publicar.
        </p>

        <form action={submitMyArticle} className="mt-8 grid gap-5">
          {!isNew ? <input type="hidden" name="id" value={id} /> : null}

          <Field label="Título" htmlFor="titulo" required>
            <Input id="titulo" name="titulo" required defaultValue={post.titulo ?? ''} />
          </Field>
          <Field label="Resumo" htmlFor="resumo">
            <Textarea id="resumo" name="resumo" defaultValue={post.resumo ?? ''} />
          </Field>
          <Field label="Categoria" htmlFor="categoria">
            <Select id="categoria" name="categoria_id" defaultValue={post.categoria_id ?? ''}>
              <option value="">— Selecionar —</option>
              {(categorias ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Conteúdo (Markdown)" htmlFor="corpo">
            <Textarea id="corpo" name="corpo" className="min-h-64" defaultValue={post.corpo ?? ''} />
          </Field>
          <Field label="Imagem de capa" htmlFor="capa">
            <ImageUpload name="capa_url" folder="blog" defaultValue={post.capa_url ?? ''} aspect="aspect-video" />
          </Field>

          <div>
            <Button type="submit" size="lg">
              {isNew ? 'Submeter para aprovação' : 'Guardar alterações'}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  )
}
