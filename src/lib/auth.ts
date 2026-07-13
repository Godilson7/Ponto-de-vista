import { createClient } from '@/lib/supabase/server'

export type AppRole = 'reader' | 'author' | 'editor' | 'admin'

export type AppUser = {
  id: string
  email: string
  name: string | null
  role: AppRole
}

/** Utilizador autenticado (Supabase Auth + perfil/papel). */
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  let name: string | null = (user.user_metadata?.name as string) ?? null
  let role: AppRole = 'reader'
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile) {
      name = profile.name ?? name
      role = (profile.role as AppRole) ?? 'reader'
    }
  } catch {
    // esquema ainda não criado — assume leitor
  }

  return { id: user.id, email: user.email ?? '', name, role }
}

export function isStaff(role?: AppRole | null): boolean {
  return role === 'admin' || role === 'editor'
}
