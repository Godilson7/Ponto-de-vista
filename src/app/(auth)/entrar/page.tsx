import * as React from 'react'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'

export const dynamic = 'force-dynamic'

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ registado?: string; erro?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect('/conta')

  const sp = await searchParams
  const aviso = sp.registado
    ? 'Conta criada. Se a confirmação por email estiver ativa, verifique a sua caixa de correio para ativar o acesso.'
    : null
  const erro =
    sp.erro === 'link-invalido'
      ? 'O link expirou ou já foi usado. Peça uma nova recuperação de palavra-passe.'
      : null

  return (
    <div className="animate-fade-up">
      <p className="label mb-3 text-emerald">Área do Autor</p>
      <h1 className="text-h2 font-medium tracking-tightish text-ink">Entrar</h1>
      <p className="mt-3 text-body text-ink-soft">
        Aceda à sua conta para gerir o seu perfil de autor.
      </p>
      {aviso ? (
        <p className="mt-6 border border-em bg-paper-card px-4 py-3 text-small text-ink-soft">
          {aviso}
        </p>
      ) : null}
      {erro ? (
        <p className="mt-6 border border-gold/50 bg-gold/10 px-4 py-3 text-small text-ink">
          {erro}
        </p>
      ) : null}
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  )
}
