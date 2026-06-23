-- ============================================================================
-- Ponto de Vista — Migração 10: edição segura do nome da conta
-- Função SECURITY DEFINER: o utilizador atualiza APENAS o seu próprio nome.
-- Não toca no papel (role) — evita escalonamento de privilégios.
-- Correr no SQL Editor do Supabase. Idempotente.
-- ============================================================================

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
