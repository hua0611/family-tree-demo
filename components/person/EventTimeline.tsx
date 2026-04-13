import type { Person, EventType, LifeEvent } from '@/types/family'
import { getEventsByYear } from '@/lib/family-helpers'

interface EventTimelineProps {
  person: Person
}

const EVENT_META: Record<EventType, { icon: string; label: string; color: string }> = {
  birth: { icon: '🌱', label: '出生', color: 'bg-green-50 border-green-200' },
  death: { icon: '🕊️', label: '辭世', color: 'bg-gray-50 border-gray-200' },
  marriage: { icon: '💍', label: '婚姻', color: 'bg-pink-50 border-pink-200' },
  divorce: { icon: '📃', label: '離婚', color: 'bg-orange-50 border-orange-200' },
  baptism: { icon: '✝️', label: '受洗', color: 'bg-blue-50 border-blue-200' },
  graduation: { icon: '🎓', label: '畢業', color: 'bg-indigo-50 border-indigo-200' },
  immigration: { icon: '✈️', label: '移民', color: 'bg-cyan-50 border-cyan-200' },
  education: { icon: '📚', label: '求學', color: 'bg-violet-50 border-violet-200' },
  career: { icon: '💼', label: '職業', color: 'bg-amber-50 border-amber-200' },
  migration: { icon: '🏠', label: '遷徙', color: 'bg-teal-50 border-teal-200' },
  custom: { icon: '📌', label: '記事', color: 'bg-webtrees-surface border-webtrees-primary/20' },
  other: { icon: '📌', label: '其他', color: 'bg-webtrees-surface border-webtrees-primary/20' },
}

function extractDisplayYear(date: string): string {
  return date.slice(0, 4)
}

interface EventCardProps {
  event: LifeEvent
}

function EventCard({ event }: EventCardProps) {
  const meta = EVENT_META[event.type]
  return (
    <div className={`border rounded-lg p-3 ${meta.color} flex-1`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base leading-none" aria-hidden>
          {meta.icon}
        </span>
        <span className="text-xs font-semibold text-webtrees-muted uppercase tracking-wide">
          {meta.label}
        </span>
        {event.place && (
          <span className="text-xs text-webtrees-muted ml-auto truncate max-w-[120px]">
            📍 {event.place}
          </span>
        )}
      </div>
      {event.description && (
        <p className="text-sm text-webtrees-ink leading-relaxed">{event.description}</p>
      )}
    </div>
  )
}

export function EventTimeline({ person }: EventTimelineProps) {
  const events = getEventsByYear(person)

  if (events.length === 0) {
    return (
      <div className="text-webtrees-muted text-sm py-8 text-center">尚無事件記錄</div>
    )
  }

  return (
    <div className="relative">
      {/* 垂直軸線 */}
      <div className="absolute left-16 top-0 bottom-0 w-px bg-webtrees-primary/20 hidden sm:block" />

      <ol className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* 年份 */}
            <div className="sm:w-32 flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
              <span className="text-sm font-bold text-webtrees-primary font-mono tabular-nums">
                {extractDisplayYear(event.date)}
              </span>
              {/* 軸點 */}
              <div
                className="hidden sm:block w-3 h-3 rounded-full bg-webtrees-primary border-2
                  border-webtrees-surface ring-1 ring-webtrees-primary/40 -mr-1.5"
                aria-hidden
              />
            </div>
            <EventCard event={event} />
          </li>
        ))}
      </ol>
    </div>
  )
}
