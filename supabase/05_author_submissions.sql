-- ============================================================================
-- Ponto de Vista — Migração 05: submissões de autores (eventos)
-- Permite que autores submetam EVENTOS — ficam em rascunho até a editora aprovar.
-- (blog_posts já suporta submissão de autores via coluna owner — ver schema.sql.)
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

alter table public.events
  add column if not exists owner uuid references auth.users(id) on delete set null;

-- Substituir a política única de escrita por políticas granulares (como blog_posts).
drop policy if exists events_write on public.events;

drop policy if exists events_select on public.events;
create policy events_select on public.events for select
  using (status = 'published' or owner = auth.uid() or public.is_staff());

drop policy if exists events_insert on public.events;
create policy events_insert on public.events for insert
  with check (public.is_staff() or owner = auth.uid());

drop policy if exists events_update_staff on public.events;
create policy events_update_staff on public.events for update
  using (public.is_staff()) with check (public.is_staff());

-- O autor só pode atualizar os seus enquanto estiverem em rascunho.
drop policy if exists events_update_owner on public.events;
create policy events_update_owner on public.events for update
  using (owner = auth.uid()) with check (owner = auth.uid() and status = 'draft');

drop policy if exists events_delete on public.events;
create policy events_delete on public.events for delete using (public.is_admin());
