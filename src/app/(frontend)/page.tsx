import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { getFeaturedAuthors, getFeaturedBooks, getBooks, getHomeHighlights } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { AuthorCard } from '@/components/cards/author-card'
import { BookCard } from '@/components/cards/book-card'
import { HighlightsCarousel } from '@/components/sections/highlights-carousel'
import { StatsBand, type Stat } from '@/components/sections/stats-band'
import { Reveal } from '@/components/motion/reveal'

export const metadata: Metadata = buildMetadata({ path: '/' })

export const revalidate = 60

const stats: Stat[] = [
  { value: '20+', label: 'Autores' },
  { value: '8', label: 'Áreas de autoridade' },
  { value: '50+', label: 'Palestras' },
  { value: '3', label: 'Continentes' },
]

const reasons = [
  {
    title: 'Publicação profissional',
    text: 'Da avaliação à impressão, um processo editorial rigoroso e cuidado em cada etapa.',
  },
  {
    title: 'Edição e preparação',
    text: 'Revisão, organização e preparação de texto por uma equipa experiente.',
  },
  {
    title: 'Design editorial',
    text: 'Capa e miolo com identidade visual à altura da sua mensagem.',
  },
  {
    title: 'ISBN e distribuição',
    text: 'Registo ISBN quando aplicável e presença nos canais certos.',
  },
  {
    title: 'Posicionamento de autoridade',
    text: 'Transformamos o livro numa plataforma que projeta o autor como referência.',
  },
  {
    title: 'Perfil exclusivo de autor',
    text: 'Uma página de autoridade profissional, otimizada para ser encontrada.',
  },
]

const presence = [
  { place: 'Portugal', city: 'Lisboa', note: 'A raiz europeia da nossa língua.' },
  { place: 'Brasil', city: 'São Paulo', note: 'A maior comunidade leitora lusófona.' },
  { place: 'África Lusófona', city: 'Luanda', note: 'Vozes que o mundo precisa de ouvir.' },
]

export default async function HomePage() {
  const [featuredAuthors, featuredBooks, allBooks, highlights] = await Promise.all([
    getFeaturedAuthors(),
    getFeaturedBooks(),
    getBooks(),
    getHomeHighlights(),
  ])
  const gridBooks = featuredBooks.length ? featuredBooks : allBooks.slice(0, 6)

  return (
    <>
      <HighlightsCarousel items={highlights} />

      {/* Quem somos */}
      <Section>
        <Reveal className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label mb-4 text-emerald">Quem somos</p>
            <h2 className="text-h2 font-medium tracking-tightish text-ink">
              Uma casa de autores, não uma loja de livros.
            </h2>
            <span className="gold-rule mt-6" aria-hidden="true" />
          </div>
          <div className="md:col-span-7">
            <p className="prose-editorial max-w-none">
              A Ponto de Vista Editora é uma editora internacional de língua portuguesa, com autores
              de Portugal, Brasil e África Lusófona. Trabalhamos como um conselho: cada autor é uma
              voz com área de autoridade própria, e o nosso papel é dar-lhe estrutura, permanência e
              alcance.
            </p>
            <p className="prose-editorial mt-4 max-w-none">
              Publicamos com gravidade institucional e ambição internacional — porque uma boa
              história merece ser lida, e uma voz com autoridade merece ser ouvida.
            </p>
            <Button asChild variant="link" className="mt-6">
              <Link href="/a-editora">Conhecer a editora →</Link>
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* Presença internacional */}
      <Section muted>
        <Reveal>
          <SectionHeading
            kicker="Presença internacional"
            title="Da língua portuguesa para o mundo."
            lead="Estamos onde os autores estão — e levamos as suas vozes mais longe."
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          {presence.map((p, i) => (
            <Reveal key={p.place} delay={i * 90} className="bg-paper-card">
              <div className="group h-full p-8 transition-colors hover:bg-paper">
                <p className="label text-emerald">{p.place}</p>
                <p className="mt-3 font-serif text-2xl italic text-ink">{p.city}</p>
                <p className="mt-3 text-small leading-relaxed text-ink-soft">{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Autores em destaque */}
      <Section>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading kicker="O conselho" title="Autores em destaque" className="max-w-xl" />
          <Button asChild variant="outline" size="sm">
            <Link href="/autores">Ver todos os autores</Link>
          </Button>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredAuthors.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <AuthorCard
                name={a.nome}
                positioning={a.fraseDePosicionamento}
                area={a.area}
                country={a.pais}
                city={a.cidade}
                imageUrl={a.fotoUrl}
                href={`/autores/${a.slug}`}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Livros em destaque */}
      <Section muted>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading kicker="Catálogo" title="Livros em destaque" className="max-w-xl" />
          <Button asChild variant="outline" size="sm">
            <Link href="/livros">Ver todos os livros</Link>
          </Button>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
          {gridBooks.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 6) * 60}>
              <BookCard book={b} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Por que publicar connosco */}
      <Section>
        <Reveal>
          <SectionHeading
            kicker="Por que publicar connosco"
            title="Publicação, posicionamento e autoridade."
            lead="Não entregamos apenas um livro impresso. Construímos a plataforma de autoridade que o sustenta."
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 90} className="bg-paper">
              <div className="group h-full p-8 transition-colors hover:bg-paper-card">
                <span className="gold-rule transition-[width] duration-300 group-hover:w-24" aria-hidden="true" />
                <h3 className="mt-5 text-h3 font-medium tracking-tightish text-ink">{r.title}</h3>
                <p className="mt-3 text-small leading-relaxed text-ink-soft">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Faixa de estatísticas */}
      <StatsBand stats={stats} />

      {/* Chamada final */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="label mb-6 text-emerald">A sua vez</p>
          <h2 className="text-h1 font-medium tracking-tightish text-ink">
            Tem uma história, conhecimento ou experiência para partilhar?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-body text-ink-soft">
            Conte-nos sobre o seu projeto. Avaliamos cada proposta com a seriedade que merece.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/publicar">Quero publicar o meu livro</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/a-editora">Conhecer a editora</Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
