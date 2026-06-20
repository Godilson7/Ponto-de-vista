'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Search, ShoppingBag } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useCommerce } from '@/components/commerce/commerce-provider'

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        const q = String(new FormData(e.currentTarget).get('q') ?? '').trim()
        router.push(q ? `/pesquisa?q=${encodeURIComponent(q)}` : '/pesquisa')
      }}
      className={cn('relative flex w-full items-center', className)}
    >
      <input
        name="q"
        type="search"
        placeholder="Pesquisar livros, autores, temas…"
        aria-label="Pesquisar"
        className="h-11 w-full rounded-full border border-border bg-paper-card pl-5 pr-12 text-small text-ink placeholder:text-muted focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald"
      />
      <button
        type="submit"
        aria-label="Pesquisar"
        className="absolute right-1 flex size-9 items-center justify-center rounded-full bg-emerald text-paper transition-colors hover:bg-emerald-deep"
      >
        <Search className="size-4" />
      </button>
    </form>
  )
}

function IconLink({
  href,
  label,
  count,
  children,
}: {
  href: string
  label: string
  count: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={`${label}${count > 0 ? ` (${count})` : ''}`}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 hover:text-emerald"
    >
      {children}
      {count > 0 ? (
        <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald px-1 text-[10px] font-semibold leading-none text-paper">
          {count}
        </span>
      ) : null}
    </Link>
  )
}

/** Coração (lista de desejos) — só visível com sessão iniciada. */
export function WishlistButton() {
  const { ready, loggedIn, wishlist } = useCommerce()
  if (!ready || !loggedIn) return null
  return (
    <IconLink href="/lista" label="Lista de desejos" count={wishlist.size}>
      <Heart className="size-5" />
    </IconLink>
  )
}

/** Cesto — só visível com sessão iniciada. */
export function CartButton() {
  const { ready, loggedIn, cart } = useCommerce()
  if (!ready || !loggedIn) return null
  return (
    <IconLink href="/carrinho" label="Cesto" count={cart.size}>
      <ShoppingBag className="size-5" />
    </IconLink>
  )
}
