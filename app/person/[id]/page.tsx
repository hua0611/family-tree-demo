import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPerson } from '@/lib/family-helpers'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { PersonHeader } from '@/components/person/PersonHeader'
import { BiographySectionClient } from '@/components/person/BiographySectionClient'
import { EventTimeline } from '@/components/person/EventTimeline'
import { RelationPanel } from '@/components/person/RelationPanel'
import { MediaGallery } from '@/components/person/MediaGallery'
import { RelatedStories } from '@/components/person/RelatedStories'

const VALID_TABS = ['overview', 'events', 'family', 'media', 'stories'] as const
type TabValue = (typeof VALID_TABS)[number]

const TAB_LABELS: Record<TabValue, string> = {
  overview: '總覽',
  events: '事件時間軸',
  family: '家族關係',
  media: '媒體',
  stories: '相關故事',
}

interface PersonPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id } = await params
  const person = getPerson(id)
  if (person === undefined) {
    return { title: '找不到人物 | 家族族譜' }
  }
  return {
    title: `${person.fullName} | 家族族譜`,
    description: person.biography?.slice(0, 120),
  }
}

export default async function PersonPage({ params, searchParams }: PersonPageProps) {
  const { id } = await params
  const { tab: tabParam } = await searchParams

  const person = getPerson(id)
  if (person === undefined) {
    notFound()
  }

  const safePerson = person

  // 解析並驗證 tab 值
  const activeTab: TabValue =
    tabParam !== undefined && (VALID_TABS as readonly string[]).includes(tabParam)
      ? (tabParam as TabValue)
      : 'overview'

  const GENDER_LABEL: Record<string, string> = {
    male: '男',
    female: '女',
    unknown: '不明',
  }

  return (
    <main className="min-h-screen bg-webtrees-surface">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 麵包屑 */}
        <Breadcrumb
          items={[
            { label: '首頁', href: '/' },
            { label: '家族成員', href: '/members' },
            { label: safePerson.fullName },
          ]}
        />

        <article>
          {/* 人物頭部 */}
          <PersonHeader person={safePerson} />

          {/* Tab 導覽（純 a tag + searchParams，SSR-friendly） */}
          <nav
            aria-label="個人頁面分頁"
            className="mt-6 flex gap-1 border-b border-webtrees-primary/15 overflow-x-auto"
          >
            {VALID_TABS.map((tab) => {
              const isActive = tab === activeTab
              return (
                <Link
                  key={tab}
                  href={`/person/${id}?tab=${tab}`}
                  className={[
                    'flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-t-md',
                    'border-b-2 transition-colors',
                    isActive
                      ? 'border-webtrees-primary text-webtrees-primary bg-white'
                      : 'border-transparent text-webtrees-muted hover:text-webtrees-ink hover:bg-white/60',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {TAB_LABELS[tab]}
                </Link>
              )
            })}
          </nav>

          {/* Tab 內容 */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <BiographySectionClient person={safePerson} />

                {/* Quick Facts */}
                <div className="bg-white border border-webtrees-primary/15 rounded-lg p-5">
                  <h2 className="text-base font-semibold text-webtrees-ink mb-4">基本資料</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {safePerson.birthPlace && (
                      <>
                        <dt className="text-xs text-webtrees-muted uppercase tracking-wide">出生地</dt>
                        <dd className="text-sm text-webtrees-ink">{safePerson.birthPlace}</dd>
                      </>
                    )}
                    {!safePerson.isLiving && safePerson.deathPlace && (
                      <>
                        <dt className="text-xs text-webtrees-muted uppercase tracking-wide">逝世地</dt>
                        <dd className="text-sm text-webtrees-ink">{safePerson.deathPlace}</dd>
                      </>
                    )}
                    <dt className="text-xs text-webtrees-muted uppercase tracking-wide">性別</dt>
                    <dd className="text-sm text-webtrees-ink">
                      {GENDER_LABEL[safePerson.gender] ?? '不明'}
                    </dd>
                    {safePerson.tags && safePerson.tags.length > 0 && (
                      <>
                        <dt className="text-xs text-webtrees-muted uppercase tracking-wide">標籤</dt>
                        <dd className="flex flex-wrap gap-1.5">
                          {safePerson.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-webtrees-primary/10
                                text-webtrees-primary border border-webtrees-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </dd>
                      </>
                    )}
                  </dl>
                </div>

                {/* 連結到族譜視圖 */}
                <div className="flex gap-3">
                  <Link
                    href={`/tree/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                      border border-webtrees-primary/30 text-webtrees-primary text-sm font-medium
                      hover:bg-webtrees-primary/5 transition-colors"
                  >
                    <span aria-hidden>🌳</span>
                    在族譜中查看
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-webtrees-ink mb-5">
                  事件時間軸
                </h2>
                <EventTimeline person={safePerson} />
              </div>
            )}

            {activeTab === 'family' && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-webtrees-ink mb-5">
                  家族關係
                </h2>
                <RelationPanel personId={safePerson.id} />
              </div>
            )}

            {activeTab === 'media' && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-webtrees-ink mb-5">
                  相關媒體
                </h2>
                <MediaGallery personId={safePerson.id} />
              </div>
            )}

            {activeTab === 'stories' && (
              <div>
                <h2 className="text-lg font-serif font-semibold text-webtrees-ink mb-5">
                  相關家族故事
                </h2>
                <RelatedStories personId={safePerson.id} />
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
