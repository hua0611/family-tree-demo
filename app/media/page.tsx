import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { mediaItems } from '@/data/media'
import { getPerson } from '@/lib/family-helpers'
import type { MediaItem } from '@/types/family'
import { MediaGrid } from '@/components/media/MediaGrid'
import { MediaFilterBar } from '@/components/media/MediaFilterBar'
import { MediaLightbox } from '@/components/media/MediaLightbox'

export const metadata: Metadata = {
  title: '家族相簿 | 林氏族譜',
  description: '瀏覽林家五代的珍貴照片、文件與家族活動紀錄',
}

interface MediaPageProps {
  searchParams: Promise<{
    category?: string
    person?: string
    year?: string
    lightbox?: string
  }>
}

// 從 media date 欄位提取年份字串
function extractYear(date: string | undefined): string | null {
  if (!date) return null
  const match = /^(\d{4})/.exec(date)
  return match?.[1] ?? null
}

// 套用所有篩選條件
function filterMedia(
  items: MediaItem[],
  category: string,
  personId: string,
  year: string
): MediaItem[] {
  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (personId !== 'all' && !item.relatedPersonIds.includes(personId)) return false
    if (year !== 'all' && extractYear(item.date) !== year) return false
    return true
  })
}

/** Build a URLSearchParams string from filter params (no lightbox) */
function buildBaseSearchParams(category: string, personId: string, year: string): string {
  const parts: string[] = []
  if (category !== 'all') parts.push(`category=${encodeURIComponent(category)}`)
  if (personId !== 'all') parts.push(`person=${encodeURIComponent(personId)}`)
  if (year !== 'all') parts.push(`year=${encodeURIComponent(year)}`)
  return parts.join('&')
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams
  const category = params.category ?? 'all'
  const personId = params.person ?? 'all'
  const year = params.year ?? 'all'
  const lightboxId = params.lightbox ?? null

  const filteredItems = filterMedia(mediaItems, category, personId, year)

  // 收集所有出現過的 personIds（有媒體的人物）
  const personIdSet = new Set<string>()
  for (const item of mediaItems) {
    for (const pid of item.relatedPersonIds) {
      personIdSet.add(pid)
    }
  }

  const personsWithMedia = Array.from(personIdSet)
    .map((pid) => getPerson(pid))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'zh-Hant'))

  // 收集所有出現過的年份
  const yearSet = new Set<string>()
  for (const item of mediaItems) {
    const y = extractYear(item.date)
    if (y) yearSet.add(y)
  }
  const availableYears = Array.from(yearSet).sort((a, b) => a.localeCompare(b))

  // Lightbox 狀態：在 filteredItems 中尋找 lightboxId
  const lightboxIndex = lightboxId
    ? filteredItems.findIndex((m) => m.id === lightboxId)
    : -1

  // Build base search params string (without lightbox) for Lightbox URL building
  const baseSearchParams = buildBaseSearchParams(category, personId, year)

  // Build href builder for MediaGrid cards
  function buildCardHref(id: string): string {
    const qs = baseSearchParams ? `${baseSearchParams}&lightbox=${id}` : `lightbox=${id}`
    return `/media?${qs}`
  }

  return (
    <div className="min-h-screen bg-webtrees-surface">
      {/* 頂部導覽列 */}
      <header className="bg-webtrees-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
          <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
            林氏族譜
          </Link>
          <span className="text-white/40 text-sm">/</span>
          <span className="text-sm text-white font-medium">家族相簿</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 頁面標題 */}
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-webtrees-primary">家族相簿</h1>
          <p className="text-webtrees-muted text-sm">
            收錄林家五代的珍貴照片、文件與活動紀錄，共 {mediaItems.length} 項媒體
          </p>
        </div>

        {/* 篩選列（需要 Suspense，因為 MediaFilterBar 使用 useSearchParams） */}
        <Suspense
          fallback={
            <div className="bg-white border border-webtrees-primary/15 rounded-xl p-4 h-32
              animate-pulse" />
          }
        >
          <MediaFilterBar
            totalCount={mediaItems.length}
            filteredCount={filteredItems.length}
            personsWithMedia={personsWithMedia}
            availableYears={availableYears}
            currentCategory={category}
            currentPersonId={personId}
            currentYear={year}
          />
        </Suspense>

        {/* 媒體網格 */}
        <MediaGrid items={filteredItems} buildHref={buildCardHref} />
      </main>

      {/* Lightbox overlay（掛載於 /media?...&lightbox={id}） */}
      {lightboxIndex >= 0 && (
        <MediaLightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          baseSearchParams={baseSearchParams}
        />
      )}
    </div>
  )
}
