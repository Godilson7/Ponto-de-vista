'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function onLogout() {
    setLoading(true)
    try {
      await createClient().auth.signOut()
    } finally {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={onLogout} disabled={loading}>
      {loading ? 'A sair…' : 'Terminar sessão'}
    </Button>
  )
}
