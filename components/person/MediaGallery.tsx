import Image from 'next/image'
import Link from 'next/link'
import type { PersonId, MediaItem } from '@/types/family'
import { mediaItems } from '@/data/media'

const MAX_ITEMS = 8

interface MediaGalleryProps {
  personId: PersonId
}

const CATEGORY_LABEL: Record<MediaItem['category'], string> = {
  portrait: '肖像',
  family_event: '家族活動',
  location: '地點',
  document: '文件',
  other: '其他',
}

interface MediaCardProps {
  item: MediaItem
}

function MediaCard({ item }: MediaCardProps) {
  const thumbSrc = item.thumbnailUrl ?? item.url

  return (
    <Link
      href={`/media/${item.id}`}
      className="group block rounded-lg overflow-hidden border border-webtrees-primary/15
        hover:border-webtrees-primary/40 transition-colors bg-white"
      title={item.title}
    >
      <div className="aspect-video relative bg-gray-100 overflow-hidden">
        <Image
          src={thumbSrc}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.type === 'document' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-2xl">📄</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-webtrees-ink line-clamp-1">{item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-webtrees-muted">
            {CATEGORY_LABEL[item.category]}
          </span>
          {item.date && (
            <span className="text-xs text-webtrees-muted ml-auto">{item.date.slice(0, 4)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function MediaGallery({ personId }: MediaGalleryProps) {
  const related = mediaItems.filter((m) => m.relatedPersonIds.includes(personId))
  const displayed = related.slice(0, MAX_ITEMS)
  const hasMore = related.length > MAX_ITEMS

  if (related.length === 0) {
    return (
      <p className="text-sm text-webtrees-muted py-8 text-center">此人物尚無相關媒體</p>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayed.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <Link
            href={`/media?person=${personId}`}
            className="text-sm text-webtrees-accent hover:text-webtrees-primary underline underline-offset-2 transition-colors"
          >
            查看全部 {related.length} 個媒體
          </Link>
        </div>
      )}
    </div>
  )
}
