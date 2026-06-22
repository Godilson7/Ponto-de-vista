-- ============================================================================
-- Ponto de Vista — Migração 08 (demo): capas de exemplo
-- Liga cada livro à capa desenhada em /public/covers/<slug>.svg.
-- Demonstração — substituir por capas reais via admin (Livros → Capa → upload).
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

update public.books
set capa_url = '/covers/' || slug || '.svg'
where slug in (
  'a-sala-e-o-mundo',
  'o-peso-do-silencio',
  'o-tempo-e-a-atencao',
  'territorios-da-memoria'
);
