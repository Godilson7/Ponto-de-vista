import * as React from 'react'

import { cn } from '@/lib/utils'

/** Símbolo da marca: monograma do leitor / livro aberto. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('h-8 w-8 text-emerald', className)}
    >
      <path
        d="M16 8.2C12.4 5.6 7.2 5.3 3.5 6.4v18.2c3.7-1.1 8.9-0.8 12.5 1.8 3.6-2.6 8.8-2.9 12.5-1.8V6.4C24.8 5.3 19.6 5.6 16 8.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M16 8.2v18.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

type WordmarkProps = {
  className?: string
  /** Em fundos escuros, o símbolo fica dourado e o texto claro. */
  inverted?: boolean
}

/** Logótipo institucional: símbolo + "PONTO DE VISTA" / "EDITORA". */
export function Wordmark({ className, inverted = false }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <BrandMark className={inverted ? 'text-gold' : 'text-emerald'} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-sans text-sm font-medium uppercase tracking-wordmark',
            inverted ? 'text-paper' : 'text-ink',
          )}
        >
          Ponto de Vista
        </span>
        <span
          className={cn(
            'mt-1 font-sans text-[0.6rem] uppercase tracking-sub',
            inverted ? 'text-gold' : 'text-emerald',
          )}
        >
          Editora
        </span>
      </span>
    </span>
  )
}
