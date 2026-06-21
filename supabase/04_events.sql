-- ============================================================================
-- Ponto de Vista — Migração 04: Eventos (agenda própria, gerida no admin)
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  titulo       text not null,
  descricao    text,                              -- Markdown curto
  data_inicio  date,
  hora         text,                              -- ex.: "18:30"
  local        text,                              -- ex.: "Livraria Bertrand do Chiado"
  cidade       text,
  pais         text,
  tipo         text not null default 'evento',    -- lançamento, palestra, feira…
  link         text,                              -- inscrição / detalhes
  capa_url     text,
  autor_id     uuid references public.authors(id) on delete set null,
  destaque     boolean not null default false,
  status       public.content_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

create index if not exists events_data_inicio_idx on public.events (data_inicio);

-- RLS: leitura pública do publicado; escrita só staff (igual a books).
alter table public.events enable row level security;

drop policy if exists events_select on public.events;
create policy events_select on public.events for select
  using (status = 'published' or public.is_staff());

drop policy if exists events_write on public.events;
create policy events_write on public.events for all
  using (public.is_staff()) with check (public.is_staff());
