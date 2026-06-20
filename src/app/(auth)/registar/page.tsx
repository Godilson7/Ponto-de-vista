import * as React from 'react'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'
import { RegisterForm } from '@/components/auth/register-form'

export const dynamic = 'force-dynamic'

export default async function RegistarPage() {
  const user = await getCurrentUser()
  if (user) redirect('/conta')

  return (
    <div className="animate-fade-up">
      <p className="label mb-3 text-emerald">Área do Autor</p>
      <h1 className="text-h2 font-medium tracking-tightish text-ink">Criar conta</h1>
      <p className="mt-3 text-body text-ink-soft">
        Registe-se com o seu e-mail. Criamos um perfil de autor que poderá completar — fica visível
        depois de aprovado pela editora.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  )
}
