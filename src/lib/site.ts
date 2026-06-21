/**
 * Configuração institucional do site — fonte única para navbar, rodapé,
 * SEO e dados estruturados.
 */
export const siteConfig = {
  name: 'Ponto de Vista Editora',
  shortName: 'Ponto de Vista',
  tagline: 'Publicação · Posicionamento · Autoridade Internacional',
  description:
    'Editora internacional de língua portuguesa. Publicamos histórias e construímos autoridade — conectando autores de Portugal, Brasil e África Lusófona ao mundo.',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  locale: 'pt-PT',
  email: 'geral@pontodevista.pt',
  // Navegação principal (catálogo/ações) — sem repetir os links utilitários.
  nav: [
    { label: 'Autores', href: '/autores' },
    { label: 'Livros', href: '/livros' },
    { label: 'Publicar', href: '/publicar' },
    { label: 'Blog', href: '/blog' },
  ],
  // Barra utilitária (institucional) — distinta da navegação principal.
  utility: [
    { label: 'A Editora', href: '/a-editora' },
    { label: 'Eventos', href: '/eventos' },
    { label: 'Contacto', href: '/publicar#contacto' },
  ],
  presence: [
    { city: 'Lisboa', country: 'Portugal' },
    { city: 'São Paulo', country: 'Brasil' },
    { city: 'Luanda', country: 'Angola' },
  ],
  // Sem redes sociais públicas por agora — preencher quando os perfis reais existirem.
  social: [] as { label: string; href: string }[],
} as const

export type SiteConfig = typeof siteConfig

/** Constrói um link mailto com assunto e corpo pré-preenchidos. */
export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
