-- ============================================================================
-- Ponto de Vista — Migração 07: categorias do blog (seed)
-- Cria as 8 categorias da especificação. Idempotente (on conflict no slug),
-- por isso pode correr mais do que uma vez sem duplicar.
-- Correr no SQL Editor do Supabase.
-- ============================================================================

insert into public.taxonomies (nome, slug, tipo) values
  ('Autoria',                      'autoria',                      'categoria-blog'),
  ('Escrita',                      'escrita',                      'categoria-blog'),
  ('Mercado editorial',            'mercado-editorial',            'categoria-blog'),
  ('Posicionamento de autoridade', 'posicionamento-de-autoridade', 'categoria-blog'),
  ('Histórias de autores',         'historias-de-autores',         'categoria-blog'),
  ('Lançamentos',                  'lancamentos',                  'categoria-blog'),
  ('Eventos',                      'eventos',                      'categoria-blog'),
  ('Bastidores da editora',        'bastidores-da-editora',        'categoria-blog')
on conflict (slug) do nothing;
