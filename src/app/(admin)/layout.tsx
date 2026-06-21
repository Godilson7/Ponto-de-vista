import type { Metadata } from 'next'
import Link from 'next/link'

import '../globals.css'

import { siteConfig } from '@/lib/site'
import { fontVariables } from '@/lib/fonts'
import { buildMetadata } from '@/lib/seo'
import { requireStaff } from '@/lib/admin'
import { Wordmark } from '@/components/brand/wordmark'
import { AdminNav, AdminMobileNav } from '@/components/admin/admin-nav'
import { ThemeScript } from '@/components/theme/theme-script'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({ title: 'Painel', noIndex: true }),
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff()

  return (
    <html lang="pt-PT" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-paper antialiased" suppressHydrationWarning>
        <ThemeScript />
        <div className="flex min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-paper-card p-5 lg:flex">
            <Link href="/admin" className="mb-8 block">
              <Wordmark />
            </Link>
            <AdminNav userName={user.name || user.email} />
          </aside>

          <div className="flex-1">
            {/* Topo mobile */}
            <header className="flex items-center justify-between border-b border-border bg-paper-card px-6 py-4 lg:hidden">
              <Link href="/admin">
                <Wordmark />
              </Link>
              <Link href="/" className="text-label uppercase text-muted hover:text-emerald">
                Ver site
              </Link>
            </header>
            <AdminMobileNav />
            <main className="mx-auto max-w-5xl px-6 py-10 lg:px-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
