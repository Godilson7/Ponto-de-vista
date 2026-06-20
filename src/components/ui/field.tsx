import * as React from 'react'

import { cn } from '@/lib/utils'

const baseControl =
  'w-full rounded-sm border border-border bg-paper px-4 py-2.5 text-body text-ink placeholder:text-muted/70 transition-colors focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseControl, className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(baseControl, 'min-h-32 resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(baseControl, 'appearance-none pr-10', className)} {...props}>
    {children}
  </select>
))
Select.displayName = 'Select'

type FieldProps = {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}

/** Campo de formulário com label + dica opcional. */
export function Field({ label, htmlFor, required, hint, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-label uppercase text-muted">
        {label}
        {required ? <span className="ml-1 text-emerald">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-small text-muted">{hint}</p> : null}
    </div>
  )
}
