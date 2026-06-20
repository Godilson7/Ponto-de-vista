import { Inter, Fraunces } from 'next/font/google'

/**
 * Sistema tipográfico:
 *  - Inter (variável) — interface, navegação, corpo, dados. Stylistic sets
 *    humanistas (cv11/ss01) aplicados em globals.css.
 *  - Fraunces (variável, opsz + itálico) — voz editorial: títulos de display,
 *    nomes de autor, citações. Carácter literário para uma editora.
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const fontVariables = `${inter.variable} ${fraunces.variable}`
