-- ============================================================================
-- Ponto de Vista — Migrações pendentes 04 → 10 (num único ficheiro)
--
-- Corre UMA vez no Supabase → SQL Editor, DEPOIS de schema.sql + seed.sql
-- (que já estão aplicados). Reúne as migrações 04, 05, 06, 07, 09 e 10.
--
-- A migração 08 (capas de demonstração) foi DELIBERADAMENTE deixada de fora,
-- para não substituir capas reais já carregadas nos livros.
--
-- Tudo é idempotente e corre dentro de UMA transação: ou aplica tudo, ou nada.
-- No fim há uma verificação — deve dar tudo "✅".
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 04 — Eventos (agenda própria, gerida no admin)
-- ----------------------------------------------------------------------------
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

alter table public.events enable row level security;

-- ----------------------------------------------------------------------------
-- 05 — Submissões de autores (events.owner + RLS granular)
--      (substitui a política única de escrita da 04 por políticas granulares)
-- ----------------------------------------------------------------------------
alter table public.events
  add column if not exists owner uuid references auth.users(id) on delete set null;

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

-- ----------------------------------------------------------------------------
-- 06 — WhatsApp do autor (botão "Convidar" na página do autor)
-- ----------------------------------------------------------------------------
alter table public.authors
  add column if not exists whatsapp text;

-- ----------------------------------------------------------------------------
-- 07 — Categorias do blog (seed das 8 categorias da especificação)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 09 — Destaque nos artigos (blog_posts.destaque, para o banner da home)
-- ----------------------------------------------------------------------------
alter table public.blog_posts
  add column if not exists destaque boolean not null default false;

-- ----------------------------------------------------------------------------
-- 10 — Edição segura do nome da conta (RPC update_my_name)
--      SECURITY DEFINER: só mexe no próprio nome, nunca no papel (role).
-- ----------------------------------------------------------------------------
create or replace function public.update_my_name(new_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := nullif(trim(new_name), '');
begin
  if auth.uid() is null then
    raise exception 'Sessão necessária';
  end if;
  if v_name is null then
    raise exception 'O nome não pode ficar vazio';
  end if;
  update public.profiles set name = v_name where id = auth.uid();
end;
$$;

revoke all on function public.update_my_name(text) from public;
grant execute on function public.update_my_name(text) to authenticated;

commit;

-- ============================================================================
-- Verificação (corre a seguir ao COMMIT) — deve dar tudo "✅".
-- ============================================================================
select '04_events',             case when exists (select 1 from information_schema.tables  where table_schema='public' and table_name='events') then '✅' else '❌ EM FALTA' end as estado
union all select '05_author_submissions', case when exists (select 1 from information_schema.columns where table_schema='public' and table_name='events'     and column_name='owner')    then '✅' else '❌ EM FALTA' end
union all select '06_author_whatsapp',    case when exists (select 1 from information_schema.columns where table_schema='public' and table_name='authors'    and column_name='whatsapp') then '✅' else '❌ EM FALTA' end
union all select '07_blog_categories',    case when exists (select 1 from public.taxonomies where tipo='categoria-blog') then '✅' else '❌ EM FALTA' end
union all select '09_highlight_flags',    case when exists (select 1 from information_schema.columns where table_schema='public' and table_name='blog_posts' and column_name='destaque') then '✅' else '❌ EM FALTA' end
union all select '10_account_name',       case when exists (select 1 from pg_proc where proname='update_my_name') then '✅' else '❌ EM FALTA' end
order by 1;
