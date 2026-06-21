-- ============================================================================
-- Ponto de Vista — Migração 06: WhatsApp do autor
-- O botão "Convidar" na página do autor usa o WhatsApp do próprio escritor.
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

alter table public.authors
  add column if not exists whatsapp text;
