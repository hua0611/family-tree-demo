import type { MediaItem } from '@/types/family'
import { MediaCard } from './MediaCard'

interface MediaGridProps {
  items: MediaItem[]
  /** Builder for card hrefs; if omitted, cards link to /media/{id} */
  buildHref?: (id: string) => string
}

export function MediaGrid({ items, buildHref }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-webtrees-muted">
        <div className="text-5xl mb-4">📷</div>
        <p className="text-lg font-medium">尚無媒體</p>
        <p className="text-sm mt-1">目前篩選條件下沒有符合的媒體項目</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
      aria-label={`媒體列表，共 ${items.length} 項`}
    >
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          href={buildHref ? buildHref(item.id) : undefined}
        />
      ))}
    </div>
  )
}
