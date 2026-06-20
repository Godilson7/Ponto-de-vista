import * as React from 'react'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'

export const dynamic = 'force-dynamic'

export default async function EntrarPage() {
  const user = await getCurrentUser()
  if (user) redirect('/conta')

  return (
    <div className="animate-fade-up">
      <p className="label mb-3 text-emerald">Área do Autor</p>
      <h1 className="text-h2 font-medium tracking-tightish text-ink">Entrar</h1>
      <p className="mt-3 text-body text-ink-soft">
        Aceda à sua conta para gerir o seu perfil de autor.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  )
}
