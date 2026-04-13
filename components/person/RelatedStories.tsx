import Image from 'next/image'
import Link from 'next/link'
import type { PersonId } from '@/types/family'
import { stories } from '@/data/stories'

const MAX_ITEMS = 8

interface RelatedStoriesProps {
  personId: PersonId
}

interface StoryCardProps {
  story: (typeof stories)[number]
}

function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      href={`/stories/${story.id}`}
      className="group flex gap-4 p-3 rounded-lg border border-webtrees-primary/15
        hover:border-webtrees-primary/40 bg-white transition-colors"
    >
      {story.coverUrl && (
        <div className="w-20 h-14 flex-shrink-0 rounded overflow-hidden relative bg-gray-100">
          <Image
            src={story.coverUrl}
            alt={story.title}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-webtrees-ink line-clamp-2 group-hover:text-webtrees-primary transition-colors">
          {story.title}
        </p>
        <p className="text-xs text-webtrees-muted mt-1 line-clamp-2 leading-relaxed">
          {story.excerpt}
        </p>
        <p className="text-xs text-webtrees-muted mt-1.5">{story.publishedAt.slice(0, 10)}</p>
      </div>
    </Link>
  )
}

export function RelatedStories({ personId }: RelatedStoriesProps) {
  const related = stories.filter((s) => s.relatedPersonIds.includes(personId))
  const displayed = related.slice(0, MAX_ITEMS)
  const hasMore = related.length > MAX_ITEMS

  if (related.length === 0) {
    return (
      <p className="text-sm text-webtrees-muted py-8 text-center">此人物尚無相關故事</p>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {displayed.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <Link
            href={`/stories?person=${personId}`}
            className="text-sm text-webtrees-accent hover:text-webtrees-primary underline underline-offset-2 transition-colors"
          >
            查看全部 {related.length} 篇故事
          </Link>
        </div>
      )}
    </div>
  )
}
