import Link from 'next/link'
import Image from 'next/image'
import type { MediaItem } from '@/types/family'

interface MediaCardProps {
  item: MediaItem
  /** URL to navigate to when the card is clicked (defaults to /media/{id}) */
  href?: string
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

export function MediaCard({ item, href }: MediaCardProps) {
  const imageUrl = item.thumbnailUrl ?? item.url
  const cardHref = href ?? `/media/${item.id}`

  return (
    <Link
      href={cardHref}
      className="group block rounded-lg overflow-hidden border border-webtrees-primary/15
        bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* 縮圖區 */}
      <div className="relative aspect-square overflow-hidden bg-webtrees-primary/10">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* hover overlay */}
        <div
          className="absolute inset-0 bg-webtrees-ink/60 opacity-0 group-hover:opacity-100
            transition-opacity duration-200 flex flex-col justify-end p-3"
        >
          <p className="text-white text-sm font-medium leading-snug line-clamp-2">
            {item.title}
          </p>
          <span
            className={`mt-1 inline-block self-start text-xs px-2 py-0.5 rounded-full font-medium
              ${CATEGORY_COLOR[item.category]}`}
          >
            {CATEGORY_LABEL[item.category]}
          </span>
        </div>
      </div>

      {/* 卡片底部標題 */}
      <div className="px-3 py-2">
        <p className="text-sm text-webtrees-ink font-medium truncate">{item.title}</p>
        {item.date && (
          <p className="text-xs text-webtrees-muted mt-0.5">{item.date.slice(0, 4)}</p>
        )}
      </div>
    </Link>
  )
}
