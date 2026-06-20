import * as React from 'react'

import { cn } from '@/lib/utils'

/** Container da grelha da Direção 4: máx. 1280px, gutters 24–32px. */
export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-content px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  )
}
