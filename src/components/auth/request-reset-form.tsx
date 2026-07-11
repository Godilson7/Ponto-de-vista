'use client'

import * as React from 'react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'

export function RequestResetForm() {
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(event.currentTarget)
    const email = String(fd.get('email')).trim()

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/recuperar/nova-palavra-passe`,
    })

    setLoading(false)
    if (authError) {
      setError('Não foi possível enviar agora. Tente novamente dentro de instantes.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <p className="border border-em bg-paper-card px-4 py-4 text-small text-ink-soft">
        Se existir uma conta com esse e-mail, enviámos um link para redefinir a
        palavra-passe. Verifique também a pasta de spam.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <p className="border border-gold/50 bg-gold/10 px-4 py-3 text-small text-ink">{error}</p>
      ) : null}
      <Field label="E-mail" htmlFor="email" required>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'A enviar…' : 'Enviar link de recuperação'}
      </Button>
      <p className="text-center text-small text-muted">
        Lembrou-se?{' '}
        <Link href="/entrar" className="text-emerald underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
