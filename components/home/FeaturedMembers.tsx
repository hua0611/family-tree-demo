import Image from 'next/image'
import Link from 'next/link'
import type { Person } from '@/types/family'

interface MemberCardProps {
  person: Person
}

function MemberCard({ person }: MemberCardProps) {
  const yearRange = (() => {
    const birth = person.birthDate?.slice(0, 4) ?? '?'
    if (person.isLiving) return `${birth} – 至今`
    const death = person.deathDate?.slice(0, 4) ?? '?'
    return `${birth} – ${death}`
  })()

  return (
    <Link
      href={`/person/${person.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-webtrees-accent/20 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-webtrees-surface">
        {person.photoUrl ? (
          <Image
            src={person.photoUrl}
            alt={person.fullName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-webtrees-muted/30">
            {person.gender === 'female' ? '👩' : '👨'}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-serif text-base font-bold text-webtrees-ink">{person.fullName}</h3>
        <p className="text-xs text-webtrees-muted">{yearRange}</p>
        {person.tags && person.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {person.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-webtrees-primary/10 px-2 py-0.5 text-xs text-webtrees-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

interface FeaturedMembersProps {
  members: Person[]
}

export function FeaturedMembers({ members }: FeaturedMembersProps) {
  return (
    <section className="bg-webtrees-surface py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-webtrees-ink">家族核心成員</h2>
          <Link
            href="/members"
            className="text-sm font-medium text-webtrees-accent hover:underline"
          >
            查看全部成員 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {members.map((person) => (
            <MemberCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </section>
  )
}
