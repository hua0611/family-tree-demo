import Image from 'next/image'
import Link from 'next/link'
import type { Story } from '@/types/family'

interface StoryCardProps {
  story: Story
}

function StoryCard({ story }: StoryCardProps) {
  const dateLabel = new Date(story.publishedAt).toLocaleDateString('zh-Hant', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/stories/${story.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-webtrees-accent/20 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {story.coverUrl && (
        <div className="relative h-44 w-full overflow-hidden bg-webtrees-surface">
          <Image
            src={story.coverUrl}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-5">
        <p className="text-xs text-webtrees-muted">{dateLabel}</p>
        <h3 className="font-serif text-base font-bold leading-snug text-webtrees-ink group-hover:text-webtrees-accent transition-colors">
          {story.title}
        </h3>
        <p className="line-clamp-2 text-sm text-webtrees-muted">{story.excerpt}</p>
        {story.tags && story.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {story.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-webtrees-accent/10 px-2 py-0.5 text-xs text-webtrees-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

interface RecentStoriesProps {
  stories: Story[]
}

export function RecentStories({ stories }: RecentStoriesProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-webtrees-ink">最近的家族故事</h2>
          <Link
            href="/stories"
            className="text-sm font-medium text-webtrees-accent hover:underline"
          >
            閱讀更多故事 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}
