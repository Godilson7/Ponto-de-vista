import * as React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo'
import { Section, SectionHeading } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/sections/page-hero'
import { StatsBand, type Stat } from '@/components/sections/stats-band'

export const metadata: Metadata = buildMetadata({
  title: 'A Editora',
  description:
    'A Ponto de Vista Editora não publica apenas livros. Ajuda autores a posicionar a sua mensagem, a sua história e a sua autoridade no mundo.',
  path: '/a-editora',
})

const valores = [
  { title: 'Rigor', text: 'Cada texto é tratado com seriedade editorial, da primeira leitura à impressão.' },
  { title: 'Permanência', text: 'Publicamos para durar. Construímos autoridade, não modas.' },
  { title: 'Internacionalidade', text: 'A língua portuguesa é uma só, distribuída por vários mundos.' },
  { title: 'Respeito pela voz', text: 'Servimos a mensagem do autor — não a substituímos.' },
]

const stats: Stat[] = [
  { value: '2018', label: 'Fundada em' },
  { value: '3', label: 'Continentes' },
  { value: '20+', label: 'Autores' },
  { value: '8', label: 'Áreas de autoridade' },
]

export default function AEditoraPage() {
  return (
    <>
      <PageHero
        variant="a-editora"
        kicker="A Casa"
        title="A Ponto de Vista Editora não publica apenas livros."
        lead="Ajudamos autores a posicionar a sua mensagem, a sua história e a sua autoridade no mundo."
        cta={{ label: 'Publicar o meu livro', href: '/publicar' }}
        ctaSecondary={{ label: 'Conhecer os autores', href: '/autores' }}
      />

      {/* História */}
      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeading title="A nossa história" kicker="Origem" />
          </div>
          <div className="md:col-span-8">
            <p className="prose-editorial max-w-none">
              Nascemos da convicção de que existem vozes de língua portuguesa cuja autoridade ainda
              não encontrou a plataforma certa. Autores com conhecimento, experiência e histórias
              que merecem alcançar leitores em Portugal, no Brasil e em África — e além.
            </p>
            <p className="prose-editorial mt-4 max-w-none">
              Construímos uma editora que funciona como um conselho: cada autor entra para uma rede
              internacional de referências, com um processo editorial cuidado e um posicionamento
              que projeta a sua mensagem para o mundo.
            </p>
          </div>
        </div>
      </Section>

      {/* Missão / Visão */}
      <Section muted bare>
        <Container>
          <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <div className="bg-paper-card p-10">
              <p className="label text-emerald">Missão</p>
              <p className="mt-5 font-serif text-2xl italic leading-snug text-ink">
                Transformar autores em referências, dando à sua mensagem estrutura, permanência e
                alcance internacional.
              </p>
            </div>
            <div className="bg-paper-card p-10">
              <p className="label text-emerald">Visão</p>
              <p className="mt-5 font-serif text-2xl italic leading-snug text-ink">
                Ser a casa de autoridade da língua portuguesa — uma ponte entre quem tem algo a dizer
                e o mundo que precisa de ouvir.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Valores */}
      <Section>
        <SectionHeading kicker="Princípios" title="Os nossos valores" />
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {valores.map((v) => (
            <div key={v.title} className="bg-paper p-8">
              <span className="gold-rule" aria-hidden="true" />
              <h3 className="mt-5 text-h3 font-medium tracking-tightish text-ink">{v.title}</h3>
              <p className="mt-3 text-small leading-relaxed text-ink-soft">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Faixa de estatísticas */}
      <StatsBand stats={stats} />

      {/* Equipa & Parceiros */}
      <Section muted>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Conselho editorial" title="A equipa" />
            <p className="prose-editorial mt-6 max-w-none">
              Uma equipa de editores, revisores e designers acompanha cada obra com o cuidado de uma
              fundação cultural — do manuscrito à estratégia de posicionamento internacional do autor.
            </p>
          </div>
          <div>
            <SectionHeading kicker="Rede" title="Parceiros" />
            <p className="prose-editorial mt-6 max-w-none">
              Trabalhamos com gráficas, distribuidores e plataformas internacionais para garantir que
              cada livro chega ao seu público — em três continentes.
            </p>
          </div>
        </div>
      </Section>

      {/* Diferencial / CTA */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="label mb-6 text-emerald">O nosso diferencial</p>
          <h2 className="text-h1 font-medium tracking-tightish text-ink">
            Publicação + Posicionamento + Autoridade Internacional.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-body text-ink-soft">
            Não terminamos no livro. Damos a cada autor uma página de autoridade, uma rede
            internacional e um posicionamento que dura.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/publicar">Publicar o meu livro</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/autores">Conhecer os autores</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
