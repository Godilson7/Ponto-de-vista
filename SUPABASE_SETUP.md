# Migração para Supabase — guia de configuração

Estamos a migrar a app para **Supabase (Auth + PostgreSQL)** com um **painel de
administração próprio**, removendo o Payload. Esta migração precisa de um projeto
Supabase teu. Segue estes passos e dá-me os valores no fim.

## 1. Criar o projeto
1. Vai a https://supabase.com → **New project**.
2. Escolhe um nome (ex.: `ponto-de-vista`), uma **password** forte para a base de
   dados e a região mais próxima (ex.: Frankfurt / EU).
3. Espera ~2 min até o projeto ficar pronto.

## 2. Criar o esquema
1. No Supabase Studio → **SQL Editor** → **New query**.
2. Cola o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e corre (Run).
3. (Opcional, recomendado) Corre também [`supabase/seed.sql`](supabase/seed.sql)
   para teres conteúdo de demonstração (autores, livros, artigos).

## 3. Copiar as chaves
No Studio → **Project Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key (secreta) → `SUPABASE_SERVICE_ROLE_KEY`

## 4. Configurar o email/auth
No Studio → **Authentication → Providers → Email**: ativa **Email**.
- Para desenvolvimento, podes **desativar "Confirm email"** (Authentication →
  Providers → Email → desligar a confirmação) para entrar logo sem confirmar.
- Em produção, mantém a confirmação ligada.

## 5. Dar-me os valores
Cola aqui (ou mete diretamente no `.env`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> A **primeira conta** que criares (em `/registar`) torna-se automaticamente
> **admin**. As seguintes entram como **leitor**; promoves a autor/editor no
> painel.

## O que acontece a seguir (eu trato)
Assim que tiver as chaves e o esquema estiver criado:
1. Reescrevo a camada de dados e a autenticação para Supabase.
2. Construo o painel de administração próprio (gerir autores/livros/artigos,
   aprovar rascunhos, dar permissões, ver pedidos de contacto).
3. **Removo o Payload** por completo.
4. Verifico tudo a funcionar.

Até lá, a app continua a funcionar no Payload para não ficar partida.
