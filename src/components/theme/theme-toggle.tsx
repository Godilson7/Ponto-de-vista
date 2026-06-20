'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false)
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5',
        className,
      )}
    >
      {mounted && dark ? <Sun className="size-[1.05rem]" /> : <Moon className="size-[1.05rem]" />}
    </button>
  )
}
