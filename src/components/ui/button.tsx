import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        solid: 'bg-emerald text-paper hover:bg-emerald-deep',
        outline:
          'border border-emerald/40 text-emerald hover:border-emerald hover:bg-emerald hover:text-paper',
        gold: 'bg-gold text-ink hover:brightness-95',
        ghost: 'text-ink hover:bg-ink/5',
        link: 'h-auto px-0 normal-case tracking-normal text-emerald underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-[0.7rem]',
        md: 'h-11 px-6 text-xs',
        lg: 'h-12 px-8 text-xs',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
