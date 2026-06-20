import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina classes Tailwind resolvendo conflitos (padrão shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata um preço em euros à portuguesa (ex.: 18,90€). */
export function formatEUR(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}€`
}
