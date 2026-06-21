import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Mic, MapPin, PlayCircle, Mail } from 'lucide-react'

import { buildMetadata, authorJsonLd, breadcrumbJsonLd } from '@/lib/seo'
import { buildMailtoUrl } from '@/lib/site'
import {
  getAuthors,
  getAuthorBySlug,
  getBooksByAuthor,
  getPostsByAuthorName,
  formatDatePt,
} from '@/lib/content'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Card, CardSection } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { BookCard } from '@/components/cards/book-card'
import { PostCard } from '@/components/cards/post-card'
import { JsonLd } from '@/components/seo/json-ld'
import { ContactForm } from '@/components/forms/contact-form'
import { RichText } from '@/components/rich-text'
import { toEmbedUrl } from '@/lib/video'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return buildMetadata({ title: 'Autor não encontrado', noIndex: true })
  return buildMetadata({
    title: author.nome,
    description: `${author.fraseDePosicionamento} — ${author.miniBio}`,
    path: `/autores/${slug}`,
  })
}

const participationLabels: Record<string, string> = {
  evento: 'Evento',
  entrevista: 'Entrevista',
  podcast: 'Podcast',
}

export default async function AutorPage({ params }: Params) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const [books, articles] = await Promise.all([
    getBooksByAuthor(slug),
    getPostsByAuthorName(author.nome),
  ])
  const embedUrl = toEmbedUrl(author.videoUrl)
  const inviteMessage = `Olá! Gostaria de convidar ${author.nome} para uma palestra/entrevista.`

  return (
    <>
      <JsonLd data={authorJsonLd(author)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Início', path: '/' },
          { name: 'Autores', path: '/autores' },
          { name: author.nome, path: `/autores/${author.slug}` },
        ])}
      />

      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-emerald via-emerald to-emerald-deep md:h-56">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
      </div>

      <Container className="pb-section-sm md:pb-section">
        {/* Cabeçalho de perfil */}
        <Card className="-mt-16 p-6 md:-mt-20 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-7">
            <Avatar
              name={author.nome}
              src={author.fotoUrl}
              size={140}
              className="-mt-20 bg-paper-card ring-4 ring-paper-card md:-mt-28"
            />
            <div className="flex-1">
              <h1 className="text-h1 font-semibold tracking-tightish text-ink">{author.nome}</h1>
              <p className="mt-2 font-serif text-2xl italic leading-snug text-ink-soft">
                {author.fraseDePosicionamento}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-emerald" />
                  {[author.cidade, author.pais].filter(Boolean).join(', ')}
                </span>
                <span className="text-emerald">{author.area}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Button asChild>
              <a href={buildMailtoUrl(`Convite — ${author.nome}`, inviteMessage)}>
                <Mic className="size-4" /> Convidar
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="#contacto">
                <Mail className="size-4" /> Contactar
              </Link>
            </Button>
            {author.redesSociais.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-label uppercase text-emerald transition-colors hover:text-emerald-deep"
              >
                {s.plataforma}
                <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        </Card>

        {/* Conteúdo: principal + barra lateral */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {/* Sobre */}
            <CardSection kicker="Sobre" title="Biografia">
              {author.miniBio ? (
                <p className="mb-4 font-serif text-xl italic leading-relaxed text-ink-soft">
                  {author.miniBio}
                </p>
              ) : null}
              <RichText content={author.bioCompleta} />
            </CardSection>

            {/* Livros */}
            {books.length > 0 ? (
              <CardSection kicker="Publicações" title="Livros publicados">
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
                  {books.map((b) => (
                    <BookCard key={b.slug} book={b} />
                  ))}
                </div>
              </CardSection>
            ) : null}

            {/* Participações */}
            {author.participacoes.length > 0 ? (
              <CardSection kicker="Atividade" title="Participações">
                <ul className="divide-y divide-border">
                  {author.participacoes.map((p, i) => (
                    <li key={i} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Tag variant="gold">{participationLabels[p.tipo] ?? p.tipo}</Tag>
                        <span className="text-body text-ink">{p.titulo}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {p.data ? <span className="text-small text-muted">{p.data}</span> : null}
                        {p.link ? (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-label uppercase text-emerald hover:text-emerald-deep"
                          >
                            Ver <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardSection>
            ) : null}

            {/* Artigos */}
            {articles.length > 0 ? (
              <CardSection kicker="No blog" title="Artigos publicados">
                <div className="grid gap-6 sm:grid-cols-2">
                  {articles.map((p) => (
                    <PostCard
                      key={p.slug}
                      title={p.titulo}
                      excerpt={p.resumo}
                      categoryName={p.categoriaNome}
                      categorySlug={p.categoria}
                      author={p.autorNome}
                      date={formatDatePt(p.publishedAt)}
                      href={`/blog/${p.slug}`}
                    />
                  ))}
                </div>
              </CardSection>
            ) : null}

            {/* Vídeo */}
            {author.videoUrl ? (
              <CardSection kicker="Apresentação" title="Vídeo">
                {embedUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-ink">
                    <iframe
                      src={embedUrl}
                      title={`Vídeo de apresentação de ${author.nome}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ) : (
                  <Button asChild variant="outline">
                    <a href={author.videoUrl} target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="size-4" /> Ver vídeo
                    </a>
                  </Button>
                )}
              </CardSection>
            ) : null}

            {/* Galeria */}
            {author.galeria.length > 0 ? (
              <CardSection kicker="Imagens" title="Galeria">
                <div className="grid gap-4 sm:grid-cols-3">
                  {author.galeria.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden rounded-sm bg-emerald/5"
                    >
                      <Image
                        src={src}
                        alt={`${author.nome} — imagem ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardSection>
            ) : null}

            {/* Contacto */}
            <CardSection id="contacto" kicker="Falar com o autor" title={`Contactar ${author.nome.split(' ')[0]}`}>
              <p className="mb-6 text-small text-ink-soft">
                Para convites, entrevistas, parcerias ou imprensa.
              </p>
              <ContactForm tipo="convite-palestra" autorNome={author.nome} id="contacto-form" />
            </CardSection>
          </div>

          {/* Barra lateral */}
          <aside className="space-y-8 lg:col-span-4">
            <CardSection kicker="Especialidade" title="Áreas de autoridade">
              <ul className="flex flex-wrap gap-2">
                {author.areasDeAutoridade.map((a) => (
                  <li key={a}>
                    <Tag variant="area">{a}</Tag>
                  </li>
                ))}
              </ul>
            </CardSection>

            {author.redesSociais.length > 0 ? (
              <CardSection kicker="Online" title="Redes">
                <ul className="space-y-3">
                  {author.redesSociais.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-small text-emerald transition-colors hover:text-emerald-deep"
                      >
                        {s.plataforma}
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </CardSection>
            ) : null}

            <Card className="bg-emerald p-8 text-paper">
              <p className="label text-gold">Convite</p>
              <p className="mt-3 font-serif text-2xl italic leading-snug">
                Convide {author.nome.split(' ')[0]} para o seu evento.
              </p>
              <Button asChild variant="gold" className="mt-6 w-full">
                <a href={buildMailtoUrl(`Convite — ${author.nome}`, inviteMessage)}>
                  Convidar para palestra
                </a>
              </Button>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  )
}
