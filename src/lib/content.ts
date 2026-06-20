import { createPublicClient } from '@/lib/supabase/public'

/**
 * Camada de conteúdo — ligada ao Supabase (leitura pública via RLS).
 * As páginas consomem apenas estes getters. Rich text é Markdown (string).
 * Resiliente: se o esquema ainda não existir, devolve vazio (sem rebentar).
 */

// ------------------------------ Tipos de domínio ------------------------------ //

export type SocialLink = { plataforma: string; url: string }

export type Participation = {
  tipo: 'evento' | 'entrevista' | 'podcast'
  titulo: string
  data?: string
  link?: string
}

export type Author = {
  slug: string
  nome: string
  fraseDePosicionamento: string
  area: string
  areasDeAutoridade: string[]
  pais: string
  cidade?: string
  miniBio: string
  bioCompleta: string
  fotoUrl?: string
  galeria: string[]
  redesSociais: SocialLink[]
  participacoes: Participation[]
  videoUrl?: string
  destaque?: boolean
}

export type Testimonial = { texto: string; autor: string }

export type Formato = 'Físico' | 'Digital' | 'Ambos'

export type Book = {
  id: string
  slug: string
  titulo: string
  subtitulo?: string
  preco?: number
  precoPromocional?: number
  portesGratis?: boolean
  autorSlug: string
  autorNome: string
  sinopseCurta: string
  sinopseCompleta: string
  temas: string[]
  categoria: string
  pais: string
  publicoIndicado?: string
  isbn?: string
  numPaginas?: number
  formato: Formato
  linkCompra?: string
  capaUrl?: string
  fotosLancamento: string[]
  depoimentos: Testimonial[]
  relacionados: string[]
  destaque?: boolean
}

export type BlogCategory = { slug: string; nome: string }

export type BlogPost = {
  slug: string
  titulo: string
  resumo: string
  categoria: string
  categoriaNome: string
  autorNome: string
  publishedAt: string
  corpo: string
  capaUrl?: string
}

// ------------------------------ Mapeamento ------------------------------ //
/* eslint-disable @typescript-eslint/no-explicit-any */

const AUTHOR_COLS =
  'slug,nome,pais,cidade,area,areas_de_autoridade,frase_posicionamento,mini_bio,bio_completa,foto_url,video_url,redes,participacoes,galeria,destaque'

const BOOK_COLS_BASE =
  'id,slug,titulo,subtitulo,sinopse_curta,sinopse_completa,temas,categoria,pais,publico_indicado,isbn,num_paginas,formato,link_compra,capa_url,fotos_lancamento,depoimentos,relacionados,destaque,autor:authors(slug,nome)'

// Com preços (migração 02). Há fallback automático para BOOK_COLS_BASE caso
// as colunas de preço ainda não existam.
const BOOK_COLS = `preco,preco_promocional,portes_gratis,${BOOK_COLS_BASE}`

const POST_COLS =
  'slug,titulo,resumo,autor_nome,corpo,capa_url,published_at,created_at,categoria:taxonomies(slug,nome)'

function mapAuthor(row: any): Author {
  return {
    slug: row.slug,
    nome: row.nome,
    fraseDePosicionamento: row.frase_posicionamento ?? '',
    area: row.area ?? '',
    areasDeAutoridade: row.areas_de_autoridade ?? [],
    pais: row.pais ?? '',
    cidade: row.cidade ?? undefined,
    miniBio: row.mini_bio ?? '',
    bioCompleta: row.bio_completa ?? '',
    fotoUrl: row.foto_url ?? undefined,
    galeria: row.galeria ?? [],
    redesSociais: Array.isArray(row.redes) ? row.redes : [],
    participacoes: Array.isArray(row.participacoes) ? row.participacoes : [],
    videoUrl: row.video_url ?? undefined,
    destaque: row.destaque ?? false,
  }
}

function mapBook(row: any): Book {
  const autor = Array.isArray(row.autor) ? row.autor[0] : row.autor
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    subtitulo: row.subtitulo ?? undefined,
    preco: row.preco != null ? Number(row.preco) : undefined,
    precoPromocional: row.preco_promocional != null ? Number(row.preco_promocional) : undefined,
    portesGratis: row.portes_gratis ?? undefined,
    autorSlug: autor?.slug ?? '',
    autorNome: autor?.nome ?? '',
    sinopseCurta: row.sinopse_curta ?? '',
    sinopseCompleta: row.sinopse_completa ?? '',
    temas: row.temas ?? [],
    categoria: row.categoria ?? '',
    pais: row.pais ?? '',
    publicoIndicado: row.publico_indicado ?? undefined,
    isbn: row.isbn ?? undefined,
    numPaginas: row.num_paginas ?? undefined,
    formato: (row.formato as Formato) ?? 'Ambos',
    linkCompra: row.link_compra ?? undefined,
    capaUrl: row.capa_url ?? undefined,
    fotosLancamento: row.fotos_lancamento ?? [],
    depoimentos: Array.isArray(row.depoimentos) ? row.depoimentos : [],
    relacionados: row.relacionados ?? [],
    destaque: row.destaque ?? false,
  }
}

function mapPost(row: any): BlogPost {
  const cat = Array.isArray(row.categoria) ? row.categoria[0] : row.categoria
  return {
    slug: row.slug,
    titulo: row.titulo,
    resumo: row.resumo ?? '',
    categoria: cat?.slug ?? '',
    categoriaNome: cat?.nome ?? '',
    autorNome: row.autor_nome ?? '',
    publishedAt: row.published_at ?? row.created_at,
    corpo: row.corpo ?? '',
    capaUrl: row.capa_url ?? undefined,
  }
}

/** Executa uma query e devolve [] em caso de erro (ex.: esquema ainda não criado). */
async function safe<T>(promise: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try {
    const { data, error } = await promise
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

// --------------------------------- Autores --------------------------------- //

export async function getAuthors(): Promise<Author[]> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb.from('authors').select(AUTHOR_COLS).eq('status', 'published').order('nome'),
  )
  return rows.map(mapAuthor)
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb.from('authors').select(AUTHOR_COLS).eq('status', 'published').eq('slug', slug).limit(1),
  )
  return rows[0] ? mapAuthor(rows[0]) : null
}

export async function getFeaturedAuthors(): Promise<Author[]> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb
      .from('authors')
      .select(AUTHOR_COLS)
      .eq('status', 'published')
      .eq('destaque', true)
      .order('nome')
      .limit(6),
  )
  return rows.map(mapAuthor)
}

// ---------------------------------- Livros ---------------------------------- //

/**
 * Executa uma query de livros tentando com colunas de preço; se falhar
 * (migração 02 ainda não corrida), refaz com as colunas base. Nunca rebenta.
 */
async function queryBooks(
  make: (cols: string) => PromiseLike<{ data: any[] | null; error: unknown }>,
): Promise<Book[]> {
  try {
    const { data, error } = await make(BOOK_COLS)
    if (!error) return (data ?? []).map(mapBook)
  } catch {
    /* tenta o fallback abaixo */
  }
  try {
    const { data, error } = await make(BOOK_COLS_BASE)
    if (!error) return (data ?? []).map(mapBook)
  } catch {
    /* devolve vazio */
  }
  return []
}

export async function getBooks(): Promise<Book[]> {
  const sb = createPublicClient()
  return queryBooks((cols) =>
    sb.from('books').select(cols).eq('status', 'published').order('titulo'),
  )
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const sb = createPublicClient()
  const rows = await queryBooks((cols) =>
    sb.from('books').select(cols).eq('status', 'published').eq('slug', slug).limit(1),
  )
  return rows[0] ?? null
}

export async function getFeaturedBooks(): Promise<Book[]> {
  const sb = createPublicClient()
  return queryBooks((cols) =>
    sb
      .from('books')
      .select(cols)
      .eq('status', 'published')
      .eq('destaque', true)
      .order('titulo')
      .limit(6),
  )
}

export async function getBooksByAuthor(authorSlug: string): Promise<Book[]> {
  const all = await getBooks()
  return all.filter((b) => b.autorSlug === authorSlug)
}

export async function getRelatedBooks(book: Book): Promise<Book[]> {
  if (book.relacionados.length === 0) return []
  const all = await getBooks()
  return book.relacionados
    .map((slug) => all.find((b) => b.slug === slug))
    .filter((b): b is Book => Boolean(b))
}

// --------------------------------- Pesquisa --------------------------------- //

export async function searchBooks(q: string): Promise<Book[]> {
  const term = q.trim()
  if (!term) return []
  const sb = createPublicClient()
  return queryBooks((cols) =>
    sb
      .from('books')
      .select(cols)
      .eq('status', 'published')
      .ilike('titulo', `%${term}%`)
      .order('titulo')
      .limit(48),
  )
}

export async function searchAuthors(q: string): Promise<Author[]> {
  const term = q.trim()
  if (!term) return []
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb
      .from('authors')
      .select(AUTHOR_COLS)
      .eq('status', 'published')
      .ilike('nome', `%${term}%`)
      .order('nome')
      .limit(24),
  )
  return rows.map(mapAuthor)
}

// --------------------------------- Eventos ---------------------------------- //

export type EventItem = {
  titulo: string
  data?: string
  link?: string
  autorNome: string
  autorSlug: string
}

/** Agenda — agrega as participações (tipo "evento") dos autores publicados. */
export async function getEvents(): Promise<EventItem[]> {
  const authors = await getAuthors()
  return authors.flatMap((a) =>
    a.participacoes
      .filter((p) => p.tipo === 'evento')
      .map((p) => ({
        titulo: p.titulo,
        data: p.data,
        link: p.link,
        autorNome: a.nome,
        autorSlug: a.slug,
      })),
  )
}

// ----------------------------------- Blog ----------------------------------- //

export async function getCategories(): Promise<BlogCategory[]> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb.from('taxonomies').select('slug,nome').eq('tipo', 'categoria-blog').order('nome'),
  )
  return rows.map((r) => ({ slug: r.slug, nome: r.nome }))
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb
      .from('taxonomies')
      .select('slug,nome')
      .eq('tipo', 'categoria-blog')
      .eq('slug', slug)
      .limit(1),
  )
  return rows[0] ? { slug: rows[0].slug, nome: rows[0].nome } : null
}

export async function getPosts(): Promise<BlogPost[]> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb.from('blog_posts').select(POST_COLS).eq('status', 'published').order('published_at', {
      ascending: false,
    }),
  )
  return rows.map(mapPost)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const sb = createPublicClient()
  const rows = await safe<any>(
    sb.from('blog_posts').select(POST_COLS).eq('status', 'published').eq('slug', slug).limit(1),
  )
  return rows[0] ? mapPost(rows[0]) : null
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const all = await getPosts()
  return all.filter((p) => p.categoria === categorySlug)
}

export async function getPostsByAuthorName(name: string): Promise<BlogPost[]> {
  const all = await getPosts()
  return all.filter((p) => p.autorNome === name)
}

// --------------------------------- Utilidades -------------------------------- //

export function getBuyUrl(book: Book): string | undefined {
  return book.linkCompra
}

export function distinct<T extends string>(values: (T | undefined | null)[]): T[] {
  return Array.from(new Set(values.filter((v): v is T => Boolean(v)))).sort()
}

export function formatDatePt(iso: string): string {
  const meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ]
  const d = new Date(iso)
  return `${d.getUTCDate()} de ${meses[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
}
