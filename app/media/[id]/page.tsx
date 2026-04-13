import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { mediaItems } from '@/data/media'
import { getPerson } from '@/lib/family-helpers'
import type { MediaItem } from '@/types/family'

interface MediaDetailPageProps {
  params: Promise<{ id: string }>
}

const CATEGORY_LABEL: Record<MediaItem['category'], string> = {
  portrait: '人物肖像',
  family_event: '家族活動',
  location: '地點',
  document: '文件',
  other: '其他',
}

const CATEGORY_COLOR: Record<MediaItem['category'], string> = {
  portrait: 'bg-blue-100 text-blue-700',
  family_event: 'bg-green-100 text-green-700',
  location: 'bg-yellow-100 text-yellow-700',
  document: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-600',
}

export async function generateMetadata({ params }: MediaDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const item = mediaItems.find((m) => m.id === id)
  if (!item) return { title: '找不到媒體' }
  return {
    title: `${item.title} | 家族相簿 | 林氏族譜`,
    description: item.description,
  }
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { id } = await params
  const itemIndex = mediaItems.findIndex((m) => m.id === id)

  if (itemIndex === -1) notFound()

  const item = mediaItems[itemIndex]!
  const prevItem = itemIndex > 0 ? mediaItems[itemIndex - 1] : null
  const nextItem = itemIndex < mediaItems.length - 1 ? mediaItems[itemIndex + 1] : null

  // 取得相關人物
  const relatedPersons = item.relatedPersonIds
    .map((pid) => getPerson(pid))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  return (
    <div className="min-h-screen bg-webtrees-surface">
      {/* 頂部導覽列 */}
      <header className="bg-webtrees-primary text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
          <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
            林氏族譜
          </Link>
          <span className="text-white/40 text-sm">/</span>
          <Link
            href="/media"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            家族相簿
          </Link>
          <span className="text-white/40 text-sm">/</span>
          <span className="text-sm text-white font-medium truncate max-w-[200px]">
            {item.title}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 主圖區 */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg">
            <div className="relative w-full aspect-video max-h-[70vh]">
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>

          {/* 上一張 / 下一張 導覽 */}
          <div className="flex items-center justify-between gap-4">
            {prevItem ? (
              <Link
                href={`/media/${prevItem.id}`}
                className="flex items-center gap-2 text-sm text-webtrees-accent
                  hover:text-webtrees-primary transition-colors group"
              >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                <span className="truncate max-w-[200px]">{prevItem.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextItem ? (
              <Link
                href={`/media/${nextItem.id}`}
                className="flex items-center gap-2 text-sm text-webtrees-accent
                  hover:text-webtrees-primary transition-colors group ml-auto"
              >
                <span className="truncate max-w-[200px] text-right">{nextItem.title}</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* 媒體資訊卡 */}
          <div className="bg-white border border-webtrees-primary/15 rounded-xl p-6 shadow-sm space-y-4">
            {/* 標題與分類 */}
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-2xl font-serif font-bold text-webtrees-ink flex-1">
                {item.title}
              </h1>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0
                  ${CATEGORY_COLOR[item.category]}`}
              >
                {CATEGORY_LABEL[item.category]}
              </span>
            </div>

            {/* 日期 */}
            {item.date && (
              <p className="text-webtrees-muted text-sm flex items-center gap-2">
                <span className="text-webtrees-primary">📅</span>
                {item.date}
              </p>
            )}

            {/* 說明 */}
            {item.description && (
              <p className="text-webtrees-ink leading-relaxed">{item.description}</p>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.tags.map((tag) => (
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
          </div>

          {/* 相關人物區塊 */}
          {relatedPersons.length > 0 && (
            <div className="bg-white border border-webtrees-primary/15 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-serif font-semibold text-webtrees-ink mb-4">
                相關人物
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {relatedPersons.map((person) => (
                  <Link
                    key={person.id}
                    href={`/person/${person.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg
                      border border-webtrees-primary/10 hover:border-webtrees-primary/30
                      hover:bg-webtrees-primary/5 transition-colors duration-150 group"
                  >
                    {/* 頭像 */}
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2
                      border-webtrees-primary/20 bg-webtrees-primary/10 flex-shrink-0
                      flex items-center justify-center">
                      {person.photoUrl ? (
                        <Image
                          src={person.photoUrl}
                          alt={person.fullName}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-serif font-bold text-webtrees-primary">
                          {person.surname.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-webtrees-ink text-center
                      group-hover:text-webtrees-primary transition-colors truncate w-full text-center">
                      {person.fullName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 返回按鈕 */}
          <div className="pt-2">
            <Link
              href="/media"
              className="inline-flex items-center gap-2 text-sm text-webtrees-accent
                hover:text-webtrees-primary transition-colors"
            >
              ← 返回家族相簿
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
