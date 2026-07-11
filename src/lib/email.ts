import { Resend } from 'resend'

/**
 * Envio de email transacional via Resend. Módulo exclusivo do servidor
 * (só é importado por Server Actions).
 *
 * Variáveis de ambiente (.env local / Vercel em produção):
 *   RESEND_API_KEY          — chave da API do Resend
 *   EMAIL_FROM              — remetente num domínio VERIFICADO no Resend,
 *                             ex.: "Ponto de Vista Editora <geral@edpontodevista.com>"
 *   EMAIL_NOTIFICATIONS_TO  — caixa que recebe os avisos de novos pedidos
 *
 * Sem estas variáveis nada é enviado (apenas se regista um aviso) — o email
 * nunca deita abaixo a operação que o chamou.
 */

export type LeadNotification = {
  tipo: string
  nome: string
  email: string
  whatsapp?: string | null
  pais?: string | null
  tema?: string | null
  mensagem: string
}

const TIPO_LABELS: Record<string, string> = {
  publicar: 'Publicar',
  'convite-palestra': 'Convite para palestra',
  'contacto-autor': 'Contacto com autor',
  geral: 'Geral',
}

/** Notifica a editora (EMAIL_NOTIFICATIONS_TO) de um novo pedido de contacto. */
export async function sendLeadNotification(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const to = process.env.EMAIL_NOTIFICATIONS_TO

  if (!apiKey || !from || !to) {
    console.warn(
      '[email] Notificação ignorada — falta RESEND_API_KEY, EMAIL_FROM ou EMAIL_NOTIFICATIONS_TO.',
    )
    return
  }

  const label = TIPO_LABELS[lead.tipo] ?? lead.tipo
  const campos: Array<[string, string | null | undefined]> = [
    ['Tipo', label],
    ['Nome', lead.nome],
    ['E-mail', lead.email],
    ['WhatsApp', lead.whatsapp],
    ['País', lead.pais],
    ['Tema', lead.tema],
  ]
  const preenchidos = campos.filter(
    ([, v]) => v != null && String(v).trim().length > 0,
  ) as Array<[string, string]>

  const text = [
    ...preenchidos.map(([k, v]) => `${k}: ${v}`),
    '',
    'Mensagem:',
    lead.mensagem,
  ].join('\n')

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1c1c1c;line-height:1.5">
      <h2 style="margin:0 0 12px;font-size:18px">Novo pedido — ${escapeHtml(label)}</h2>
      <table style="border-collapse:collapse;font-size:14px">
        ${preenchidos
          .map(
            ([k, v]) =>
              `<tr><td style="padding:2px 16px 2px 0;color:#6b7280;vertical-align:top">${escapeHtml(
                k,
              )}</td><td>${escapeHtml(v)}</td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin:16px 0 4px;color:#6b7280;font-size:14px">Mensagem</p>
      <p style="white-space:pre-wrap;font-size:14px;margin:0">${escapeHtml(lead.mensagem)}</p>
    </div>`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: lead.email, // responder na caixa da editora vai direto ao remetente do pedido
    subject: `Novo pedido (${label}) — ${lead.nome}`,
    text,
    html,
  })

  if (error) {
    // Ex.: domínio ainda não verificado, remetente inválido, chave errada.
    console.error('[email] O Resend recusou o envio:', error)
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
