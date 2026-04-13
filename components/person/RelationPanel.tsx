import Link from 'next/link'
import Image from 'next/image'
import type { Person, PersonId } from '@/types/family'
import {
  getParents,
  getSpouses,
  getChildren,
  getSiblings,
  formatDateRange,
} from '@/lib/family-helpers'

interface RelationPanelProps {
  personId: PersonId
}

interface PersonMiniCardProps {
  person: Person
}

function PersonMiniCard({ person }: PersonMiniCardProps) {
  const dateRange = formatDateRange(person)

  return (
    <Link
      href={`/person/${person.id}`}
      className="flex items-center gap-3 p-3 rounded-lg border border-webtrees-primary/15
        bg-white hover:bg-webtrees-primary/5 hover:border-webtrees-primary/30
        transition-colors group"
    >
      {/* 縮圖 */}
      {person.photoUrl ? (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-webtrees-primary/20">
          <Image
            src={person.photoUrl}
            alt={person.fullName}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 bg-webtrees-primary/10
            border border-webtrees-primary/20 flex items-center justify-center
            text-base font-serif font-bold text-webtrees-primary select-none"
        >
          {person.surname.charAt(0)}
        </div>
      )}

      {/* 文字 */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-webtrees-ink group-hover:text-webtrees-primary truncate transition-colors">
          {person.fullName}
        </p>
        <p className="text-xs text-webtrees-muted truncate">{dateRange}</p>
      </div>
    </Link>
  )
}

interface RelationGroupProps {
  title: string
  persons: Person[]
}

function RelationGroup({ title, persons }: RelationGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-webtrees-muted uppercase tracking-wide mb-3">
        {title}
      </h3>
      {persons.length === 0 ? (
        <p className="text-sm text-webtrees-muted py-2">—</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {persons.map((p) => (
            <PersonMiniCard key={p.id} person={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export function RelationPanel({ personId }: RelationPanelProps) {
  const parents = getParents(personId)
  const spouses = getSpouses(personId)
  const children = getChildren(personId)
  const siblings = getSiblings(personId)

  return (
    <div className="space-y-8">
      <RelationGroup title="父母" persons={parents} />
      <RelationGroup title="配偶" persons={spouses} />
      <RelationGroup title="子女" persons={children} />
      <RelationGroup title="兄弟姊妹" persons={siblings} />
    </div>
  )
}
