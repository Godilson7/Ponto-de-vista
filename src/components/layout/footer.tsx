import * as React from 'react'
import Link from 'next/link'

import { siteConfig } from '@/lib/site'
import { Container } from '@/components/ui/container'
import { Wordmark } from '@/components/brand/wordmark'
import { NewsletterForm } from '@/components/forms/newsletter-form'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-ink text-paper">
      <Container className="py-16">
        {/* Newsletter */}
        <div className="flex flex-col gap-6 border-b border-paper/15 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="label text-gold">Newsletter</p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-paper">
              Receba as novidades da editora
            </h2>
            <p className="mt-2 text-small leading-relaxed text-paper/60">
              Lançamentos, eventos e vozes de autoridade — sem ruído.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          {/* Marca + manifesto */}
          <div className="md:col-span-5">
            <Wordmark inverted />
            <p className="mt-6 max-w-sm text-small leading-relaxed text-paper/70">
              {siteConfig.description}
            </p>
            <p className="mt-6 font-serif text-xl italic text-paper/85">
              Publicamos histórias. Construímos autoridade.
            </p>
          </div>

          {/* Navegação */}
          <nav aria-label="Rodapé" className="md:col-span-3">
            <p className="label mb-5 text-gold">Navegar</p>
            <ul className="space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-small text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Presença internacional */}
          <div className="md:col-span-2">
            <p className="label mb-5 text-gold">Presença</p>
            <ul className="space-y-3">
              {siteConfig.presence.map((p) => (
                <li key={p.city} className="text-small text-paper/80">
                  {p.city}
                  <span className="block text-paper/50">{p.country}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="md:col-span-2">
            <p className="label mb-5 text-gold">Contacto</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-small text-paper/80 transition-colors hover:text-paper"
                >
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small text-paper/80 transition-colors hover:text-paper"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 text-small text-paper/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  )
}
