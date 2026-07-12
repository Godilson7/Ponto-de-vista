import * as React from 'react'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { Section, SectionHeading } from '@/components/ui/section'
import { PageHeader } from '@/components/sections/page-header'
import { ContactForm } from '@/components/forms/contact-form'

export const metadata: Metadata = buildMetadata({
  title: 'Publicar um livro',
  description:
    'Publique com a Ponto de Vista Editora: avaliação, edição, design editorial, publicação e posicionamento de autoridade internacional.',
  path: '/publicar',
})

const steps = [
  {
    n: '01',
    title: 'Avaliação',
    text: 'Lemos e avaliamos a sua proposta com seriedade. Cada projeto é único.',
  },
  {
    n: '02',
    title: 'Organização',
    text: 'Estruturamos a obra: índice, argumento e plano editorial.',
  },
  {
    n: '03',
    title: 'Edição e revisão',
    text: 'Preparação de texto, revisão e aprimoramento por uma equipa experiente.',
  },
  {
    n: '04',
    title: 'Design editorial',
    text: 'Capa e miolo com identidade visual à altura da sua mensagem.',
  },
  {
    n: '05',
    title: 'Publicação',
    text: 'Impressão e/ou edição digital, com ISBN registado quando aplicável.',
  },
  {
    n: '06',
    title: 'Divulgação e posicionamento',
    text: 'Página de autor, rede internacional e estratégia de autoridade.',
  },
]

export default function PublicarPage() {
  return (
    <>
      <PageHeader
        kicker="Publicar"
        title="Publique com a Ponto de Vista Editora."
        lead="Não entregamos apenas um livro impresso — construímos a plataforma de autoridade que o sustenta. Conheça o processo e diga-nos do seu projeto."
      />

      {/* Processo em 6 passos */}
      <Section>
        <SectionHeading
          kicker="Como funciona"
          title="Da ideia à autoridade, em seis passos."
        />
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="group bg-paper p-8 transition-colors duration-300 hover:bg-paper-card"
            >
              <p className="font-sans text-4xl font-medium tracking-tightish text-emerald/30 transition-colors duration-300 group-hover:text-emerald/60">
                {step.n}
              </p>
              <h3 className="mt-4 text-h3 font-medium tracking-tightish text-ink">{step.title}</h3>
              <p className="mt-3 text-small leading-relaxed text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Formulário de interesse */}
      <Section muted id="contacto">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeading
              kicker="O primeiro passo"
              title="Conte-nos sobre o seu livro."
              lead="Preencha o formulário. Avaliamos cada proposta com a seriedade que merece."
            />
          </div>
          <div className="md:col-span-8">
            <ContactForm tipo="publicar" id="publicar-form" />
          </div>
        </div>
      </Section>
    </>
  )
}
