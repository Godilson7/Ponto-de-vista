'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Botão de eliminação com modal de confirmação (em vez do alert nativo).
 * Vive dentro de um <form action={deleteX}>; ao confirmar, submete esse form.
 */
export function DeleteButton({
  label = 'Eliminar',
  confirmText = 'Eliminar definitivamente?',
}: {
  label?: string
  confirmText?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  function handleConfirm() {
    triggerRef.current?.closest('form')?.requestSubmit()
    setOpen(false)
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      {open && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
            >
              <div
                className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <div className="animate-fade-up relative w-full max-w-sm rounded-lg border border-border bg-paper-card p-6 shadow-lift">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50">
                    <AlertTriangle className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 id="delete-dialog-title" className="text-lg font-semibold text-ink">
                      {confirmText}
                    </h2>
                    <p className="mt-1 text-small text-muted">
                      Esta ação é permanente e não pode ser anulada.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    ref={cancelRef}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-red-600 text-paper hover:bg-red-700"
                    onClick={handleConfirm}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
