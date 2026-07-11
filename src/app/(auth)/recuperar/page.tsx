import * as React from 'react'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'
import { RequestResetForm } from '@/components/auth/request-reset-form'

export const dynamic = 'force-dynamic'

export default async function RecuperarPage() {
  const user = await getCurrentUser()
  if (user) redirect('/conta')

  return (
    <div className="animate-fade-up">
      <p className="label mb-3 text-emerald">Área do Autor</p>
      <h1 className="text-h2 font-medium tracking-tightish text-ink">Recuperar acesso</h1>
      <p className="mt-3 text-body text-ink-soft">
        Indique o seu e-mail e enviamos um link para definir uma nova palavra-passe.
      </p>
      <div className="mt-8">
        <RequestResetForm />
      </div>
    </div>
  )
}
