-- ============================================================================
-- Ponto de Vista — Migração 03: Storage (bucket "media" para capas e fotos)
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

-- 1) Bucket público "media" --------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- 2) Políticas de Storage ----------------------------------------------------
-- Leitura pública de tudo o que está no bucket "media".
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

-- Upload só para staff e autores (leitores não podem carregar).
drop policy if exists "media_insert_staff_author" on storage.objects;
create policy "media_insert_staff_author" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (public.is_staff() or public.current_app_role()::text = 'author')
  );

-- Cada um gere os seus próprios ficheiros; staff gere todos.
drop policy if exists "media_update_own_or_staff" on storage.objects;
create policy "media_update_own_or_staff" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (owner = auth.uid() or public.is_staff()));

drop policy if exists "media_delete_own_or_staff" on storage.objects;
create policy "media_delete_own_or_staff" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (owner = auth.uid() or public.is_staff()));
