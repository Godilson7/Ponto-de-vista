import type { Metadata } from 'next'
import Link from 'next/link'

import '../globals.css'

import { siteConfig } from '@/lib/site'
import { fontVariables } from '@/lib/fonts'
import { buildMetadata } from '@/lib/seo'
import { Wordmark } from '@/components/brand/wordmark'
import { ThemeScript } from '@/components/theme/theme-script'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({ title: 'Conta', noIndex: true }),
}

const benefits = [
  'Um perfil de autoridade profissional, encontrado e partilhável.',
  'Os seus livros, artigos e participações num só lugar.',
  'Uma rede internacional de autores de língua portuguesa.',
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-paper antialiased" suppressHydrationWarning>
        <ThemeScript />
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Painel de marca */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-emerald p-12 text-paper lg:flex xl:p-16">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
            <Link href="/" aria-label={siteConfig.name}>
              <Wordmark inverted />
            </Link>

            <div className="max-w-md">
              <p className="label mb-6 text-gold">Casa de autores</p>
              <p className="font-serif text-4xl italic leading-tight text-paper xl:text-5xl">
                Publicamos histórias. Construímos autoridade.
              </p>
              <ul className="mt-10 space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-paper/85">
                    <span className="mt-2 h-px w-6 shrink-0 bg-gold" aria-hidden="true" />
                    <span className="text-body leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="label text-paper/60">
              {siteConfig.presence.map((p) => p.city).join(' · ')}
            </p>
          </aside>

          {/* Painel do formulário */}
          <main className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between px-6 py-6 lg:px-10">
              <Link href="/" aria-label={siteConfig.name} className="lg:hidden">
                <Wordmark />
              </Link>
              <span className="hidden lg:block" />
              <Link
                href="/"
                className="text-label uppercase text-muted transition-colors hover:text-emerald"
              >
                ← Voltar ao site
              </Link>
            </header>
            <div className="flex flex-1 items-center justify-center px-6 pb-20 pt-4">
              <div className="w-full max-w-md">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
