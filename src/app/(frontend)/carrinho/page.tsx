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
  link_compra: string | null
  autor: { nome: string } | { nome: string }[] | null
}

function priceOf(r: Row): number {
  return Number(r.preco_promocional ?? r.preco ?? 0)
}
function authorOf(r: Row): string {
  const a = Array.isArray(r.autor) ? r.autor[0] : r.autor
  return a?.nome ?? ''
}

export default function CarrinhoPage() {
  const { ready, loggedIn, cart, toggleCart } = useCommerce()
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const ids = React.useMemo(() => [...cart], [cart])
  const key = ids.join(',')

  React.useEffect(() => {
    if (!ready) return
    if (!loggedIn || ids.length === 0) {
      setRows([])
      return
    }
    const sb = createClient()
    sb.from('books')
      .select('id,slug,titulo,capa_url,preco,preco_promocional,link_compra,autor:authors(nome)')
      .in('id', ids)
      .then(({ data }) => setRows((data as Row[]) ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loggedIn, key])

  const total = (rows ?? []).reduce((sum, r) => sum + priceOf(r), 0)

  return (
    <div className="mx-auto max-w-content px-6 py-12 lg:px-8">
      <p className="label mb-2 text-emerald">A sua seleção</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Cesto</h1>

      {!ready || rows === null ? (
        <p className="mt-8 text-muted">A carregar…</p>
      ) : !loggedIn ? (
        <LoggedOut />
      ) : rows.length === 0 ? (
        <Empty
          title="O seu cesto está vazio"
          cta="Explorar livros"
          href="/livros"
        />
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-border rounded-md border border-border bg-paper-card">
            {rows.map((r) => (
              <li key={r.id} className="flex gap-4 p-4">
                <Link
                  href={`/livros/${r.slug}`}
                  className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-sm bg-emerald"
                >
                  {r.capa_url ? (
                    <Image src={r.capa_url} alt={r.titulo} fill sizes="64px" className="object-cover" />
                  ) : null}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/livros/${r.slug}`}
                    className="line-clamp-2 font-medium text-ink hover:text-emerald"
                  >
                    {r.titulo}
                  </Link>
                  <p className="text-small text-muted">{authorOf(r)}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                    <span className="font-semibold text-emerald">{formatEUR(priceOf(r))}</span>
                    {r.link_compra ? (
                      <a
                        href={r.link_compra}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label uppercase text-emerald hover:text-emerald-deep"
                      >
                        Comprar
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleCart(r.id)}
                      className="inline-flex items-center gap-1 text-label uppercase text-muted hover:text-ink"
                    >
                      <Trash2 className="size-3.5" /> Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-md border border-border bg-paper-card p-6">
            <h2 className="text-h3 font-semibold tracking-tightish text-ink">Resumo</h2>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-ink-soft">Total ({rows.length})</span>
              <span className="text-xl font-semibold text-emerald">{formatEUR(total)}</span>
            </div>
            <p className="mt-2 text-small text-muted">Portes grátis incluídos.</p>
            <Button className="mt-5 w-full" size="lg" asChild>
              <Link href="/livros">Continuar a explorar</Link>
            </Button>
            <p className="mt-3 text-center text-small text-muted">
              Pagamento online brevemente. Por agora, use “Comprar” em cada livro.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}

function Empty({ title, cta, href }: { title: string; cta: string; href: string }) {
  return (
    <div className="mt-8 rounded-md border border-dashed border-border bg-paper-card p-12 text-center">
      <p className="text-body text-ink-soft">{title}</p>
      <Button asChild className="mt-6">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  )
}

function LoggedOut() {
  return (
    <div className="mt-8 rounded-md border border-dashed border-border bg-paper-card p-12 text-center">
      <p className="text-body text-ink-soft">Inicie sessão para usar o cesto.</p>
      <Button asChild className="mt-6">
        <Link href="/entrar?next=/carrinho">Entrar</Link>
      </Button>
    </div>
  )
}
