'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

import { siteConfig } from '@/lib/site'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Select } from '@/components/ui/field'

type Tipo = 'publicar' | 'contacto-autor' | 'convite-palestra' | 'geral'

export function ContactForm({
  tipo,
  autorNome,
  id,
}: {
  tipo: Tipo
  autorNome?: string
  id?: string
}) {
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    if (fd.get('website')) return // honeypot

    setLoading(true)
    setError(null)

    const get = (k: string) => (fd.get(k) as string)?.trim() || ''
    const mensagemBase = get('mensagem')
    const mensagem = autorNome ? `[Autor: ${autorNome}] ${mensagemBase}` : mensagemBase

    const supabase = createClient()
    const { error: dbError } = await supabase.from('contact_requests').insert({
      tipo,
      nome: get('nome'),
      email: get('email'),
      whatsapp: get('whatsapp') || null,
      pais: get('pais') || null,
      tema: get('tema') || null,
      livro_ja_escrito: /^sim/i.test(get('livroEscrito')),
      objetivo: get('objetivo') || null,
      mensagem,
    })

    setLoading(false)
    if (dbError) {
      setError('Não foi possível enviar agora. Tente novamente ou escreva-nos por e-mail.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex items-start gap-4 rounded-md border border-em bg-paper-card p-6 shadow-card">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald text-paper">
          <Check className="size-4" />
        </span>
        <div>
          <p className="font-medium text-ink">Mensagem enviada. Obrigado!</p>
          <p className="mt-2 text-small text-ink-soft">
            A editora entrará em contacto. Em alternativa, escreva para{' '}
            <a className="text-emerald underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      </div>
    )
  }

  const isPublicar = tipo === 'publicar'

  return (
    <form id={id} onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {error ? (
        <p className="border border-gold/50 bg-gold/10 px-4 py-3 text-small text-ink sm:col-span-2">
          {error}
        </p>
      ) : null}

      <Field label="Nome" htmlFor="nome" required>
        <Input id="nome" name="nome" required autoComplete="name" />
      </Field>
      <Field label="E-mail" htmlFor="email" required>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Field label="WhatsApp" htmlFor="whatsapp">
        <Input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" />
      </Field>
      <Field label="País" htmlFor="pais">
        <Input id="pais" name="pais" autoComplete="country-name" />
      </Field>

      {isPublicar ? (
        <>
          <Field label="Tema do livro" htmlFor="tema">
            <Input id="tema" name="tema" />
          </Field>
          <Field label="O livro já está escrito?" htmlFor="livroEscrito">
            <Select id="livroEscrito" name="livroEscrito" defaultValue="">
              <option value="" disabled>
                Selecione…
              </option>
              <option value="Sim, está concluído">Sim, está concluído</option>
              <option value="Em parte">Em parte</option>
              <option value="Ainda não">Ainda não</option>
            </Select>
          </Field>
          <Field label="Objetivo" htmlFor="objetivo" className="sm:col-span-2">
            <Input id="objetivo" name="objetivo" placeholder="O que pretende alcançar ao publicar?" />
          </Field>
        </>
      ) : null}

      <Field label="Mensagem" htmlFor="mensagem" required className="sm:col-span-2">
        <Textarea
          id="mensagem"
          name="mensagem"
          required
          placeholder={
            tipo === 'convite-palestra'
              ? `Conte-nos sobre o evento e o convite${autorNome ? ` para ${autorNome}` : ''}.`
              : 'A sua mensagem…'
          }
        />
      </Field>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'A enviar…' : isPublicar ? 'Quero publicar o meu livro' : 'Enviar mensagem'}
        </Button>
      </div>
    </form>
  )
}
