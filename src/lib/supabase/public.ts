import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase anónimo SEM cookies — para leitura de conteúdo público.
 * Não lê a sessão, por isso as páginas continuam a poder ser estáticas/ISR.
 * A RLS garante que só devolve registos publicados.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
