'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/auth/logout-button'

const items = [
  { label: 'Painel', href: '/admin' },
  { label: 'Autores', href: '/admin/autores' },
  { label: 'Livros', href: '/admin/livros' },
  { label: 'Artigos', href: '/admin/artigos' },
  { label: 'Taxonomias', href: '/admin/taxonomias' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Utilizadores', href: '/admin/utilizadores' },
]

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <nav className="flex h-full flex-col gap-1">
      <p className="label mb-4 px-3 text-muted">Gestão</p>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
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
