# Ponto de Vista Editora

Plataforma de autoridade editorial internacional de língua portuguesa
(Portugal · Brasil · África Lusófona). **Publicação + Posicionamento +
Autoridade Internacional** — não é uma loja de livros, é uma casa de autores.

Direção visual: **Direção 4 — "A Academia"** (institucional / modernista).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript (strict) |
| CMS / Admin / Auth | Payload CMS 3 (embebido, painel em `/admin`) |
| Base de dados | PostgreSQL (produção) · SQLite (dev) — adaptador comutável |
| Estilos | Tailwind CSS 3 + padrão shadcn/ui (Radix + cva) |
| Tipografia | Inter + Cormorant (self-hosted via `next/font`) |
| SEO | `generateMetadata` por rota + JSON-LD + sitemap/robots |

> **Versões fixadas:** Next `15.4.11` e Payload `3.85.1`. O Next está fixado em
> 15.4.11 por ser a versão da linha 15 dentro do intervalo suportado pelo Payload
> 3.85 (o 15.5+ ainda não é suportado). Atualizar com cuidado.

---

## Arranque rápido

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Painel: http://localhost:3000/admin (cria o primeiro utilizador na 1.ª visita)

As variáveis estão em `.env` (já criado para dev, com um `PAYLOAD_SECRET`
gerado). Vê `.env.example` para a referência completa.

### Scripts

| Script | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build de produção / servir |
| `npm run generate:types` | Regenera `src/payload-types.ts` a partir das coleções |
| `npm run generate:importmap` | Regenera o import map do admin do Payload |
| `npm run lint` | ESLint |

---

## Contas e acesso

- **Painel da editora** (admin/editor): http://localhost:3000/admin — **100% em
  português**. O **primeiro utilizador** criado torna-se automaticamente **admin**.
- **Registo público de autores:** qualquer pessoa cria conta em
  http://localhost:3000/registar e entra em `/entrar`. Novas contas são sempre
  `author` (escalonamento de papéis bloqueado no servidor). Ao registar-se, é
  criado automaticamente um **perfil de autor em rascunho**, ligado à conta.
- **Área do Autor** (`/conta`): o autor vê o estado do seu perfil
  (rascunho/publicado) e edita-o no painel (`/admin`), com acesso limitado ao
  próprio perfil. Tudo o que edita fica **rascunho até a editora publicar**.
- **Perfil público:** visível a todos, sem login, em `/autores/[slug]` — assim
  que a editora o publica.

> Papéis: `admin` (tudo) · `editor` (revê e publica) · `author` (edita só o
> próprio conteúdo, nunca publica diretamente).

---

## Base de dados — SQLite (dev) ↔ PostgreSQL (produção)

O adaptador é escolhido em runtime a partir de `DATABASE_URI`
(ver `src/payload.config.ts`):

- **Começa por `postgres`** → adaptador **PostgreSQL**.
- **Caso contrário / vazio** → **SQLite** local (`./pontodevista.db`).

Atualmente o dev usa SQLite (zero configuração). Para usar o **PostgreSQL 16
local** (já instalado nesta máquina), basta apontar `DATABASE_URI` para ele:

```bash
# 1) criar a base de dados (uma vez), com a password do utilizador postgres:
"C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres pontodevista

# 2) em .env:
DATABASE_URI=postgres://postgres:A_TUA_PASSWORD@localhost:5432/pontodevista
```

> Trocar de adaptador altera o esquema subjacente; ao migrar para Postgres em
> produção, gerar/aplicar migrações do Payload (`payload migrate`).

---

## Estrutura

```
src/
  payload.config.ts          # Configuração do Payload (DB comutável, coleções)
  payload-types.ts           # Tipos gerados (não editar à mão)
  collections/               # Users (RBAC), Media (uploads)
  app/
    (frontend)/              # Site público (root layout próprio: fontes, navbar, footer)
      layout.tsx  globals.css
      page.tsx               # Home
      a-editora/page.tsx     # A Editora
    (payload)/               # Admin + API REST/GraphQL do Payload
    robots.ts  sitemap.ts    # SEO
  components/
    brand/                   # Wordmark + símbolo (livro aberto)
    layout/                  # Navbar, Footer
    sections/                # HomeHero, PageHeader, StatsBand
    cards/                   # AuthorCard, BookCard
    ui/                      # Button, Container, Section, Tag (shadcn-style)
    seo/                     # JsonLd
  lib/                       # utils (cn), site (config), seo, sample-content
```

### Sistema de design

Os tokens da Direção 4 são a **fonte única de verdade visual**, definidos em
`tailwind.config.ts` e espelhados como CSS custom properties em
`src/app/(frontend)/globals.css`:

`--paper #EFEAE0` · `--paper-card #F6F2EA` · `--ink #15140F` ·
`--ink-soft #3A3A2E` · `--emerald #1E4D3A` · `--emerald-deep #163B2C` ·
`--gold #B0934A` · `--muted #6F6857`.

Inter para títulos justos, UI e números; Cormorant itálico apenas para
citações/pull-quotes/subtítulos. Esmeralda é o acento de marca; ouro é detalhe.

---

## Roadmap (estado)

- [x] **F1 — Fundações:** scaffold Next + Payload + DB, design system (tokens,
  navbar, rodapé, hero, cartões, faixa de estatísticas), páginas `/` e `/a-editora`,
  SEO base (metadata, JSON-LD Organization, sitemap, robots).
- [x] **Páginas públicas (todas as rotas):** `/autores` + `/autores/[slug]` (página
  de autoridade), `/livros` + `/livros/[slug]`, `/publicar`, `/blog` + categorias +
  artigo, `/conta`. Pesquisa e filtros, JSON-LD por tipo (Person/ProfilePage, Book,
  BlogPosting, BreadcrumbList), 404 com marca.
- [x] **F2 — Autores & Livros no CMS:** coleções Payload (Authors, Books, BlogPosts,
  Taxonomies, ContactRequests) com `versions.drafts`, RBAC (admin/editor/author),
  hook de slug e hook de fluxo de aprovação. `src/lib/content.ts` lê do Payload Local
  API (apenas `_status: published`); rich text Lexical renderizado no frontend.
  ISR (`revalidate = 60`) nas páginas públicas. Seed em `src/seed.ts`.
- [~] **F3 — Conversão:** falta o backend dos formulários (Turnstile + Resend +
  gravar em `ContactRequests`). A coleção já existe; a UI dos formulários abre o
  WhatsApp por agora.
- [x] **F4 — Blog no CMS** (lista, categorias e artigo a partir do Payload).
- [~] **F5 — Área do Autor:** registo público + login por email + dashboard
  `/conta` + fluxo de aprovação (drafts + RBAC + `forceDraftForAuthors`) **feitos**.
  O autor edita o perfil no painel (PT), limitado ao próprio. Falta (opcional) um
  **editor de perfil dedicado no frontend** e a verificação de email (requer F3).
- [ ] **F6 — Painel + SEO completo + QA/testes** (revalidação on-demand ao publicar).
- [ ] **F7 — Pagamentos (Stripe) + i18n pt-BR.**

### Seed da base de dados

O conteúdo de demonstração está em `src/seed.ts` (idempotente). Com o servidor a
correr (`npm run dev`), executar noutro terminal:

```bash
npm run seed
```

> Aciona `GET /seed?secret=<PAYLOAD_SECRET>`, que corre dentro do Next (evita o
> runner `tsx`, que falha neste ambiente Windows/Node 24). Cria autores, livros,
> categorias e artigos **publicados**. O CTA "Comprar" está abstraído em
> `getBuyUrl(book)` (Stripe na F7).
