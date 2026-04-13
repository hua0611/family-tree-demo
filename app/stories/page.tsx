import Link from 'next/link'
import type { Metadata } from 'next'
import { stories } from '@/data/stories'
import { StoryCard } from '@/components/stories/StoryCard'
import type { Story } from '@/types/family'

export const metadata: Metadata = {
  title: '家族故事 | 家族族譜 Demo',
  description: '林氏家族世代傳承的故事與記憶。',
}

interface StoriesPageProps {
  searchParams: Promise<{ tag?: string; person?: string }>
}

function getAllTags(allStories: Story[]): string[] {
  const tagSet = new Set<string>()
  for (const story of allStories) {
    if (story.tags !== undefined) {
      for (const tag of story.tags) {
        tagSet.add(tag)
      }
    }
  }
  return Array.from(tagSet).sort()
}

function filterStories(allStories: Story[], tag: string | undefined, personId: string | undefined): Story[] {
  return allStories
    .filter((story) => {
      if (tag !== undefined && tag !== '') {
        if (story.tags === undefined || !story.tags.includes(tag)) return false
      }
      if (personId !== undefined && personId !== '') {
        if (!story.relatedPersonIds.includes(personId)) return false
      }
      return true
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const params = await searchParams
  const activeTag = params.tag
  const activePerson = params.person

  const allTags = getAllTags(stories)
  const filtered = filterStories(stories, activeTag, activePerson)

  return (
    <main className="min-h-screen bg-webtrees-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-webtrees-muted mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-webtrees-primary transition-colors duration-150">
            首頁
          </Link>
          <span>/</span>
          <span className="text-webtrees-ink font-medium">家族故事</span>
        </nav>

        {/* PageHeader */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-webtrees-ink mb-3">
            家族故事
          </h1>
          <p className="text-webtrees-muted text-base max-w-2xl leading-relaxed">
            林氏家族跨越百年的記憶與傳承，從渡海建業到當代新生，每一個故事都是家族根脈的延續。
          </p>
        </div>

        {/* FilterRow — Tag Filter */}
        {allTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-webtrees-muted mr-1">篩選：</span>

            <Link
              href="/stories"
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors duration-150 font-medium
                ${activeTag === undefined && activePerson === undefined
                  ? 'bg-webtrees-primary text-white border-webtrees-primary'
                  : 'bg-white text-webtrees-muted border-webtrees-primary/20 hover:border-webtrees-primary/50 hover:text-webtrees-primary'
                }`}
            >
              全部
            </Link>

            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/stories?tag=${encodeURIComponent(tag)}`}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors duration-150 font-medium
                  ${activeTag === tag
                    ? 'bg-webtrees-primary text-white border-webtrees-primary'
                    : 'bg-white text-webtrees-muted border-webtrees-primary/20 hover:border-webtrees-primary/50 hover:text-webtrees-primary'
                  }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* 篩選結果提示 */}
        {(activeTag !== undefined || activePerson !== undefined) && (
          <p className="text-sm text-webtrees-muted mb-6">
            找到 {filtered.length} 篇故事
            {activeTag !== undefined && (
              <> — 標籤「<span className="font-medium text-webtrees-accent">{activeTag}</span>」</>
            )}
          </p>
        )}

        {/* Story Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-webtrees-muted">
            <p className="text-lg font-medium">沒有符合條件的故事</p>
            <Link
              href="/stories"
              className="mt-4 inline-block text-sm text-webtrees-accent hover:text-webtrees-primary
                transition-colors duration-150"
            >
              清除篩選條件
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
