import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Cliente Supabase para o servidor (Server Components, Route Handlers,
 * Server Actions). Lê/escreve a sessão nos cookies via @supabase/ssr.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll chamado a partir de um Server Component — ignorável
            // (a sessão é renovada pelo middleware).
          }
        },
      },
    },
  )
}
