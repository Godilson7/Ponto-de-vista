'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogIn, LogOut, User as UserIcon, UserPlus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from '@/components/theme/theme-toggle'

type MenuUser = { email: string; name: string | null; role: string } | null | undefined

const itemClass =
  'flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-small text-ink transition-colors hover:bg-ink/5'

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = React.useState<MenuUser>(undefined)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const supabase = createClient()
    let active = true

    async function load(u: { id: string; email?: string; user_metadata?: { name?: string } } | null) {
      if (!u) {
        if (active) setUser(null)
        return
      }
      let role = 'reader'
      let name = u.user_metadata?.name ?? null
      try {
        const { data } = await supabase.from('profiles').select('name, role').eq('id', u.id).maybeSingle()
        if (data) {
          role = data.role
          name = data.name ?? name
        }
      } catch {}
      if (active) setUser({ email: u.email ?? '', name, role })
    }

    supabase.auth.getUser().then(({ data }) => load(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => load(session?.user ?? null))
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  async function logout() {
    await createClient().auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  const loggedIn = Boolean(user)
  const initial = user ? (user.name || user.email).charAt(0).toUpperCase() : ''
  const isStaff = user?.role === 'admin' || user?.role === 'editor'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="A minha conta"
        className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 hover:text-emerald"
      >
        {loggedIn ? (
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald text-small font-medium text-paper">
            {initial}
          </span>
        ) : (
          <UserIcon className="size-5" />
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-md border border-border bg-paper-card p-1.5 shadow-lift"
        >
          {loggedIn ? (
            <>
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-small font-medium text-ink">{user!.name || 'Conta'}</p>
                <p className="truncate text-small text-muted">{user!.email}</p>
              </div>
              <Link href="/conta" role="menuitem" className={cn(itemClass, 'mt-1')} onClick={() => setOpen(false)}>
                <UserIcon className="size-4 text-muted" /> A minha conta
              </Link>
              {isStaff ? (
                <Link href="/admin" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                  <LayoutDashboard className="size-4 text-muted" /> Painel de gestão
                </Link>
              ) : null}
            </>
          ) : (
            <>
              <p className="px-3 py-2 text-label uppercase text-muted">A sua conta</p>
              <Link href="/entrar" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                <LogIn className="size-4 text-muted" /> Entrar
              </Link>
              <Link href="/registar" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                <UserPlus className="size-4 text-muted" /> Criar conta
              </Link>
            </>
          )}

          {/* Tema (modo claro/escuro) — movido do topo para aqui */}
          <div className="mt-1 flex items-center justify-between border-t border-border px-3 py-2">
            <span className="text-small text-ink">Tema</span>
            <ThemeToggle className="size-8" />
          </div>

          {loggedIn ? (
            <button type="button" role="menuitem" onClick={logout} className={cn(itemClass, 'border-t border-border')}>
              <LogOut className="size-4 text-muted" /> Terminar sessão
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
