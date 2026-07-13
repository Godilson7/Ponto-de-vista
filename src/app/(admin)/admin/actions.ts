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

  const { error } = id
    ? await supabase.from('authors').update(row).eq('id', id)
    : await supabase.from('authors').insert(row)
  if (error) {
    console.error('[admin] saveAuthor falhou:', error)
    throw new Error('Não foi possível guardar o autor.')
  }
  revalidatePublic()
  revalidatePath('/admin/autores')
  redirect('/admin/autores')
}

export async function deleteAuthor(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const { error } = await supabase.from('authors').delete().eq('id', str(formData.get('id')))
  if (error) {
    console.error('[admin] deleteAuthor falhou:', error)
    throw new Error('Não foi possível eliminar o autor.')
  }
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

  const { error } = id
    ? await supabase.from('books').update(row).eq('id', id)
    : await supabase.from('books').insert(row)
  if (error) {
    console.error('[admin] saveBook falhou:', error)
    throw new Error('Não foi possível guardar o livro.')
  }
  revalidatePublic()
  revalidatePath('/admin/livros')
  redirect('/admin/livros')
}

export async function deleteBook(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const { error } = await supabase.from('books').delete().eq('id', str(formData.get('id')))
  if (error) {
    console.error('[admin] deleteBook falhou:', error)
    throw new Error('Não foi possível eliminar o livro.')
  }
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

  const { error } = id
    ? await supabase.from('events').update(row).eq('id', id)
    : await supabase.from('events').insert(row)
  if (error) {
    console.error('[admin] saveEvent falhou:', error)
    throw new Error('Não foi possível guardar o evento.')
  }
  revalidatePublic()
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos')
}

export async function deleteEvent(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const { error } = await supabase.from('events').delete().eq('id', str(formData.get('id')))
  if (error) {
    console.error('[admin] deleteEvent falhou:', error)
    throw new Error('Não foi possível eliminar o evento.')
  }
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
    destaque: formData.get('destaque') === 'on',
    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
    status: str(formData.get('status')) === 'published' ? 'published' : 'draft',
  }

  const { error } = id
    ? await supabase.from('blog_posts').update(row).eq('id', id)
    : await supabase.from('blog_posts').insert(row)
  if (error) {
    console.error('[admin] savePost falhou:', error)
    throw new Error('Não foi possível guardar o artigo.')
  }
  revalidatePublic()
  revalidatePath('/admin/artigos')
  redirect('/admin/artigos')
}

export async function deletePost(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', str(formData.get('id')))
  if (error) {
    console.error('[admin] deletePost falhou:', error)
    throw new Error('Não foi possível eliminar o artigo.')
  }
  revalidatePublic()
  revalidatePath('/admin/artigos')
}

// -------------------------------- Taxonomias -------------------------------- //
export async function saveTaxonomy(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const nome = str(formData.get('nome'))
  const { error } = await supabase.from('taxonomies').insert({
    nome,
    slug: slugify(str(formData.get('slug')) || nome),
    tipo: str(formData.get('tipo')) || 'categoria-blog',
  })
  if (error) {
    console.error('[admin] saveTaxonomy falhou:', error)
    throw new Error('Não foi possível guardar a categoria.')
  }
  revalidatePublic()
  revalidatePath('/admin/taxonomias')
}

export async function deleteTaxonomy(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const { error } = await supabase.from('taxonomies').delete().eq('id', str(formData.get('id')))
  if (error) {
    console.error('[admin] deleteTaxonomy falhou:', error)
    throw new Error('Não foi possível eliminar a categoria.')
  }
  revalidatePublic()
  revalidatePath('/admin/taxonomias')
}

// ---------------------------------- Pedidos --------------------------------- //
export async function updateContactStatus(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_requests')
    .update({ status: str(formData.get('status')) })
    .eq('id', str(formData.get('id')))
  if (error) {
    console.error('[admin] updateContactStatus falhou:', error)
    throw new Error('Não foi possível atualizar o estado do pedido.')
  }
  revalidatePath('/admin/pedidos')
}

// ------------------------------- Utilizadores ------------------------------- //
export async function updateUserRole(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const id = str(formData.get('id'))
  const role = str(formData.get('role'))

  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) {
    console.error('[admin] updateUserRole falhou:', error)
    throw new Error('Não foi possível atualizar o papel do utilizador.')
  }

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

// -------------------------------- Aprovações -------------------------------- //
/** Publica uma submissão de autor (perfil, artigo ou evento). */
export async function approveSubmission(formData: FormData) {
  await requireStaff()
  const supabase = await createClient()
  const table = str(formData.get('table'))
  const id = str(formData.get('id'))
  if (!['authors', 'blog_posts', 'events'].includes(table) || !id) return
  const { error } = await supabase.from(table).update({ status: 'published' }).eq('id', id)
  if (error) {
    console.error('[admin] approveSubmission falhou:', error)
    throw new Error('Não foi possível aprovar a submissão.')
  }
  revalidatePublic()
  revalidatePath('/admin/aprovacoes')
}
