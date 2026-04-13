import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { stories } from '@/data/stories'
import { StoryHero } from '@/components/stories/StoryHero'
import { StoryContent } from '@/components/stories/StoryContent'
import { RelatedPeopleRow } from '@/components/stories/RelatedPeopleRow'

interface StoryPageProps {
  params: Promise<{ id: string }>
}

function getStoryById(id: string) {
  return stories.find((s) => s.id === id)
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params
  const story = getStoryById(id)
  if (story === undefined) return { title: '故事不存在' }
  return {
    title: `${story.title} | 家族故事 | 家族族譜 Demo`,
    description: story.excerpt,
  }
}

export function generateStaticParams() {
  return stories.map((s) => ({ id: s.id }))
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params
  const story = getStoryById(id)

  if (story === undefined) {
    notFound()
  }

  // 上一篇 / 下一篇（依陣列順序，由新到舊排序後的索引）
  const sorted = [...stories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const currentIndex = sorted.findIndex((s) => s.id === id)
  const prevStory = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : undefined
  const nextStory = currentIndex > 0 ? sorted[currentIndex - 1] : undefined

  return (
    <main className="min-h-screen bg-webtrees-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-webtrees-muted mb-8 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-webtrees-primary transition-colors duration-150">
            首頁
          </Link>
          <span>/</span>
          <Link
            href="/stories"
            className="hover:text-webtrees-primary transition-colors duration-150"
          >
            家族故事
          </Link>
          <span>/</span>
          <span className="text-webtrees-ink font-medium line-clamp-1">{story.title}</span>
        </nav>

        {/* Hero：封面 + 標題 + meta */}
        <StoryHero story={story} />

        {/* 文章本文 */}
        <article>
          <StoryContent content={story.content} />
        </article>

        {/* 相關人物列 */}
        <RelatedPeopleRow personIds={story.relatedPersonIds} />

        {/* 上一篇 / 下一篇 導覽 */}
        <nav
          className="mt-12 pt-8 border-t border-webtrees-primary/15
            grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label="文章導覽"
        >
          {prevStory !== undefined ? (
            <Link
              href={`/stories/${prevStory.id}`}
              className="group flex flex-col gap-1 p-4 rounded-lg border border-webtrees-primary/15
                bg-white hover:border-webtrees-primary/40 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-xs text-webtrees-muted uppercase tracking-wide font-medium">
                上一篇
              </span>
              <span className="text-sm font-serif font-bold text-webtrees-ink
                group-hover:text-webtrees-primary transition-colors duration-200 leading-snug">
                {prevStory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextStory !== undefined ? (
            <Link
              href={`/stories/${nextStory.id}`}
              className="group flex flex-col gap-1 p-4 rounded-lg border border-webtrees-primary/15
                bg-white hover:border-webtrees-primary/40 hover:shadow-sm transition-all duration-200
                sm:text-right"
            >
              <span className="text-xs text-webtrees-muted uppercase tracking-wide font-medium">
                下一篇
              </span>
              <span className="text-sm font-serif font-bold text-webtrees-ink
                group-hover:text-webtrees-primary transition-colors duration-200 leading-snug">
                {nextStory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </main>
  )
}
