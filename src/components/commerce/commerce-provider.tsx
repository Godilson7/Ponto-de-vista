'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

type Commerce = {
  ready: boolean
  loggedIn: boolean
  wishlist: Set<string>
  cart: Set<string>
  inWishlist: (bookId: string) => boolean
  inCart: (bookId: string) => boolean
  toggleWishlist: (bookId: string) => void
  toggleCart: (bookId: string) => void
}

const CommerceContext = React.createContext<Commerce | null>(null)

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])
  const [ready, setReady] = React.useState(false)
  const [userId, setUserId] = React.useState<string | null>(null)
  const [wishlist, setWishlist] = React.useState<Set<string>>(new Set())
  const [cart, setCart] = React.useState<Set<string>>(new Set())

  const load = React.useCallback(
    async (uid: string | null) => {
      if (!uid) {
        setWishlist(new Set())
        setCart(new Set())
        setReady(true)
        return
      }
      const [w, c] = await Promise.all([
        supabase.from('wishlist_items').select('book_id').eq('user_id', uid),
        supabase.from('cart_items').select('book_id').eq('user_id', uid),
      ])
      setWishlist(new Set((w.data ?? []).map((r) => r.book_id as string)))
      setCart(new Set((c.data ?? []).map((r) => r.book_id as string)))
      setReady(true)
    },
    [supabase],
  )

  React.useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      const uid = data.user?.id ?? null
      setUserId(uid)
      load(uid)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null
      setUserId(uid)
      load(uid)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [supabase, load])

  function requireLogin(): boolean {
    if (userId) return true
    const next = typeof window !== 'undefined' ? window.location.pathname : '/'
    router.push(`/entrar?next=${encodeURIComponent(next)}`)
    return false
  }

  async function toggleWishlist(bookId: string) {
    if (!requireLogin() || !userId) return
    const has = wishlist.has(bookId)
    setWishlist((prev) => {
      const n = new Set(prev)
      if (has) n.delete(bookId)
      else n.add(bookId)
      return n
    })
    if (has) {
      await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('book_id', bookId)
    } else {
      await supabase.from('wishlist_items').insert({ user_id: userId, book_id: bookId })
    }
  }

  async function toggleCart(bookId: string) {
    if (!requireLogin() || !userId) return
    const has = cart.has(bookId)
    setCart((prev) => {
      const n = new Set(prev)
      if (has) n.delete(bookId)
      else n.add(bookId)
      return n
    })
    if (has) {
      await supabase.from('cart_items').delete().eq('user_id', userId).eq('book_id', bookId)
    } else {
      await supabase.from('cart_items').insert({ user_id: userId, book_id: bookId })
    }
  }

  const value: Commerce = {
    ready,
    loggedIn: Boolean(userId),
    wishlist,
    cart,
    inWishlist: (id) => wishlist.has(id),
    inCart: (id) => cart.has(id),
    toggleWishlist,
    toggleCart,
  }

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}

export function useCommerce(): Commerce {
  const ctx = React.useContext(CommerceContext)
  if (!ctx) throw new Error('useCommerce tem de ser usado dentro de <CommerceProvider>')
  return ctx
}
