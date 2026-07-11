import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

/**
 * Callback de autenticação do Supabase. Troca o `code` do link (recuperação de
 * palavra-passe, confirmação de email) por uma sessão nos cookies e encaminha
 * para `next`. `next` é validado para evitar open redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const nextParam = searchParams.get('next') ?? '/conta'
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/conta'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/entrar?erro=link-invalido`)
}
