'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

import { subscribeNewsletter } from '@/lib/contact'

/** Subscrição da newsletter no rodapé — input + botão, estado de sucesso. */
export function NewsletterForm() {
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const email = String(fd.get('email') || '').trim()
    setLoading(true)
    setError(null)
    const res = await subscribeNewsletter(email)
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <p className="inline-flex items-center gap-2 text-small text-paper/80">
        <Check className="size-4 text-gold" /> Obrigado — subscrição registada.
      </p>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          E-mail
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="O seu e-mail"
          className="h-11 w-full rounded-sm border border-paper/20 bg-transparent px-4 text-small text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 shrink-0 rounded-sm bg-gold px-6 text-xs font-medium uppercase tracking-[0.14em] text-ink transition-[filter] hover:brightness-95 disabled:opacity-50"
        >
          {loading ? '…' : 'Subscrever'}
        </button>
      </form>
      {error ? <p className="mt-2 text-small text-gold">{error}</p> : null}
    </div>
  )
}
