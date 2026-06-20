import * as React from 'react'
import Link from 'next/link'

import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Section className="py-section">
      <div className="mx-auto max-w-xl text-center">
        <p className="label mb-6 text-emerald">Erro 404</p>
        <h1 className="text-h1 font-medium tracking-tightish text-ink md:text-display">
          Página não encontrada.
        </h1>
        <span className="gold-rule mx-auto mt-8" aria-hidden="true" />
        <p className="mx-auto mt-8 max-w-md text-body text-ink-soft">
          A página que procura não existe ou foi movida. Regresse ao início ou explore os nossos
          autores e livros.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/autores">Ver autores</Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
