import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cn } from '@/lib/utils'

/** Renderiza Markdown com o estilo editorial do site. */
export function RichText({ content, className }: { content?: string | null; className?: string }) {
  if (!content) return null
  return (
    <div className={cn('prose-editorial max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
