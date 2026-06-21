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

/** Rótulo do botão de compra consoante a loja do link (Amazon, Wook, Bertrand, Fnac). */
export function buyButtonLabel(url?: string | null): string {
  if (!url) return 'Comprar'
  const u = url.toLowerCase()
  if (u.includes('amazon.')) return 'Comprar na Amazon'
  if (u.includes('wook.')) return 'Comprar na Wook'
  if (u.includes('bertrand.')) return 'Comprar na Bertrand'
  if (u.includes('fnac.')) return 'Comprar na Fnac'
  return 'Comprar'
}
