import * as React from 'react'
import Link from 'next/link'

export type PostCardProps = {
  title: string
  excerpt: string
  categoryName: string
  categorySlug: string
  author: string
  date: string
  href: string
}

/** Cartão de artigo do blog. */
export function PostCard({
  title,
  excerpt,
  categoryName,
  categorySlug,
  author,
  date,
  href,
}: PostCardProps) {
  return (
    <article className="group flex flex-col rounded-md border border-border bg-paper-card p-6 shadow-card transition-shadow duration-300 hover:shadow-lift">
      <Link
        href={`/blog/${categorySlug}`}
        className="label w-fit text-emerald transition-colors hover:text-emerald-deep"
      >
        {categoryName}
      </Link>
      <h3 className="mt-4 text-h3 font-medium tracking-tightish text-ink">
        <Link href={href} className="transition-colors hover:text-emerald">
          {title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-small leading-relaxed text-ink-soft">{excerpt}</p>
      <p className="mt-6 text-small text-muted">
        {author} · {date}
      </p>
    </article>
  )
}
