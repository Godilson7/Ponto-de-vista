'use client'

import * as React from 'react'

/**
 * Anima o número de 0 até ao valor-alvo quando entra no viewport,
 * preservando prefixo/sufixo (ex.: "20+", "2018"). Respeita reduced-motion.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/\d[\d.,]*/)
  const target = match ? parseInt(match[0].replace(/[.,]/g, ''), 10) : NaN
  const prefix = match ? value.slice(0, match.index) : value
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : ''

  const ref = React.useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = React.useState(Number.isNaN(target) ? value : '0')

  React.useEffect(() => {
    if (Number.isNaN(target)) return
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(`${prefix}${target}${suffix}`)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const duration = 1100
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(`${prefix}${Math.round(eased * target)}${suffix}`)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
