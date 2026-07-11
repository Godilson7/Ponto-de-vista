'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'

export function NewPasswordForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(event.currentTarget)
    const password = String(fd.get('password'))
    const confirm = String(fd.get('confirm'))

    if (password !== confirm) {
      setError('As palavras-passe não coincidem.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({ password })
    if (authError) {
      setError(
        'Não foi possível alterar a palavra-passe. O link pode ter expirado — peça um novo.',
      )
      setLoading(false)
      return
    }
    router.push('/conta')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <p className="border border-gold/50 bg-gold/10 px-4 py-3 text-small text-ink">{error}</p>
      ) : null}
      <Field label="Nova palavra-passe" htmlFor="password" required hint="Mínimo 6 caracteres.">
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>
      <Field label="Confirmar palavra-passe" htmlFor="confirm" required>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'A guardar…' : 'Guardar nova palavra-passe'}
      </Button>
    </form>
  )
}
