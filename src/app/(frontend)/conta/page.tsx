import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getCurrentUser, getMyAuthorProfile, isStaff, type AppRole } from '@/lib/auth'
import { Section } from '@/components/ui/section'
import { PageHeader } from '@/components/sections/page-header'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Card } from '@/components/ui/card'
import { LogoutButton } from '@/components/auth/logout-button'

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

  const profile = user.role === 'author' ? await getMyAuthorProfile(user.id) : null

  return (
    <>
      <PageHeader kicker="A minha conta" title={`Olá, ${user.name || user.email}`} />
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Tag variant="country">{roleLabels[user.role]}</Tag>
            <span className="text-small text-muted">{user.email}</span>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {isStaff(user.role) ? (
            <Card className="bg-emerald p-8 text-paper md:col-span-2">
              <p className="label text-gold">Editora</p>
              <h2 className="mt-3 text-h3 font-semibold tracking-tightish">Painel de gestão</h2>
              <p className="mt-2 text-small text-paper/80">
                Gerir autores, livros, artigos, permissões e pedidos de contacto.
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link href="/admin">Abrir painel</Link>
              </Button>
            </Card>
          ) : null}

          {user.role === 'author' ? (
            <Card className="p-8 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h3 font-semibold tracking-tightish text-ink">
                  {profile?.nome ?? 'O meu perfil'}
                </h2>
                {profile ? (
                  <Tag variant={profile.status === 'published' ? 'country' : 'gold'}>
                    {profile.status === 'published'
                      ? 'Publicado'
                      : 'Rascunho — a aguardar aprovação'}
                  </Tag>
                ) : null}
              </div>
              <p className="mt-3 text-small text-ink-soft">
                {profile
                  ? 'O seu perfil fica público após aprovação da editora.'
                  : 'Ainda não tem um perfil de autor associado. Contacte a editora.'}
              </p>
              {profile?.status === 'published' ? (
                <Button asChild variant="outline" size="sm" className="mt-6">
                  <Link href={`/autores/${profile.slug}`}>Ver perfil público</Link>
                </Button>
              ) : null}
            </Card>
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
