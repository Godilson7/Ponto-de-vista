'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronRight, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'
import { Wordmark } from '@/components/brand/wordmark'

type Item = { label: string; href: string }

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  return (
    <div aria-hidden={!open} className={cn('fixed inset-0 z-[60]', !open && 'pointer-events-none')}>
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink/50 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <aside
        role="dialog"
        aria-label="Menu"
        aria-modal="true"
        className={cn(
          'absolute inset-y-0 left-0 flex w-[320px] max-w-[86vw] flex-col bg-paper shadow-lift transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/" onClick={onClose}>
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="inline-flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <SidebarSection title="Catálogo" items={siteConfig.nav} onNavigate={onClose} />
          <SidebarSection title="A editora" items={siteConfig.utility} onNavigate={onClose} />
        </nav>

        <div className="space-y-2 border-t border-border p-4">
          <Link
            href="/publicar"
            onClick={onClose}
            className="flex items-center justify-between rounded-sm bg-emerald px-4 py-3 text-label uppercase text-paper transition-colors hover:bg-emerald-deep"
          >
            Publicar o meu livro <ChevronRight className="size-4" />
          </Link>
          <Link
            href="/eventos"
            onClick={onClose}
            className="flex items-center justify-between rounded-sm border border-emerald/40 px-4 py-3 text-label uppercase text-emerald transition-colors hover:bg-emerald hover:text-paper"
          >
            Eventos futuros <ChevronRight className="size-4" />
          </Link>
        </div>
      </aside>
    </div>
  )
}

function SidebarSection({
  title,
  items,
  onNavigate,
}: {
  title: string
  items: readonly Item[]
  onNavigate: () => void
}) {
  return (
    <div className="px-2 py-2">
      <p className="label px-3 py-2 text-muted">{title}</p>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          onClick={onNavigate}
          className="flex items-center justify-between rounded-sm px-3 py-3 text-ink transition-colors hover:bg-ink/5"
        >
          <span className="font-medium">{it.label}</span>
          <ChevronRight className="size-4 text-muted" />
        </Link>
      ))}
    </div>
  )
}
