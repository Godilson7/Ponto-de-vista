-- ============================================================================
-- Ponto de Vista — Migração 09: destaque nos artigos (banner da home)
-- Permite à editora marcar artigos para o carrossel de destaques da home.
-- (Livros e eventos já têm a coluna `destaque`.)
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

alter table public.blog_posts
  add column if not exists destaque boolean not null default false;
