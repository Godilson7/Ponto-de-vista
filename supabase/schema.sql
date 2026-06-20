-- ==========================================================================
-- Ponto de Vista Editora — esquema Supabase (PostgreSQL)
-- Correr no Supabase Studio › SQL Editor (uma vez). Idempotente o suficiente
-- para reexecutar em desenvolvimento, mas pensado para um projeto novo.
-- ==========================================================================

-- Tipos --------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('reader', 'author', 'editor', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- Função utilitária: updated_at --------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ==========================================================================
-- profiles (1:1 com auth.users) — guarda o PAPEL/permissões
-- ==========================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  role        public.user_role not null default 'reader',
  created_at  timestamptz not null default now()
);

-- Papel do utilizador atual (security definer → não recorre na RLS) ---------
create or replace function public.current_app_role()
returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() in ('editor','admin'), false)
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

-- Ao criar conta: cria profile. O PRIMEIRO utilizador torna-se admin. -------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  assigned public.user_role;
begin
  if (select count(*) from public.profiles) = 0 then
    assigned := 'admin';
  else
    assigned := 'reader';
  end if;

  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    assigned
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==========================================================================
-- authors
-- ==========================================================================
create table if not exists public.authors (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null,
  nome                 text not null,
  pais                 text,
  cidade               text,
  area                 text,
  areas_de_autoridade  text[] not null default '{}',
  frase_posicionamento text,
  mini_bio             text,
  bio_completa         text,            -- Markdown
  foto_url             text,
  video_url            text,
  redes                jsonb not null default '[]',  -- [{plataforma,url}]
  participacoes        jsonb not null default '[]',  -- [{tipo,titulo,data,link}]
  galeria              text[] not null default '{}',
  destaque             boolean not null default false,
  status               public.content_status not null default 'draft',
  owner                uuid references public.profiles(id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
drop trigger if exists authors_updated_at on public.authors;
create trigger authors_updated_at before update on public.authors
  for each row execute function public.set_updated_at();

-- ==========================================================================
-- taxonomies (temas / áreas / categorias do blog)
-- ==========================================================================
create table if not exists public.taxonomies (
  id    uuid primary key default gen_random_uuid(),
  nome  text not null,
  slug  text unique not null,
  tipo  text not null default 'categoria-blog'
);

-- ==========================================================================
-- books
-- ==========================================================================
create table if not exists public.books (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  titulo            text not null,
  subtitulo         text,
  autor_id          uuid references public.authors(id) on delete set null,
  sinopse_curta     text,
  sinopse_completa  text,             -- Markdown
  temas             text[] not null default '{}',
  categoria         text,
  pais              text,
  publico_indicado  text,
  isbn              text,
  num_paginas       int,
  formato           text not null default 'Ambos',
  link_compra       text,
  capa_url          text,
  fotos_lancamento  text[] not null default '{}',
  depoimentos       jsonb not null default '[]',  -- [{texto,autor}]
  relacionados      text[] not null default '{}', -- slugs
  destaque          boolean not null default false,
  status            public.content_status not null default 'draft',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
drop trigger if exists books_updated_at on public.books;
create trigger books_updated_at before update on public.books
  for each row execute function public.set_updated_at();

-- ==========================================================================
-- blog_posts
-- ==========================================================================
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  titulo        text not null,
  resumo        text,
  categoria_id  uuid references public.taxonomies(id) on delete set null,
  autor_nome    text,
  corpo         text,                  -- Markdown
  capa_url      text,
  published_at  timestamptz,
  status        public.content_status not null default 'draft',
  owner         uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ==========================================================================
-- contact_requests (submissões dos formulários)
-- ==========================================================================
create table if not exists public.contact_requests (
  id                uuid primary key default gen_random_uuid(),
  tipo              text not null default 'geral',
  nome              text not null,
  email             text not null,
  whatsapp          text,
  pais              text,
  tema              text,
  livro_ja_escrito  boolean not null default false,
  objetivo          text,
  mensagem          text not null,
  autor_alvo        uuid references public.authors(id) on delete set null,
  status            text not null default 'novo',
  created_at        timestamptz not null default now()
);

-- ==========================================================================
-- Row Level Security
-- ==========================================================================
alter table public.profiles         enable row level security;
alter table public.authors          enable row level security;
alter table public.taxonomies       enable row level security;
alter table public.books            enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.contact_requests enable row level security;

-- profiles: cada um lê o próprio; staff lê todos. Escrita só admin (via service role nas ações).
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (auth.uid() = id or public.is_staff());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

-- authors: leitura pública do publicado; dono e staff veem rascunhos.
drop policy if exists authors_select on public.authors;
create policy authors_select on public.authors for select
  using (status = 'published' or owner = auth.uid() or public.is_staff());

drop policy if exists authors_insert on public.authors;
create policy authors_insert on public.authors for insert
  with check (public.is_staff() or owner = auth.uid());

-- staff edita tudo; autor edita o próprio mas NÃO pode publicar (fica draft).
drop policy if exists authors_update_staff on public.authors;
create policy authors_update_staff on public.authors for update
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists authors_update_owner on public.authors;
create policy authors_update_owner on public.authors for update
  using (owner = auth.uid()) with check (owner = auth.uid() and status = 'draft');

drop policy if exists authors_delete on public.authors;
create policy authors_delete on public.authors for delete using (public.is_admin());

-- taxonomies: leitura pública; escrita staff.
drop policy if exists taxonomies_select on public.taxonomies;
create policy taxonomies_select on public.taxonomies for select using (true);
drop policy if exists taxonomies_write on public.taxonomies;
create policy taxonomies_write on public.taxonomies for all
  using (public.is_staff()) with check (public.is_staff());

-- books: leitura pública do publicado; escrita staff.
drop policy if exists books_select on public.books;
create policy books_select on public.books for select
  using (status = 'published' or public.is_staff());
drop policy if exists books_write on public.books;
create policy books_write on public.books for all
  using (public.is_staff()) with check (public.is_staff());

-- blog_posts: leitura pública do publicado; staff tudo; autor cria/edita os próprios (draft).
drop policy if exists blog_select on public.blog_posts;
create policy blog_select on public.blog_posts for select
  using (status = 'published' or owner = auth.uid() or public.is_staff());
drop policy if exists blog_insert on public.blog_posts;
create policy blog_insert on public.blog_posts for insert
  with check (public.is_staff() or owner = auth.uid());
drop policy if exists blog_update_staff on public.blog_posts;
create policy blog_update_staff on public.blog_posts for update
  using (public.is_staff()) with check (public.is_staff());
drop policy if exists blog_update_owner on public.blog_posts;
create policy blog_update_owner on public.blog_posts for update
  using (owner = auth.uid()) with check (owner = auth.uid() and status = 'draft');
drop policy if exists blog_delete on public.blog_posts;
create policy blog_delete on public.blog_posts for delete using (public.is_admin());

-- contact_requests: qualquer pessoa submete; só staff lê/gere.
drop policy if exists contact_insert on public.contact_requests;
create policy contact_insert on public.contact_requests for insert with check (true);
drop policy if exists contact_select on public.contact_requests;
create policy contact_select on public.contact_requests for select using (public.is_staff());
drop policy if exists contact_update on public.contact_requests;
create policy contact_update on public.contact_requests for update
  using (public.is_staff()) with check (public.is_staff());
drop policy if exists contact_delete on public.contact_requests;
create policy contact_delete on public.contact_requests for delete using (public.is_admin());

-- ==========================================================================
-- Fim do esquema. Depois corre `supabase/seed.sql` para conteúdo de demonstração.
-- ==========================================================================
