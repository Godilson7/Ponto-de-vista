'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'
import { requireStaff, csvToArray, parseJson, str, strOrNull } from '@/lib/admin'

function revalidatePublic() {
  revalidatePath('/')
  revalidatePath('/autores')
  revalidatePath('/livros')
  revalidatePath('/blog')
  revalidatePath('/eventos')
}

// --------------------------------- Autores --------------------------------- //
export async function saveAuthor(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const id = str(formData.get('id'))
  const nome = str(formData.get('nome'))

  const row = {
    nome,
    slug: slugify(str(formData.get('slug')) || nome),
    pais: strOrNull(formData.get('pais')),
    cidade: strOrNull(formData.get('cidade')),
    area: strOrNull(formData.get('area')),
    areas_de_autoridade: csvToArray(formData.get('areas_de_autoridade')),
    frase_posicionamento: strOrNull(formData.get('frase_posicionamento')),
    mini_bio: strOrNull(formData.get('mini_bio')),
    bio_completa: strOrNull(formData.get('bio_completa')),
    foto_url: strOrNull(formData.get('foto_url')),
    video_url: strOrNull(formData.get('video_url')),
    whatsapp: strOrNull(formData.get('whatsapp')),
    galeria: csvToArray(formData.get('galeria')),
    redes: parseJson(formData.get('redes'), [] as unknown[]),
    participacoes: parseJson(formData.get('participacoes'), [] as unknown[]),
    destaque: formData.get('destaque') === 'on',
    status: str(formData.get('status')) === 'published' ? 'published' : 'draft',
  }

  if (id) {
    await supabase.from('authors').update(row).eq('id', id)
  } else {
    await supabase.from('authors').insert(row)
  }
  revalidatePublic()
  revalidatePath('/admin/autores')
  redirect('/admin/autores')
}

export async function deleteAuthor(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  await supabase.from('authors').delete().eq('id', str(formData.get('id')))
  revalidatePublic()
  revalidatePath('/admin/autores')
}

// ---------------------------------- Livros ---------------------------------- //
export async function saveBook(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const id = str(formData.get('id'))
  const titulo = str(formData.get('titulo'))
  const numPaginas = str(formData.get('num_paginas'))
  const preco = str(formData.get('preco'))
  const precoPromo = str(formData.get('preco_promocional'))

  const row = {
    titulo,
    slug: slugify(str(formData.get('slug')) || titulo),
    subtitulo: strOrNull(formData.get('subtitulo')),
    preco: preco ? Number(preco) : null,
    preco_promocional: precoPromo ? Number(precoPromo) : null,
    portes_gratis: formData.get('portes_gratis') === 'on',
    autor_id: strOrNull(formData.get('autor_id')),
    sinopse_curta: strOrNull(formData.get('sinopse_curta')),
    sinopse_completa: strOrNull(formData.get('sinopse_completa')),
    temas: csvToArray(formData.get('temas')),
    categoria: strOrNull(formData.get('categoria')),
    pais: strOrNull(formData.get('pais')),
    publico_indicado: strOrNull(formData.get('publico_indicado')),
    isbn: strOrNull(formData.get('isbn')),
    num_paginas: numPaginas ? Number(numPaginas) : null,
    formato: str(formData.get('formato')) || 'Ambos',
    link_compra: strOrNull(formData.get('link_compra')),
    capa_url: strOrNull(formData.get('capa_url')),
    fotos_lancamento: csvToArray(formData.get('fotos_lancamento')),
    relacionados: csvToArray(formData.get('relacionados')),
    depoimentos: parseJson(formData.get('depoimentos'), [] as unknown[]),
    destaque: formData.get('destaque') === 'on',
    status: str(formData.get('status')) === 'published' ? 'published' : 'draft',
  }

  if (id) {
    await supabase.from('books').update(row).eq('id', id)
  } else {
    await supabase.from('books').insert(row)
  }
  revalidatePublic()
  revalidatePath('/admin/livros')
  redirect('/admin/livros')
}

export async function deleteBook(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  await supabase.from('books').delete().eq('id', str(formData.get('id')))
  revalidatePublic()
  revalidatePath('/admin/livros')
}

// ---------------------------------- Eventos --------------------------------- //
export async function saveEvent(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const id = str(formData.get('id'))
  const titulo = str(formData.get('titulo'))

  const row = {
    titulo,
    slug: slugify(str(formData.get('slug')) || titulo),
    descricao: strOrNull(formData.get('descricao')),
    data_inicio: strOrNull(formData.get('data_inicio')),
    hora: strOrNull(formData.get('hora')),
    local: strOrNull(formData.get('local')),
    cidade: strOrNull(formData.get('cidade')),
    pais: strOrNull(formData.get('pais')),
    tipo: str(formData.get('tipo')) || 'evento',
    link: strOrNull(formData.get('link')),
    capa_url: strOrNull(formData.get('capa_url')),
    autor_id: strOrNull(formData.get('autor_id')),
    destaque: formData.get('destaque') === 'on',
    status: str(formData.get('status')) === 'published' ? 'published' : 'draft',
  }

  if (id) {
    await supabase.from('events').update(row).eq('id', id)
  } else {
    await supabase.from('events').insert(row)
  }
  revalidatePublic()
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos')
}

export async function deleteEvent(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  await supabase.from('events').delete().eq('id', str(formData.get('id')))
  revalidatePublic()
  revalidatePath('/admin/eventos')
}

// ---------------------------------- Artigos --------------------------------- //
export async function savePost(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const id = str(formData.get('id'))
  const titulo = str(formData.get('titulo'))
  const publishedAt = str(formData.get('published_at'))

  const row = {
    titulo,
    slug: slugify(str(formData.get('slug')) || titulo),
    resumo: strOrNull(formData.get('resumo')),
    categoria_id: strOrNull(formData.get('categoria_id')),
    autor_nome: strOrNull(formData.get('autor_nome')),
    corpo: strOrNull(formData.get('corpo')),
    capa_url: strOrNull(formData.get('capa_url')),
    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    status: str(formData.get('status')) === 'published' ? 'published' : 'draft',
  }

  if (id) {
    await supabase.from('blog_posts').update(row).eq('id', id)
  } else {
    await supabase.from('blog_posts').insert(row)
  }
  revalidatePublic()
  revalidatePath('/admin/artigos')
  redirect('/admin/artigos')
}

export async function deletePost(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  await supabase.from('blog_posts').delete().eq('id', str(formData.get('id')))
  revalidatePublic()
  revalidatePath('/admin/artigos')
}

// -------------------------------- Taxonomias -------------------------------- //
export async function saveTaxonomy(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const nome = str(formData.get('nome'))
  await supabase.from('taxonomies').insert({
    nome,
    slug: slugify(str(formData.get('slug')) || nome),
    tipo: str(formData.get('tipo')) || 'categoria-blog',
  })
  revalidatePublic()
  revalidatePath('/admin/taxonomias')
}

export async function deleteTaxonomy(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  await supabase.from('taxonomies').delete().eq('id', str(formData.get('id')))
  revalidatePublic()
  revalidatePath('/admin/taxonomias')
}

// ---------------------------------- Pedidos --------------------------------- //
export async function updateContactStatus(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  await supabase
    .from('contact_requests')
    .update({ status: str(formData.get('status')) })
    .eq('id', str(formData.get('id')))
  revalidatePath('/admin/pedidos')
}

// ------------------------------- Utilizadores ------------------------------- //
export async function updateUserRole(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const id = str(formData.get('id'))
  const role = str(formData.get('role'))

  await supabase.from('profiles').update({ role }).eq('id', id)

  // Ao conceder "autor", cria um perfil de autor em rascunho (se ainda não existir).
  if (role === 'author') {
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .eq('owner', id)
      .limit(1)
      .maybeSingle()
    if (!existing) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', id)
        .maybeSingle()
      const nome = prof?.name || 'Novo autor'
      await supabase.from('authors').insert({
        nome,
        slug: `${slugify(nome)}-${id.slice(0, 8)}`,
        area: 'Por definir',
        pais: 'Por definir',
        owner: id,
        status: 'draft',
      })
    }
  }

  revalidatePath('/admin/utilizadores')
  revalidatePath('/admin/autores')
}
