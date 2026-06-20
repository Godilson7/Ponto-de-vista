import * as React from 'react'

/** Renderiza um bloco JSON-LD reutilizável por tipo de página. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado no servidor a partir de dados controlados.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
