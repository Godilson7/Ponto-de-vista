'use client'

import * as React from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

/**
 * Carrega uma imagem para o bucket "media" do Supabase Storage e guarda o
 * URL público num input escondido (`name`), para o formulário o submeter.
 * Requer a migração supabase/03_storage.sql.
 */
export function ImageUpload({
  name,
  defaultValue = '',
  folder = 'media',
  aspect = 'aspect-[3/4]',
}: {
  name: string
  defaultValue?: string
  folder?: string
  aspect?: string
}) {
  const [url, setUrl] = React.useState(defaultValue)
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr(null)
    try {
      const supabase = createClient()
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
      const path = `${folder}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      setUrl(data.publicUrl)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Falha no carregamento')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'relative w-24 shrink-0 overflow-hidden rounded-sm border border-border bg-paper',
            aspect,
          )}
        >
          {url ? (
            <Image src={url} alt="Pré-visualização" fill sizes="96px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              <ImageIcon className="size-5" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={onFile}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? 'A carregar…' : url ? 'Trocar imagem' : 'Carregar imagem'}
            </Button>
            {url ? (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="text-label uppercase text-muted transition-colors hover:text-ink"
              >
                Remover
              </button>
            ) : null}
          </div>
          {err ? <p className="text-small text-red-600">{err}</p> : null}
          <p className="text-small text-muted">JPG, PNG ou WebP.</p>
        </div>
      </div>
    </div>
  )
}
