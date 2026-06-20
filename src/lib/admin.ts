import { redirect } from 'next/navigation'

import { getCurrentUser, type AppUser } from '@/lib/auth'

/** Garante que o utilizador é staff (admin/editor); senão redireciona. */
export async function requireStaff(): Promise<AppUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/entrar')
  if (user.role !== 'admin' && user.role !== 'editor') redirect('/')
  return user
}

/** Converte uma string CSV em array (para campos de texto múltiplos). */
export function csvToArray(value: FormDataEntryValue | null): string[] {
  if (!value) return []
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Faz parse seguro de JSON de um campo de formulário; devolve fallback em erro. */
export function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(String(value)) as T
  } catch {
    return fallback
  }
}

export function str(value: FormDataEntryValue | null): string {
  return value ? String(value).trim() : ''
}

export function strOrNull(value: FormDataEntryValue | null): string | null {
  const s = str(value)
  return s.length ? s : null
}
