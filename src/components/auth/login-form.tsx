'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(event.currentTarget)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(fd.get('email')),
      password: String(fd.get('password')),
    })

    if (authError) {
      setError('Email ou palavra-passe incorretos.')
      setLoading(false)
      return
    }
    router.push(next || '/')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <p className="border border-gold/50 bg-gold/10 px-4 py-3 text-small text-ink">{error}</p>
      ) : null}
      <Field label="E-mail" htmlFor="email" required>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Palavra-passe" htmlFor="password" required>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </Field>
      <div className="text-right">
        <Link href="/recuperar" className="text-small text-emerald underline-offset-4 hover:underline">
          Esqueci-me da palavra-passe
        </Link>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'A entrar…' : 'Entrar'}
      </Button>
      <p className="text-center text-small text-muted">
        Ainda não tem conta?{' '}
        <Link href="/registar" className="text-emerald underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
