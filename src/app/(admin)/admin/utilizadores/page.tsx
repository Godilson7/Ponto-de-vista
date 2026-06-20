import * as React from 'react'

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { updateUserRole } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminUtilizadores() {
  const supabase = await createClient()
  const { data: utilizadores } = await supabase
    .from('profiles')
    .select('id,name,role,created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <p className="label mb-2 text-emerald">Permissões</p>
      <h1 className="text-h2 font-semibold tracking-tightish text-ink">Utilizadores</h1>
      <p className="mt-3 max-w-prose text-small text-muted">
        Conceda permissões alterando o papel. Promova um leitor a <strong>Autor</strong> para criar
        o perfil público, ou a <strong>Editor/Administrador</strong> para gerir conteúdo.
      </p>

      <Card className="mt-8 divide-y divide-border">
        {(utilizadores ?? []).map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{u.name || '(sem nome)'}</p>
              <p className="truncate text-small text-muted">{u.id}</p>
            </div>
            <form action={updateUserRole} className="flex items-center gap-2">
              <input type="hidden" name="id" value={u.id} />
              <Select name="role" defaultValue={u.role} className="max-w-[160px]">
                <option value="reader">Leitor</option>
                <option value="author">Autor</option>
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </Select>
              <Button type="submit" variant="outline" size="sm">
                Guardar
              </Button>
            </form>
          </div>
        ))}
        {(utilizadores ?? []).length === 0 ? (
          <p className="p-6 text-small text-muted">Sem utilizadores.</p>
        ) : null}
      </Card>
    </div>
  )
}
