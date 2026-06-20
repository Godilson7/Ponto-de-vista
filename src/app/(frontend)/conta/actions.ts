'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

function str(v: FormDataEntryValue | null): string {
  return v ? String(v).trim() : ''
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = str(v)
  return s.length ? s : null
}
function csv(v: FormDataEntryValue | null): string[] {
  if (!v) return []
  return String(v)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
function parseJson<T>(v: FormDataEntryValue | null, fallback: T): T {
  if (!v) return fallback
  try {
    return JSON.parse(String(v)) as T
  } catch {
    return fallback
  }
}

/**
 * O autor edita o SEU perfil. A RLS (authors_update_owner) só permite a
 * atualização se a linha ficar em `draft` — por isso as edições voltam a
 * rascunho e ficam a aguardar publicação pela editora.
 */
export async function updateMyAuthorProfile(formData: FormData): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return

  const supabase = await createClient()
  const nome = str(formData.get('nome'))

  const row: Record<string, unknown> = {
    foto_url: strOrNull(formData.get('foto_url')),
    area: strOrNull(formData.get('area')),
    frase_posicionamento: strOrNull(formData.get('frase_posicionamento')),
    areas_de_autoridade: csv(formData.get('areas_de_autoridade')),
    mini_bio: strOrNull(formData.get('mini_bio')),
    bio_completa: strOrNull(formData.get('bio_completa')),
    video_url: strOrNull(formData.get('video_url')),
    redes: parseJson(formData.get('redes'), [] as unknown[]),
    status: 'draft',
  }
  if (nome) row.nome = nome

  await supabase.from('authors').update(row).eq('owner', user.id)

  revalidatePath('/conta')
  revalidatePath('/autores')
}
