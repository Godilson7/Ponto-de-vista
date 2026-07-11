'use server'

import { createClient } from '@/lib/supabase/server'
import { sendLeadNotification } from '@/lib/email'

type ContactInput = {
  tipo: string
  nome: string
  email: string
  whatsapp: string | null
  pais: string | null
  tema: string | null
  livro_ja_escrito: boolean
  objetivo: string | null
  mensagem: string
  /** Honeypot — campo escondido que deve vir sempre vazio. */
  website?: string
}

type ContactResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TIPOS = new Set(['publicar', 'contacto-autor', 'convite-palestra', 'geral'])

/** trim + limite de comprimento (evita payloads abusivos a inchar a BD/email). */
function clamp(value: string | null | undefined, max: number): string {
  return (value ?? '').trim().slice(0, max)
}
function clampOrNull(value: string | null | undefined, max: number): string | null {
  const v = clamp(value, max)
  return v.length ? v : null
}

/**
 * Recebe uma submissão do formulário de contacto: grava em `contact_requests`
 * (a política RLS `contact_insert` permite a qualquer visitante) e notifica a
 * editora por email.
 *
 * Defesas contra abuso (a server action é um endpoint HTTP público):
 *  - honeypot validado no servidor (não só no browser);
 *  - `tipo` restrito a valores conhecidos;
 *  - limites de comprimento em todos os campos.
 *
 * O email é best-effort: se falhar, o pedido fica na mesma gravado — nunca se
 * perde um lead por causa do email.
 */
export async function submitContactRequest(input: ContactInput): Promise<ContactResult> {
  // Honeypot: se o campo escondido vier preenchido é um bot. Fingimos sucesso
  // (não gravamos nem enviamos) para não o alertar de que foi apanhado.
  if (clamp(input.website, 1)) {
    return { ok: true }
  }

  const nome = clamp(input.nome, 200)
  const email = clamp(input.email, 320)
  const mensagem = clamp(input.mensagem, 5000)

  if (!nome || !email || !mensagem) {
    return { ok: false, error: 'Faltam campos obrigatórios.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'E-mail inválido.' }
  }

  const tipo = TIPOS.has(input.tipo) ? input.tipo : 'geral'
  const whatsapp = clampOrNull(input.whatsapp, 40)
  const pais = clampOrNull(input.pais, 100)
  const tema = clampOrNull(input.tema, 200)
  const objetivo = clampOrNull(input.objetivo, 300)

  const supabase = await createClient()
  const { error } = await supabase.from('contact_requests').insert({
    tipo,
    nome,
    email,
    whatsapp,
    pais,
    tema,
    livro_ja_escrito: Boolean(input.livro_ja_escrito),
    objetivo,
    mensagem,
  })

  if (error) {
    console.error('[contact] Falha ao gravar o pedido:', error)
    return { ok: false, error: 'Não foi possível registar o pedido.' }
  }

  try {
    await sendLeadNotification({ tipo, nome, email, whatsapp, pais, tema, mensagem })
  } catch (err) {
    console.error('[contact] Falha ao enviar a notificação por email:', err)
  }

  return { ok: true }
}
