import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="麵包屑導覽" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-webtrees-muted">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span aria-hidden className="text-webtrees-primary/30 select-none">
                  /
                </span>
              )}
              {isLast || item.href === undefined ? (
                <span
                  className={isLast ? 'text-webtrees-ink font-medium' : 'text-webtrees-muted'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-webtrees-primary hover:underline underline-offset-2 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
