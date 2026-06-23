'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomUUID } from 'node:crypto'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/slug'

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
    whatsapp: strOrNull(formData.get('whatsapp')),
    redes: parseJson(formData.get('redes'), [] as unknown[]),
    status: 'draft',
  }
  if (nome) row.nome = nome

  await supabase.from('authors').update(row).eq('owner', user.id)

  revalidatePath('/conta')
  revalidatePath('/autores')
}

// ------------------- Submissões do autor (artigos / eventos) ------------------- //
// Ficam sempre em `draft` — a editora aprova e publica. A RLS owner-update exige draft.

/** O autor submete (ou edita) um artigo do blog. */
export async function submitMyArticle(formData: FormData): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return
  const supabase = await createClient()

  // autor_nome liga o artigo ao perfil público (ver getPostsByAuthorName).
  const { data: author } = await supabase
    .from('authors')
    .select('nome')
    .eq('owner', user.id)
    .maybeSingle()

  const id = str(formData.get('id'))
  const titulo = str(formData.get('titulo'))

  const row: Record<string, unknown> = {
    titulo,
    resumo: strOrNull(formData.get('resumo')),
    categoria_id: strOrNull(formData.get('categoria_id')),
    corpo: strOrNull(formData.get('corpo')),
    capa_url: strOrNull(formData.get('capa_url')),
    autor_nome: author?.nome || user.name || null,
    status: 'draft',
  }

  if (id) {
    await supabase.from('blog_posts').update(row).eq('id', id).eq('owner', user.id)
  } else {
    row.slug = `${slugify(titulo)}-${randomUUID().slice(0, 8)}`
    row.owner = user.id
    row.published_at = new Date().toISOString()
    await supabase.from('blog_posts').insert(row)
  }

  revalidatePath('/conta')
  redirect('/conta')
}

/** O autor submete (ou edita) um evento. */
export async function submitMyEvent(formData: FormData): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return
  const supabase = await createClient()

  const { data: author } = await supabase
    .from('authors')
    .select('id')
    .eq('owner', user.id)
    .maybeSingle()

  const id = str(formData.get('id'))
  const titulo = str(formData.get('titulo'))

  const row: Record<string, unknown> = {
    titulo,
    descricao: strOrNull(formData.get('descricao')),
    data_inicio: strOrNull(formData.get('data_inicio')),
    hora: strOrNull(formData.get('hora')),
    local: strOrNull(formData.get('local')),
    cidade: strOrNull(formData.get('cidade')),
    pais: strOrNull(formData.get('pais')),
    tipo: str(formData.get('tipo')) || 'evento',
    link: strOrNull(formData.get('link')),
    capa_url: strOrNull(formData.get('capa_url')),
    autor_id: author?.id ?? null,
    status: 'draft',
  }

  if (id) {
    await supabase.from('events').update(row).eq('id', id).eq('owner', user.id)
  } else {
    row.slug = `${slugify(titulo)}-${randomUUID().slice(0, 8)}`
    row.owner = user.id
    await supabase.from('events').insert(row)
  }

  revalidatePath('/conta')
  redirect('/conta')
}

// --------------------------------- Conta ------------------------------------ //
/** O utilizador atualiza o seu nome de conta (função segura — não altera o papel). */
export async function updateMyAccount(formData: FormData): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return
  const name = str(formData.get('name'))
  if (!name) return
  const supabase = await createClient()
  await supabase.rpc('update_my_name', { new_name: name })
  revalidatePath('/conta')
}
