import * as React from 'react'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'
import { NewPasswordForm } from '@/components/auth/new-password-form'

export const dynamic = 'force-dynamic'

export default async function NovaPalavraPassePage() {
  // Só se chega aqui com uma sessão de recuperação ativa (criada pelo /auth/callback).
  const user = await getCurrentUser()
  if (!user) redirect('/recuperar')

  return (
    <div className="animate-fade-up">
      <p className="label mb-3 text-emerald">Área do Autor</p>
      <h1 className="text-h2 font-medium tracking-tightish text-ink">Nova palavra-passe</h1>
      <p className="mt-3 text-body text-ink-soft">
        Defina a nova palavra-passe para <strong className="text-ink">{user.email}</strong>.
      </p>
      <div className="mt-8">
        <NewPasswordForm />
      </div>
    </div>
  )
}
