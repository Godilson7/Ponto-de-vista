'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'

import { formatEUR } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useCommerce } from '@/components/commerce/commerce-provider'

type Row = {
  id: string
  slug: string
  titulo: string
  capa_url: string | null
  preco: number | null
  preco_promocional: number | null
  autor: { nome: string } | { nome: string }[] | null
}

function priceOf(r: Row): number {
  return Number(r.preco_promocional ?? r.preco ?? 0)
}
function authorOf(r: Row): string {
  const a = Array.isArray(r.autor) ? r.autor[0] : r.autor
  return a?.nome ?? ''
}

export default function ListaPage() {
  const { ready, loggedIn, wishlist, inCart, toggleWishlist, toggleCart } = useCommerce()
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const ids = React.useMemo(() => [...wishlist], [wishlist])
  const key = ids.join(',')

  React.useEffect(() => {
    if (!ready) return
    if (!loggedIn || ids.length === 0) {
      setRows([])
      return
    }
    const sb = createClient()
    sb.from('books')
      .select('id,slug,titulo,capa_url,preco,preco_promocional,autor:authors(nome)')
      .in('id', ids)
      .then(({ data }) => setRows((data as Row[]) ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loggedIn, key])

  return (
    <div className="mx-auto max-w-content px-6 py-12 lg:px-8">
      <p className="label mb-2 text-emerald">Guardados</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Lista de desejos</h1>

      {!ready || rows === null ? (
        <p className="mt-8 text-muted">A carregar…</p>
      ) : !loggedIn ? (
        <Notice text="Inicie sessão para ver a sua lista." href="/entrar?next=/lista" cta="Entrar" />
      ) : rows.length === 0 ? (
        <Notice
          text="Ainda não guardou nenhum livro. Toque no coração nos livros que quer acompanhar."
          href="/livros"
          cta="Explorar livros"
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {rows.map((r) => (
            <article key={r.id} className="group flex flex-col">
              <Link
                href={`/livros/${r.slug}`}
                className="relative aspect-[3/4] overflow-hidden rounded-md border border-border bg-emerald shadow-card"
              >
                {r.capa_url ? (
                  <Image src={r.capa_url} alt={r.titulo} fill sizes="200px" className="object-cover" />
                ) : null}
              </Link>
              <h3 className="mt-3 line-clamp-2 text-small font-medium leading-snug text-ink">
                <Link href={`/livros/${r.slug}`} className="hover:text-emerald">
                  {r.titulo}
                </Link>
              </h3>
              <p className="line-clamp-1 text-small text-muted">{authorOf(r)}</p>
              <span className="mt-1 font-semibold text-emerald">{formatEUR(priceOf(r))}</span>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant={inCart(r.id) ? 'outline' : undefined} onClick={() => toggleCart(r.id)}>
                  {inCart(r.id) ? 'No cesto' : 'Adicionar'}
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(r.id)}
                  aria-label="Remover da lista"
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function Notice({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="mt-8 rounded-md border border-dashed border-border bg-paper-card p-12 text-center">
      <p className="text-body text-ink-soft">{text}</p>
      <Button asChild className="mt-6">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  )
}
