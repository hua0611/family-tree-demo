import Image from 'next/image'
import type { Story } from '@/types/family'
import { getPerson } from '@/lib/family-helpers'

interface StoryHeroProps {
  story: Story
}

function formatPublishedDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

function estimateReadingMinutes(content: string): number {
  const charCount = content.replace(/\s/g, '').length
  const minutes = Math.ceil(charCount / 350)
  return Math.max(1, minutes)
}

export function StoryHero({ story }: StoryHeroProps) {
  const { title, coverUrl, publishedAt, authorId, content, tags } = story
  const author = authorId !== undefined ? getPerson(authorId) : undefined
  const formattedDate = formatPublishedDate(publishedAt)
  const readingTime = estimateReadingMinutes(content)

  return (
    <div className="mb-10">
      {/* 封面圖 */}
      {coverUrl && (
        <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-xl mb-8
          bg-webtrees-primary/10">
          <Image
            src={coverUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
          {/* 漸層遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-webtrees-primary/10
                text-webtrees-primary border border-webtrees-primary/20 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 標題 */}
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-webtrees-ink leading-tight mb-5">
        {title}
      </h1>

      {/* 作者 + 日期 + 閱讀時間 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-webtrees-muted
        border-b border-webtrees-primary/15 pb-6">
        {author !== undefined && (
          <div className="flex items-center gap-2">
            {author.photoUrl ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-webtrees-primary/30 flex-shrink-0">
                <Image
                  src={author.photoUrl}
                  alt={author.fullName}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-webtrees-primary/30
                bg-webtrees-primary/10 flex items-center justify-center
                text-sm font-serif text-webtrees-primary font-bold flex-shrink-0">
                {author.surname.charAt(0)}
              </div>
            )}
            <span className="font-medium text-webtrees-accent">{author.fullName}</span>
          </div>
        )}

        <time dateTime={publishedAt} className="text-webtrees-muted">
          {formattedDate}
        </time>

        <span className="text-webtrees-muted">
          約 {readingTime} 分鐘閱讀
        </span>
      </div>
    </div>
  )
}
