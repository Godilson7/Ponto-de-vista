import * as React from 'react'

import { cn } from '@/lib/utils'

/** Superfície tipo "cartão" (estética profissional / rede social). */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-md border border-border bg-paper-card shadow-card', className)}
      {...props}
    />
  )
}

type CardSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode
  kicker?: string
  action?: React.ReactNode
}

/** Cartão com cabeçalho (título + ação) ao estilo de secções de perfil. */
export function CardSection({
  title,
  kicker,
  action,
  className,
  children,
  ...props
}: CardSectionProps) {
  return (
    <Card className={cn('p-6 md:p-8', className)} {...props}>
      {title ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {kicker ? <p className="label mb-2 text-emerald">{kicker}</p> : null}
            <h2 className="text-xl font-semibold tracking-tightish text-ink">{title}</h2>
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </Card>
  )
}
