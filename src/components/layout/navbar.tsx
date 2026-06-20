'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'
import { Wordmark } from '@/components/brand/wordmark'
import { UserMenu } from '@/components/layout/user-menu'
import { Sidebar } from '@/components/layout/sidebar'
import { SearchBar, CartButton, WishlistButton } from '@/components/layout/header-actions'

// Links de topo (A Editora + catálogo), com separador "|".
// Eventos e Contacto vivem no menu lateral / linha de destaques, não aqui.
const topLinks = [siteConfig.utility[0], ...siteConfig.nav]
// Destaques no estilo Bertrand (linha inferior, sem separadores).
const promoLinks = [
  { label: 'Novidades', href: '/livros' },
  { label: 'Eventos futuros', href: '/eventos' },
]

export function Navbar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    const base = href.split('#')[0]
    return base === '/' ? pathname === '/' : pathname.startsWith(base)
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Tier 1 — links de topo, centrados e separados por | (dourado no escuro) */}
        <div className="bg-emerald dark:bg-[#0f2318]">
          <div className="mx-auto flex h-9 max-w-content items-center justify-center px-6 lg:px-8">
            <nav aria-label="Navegação" className="hidden flex-wrap items-center gap-3 sm:flex">
              {topLinks.map((l, i) => (
                <React.Fragment key={l.href}>
                  {i > 0 ? (
                    <span aria-hidden className="text-[0.625rem] text-paper/35 dark:text-gold/40">
                      |
                    </span>
                  ) : null}
                  <Link
                    href={l.href}
                    className={cn(
                      'text-[0.625rem] uppercase tracking-wide transition-colors',
                      isActive(l.href)
                        ? 'text-paper dark:text-gold'
                        : 'text-paper/80 hover:text-paper dark:text-gold/85 dark:hover:text-gold',
                    )}
                  >
                    {l.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
            <span className="text-label uppercase text-paper/85 dark:text-gold sm:hidden">
              Editora internacional
            </span>
          </div>
        </div>

        {/* Tier 2 + 3 — bloco único: pesquisa + destaques (sem divisória entre eles) */}
        <div className="border-b border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
          <div className="mx-auto flex max-w-content flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" aria-label={siteConfig.name} className="shrink-0">
                <Wordmark />
              </Link>
              <div className="flex items-center gap-0.5 lg:hidden">
                <WishlistButton />
                <CartButton />
                <UserMenu />
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center text-ink"
                  aria-label="Abrir menu"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="size-6" />
                </button>
              </div>
            </div>

            <div className="lg:flex-1">
              <SearchBar />
            </div>

            <div className="hidden items-center gap-1 lg:flex">
              <UserMenu />
              <WishlistButton />
              <CartButton />
            </div>
          </div>

          {/* Linha de destaques (desktop) — colada ao bloco da pesquisa */}
          <div className="mx-auto hidden max-w-content items-center gap-7 px-6 pb-3 lg:flex lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-label uppercase tracking-wide text-ink transition-colors hover:text-emerald"
            >
              <Menu className="size-4" /> Menu
            </button>
            {promoLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-[0.95rem] font-medium tracking-tight transition-colors hover:text-emerald',
                  isActive(l.href) ? 'text-emerald' : 'text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
