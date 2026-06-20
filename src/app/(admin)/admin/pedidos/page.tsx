import * as React from 'react'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { formatDatePt } from '@/lib/content'
import { updateContactStatus } from '../actions'

export const dynamic = 'force-dynamic'

const tipoLabels: Record<string, string> = {
  publicar: 'Publicar',
  'convite-palestra': 'Convite',
  'contacto-autor': 'Contacto autor',
  geral: 'Geral',
}

export default async function AdminPedidos() {
  const supabase = await createClient()
  const { data: pedidos } = await supabase
    .from('contact_requests')
    .select('id,tipo,nome,email,whatsapp,pais,tema,mensagem,status,created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <p className="label mb-2 text-emerald">Mensagens</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Pedidos de contacto</h1>

      <div className="mt-8 space-y-4">
        {(pedidos ?? []).map((p) => (
          <Card key={p.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">
                  {p.nome}{' '}
                  <span className="text-small font-normal text-muted">· {tipoLabels[p.tipo] ?? p.tipo}</span>
                </p>
                <p className="text-small text-muted">
                  <a href={`mailto:${p.email}`} className="text-emerald hover:underline">
                    {p.email}
                  </a>
                  {p.whatsapp ? ` · ${p.whatsapp}` : ''}
                  {p.pais ? ` · ${p.pais}` : ''}
                </p>
              </div>
              <span className="text-small text-muted">{formatDatePt(p.created_at)}</span>
            </div>
            {p.tema ? <p className="mt-3 text-small text-ink">Tema: {p.tema}</p> : null}
            <p className="mt-2 whitespace-pre-wrap text-small leading-relaxed text-ink-soft">
              {p.mensagem}
            </p>
            <form action={updateContactStatus} className="mt-4 flex items-center gap-3">
              <input type="hidden" name="id" value={p.id} />
              <Select name="status" defaultValue={p.status} className="max-w-[180px]">
                <option value="novo">Novo</option>
                <option value="em-curso">Em curso</option>
                <option value="fechado">Fechado</option>
              </Select>
              <Button type="submit" variant="outline" size="sm">
                Atualizar
              </Button>
            </form>
          </Card>
        ))}
        {(pedidos ?? []).length === 0 ? (
          <Card className="p-6">
            <p className="text-small text-muted">Sem pedidos por agora.</p>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
