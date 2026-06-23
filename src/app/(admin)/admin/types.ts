/**
 * Tipos das linhas usadas nos formulários e listas do painel de gestão.
 * (Sem tipos gerados do Supabase — definidos à mão, campos opcionais.)
 */

export type AdminAuthorRow = {
  id?: string
  slug?: string
  nome?: string
  pais?: string
  cidade?: string
  area?: string
  areas_de_autoridade?: string[]
  frase_posicionamento?: string
  mini_bio?: string
  bio_completa?: string
  foto_url?: string
  video_url?: string
  whatsapp?: string
  galeria?: string[]
  redes?: unknown
  participacoes?: unknown
  destaque?: boolean
  status?: string
}

export type AdminBookRow = {
  id?: string
  slug?: string
  titulo?: string
  subtitulo?: string
  autor_id?: string
  sinopse_curta?: string
  sinopse_completa?: string
  temas?: string[]
  categoria?: string
  pais?: string
  publico_indicado?: string
  isbn?: string
  num_paginas?: number
  formato?: string
  preco?: number
  preco_promocional?: number
  portes_gratis?: boolean
  link_compra?: string
  capa_url?: string
  fotos_lancamento?: string[]
  relacionados?: string[]
  depoimentos?: unknown
  destaque?: boolean
  status?: string
}

export type AdminPostRow = {
  id?: string
  slug?: string
  titulo?: string
  resumo?: string
  categoria_id?: string
  autor_nome?: string
  corpo?: string
  capa_url?: string
  published_at?: string
  destaque?: boolean
  status?: string
}

/** Relação 1:1 que o PostgREST devolve como objeto, array ou null. */
type Joined = { nome: string } | { nome: string }[] | null

export type AdminPostListRow = {
  id: string
  titulo: string
  status: string
  categoria: Joined
}

export type AdminBookListRow = {
  id: string
  titulo: string
  status: string
  destaque?: boolean
  autor: Joined
}

export type AdminEventRow = {
  id?: string
  slug?: string
  titulo?: string
  descricao?: string
  data_inicio?: string
  hora?: string
  local?: string
  cidade?: string
  pais?: string
  tipo?: string
  link?: string
  capa_url?: string
  autor_id?: string
  destaque?: boolean
  status?: string
}

export type AdminEventListRow = {
  id: string
  titulo: string
  status: string
  destaque?: boolean
  data_inicio?: string | null
}
