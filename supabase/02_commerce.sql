-- ============================================================================
-- Ponto de Vista — Migração 02: comércio (preços, cesto e lista de desejos)
-- Correr no SQL Editor do Supabase DEPOIS de schema.sql + seed.sql.
-- Idempotente: pode ser corrido mais do que uma vez.
-- ============================================================================

-- 1) Preços nos livros (estilo livraria) ------------------------------------
alter table public.books
  add column if not exists preco numeric(10, 2),
  add column if not exists preco_promocional numeric(10, 2),
  add column if not exists portes_gratis boolean not null default true;

-- 2) Lista de desejos (wishlist) e cesto (cart), por utilizador --------------
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, book_id)
);

-- 3) RLS: cada utilizador só vê e gere os seus próprios itens ----------------
alter table public.wishlist_items enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "wishlist_select_own" on public.wishlist_items;
drop policy if exists "wishlist_insert_own" on public.wishlist_items;
drop policy if exists "wishlist_delete_own" on public.wishlist_items;
create policy "wishlist_select_own" on public.wishlist_items
  for select using (auth.uid() = user_id);
create policy "wishlist_insert_own" on public.wishlist_items
  for insert with check (auth.uid() = user_id);
create policy "wishlist_delete_own" on public.wishlist_items
  for delete using (auth.uid() = user_id);

drop policy if exists "cart_select_own" on public.cart_items;
drop policy if exists "cart_insert_own" on public.cart_items;
drop policy if exists "cart_update_own" on public.cart_items;
drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_select_own" on public.cart_items
  for select using (auth.uid() = user_id);
create policy "cart_insert_own" on public.cart_items
  for insert with check (auth.uid() = user_id);
create policy "cart_update_own" on public.cart_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart_delete_own" on public.cart_items
  for delete using (auth.uid() = user_id);

-- 4) Preços de exemplo para os livros já existentes --------------------------
update public.books set preco = 18.90 where preco is null;
update public.books
  set preco_promocional = round((preco * 0.9)::numeric, 2)
  where preco_promocional is null;
