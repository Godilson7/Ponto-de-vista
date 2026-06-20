import type { Metadata } from 'next'

import '../globals.css'

import { siteConfig } from '@/lib/site'
import { fontVariables } from '@/lib/fonts'
import { buildMetadata, organizationJsonLd } from '@/lib/seo'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { ThemeScript } from '@/components/theme/theme-script'
import { CommerceProvider } from '@/components/commerce/commerce-provider'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata(),
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={fontVariables} suppressHydrationWarning>
      {/* suppressHydrationWarning: extensões de browser (Grammarly, etc.) injetam
          atributos em <html>/<body> antes da hidratação do React. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <ThemeScript />
        <JsonLd data={organizationJsonLd()} />
        <CommerceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CommerceProvider>
      </body>
    </html>
  )
}
