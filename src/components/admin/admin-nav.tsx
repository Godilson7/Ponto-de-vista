'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/auth/logout-button'

export const adminNavItems = [
  { label: 'Painel', href: '/admin' },
  { label: 'Autores', href: '/admin/autores' },
  { label: 'Livros', href: '/admin/livros' },
  { label: 'Artigos', href: '/admin/artigos' },
  { label: 'Eventos', href: '/admin/eventos' },
  { label: 'Taxonomias', href: '/admin/taxonomias' },
  { label: 'Aprovações', href: '/admin/aprovacoes' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Utilizadores', href: '/admin/utilizadores' },
]

function useIsActive() {
  const pathname = usePathname()
  return (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
}

/** Navegação lateral (≥ lg). */
export function AdminNav({ userName }: { userName: string }) {
  const isActive = useIsActive()

  return (
    <nav className="flex h-full flex-col gap-1">
      <p className="label mb-4 px-3 text-muted">Gestão</p>
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={cn(
            'rounded-sm px-3 py-2 text-small transition-colors',
            isActive(item.href)
              ? 'bg-emerald text-paper'
              : 'text-ink hover:bg-ink/5 hover:text-emerald',
          )}
        >
          {item.label}
        </Link>
      ))}
      <div className="mt-auto space-y-3 border-t border-border pt-4">
        <p className="px-3 text-small text-muted">{userName}</p>
        <Link
          href="/"
          className="block px-3 text-label uppercase text-muted transition-colors hover:text-emerald"
        >
          ← Ver site
        </Link>
        <div className="px-3">
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}

/** Navegação horizontal com scroll, para o topo em ecrãs pequenos (< lg). */
export function AdminMobileNav() {
  const isActive = useIsActive()

  return (
    <nav
      aria-label="Gestão"
      className="flex gap-1 overflow-x-auto border-b border-border bg-paper-card px-4 py-2 lg:hidden"
    >
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={cn(
            'shrink-0 rounded-full px-3.5 py-2 text-small transition-colors',
            isActive(item.href) ? 'bg-emerald text-paper' : 'text-ink hover:bg-ink/5',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
