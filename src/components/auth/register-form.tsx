'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(event.currentTarget)
    const email = String(fd.get('email'))
    const password = String(fd.get('password'))
    const name = String(fd.get('name'))

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (authError) {
      setError(authError.message || 'Não foi possível criar a conta.')
      setLoading(false)
      return
    }

    // Com "Confirm email" desativado, a sessão é criada de imediato.
    if (data.session) {
      router.push('/conta')
      router.refresh()
    } else {
      router.push('/entrar?registado=1')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <p className="border border-gold/50 bg-gold/10 px-4 py-3 text-small text-ink">{error}</p>
      ) : null}
      <Field label="Nome" htmlFor="name" required>
        <Input id="name" name="name" required autoComplete="name" />
      </Field>
      <Field label="E-mail" htmlFor="email" required>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Palavra-passe" htmlFor="password" required hint="Mínimo 6 caracteres.">
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'A criar conta…' : 'Criar conta'}
      </Button>
      <p className="text-center text-small text-muted">
        Já tem conta?{' '}
        <Link href="/entrar" className="text-emerald underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
