import Link from 'next/link'
import Image from 'next/image'
import type { Story } from '@/types/family'
import { getPerson } from '@/lib/family-helpers'

interface StoryCardProps {
  story: Story
}

function formatPublishedDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

export function StoryCard({ story }: StoryCardProps) {
  const { id, title, excerpt, coverUrl, publishedAt, authorId, tags } = story
  const author = authorId !== undefined ? getPerson(authorId) : undefined
  const formattedDate = formatPublishedDate(publishedAt)

  return (
    <Link
      href={`/stories/${id}`}
      className="group block rounded-xl overflow-hidden border border-webtrees-primary/15
        bg-white shadow-sm hover:shadow-md transition-all duration-200
        hover:border-webtrees-primary/40"
    >
      {/* 封面圖 */}
      <div className="relative aspect-video overflow-hidden bg-webtrees-primary/10">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-webtrees-primary/20 font-serif select-none">故</span>
          </div>
        )}
      </div>

      {/* 卡片內容 */}
      <div className="p-4 space-y-2">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-webtrees-primary/10
                  text-webtrees-primary border border-webtrees-primary/20 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 標題 */}
        <h3 className="text-base font-serif font-bold text-webtrees-ink leading-snug
          group-hover:text-webtrees-primary transition-colors duration-200">
          {title}
        </h3>

        {/* 摘要 */}
        <p className="text-sm text-webtrees-muted leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* 作者 + 日期 */}
        <div className="flex items-center justify-between pt-1 text-xs text-webtrees-muted">
          {author !== undefined ? (
            <span className="font-medium text-webtrees-accent">{author.fullName}</span>
          ) : (
            <span />
          )}
          <time dateTime={publishedAt}>{formattedDate}</time>
        </div>
      </div>
    </Link>
  )
}
