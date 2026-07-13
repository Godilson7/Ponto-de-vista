-- ============================================================================
-- Ponto de Vista — Migração 11: campos do perfil do autor e da página do livro
-- (spec do cliente: "Porque escrevo", "Em três palavras", "Frases do livro",
--  links de compra múltiplos)
-- Correr no SQL Editor do Supabase ANTES de publicar o código novo. Idempotente.
-- ============================================================================

-- Autor: porquê escreve + a essência em três palavras
alter table public.authors
  add column if not exists porque_escrevo     text,
  add column if not exists em_tres_palavras   text[] not null default '{}';

-- Livro: frases em destaque (do livro) + vários links de compra
-- links_compra: [{"loja":"Amazon","url":"https://..."}, ...]
alter table public.books
  add column if not exists frases_destaque    text[]  not null default '{}',
  add column if not exists links_compra       jsonb   not null default '[]'::jsonb;
