import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getCurrentUser, isStaff, type AppRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Section } from '@/components/ui/section'
import { PageHeader } from '@/components/sections/page-header'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Card } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { LogoutButton } from '@/components/auth/logout-button'
import { AuthorProfileForm, type EditableAuthor } from '@/components/forms/author-profile-form'
import { updateMyAuthorProfile, updateMyAccount } from './actions'

export const metadata: Metadata = buildMetadata({
  title: 'A minha conta',
  description: 'Área reservada dos utilizadores da Ponto de Vista Editora.',
  path: '/conta',
  noIndex: true,
})
export const dynamic = 'force-dynamic'

const roleLabels: Record<AppRole, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  author: 'Autor',
  reader: 'Leitor',
}

const adminLinks = [
  { label: 'Autores', href: '/admin/autores' },
  { label: 'Livros', href: '/admin/livros' },
  { label: 'Artigos', href: '/admin/artigos' },
  { label: 'Eventos', href: '/admin/eventos' },
  { label: 'Aprovações', href: '/admin/aprovacoes' },
  { label: 'Pedidos', href: '/admin/pedidos' },
]

export default async function ContaPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <>
        <PageHeader
          kicker="A minha conta"
          title="Entrar ou criar conta"
          lead="Aceda à sua conta, ou registe-se com o seu e-mail para começar."
        />
        <Section>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border shadow-card md:grid-cols-2">
            <div className="bg-paper-card p-10">
              <p className="label text-emerald">Já tem conta</p>
              <h2 className="mt-4 text-h3 font-semibold tracking-tightish text-ink">Entrar</h2>
              <Button asChild size="lg" className="mt-6">
                <Link href="/entrar">Entrar</Link>
              </Button>
            </div>
            <div className="bg-paper-card p-10">
              <p className="label text-emerald">Novo por aqui</p>
              <h2 className="mt-4 text-h3 font-semibold tracking-tightish text-ink">Criar conta</h2>
              <Button asChild size="lg" variant="outline" className="mt-6">
                <Link href="/registar">Criar conta</Link>
              </Button>
            </div>
          </div>
        </Section>
      </>
    )
  }

  type MyAuthor = EditableAuthor & { status?: string; slug?: string }
  type ContentRow = { id: string; titulo: string; status: string }
  let authorFull: MyAuthor | null = null
  let myPosts: ContentRow[] = []
  let myEvents: ContentRow[] = []
  if (user.role === 'author') {
    const supabase = await createClient()
    const [{ data: a }, { data: posts }, { data: events }] = await Promise.all([
      supabase.from('authors').select('*').eq('owner', user.id).maybeSingle(),
      supabase
        .from('blog_posts')
        .select('id,titulo,status')
        .eq('owner', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('events')
        .select('id,titulo,status')
        .eq('owner', user.id)
        .order('created_at', { ascending: false }),
    ])
    authorFull = (a as MyAuthor) ?? null
    myPosts = (posts as ContentRow[]) ?? []
    myEvents = (events as ContentRow[]) ?? []
  }

  return (
    <>
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="label text-emerald">A minha conta</p>
            <h1 className="mt-2 text-h1 font-medium tracking-tightish text-ink">
              Olá, {user.name || 'bem-vindo'}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Tag variant="country">{roleLabels[user.role]}</Tag>
              <span className="text-small text-muted">{user.email}</span>
            </div>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-8 md:col-span-2">
            <p className="label text-emerald">Dados da conta</p>
            <h2 className="mt-2 text-h3 font-semibold tracking-tightish text-ink">O meu nome</h2>
            <form action={updateMyAccount} className="mt-5 flex flex-wrap items-end gap-4">
              <div className="min-w-[240px] flex-1">
                <Field label="Nome a apresentar" htmlFor="acc-name">
                  <Input id="acc-name" name="name" defaultValue={user.name ?? ''} required />
                </Field>
              </div>
              <Button type="submit">Guardar</Button>
            </form>
            <p className="mt-3 text-small text-muted">
              O email (<strong>{user.email}</strong>) e o papel são geridos pela editora.
            </p>
          </Card>

          {isStaff(user.role) ? (
            <Card className="bg-emerald p-8 text-paper md:col-span-2">
              <p className="label text-gold">Editora</p>
              <h2 className="mt-3 text-h3 font-semibold tracking-tightish text-paper">
                Painel de gestão
              </h2>
              <p className="mt-2 max-w-prose text-small text-paper/80">
                Gerir autores, livros, artigos, eventos, aprovações e pedidos de contacto.
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link href="/admin">Abrir painel</Link>
              </Button>
              <div className="mt-7 grid grid-cols-2 gap-2 border-t border-paper/15 pt-6 sm:grid-cols-3">
                {adminLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-sm bg-paper/10 px-4 py-2.5 text-center text-small text-paper transition-colors hover:bg-paper/20"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}

          {user.role === 'author' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3 md:col-span-2">
                <StatCard
                  label="Perfil"
                  value={authorFull?.status === 'published' ? 'Publicado' : 'Rascunho'}
                />
                <StatCard
                  label="Artigos"
                  value={`${myPosts.filter((p) => p.status === 'published').length} pub · ${myPosts.filter((p) => p.status !== 'published').length} rascunho`}
                />
                <StatCard
                  label="Eventos"
                  value={`${myEvents.filter((e) => e.status === 'published').length} pub · ${myEvents.filter((e) => e.status !== 'published').length} rascunho`}
                />
              </div>

              <Card className="p-8 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-h3 font-semibold tracking-tightish text-ink">
                    {authorFull?.nome ?? 'O meu perfil'}
                  </h2>
                  {authorFull ? (
                    <Tag variant={authorFull.status === 'published' ? 'country' : 'gold'}>
                      {authorFull.status === 'published'
                        ? 'Publicado'
                        : 'Rascunho — a aguardar aprovação'}
                    </Tag>
                  ) : null}
                </div>

                {authorFull ? (
                  <>
                    {authorFull.status === 'published' && authorFull.slug ? (
                      <Button asChild variant="outline" size="sm" className="mt-4">
                        <Link href={`/autores/${authorFull.slug}`}>Ver perfil público</Link>
                      </Button>
                    ) : null}

                    <div className="mt-8 border-t border-border pt-8">
                      <p className="label text-emerald">Editar</p>
                      <h3 className="mt-2 text-h3 font-semibold tracking-tightish text-ink">
                        O meu perfil público
                      </h3>
                      <AuthorProfileForm author={authorFull} action={updateMyAuthorProfile} />
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-small text-ink-soft">
                    Ainda não tem um perfil de autor associado. Contacte a editora.
                  </p>
                )}
              </Card>

              <Card className="p-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-h3 font-semibold tracking-tightish text-ink">
                    Os meus artigos
                  </h3>
                  <Button asChild size="sm">
                    <Link href="/conta/artigos/novo">Novo</Link>
                  </Button>
                </div>
                <ContentList
                  items={myPosts}
                  basePath="/conta/artigos"
                  emptyText="Ainda não submeteu artigos."
                />
              </Card>

              <Card className="p-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-h3 font-semibold tracking-tightish text-ink">
                    Os meus eventos
                  </h3>
                  <Button asChild size="sm">
                    <Link href="/conta/eventos/novo">Novo</Link>
                  </Button>
                </div>
                <ContentList
                  items={myEvents}
                  basePath="/conta/eventos"
                  emptyText="Ainda não submeteu eventos."
                />
              </Card>
            </>
          ) : null}

          {user.role === 'reader' ? (
            <Card className="p-8 md:col-span-2">
              <p className="label text-emerald">Conta de leitor</p>
              <h2 className="mt-3 text-h3 font-semibold tracking-tightish text-ink">
                Bem-vindo à Ponto de Vista
              </h2>
              <p className="mt-2 max-w-prose text-small text-ink-soft">
                A sua conta está ativa. Quer publicar e tornar-se autor da editora? Envie-nos a sua
                proposta — a editora concede o acesso de autor.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href="/publicar">Quero publicar</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/autores">Explorar autores</Link>
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </Section>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="label text-muted">{label}</p>
      <p className="mt-1 font-medium text-ink">{value}</p>
    </Card>
  )
}

function ContentList({
  items,
  basePath,
  emptyText,
}: {
  items: { id: string; titulo: string; status: string }[]
  basePath: string
  emptyText: string
}) {
  if (items.length === 0) {
    return <p className="mt-4 text-small text-muted">{emptyText}</p>
  }
  return (
    <ul className="mt-4 divide-y divide-border">
      {items.map((it) => (
        <li key={it.id} className="flex items-center justify-between gap-3 py-3">
          <span className="min-w-0 flex-1 truncate text-small text-ink">{it.titulo}</span>
          <Tag variant={it.status === 'published' ? 'country' : 'gold'}>
            {it.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Tag>
          <Link
            href={`${basePath}/${it.id}`}
            className="text-label uppercase text-emerald hover:text-emerald-deep"
          >
            Editar
          </Link>
        </li>
      ))}
    </ul>
  )
}
