import Image from 'next/image'
import type { Person } from '@/types/family'
import { formatDateRange } from '@/lib/family-helpers'

interface PersonHeaderProps {
  person: Person
}

const GENDER_LABEL: Record<string, string> = {
  male: '男',
  female: '女',
  unknown: '不明',
}

export function PersonHeader({ person }: PersonHeaderProps) {
  const {
    fullName,
    photoUrl,
    surname,
    birthPlace,
    deathPlace,
    isLiving,
    gender,
    tags,
  } = person

  const dateRange = formatDateRange(person)

  return (
    <div className="bg-webtrees-surface border border-webtrees-primary/20 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start">
      {/* 頭像 */}
      <div className="flex-shrink-0">
        {photoUrl ? (
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-webtrees-primary/30">
            <Image
              src={photoUrl}
              alt={fullName}
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div
            className="w-40 h-40 rounded-full border-4 border-webtrees-primary/30
              bg-webtrees-primary/10 flex items-center justify-center
              text-5xl font-serif text-webtrees-primary font-bold select-none"
            aria-label={`${fullName} 頭像`}
          >
            {surname.charAt(0)}
          </div>
        )}
      </div>

      {/* 資訊區 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-serif font-bold text-webtrees-ink">{fullName}</h1>

          {/* 在世狀態 */}
          {isLiving ? (
            <span className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              在世
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
              已故
            </span>
          )}
        </div>

        {/* 生卒 + 地點 */}
        <div className="text-webtrees-muted text-sm mb-3 space-y-1">
          <p className="font-medium text-base text-webtrees-ink">{dateRange}</p>
          {birthPlace && (
            <p>
              <span className="text-webtrees-muted">出生地：</span>
              <span className="text-webtrees-ink">{birthPlace}</span>
            </p>
          )}
          {!isLiving && deathPlace && (
            <p>
              <span className="text-webtrees-muted">逝世地：</span>
              <span className="text-webtrees-ink">{deathPlace}</span>
            </p>
          )}
          <p>
            <span className="text-webtrees-muted">性別：</span>
            <span className="text-webtrees-ink">{GENDER_LABEL[gender] ?? '不明'}</span>
          </p>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
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
    </div>
  )
}
