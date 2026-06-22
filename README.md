# Ponto de Vista Editora

Plataforma editorial internacional de língua portuguesa — **Publicação · Posicionamento · Autoridade Internacional**. Não é uma loja de livros: é uma casa de autores (Portugal · Brasil · África Lusófona).

Site institucional com catálogo de livros, perfis de autoridade dos autores, blog, agenda de eventos, **área do autor** (submissão de artigos/eventos com aprovação) e **painel de gestão** da editora.

## Stack

- **Next.js 15** (App Router, Server Actions) · React 19 · TypeScript (strict)
- **Tailwind CSS 3** (tokens em CSS variables, modo claro/escuro)
- **Supabase** — PostgreSQL + Auth + Storage, com Row Level Security
- **Playwright** — testes end-to-end

## Arranque rápido

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run test:e2e     # testes Playwright
```

## Variáveis de ambiente (`.env`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SERVER_URL=http://localhost:3000   # URL de produção quando publicado
```

## Base de dados (Supabase)

Correr no **SQL Editor** do Supabase, por ordem:

1. `supabase/schema.sql` — tabelas + RLS
2. `supabase/seed.sql` — conteúdo inicial
3. `supabase/02_commerce.sql` — preços + cesto/lista
4. `supabase/03_storage.sql` — bucket de imagens (`media`)
5. `supabase/04_events.sql` — eventos
6. `supabase/05_author_submissions.sql` — submissões de autores
7. `supabase/06_author_whatsapp.sql` — WhatsApp do autor
8. `supabase/07_seed_blog_categories.sql` — categorias do blog

## Papéis e acesso

- **Painel da editora** (`/admin`) — `admin` / `editor`. Gere autores, livros, artigos, eventos, taxonomias, pedidos e aprovações.
- **Área do autor** (`/conta`) — `author` edita o próprio perfil e submete artigos/eventos; tudo fica **rascunho até a editora aprovar** em `/admin/aprovacoes`.
- **Público** — catálogo, autores, blog e eventos visíveis sem login.

## Deploy (Vercel)

1. Importar o repositório em [vercel.com](https://vercel.com) e definir as variáveis de ambiente acima (`NEXT_PUBLIC_SERVER_URL` = URL de produção).
2. No Supabase → *Authentication → URL Configuration*, adicionar o URL de produção a **Site URL** e **Redirect URLs** (para o login funcionar).
