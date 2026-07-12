import type { Config } from 'tailwindcss'

/**
 * Sistema de Design — Direção 4 "A Academia" (institucional / modernista).
 * Os tokens aqui são a fonte única de verdade visual, espelhados em
 * src/app/(frontend)/globals.css como custom properties para uso em runtime.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)', // fundo principal
          card: 'rgb(var(--paper-card) / <alpha-value>)', // superfícies / cartões
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)', // texto principal
          soft: 'rgb(var(--ink-soft) / <alpha-value>)', // texto secundário
        },
        emerald: {
          DEFAULT: 'rgb(var(--emerald) / <alpha-value>)', // acento de marca
          deep: 'rgb(var(--emerald-deep) / <alpha-value>)', // hover
        },
        gold: {
          DEFAULT: 'rgb(var(--gold) / <alpha-value>)', // filete / detalhe
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)', // labels / metadados
        },
        border: {
          DEFAULT: 'rgb(var(--border) / 0.14)',
          em: 'rgb(var(--emerald) / 0.3)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
      },
      borderColor: {
        DEFAULT: 'rgb(var(--border) / 0.14)',
        em: 'rgb(var(--emerald) / 0.3)',
      },
      ringColor: {
        DEFAULT: 'rgb(var(--emerald) / <alpha-value>)',
      },
      maxWidth: {
        content: '1280px',
        prose: '68ch',
      },
      letterSpacing: {
        tightish: '-0.01em',
        label: '0.2em',
        wordmark: '0.22em',
        sub: '0.3em',
      },
      fontSize: {
        // Escala fluida (clamp) da Direção 4
        display: ['clamp(2.75rem, 5vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.25rem, 3.4vw, 2.625rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.625rem, 2.4vw, 1.875rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        h3: ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        small: ['0.8125rem', { lineHeight: '1.5' }],
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      spacing: {
        section: '6rem', // 96px — ritmo de secção (desktop); múltiplo de 8
        'section-sm': '4rem', // 64px — mobile
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(21,20,15,0.07)',
        card: '0 1px 2px rgba(21,20,15,0.05), 0 12px 28px -18px rgba(21,20,15,0.20)',
        lift: '0 2px 6px rgba(21,20,15,0.07), 0 24px 48px -24px rgba(21,20,15,0.26)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
