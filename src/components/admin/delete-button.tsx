'use client'

import { Button } from '@/components/ui/button'

/**
 * Botão de eliminação para usar dentro de um <form action={deleteX}>.
 * Pede confirmação antes de submeter (ação destrutiva e irreversível).
 */
export function DeleteButton({
  label = 'Eliminar',
  confirmText = 'Eliminar definitivamente? Esta ação não pode ser anulada.',
}: {
  label?: string
  confirmText?: string
}) {
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault()
      }}
    >
      {label}
    </Button>
  )
}
